import * as React from 'react';
import { UiPathRobot } from '@uipath/robot';

const processedMessages = new Set();


const UiPathAttendedRobots = async (props) => {

  const { onSendMessage, message } = props;
  
    const robot = UiPathRobot.init();
    
    const processes = await robot.getProcesses()
    const sample = processes[0]
    console.log(sample)

  // Get local unattended robot processes
  /*const getLocalProc = () => {
  
    
    

    UiPathRobot.getProcesses().then(processList => {
      onSendMessage("it worked", {
        processes: processList
      });
    }, err => {
      onSendMessage("error", {
        processesError: err
      })
    })
    
  }


  // Only execute the plugin once
  /*if (!processedMessages.has(message.traceId)) {
    if (message.data?._plugin?.type === 'attended-robots') {
      processedMessages.add(message.traceId);
      getLocalProc();
    }
  }*/

  return (
    (
      <button
          type='button'
          onClick={() => onSendMessage('hi')}
      >
      send 'hi'
      </button>
  )
  );
}

const uiPathAttendedRobotsPlugin = {
  match: 'attended-robots',
  component: UiPathAttendedRobots
}

if (!window.cognigyWebchatMessagePlugins) {
  window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(uiPathAttendedRobotsPlugin);