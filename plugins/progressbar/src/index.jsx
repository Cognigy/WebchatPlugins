import * as React from 'react';
import Stepper from 'react-stepper-horizontal';

const ProgressBar = (props) => {

    // get plugin configuration from Cognigy
    const { message } = props;
    const { data } = message;
    const { _plugin } = data;
    const { steps, color, circleFontSize, titleFontSize, activeStep } = _plugin;

    return (
        <Stepper
            size={16}
            completeColor={color}
            activeColor={color}
            circleFontSize={circleFontSize}
            titleFontSize={titleFontSize}
            steps={steps}
            activeStep={activeStep}
        />
    );
}

const progressBarPlugin = {
    match: 'progress',
    component: ProgressBar,
    options: {
        fullwidth: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(progressBarPlugin);