import "idempotent-babel-polyfill";
import * as React from "react";
import memoize from "memoize-one";

import { getStyles } from "./styles";
import { useDropzone } from "react-dropzone";
import MessageBubble from "@cognigy/webchat/src/webchat-ui/components/presentational/MessageBubble";

const getStylesMemo = memoize(getStyles);

let pluginBusy = false;

const readAsBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    return resolve(text.substring(text.indexOf(',') + 1));
  }
  reader.readAsDataURL(file);
})

const ReadFileBase64 = props => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isRejected, setIsRejected] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const { isFullscreen, onSetFullscreen, theme, message } = props;

  const { openButtonLabel, sizeLimit, fileSizeLimitErrorMessage } = message.data._plugin;
  const onDrop = React.useCallback(async files => {
    const file = files[0];

    if (file.size > sizeLimit) {
      setIsRejected(true);
      return;
    }

    setIsRejected(false);

    try {
      setIsUploading(true);
      pluginBusy = true;
      setIsUploading(false);
      pluginBusy = false;
      const base64 = await readAsBase64(file);
      props.onSendMessage('', {
        base64,
        _plugin: { type: "read-file-base64-success", fileName: file.name },
      });
      setErrorMessage(null);
    } catch (e) {
      console.error("Uploading file failed", e);
      setErrorMessage(e);
      setIsUploading(false);
    }
  }, []);

  // provides handlers for drag and drop mechanics
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { errorMessageStyles } = getStylesMemo(theme);

  const SizeLimitError = () => (
    <label style={errorMessageStyles}>
      {fileSizeLimitErrorMessage ||
        `File exceeds max file size of ${sizeLimit} bytes.`}
    </label>
  );

  const ErrorLabel = () => <label style={errorMessageStyles}>{errorMessage}</label>;

  if (!isFullscreen) {
    const { openDialogButtonStyles } = getStylesMemo(theme);

    return (
      <button type="button" onClick={onSetFullscreen} style={openDialogButtonStyles}>
        {openButtonLabel || "Select a File"}
      </button>
    );
  }

  const { attributes, onDismissFullscreen } = props;

  const { service, titleText, dragClickLabel, dropLabel, cancelButtonLabel } =
    message.data._plugin;

  const { dialogStyles, headerStyles, contentStyles, footerStyles, cancelButtonStyles } =
    getStylesMemo(theme);

  return (
    <div
      {...attributes}
      style={{
        ...attributes.styles,
        ...dialogStyles,
      }}
    >
      {(!isUploading && !pluginBusy ? (
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
            <button
              type="button"
              onClick={onDismissFullscreen}
              style={cancelButtonStyles}
            >
              {cancelButtonLabel || "cancel"}
            </button>
          </footer>
        </>
      ) : (
        <>
          <header style={headerStyles}>{titleText || "File Upload"}</header>
          <Spinner theme={theme} />
        </>
      ))}
    </div>
  );
};

const Spinner = ({ theme }) => {
  const { spinnerContainerStyles } = getStylesMemo(theme);
  return (
    <div style={spinnerContainerStyles}>
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        stroke={theme.greyContrastColor}
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
    </div>
  );
};

const ReadFileBase64Success = props => {
  const data = props.message.data;
  return (
    <MessageBubble
      theme={props.theme}
      align="right"
      className="regular-message user"
      color="primary"
    >
      {data._plugin.fileName}
    </MessageBubble>
  );
};

const fileReadBase64Plugin = {
  match: "read-file-base64",
  component: ReadFileBase64,
};

const readFileBase64SuccessPlugin = {
  match: 'read-file-base64-success',
  component: ReadFileBase64Success,
};

if (!window.cognigyWebchatMessagePlugins) {
  window.cognigyWebchatMessagePlugins = [];
}

window.cognigyWebchatMessagePlugins.push(fileReadBase64Plugin);
window.cognigyWebchatMessagePlugins.push(readFileBase64SuccessPlugin);
