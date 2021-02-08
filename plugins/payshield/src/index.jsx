import React, { useEffect } from 'react';

// import './styles.css';

function opretty(o) { return JSON.stringify(o, null, 4) }
function LOG(...args) {
	console.log('Cognigy payshield plugin:',
		args.map(o => typeof o === 'object' ? JSON.stringify(o) : o).join(' '));
}


const PayshieldPayment = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage } = props;
	const _plugin = message.data._plugin;
	const { scriptUrl, paymentConfigurationID } = _plugin;
	if (!paymentConfigurationID) {
		// Complain once only, via React useEffect:
		useEffect(() => {
			console.error('payshield plugin: config must include paymentConfigurationID to carry out a transaction.');
			onSendMessage('', {
				payshield: {
					ERROR: '_plugin trigger config must include gatewayRefId or gatewayRefValue.'
				}
			});
		}, []);
	}

	// Setup Payshield, once, after render:
	useEffect(setupPayshield, []);


	// Event hooks which will be called from Payshield library on events:
	function focusChanged(event) {
		handlePayshieldEvent('focus', event);
	}
	function validationResponse(event) {
		handlePayshieldEvent('validation', event);
	}
	function requestInitiated(event) {
		handlePayshieldEvent('request', event);
	}
	function responseReceived(event) {
		handlePayshieldEvent('response', event);
	}

	function handlePayshieldEvent(label, event) {
		LOG(`Payshield ${label} event:`, event);
		const payload = { payshield: event || {} };
		// Not all events give us an event_type:
		if (!payload.payshield.event_type) payload.payshield.event_type = label;
		onSendMessage('', payload);
	}

	/** Styling used by Payshield 'hosted fields' - This styling is essentially passed into the iframed fields, I believe: */
	const inputStyle = {
		input: {
			"font-size": "16px",
			"font-weight": "400",
			"font-family": "sans-serif",
		},
	};

	/** Config object passed into Payshield initialisation: */
	const payshieldConfig = {
		// payment_configuration_id: "127693bf-8c8d-4779-a1c6-5ed165cf7910",
		payment_configuration_id: paymentConfigurationID,
		instance: {
			name: "test_configuration",
		},
		callbacks: {
			focus: focusChanged,
			request: requestInitiated,
			response: responseReceived,
			validation: validationResponse,
		},
		form: {
			id: "payment-form",
		},
		fields: {
			amount: {
				// value: "100",
				id: "amount",
				style: inputStyle,
			},
			card: {
				id: "cc-number",
				style: inputStyle,
			},
			expiry: {
				id: "cc-expiration",
				style: inputStyle,
			},
			cvv: {
				id: "cc-cvv",
				style: inputStyle,
			},
			cardholdername: {
				id: "cc-name",
				required: false,
				style: inputStyle,
			},
			// Optional Customer Reference form field:
			customer_reference_1: {
				value: "TEST01",
			},
		},
	}

	/** Called once after first render, via React useEffect(): */
	function setupPayshield() {

		console.warn("Setting up Payshield...");

		// Load script (asynchronously?)

		var script = document.createElement('script');
		// script.src = 'https://5b1c52032f.i.payshield.com.au/hf/1/hosted.js';
		script.src = scriptUrl;
		script.async = false;
		// Initialise payshieldHostedFields once script loaded:
		script.onload = () => payshieldHostedFields(payshieldConfig);
		document.body.appendChild(script);

	}

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			padding: "2% 2% 0 2%",
			color: "black",
			background: "#ffeeee",
			border: "1px solid #ced4da",
			borderRadius: "0.25rem",
			marginLeft: 32,
			marginRight: 32,
			justifyContent: "space-around"
		}}>

			{/* Styling below, as supplied by Payshield, uses Bootstrap. Load it: */}
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
				integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous" />

			{/*
			The 'dangerouslySetInnerHTML' below is a nasty work-around to force the default Payshield style into the page:
			Adjusting the font size here DOES change the size of the box, but the actual display font is controlled by 'style' fields
			as passed into payshieldHostedFields() above.

			The original suggested style in the doco is as follows:
			div.payshield-field {
				height: calc( 1.5em + 0.75rem + 2px );
				box-sizing: border-box;
				width: 100%;
				padding: 0.375rem 0.75rem;
				display: block;
				font-weight: 400;
				font-size: 14px;
				border: 1px solid #ced4da;
				border-radius: 0.25rem;
				line-height: 1.5;
				background-color: #fff;
				background-clip: padding-box;
				margin-bottom: 12px;
				background: #fff;
				background-size: 200% 100%;
				background-position: right bottom;
				transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
			}
			Note that below in the style "all: initial" is used to disconnect the Payshield 'hosted fields' containers from any other
			 parent styling, which seems to be required to ensure all the fields display correctly:

			*/}
			<style dangerouslySetInnerHTML={{
				__html: `
* [class^='payshield-field'] {
	all: initial;
	height: 25pt;
	box-sizing: border-box;
	width: 100%;
	padding: 0.375rem 0.75rem;
	display: block;
	font-size: 16px;
	font-family: sans-serif;
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
	line-height: 1.5;
	background-color: #fff;
	background-clip: padding-box;
	margin-bottom: 3px;
	background: #fff;
	background-size: 200% 100%;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
label {
	margin-bottom: 0;
}
    `}} />

			<form id="payment-form" novalidate >

				<div class="row" >
					<div class="col-sm-6 offset-sm-1 mb-1 mt-1" >
						<label for="amount" class="payshield-label">Amount</label>
						{/*
							For some reason, this one field 'amount' has to be an input, not a div,
							thus the duplicated style above. It's still not visually/bahaviourly identical to
							other fields though, which is a pain. Have asked Payshield to be more consistent:
						*/}
						<input id="amount" class="payshield-field custom-payshield-field" placeholder="" autocomplete="off" />
						{/* <div id="cc-number-invalid" class="invalid-feedback" >Valid credit card number is required</div> */}
					</div>
				</div>

				<div class="row" >
					<div class="col-sm-10 offset-sm-1 mb-1" >
						{/* <div class="form-group" >  - What does this do? Not needed? */}
						<label for="cc-name" class="payshield-label">Name on card</label>
						<div id="cc-name" class="payshield-field custom-payshield-field" ></div>
						{/* <div id="cc-name-invalid" class="invalid-feedback" >Name on caaaard is required</div> */}
						{/* </div> */}
					</div>
				</div>
				<div class="row" >
					<div class="col-sm-8 offset-sm-1 mb-1" >
						<label for="cc-number" class="payshield-label">Credit card number</label>
						<div id="cc-number" class="payshield-field custom-payshield-field" ></div>
						{/* <div id="cc-number-invalid" class="invalid-feedback" >Valid credit card number is required</div> */}
					</div>
				</div>

				<div class="row" >
					<div class="col-sm-4 offset-sm-1 mb-1" >
						<label for="cc-expiration" class="payshield-label">Expiry Date</label>
						<div id="cc-expiration" class="payshield-field custom-payshield-field" ></div>
						{/* <div id="cc-expiration-invalid" class="invalid-feedback" >Expiration date required</div> */}
					</div>
					<div class="col-sm-4 mb-1" >
						<label for="cc-cvv" class="payshield-label">CVV</label>
						<div id="cc-cvv" class="payshield-field custom-payshield-field" ></div>
						{/* <div id="cc-cvv-invalid" class="invalid-feedback" >Security code required</div> */}
					</div>
				</div>
				<div class="row" >
					<div class="col-sm-6 offset-sm-3 mb-1" >
						<hr class="mb-4" />
						<button class="btn btn-primary btn-lg btn-block" type="submit" >Pay</button>
					</div>
				</div>
			</form>


		</div>
	)
};

const payshieldPlugin = {
	match: 'payshield',
	component: PayshieldPayment,
	options: {
		fullwidth: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(payshieldPlugin);