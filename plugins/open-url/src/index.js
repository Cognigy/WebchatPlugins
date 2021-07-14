import * as React from "react";

const OpenUrl = (props) => {
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { url } = _plugin;

	const [opened, setOpenedURL] = React.useState(false);

	if (!opened) {

		setOpenedURL(true);
		// Open the new url
		window.open(url, "_blank");

		// Send confirmation to Cognigy.AI
		onSendMessage("", {
			openedUrl: true
		});
	}


	return <div></div>
}

const openUrlPlugin = {
	match: 'open-url',
	component: OpenUrl
}

// create if it does not exist yet
if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(openUrlPlugin);