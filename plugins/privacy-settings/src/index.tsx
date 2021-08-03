import * as React from 'react';
import memoize from 'memoize-one';
import { registerMessagePlugin } from '@cognigy/webchat/src/plugins/helper';

import { getStyles } from './styles';

const getStylesMemo = memoize(getStyles); // only re-calculate if theme changed

const PrivacySettingsDialog = (props) => {
  /**
   * If the message is not displayed in "fullscreen" mode,
   * show a button that can switch this message 
   * to "fullscreen" mode.
   */
  console.log(props);
  const {
    isFullscreen,
    onSetFullscreen,
    theme
  } = props;

  if (!isFullscreen) {
    const { openDialogButtonStyles } = getStylesMemo(theme);

    return (
      <button
        type='button'
        onClick={onSetFullscreen}
        style={openDialogButtonStyles}
      >
        {props.message.text}
      </button>
    )
  }

  /**
   * If this message is displayed in "fullscreen" mode
   * show a dialog with a header, content and footer.
   * 
   * The header indicates the topic of the dialog
   * The content shows information or an interactive input method
   * The footer contains a submit and dismiss button
   */

  const {
    attributes,
    onDismissFullscreen,
    onSendMessage
  } = props;

  const {
    dialogStyles,
    headerStyles,
    contentStyles,
    footerStyles,
    submitButtonStyles,
    cancelButtonStyles
  } = getStylesMemo(theme);

  return (
    <div
      {...attributes}
      style={{
        ...attributes.styles,
        ...dialogStyles
      }}
    >
      <header style={headerStyles}>
        Privacy Settings
      </header>
      <main style={contentStyles}>
        As your personal assistant, I would like to save our conversations and your first name. Conversations will be much nicer and I can learn better. {/* 🙂 */} Do you agree?
      </main>
      <footer style={footerStyles}>
        <button
          type='button'
          onClick={() => onSendMessage(
            'I agree to save our conversation and my first name',
            { acceptedRecording: true }
          )}
          style={submitButtonStyles}
        >
          Yes {/* ✅ */}
        </button>
        <button
          type='button'
          onClick={() => onSendMessage(
            'Please do not record our conversation and don\'t ask for my first name',
            { acceptedRecording: false }
          )}
          style={submitButtonStyles}
        >
          No {/*  🛑 */}
        </button>
        <button
          type='button'
          onClick={onDismissFullscreen}
          style={cancelButtonStyles}
        >
          Cancel
        </button>
      </footer>
    </div>
  )
}

registerMessagePlugin({ match: 'privacy-settings', component: PrivacySettingsDialog });