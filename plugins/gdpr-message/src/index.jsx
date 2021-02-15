import * as React from 'react';
import memoize from 'memoize-one';

import { getStyles } from './styles';
// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const GDPRMessage = (props) => {

    const {
        isFullscreen,
        theme
    } = props;

    if (!isFullscreen) {

        return <div>

        </div>
    }

    const {
        attributes,
        onDismissFullscreen,
        onSendMessage
    } = props;

    const {
        dialogStyles,
        headerStyles,
        contentStyles,
        footerStyles,
        submitButtonStyles,
        cancelButtonStyles,
        gdprButtonStyles
    } = getStylesMemo(theme);

    const handleSubmit = (result) => {
        onSendMessage('', {
            accepted_gdpr: result
        });
        onDismissFullscreen();
    }

    const handleGDPButton = (payload) => {
        onSendMessage(payload, {});
        onDismissFullscreen();
    }

    return (
        <div
            {...attributes}
            style={{
                ...attributes.styles,
                ...dialogStyles
            }}
        >
            <header style={headerStyles}>
                {props.message.data._plugin.title || "GDPR"}
            </header>
            <main style={contentStyles}>
            <div
                    style={{
                        lineHeight: "1.5",
                        marginTop: "10%",
                        textAlign: "center",
                        whiteSpace: 'pre-line'
                    }}
                >
                    <b style={{opacity: ".7"}}>{props.message.data._plugin.subtitle || "Select an option"}</b>
                </div>
                <div
                    style={{
                        lineHeight: "1.5",
                        marginTop: "10%",
                        textAlign: "justify",
                        whiteSpace: 'pre-line'
                    }}
                >
                    {props.message.data._plugin.message || "Please accept our GDPR notice in order to get the full user experience."}
                </div>
                <div
                    style={{
                        lineHeight: "1.5",
                        marginTop: "5%",
                        fontWeight: "bold"
                    }}
                >
                    {props.message.data._plugin.question || "Is this okay for you?"}
                </div>
            </main>
            <footer style={footerStyles}>
            <button
                    type='button'
                    onClick={() => handleSubmit(true)}
                    style={submitButtonStyles}
                >
                    {props.message.data._plugin.submitButtonText || "Yes"}
                </button>
                <button
                    type='button'
                    onClick={() => handleSubmit(false)}
                    style={cancelButtonStyles}
                >
                    {props.message.data._plugin.cancelButtonText || "No"}
                </button>

                <button
                        type='button'
                        onClick={() => handleGDPButton(props.message.data._plugin.gdprButtonPayload)}
                        style={gdprButtonStyles}
                    >
                        {props.message.data._plugin.gdprButtonText || "GDPR"}
                    </button>
            </footer>
        </div>
    )
}

const gdprMessagePlugin = {
    match: 'gdpr-message',
    component: GDPRMessage,
    options: {
        fullscreen: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(gdprMessagePlugin);