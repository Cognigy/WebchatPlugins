import React from 'react';
// needs to be imported in order to avoid runtime error
import regeneratorRuntime from "regenerator-runtime";
import CreditCard from './components/CreditCard';
import IBAN from './components/IBAN';

const StripePayment = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { option, submitButtonText, stripePK, processButtonText } = _plugin;

	switch (option) {
		case 'credit':
			return (
				<div className="AppWrapper">
					<CreditCard onSendMessage={onSendMessage} submitButtonText={submitButtonText} stripePK={stripePK} processButtonText={processButtonText} />
				</div>
			);
		case 'iban':
			return (
				<div className="AppWrapper">
					<IBAN onSendMessage={onSendMessage} submitButtonText={submitButtonText} stripePK={stripePK} processButtonText={processButtonText} />
				</div>
			);
		default:
			throw new Error("Please define the payment 'option' as 'iban' or 'credit'.")
	}

}

const stripePaymentPlugin = {
	match: 'stripe',
	component: StripePayment,
	options: {
		fullwidth: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(stripePaymentPlugin);