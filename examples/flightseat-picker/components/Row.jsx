import React, { PropTypes as T } from 'react';
import Seat from './Seat.jsx';
import Blank from './Blank.jsx';
import RowNumber from './RowNumber.jsx';
import cx from 'classnames';

export default class Row extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            over: false
        };
    }

    handleMouseMove = (over) => {
        this.setState({ over });
    }

    render() {
        const { over } = this.state;
        const { rowNumber, isSelected} = this.props;
        const bold = over || isSelected;
        const className = cx(
            'Row',
            { 'Row--enabled': !isSelected },
            { 'Row--selected': isSelected }
        );
        return (
            <div
                className={className}
                onMouseOut={this.handleMouseMove.bind(this, false)}
                onMouseOver={this.handleMouseMove.bind(this, true)}
            >
                <RowNumber rowNumber={rowNumber} bold={bold} />
                {this.props.children}
            </div>
        );
    }
}
