import * as React from 'react';

const Counter = () => {
    const [count, setCount] = React.useState(0);
    const increment = React.useCallback(() => setCount(count + 1), [count]);

    return (
        <button
            type='button'
            onClick={increment}
        >
            clicked {count} times
        </button>
    )
}

const counterPlugin = {
    match: 'counter',
    component: Counter
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(counterPlugin);