import React, { useState, useEffect } from 'react';
// SIP JS
import * as sounds from './sounds';
import events from 'events';
import jssip from 'jssip';
import randomString from 'random-string';

const processedMessages = new Set();

jssip.debug.enable('JsSIP:*');

function randomId(prefix) {
    if (prefix) {
        return `${prefix}-${randomString({ length: 8 })}`;
    } else {
        return randomString({ length: 8 });
    }
}

function normalizeNumber(number) {
    // Don't normalize if a SIP/TEL URI.
    if (/^(sips?|tel):/i.test(number)) {
        return number;
    }
    // Don't normalize if it wanted to be a SIP URI.
    else if (/@/i.test(number)) {
        return number;
    }
    // Otherwise remove spaces and some symbols.
    else {
        return number.replace(/[()\-. ]*/g, '');
    }
}

class SipSession extends events.EventEmitter {
    constructor(rtcSession, options) {
        super();
        this.setMaxListeners(Infinity);

        // Save given onSession handler for received INVITE with Replaces.
        this._onSession = options.onSession;

        // Save given RTCPeerConnection config.
        this._pcConfig = options.pcConfig;

        // Random unique id.
        this._id = randomId();

        // When the call starts.
        this._startTime = new Date();

        // Call status: 'init' / 'ringing' / 'answered' / 'failed' / 'ended'.
        this._status = 'init';

        // Whether this call is the active one.
        this._active = false;

        // End cause.
        this._endInfo = {
            originator: null,
            cause: null,
            description: null,
        };

        // Muted, and local/remote hold status.
        this._muted = false;
        this._localHold = false;
        this._remoteHold = false;

        // JsSIP.RTCSession instance.
        this._rtcSession = rtcSession;

        // Whether attended transfer is being performed.
        this._doingAttendedTransfer = false;

        // Flag indicating that this session is marked for auto merging.
        this._autoMerge = false;

        // Audio element for ringing.
        this._ringAudio = new Audio();
        this._ringAudio.loop = true;

        if (this.isOutgoing()) {
            this._ringAudio.src = sounds.ringing;
            this._ringAudio.volume = 0.25;
        } else {
            this._ringAudio.src = sounds.ringing;
            this._ringAudio.volume = 1.0;
        }

        // Audio element for failed call.
        this._failedAudio = new Audio();
        this._failedAudio.src = sounds.failed;
        this._failedAudio.volume = 0.25;

        // Audio element for answered call.
        this._answeredAudio = new Audio();
        this._answeredAudio.src = sounds.answered;
        this._answeredAudio.volume = 1;

        // Audio element for remote audio.
        this._remoteAudio = new Audio();

        let _attachPCListeners = (pc) => {
            pc.addEventListener('addstream', (event) => {
                let stream = event.stream;

                // If outgoing, pause ringing.
                if (this.isOutgoing()) {
                    this._ringAudio.pause();
                }
                // Play the remote stream.
                this._remoteAudio.srcObject = stream;
                let playPromise = this._remoteAudio.play();
                if (playPromise instanceof Promise) {
                    playPromise
                        .then(() => {
                            console.log('remote audio started');
                        })
                        .catch((err) => {
                            console.log(
                                'remote audio failed to start (probably due to quick answer)'
                            );
                        });
                }
            });

            pc.addEventListener('track', (event) => {
                let track = event.track;
                let stream = new MediaStream();

                stream.addTrack(track);

                // If outgoing, pause ringing.
                if (this.isOutgoing()) {
                    this._ringAudio.pause();
                }
                // Play the remote stream.
                this._remoteAudio.srcObject = stream;
                console.log('playing remote audio');
                this._remoteAudio.play();
            });
        };

        if (this._rtcSession._connection) {
            _attachPCListeners(this._rtcSession._connection);
        } else {
            this._rtcSession.on('peerconnection', (data) => {
                let pc = data.peerconnection;
                _attachPCListeners(pc);
            });
        }

        this._rtcSession.on('progress', () => {
            this._status = 'ringing';
            this.emit('change');

            // Play ringing unless early media.
            // Also, don't play ringing if it's an incoming/outgoing INVITE with
            // Replaces.
            if (this._remoteAudio.paused && !this.replaces) {
                console.log('playing ringing sound');
                this._ringAudio.play();
            }

            this.emit('ringing');
        });

        this._rtcSession.on('accepted', () => {
            this._status = 'answered';
            this.emit('change');

            // Pause ringing and play answered sound.
            this._ringAudio.pause();
            console.log('playing answered sound');
            // this._answeredAudio.play();

            this.emit('answer');
        });

        this._rtcSession.on('failed', (data) => {
            let { originator, cause, message } = data;
            let description;
            let closeDelay = 1500;

            if (message && originator === 'remote' && message.status_code) {
                description = `${message.status_code}`.trim();
            }

            this._endInfo = {
                originator: originator,
                cause: cause,
                description: description,
            };

            this._status = 'failed';
            this.emit('change');

            if (
                originator === 'local' &&
                (cause === jssip.C.causes.CANCELED || cause === jssip.C.causes.REJECTED)
            ) {
                closeDelay = 1000;
            }

            setTimeout(() => this.emit('close'), closeDelay);

            // Pause ringing audio.
            this._ringAudio.pause();
            // If closed by the remote, play failed sound.
            if (originator === 'remote') {
                console.log('playing failed sound');
                this._failedAudio.play();
            }

            this.emit('terminate');
        });

        this._rtcSession.on('ended', (data) => {
            let { originator, cause, message } = data;
            let description;
            let closeDelay = 1500;

            if (message && originator === 'remote' && message.hasHeader('Reason')) {
                let reason = jssip.Grammar.parse(message.getHeader('Reason'), 'Reason');

                if (reason) {
                    description = `${reason.cause}`.trim();
                }
            }

            this._endInfo = {
                originator: originator,
                cause: cause,
                description: description,
            };

            this._status = 'ended';
            this.emit('change');

            if (originator === 'local' && cause === jssip.C.causes.BYE) {
                closeDelay = 1000;
            }

            setTimeout(() => this.emit('close'), closeDelay);

            this.emit('terminate');
        });

        this._rtcSession.on('muted', () => {
            this._muted = true;
            this.emit('change');
        });

        this._rtcSession.on('unmuted', () => {
            this._muted = false;
            this.emit('change');
        });

        this._rtcSession.on('hold', (data) => {
            switch (data.originator) {
                case 'local':
                    this._localHold = true;
                    this.emit('change');
                    break;
                case 'remote':
                    this._remoteHold = true;
                    this.emit('change');
                    break;
                default:
                    break;
            }
        });

        this._rtcSession.on('unhold', (data) => {
            switch (data.originator) {
                case 'local':
                    this._localHold = false;
                    this.emit('change');
                    break;
                case 'remote':
                    this._remoteHold = false;
                    this.emit('change');
                    break;
                default:
                    break;
            }
        });

        this._rtcSession.on('refer', (data) => {
            let { request, accept } = data;

            // Let's always accept incoming REFERs.
            accept(
                (rtcSession) => {
                    // Set the replaces flag into the session so it won't play ringing.
                    if (request.refer_to.uri.hasHeader('replaces')) {
                        rtcSession.data.replaces = true;
                    }

                    this._onSession(rtcSession);
                },
                {
                    mediaConstraints: { audio: true, video: false },
                    pcConfig: this._pcConfig,
                }
            );
        });

        this._rtcSession.on('replaces', (data) => {
            let { accept } = data;

            accept((rtcSession) => {
                // Set the replaces flag into the session so it won't ring.
                rtcSession.data.replaces = true;

                this._onSession(rtcSession);

                // Auto-answer (unless already answered).
                if (!rtcSession.isEstablished()) {
                    rtcSession.answer({
                        mediaConstraints: { audio: true, video: false },
                        pcConfig: this._pcConfig,
                    });
                }
            });
        });

        let candidateTypes = {
            host: 0,
            srflx: 0,
            relay: 0,
        };

        this._rtcSession.on('icecandidate', (evt) => {
            // only care about srflx candidates right now
            // get the host
            let type = evt.candidate.candidate.split(' ');
            candidateTypes[type[7]]++;
            if (candidateTypes['srflx'] >= 1 || candidateTypes['relay'] >= 1) {
                evt.ready();
            }
        });
    }

