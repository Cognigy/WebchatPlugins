import * as React from 'react';
import ComposedChart from './components/ComposedChart';
import PieChart from './components/PieChart';
import Single from './components/Single';

export type ChartType = 'line' | 'bar' | 'pie' | 'single';

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
            case 'bar':
                return <ComposedChart {...props} />;
                
            case 'pie':
                return <PieChart {...props} />;

            case 'single':
                return <Single {...props} />;
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