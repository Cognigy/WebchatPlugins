# GDPR Message
With this webchat plugin, you display a GDPR message to the user in order to get their permission before continuing the chat.
In order to do so, you have to send a specifiy **SAY NODE** in Cognigy.AI which starts the plugin in your webchat:

```json
{
    "_plugin": {
        "type": "gdpr-message",
        "title": "GDPR Notice",
        "message": "Please accept the GDPR notice...",
        "cancelButtonText": "Abort",
        "submitButtonText": "Accept"
    }
}
```