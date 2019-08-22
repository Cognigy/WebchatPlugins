import * as React from 'react';
import { Line, Tooltip, LineProps, TooltipProps, ResponsiveContainer, YAxis, XAxis, XAxisProps, YAxisProps, ComposedChart, BarProps, ComposedChartProps, Bar, PieChartProps, PieProps, Pie, PieChart, CellProps, Cell } from 'recharts';
import { ChartPluginProps } from '..';

interface PiePropsWithCells extends PieProps {
    cells?: CellProps[];
}

export interface PieChartData {
    chart: PieChartProps;
    pies: PiePropsWithCells[];
    tooltip?: TooltipProps;
}

export default (props: ChartPluginProps<PieChartData>) => {
    const { chart, pies, tooltip } = props.message.data._plugin;
    const { unitSize, primaryColor } = props.theme;

    const $pies = (pies || []).map(({ cells, ...pie }) => (
        <Pie key={'pie-' + pie.dataKey} fill={primaryColor} {...pie}>
            {(cells || []).map((cell, index) => <Cell key={'cell-' + index} {...cell} />)}
        </Pie>)
    )

    const $tooltip = tooltip
        ? <Tooltip {...tooltip} />
        : null;

    return (
        <ResponsiveContainer width='100%' height={200}>
            <PieChart
                margin={{
                    left: unitSize * 2,
                    right: unitSize * 2,
                    top: unitSize,
                    bottom: unitSize
                }}
                {...chart}
            >
                {$pies}
                {$tooltip}
            </PieChart>
        </ResponsiveContainer>
    )
}