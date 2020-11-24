import * as React from 'react';
import { IconButton, Typography } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';

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
	})
})

const VoiceGateway = (props) => {

	// get info from Cogngiy data
	const { message } = props;
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

	/**
	 * Audiocodes config
	 */
	let c2c_serverConfig = {
		domain: 'examples.com',                // AudioCodes SBC domain name, used to build SIP headers From/To
		addresses: ['wss://examples.com'],    // AudioCodes SBC secure web socket address (can be multiple)
		iceServers: ['74.125.140.127:19302', '74.125.143.127:19302']                        // Addresses for STUN servers. Can be empty
	};

	let c2c_config = {
		call: number, // Call to this user name (or phone number).
		caller: name, // Caller user name (One word according SIP RFC 3261). 
		callerDN: 'Anonymous', // Caller display name (words sequence).
		type: 'audio',         // 'audio' or 'video'
		videoSize: { width: '320px', height: '240px' }, // video size (for video call) 
		// also can be used default {width: '', height: ''}
		messageDisplayTime: 5, // A message will be displayed during this time (seconds).
		restoreCallMaxDelay: 20, // After page reloading, call can be restored within the time interval (seconds).

		keepAlivePing: 15,        // To detect websocket disconnection and and keep alive NAT connection, send CRLF ping interval (seconds) 
		keepAlivePong: 15,        // Wait pong response interval (seconds)
		keepAliveStats: 60,       // Each n pongs print to console log min and max pong delay
		keepAliveDist: false      // Print to console log also pong distribution.
	};

	let c2c_soundConfig = {
		generateTones: {
			// Phone ringing, busy and other tones vary in different countries.
			// Please see: https://www.itu.int/ITU-T/inr/forms/files/tones-0203.pdf
			ringingTone: [{ f: 400, t: 1.5 }, { t: 3.5 }],
			busyTone: [{ f: 400, t: 0.5 }, { t: 0.5 }],
			disconnectTone: [{ f: 400, t: 0.5 }, { t: 0.5 }],
		},
		play: {
			outgoingCallProgress: { name: 'ringingTone', loop: true, volume: 0.2 },
			busy: { name: 'busyTone', volume: 0.2, repeat: 4 },
			disconnect: { name: 'disconnectTone', volume: 0.2, repeat: 3 },
		},
	};

	document.addEventListener("DOMContentLoaded", function (event) {
		c2c_init();
	});

	const call = () => {
		setActiveCall(!activeCall);
	}

	return (
		<div
			className={classes.rootDiv}
		>
			<Typography variant='h4' className={classes.callNumber}>
				{
					name !== 'Anonymous' ? name : number
				}
			</Typography>
			<div
				className={classes.buttonDiv}
				id="c2c_div"
			>
				{/* <script src="./js/adapter-latest.js"></script> */}
				<script src="./js/ac_webrtc.min.js"></script>
				<script src="./js/audio_player.js"></script>
				<script src="./js/c2c.js"></script>

				<IconButton
					id="c2c_button"
					className={classes.callButton}
					onClick={call}
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