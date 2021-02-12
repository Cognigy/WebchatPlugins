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
        cancelButtonStyles
    } = getStylesMemo(theme);

    const handleSubmit = () => {
        onSendMessage('',{
            accepted_gdpr: true
        });
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
                <div>
                {props.message.data._plugin.message || "Please accept our GDPR notice in order to get the full user experience."}
                </div>
            </main>
            <footer style={footerStyles}>
                <button
                    type='button'
                    onClick={onDismissFullscreen}
                    style={cancelButtonStyles}
                >
                    {props.message.data._plugin.cancelButtonText || "Abort"}
                </button>
                <button
                    type='button'
                    onClick={handleSubmit}
                    style={submitButtonStyles}
                >
                    {props.message.data._plugin.submitButtonText || "Accept"}
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