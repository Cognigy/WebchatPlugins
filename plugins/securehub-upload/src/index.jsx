import "idempotent-babel-polyfill";
import * as React from "react";
import { useTranslation } from 'react-i18next';
import "./i18n";

import memoize from "memoize-one";

import { getStyles } from "./styles";
import { upload } from "./helpers/upload";

import { useDropzone } from "react-dropzone";
import MessageBubble from "@cognigy/webchat/src/webchat-ui/components/presentational/MessageBubble";

// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

let pluginBusy = false;
let isUploadError = false;

const SecureHubFileUpload = props => {
	const [isUploading, setIsUploading] = React.useState(false);
	const [isRejected, setIsRejected] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState(null);
	const { t } = useTranslation();

	const { isFullscreen, onSetFullscreen, theme, message } = props;

	const { sizeLimit, fileSizeLimitErrorMessage } = message.data._plugin;
	// handles change events for the file input
	// starts the upload
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
				props.onSendMessage("File upload succeeded", {
					file: result.url,
					downloadUrl: result.downloadUrl,
					_plugin: {
						type: "securehub-file-uploaded",
						name: file.name,
					},
				});
				setErrorMessage(null);
				localStorage.setItem("isUploadError", "false");
			} else {
				setErrorMessage(result.reason);
				setIsUploading(false);
				isUploadError = true;
				props.onSendMessage("", {
					error: ("uploading file failed. Error: " +  result.reason),
				});
			}
		} catch (e) {
			console.error("uploading file failed", e);
			setIsUploading(false);
			isUploadError = true;
			props.onSendMessage("", {
				error: ("uploading file failed. Error: " +  e),
			});
		}
	}, []);

	// provides handlers for drag and drop mechanics
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const { errorMessageStyles } = getStylesMemo(theme);

	const SizeLimitError = () => (
		<label style={errorMessageStyles}>
			{fileSizeLimitErrorMessage ||
				`File exceeds max file size of ${sizeLimit} MB. Choose another file.`}
		</label>
	);

	const ErrorLabel = () => <label style={errorMessageStyles}>{errorMessage}</label>;

	if (!isFullscreen) {
		const { openDialogButtonStyles } = getStylesMemo(theme);

		return (
			<button type="button" onClick={onSetFullscreen} style={openDialogButtonStyles}>
				{t("fileUpload.titleText")}
			</button>
		);
	}

	const { attributes, onDismissFullscreen } = props;

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
			{

				(
					isUploadError ? (
						<>
							<header style={headerStyles}>{t("fileUpload.titleText")}</header>
							<main style={contentStyles} {...getRootProps()}>
								<p>{t("fileUpload.uploadError")}</p>
								{errorMessage ? <ErrorLabel /> : null}
							</main>
							<footer style={footerStyles}>
								<button
									type="button"
									onClick={onDismissFullscreen}
									style={cancelButtonStyles}
								>
									{t("fileUpload.cancelButtonLabel")}
								</button>
							</footer>
						</>

					) : !isUploading && !pluginBusy ? (
						<>
							<header style={headerStyles}>{t("fileUpload.titleText")}</header>
							<main style={contentStyles} {...getRootProps()}>
								<input {...getInputProps()} />
								{isDragActive ? (
									<p>{t("fileUpload.dragClickLabel")}</p>
								) : (
									<p>{t("fileUpload.dropLabel")}</p>
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
									{t("fileUpload.cancelButtonLabel")}
								</button>
							</footer>
						</>
					) : (
						<>
							<header style={headerStyles}>{t("fileUpload.titleText")}</header>
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

const Icon = ({ theme, fileName }) => {
	const { methodIconStyles,
		methodIconContainertyles,
		methodIconOuterCircleStyles,
		methodsIconStyles } = getStylesMemo(theme);
	return (
		<div style={methodIconStyles}>
			<div style={methodIconContainertyles}>
				<div style={methodIconOuterCircleStyles}>
					<div style={methodsIconStyles}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="rgb(54 118 185)"
						>
							<path d="M0 0h24v24H0z" fill="none" /><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
						</svg>
					</div>
				</div>
			</div>
			<span style={{ alignSelf: 'center' }}>{fileName}</span>
		</div>
	);
};

const SecureHubFileUploaded = props => {
	const data = props.message.data;
	const { theme } = props;
	return (
		<MessageBubble
			theme={props.theme}
			align="right"
			className="regular-message user"
			color="primary"
		>
			<Icon theme={theme} fileName={data._plugin.name} />
		</MessageBubble>
	);
};

const securehubFileUploadPlugin = {
	match: "securehub-file-upload",
	component: SecureHubFileUpload,
};

const securehubFileUploadedPlugin = {
	match: 'securehub-file-uploaded',
	component: SecureHubFileUploaded,
};

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = [];
}

window.cognigyWebchatMessagePlugins.push(securehubFileUploadPlugin);
window.cognigyWebchatMessagePlugins.push(securehubFileUploadedPlugin);
