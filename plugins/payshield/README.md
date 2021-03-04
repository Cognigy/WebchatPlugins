# Payshield Webchat Plugin

Enable payments in chat, via Payshield's secure 'hosted fields' approach.

The sensitive input fields which would trigger PCI-DSS scope, are instead handled by small iFrames to Payshield's secure site,
thereby keeping the local website out of PCI-DSS scope.

**Note:** For security reasons, this plugin will not function until you have obtained the Payshield configuration details below, for your particular website.



## How to use this plugin:

1. Obtain the plugin's code from GitHub and run the following commands:
    - `npm i`
    - `npm run build`

2. Now, you should find a folder called `dist` which contains a `payshield.webchat-plugin.js` file. This file needs to be included in a script tag in your `index.html` file which opens the webchat, or uploaded to a cloud storage to add it to the Cognigy Webchat Configuration in the Webchat Endpoint.

3. In your Cognigy.AI project, to trigger the Plugin to display, include a Say Node with a data packet formatted as shown below. The scriptUrl and paymentConfiguration values must be provided by Payshield for your solution:

```json
// In Options->Data section of Say Node, include a JSON object like:
{
  "_plugin": {
    "type": "payshield",
    "scriptUrl": "https://5b1c5322f.i.payshield.com.au/hf/1/hosted.js",
    "paymentConfigurationID": "128813bf-8c8d-4779-a1c6-5ed165cf9910",
    "amount": "1000",
    "DEBUG": 1
  }
}
// amount: Optional default payment amount, in cents.
// DEBUG: If set, will activate a degree of logging to the browser console for form activities.
```

After the above SAY node was executed by Cognigy.AI, it should show content similar to the following in your webchat:

<img src="./docs/1.png"></img>

## Input events returned your Flow

Data-only events will be sent into your Cognigy.AI Flow as the user interacts with the form, such as:
```json
// input.data =
{
  "payshield": {
    "event_type":"focus",
    "field":"cardholdername",
    "status":"focus"
  }
}
```

A final events array, depending on your configuration with Payshield will be sent when the user clicks Pay, such as:
```json
// input.data =
{
  "payshield": {
    "event_type":"process_complete",
    "status": [
      {
        "response_code":"00",
        "response_text":"Approved",
        "approved":true,
        "transaction_reference":"20210304011559","txn_reference":"20210304011559",
        "receipt_number":"59150104032021",
        "transaction_type":"TOKENISATION",
        "token":"4564479283422583",
        "masked_card_number":"456438XXXXXX2583",
        "payment_date":"2021-03-04 01:15:59.959870366 +1100 AEDT"
        ,"amount":"1000",
        "expiry_date":"1221",
        "cardholder_name":"P N "
      },
      {
        "response_code":"00",
        "response_text":"Approved",
        "approved":true,
        "transaction_reference":"20210304011559","txn_reference":"20210304011559",
        "receipt_number":"59150104032021",
        "transaction_type":"PURCHASE",
        "masked_card_number":"456438XXXXXX2583"
        ,"payment_date":"2021-03-04 01:15:59.966726561 +1100 AEDT",
        "amount":"1000",
        "expiry_date":"1221",
        "cardholder_name":"P N "
      }
    ]
  }
}
```

## Styling
The payment form supports extensive visual styling to customise the look.

A suggested process for customizing the styling:
1. Inspect or copy the CSS styling from the bottom of the GitHub source file at src/index.jsx,
2. Include/copy any required styles to over-ride into a CSS style sheet loaded by your web page,
3. Change your CSS selectors to include the html tag type, to allow your tag to over-ride by CSS 'specificity'.

e.g. You will find the style '`.payshield-frame`' in the defaults to control the outer frame of the payment form. To override this use a style with selector '`div.payshield-frame`' in your CSS style sheet. If in doubt of the html tag type, use your browser's debug tools to inspect the components of the form, once displayed.

For the style '`.payshield-field`', override with styles '`div.payshield-field`' and '`input.payshield-field`' at the same time, as both tag types are used for various fields.
