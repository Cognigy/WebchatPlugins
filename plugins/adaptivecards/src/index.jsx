import * as React from 'react';
import memoize from 'memoize-one';
import AdaptiveCard from 'react-adaptivecards';

import { getStyles } from './styles';

// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const resolved = new Map();

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

        const { 
            dialogStyles, 
            headerStyles, 
            contentStyles, 
            footerStyles, 
            submitButtonStyles, 
            cancelButtonStyles,
            outlinedButton,
            padding
        } = getStylesMemo(theme);
        
        console.log(theme);

        const onActionSubmit = (params) => {
            onSendMessage("", { "adaptivecards": params && params.data});
        }

        const hostConfig = {
            "fontFamily": theme.fontFamily
        }

        if (resolved && !resolved.has(message.traceId)) {
            resolved.set(message.traceId, <AdaptiveCard style={{boxShadow: theme.shadow, width: customWidth || '450px', border: customBorder || '1px solid #cccccc'}} payload={payload} onActionSubmit={onActionSubmit} hostConfig={hostConfig}/>);
        }
        
        return (
            <div style={{ width: '100%', left: '10px'}}>
                {resolved.get(message.traceId)}
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
