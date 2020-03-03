import * as React from 'react'
import memoize from 'memoize-one';

import { getStyles } from './styles';

let PERSONAL_DATA = {};
let IMAGES = {};

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

    console.log(fields)

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
    PERSONAL_DATA = persoData;
}


// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const IDCapture = (props) => {

    const {
        isFullscreen,
        onSetFullscreen,
        theme,
        message
    } = props;

    const handleClickOpen = () => {
        onSetFullscreen();
        window.reduxStore.dispatch({ type: 'CAPTURE_ID', captureID: true });
    }

    if (!isFullscreen) {
        const { openDialogButtonStyles } = getStylesMemo(theme);

        return (
            <button
                onClick={handleClickOpen}
                style={openDialogButtonStyles}
            >
                {message.data._plugin.buttonText}
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
                {props.message.data._plugin.headerText || "Capture ID"}
            </header>
            <iframe src="/web-capture/kofax.html" title="web-capture" frameBorder="0" style={contentStyles}></iframe>
            <footer style={footerStyles}>
                <button
                    type='button'
                    onClick={onDismissFullscreen}
                    style={cancelButtonStyles}
                    onClick={() => {
                        console.log('abort id capture')
                        onSendMessage('', { personalData: {}, faceImage: {image: '', valid: false} })
                    }}
                >
                    {props.message.data._plugin.cancelButtonText || "cancel"}
                </button>
                <button
                    type='button'
                    onClick={() => {
                        console.log({ personalData: PERSONAL_DATA })
                        try {
                            onSendMessage('', { personalData: PERSONAL_DATA, faceImage: `data:image/jpeg;base64,${IMAGES.face.image}` })
                            window.reduxStore.dispatch({ type: 'IMAGES', images: IMAGES})
                        } catch (e) {
                            {
                                window.navigator.language === 'de'
                                ?
                                alert('Bitte wählen Sie die Ihren Personalausweis aus, um den Vorgang abzuschließen. Ansonsten können Sie den Vorgang auch abbrechen.')
                                :
                                alert('Please choose your personal identity card to finish the process. Otherwise you can abort this step, if you do not want to scan your id.')
                            }
                        }
                        
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

// create if it does not exist yet

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(idcapturePlugin);