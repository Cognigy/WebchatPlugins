import React from 'react';

const PushNotification = (props) => {

    // get info from Cogngiy data
    const { message } = props;
    const { text, data } = message;
    const { _plugin } = data;
    const { variant, title, round  } = _plugin;

    // Set background color for push notification
    let background;
    switch (variant) {
        case "success": 
            background = "green";
            break;
        case "warning":
            background = "orange";
            break;
        case "error":
            background = "red";
            break;
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            padding: "5%",
            color: "white",
            background: background,
            borderRadius: round ? "25px" : 0,
            marginLeft: round ? "2%" : 0,
            marginRight: round ? "2%" : 0,

        }}>
            <div style={{
                // insert custom styles for title here ...
                fontSize: "150%",
                fontWeight: "bold",
                marginBottom: "5%"
            }}>
                {title}
            </div>
            <div style={{
               // insert custom styles for text here ... 
            }}>
                {text}
            </div>
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