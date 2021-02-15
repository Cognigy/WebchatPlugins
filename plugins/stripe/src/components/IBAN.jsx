import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { IbanElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';

const ELEMENT_OPTIONS = {
    supportedCountries: ['SEPA'],
    style: {
        base: {
            fontSize: '18px',
            color: 'black',
            letterSpacing: '0.025em',
            '::placeholder': {
                color: 'grey',
            },
        },
        invalid: {
            color: 'red',
        },
    },
};

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

const SubmitButton = ({ children, disabled }) => (
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
        disabled={disabled}
    >
        {children}
    </button>
);

const IBANCheckoutForm = (props) => {

    const { submitButtonText, onSendMessage } = props;

    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        const ibanElement = elements.getElement(IbanElement);

        const payload = await stripe.createPaymentMethod({
            type: 'sepa_debit',
            sepa_debit: ibanElement,
            billing_details: {
                name,
                email,
            },
        });

        if (payload.error) {
            console.log('[error]', payload.error);
            setErrorMessage(payload.error.message);
            setPaymentMethod(null);
            // send error message to cognigy
            onSendMessage('', {
                stripeResult: 'error',
                error: payload.error
            });
        } else {
            console.log('[PaymentMethod]', payload.paymentMethod);
            setPaymentMethod(payload.paymentMethod);
            setErrorMessage(null);
            // send error message to cognigy
            onSendMessage('', {
                stripeResult: 'success',
                result: payload.paymentMethod
            });
        }
    };

    return paymentMethod ? (
        <div style={{
            marginTop: '50px',
            textAlign: 'center',
            animation: 'fade 200ms ease-out'
        }}>
            <div></div>
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
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <Field
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="janedoe@gmail.com"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </fieldset>
                <fieldset style={{
                    margin: '0 15px 20px',
                    padding: '5%',
                    borderStyle: 'none',
                    backgroundColor: '#7795z8',
                    willChange: "opacity, transform",
                    boxShadow: "rgb(50 50 93 / 6%) 0px 6px 9px, rgb(0 0 0 / 8%) 0px 2px 5px, rgb(255 255 255) 0px 1px 0px inset",
                    borderRadius: '4px'
                }}>
                    <IbanElement
                        id="iban"
                        options={ELEMENT_OPTIONS}
                        style={{
                            alignItems: 'center',
                            marginLeft: '15px',
                            padding: '5%'
                        }}
                    />
                </fieldset>
                <SubmitButton disabled={!stripe}>
                    {submitButtonText || "Pay"}
                </SubmitButton>
            </form>
        );
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = (stripePK) => loadStripe(stripePK);

const IBAN = (props) => (
    <Elements stripe={stripePromise(props.stripePK)}>
        <IBANCheckoutForm submitButtonText={props.submitButtonText} onSendMessage={props.onSendMessage} />
    </Elements>
);

export default IBAN;