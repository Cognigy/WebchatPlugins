import * as React from 'react';
import Stepper from 'react-stepper-horizontal';

const ProgressBar = (props) => {
    // if not fullscreen, show button that can switch to fullscreen
   
    const { 
        onSendMessage,
        theme,
        message
    } = props;
      
    // const scale = {
    //     transform: 'scale(0.7)'
    // }

    let steps = message.data._plugin.data.steps;
    let color = message.data._plugin.data.color;
    let circleFontSize = message.data._plugin.data.circleFontSize;
    let titleFontSize = message.data._plugin.data.titleFontSize;
    let activeStep = message.data._plugin.data.active;

    return (
        <div>
          <Stepper size={16} completeColor={color} activeColor={color} circleFontSize={circleFontSize} titleFontSize={titleFontSize} steps={ steps } activeStep={ activeStep } />
        </div>
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

// const style = {
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: '#bfbfbf'
// }

// const imgStyle = {
//     width: '50%'
// }