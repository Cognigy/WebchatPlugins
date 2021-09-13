# Multiselect Plugin
This plugins allows answering question with multiple possible choices.

## Usage
Send specially crafted message to the Webchat. You can use e.g. Code Node to form the message

## Message Data Structure
```json
 {
    "_plugin": {
            "type": "multiselect",
            "allowUserAnswers": true,
            "cancelButtonLabel": "Cancel",
            "inputPlaceholder": "Placeholder",
            "options": ["Option 1","Option 2"],
            "openButtonLabel": "Open",
            "submitButtonLabel": "Send"
     }
}
```

## Settings
`allowUserAnswers: true` allows user to input her own answers.
