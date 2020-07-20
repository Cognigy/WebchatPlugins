# Webchat Plugin Examples

## Text Message
Renders the message text in red.
```jsx
import * as React from 'react';

const RedText = (props) => {
    const text = props.message.text

    return (
        <span style={{ color: 'red' }}>
            {text}
        </span>
    )
}

const redTextPlugin = {
    match: 'text-message',
    component: RedText
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(redTextPlugin);
```

## Image
Renders an inline image with a url from the message. 
```jsx
import * as React from 'react';

const Image = (props) => {
    const url = props.message.data._plugin.url

    return (
        <img src={url} />
    )
}

const imagePlugin = {
    match: 'image',
    component: Image
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(imagePlugin);
```

## Button
Renders a button that sends a predefined message from the user when clicked.
```jsx
import * as React from 'react';

const Button = (props) => {
    const onSendMessage = props.onSendMessage

    return (
        <button
            type='button'
            onClick={() => onSendMessage('hi')}
        >
        send 'hi'
        </button>
    )
}

const buttonPlugin = {
    match: 'button',
    component: Button
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(buttonPlugin);
```

## Message Data
Displays an additional message output with stringified data if the message has any.
```jsx
import * as React from 'react';

const MessageData = (props) => {
    const data = props.message.data
    const dataJsonString = JSON.stringify(data)

    return (
        <pre>
            <code>
                {dataJsonString}
            </code>
        </pre>
    )
}

const messageDataPlugin = {
    match: (message) => !!message.data,
    component: MessageData,
    options: {
        passthrough: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(messageDataPlugin);
```

## Input

```jsx
import * as React from "react";
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';

const InputPlugin = (props) => {

    const { onSendMessage, config } = props;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
        placeholder: config.settings.inputPlaceholder,
        value,
        onChange: onChange
    };

    const sendCognigyMessage = () => {
        if (value.length !== 0) {
            onSendMessage(value, null);
            setValue('');
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row'
        }}>
            <input {...inputProps} />
            <IconButton
                style={{
                    borderTop: '1px solid black',
                    borderRadius: 0
                }}
                onClick={sendCognigyMessage}
            >
                <SendIcon />
            </IconButton>
        </div>
    );

}

const inputPlugin = {
    type: 'rule',
    rule: () => true,
    component: InputPlugin
}

if (!window.cognigyWebchatInputPlugins) {
    window.cognigyWebchatInputPlugins = []
}

window.cognigyWebchatInputPlugins.push(inputPlugin);
```

## Dialog
Displays a Button that opens a Dialog when clicked.
The user can then dismiss or submit the dialog with buttons.
```jsx
import * as React from 'react';

const Dialog = (props) => {
    const { isFullscreen, onSetFullscreen } = props

    // show button
    if (!isFullscreen) {
        return (
            <button
                type='button'
                onClick={onSetFullscreen}
            >
                open dialog
            </button>
        )
    }

    const { attributes, onDismissFullscreen, onSendMessage } = props

    // show dialog
    return (
        <div {...attributes}>
            <button
                type='button'
                onClick={onDismissFullscreen}
            >
                cancel
            </button>
            <button
                type='button'
                onClick={() => onSendMessage('hi')}
            >
                send 'hi'
            </button>
        </div>
    )

}

const dialogPlugin = {
    match: 'dialog',
    component: Dialog
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(dialogPlugin);
```

## TypeScript Example
This example renders a Microsoft Fabric UI React Component using TypeScript.
Please note you will need TypeScript and office-ui-fabric-react installed.

```tsx
import * as React from 'react';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble';

export interface ITeachingBubbleBasicExampleState {
    isTeachingBubbleVisible?: boolean;
}

export class TeachingBubbleBasicExample extends React.Component<{}, ITeachingBubbleBasicExampleState> {
    private _menuButtonElement: HTMLElement;
  
    constructor(props: any) {
      super(props);
  
      this._onDismiss = this._onDismiss.bind(this);
      this._onShow = this._onShow.bind(this);

      this.state = {
        isTeachingBubbleVisible: false
      };
    }
  
    public render(): JSX.Element {
      const { isTeachingBubbleVisible } = this.state;
      const examplePrimaryButton: IButtonProps = {
        children: 'Say Hi to me!',
        onClick: () => {
            this._onDismiss;
            return this.props.onSendMessage('hi');
        }
      };
      const exampleSecondaryButtonProps: IButtonProps = {
        children: 'Maybe later',
        onClick: this._onDismiss
      };

      const mainButton = <DefaultButton
      onClick={isTeachingBubbleVisible ? this._onDismiss : this._onShow}
      text={isTeachingBubbleVisible ? 'Hide TeachingBubble' : 'Show TeachingBubble'}
    />;

      return (
        <div className="ms-TeachingBubbleExample">
          <span className="ms-TeachingBubbleBasicExample-buttonArea" ref={menuButton => (this._menuButtonElement = menuButton!)}>
            {mainButton}
          </span>
          {isTeachingBubbleVisible ? (
            <div>
              <TeachingBubble
                target={this._menuButtonElement}
                primaryButtonProps={examplePrimaryButton}
                secondaryButtonProps={exampleSecondaryButtonProps}
                onDismiss={this._onDismiss}
                headline="Microsoft is amazing"
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere, nulla, ipsum? Molestiae quis aliquam magni harum non?
              </TeachingBubble>
            </div>
          ) : null}
        </div>
      );
    }
  
    private _onDismiss(ev: any): void {
      this.setState({
        isTeachingBubbleVisible: false
      });
    }
  
    private _onShow(ev: any): void {
      this.setState({
        isTeachingBubbleVisible: true
      });
    }
  }

  const dialogPlugin = {
    match: 'dialog',
    component: TeachingBubbleBasicExample
}

if (!window["cognigyWebchatMessagePlugins"]) {
    window["cognigyWebchatMessagePlugins"] = []
}

window["cognigyWebchatMessagePlugins"].push(dialogPlugin);
```
