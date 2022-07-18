var $1g5St$uipathrobot = require("@uipath/robot");

var $c94bc0999887be7e$exports = {};
if (!window.__COGNIGY_WEBCHAT) throw new Error("Cognigy Webchat v2.7 or higher has to be loaded before this plugin");
$c94bc0999887be7e$exports = window.__COGNIGY_WEBCHAT.React;



const $91fc7c7f5ab63f5b$var$UiPathAttendedRobots = (props)=>{
    const processes = (0, $1g5St$uipathrobot.UiPathRobot).getProcesses;
    return /*#__PURE__*/ $c94bc0999887be7e$exports.createElement("span", null, processes);
};
const $91fc7c7f5ab63f5b$var$uiPathAttendedRobotsPlugin = {
    match: "attended-robots",
    component: $91fc7c7f5ab63f5b$var$UiPathAttendedRobots
};
if (!window.cognigyWebchatMessagePlugins) window.cognigyWebchatMessagePlugins = [];
window.cognigyWebchatMessagePlugins.push(uiPathPlugin);


//# sourceMappingURL=plugin.js.map