    get jssipRtcSession() {
        return this._rtcSession;
    }

    get id() {
        return this._id;
    }

    get direction() {
        return this.isOutgoing() ? 'out' : 'in';
    }

    get number() {
        return this._rtcSession.remote_identity.uri.user;
    }

    get originalNumber() {
        return this._rtcSession.data.originalNumber || this.number;
    }

    get status() {
        return this._status;
    }

    get disposition() {
        let causes = jssip.C.causes;
        let cause = this._endInfo.cause;

        switch (this._status) {
            case 'failed': {
                switch (cause) {
                    case causes.CANCELED:
                    case causes.NO_ANSWER:
                    case causes.EXPIRES:
                        return 'missed';
                    default:
                        return 'rejected';
                }
            }

            case 'ended': {
                return 'answered';
            }

            default:
                throw new Error('cannot get call disposition while not terminated');
        }
    }

    get answered() {
        return this._status === 'answered';
    }

    get terminated() {
        return this._status === 'failed' || this._status === 'ended';
    }

    get endInfo() {
        return this._endInfo;
    }

    get active() {
        return this._active;
    }

    get startTime() {
        return this._startTime;
    }

    get answerTime() {
        return this._rtcSession.start_time;
    }

    get duration() {
        if (!this.answerTime) {
            return 0;
        }

        let now = new Date();

        return Math.floor((now - this.answerTime) / 1000);
    }

