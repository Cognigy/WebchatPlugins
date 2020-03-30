import * as React from 'react';
import MultiselectDialog from './components/MultiselectDialog';
// import ToolbarSecondaryButton from '@cognigy/webchat/src/webchat-ui/components/presentational/ToolbarSecondaryButton';
import { MessageComponentProps } from '@cognigy/webchat/src/common/interfaces/message-plugin';
import { IBotMessage } from '@cognigy/webchat/src/common/interfaces/message';
import MessageBubble from '@cognigy/webchat/src/webchat-ui/components/presentational/MessageBubble';
import { styled } from '@cognigy/webchat/src/webchat-ui/style';


interface IMultiselectMessage extends IBotMessage {
    data: {
        _plugin: {
            type: 'multiselect';
            options: string[];
            openButtonLabel: string;
            cancelButtonLabel: string;
            submitButtonLabel: string;
            inputPlaceholder: string;
            allowUserAnswers: boolean;
        };
    };
}

const OpenButton = styled.button(({ theme }) => ({
    borderColor: theme.primaryColor,
    cursor: "pointer",
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
                <MessageBubble theme={props.theme} align="left" className="regular-message bot" color="primary">
                    {props.message.text}
                </MessageBubble>
                <OpenButton theme={props.theme} onClick={props.onSetFullscreen} style={{marginTop: props.theme.unitSize * 2}}>
                    {props.message.data._plugin.openButtonLabel}
                </OpenButton>
                {/* <div style={{ flexBasis: '100%', height: 0}}></div> */}
            </div>
        );
    }

    return <MultiselectDialog {...props} />;
};

export default Multiselect;
