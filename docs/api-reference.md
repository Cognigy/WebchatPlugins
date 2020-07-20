# Webchat Plugin API Reference

## Message Plugins

### Message Plugin Object
#### `match: string | (message: object) => boolean`
This field will be used by the webchat to determine whether this plugin matches a specific message.
If set to a string, it will match based on whether a message's `message.data._plugin.type` equals that string.
Using `message.data._plugin.type` to match the plugin is a convention we try to push (but not enforce).
It is therefore also possible to provice an own matching function instead of a string, which will get a message as an argument and should return `true` if this plugin should be used, otherwise `false`.

#### `type: string & rule: () => boolean`
If you want to use an input webchat plugin, you need to use the following configuration:
```jsx
{
    type: 'rule',
    rule: () => true,
    component: Component
}
```
With this information, the plugin is executed automatically after rendering the webchat on the webpage. 

#### `component`
A React component that is responsible for rendering the message.
It will receive the message as well as additional api hooks via [props](#message-component-props).

#### `options: object`
An object with [message plugin options](#message-plugin-options).
Can be omitted if not used.


### Message Component Props
#### `attributes: object`
Contains properties that should be spread into the root element of your component.
As a reference, see our [Dialog example](./examples.md#dialog)
For example, it will set a className to display fullscreen messages accordingly.

#### `config: object`
The full configuration object of the webchat.

#### `isFullscreen: boolean`
Is true when the message is currently being displayed in 'fullscreen' mode.
Can e.g. be used to render a button to open the message in fullscreen.

#### `message: object`
Contains the message that should be rendered by the component.

#### `onDismissFullscreen: () => void`
Use this to close a fullscreen message without sending a response.

#### `onSendMessage: (text: string, data?: object, options?: object) => void`
Sends a message from the user to the bot.
Will dismiss fullscreen messages (by sending a message, the fullscreen dialog counts as 'resolved')

#### `onSetFullscreen: () => void`
Displays this message as a fullscreen dialog.


### Message Plugin Options
#### `fullscreen: boolean`
If this is set to `true`, the message will be rendered in fullscreen mode if it is the last message in the history. 

#### `fullwidth: boolean`
If this is set to `true`, the message will be rendered filling the full horizontal space of the webchat.
In fullwidth mode, the message will not have an avatar beside it.

#### `passthrough: boolean`
If this is set to `true`, the webchat will continue matching other plugins after this one, even if this plugin matches. 
This way, one message can trigger multiple plugins.

---


### Message Object
#### `text: string`
The text message that was sent.

#### `data: object`
Optional data payload attached to the message.
By convention, if additional metadata is needed in order to render the plugin correctly (e.g. information about which seats are available in a room booking plugin), those would be sent via `data._plugin`.

#### `source: string`
Shows which party sent the message, can either be `'user'` or `'bot'`.
