import * as React from 'react';
import LineChart from './components/LineChart';

export type ChartType = 'line';
export interface ChartPluginMessage<T = any> {
    data: {
        _plugin: {
            type: 'chart',
            chartType: ChartType;
        } & T;
    }
}
export interface ChartPluginProps<T = any> {
    message: ChartPluginMessage<T>;
}

const Chart = (props: ChartPluginProps) => {
    const chart = (() => {
        switch (props.message.data._plugin.chartType) {
            case 'line':
                return <LineChart {...props} />        
        }

        return null;
    })();

    return (
        <div style={{ boxShadow: props.theme.shadow, overflow: 'hidden', backgroundColor: 'white' }}>
            {chart}
        </div>
    );
}

const chartPlugin = {
    match: 'chart',
    component: Chart,
    options: {
        fullwidth: true
    }
}

// @ts-ignore
if (!window.cognigyWebchatMessagePlugins) {
    // @ts-ignore
    window.cognigyWebchatMessagePlugins = []
}

// @ts-ignore
window.cognigyWebchatMessagePlugins.push(chartPlugin);

// line
// bar
// single value
// pie chart