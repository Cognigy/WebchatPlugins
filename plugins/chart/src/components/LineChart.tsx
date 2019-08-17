import * as React from 'react';
import { LineChart, Line, Tooltip, LineProps, ContentRenderer, TooltipProps, LineType, ResponsiveContainer, YAxis, XAxis, XAxisProps, YAxisProps } from 'recharts';
import { ChartPluginProps } from '..';

export interface LineChartData {
    data: any;
    lines: LineProps[];
    tooltip?: boolean;
    xAxis: XAxisProps;
    yAxis: YAxisProps;
}

export default (props: ChartPluginProps<LineChartData>) => {
    const { data, lines, tooltip, xAxis, yAxis } = props.message.data._plugin;
    const { unitSize, primaryColor, shadow } = props.theme;

    const $lines = (lines || [])
        .map(line => <Line key={'' + line.dataKey} stroke={primaryColor} {...line} />);

    const $tooltip = tooltip
        ? <Tooltip />
        : null;

    const $xAxis = <XAxis minTickGap={unitSize * 2} {...xAxis} />;
    const $yAxis = <YAxis {...yAxis} />

    return (
        <ResponsiveContainer width='100%' height={200}>
            <LineChart
                data={data}
                margin={{
                    left: unitSize * 2,
                    right: unitSize * 2,
                    top: unitSize,
                    bottom: unitSize
                }}
            >
                {$lines}
                {$tooltip}
                {$xAxis}
                {$yAxis}
            </LineChart>
        </ResponsiveContainer>
    )
}