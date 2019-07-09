import memoize from 'memoize-one';

import { getStyles } from './styles';
import { upload } from './helpers/upload'

// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const createFileUpload = React => {
    const FileUpload = props => {
        const [file, setFile] = React.useState(null);
        
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
        
        const {
            attributes,
            onDismissFullscreen,
            onSendMessage,
            message
        } = props;
        
        const { payload } = message.data._plugin;

        const onChangeFile = e => setFile(e.target.files[0]);
        const onSubmit = e => {
            upload(payload, file)
                .then(downloadUrl => {
                    onSendMessage('*sent a file*', {
                        file: downloadUrl
                    });
                })
        }

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
                {payload.service === 'aws-s3' && (
                    <>
                        <header style={headerStyles}>
                            Upload to AWS Bucket
                    </header>
                        <main style={contentStyles}>
                            <input
                                type='file'
                                onChange={onChangeFile}
                            />
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
                                onClick={onSubmit}
                                style={submitButtonStyles}
                            >
                                submit
                    </button>
                        </footer>
                    </>
                )}
            </div>
        )
    }

    return FileUpload;
}

const uploadAWS = (file, url) => {

}

const fileUploadPlugin = ({ React }) => ({
    match: 'file-upload',
    component: createFileUpload(React)
})

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(fileUploadPlugin);