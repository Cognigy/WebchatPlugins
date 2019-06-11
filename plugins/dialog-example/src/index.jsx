import * as React from 'react';
import memoize from 'memoize-one';

import { getStyles } from './styles';

// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const Dialog = (props) => {
    // if not fullscreen, show button that can switch to fullscreen

    /**
     * If the message is not displayed in "fullscreen" mode,
     * show a button that can switch this message 
     * to "fullscreen" mode.
     */
    
    const { 
        isFullscreen, 
        onSetFullscreen, 
        theme 
    } = props;

    if (!isFullscreen) {
        const { openDialogButtonStyles } = getStylesMemo(theme);

        return (
            <button
                type='button'
                onClick={onSetFullscreen}
                style={openDialogButtonStyles}
            >
                open dialog
            </button>
        )
    }

    /**
     * If this message is displayed in "fullscreen" mode
     * show a dialog with a header, content and footer.
     * 
     * The header indicates the topic of the dialog
     * The content shows information or an interactive input method
     * The footer contains a submit and dismiss button
     */

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

    return (
        <div
            {...attributes}
            style={{
                ...attributes.styles,
                ...dialogStyles
            }}
        >
            <header style={headerStyles}>
                Dialog Title
            </header>
            <main style={contentStyles}>
                Dialog Content
            </main>
            <footer style={footerStyles}>
                <button
                    type='button'
                    onClick={onDismissFullscreen}
                    style={cancelButtonStyles}
                >
                    cancel
                </button>
                <button
                    type='button'
                    onClick={() => onSendMessage('', { submit: true })}
                    style={submitButtonStyles}
                >
                    submit
                </button>
            </footer>
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