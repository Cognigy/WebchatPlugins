import * as React from 'react';
import Rating from '@material-ui/lab/Rating';
import { Box, Button, Typography } from '@material-ui/core/';

const UserRating = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { title, initialRating, size, maxRatingValue, precision, rateButtonText } = _plugin;

	const [value, setValue] = React.useState(initialRating);

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
			{ title.length !== 0 ? <Typography component="legend">{title}</Typography> : null}
			<Rating
				name="user-rating"
				size={size}
				max={maxRatingValue}
				precision={precision}
				value={value}
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
			/>
			<Button
				variant="outlined"
				onClick={() => onSendMessage(JSON.stringify(value), { rating: value })}
			>{rateButtonText}</Button>
		</div>
	)

}

const ratingPlugin = {
	match: 'rating',
	component: UserRating,
	options: {
		fullwidth: true
	}
}

if (!window.cognigyWebchatMessagePlugins) {
	window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(ratingPlugin);