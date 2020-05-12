const noInputPlugin = {
    type: 'rule',
    rule: () => {   
        console.log('rule');

        return true;
    },
    component: () => {
        console.log('component');

        return null;
    }
};

if (!window.cognigyWebchatInputPlugins) {
    window.cognigyWebchatInputPlugins = []
}

window.cognigyWebchatInputPlugins.push(noInputPlugin);