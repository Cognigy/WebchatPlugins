import * as React from 'react';
import { UiPathRobot } from '@uipath/robot';

const processedMessages = new Set();

const UiPathAttendedRobots = (props) => {

  const {
    onSendMessage,
    message
  } = props;
  // Set state for array of processes
  const [proc, setProc] = React.useState([]);
  const [procArg, setProcArg] = React.useState([])
  const [procId, setProcId] = React.useState()

  // Get local unattended robot processes
  /*const getLocalProc = (async () => {

    const processList = [] = await UiPathRobot.getProcesses()
    

    if (processList.length === 0) {
      console.error("Robot not connected or no processes available")
    }
    
    console.log(Array.isArray(processList))

    setProc(processList)

    getProcessDetails()

  }
  )
*/

  const getLocalProc = (async () => {

    const processList = [] = await UiPathRobot.getProcesses();

    if (processList.length === 0) {
      console.error("Robot not connected or no processes available")
    }
    // console.log(Array.isArray(processList))
    setProc(processList)
  }
  )

  const getProcessDetails = (async () => {
    let processListToInstall = proc
    const processDetails = [] = await UiPathRobot.installProcess(procId)
    // console.log("Process details: " + JSON.stringify(processDetails))
    // console.log(processDetails.inputArgumentsSchema.length)
    for (let detail of processDetails?.inputArgumentsSchema) {
      console.log("Argument" + "name: " + detail.name)
      console.log("Argument" + "type: " + detail.type)
      console.log("Argument" + "isRequired: " + detail.isRequired)
      console.log("Argument" + "hasDefault: " + detail.hasDefault)
    }
    setProcArg(processDetails)
  }
  )

  React.useEffect(() => {
    getLocalProc()
  }, [proc])

  React.useEffect(() => {
    getProcessDetails()
  }, [procId])

  // Create dynamic buttons and start process on click
 /* return (
    <div>
      {proc.map(item => (
        <button
          key={item.id}
          value={item.name}
          onClick={() => item.start()}
        >{item.name}
        </button>
      ))}
    </div>
  );
*/
return (
  <div>
    {proc.map(item => (
      <button
        key={item.id}
        value={item.name}
        onClick={() => {setProcId(item.id);}}
      >{item.name}
      </button>
    ))}
  </div>
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