import React from 'react';
import Countdown from 'react-countdown';


const CountdownMessage = (props) => {

    // get info from Cogngiy data
    const { message, onSendMessage } = props;
    const { data } = message;
    const { _plugin } = data;
    const { title, milliseconds, style } = _plugin;
    const { backgroundColor, textColor } = style;

    if (!milliseconds) {
        throw new Error("Missing parameter 'milliseconds'. Please define this in order to set the timer.");
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            padding: "5%",
            color: textColor || "black",
            background: backgroundColor || "white",
            borderRadius: 0,
            marginLeft: 0,
            marginRight: 0,
            justifyContent: "space-between",
            textAlign: "center"
        }}>
            { title.length !== 0 ? <h3>{title}</h3> : null}
            <Countdown
                date={Date.now() + milliseconds}
                renderer={({ hours, minutes, seconds, completed }) => {
                    if (completed) {
                        // Render a completed state
                        onSendMessage("", { countdownCompleted: true })
                        return <div></div>;
                        //return <Completionist />;
                    } else {
                        // Render a countdown
                        return <span style={{
                            fontSize: "350%"
                        }}>
                            {hours}:{minutes}:{seconds}
                        </span>;
                    }
                }}
            />
        </div>
    )

}

const countdownPlugin = {
    match: 'countdown',
    component: CountdownMessage,
    options: {
        fullwidth: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(countdownPlugin);