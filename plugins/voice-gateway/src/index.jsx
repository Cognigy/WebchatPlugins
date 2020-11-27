import * as React from 'react';
import { IconButton, Typography } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
	rootDiv: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	callNumber: {
		marginTop: '15%',
		flex: 5
	},
	buttonDiv: {
		flex: 1,
		marginBottom: '5%'
	},
	callButton: activeCall => ({
		backgroundColor: activeCall ? 'rgb(255,59,48)' : 'rgb(52,199,89)',
		'&:hover': {
			backgroundColor: activeCall ? 'rgb(255,69,58)' : 'rgb(48,209,88)'
		},
		color: 'white'
	}),
	closeButtonDiv: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		paddingRight: '3%',
		paddingTop: '2%'
	}
})

const VoiceGateway = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage, isFullscreen, onSetFullsceen } = props;
	const { data } = message;
	const { _plugin } = data;
	const { number, name } = _plugin;

	if (!name) {
		name = 'Anonymous';
	}

	// States
	const [activeCall, setActiveCall] = React.useState(false);

	// get styles
	const classes = useStyles(activeCall);

	React.useEffect(() => {
		c2c_phone.setAcLogger(c2c_ac_log);
		c2c_phone.setJsSipLogger(c2c_js_log);
		c2c_ac_log('------ Date: %s -------', new Date().toDateString());
		c2c_ac_log('Browser: ' + c2c_phone.getBrowserName() + ' Internal name: ' + c2c_phone.getBrowser());
		c2c_ac_log('SIP: %s', JsSIP.C.USER_AGENT);
		c2c_ac_log('AudioCodes API: %s', c2c_phone.version());


		// Check WebRTC support    
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			c2c_info('No WebRTC');
			c2c_disableWidget('WebRTC API is not supported in this browser !');
			return;
		}

		if (location.protocol !== 'https:' && location.protocol !== 'file:') {
			c2c_ac_log('Warning: for the URL used "' + location.protocol + '" protocol');
		}

		// Gui initialization
		window.addEventListener('beforeunload', c2c_onBeforeUnload);
		// c2c_setButtonForCall();

		// Prepare audio player
		c2c_audioPlayer.init(c2c_ac_log);

		c2c_audioPlayer.generateTonesSuite(c2c_soundConfig.generateTones)
			.then(() => {
				c2c_ac_log('audioPlayer: tones are generated');
			})
			.catch(e => {
				c2c_ac_log('audioPlayer: error during tone generation', e);
			});

		// Restore call after page reload
		let data = localStorage.getItem('c2c_restoreCall');
		if (data !== null) {
			localStorage.removeItem('c2c_restoreCall');

			c2c_restoreCall = JSON.parse(data);
			let delay = Math.ceil(Math.abs(c2c_restoreCall.time - new Date().getTime()) / 1000);
			if (delay > c2c_config.c2c_restoreCallMaxDelay) {
				c2c_ac_log('No restore call, delay is too long (' + delay + ' seconds)');
				c2c_restoreCall = null;
			} else {
				c2c_ac_log('Trying to restore call', c2c_restoreCall);
				c2c_call();
			}
		}
	}, []);

	// Connect to SBC server, don't send REGISTER, send INVITE.
	function c2c_initSIP(account) {
		// restore previosly connected SBC after page reloading.
		if (c2c_restoreCall !== null) {
			let ix = c2c_searchServerAddress(c2c_serverConfig.addresses, c2c_restoreCall.address);
			if (ix !== -1) {
				c2c_ac_log('Page reloading, raise priority of previously connected server: "' + c2c_restoreCall.address + '"');
				c2c_serverConfig.addresses[ix] = [c2c_restoreCall.address, 1000];
			} else {
				c2c_ac_log('Cannot find previously connected server: ' + c2c_restoreCall.address + ' in configuration');
			}
		}
		c2c_phone.setServerConfig(c2c_serverConfig.addresses, c2c_serverConfig.domain, c2c_serverConfig.iceServers);
		c2c_phone.setAccount(account.user, account.displayName, account.password);
		c2c_phone.setWebSocketKeepAlive(c2c_config.keepAlivePing, c2c_config.keepAlivePong, c2c_config.keepAliveStats, c2c_config.keepAliveDist);

		// Set c2c_phone API listeners
		c2c_phone.setListeners({
			loginStateChanged: function (isLogin, cause) {
				switch (cause) {
					case 'connected':
						c2c_ac_log('phone>>> loginStateChanged: connected');
						if (c2c_activeCall !== null) {
							c2c_ac_log('phone: active call exists (SBC might have switched over to secondary)');
							break;
						}
						if (c2c_restoreCall !== null) {
							c2c_ac_log('send INVITE with Replaces to restore call');
							c2c_makeCall(c2c_restoreCall.callTo,
								c2c_restoreCall.video === 'sendrecv' || c2c_restoreCall.video === 'sendonly' ? c2c_phone.VIDEO : c2c_phone.AUDIO
								, ['Replaces: ' + c2c_restoreCall.replaces]);
						} else {
							c2c_makeCall(c2c_config.call, c2c_config.type === 'video' ? c2c_phone.VIDEO : c2c_phone.AUDIO);
						}
						break;

					case 'disconnected':
						c2c_ac_log('phone>>> loginStateChanged: disconnected');
						if (c2c_phone.isInitialized()) { // after deinit() c2c_phone will disconnect SBC.
							if (c2c_sbcDisconnectCounter++ >= c2c_sbcDisconnectCounterMax) {
								c2c_ac_log('phone: SBC connection failed !');
								// c2c_info('SBC connection is failed', true);
								c2c_phone.deinit();
								setActiveCall(false);
							}
						}
						break;

					case 'login failed':
						c2c_ac_log('phone>>> loginStateChanged: login failed');
						break;

					case 'login':
						c2c_ac_log('phone>>> loginStateChanged: login');
						break;

					case 'logout':
						c2c_ac_log('phone>>> loginStateChanged: logout');
						break;
				}
			},

			outgoingCallProgress: function (call, response) {
				c2c_ac_log('phone>>> outgoing call progress');
				c2c_setButtonForHangup(false);
				// c2c_info('Ringing', true);
				c2c_audioPlayer.play(c2c_soundConfig.play.outgoingCallProgress);
			},

			callTerminated: function (call, message, cause, redirectTo) {
				c2c_ac_log('phone>>> call terminated callback, cause=%o', cause);
				c2c_activeCall = null;
				if (cause === 'Redirected') {
					c2c_ac_log('Redirect call to %s', redirectTo);
					c2c_makeCall(redirectTo, c2c_config.type === 'video' ? c2c_phone.VIDEO : c2c_phone.AUDIO);
					return;
				}

				c2c_info(cause, true);
				c2c_audioPlayer.stop();
				if (call.isOutgoing() && !call.wasAccepted()) {
					// Busy tone.
					c2c_audioPlayer.play(c2c_soundConfig.play.busy);
				} else {
					// Disconnect tone.
					c2c_audioPlayer.play(c2c_soundConfig.play.disconnect);
				}
				c2c_phone.deinit();
				c2c_setButtonForStopCalling();
				c2c_setButtonForCall();
				c2c_setCallOpen(false);

				// Hide black rectangle after video call
				document.getElementById('c2c_remote_video').style.display = 'none';
				c2c_restoreCall = null;
			},

			callConfirmed: function (call, message, cause) {
				c2c_ac_log('phone>>> callConfirmed');
				c2c_setButtonForStopCalling();
				c2c_setButtonForHangup();
				c2c_setCallOpen(true);
				c2c_info('Call is established', true);

				if (c2c_restoreCall !== null && c2c_restoreCall.hold.includes('remote')) {
					c2c_ac_log('Restore remote hold');
					c2c_info('Hold');
					c2c_activeCall.setRemoteHoldState();
				}

				// display remote video element if need.
				if (c2c_activeCall.hasReceiveVideo()) {
					let video = document.getElementById('c2c_remote_video');
					video.style.display = 'block';
					video.style.width = c2c_config.videoSize.width;
					video.style.height = c2c_config.videoSize.height;
				}
			},

			callShowStreams: function (call, localStream, remoteStream) {
				c2c_ac_log('phone>>> callShowStreams');
				c2c_audioPlayer.stop();
				let remoteVideo = document.getElementById('c2c_remote_video');
				remoteVideo.srcObject = remoteStream;
			},

			incomingCall: function (call, invite) {
				c2c_ac_log('phone>>> incomingCall');
				call.reject();
			},

			callHoldStateChanged: function (call, isHold, isRemote) {
				c2c_ac_log('phone>>> callHoldStateChanged');
				if (call.isRemoteHold()) {
					c2c_info('Hold');
				} else {
					c2c_info('Unhold', true);
				}
			},

			callIncomingReinvite: function (call, start, request) {
				if (start)
					return;
				// display remote video element if need.
				let video = document.getElementById('c2c_remote_video');
				if (c2c_activeCall.hasReceiveVideo()) {
					video.style.display = 'block';
					video.style.width = c2c_config.videoSize.width;
					video.style.height = c2c_config.videoSize.height;
				} else {
					video.style.display = 'none';
				}
			}
		});

		c2c_sbcDisconnectCounter = 0;

		// Other side cannot switch audio call to video (for audio call)
		c2c_phone.setEnableAddVideo(c2c_config.type === 'video');
		c2c_phone.init(false);
	}


	const handleCall = () => {

		// c2c_info('Connecting', true);
		c2c_audioPlayer.stop();
		// c2c_setButtonForCalling();
		c2c_enableSound()
			.then(() => {
				return c2c_phone.checkAvailableDevices();
			})
			.then(() => {

				c2c_initSIP({ user: c2c_config.caller, displayName: c2c_config.callerDN, password: '' });

				// start the call
				setActiveCall(true);

			})
			.catch((e) => {
				c2c_ac_log('Check available devices error:', e);
				// c2c_info(e, true);
				// c2c_setButtonForCall();
				// end the call
				setActiveCall(false);
			});
	}

	const handleHangup = () => {

		// Check if user wants to hangup
		if (activeCall) {
			c2c_enableSound();
			if (c2c_activeCall !== null) {
				c2c_activeCall.terminate();
				c2c_activeCall = null;
			}

			// end the call
			setActiveCall(false);
		}
	}

	if (!isFullscreen) {
		return <div><CallEndIcon /></div>
	}

	return (
		<div
			className={classes.rootDiv}
		>
			<div
				className={classes.closeButtonDiv}
			>
				<IconButton
					onClick={() => onSendMessage('', {
						"voiceGateway": "call ended"
					})}
				>
					<CloseIcon />
				</IconButton>
			</div>

			<Typography variant='h4' className={classes.callNumber}>
				{
					name !== 'Anonymous' ? name : number
				}
			</Typography>
			<div
				className={classes.buttonDiv}
				// id="c2c_div"
			>
				<IconButton
					// id="c2c_button"
					className={classes.callButton}
					onClick={activeCall ? handleHangup : handleCall}
				>
					{
						activeCall
							?
							<CallEndIcon />
							:
							<CallIcon />
					}
				</IconButton>
				<span id="c2c_span_message"></span>
			</div>
		</div>

	)

}



const voicegatewayPlugin = {
	match: 'voice-gateway',
	component: VoiceGateway,
	options: {
		fullscreen: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(voicegatewayPlugin);