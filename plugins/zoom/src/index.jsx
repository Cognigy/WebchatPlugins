import * as React from "react";
import { ZoomMtg } from "@zoomus/websdk";

ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.9.6/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();


const Zoom = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { meetingNumber, joinButtonText, title, subtitle, auth, role, leaveUrl, userEmail, userName, passWord } = _plugin;
	const { apiKey, apiSecret } = auth;

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			color: "black",
			background: "white",
			borderRadius: 0,
			marginLeft: 0,
			marginRight: 0,
			// height: "150px",
			// justifyContent: "space-between",
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
				{subtitle.length !== 0 ? <p style={{ fontSize: "small" }}>{subtitle}</p> : <p style={{ fontSize: "small" }}>Meeting ID: {meetingNumber}</p>}
				<button
					style={{
						background: "#0E71EB",
						padding: "10px 15px",
						borderRadius: "8px",
						cursor: "pointer",
						color: "white",
						border: "none"
					}}
					id="join_meeting"
					onClick={() => {

						// Create Signature
						const signature = ZoomMtg.generateSignature({
							meetingNumber,
							apiKey,
							apiSecret,
							role,
							success: function (res) {
								console.log(res.result);
							},
						});

						ZoomMtg.init({
							leaveUrl: leaveUrl,
							isSupportAV: true,
							success: (success) => {
								console.log(success)

								ZoomMtg.join({
									signature: signature,
									meetingNumber: meetingNumber,
									userName: userName,
									apiKey: apiKey,
									userEmail: userEmail,
									passWord: passWord,
									success: (success) => {
										console.log(success)
									},
									error: (error) => {
										console.log(error)
									}
								})

							},
							error: (error) => {
								console.log(error)
							}
						})
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