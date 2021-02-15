import * as React from 'react';
import Rating from '@material-ui/lab/Rating';
import { Button, Typography } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import FavoriteIcon from '@material-ui/icons/Favorite';

const StyledRating = withStyles({
	iconFilled: {
		color: '#ff6d75',
	},
	iconHover: {
		color: '#ff3d47',
	},
})(Rating);

const customIcons = {
	1: {
		icon: <SentimentVeryDissatisfiedIcon />,
		label: 'Very Dissatisfied',
	},
	2: {
		icon: <SentimentDissatisfiedIcon />,
		label: 'Dissatisfied',
	},
	3: {
		icon: <SentimentSatisfiedIcon />,
		label: 'Neutral',
	},
	4: {
		icon: <SentimentSatisfiedAltIcon />,
		label: 'Satisfied',
	},
	5: {
		icon: <SentimentVerySatisfiedIcon />,
		label: 'Very Satisfied',
	},
};

function IconContainer(props) {
	const { value, ...other } = props;
	return <span {...other}>{customIcons[value].icon}</span>;
  }
  
  IconContainer.propTypes = {
	value: PropTypes.number.isRequired,
  };

const UserRating = (props) => {

	// get info from Cogngiy data
	const { message, onSendMessage } = props;
	const { data } = message;
	const { _plugin } = data;
	const { title, initialRating, size, maxRatingValue, precision, rateButtonText, payload, variant } = _plugin;

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
			{
				variant === 'heart'
					?
					<StyledRating
						name="user-rating"
						size={size}
						max={maxRatingValue}
						precision={precision}
						value={value}
						icon={<FavoriteIcon fontSize="inherit" />}
						onChange={(event, newValue) => {
							setValue(newValue);
						}}
					/>
					:
					variant === 'emoji'
						?
						<Rating
							name="user-rating-emoji"
							size={size}
							max={maxRatingValue}
							precision={precision}
							value={value}
							getLabelText={value => customIcons[value].label}
							IconContainerComponent={IconContainer}
							onChange={(event, newValue) => {
								setValue(newValue);
							}}
						/>
						:
						<Rating
							name="user-rating-heart"
							size={size}
							max={maxRatingValue}
							precision={precision}
							value={value}
							onChange={(event, newValue) => {
								setValue(newValue);
							}}
						/>
			}
			<Button
				variant="outlined"
				disabled={value === null}
				onClick={() => onSendMessage(`${JSON.stringify(value)} ${payload || ''}`, { rating: value }, { label: JSON.stringify(value)})}
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