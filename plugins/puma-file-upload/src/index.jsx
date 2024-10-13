import "idempotent-babel-polyfill";
import * as React from "react";
import memoize from "memoize-one";
import { getStyles } from "./styles";
import { useDropzone } from "react-dropzone";
import { upload, formatFileSize } from "./helper.ts";

const getStylesMemo = memoize(getStyles);

let pluginBusy = false;

const FileUpload = props => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isRejected, setIsRejected] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const { isFullscreen, onSetFullscreen, theme, message } = props;

  const { openButtonLabel, sizeLimit, fileSizeLimitErrorMessage, otherErrorMessage } = message.data._plugin;

  const onDrop = React.useCallback(async files => {
    const file = files[0];

    if (file.size > sizeLimit * 1000 * 1000) {
      setIsRejected(true);
      return;
    }

    setIsRejected(false);

    try {
      setIsUploading(true);
      pluginBusy = true;
      const result = await upload(props.message.data._plugin, file);
      setIsUploading(false);
      pluginBusy = false;

      if (result.success) {
        const messageData = { uploadUrl: result.url, fileName: file.name, fileSize: file.size };
        const messageLabel = { label: `"${file.name}" (${formatFileSize(file.size)})` };
        props.onSendMessage('', messageData, messageLabel);
        setErrorMessage(null);
      } else {
        setErrorMessage(otherErrorMessage + (result.reason || ''));
      }
    } catch (e) {
      console.error("File uplolad error", e);
      setIsUploading(false);
    }
  }, []);

  // Handlers for drag and drop mechanics
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { errorMessageStyles } = getStylesMemo(theme);

  const SizeLimitError = () => (
    <label style={errorMessageStyles}>
      {fileSizeLimitErrorMessage || `File exceeds max file size of ${sizeLimit} MB. Choose another file.`}
    </label>
  );

  const ErrorLabel = () => <label style={errorMessageStyles}>{errorMessage}</label>;

  if (!isFullscreen) {
    const { openDialogButtonStyles } = getStylesMemo(theme);

    return (
      <button type="button" onClick={onSetFullscreen} style={openDialogButtonStyles} class={'uploadFile'}>
        {openButtonLabel || "Upload File"}
      </button>
    );
  }

  const { attributes, onDismissFullscreen } = props;
  const { titleText, dragClickLabel, dropLabel, cancelButtonLabel } = message.data._plugin;
  const { dialogStyles, headerStyles, contentStyles, footerStyles, cancelButtonStyles } = getStylesMemo(theme);

  return (
    <div
      {...attributes}
      style={{
        ...attributes.styles,
        ...dialogStyles,
      }}
    >
      {!isUploading && !pluginBusy ? (
        <>
          <header style={headerStyles}>{titleText || "File Upload"}</header>
          <main style={contentStyles} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>{dragClickLabel || "Drop the file here"}</p>
            ) : (
              <p>{dropLabel || "Drag a file here, or click to select one"}</p>
            )}
            {isRejected ? <SizeLimitError /> : null}
            {errorMessage ? <ErrorLabel /> : null}
          </main>
          <footer style={footerStyles}>
            <button type="button" onClick={onDismissFullscreen} style={cancelButtonStyles}>
              {cancelButtonLabel || "Cancel"}
            </button>
          </footer>
        </>
      ) : (
        <>
          <header style={headerStyles}>{titleText || "File Upload"}</header>
          <Spinner theme={theme} />
        </>
      )}
    </div>
  );
};

const Spinner = ({ theme }) => {
  const { spinnerContainerStyles } = getStylesMemo(theme);
  return (
    <div style={spinnerContainerStyles}>
      <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke={theme.greyContrastColor}>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
            </path>
          </g>
        </g>
      </svg>
    </div>
  );
};

const fileUploadPlugin = { match: "file-upload", component: FileUpload };

if (!window.cognigyWebchatMessagePlugins) {
  window.cognigyWebchatMessagePlugins = [];
}

window.cognigyWebchatMessagePlugins.push(fileUploadPlugin);