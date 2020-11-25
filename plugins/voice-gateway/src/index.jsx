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
	const { message, onDismissFullscreen } = props;
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
				<IconButton
					id="c2c_button"
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