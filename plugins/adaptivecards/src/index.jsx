import * as React from 'react';
import memoize from 'memoize-one';
import AdaptiveCard from 'react-adaptivecards';

import { CSSInjectionStyles } from './styles';

// only re-calculate if theme changed
const getStylesMemo = memoize(CSSInjectionStyles);

// map to remember which message had already been resolved
const resolvedCognigyMessages = new Map();

// set style tag to customize adaptive cards display
const head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

head.appendChild(style);
style.type = 'text/css';
style.id = 'accss';

class AdaptiveCards extends React.Component {
    render() {
        const message = this.props.message;
        const payload = message && message.data && message.data._plugin && message.data._plugin.payload;
        const customWidth = message && message.data && message.data._plugin && message.data._plugin.width;
        const customBorder = message && message.data && message.data._plugin && message.data._plugin.border;

        const {
            theme,
            onSendMessage
        } = this.props;

        let css = document.getElementById('accss');
        const {
            acPushbuttonSubdued,
            acPushbuttonExpanded,
            acInput
        } = getStylesMemo(theme);

        css.innerHTML = `
            .ac-pushbutton ${acPushbuttonSubdued};    
            .ac-pushbutton.subdued ${acPushbuttonSubdued};
            .ac-pushbutton.style-default.expandable.expanded ${acPushbuttonExpanded};
            .ac-input ${acInput};
        `;

        const onActionSubmit = (params) => {
            onSendMessage("", { "adaptivecards": params && params.data});
        }

        const hostConfig = {
            "fontFamily": theme.fontFamily
        }

        if (resolvedCognigyMessages && !resolvedCognigyMessages.has(message.traceId)) {
            resolvedCognigyMessages.set(message.traceId, <AdaptiveCard style={{boxShadow: theme.shadow, width: customWidth || '450px', border: customBorder || '1px solid #cccccc'}} payload={payload} onActionSubmit={onActionSubmit} hostConfig={hostConfig}/>);
        }
        
        return (
            <div style={{ width: '95%', paddingLeft: '10px'}}>
                {resolvedCognigyMessages.get(message.traceId)}
            </div>       
        )
    }
}

const adaptivecardsPlugin = {
    match: 'adaptivecards',
    component: AdaptiveCards,
    options: {
        fullwidth: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(adaptivecardsPlugin);
