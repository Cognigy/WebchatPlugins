import * as React from "react";
import { ZoomMtg } from "@zoomus/websdk";
import crypto from "crypto";

const Zoom = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { meetingNumber, joinButtonText, auth, role, leaveUrl, userEmail, userName, passWord } = _plugin;
	const { apiKey, apiSecret } = auth;

	ZoomMtg.preLoadWasm();
	ZoomMtg.prepareJssdk();

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			padding: "5%",
			color: "black",
			background: "white",
			borderRadius: 0,
			marginLeft: 0,
			marginRight: 0,
			height: "120px",
			justifyContent: "space-between"
		}}>
			{title.length !== 0 ? <Typography component="legend">{title}</Typography> : null}

			<Button
				variant="outlined"
				style={{
					background: "#0e72ed"
				}}
				onClick={() => {

					// Create Signature
					const timestamp = new Date().getTime() - 30000
					const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
					const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
					const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')

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
			>{joinButtonText || "Join"}</Button>
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