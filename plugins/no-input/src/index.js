const noInputPlugin = {
    type: 'rule',
    rule: () => true,
    component: () =>  null
};

if (!window.cognigyWebchatInputPlugins) {
    window.cognigyWebchatInputPlugins = []
}

window.cognigyWebchatInputPlugins.push(noInputPlugin);