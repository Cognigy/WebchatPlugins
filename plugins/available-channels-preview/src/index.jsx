import * as React from "react";
import memoize from 'memoize-one';

import { getStyles } from './styles';
// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const AvailableChannelsPreview = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage, theme } = props;
	const { data } = message;
	const { _plugin } = data;
	const { channels, title } = _plugin;

	const { rootStyles, channelIconStyles, iconsRootStyles, titleStyles, dividerStyles } = getStylesMemo(theme);

	return (
		<div
			style={rootStyles}
		>
			<span
				style={titleStyles}
			>{title || 'Next to this webchat, you can contact me on the following channels'}</span>
			<div style={dividerStyles}></div>
			<div
				style={iconsRootStyles}
			>
				{
					channels.map(channel => {
						return <img
							style={channelIconStyles}
							src={
								channel.name === 'whatsapp'
									?
									// Source: Cognigy.AI WhatsApp Endpoint
									`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxkZXNjPkNyZWF0ZWQgd2l0aCBGYWJyaWMuanMgMS43LjIyPC9kZXNjPgo8ZGVmcz4KPC9kZWZzPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjggMTI4KSBzY2FsZSgwLjg3IDAuODcpIiBzdHlsZT0iIj4KCTxnIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMDsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiAxMDsgZmlsbDogbm9uZTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0NC44OTk5OTk5OTk5OTk5OCAtMTQ0LjkwMDAwMDAwMDAwMDAzKSBzY2FsZSgzLjIyIDMuMjIpIiA+Cgk8cGF0aCBkPSJNIDAuNTc2IDQ0LjU5NiBDIDAuNTczIDUyLjQ1NiAyLjYyNiA2MC4xMjkgNi41MyA2Ni44OTIgTCAwLjIwMSA5MCBsIDIzLjY1IC02LjIwMSBjIDYuNTE2IDMuNTUzIDEzLjg1MiA1LjQyNiAyMS4zMTggNS40MjkgaCAwLjAxOSBjIDI0LjU4NiAwIDQ0LjYwMSAtMjAuMDA5IDQ0LjYxMiAtNDQuNTk3IGMgMC4wMDQgLTExLjkxNyAtNC42MzMgLTIzLjEyMiAtMTMuMDU1IC0zMS41NTIgQyA2OC4zMjEgNC42NSA1Ny4xMjEgMC4wMDUgNDUuMTg4IDAgQyAyMC41OTcgMCAwLjU4NSAyMC4wMDUgMC41NzUgNDQuNTk1IE0gMTQuNjU4IDY1LjcyNyBsIC0wLjg4MyAtMS40MDIgYyAtMy43MTIgLTUuOTAyIC01LjY3MSAtMTIuNzIzIC01LjY2OSAtMTkuNzI2IEMgOC4xMTUgMjQuMTYxIDI0Ljc0OCA3LjUzMiA0NS4yMDEgNy41MzIgYyA5LjkwNSAwLjAwNCAxOS4yMTMgMy44NjUgMjYuMjE1IDEwLjg3MSBjIDcuMDAxIDcuMDA2IDEwLjg1NCAxNi4zMiAxMC44NTEgMjYuMjI0IGMgLTAuMDA5IDIwLjQzOSAtMTYuNjQzIDM3LjA2OCAtMzcuMDggMzcuMDY4IGggLTAuMDE1IGMgLTYuNjU1IC0wLjAwNCAtMTMuMTgxIC0xLjc5IC0xOC44NzIgLTUuMTY4IGwgLTEuMzU1IC0wLjgwMyBsIC0xNC4wMzUgMy42OCBMIDE0LjY1OCA2NS43MjcgeiBNIDQ1LjE4OCA4OS4yMjggTCA0NS4xODggODkuMjI4IEwgNDUuMTg4IDg5LjIyOCBDIDQ1LjE4NyA4OS4yMjggNDUuMTg3IDg5LjIyOCA0NS4xODggODkuMjI4IiBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IHJnYig0MiwxODEsNjQpOyBmaWxsLXJ1bGU6IG5vbnplcm87IG9wYWNpdHk6IDE7IiB0cmFuc2Zvcm09IiBtYXRyaXgoMSAwIDAgMSAwIDApICIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPgoJPHBhdGggZD0iTSAzNC4wMzggMjUuOTUgYyAtMC44MzUgLTEuODU2IC0xLjcxNCAtMS44OTQgLTIuNTA4IC0xLjkyNiBjIC0wLjY1IC0wLjAyOCAtMS4zOTQgLTAuMDI2IC0yLjEzNiAtMC4wMjYgYyAtMC43NDQgMCAtMS45NTEgMC4yNzkgLTIuOTcyIDEuMzk0IGMgLTEuMDIyIDEuMTE2IC0zLjkwMiAzLjgxMiAtMy45MDIgOS4yOTYgYyAwIDUuNDg1IDMuOTk1IDEwLjc4NCA0LjU1MSAxMS41MjkgYyAwLjU1OCAwLjc0MyA3LjcxMiAxMi4zNTcgMTkuMDQxIDE2LjgyNSBjIDkuNDE2IDMuNzEzIDExLjMzMyAyLjk3NSAxMy4zNzYgMi43ODkgYyAyLjA0NCAtMC4xODYgNi41OTUgLTIuNjk2IDcuNTI0IC01LjI5OSBjIDAuOTI5IC0yLjYwMyAwLjkyOSAtNC44MzQgMC42NTEgLTUuMjk5IGMgLTAuMjc5IC0wLjQ2NSAtMS4wMjIgLTAuNzQ0IC0yLjEzNyAtMS4zMDEgYyAtMS4xMTUgLTAuNTU4IC02LjU5NSAtMy4yNTQgLTcuNjE3IC0zLjYyNiBjIC0xLjAyMiAtMC4zNzIgLTEuNzY1IC0wLjU1NyAtMi41MDkgMC41NTkgYyAtMC43NDMgMS4xMTUgLTIuODc4IDMuNjI1IC0zLjUyOCA0LjM2OCBjIC0wLjY1IDAuNzQ1IC0xLjMwMSAwLjgzOCAtMi40MTUgMC4yOCBjIC0xLjExNSAtMC41NTkgLTQuNzA1IC0xLjczNSAtOC45NjQgLTUuNTMyIGMgLTMuMzE0IC0yLjk1NSAtNS41NTEgLTYuNjAzIC02LjIwMSAtNy43MTkgYyAtMC42NSAtMS4xMTUgLTAuMDY5IC0xLjcxOCAwLjQ4OSAtMi4yNzQgYyAwLjUwMSAtMC40OTkgMS4xMTUgLTEuMzAxIDEuNjczIC0xLjk1MiBjIDAuNTU2IC0wLjY1MSAwLjc0MiAtMS4xMTYgMS4xMTMgLTEuODU5IGMgMC4zNzIgLTAuNzQ0IDAuMTg2IC0xLjM5NSAtMC4wOTMgLTEuOTUzIEMgMzcuMTk1IDMzLjY2NiAzNS4wMjkgMjguMTU0IDM0LjAzOCAyNS45NSIgc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBmaWxsOiByZ2IoNDIsMTgxLDY0KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdHJhbnNmb3JtPSIgbWF0cml4KDEgMCAwIDEgMCAwKSAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KPC9nPgo8L2c+Cjwvc3ZnPgo=`
									:
									channel.name === 'facebookMessenger'
										?
										// Source: Cognigy.AI Messenger Endpoint
										`data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA4MDAgODAwIj4KIDxyYWRpYWxHcmFkaWVudCBpZD0iR3JhZGllbnQiIGN4PSIxMDEuOTI1IiBjeT0iODA5LjAwNzkiIHI9IjEuMDg5NiIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCg4MDAgMCAwIC03OTkuOTk4NSAtODEzODYgNjQ4MDAwLjc1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogIDxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwOTlGRiIvPgogIDxzdG9wIG9mZnNldD0iMC42MDk4IiBzdHlsZT0ic3RvcC1jb2xvcjojQTAzM0ZGIi8+CiAgPHN0b3Agb2Zmc2V0PSIwLjkzNDgiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjUyODAiLz4KICA8c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjcwNjEiLz4KIDwvcmFkaWFsR3JhZGllbnQ+CiA8cGF0aCBmaWxsPSJ1cmwoI0dyYWRpZW50KSIgZD0iTTQwMCwwQzE3NC43LDAsMCwxNjUuMSwwLDM4OGMwLDExNi42LDQ3LjgsMjE3LjQsMTI1LjYsMjg3YzYuNSw1LjgsMTAuNSwxNCwxMC43LDIyLjhsMi4yLDcxLjIKIGMwLjcsMjIuNywyNC4xLDM3LjUsNDQuOSwyOC4zbDc5LjQtMzVjNi43LTMsMTQuMy0zLjUsMjEuNC0xLjZjMzYuNSwxMCw3NS4zLDE1LjQsMTE1LjgsMTUuNGMyMjUuMywwLDQwMC0xNjUuMSw0MDAtMzg4CiBTNjI1LjMsMCw0MDAsMHoiLz4KIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNTkuOCw1MDEuNWwxMTcuNS0xODYuNGMxOC43LTI5LjcsNTguNy0zNyw4Ni44LTE2bDkzLjUsNzAuMWM4LjYsNi40LDIwLjQsNi40LDI4LjktMC4xCgkJCWwxMjYuMi05NS44YzE2LjgtMTIuOCwzOC44LDcuNCwyNy42LDI1LjNMNTIyLjcsNDg0LjljLTE4LjcsMjkuNy01OC43LDM3LTg2LjgsMTZsLTkzLjUtNzAuMWMtOC42LTYuNC0yMC40LTYuNC0yOC45LDAuMQoJCQlsLTEyNi4yLDk1LjhDMTcwLjUsNTM5LjUsMTQ4LjUsNTE5LjQsMTU5LjgsNTAxLjV6Ii8+Cjwvc3ZnPg==`
										:
										channel.name === 'phone'
											?
											// Source: https://icons8.com/icon/78382/phone
											`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABIElEQVR4nO3VwSoFURwH4A+h2FAUz3ElS0l5CgsWNrJjKxs2XoDuAygegFhZiMJKdq4dC5KUhY2uTo263c4dZM50F/dXv83M1NfMnPM/dNIGWcQdrjBaFrqFekOrZaBzTWjoJyqp4ZMIHHqGrpTwWws4dD4l/JIDP2AwFXyRA4dOpoLXctBb9KaCx/HeAp6ROBsRNAyS5BnEfRP8hOEy8Al8NOGn6C8DX4l88r3Ug+Q7uxF8WwnpwUEE38nuNSZstSkMFIX34TCCH2Eoe2YaN9n1Ryyhu6iVfhzBn3Gdc7BUinrz/R9GauxIrWLkv3hP9n/rf+ylgrIc2ed5rSl4yNR+CS8oOGHRreccLKGbEmYMqzjP5vprtt1mU6KdtG++AA/oqGgeE678AAAAAElFTkSuQmCC`
											:
											null
							}
							id={channel.name}
							onClick={() => {

								if (channel.type === "link") {
									// Open the link of the clicked channel in another browser tab
									window.open(channel.link || "https://cognigy.com", "_blank");
								} else if (channel.type === "postback") {
									onSendMessage(channel.payload || "GET_STARTED");
								}

							}}
						/>
					})
				}
			</div>

		</div>
	)

}

const availableChannelsPreviewPlugin = {
	match: 'available-channels-preview',
	component: AvailableChannelsPreview,
	options: {
		fullwidth: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(availableChannelsPreviewPlugin);