import * as React from 'react';
import memoize from 'memoize-one';
import SignatureCanvas from 'react-signature-canvas';

import { getStyles } from './styles';

// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const Signature = (props) => {
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
                {props.message.data._plugin.buttonText}
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

    const getImage = () => {
        return sigPad.getTrimmedCanvas().toDataURL('image/png');
    }

    let sigPad = null;

    return (
        <div
            {...attributes}
            style={{
                ...attributes.styles,
                ...dialogStyles
            }}
        >
            <header style={headerStyles}>
                {props.message.data._plugin.headerText || "Sign here"}
            </header>
            <main style={contentStyles}>
                {props.message.data._plugin.subtitleText}
                <div style={{'background-color': '#ffffff'}}>
                <SignatureCanvas penColor={props.message.data._plugin.penColor || "black"} canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} ref={(ref) => { sigPad = ref }} />
                </div>
            </main>
            <footer style={footerStyles}>
                <button
                    type='button'
                    onClick={onDismissFullscreen}
                    style={cancelButtonStyles}
                >
                    {props.message.data._plugin.cancelButtonText || "cancel"}
                </button>
                <button
                    type='button'
                    onClick={() => onSendMessage('', { 'imagedata': getImage()})}
                    style={submitButtonStyles}
                >
                    {props.message.data._plugin.submitButtonText || "submit"}
                </button>
            </footer>
        </div>
    )
}

const signaturePlugin = {
    match: 'signature',
    component: Signature
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(signaturePlugin);
