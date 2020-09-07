# Open Url Webchat Plugin

This plugin automatically opens a provided `url` in a new browser tab. In order to use this, one has to send the following `data` SAY Node in Cognigy:

```json
{
  "_plugin": {
    "type": "open-url",
    "url": "https://www.cognigy.com"
  }
}
```