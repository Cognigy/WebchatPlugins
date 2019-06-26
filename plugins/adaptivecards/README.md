# Cognigy Webchat Adaptive Cards Plugin
This repository contains a Microsoft [Adaptive Cards](https://adaptivecards.io/) plugin for the [Cognigy Webchat](https://github.com/Cognigy/WebchatWidget).
It wraps the [react-adaptivecards](https://github.com/gatewayapps/react-adaptivecards) component for use in the Cognigy Webchat.

![Webchat Adaptive Card Plugin](./assets/signature.jpg)

## Installation

1. Clone this repo
2. Install all necessary dependencies via `nmp i`
3. Run `npm run build` - this will create a `dist/adaptivecards.webchat-plugin.js.js` plugin file for you
4. Use that file in your Cognigy Webchat as described in the [Cognigy Docs](https://docs.cognigy.com/docs/using-additional-webchat-plugins).

## Calling the Plugin from Cognigy
You can call the plugin from within Cognigy by sending a data message using a Say Node.

```
{
  "_plugin": {
    "type": "adaptivecards",
    "payload": {
      
    }
  }
}
```
