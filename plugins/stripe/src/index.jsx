import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
	CardElement,
	Elements,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';
// needs to be imported in order to avoid runtime error
import regeneratorRuntime from "regenerator-runtime";

const CARD_OPTIONS = {
	iconStyle: 'solid',
	style: {
		base: {
			iconColor: 'black',
			color: 'black',
			fontWeight: 500,
			fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
			fontSize: '16px',
			fontSmoothing: 'antialiased',
			':-webkit-autofill': {
				color: '#grey',
			},
			'::placeholder': {
				color: 'grey',
			},
		},
		invalid: {
			iconColor: 'red',
			color: 'red',
		}
	},
};

const CardField = ({ onChange }) => (
	<div style={{
		alignItems: 'center',
		marginLeft: '15px',
		padding: '5%'
	}}>
		<CardElement options={CARD_OPTIONS} onChange={onChange} />
	</div>
);

const Field = ({
	label,
	id,
	type,
	placeholder,
	required,
	autoComplete,
	value,
	onChange,
}) => (
	<div style={{
		display: '-ms-flexbox',
		display: 'flex',
		alignItems: 'center',
		marginLeft: '15px',
	}}>
		<label htmlFor={id} style={{
			width: '15%',
			minWidth: '70px',
			padding: '11px 0',
			color: 'black',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap'
		}}>
			{label}
		</label>
		<input
			style={{
				fontSize: '16px',
				width: '100%',
				padding: '5%',
				border: 'none',
				color: 'black',
				backgroundColor: 'transparent',
				animation: '1ms void-animation-out'
			}}
			id={id}
			type={type}
			placeholder={placeholder}
			required={required}
			autoComplete={autoComplete}
			value={value}
			onChange={onChange}
		/>
	</div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
	<button
		style={{
			display: 'block',
			fontSize: '16px',
			width: 'calc(100% - 30px)',
			height: '40px',
			margin: '40px 15px 0',
			backgroundColor: 'white',
			//boxShadow: "0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 #ffb9f6",
			borderRadius: '4px',
			color: 'black',
			fontWeight: 600,
			cursor: 'pointer',
			transition: 'all 100ms ease-in-out',
			willChange: "transform, background-color, box-shadow",
			border: 'none',
			boxShadow: "rgb(50 50 93 / 6%) 0px 6px 9px, rgb(0 0 0 / 8%) 0px 2px 5px, rgb(255 255 255) 0px 1px 0px inset"
		}}
		type="submit"
		disabled={processing || disabled}
	>
		{processing ? 'Processing...' : children}
	</button>
);

const ErrorMessage = ({ children }) => (
	<div style={{
		marginRight: '10px',
		color: 'black',
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		padding: '0 15px',
		fontSize: '13px',
		marginTop: '0px',
		width: '100%',
		transform: 'translateY(-15px)',
		opacity: 0,
		animation: 'fade 150ms ease-out',
		animationDelay: '50ms',
		animationFillMode: 'forwards',
		willChange: 'opacity, transform'
	}} role="alert">
		<svg width="16" height="16" viewBox="0 0 17 17">
			<path
				fill="black"
				d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
			/>
			<path
				fill="#6772e5"
				d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
			/>
		</svg>
		{children}
	</div>
);

const CheckoutForm = (props) => {

	const { submitButtonText, errorMessage, successMessage, stripePK } = props;

	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState(null);
	const [cardComplete, setCardComplete] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState(null);
	const [billingDetails, setBillingDetails] = useState({
		email: '',
		phone: '',
		name: ''
	});

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		if (error) {
			elements.getElement('card').focus();
			return;
		}

		if (cardComplete) {
			setProcessing(true);
		}

		const payload = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardElement),
			billing_details: billingDetails,
		});

		setProcessing(false);

		if (payload.error) {
			setError(payload.error);
		} else {
			setPaymentMethod(payload.paymentMethod);
		}
	};

	return paymentMethod ? (
		<div style={{
			marginTop: '50px',
			textAlign: 'center',
			animation: 'fade 200ms ease-out'
		}}>
			<div style={{
				color: 'black',
				fontWeight: 500,
				marginBottom: '8px',
				fontSize: '17px',
				textAlign: 'center'
			}} role="alert">
				{successMessage || "Payment was successful"}
			</div>
		</div>
	) : (
			<form onSubmit={handleSubmit}>
				<fieldset style={{
					margin: '0 15px 20px',
					padding: 0,
					borderStyle: 'none',
					backgroundColor: '#7795z8',
					willChange: "opacity, transform",
					boxShadow: "rgb(50 50 93 / 6%) 0px 6px 9px, rgb(0 0 0 / 8%) 0px 2px 5px, rgb(255 255 255) 0px 1px 0px inset",
					borderRadius: '4px'
				}}>
					<Field
						label="Name"
						id="name"
						type="text"
						placeholder="Jane Doe"
						required
						autoComplete="name"
						value={billingDetails.name}
						onChange={(e) => {
							setBillingDetails({ ...billingDetails, name: e.target.value });
						}}
					/>
					<Field
						label="Email"
						id="email"
						type="email"
						placeholder="janedoe@gmail.com"
						required
						autoComplete="email"
						value={billingDetails.email}
						onChange={(e) => {
							setBillingDetails({ ...billingDetails, email: e.target.value });
						}}
					/>
					<Field
						label="Phone"
						id="phone"
						type="tel"
						placeholder="(941) 555-0123"
						required
						autoComplete="tel"
						value={billingDetails.phone}
						onChange={(e) => {
							setBillingDetails({ ...billingDetails, phone: e.target.value });
						}}
					/>
				</fieldset>
				<fieldset style={{
					margin: '0 15px 20px',
					padding: 0,
					borderStyle: 'none',
					backgroundColor: '#7795z8',
					willChange: "opacity, transform",
					boxShadow: "rgb(50 50 93 / 6%) 0px 6px 9px, rgb(0 0 0 / 8%) 0px 2px 5px, rgb(255 255 255) 0px 1px 0px inset",
					borderRadius: '4px'
				}}>
					<CardField
						onChange={(e) => {
							setError(e.error);
							setCardComplete(e.complete);
						}}
					/>
				</fieldset>
				{error && <ErrorMessage>{error.message}</ErrorMessage>}
				<SubmitButton processing={processing} error={error} disabled={!stripe}>
					{submitButtonText || "Pay"}
				</SubmitButton>
			</form>
		);
};

const ELEMENTS_OPTIONS = {
	fonts: [
		{
			cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
		},
	],
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = (stripePK) => loadStripe(stripePK);



const StripePayment = (props) => {

	// get info from Cogngiy data
	const { message } = props;
	const { data } = message;
	const { _plugin } = data;
	const { submitButtonText, successMessage, errorMessage, stripePK } = _plugin;

	return (
		<div className="AppWrapper">
			<Elements stripe={stripePromise(stripePK)} options={ELEMENTS_OPTIONS}>
				<CheckoutForm submitButtonText={submitButtonText} stripePK={stripePK} successMessage={successMessage} errorMessage={errorMessage} />
			</Elements>
		</div>
	)

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