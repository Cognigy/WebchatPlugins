import React from 'react';
// needs to be imported in order to avoid runtime error
// import regeneratorRuntime from "regenerator-runtime";
// SIP JS
import { UserAgent, Inviter } from "sip.js";

const DialVG = (props) => {

	// get info from Cogngiy data
	const { message, attributes } = props;
	const { data } = message;
	const { _plugin } = data;
	const { sip } = _plugin;
	const { aor, username, password, server, target } = sip;

	const [callStatus, setCallStatus] = React.useState('Calling');
	const [sipSession, setSipSession] = React.useState();

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

		userAgent.start().then(async () => {
			const targetUri = UserAgent.makeURI(target);

			const inviter = new Inviter(userAgent, targetUri);
			inviter.invite({
				sessionDescriptionHandlerOptions: {
					constraints: {
						audio: true,
						video: false
					}
				}
			}).then((session) => {
				setCallStatus("Cognigy Support");
				setSipSession(session);
			});
		});

	}, []);

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
					{callStatus}
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
									if (sipSession !== undefined) {
										sipSession.info({
											requestOptions: {
												body: {
													contentDisposition: "render",
													contentType: "application/dtmf-relay",
													content: `Signal=${dtmfOption}\r\nDuration=1000`
												}
											}
										});
									}

								}}
								disabled={!sipSession}
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
			<audio id="audio" autoplay></audio>
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