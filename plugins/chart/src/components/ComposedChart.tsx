import * as React from 'react';
import { Line, Tooltip, LineProps, TooltipProps, ResponsiveContainer, YAxis, XAxis, XAxisProps, YAxisProps, ComposedChart, BarProps, ComposedChartProps, Bar } from 'recharts';
import { ChartPluginProps } from '..';

export interface ComposedChartData {
    lines: LineProps[];
    bars: BarProps[];
    chart: ComposedChartProps;
    tooltip?: TooltipProps;
    xAxis: XAxisProps;
    yAxis: YAxisProps;
}

export default (props: ChartPluginProps<ComposedChartData>) => {
    const { chart, lines, bars, tooltip, xAxis, yAxis } = props.message.data._plugin;
    const { unitSize, primaryColor } = props.theme;

    const $lines = (lines || [])
        .map(line => <Line key={'line-' + line.dataKey} stroke={primaryColor} {...line} />);

    const $bars = (bars || [])
        .map(bar => <Bar key={'bar-' + bar.dataKey} fill={primaryColor} {...bar} />);

    const $tooltip = tooltip
        ? <Tooltip {...tooltip} />
        : null;

    const $xAxis = <XAxis minTickGap={unitSize * 2} {...xAxis} />;
    const $yAxis = <YAxis {...yAxis} />

    return (
        <ResponsiveContainer width='100%' height={200}>
            <ComposedChart
                margin={{
                    left: unitSize * 2,
                    right: unitSize * 2,
                    top: unitSize,
                    bottom: unitSize
                }}
                {...chart}
            >
                {$lines}
                {$bars}
                {$tooltip}
                {$xAxis}
                {$yAxis}
            </ComposedChart>
        </ResponsiveContainer>
    )
}