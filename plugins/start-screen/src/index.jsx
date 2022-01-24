import * as React from 'react';
// import memoize from 'memoize-one';

// import { getStyles } from './styles';

// only re-calculate if theme changed
// const getStylesMemo = memoize(getStyles);

const StartScreen = (props) => {
    if (!props.isFullscreen)
        return null;

    return (
        <div style={{ padding: 10 }}>
            <h1>hello there!</h1>
            <p>these are our conditions</p>
            <button onClick={() => props.onSendMessage("", { something: "example" })}>start</button>
        </div>
    );
}

const startScreenPlugin = {
    match: 'start-screen',
    component: StartScreen,
    options: {
        fullscreen: true,
        fullwidth: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(startScreenPlugin);