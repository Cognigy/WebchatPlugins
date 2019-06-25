# Cognigy Webchat Google Maps Plugin
This repository contains a google maps plugin for the [Cognigy Webchat](https://github.com/Cognigy/WebchatWidget).
It wraps the [React Signature Canvas](https://github.com/agilgur5/react-signature-canvas) component for use in the Cognigy Webchat.

![Webchat Signature Plugin](./assets/signature.jpg)

## Installation

1. Clone this repo
2. Install all necessary dependencies via `nmp i`
3. Run `npm run build` - this will create a `dist/google-maps.webchat-plugin.js` plugin file for you
4. Use that file in your Cognigy Webchat as described in the [Cognigy Docs](https://docs.cognigy.com/docs/using-additional-webchat-plugins).

## Calling the Plugin from Cognigy
You can call the plugin from within Cognigy by sending a data message using a Say Node.

```
{
  "_plugin": {
    "type": "signature",
    "buttonText": "click here to sign",
    "headerText": "Signature",
    "subtitleText": "Upon signing, you are a part of the Galactic Empire",
    "cancelButtonText": "cancel signing",
    "submitButtonText": "confirm signature",
    "penColor": "black"
  }
}
```

Upon clicking the submit button, the image will be returned to Cognigy as a data only message. You can access the base64 encoded PNG via `ci.data.imagedata` 
