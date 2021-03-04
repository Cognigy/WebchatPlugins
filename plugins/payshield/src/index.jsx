import React, { useEffect, useState } from 'react';

/** Convenience LOG() function: */
let LOG = () => { };

function PayshieldPayment(props) {

	// get info from Cognigy data:
	const { message, onSendMessage } = props;
	const _plugin = message.data._plugin;
	const { scriptUrl, paymentConfigurationID, amount, DEBUG } = _plugin;

	if (DEBUG) {
		LOG = (...args) => {
			console.log('Cognigy payshield plugin:',
				args.map(o => typeof o === 'object' ? JSON.stringify(o) : o).join(' '));
		}
	}

	let pluginConfigError = null;
	if (!scriptUrl) {
		pluginConfigError = `Config must include scriptUrl to carry out a transaction.`;
	} else if (!paymentConfigurationID) {
		pluginConfigError = `Config must include paymentConfigurationID to carry out a transaction.`;
	}
	if (pluginConfigError) {
		// Config complaints only generated once per instance, via React useEffect:
		useEffect(() => {
			console.error(`payshield plugin: ${pluginConfigError}`);
			onSendMessage('', {
				payshield: { ERROR: `_plugin trigger config error: ${pluginConfigError}` }
			});
		}, []);
	}

	/** Setup Payshield, once, after render: */
	useEffect(setupPayshield, []);

	/** React Hooks stateful variable: */
	const [validationMessage, setValidationMessage] = useState(null);


	// Event hooks which will be called from Payshield library on events:
	function focusChanged(event) {
		handlePayshieldEvent('focus', event);
	}
	function validationResponse(event) {
		handlePayshieldEvent('validation', event);
		if (Array.isArray(event) && event.length > 0) {
			setValidationMessage(event[0].error);
		}
	}
	function requestInitiated(event) {
		handlePayshieldEvent('request', event);
	}
	function responseReceived(event) {
		handlePayshieldEvent('response', event);
	}

	function handlePayshieldEvent(label, event) {
		LOG(`Payshield ${label} event:`, event);
		// Send the event into the Cognigy Flow - It may want to know...
		const payload = { payshield: event || {} };
		// Not all events give us an event_type:
		if (!payload.payshield.event_type) payload.payshield.event_type = label;
		onSendMessage('', payload);
	}

	/**
	 * Styling used by Payshield 'hosted fields' - This styling is essentially passed into the iframed fields:
	 */
	const inputStyle = {
		input: {
			/**
			 * To ensure visual consistency, these must EXACTLY match the font specification for the style '.payshield-field':
			 */
			"font-size": "16px",
			"font-weight": "400",
			"font-family": "sans-serif",
		},
	};

	/** Config object passed into Payshield initialisation: */
	const payshieldConfig = {
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
				value: amount || undefined,
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
				// required: false,
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
		// (If you try to make this function async, React throws an error)

		console.warn("Setting up Payshield...");

		// Load script (asynchronously?)
		var script = document.createElement('script');
		script.src = scriptUrl;
		script.async = false;
		// Call 'payshieldHostedFields()' from Payshield library, after script load:
		script.onload = () => payshieldHostedFields(payshieldConfig);
		document.body.appendChild(script);
	}

	return (
		<>
			{/* We force default styles into the html from a local const, to keep the plug-in all in the one file: */}
			<style dangerouslySetInnerHTML={{ __html: defaultStyleSheet }} />

			<div class="payshield-frame">

				<form id="payment-form" class="payshield-form" novalidate >

					<div class="payshield-row payshield-row-amount" >
						<label for="amount" class="payshield-label payshield-label-amount">Amount</label>
						{/*
							For some reason, this one field 'amount' has to be an input, not a div,
							thus the duplicated style above. It's still not visually/bahaviourly identical to
							other fields though, which is a pain. Have asked Payshield to be more consistent:
						*/}
						<input id="amount" class="payshield-field payshield-field-amount" placeholder="" autocomplete="off" />
					</div>

					<div class="payshield-row payshield-row-name" >
						<label for="cc-name" class="payshield-label payshield-label-name">Name on card</label>
						<div id="cc-name" class="payshield-field payshield-field-name" ></div>
					</div>
					<div class="payshield-row payshield-row-card" >
						<label for="cc-number" class="payshield-label payshield-label-card">Credit card number</label>
						<div id="cc-number" class="payshield-field payshield-field-card" ></div>
					</div>

					{/* Expiry and CVV: */}
					<div class="payshield-row payshield-row-expiry-cvv" >
						<div class="payshield-expiry-item" >
							<label for="cc-expiration" class="payshield-label payshield-label-expiry">Expiry Date</label>
							<div id="cc-expiration" class="payshield-field payshield-field-expiry" ></div>
						</div>
						<div class="payshield-cvv-item" >
							<label for="cc-cvv" class="payshield-label payshield-label-cvv">CVV</label>
							<div id="cc-cvv" class="payshield-field payshield-field-cvv" ></div>
						</div>
					</div>


					{/* Divider and Pay button: */}
					<div class="payshield-row payshield-row-pay" >
						<hr class="payshield-pay-divider" />
						{/* validationMessage only displays if non-falsey: */}
						{validationMessage &&
							<div class="payshield-row payshield-row-validation" >
								{validationMessage}
							</div>}
						<button class="payshield-pay-button" type="submit"
							onClick={() => setValidationMessage(null)}>Pay</button>
					</div>
				</form>


			</div>
		</>
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


/**
 * Note: The default styles here all use selectors without the html tags.
 * i.e. ".payshield-frame" rather than "div.payshield-frame"
 * This is so that we can rely on the CSS rules around specificity to allow these to be overridden:
 * A CSS style with selector "div.payshield-frame" will over-ride these, since it is more specific.
 */
const defaultStyleSheet = `

.payshield-frame {
	margin: 0 8% 0 8%;
	padding: 8px 0 0 0;
	background: LightPink;
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
}

.payshield-row {
	margin: 0 12% 0 12%;
	padding: 10px 0 0 0;
	border: none;
}

.payshield-label {
	margin-bottom: 0;
}

.payshield-field {
	/*
		The 'all: initial' disconnects from all inherited styles. This is important as Payshield fields are
		a mix of input tags, and div hosted fields. Often parent styling has these tags styled very
		different in ways we can't otherwise easily address here:
	*/
	all: initial;   
	height: 25pt;
	box-sizing: border-box;
	width: 100%;
	padding: 0.375rem 0.75rem;
	display: block;
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
	background: #fff;
	/* Make sure font spec is identical to what is passed into Payshield API config: */
	font-size: 16px;
	font-weight: 400;
	font-family: sans-serif;
}

.payshield-row-amount {
	width: 50%;
}
.payshield-row-name {
	width: 76%;
}
.payshield-row-card {
	width: 59%;
}
.payshield-row-expiry-cvv {
}
.payshield-row-pay {
	margin: 0 12% 0 12%;
}

.payshield-row-validation {
	color: red;
	margin: 8px 8% 8px 8%;
	padding: 10px;
	background-color: LightYellow;
	border-radius: .3rem;
	border: 1px solid #ced4da;
}

.payshield-expiry-item {
	margin: 0 2% 0 0;
	padding: 0 4% 0 0;
	width: 33%;
	display: inline-block;
}
.payshield-cvv-item {
	margin: 0 2% 0 0;
	padding: 0 4% 0 0;
	width: 33%;
	display: inline-block;
}

.payshield-pay-button {
	color: #fff;
	background-color: #007bff;
	border-color: #007bff;
	border-radius: .3rem;
	border: 1px solid transparent;
	line-height: 1.5;
	margin-bottom: .25rem!important;
	padding: .5rem 1rem;
	width: 100%;
}
.payshield-pay-button:not(:disabled):not(.disabled) {
	cursor: pointer;
}

`;