    get muted() {
        return this._muted;
    }

    get localHold() {
        return this._localHold;
    }

    get remoteHold() {
        return this._remoteHold;
    }

    get autoMerge() {
        return this._autoMerge;
    }

    set autoMerge(flag) {
        if (this._autoMerge === flag) {
            return;
        }

        this._autoMerge = flag;
        this.emit('change');
    }

    get doingAttendedTransfer() {
        return this._doingAttendedTransfer;
    }

    get replaces() {
        return Boolean(this._rtcSession.data.replaces);
    }

    isOutgoing() {
        return this._rtcSession.direction === 'outgoing';
    }

    isIncoming() {
        return this._rtcSession.direction === 'incoming';
    }

    setActive(flag) {
        let wasActive = this._active;

        this._active = flag;

        if (this._rtcSession.isEstablished()) {
            if (this.replaces) {
                return;
            }

            if (this._active) {
                this.unhold();
            } else {
                this.hold();
            }
        }

        if (this._active && !wasActive) {
            this.emit('active');
        }
    }

    answer() {
        this._rtcSession.answer({
            mediaConstraints: { audio: true, video: false },
            pcConfig: this._pcConfig,
        });

        // NOTE: Hack. The JsSIP.RTCSession.isEstablished() return true after
        // answer(), but the 'accepted' event takes a bit to fire (getUserMedia)
        // so let's hardcode it.
        if (this._rtcSession.isEstablished()) {
            this._status = 'answered';
        }
    }

    terminate(sipCode, sipReason) {
        this._rtcSession.terminate({
            status_code: sipCode,
            reason_phrase: sipReason,
        });
    }

    mute() {
        console.log('muting');
        this._rtcSession.mute({ audio: true, video: true });
    }

    unmute() {
        console.log('unmuting');
        this._rtcSession.unmute({ audio: true, video: true });
    }

    hold() {
        this._rtcSession.hold();
    }

    unhold() {
        this._rtcSession.unhold();
    }

    sendDtmf(tone) {
        this._rtcSession.sendDTMF(tone);
    }

    attendedTransfer(sipSession) {
        let referSubscriber = this._rtcSession.refer(sipSession.number, {
            replaces: sipSession.jssipRtcSession,
        });

        this._doingAttendedTransfer = true;
        this.emit('change');

        referSubscriber.on('requestFailed', () => {
            this._doingAttendedTransfer = false;
            this.emit('change');
        });

        referSubscriber.on('accepted', () => {
            console.log('attendedTransfer() succeeded, terminating this session');

            this._doingAttendedTransfer = false;
            this.terminate();
        });

        referSubscriber.on('failed', () => {
            this._doingAttendedTransfer = false;
            this.emit('change');
        });
    }
}

