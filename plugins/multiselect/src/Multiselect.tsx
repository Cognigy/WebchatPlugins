import * as React from 'react';
import MultiselectDialog from './components/MultiselectDialog';
import { MessageComponentProps } from '@cognigy/webchat/src/common/interfaces/message-plugin';
import { IBotMessage } from '@cognigy/webchat/src/common/interfaces/message';
import MessageBubble from '@cognigy/webchat/src/webchat-ui/components/presentational/MessageBubble';
import { styled } from '@cognigy/webchat/src/webchat-ui/style';
import sanitizedData from "./utils/sanatize";

interface IMultiselectMessage extends IBotMessage {
    data: {
        _plugin: {
            type: 'multiselect';
            allowUserAnswers: boolean;
            cancelButtonLabel: string;
            inputPlaceholder: string;
            options: string[];
            openButtonLabel: string;
            submitButtonLabel: string;
        };
    };
}

const OpenButton = styled.button(({ theme }) => ({
    borderColor: theme.primaryColor,
    cursor: 'pointer',
    height: 40,
    padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
    borderRadius: theme.unitSize * 2,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.primaryColor}`,
    color: theme.primaryColor
}));

export interface IMultiselectProps extends MessageComponentProps {
    message: IMultiselectMessage;
}

const Multiselect: React.FC<IMultiselectProps> = props => {
    if (!props.isFullscreen) {
        return (
            <div>
                <MessageBubble
                    theme={props.theme}
                    align="left"
                    className="regular-message bot"
                    color="primary"
                >
                    <div dangerouslySetInnerHTML={sanitizedData(props.message.text)} />
                </MessageBubble>
                <OpenButton
                    theme={props.theme}
                    onClick={props.onSetFullscreen}
                    style={{ marginTop: props.theme.unitSize * 2 }}
                >
                    {props.message.data._plugin.openButtonLabel}
                </OpenButton>
            </div>
        );
    }

    return <MultiselectDialog {...props} />;
};

export default Multiselect;
