import React from 'react';
// needs to be imported in order to avoid runtime error
// import regeneratorRuntime from "regenerator-runtime";
// SIP JS
import { Invitation, Registerer, UserAgent, UserAgentOptions } from "sip.js";

const handleOnClickCall = async (jambonz, sip) => {

	const { aor, username, password, server } = sip;

	// SIP Addresses-of-Record URI associated with the user agent.
	const uri = UserAgent.makeURI(aor);

	const userAgentOptions = {
		uri,
		logLevel: "log",
		authorizationPassword: password,
		authorizationUsername: username,
		transportOptions: {
			server: server
		},
		delegate: {
			onInvite: (invitation) => {
				sipInvitation.set(invitation);
				console.log(invitation);
			},
		}
	};

	const userAgent = new UserAgent(userAgentOptions);
	userAgent.start();

	try {
		const response = await fetch(
			`https://api.jambonz.us/v1/Accounts/${jambonz.accountSid}/Calls`,
			{
				method: "POST",
				body: JSON.stringify({
					application_sid: jambonz.applicationSid,
					from: jambonz.fromPhoneNumber,
					to: {
						type: "phone",
						number: jambonz.toPhoneNumber,
					},
				}),
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${jambonz.apiKey}`,
				},
			}
		);

		// Return the SID of the current call for further updates
		const jambonzResponse = await response.json();
		return jambonzResponse.sid
	} catch (error) {
		console.error(error);
	}
};

const handleOnClickEndCall = (props) => {
	const { onDismissFullscreen } = props;
	onDismissFullscreen();
}


const DialVG = (props) => {

	// get info from Cogngiy data
	const { message, isFullscreen, onSetFullscreen, attributes } = props;
	const { data } = message;
	const { _plugin } = data;
	const { sip, jambonz } = _plugin;

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
					onClick={() => {
						onSetFullscreen();
						handleOnClickCall(jambonz, sip);
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
					>Calling...</span>
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
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>1</button>
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>2</button>
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>3</button>
						<br />
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>4</button>
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>5</button>
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>6</button>
						<br />
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>7</button>
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>8</button>
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>9</button>
						<br />
						<button style={{ cursor: 'pointer', margin: '3%', height: '50px', width: '50px', border: '1px solid grey', padding: '15px', borderRadius: '50px', background: 'transparent' }}>0</button>
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
						onClick={() => handleOnClickEndCall(props)}></button>
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