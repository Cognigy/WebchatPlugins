import * as React from "react";

const MicrosoftTeams = (props) => {

	// get info from Cogngiy data
	const { message } = props;
	const { data } = message;
	const { _plugin } = data;
	const { meetingLink, joinButtonText, title = "", subtitle = "" } = _plugin;

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			color: "black",
			background: "white",
			borderRadius: 0,
			margin: "5%",
			border: "1px solid lightgrey",
			padding: "5%",
			paddingTop: 0,
		}}>
			{title.length !== 0 ? <p style={{ color: "rgb(0,0,0,0.8)", fontSize: "25px", fontWeight: "lighter" }}>{title}</p> : <p style={{ color: "rgb(0,0,0,0.8)", fontSize: "25px", fontWeight: "lighter" }}>Microsoft Teams meeting</p>}
			{subtitle.length !== 0 ? <b style={{ color: "black" }}>{subtitle}</b> : <b style={{ color: "black" }}>Join on your computer or mobile app</b>}

			<a
				href={meetingLink}
				target="_blank"
				style={{
					color: "#464EB8",
					marginTop: "1%"
				}}
			>{joinButtonText || "Click here to join the meeting"}</a>
		</div>
	)

}

const microsoftTeamsPlugin = {
	match: 'microsoft-teams',
	component: MicrosoftTeams,
	options: {
		fullwidth: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(microsoftTeamsPlugin);