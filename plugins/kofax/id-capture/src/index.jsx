import * as React from 'react'
import memoize from 'memoize-one';
import { getStyles } from './styles';

let PERSONAL_DATA = {};
let IMAGES = {};

// Get the provided styles for the webchat plugin
const getStylesMemo = memoize(getStyles);

const IDCapture = (props) => {

    // Get global webchat plugin properties
    const {
        isFullscreen,
        onSetFullscreen,
        theme,
        message
    } = props;

    // Get Custom Module arguments as properties
    const { data } = message;
    const { _plugin } = data;
    const { buttonText, displayDialogButton, cancelButtonText, submitButtonText, headerText, rttiUrl } = _plugin;


    /**
     * Open the webchat plugin if the displayOpenButton prop is provided as true
     */
    const handleClickOpen = () => {
        onSetFullscreen();
    }


    // Check if a button to open the plugin should be displayed or if the plugin should be displayed directly
    if (displayDialogButton) {
        if (!isFullscreen) {
            const { openDialogButtonStyles } = getStylesMemo(theme);

            return (
                <button
                    onClick={handleClickOpen}
                    style={openDialogButtonStyles}
                >
                    {buttonText}
                </button>
            )
        }
    } else if (!displayDialogButton) {
        // Directly open the capture id view
        handleClickOpen();
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
        cancelButtonStyles,
        captureButtonText,
        scannedText
    } = getStylesMemo(theme);

    return (
        <div
            {...attributes}
            style={{
                ...dialogStyles
            }}
        >
            <header style={headerStyles}>
                {headerText || "Capture ID"}
            </header>

            <div style={contentStyles}>
                <div id="text-message" style={{
                    textAlign: 'center'
                }}>
                    <h1></h1>
                </div>
                {/* The Capture Button */}
                <div
                    style={{
                        textAlign: 'center',
                        paddingTop: '10px',
                        paddingBottom: '10px'
                    }}
                >
                    <button
                        id="capture-button"
                        className="capture-button"
                    //onClick={captureDocument}
                    >
                        {captureButtonText || "Capture"}
                    </button>
                </div>
                {/* Info text */}
                <div
                    id="info-message"
                    style={{
                        textAlign: 'center'
                    }}
                >
                    {scannedText || "Scanned Sited: "}
                    <strong>0</strong>
                </div>

                {/* The advanced Capture Container */}
                <div id="image-capture"></div>
                {/* The Review Container */}
                <div id="image-review"></div>

                <div id="loader"></div>
            </div>

            <footer style={footerStyles}>
                <button
                    type='button'
                    style={cancelButtonStyles}
                    onClick={onDismissFullscreen}
                >
                    {cancelButtonText || "cancel"}
                </button>
                <button
                    type='button'
                    // Disable the submit button if there are no extracted information
                    disabled={PERSONAL_DATA.firstname === undefined}
                    onClick={() => {
                        // Send back the extracted information to Cognigy.AI to handle it
                        onSendMessage('', { personalData: PERSONAL_DATA, faceImage: `data:image/jpeg;base64,${IMAGES.face.image}` })
                    }}
                    style={submitButtonStyles}
                >
                    {submitButtonText || "submit"}
                </button>
            </footer>
        </div>
    )
}

const idcapturePlugin = {
    match: 'id-capture',
    component: IDCapture
}

// Create webchat plugins object if it does not exist yet
if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(idcapturePlugin);