class SipClient extends events.EventEmitter {
    constructor(client, settings) {
        super();

        this._pcConfig = settings.pcConfig;

        console.log({ client, settings }, 'creating a sip client');
        const socket = new jssip.WebSocketInterface(settings.wsUri);
        const uri = `sip:${client.fullUsername}`;
        this._ua = new jssip.UA({
            uri,
            password: client.password,
            display_name: client.name,
            sockets: [socket],
            register: true,
        });

        [
            'connecting',
            'connected',
            'disconnected',
            'registered',
            'unregistered',
            'registrationFailed',
        ].forEach((evtName) =>
            this._ua.on(evtName, (data) => this.emit(evtName, { ...data, client }))
        );

        /*
        this._ua.on('disconnected', (data) => {
            let error = Boolean(data && data.error);

            this.emit('disconnected', error, data);
        });
        */

        this._ua.on('newRTCSession', (data) => {
            let rtcSession = data.session;

            this._onSession(rtcSession);
        });
    }

    start() {
        console.log('start()');
        this._ua.start();
    }

    stop() {
        console.log('stop()');
        this._ua.stop();
    }

    call(number) {
        console.log(`call() [number: ${number}]`);

        let normalizedNumber = normalizeNumber(number);

        this._ua.call(normalizedNumber, {
            data: {
                originalNumber: number,
            },
            mediaConstraints: { audio: true, video: false },
            pcConfig: this._pcConfig,
        });
    }

    _onSession(rtcSession) {
        let session = new SipSession(rtcSession, {
            pcConfig: this._pcConfig,
            onSession: this._onSession.bind(this),
        });

        this.emit('session', session);
    }
}

const DialTime = () => {

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setTimeout(() => setSeconds(seconds + 1), 1000);
    }, [seconds]);

    return (
        <span
            style={{
                color: 'grey'
            }}
        >{seconds}s</span>
    );
}

