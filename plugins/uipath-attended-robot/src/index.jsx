import * as React from 'react';
import { UiPathRobot } from '@uipath/robot';
import memoize from 'memoize-one'
import { getStyles } from '../../file-upload/src/styles';

const getStylesMemo = memoize(getStyles);
const processedMessages = new Set();

const UiPathAttendedRobots = (props) => {

  const {
    onSendMessage,
    message
  } = props;

  // Get local unattended robot processes
  const getLocalProc = React.useCallback(async processList => {

    processList = await UiPathRobot.getProcesses()

    if (processList.length === 0) {
      console.error("Robot not connected or no processes available")
    }

    let sample = processList[0].name


    /*onSendMessage("it worked", {
      processes: processList
    });*/

    return (
      <button
        type='button'
        onClick={() => onSendMessage('hi')}
      >
        {sample}
      </button>
    );
  }
  )

  /*// Only execute the plugin once
  if (!processedMessages.has(message.traceId)) {
    if (message.data?._plugin?.type === 'attended-robots') {
      processedMessages.add(message.traceId);
      getLocalProc();
    }
  }
*/


  return null;

}

const uiPathAttendedRobotsPlugin = {
  match: 'attended-robots',
  component: UiPathAttendedRobots
}

if (!window.cognigyWebchatMessagePlugins) {
  window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(uiPathAttendedRobotsPlugin);