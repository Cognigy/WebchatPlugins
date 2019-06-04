import 'babel-polyfill';
import * as React from 'react';
import memoize from 'memoize-one';
import NumPad from 'react-numpad';

import { getStyles } from './styles';

// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const Numpad = (props) => {
    // if not fullscreen, show button that can switch to fullscreen
   
    const { 
        onSendMessage,
        theme 
    } = props;

    const { openDialogButtonStyles } = getStylesMemo(theme);

    const myTheme = {
        header: {
          primaryColor: theme.primaryContrastColor,
          secondaryColor: theme.primaryContrastColor,
          highlightColor: theme.primaryContrastColor,
          backgroundColor: theme.primaryGradient,
        },
        body: {
          primaryColor: theme.primaryColor,
          secondaryColor: theme.primaryColor,
          highlightColor: theme.primaryColor,
          backgroundColor: theme.greyColor,
        },
        panel: {
          backgroundColor: theme.greyColor
        }
      };

      let myArguments = {};

      const getComponent = () => {
        switch (props.message.data._plugin.numpadType) {
            case "dateTime": 
                return <NumPad.DateTime
                    onChange={(value) => { onSendMessage('', { 'value': value}) }}
                    position={props.message.data._plugin.position || 'startBottomRight'}
                    theme={myTheme}
                    dateFormat={props.message.data._plugin.dateFormat || "DD.MM.YYYY HH:mm"}
                >
                    <button
                        type='button'
                        style={openDialogButtonStyles}
                    >
                        {props.message.data._plugin.buttonText || 'Click Me'}
                    </button>
                </NumPad.DateTime>;

            case "calendar":
                myArguments = {};
                if (props.message.data._plugin.value) myArguments.value = props.message.data._plugin.value;
                if (props.message.data._plugin.min) myArguments.min = props.message.data._plugin.min;
                if (props.message.data._plugin.max) myArguments.max = props.message.data._plugin.max;
                if (props.message.data._plugin.markers) myArguments.markers = props.message.data._plugin.markers;
                if (props.message.data._plugin.locale) myArguments.locale = props.message.data._plugin.locale;
                if (props.message.data._plugin.weekOffset) myArguments.weekOffset = props.message.data._plugin.weekOffset;
                return <NumPad.Calendar
                    onChange={(value) => { onSendMessage('', { 'value': value}) }}
                    position={props.message.data._plugin.position || 'startBottomRight'}
                    dateFormat={props.message.data._plugin.dateFormat || "DD.MM.YYYY"}
                    theme={myTheme}
                    {...myArguments}
                >
                    <button
                        type='button'
                        style={openDialogButtonStyles}
                    >
                        {props.message.data._plugin.buttonText || 'Click Me'}
                    </button>
                </NumPad.Calendar>;

            case "appointments":
                myArguments = {};
                if (props.message.data._plugin.value) myArguments.value = props.message.data._plugin.value;
                if (props.message.data._plugin.locale) myArguments.locale = props.message.data._plugin.locale;
                myArguments.dates = (props.message.data._plugin.dates) ? props.message.data._plugin.dates : {};
                
                return <NumPad.Appointment
                    dateFormat={props.message.data._plugin.dateFormat || "DD.MM.YYYY"}
                    onChange={(value) => { onSendMessage('', { 'value': value}) }}
                    position={props.message.data._plugin.position || 'startBottomRight'}
                    theme={myTheme}
                    {...myArguments}
                >
                    <button
                        type='button'
                        style={openDialogButtonStyles}
                    >
                        {props.message.data._plugin.buttonText || 'Click Me'}
                    </button>
                </NumPad.Appointment>;

            default: // default is number pad
                myArguments = {};
                if (props.message.data._plugin.decimal) myArguments.decimal = props.message.data._plugin.decimal;
                if (props.message.data._plugin.negative === false) myArguments.negative = false;
                return (<NumPad.Number
                    onChange={(value) => { onSendMessage('', { 'value': value}) }}
                    position={props.message.data._plugin.position || 'startBottomRight'}
                    theme={myTheme}
                    {...myArguments}
                    >
                        <button
                            type='button'
                            style={openDialogButtonStyles}
                        >
                            {props.message.data._plugin.buttonText || 'Click Me'}
                        </button>
                    </NumPad.Number>);
        }
      }
      

    return getComponent();
}

const signaturePlugin = {
    match: 'numpad',
    component: Numpad
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(signaturePlugin);