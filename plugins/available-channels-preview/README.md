# Available Channels Preview

This webchat plugin allows the virtual agent to show multiple channels options to the user so that they can have the same conversation on, for example, WhatsApp or the phone instead of the Webchat channel.

## How to display this Webchat Plugin

In order to display this Webchat Plugin inside of the chat window, a Say Node must be used inside of the Cognigy.AI Flow. Inside of the Say Node, the "Options" section must be opened while the following example JSON has to be provided in the "Data" field:

```json
{
    "_plugin": {
        "type": "available-channels-preview",
        "title": "Here are some more channels for you",
        "channels": [
            {
                "name": "whatsapp",
                "type": "link",
                "link": "https://cognigy.com"
            },
            {
                "name": "facebookMessenger",
                "type": "link",
                "link": "https://facebook.com"
            },
            {
                "name": "phone",
                "type": "postback",
                "payload": "I want to continue on the phone line"
            }
        ]
    }
}
```

With the above JSON data added to the "Options" section of the Say Node, the Webchat will display the Webchat plugin as soon as the Say Node is executed in the Flow. Moreover, the bundled JavaScript file, which can be found in the Webchat Plugins releases, must be added to the web page that hosts the Webchat. This JavaScript file can be imported using the following script in HTML:

```js
<script src="./available-channels-preview.webchat-plugin.js"></script>
```

It is very important that first the Webchat file and then the Webchat Plugin file is loaded. Therefore, the script imports in the HTML file could look like this:

```js
<script src="https://github.com/Cognigy/WebchatWidget/releases/latest/download/webchat.js"></script>
<script src="./available-channels-preview.webchat-plugin.js"></script>
```