import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { Slider, Button } from '@material-ui/core';

const SliderComponent = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { defaultValue, step, min, max, label, payload, buttonText, title } = _plugin;

	const [value, setValue] = React.useState(defaultValue);

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
			<Slider
				defaultValue={defaultValue}
				getAriaValueText={value}
				aria-labelledby="slider"
				valueLabelDisplay="auto"
				step={step}
				marks
				min={min}
				max={max}
				onChange={(value) => {
					setValue(value);
				}}
			/>
			<Button
				variant="outlined"
				disabled={value === null}
				onClick={() => onSendMessage(`${JSON.stringify(value)} ${payload || ''}`, { slider: value }, { label: label || JSON.stringify(value) })}
			>{buttonText}</Button>
		</div>
	)
}

const sliderPlugin = {
	match: 'slider',
	component: SliderComponent,
	options: {
		fullwidth: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(sliderPlugin);