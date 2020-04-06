# Cognigy Webchat Progress Steps Plugin
This repository contains a number pad plugin for the [Cognigy Webchat](https://github.com/Cognigy/WebchatWidget).
It wraps the [React NumPad](https://www.npmjs.com/package/react-numpad) component for use in the Cognigy Webchat.

<img src="https://tempbucket-waanders.s3.eu-central-1.amazonaws.com/CognigyWebchatPlugins/progress.png" alt="Image" width="400" />

## Installation

1. Clone this repo
2. Install all necessary dependencies via `nmp i`
3. Run `npm run build` - this will create a `dist/progressbar.webchat-plugin.js` plugin file for you
4. Use that file in your Cognigy Webchat as described in the [Cognigy Docs](https://docs.cognigy.com/docs/using-additional-webchat-plugins).

## Calling the Plugin from Cognigy
You can call the plugin from within Cognigy by sending a data message using a Say Node.

```json
{
  "_plugin": {
    "type": "progress",
    "color": "#097d32",
    "circleFontSize": 18,
    "titleFontSize": 9,
    "steps": [
      {
        "title": "Capture ID"
      },
      {
        "title": "Review & Apply"
      },
      {
        "title": "Results"
      },
      {
        "title": "E-Sign and Fund"
      }
    ],
    "activeStep": 0
  }
}
```
