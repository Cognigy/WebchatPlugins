import * as React from "react";
const Zoom = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { meetingLink, meetingId, passcode, joinButtonText, title = "" } = _plugin;

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			color: "black",
			background: "white",
			borderRadius: 0,
			marginLeft: 0,
			marginRight: 0,
			margin: "5%",
			borderRadius: "8px"
		}}>
			<div
				style={{
					height: "10px",
					background: "#666",
					width: "100%",
					borderTopRightRadius: "8px",
					borderTopLeftRadius: "8px"
				}}
			></div>
			<div
				style={{
					padding: "5%",
					borderRight: "1px solid lightgrey",
					borderLeft: "1px solid lightgrey",
					borderBottom: "1px solid lightgrey",
					borderBottomRightRadius: "8px",
					borderBottomLeftRadius: "8px"
				}}
			>
				{title.length !== 0 ? <b style={{ color: "#666" }}>{title}</b> : <b style={{ color: "#666" }}>Zoom Meeting</b>}
				<p style={{ fontSize: "small" }}>Meeting ID: {meetingId}<br />Passcode: {passcode}</p>
				<button
					style={{
						background: "#0E71EB",
						padding: "10px 40px",
						borderRadius: "8px",
						cursor: "pointer",
						color: "white",
						border: "none"
					}}
					id="join_meeting"
					onClick={() => {
						// Open the Zoom meeting in another browser tab
						window.open(meetingLink, "_blank");
					}}
				>{joinButtonText || "Join"}</button>
			</div>
		</div>
	)

}

const zoomPlugin = {
	match: 'zoom',
	component: Zoom,
	options: {
		fullwidth: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(zoomPlugin);