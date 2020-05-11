# PayPal Webchat Plugin

Provide payments with PayPal services right in your webchat. 

## Create a PayPal Developer Account

In order to use this Webchat Plugin, you have to create a developer account: 
https://developer.paypal.com/classic-home/

## How to use the plugin

``` js
actions.output('', {
	"_plugin": {
		"type": "paypal",
		"amount": 0.01, // The amount the user has to pay
		"clientId": "<INSERT-YOUR-PAYPAL-DEVELOPER-CLIENT-ID>"
	}
})
```

