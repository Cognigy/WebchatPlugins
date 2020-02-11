import React from 'react';

const PushNotification = (props) => {

    // get info from Cogngiy data
    const { message } = props;
    const { text, data } = message;
    const { _plugin } = data;
    const { type, title, round } = _plugin;

    return (
        <div style={{
            display: "flex"
        }}>
            
        </div>
    )

}

const pushNotificationPlugin = {
    match: 'push-notification',
    component: PushNotification,
    options: {
        fullwidth: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(pushNotificationPlugin);