var $1g5St$uipathrobot = require("@uipath/robot");

var $c94bc0999887be7e$exports = {};
if (!window.__COGNIGY_WEBCHAT) throw new Error("Cognigy Webchat v2.7 or higher has to be loaded before this plugin");
$c94bc0999887be7e$exports = window.__COGNIGY_WEBCHAT.React;



var $91fc7c7f5ab63f5b$require$UiPathRobot = $1g5St$uipathrobot.UiPathRobot;
const $91fc7c7f5ab63f5b$var$processedMessages = new Set();
const $91fc7c7f5ab63f5b$var$UiPathAttendedRobots = async (props)=>{
    const { onSendMessage: onSendMessage , message: message  } = props;
    const robot = $91fc7c7f5ab63f5b$require$UiPathRobot.init();
    const processes = await robot.getProcesses();
    const sample = processes[0];
    console.log(sample);
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
  }*/ return null;
};
const $91fc7c7f5ab63f5b$var$uiPathAttendedRobotsPlugin = {
    match: "attended-robots",
    component: $91fc7c7f5ab63f5b$var$UiPathAttendedRobots
};
if (!window.cognigyWebchatMessagePlugins) window.cognigyWebchatMessagePlugins = [];
window.cognigyWebchatMessagePlugins.push($91fc7c7f5ab63f5b$var$uiPathAttendedRobotsPlugin);


//# sourceMappingURL=plugin.js.map
