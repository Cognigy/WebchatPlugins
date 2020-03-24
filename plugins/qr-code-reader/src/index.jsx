import * as React from 'react';
import memoize from 'memoize-one';

import { getStyles } from './styles';
import QrReader from 'react-qr-reader'
// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const QRCodeScanner = (props) => {
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
                {props.message.data._plugin.buttonText || "Scan QR Code"}
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

    const [code, setCode] = React.useState(null);

    const handleScan = data => {
        if (data !== null) {
            console.log("QR code data:" + data)
            setCode(data);
        }
        
    }

    const handleError = err => {
        console.log("Error in QR code scanner: " + err)
        onDismissFullscreen()
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
            {props.message.data._plugin.title || "QR Code Scanner"}
            </header>
            <main style={contentStyles}>
                <div>
                    <QrReader
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%' }}
                    />

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
                    disabled={code === null}
                    type='button'
                    onClick={() => onSendMessage(JSON.stringify(code), { qrCode: code })}
                    style={submitButtonStyles}
                >
                    {props.message.data._plugin.submitButtonText || "submit"}
                </button>
            </footer>
        </div>
    )
}

const qrCodePlugin = {
    match: 'qr-code',
    component: QRCodeScanner
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(qrCodePlugin);