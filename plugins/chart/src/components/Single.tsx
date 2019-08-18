import * as React from 'react';
import { useSpring, animated } from 'react-spring';
import { ChartPluginProps } from '..';

export interface SingleData {
    value: number;
    unit: string;
}

export default (props: ChartPluginProps<SingleData>) => {
    const { value, unit } = props.message.data._plugin;
    const { unitSize, primaryColor } = props.theme;

    const { springValue } = useSpring({
        from: {
            springValue: 0
        },
        to: {
            springValue: value
        }
    });

    const wrapperStyles = React.useMemo(() => ({
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: primaryColor,
        padding: unitSize * 2,
        fontSize: unitSize * 6
    }), []);

    return (
        <div style={wrapperStyles}>
            <animated.span>{springValue.interpolate(x => x.toFixed(2))}</animated.span>
            {unit && (
                <span>{' '}{unit}</span>
            )}
        </div>
    )
}