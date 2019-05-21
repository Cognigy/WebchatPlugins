# Get Started with Webchat Plugins

Cognigy Webchat Plugins are built on top of [React](https://reactjs.org).
If you are unfamiliar with `React` or the `jsx` file format, i would recommend taking the Tutorial on their site first.

## Setting up your development environment
Since we are using React, we need a bit of setup before coding.
The easiest way is to use a bundler called [parcel](https://parceljs.org).

> If your parcel installation is slow, make sure to update to the newest NPM version


- `npm init`
- `npm i -D parcel`
- `npm i react`

Open your `package.json` file and add a new "build" job at the "scripts" field:
```json
{
    ...,
    "scripts": {
        ...,
        "build": "parcel --out-file webchat-plugin.js src/index.jsx"
    },
    ...
}
```


- create src/index.jsx


## Define a Message Component
In the first step, we will create a React Component that will be used to render a message.
Via its `props`, it will get a `message` property representing the content of the message we want to render.
Inside that `message` object, we have a `text` property containing the raw text of the message.
We will return a `<span>` with red font color containing the `text` value of the message.
```jsx
// src/index.jsx

import * as React from 'react'

const RedText = (props) => {
    const text = props.message.text

    return (
        <span style={{ color: 'red' }}>
            {text}
        </span>
    )
}
```

## Create a Plugin Object
Now that we have our Message Component, it's time to use it in a plugin definition.
A Message Plugin definition is an object that must contain a `match` and a `component` value.
The `match` value is used to decide for which messages this plugin should be used, and the `component` value tells the webchat what Message Component to use with this plugin.
```jsx
// src/index.jsx (continued)

const redTextPlugin = {
    match: 'red-text',
    component: RedText
}
```

Setting `match` to `'red-text'` means that this plugin will match if a message has `data` that is set up like this:
```json
{
  "_plugin": {
    "type": "red-text"
  }
}
```

## Register the Plugin
In order to cause the plugin to be recognized by the webchat, it needs to be put at a specific location in the `window` object.
At that location, we have a list of webchat plugins where we want to append out plugin.
Because our plugin might be registered first, it may be that the list does not exist yet, so we have to make sure to create it if it does not exist yet.
```jsx
// src/index.jsx (continued)

// create if it does not exist yet
if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(redTextPlugin);
```

## Intermediate Recap
By now, our plugin code should contain
- a Message Component
- a Plugin definition
- a 'registration' of our plugin definition

```jsx
import * as React from 'react'

const RedText = (props) => {
    const text = props.message.text

    return (
        <span style={{ color: 'red' }}>
            {text}
        </span>
    )
}

const redTextPlugin = {
    match: 'red-text',
    component: RedText
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(redTextPlugin);
```

## Building the Plugin
Now that we have our complete plugin code ready, we can go on and build it by running `npm run build` in the command line within the plugin folder. It should create a `webchat-plugin.js` file. 
Load that file into a website before calling `initWebchat` and you are set!
