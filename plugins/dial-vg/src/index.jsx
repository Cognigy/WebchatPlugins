import React from 'react';
// needs to be imported in order to avoid runtime error
// import regeneratorRuntime from "regenerator-runtime";
// SIP JS
import { UserAgent, Inviter } from "sip.js";
import { io } from 'socket.io-client';

const DialVG = (props) => {

	// get info from Cogngiy data
	const { message, isFullscreen, onSetFullscreen, attributes } = props;
	const { data } = message;
	const { _plugin } = data;
	const { sip } = _plugin;

	const [callStatus, setCallStatus] = React.useState('');
	const [sipSession, setSipSession] = React.useState();
	const [sipUser, setSipUser] = React.useState();

	const { aor, username, password, server, socketServer } = sip;

	React.useEffect(() => {
		// SIP Addresses-of-Record URI associated with the user agent.
		const uri = UserAgent.makeURI(aor);

		const userAgentOptions = {
			uri,
			logLevel: "log",
			authorizationPassword: password,
			authorizationUsername: username,
			transportOptions: {
				server: server
			}
		};

		const userAgent = new UserAgent(userAgentOptions);
		setSipUser(userAgent);

		// Initialize Socket connection so service-api for event handling of webhooks
		const jambonzSocket = io(socketServer);

		jambonzSocket.on('call-status', (callStatus) => {
			setCallStatus(callStatus.call_status);
		});
	}, []);

	if (!isFullscreen) {
		return (
			<div style={{
				textAlign: 'center',
			}}>
				<button
					type='button'
					style={{
						padding: '15px',
						borderRadius: '50px',
						border: 'none',
						backgroundColor: 'green',
						color: 'white',
						height: '50px',
						width: '50px',
						cursor: 'pointer'
					}}
					onClick={async () => {
						onSetFullscreen();

						await sipUser.start();
						const target = UserAgent.makeURI("sip:test@cognigy-alexteusz.sip.jambonz.us");

						const inviter = new Inviter(sipUser, target);
						const session = await inviter.invite({
							sessionDescriptionHandlerOptions: {
								constraints: {
									audio: true,
									video: false
								}
							}
						});

						setSipSession(session);
					}}
				></button>
			</div>
		);
	} else {

		return (
			<div
				{...attributes}
				style={{
					...attributes.styles,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between'
				}}>
				<div style={{
					display: 'flex',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<span
						style={{
							fontSize: '200%'
						}}
					>
						{
							callStatus
						}
					</span>
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
										sipSession.dtmf(dtmfOption);
									}}
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
					justifyContent: 'center'
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
						onClick={() => {
							sipSession.reject();
							sipSession.bye();
							onDismissFullscreen();
						}}></button>
				</div>
			</div>
		);
	}
}

const dialVGPlugin = {
	match: 'dial-vg',
	component: DialVG,
	options: {
		fullwidth: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(dialVGPlugin);