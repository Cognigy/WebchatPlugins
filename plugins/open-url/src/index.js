import * as React from "react";

const OpenUrl = (props) => {
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { url } = _plugin;

	// Open the new url
	window.open(url, "_blank");

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