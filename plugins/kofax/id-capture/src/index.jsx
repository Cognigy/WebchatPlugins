import * as React from 'react'
import memoize from 'memoize-one';

import { getStyles } from './styles';

let PERSONAL_DATA = {};
let IMAGES = {};

/**
 * Capitalize the extracted text to get typical written text.
 * Result = FIRSTNAME -> Firstname
 * @param {String} text 
 */
function capitalizeFLetter(text) {
    try {
        text = text.toLowerCase();
        return text[0].toUpperCase() + text.slice(1);
    }catch (e) {
        return "";
    }
    
}

/**
 * Function for sending the extracted field values from the iFrame to this component
 * @param {List} results the extracted results
*/
window.handlePersonalData = (results) => {

    const { fields, processedImages } = results[0];

    // Log the extracted information for developing reasons
    console.log("Extracted information: \n"  + fields)

    // extract the perso info from result fields
    let persoData = {
        firstname: capitalizeFLetter(fields[8].text),
        lastname: capitalizeFLetter(fields[10].text),
        middlename: capitalizeFLetter(fields[9].text),
        nationality: capitalizeFLetter(fields[14].text),
        city: capitalizeFLetter(fields[22].text),
        zip: fields[24].text,
        birthday: fields[12].text,
        address: capitalizeFLetter(fields[21].text),
        country: capitalizeFLetter(fields[2].text),
        countryshort: fields[3].text,
        nationalityshort: fields[15].text,
        documenttype: fields[0].text,

    };

    // Get the extracted images and store it to the IMAGES object
    IMAGES = {
        id: processedImages,
        face: {
            image: fields[18].text,
            valid: fields[18].valid
        },
        signature: {
            iamge: fields[19].text,
            valid: fields[19].valid
        }
    } 

    // Get the extracted personal information and store it to the PERSONAL_DATA object
    PERSONAL_DATA = persoData;
}


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
    const { buttonText, displayDialogButton, cancelButtonText, submitButtonText, headerText, contextStore } = _plugin;

    
    /**
     * Open the webchat plugin if the displayOpenButton prop is provided as true
     */
    const handleClickOpen = () => {
        onSetFullscreen();
        window.reduxStore.dispatch({ type: 'CAPTURE_ID', captureID: true });
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
                {headerText || "Capture ID"}
            </header>
            <iframe src="/web-capture/kofax.html" title="web-capture" frameBorder="0" style={contentStyles}></iframe>
            <footer style={footerStyles}>
                <button
                    type='button'
                    onClick={onDismissFullscreen}
                    style={cancelButtonStyles}
                    onClick={() => {
                        // Send empty information back to Cognigy.AI to show that the user aborted the process
                        onSendMessage('', { personalData: {}, faceImage: {image: '', valid: false} })
                    }}
                >
                    {cancelButtonText || "cancel"}
                </button>
                <button
                    type='button'
                    // Disable the submit button if there are no extracted information
                    disabled={PERSONAL_DATA === {}}
                    onClick={() => {                   
                         // Send back the extracted information to Cognigy.AI to handle it
                         onSendMessage('', { personalData: PERSONAL_DATA, faceImage: `data:image/jpeg;base64,${IMAGES.face.image}` })
 
                        /**
                         * If your web application uses REDUX, you can store the extracted information to show it in the application.
                         * window.reduxStore.dispatch({ type: 'IMAGES', images: IMAGES})
                        */  
                    }}
                    style={submitButtonStyles}
                >
                    {props.message.data._plugin.submitButtonText || "submit"}
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