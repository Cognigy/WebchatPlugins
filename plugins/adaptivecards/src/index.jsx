import * as React from 'react';
import AdaptiveCard from 'react-adaptivecards';

import { updateAdaptiveCardCSSCheaply } from './styles';

// map to remember which message had already been resolved
const resolvedCognigyMessages = new Map();

class AdaptiveCards extends React.Component {
    render() {
        const {
            theme,
            onSendMessage,
            message
        } = this.props;

        updateAdaptiveCardCSSCheaply(theme);

        const {
            payload
        } = message.data._plugin;

        const onActionSubmit = (params) => {
            onSendMessage("", { "adaptivecards": params && params.data });
        }

        const hostConfig = {
            "fontFamily": theme.fontFamily
        }

        if (resolvedCognigyMessages && !resolvedCognigyMessages.has(message.traceId)) {
            resolvedCognigyMessages.set(message.traceId, (
                <AdaptiveCard
                    payload={payload}
                    onActionSubmit={onActionSubmit}
                    hostConfig={hostConfig}
                />
            ));
        }

        return (
            <div className='adaptivecard-wrapper'>
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
