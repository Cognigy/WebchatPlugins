# Stripe Payments Webchat Plugin

With this Webchat Plugin one can provide online payments with [Stripe](https://www.stripe.com).

To execute the webchat plugin in a conversation, whether use a **Say** Node in Cognigy.AI or the **Code** Node, such as in the following example:

```json
{
  "_plugin": {
    "type": "stripe",
    "option": "credit",
    "processButtonText": "Processing...",
    "submitButtonText": "Pay",
    "stripePK": "pk_test_6pRNASCoBOKtIshFeQd4XMUh"
  }
}
```

**Options:**

- Credit Card
  - `"option": "credit"`
- IBAN
  - `"option": "iban"`


After the above SAY node was executed by Cognigy.AI, it should show one of the following contents in your webchat:

**Credit Card:**

<img width="50%" src="./docs/cognigyStripeExample.png"></img>

**IBAN:**

<img width="50%" src="./docs/cognigyStripeIBANExample.png"></img>


## Result

The plugin will return a data message in order to notify Cognigy.AI about the result:

**Success  (Credit Card):**

```json
{
    "stripeResult": "success",
    "result": {
        "id": "pm_1I...",
        "object": "payment_method",
        "billing_details": {
            "address": {
                "city": null,
                "country": null,
                "line1": null,
                "line2": null,
                "postal_code": null,
                "state": null
            },
            "email": "a.teusz@cognigy.com",
            "name": "Alex Teusz",
            "phone": "015142326427"
        },
        "card": {
            "brand": "mastercard",
            "checks": {
                "address_line1_check": null,
                "address_postal_code_check": null,
                "cvc_check": null
            },
            "country": "DE",
            "exp_month": 1,
            "exp_year": 2022,
            "funding": "debit",
            "generated_from": null,
            "last4": "1234",
            "networks": {
                "available": [
                    "mastercard"
                ],
                "preferred": null
            },
            "three_d_secure_usage": {
                "supported": true
            },
            "wallet": null
        },
        "created": 123,
        "customer": null,
        "livemode": false,
        "type": "card"
    }
}
```


**Success  (IBAN):**

```json
{
    "stripeResult": "success",
    "result": {
        "id": "pm_1I...",
        "object": "payment_method",
        "billing_details": {
            "address": {
                "city": null,
                "country": null,
                "line1": null,
                "line2": null,
                "postal_code": null,
                "state": null
            },
            "email": "a.teusz@cognigy.com",
            "name": "Alex Teusz",
            "phone": null
        },
        "created": 1234,
        "customer": null,
        "livemode": false,
        "sepa_debit": {
            "bank_code": "32451234",
            "branch_code": "",
            "country": "DE",
            "fingerprint": "123",
            "generated_from": {
                "charge": null,
                "setup_attempt": null
            },
            "last4": "1234"
        },
        "type": "sepa_debit"
    }
}
```

**Error:**

```json
{
  "stripeResult": "error",
  "error": "..."
}
```

Now one could use a Lookup node and check the response:

<img src="./docs/cognigyFlowStripe.png"></img>
