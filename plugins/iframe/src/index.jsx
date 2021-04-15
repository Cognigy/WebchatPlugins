import Iframe from 'react-iframe'
import * as React from 'react'
import MessageBubble from '@cognigy/webchat/src/webchat-ui/components/presentational/MessageBubble';
import { styled } from '@cognigy/webchat/src/webchat-ui/style'

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

const iFrame = (props) => {
  const { message } = props;
  const { data } = message;
  const { _plugin } = data;
  const { url } = _plugin;

  const { isFullscreen, onSetFullscreen } = props

  if (!isFullscreen) {
    return (
      <div>
        {message.text &&
          <MessageBubble theme={props.theme} align="left" className="regular-message bot" color="primary">
            {message.text}
          </MessageBubble>
        }
        <OpenButton theme={props.theme} onClick={onSetFullscreen} style={{ marginTop: props.theme.unitSize * 2 }}>
          {props.message.data._plugin.openButtonLabel}
        </OpenButton>
      </div>
    );
  }

  const { attributes, onDismissFullscreen, onSendMessage } = props

  function createMarkup() {
    return { __html: '<iframe src="' + url + '" allowusermedia allow="camera *" style="position:absolute;width:100%;height:90%;display:flex" />' };
  }

  return (
    <div dangerouslySetInnerHTML={createMarkup()} />
  )

  // show dialog
  // return (
  //     <div {...attributes}>
  //         <button
  //             type='button'
  //             onClick={onDismissFullscreen}
  //         >
  //             cancel
  //         </button>

  //         <Iframe url={url} 
  //         position="absolute"
  //         width="100%"
  //         height="90%"
  //         display="flex"
  //         id="webchat-iframe"
  //         className="frameStyle"
  //         allow="camera *"
  //         allowerusermedia />
  //     </div>
  // )
}

const iFramePlugin = {
  match: 'iframe',
  component: iFrame
}

if (!window.cognigyWebchatMessagePlugins) {
  window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(iFramePlugin);