const DialVG = (props) => {

    // get info from Cogngiy data
    const { message, attributes, onSendMessage, isFullscreen } = props;
    const { data } = message;
    const { _plugin } = data;
    const { sip, targetDisplayName, callEndedMessage } = _plugin;
    const { fullUsername, password, server, target } = sip;

    // The top text that displays DTMF or a phone number
    const [displayText, setDisplayText] = useState('');

    // The SIP softphone user agent
    const [userAgent, setUserAgent] = useState();
    // The SIP session
    const [session, setSession] = useState();

    const [activeClient, setActiveClient] = useState();
    const [activeCalls, setActiveCalls] = useState([]);


    const startPlugin = () => {

        /* event handlers for a sip session */
        function AddSipSessionEventHandlers(ua, session) {
            session.on('ringing', () => {
                console.log({ activeCalls }, `session ${session.id} ringing`);
                setDisplayText('Ringing');
            });
            session.on('answer', () => {
                console.log({ activeCalls }, `session ${session.id} answered`);
                session.setActive(true);
                setDisplayText(targetDisplayName || 'Support');
            });
            session.on('terminate', () => {
                console.log(
                    { activeCalls },
                    `session ${session.id} terminated; status ${session.status}`
                );
                setActiveCalls((prevCalls) => prevCalls.filter((c) => c.id !== session.id));
            });

            session.on('change', () => {
                console.log(
                    `got change event for session ${session.id}, resetting active calls`,
                    { session }
                );
                setActiveCalls((prevCalls) => [...prevCalls]);
            });
        }

        /* event handlers for our sip ua */
        function addUAEventListeners(ua) {
            ua.on('connected', ({ client }) => {
                console.log({ client }, 'connected');

                userAgent.call(target);
            });
            ua.on('disconnected', ({ client }) => {
                console.log({ client }, 'disconnected');
            });
            ua.on('registered', ({ client }) => {
                console.log({ client }, 'registered');
                client.registered = true;
                setActiveClient(client);
            });
            ua.on('unregistered', ({ client }) => {
                console.log({ client }, 'unregistered');
                client.registered = false;
                setActiveClient(client);
            });
            ua.on('registrationFailed', ({ response, client }) => {
                console.log(
                    { client },
                    `unregistered: registration failed with status ${response.status_code}`
                );
                client.registered = false;
                setActiveClient(client);
            });
            ua.on('session', (session) => {
                console.log({ session }, 'got a new session');
                setActiveCalls((prevCalls) => [...prevCalls, session]);
                AddSipSessionEventHandlers(ua, session);

                setSession(session);
            });
        }

        const userAgent = new SipClient({
            fullUsername,
            password,
            name: "Cognigy"
        }, {
            wsUri: server
        });

        userAgent.start();

        addUAEventListeners(userAgent);

        setUserAgent(userAgent);
    }

    // Only execute the plugin once
    if (!processedMessages.has(message.traceId)) {
        if (message.data?._plugin?.type === 'dial-vg') {
            processedMessages.add(message.traceId);
            startPlugin();
        }
    }

    if (!isFullscreen) {
        return (
            <div
                {...attributes}
            >
                {callEndedMessage}
            </div>
        );
    }

    return (
        <div
            {...attributes}
            style={{
                ...attributes.styles,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
            <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <span
                    style={{
                        fontSize: '200%'
                    }}
                >
                    {displayText}
                </span>
                <br />
                {
                    session !== undefined && session.answered
                        ?
                        <DialTime />
                        :
                        null
                }
            </div>
            <div style={{
                flex: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    width: '60%'
                }}>
                    {
                        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(dtmfOption => (
                            <button
                                style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}
                                onClick={() => {

                                    console.log(displayText)
                                    if (session !== undefined) {
                                        // Add dtmf options until user clicks #
                                        if (displayText === targetDisplayName) {
                                            setDisplayText('');
                                            setDisplayText(dtmfOption);
                                        } else {
                                            if (dtmfOption !== '#') {
                                                setDisplayText(displayText + dtmfOption);
                                            } else if (dtmfOption === '#') {
                                                session.sendDtmf(displayText);
                                                setDisplayText(targetDisplayName);
                                            }
                                        }
                                    }
                                }}
                                disabled={!userAgent}
                            >
                                {dtmfOption}
                            </button>
                        ))
                    }
                </div>
            </div>
            <div style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '40%'
            }}>
                <button
                    style={{
                        padding: '15px',
                        borderRadius: '50px',
                        border: 'none',
                        backgroundColor: 'red',
                        color: 'white',
                        height: '50px',
                        width: '50px',
                        cursor: 'pointer'
                    }}
                    disabled={!userAgent || !session}
                    onClick={() => {
                        session.terminate();
                        onSendMessage('', {
                            callEnded: true
                        });
                    }}>
                    {/* Insert HangUp Icon here */}
                </button>
                {
                    session !== undefined
                        ?
                        <button
                            style={{
                                padding: '15px',
                                borderRadius: '50px',
                                border: '1px solid grey',
                                backgroundColor: session.muted ? 'grey' : 'transparent',
                                color: session.muted ? 'white' : 'black',
                                height: '50px',
                                width: '50px',
                                cursor: 'pointer'
                            }}
                            disabled={!userAgent || !session}
                            onClick={() => {
                                if (session.muted) {
                                    console.log("clicked unmute button")
                                    session.unmute();
                                } else {
                                    session.mute();
                                }
                            }}>
                            {/* {
                                session !== undefined && session.muted
                                    ?
                                    // <MicIcon />
                                    null
                                    :
                                    session !== undefined && !session.muted
                                        ?
                                        // <MicOffIcon />
                                        null
                                        :
                                        null
                            } */}
                        </button>
                        :
                        null
                }
            </div>
        </div>
    );
}

const dialVGPlugin = {
    match: 'dial-vg',
    component: DialVG,
    options: {
        fullscreen: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(dialVGPlugin);