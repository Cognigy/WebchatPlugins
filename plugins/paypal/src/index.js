import * as React from "react";
import { PayPalButton } from "react-paypal-button-v2";

const PayPal = (props) => {
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { amount, clientId } = _plugin;

	return (
		<PayPalButton
			amount={amount}
			// shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
			onSuccess={(details, data) => {
				// send success data to cognigy
				onSendMessage('', {
					paypal: {
						message: "success",
						details,
						data
					}
				})
			}}
			catchError={(err) => onSendMessage('', {
				paypal: {
					message: "error",
					details: null,
					data: err
				}
			})}
			onCancel={(data) => onSendMessage('', {
				paypal: {
					message: "cancel",
					details: null,
					data
				}
			})}
			options={{
				clientId,
			}}
		/>
	)
}

const paypalPlugin = {
	match: 'paypal',
	component: PayPal
}

// create if it does not exist yet
if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(paypalPlugin);