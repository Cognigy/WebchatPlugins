# Multiselect Plugin
This plugins allows answering question with multiple possible choices.

## Usage
Send specially crafted message to the Webchat. You can use e.g. Code Node to form the message

## Message Data Structure
```typescript
interface MultiselectMessage {
    data: {
        _plugin: {
            type: 'multiselect';
            allowUserAnswers: boolean;
            cancelButtonLabel: string;
            inputPlaceholder: string;
            options: string[];
            openButtonLabel: string;
            submitButtonLabel: string;
        };
    };
}
```

## Settings
`allowUserAnswers: true` allows user to input her own answers.
