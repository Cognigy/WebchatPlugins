import * as React from 'react';

const processedMessages = new Set();

const GetUserLocation = (props) => {

	// get info from Cogngiy data
	const { onSendMessage, message } = props;

	// Try to get the user's location with the browser geolocation API
	const geoFindUser = () => {

		// Extract the location (longitude, latitude) on success
		function success(position) {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;

			// Send the location to Cognigy
			// CognigyScript: {{input.data.location.latitude}} and {{input.data.location.longitude}}
			onSendMessage("", {
				location: {
					latitude,
					longitude
				}
			});
		}

		// Handle potential errors
		function error() {

			// Send the error message to Cognigy
			// CognigyScript: {{input.data.error}}
			onSendMessage("", {
				error: "Unable to retrieve your location"
			});
		}

		if (!navigator.geolocation) {
			// Send the error message to Cognigy when the geolocation API is not supported in the used web browser
			// CognigyScript: {{input.data.error}}
			onSendMessage("", {
				error: "Geolocation is not supported by your browser"
			});
		} else {
			// Get the current location
			navigator.geolocation.getCurrentPosition(success, error);
		}
	};

	// Only execute the plugin once
	if (!processedMessages.has(message.traceId)) {
		if (message.source === 'bot' && message.data && message.data._plugin && message.data._plugin.type === 'location') {
			processedMessages.add(message.traceId);
			geoFindUser();
		}
	}

	return null;
}

const getUserLocationPlugin = {
	match: 'location',
	component: GetUserLocation,
	options: {}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(getUserLocationPlugin);