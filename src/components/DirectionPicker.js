import React from 'react';
import classNames from 'classnames';

class DirectionPickerValue extends React.Component {
    render() {
        const direction = (this.props.value * 60) - 60;
        let arrowStyle = {
            transform: `rotate(${direction}deg)`
        }
        return(
            <span 
                className = {classNames({ 'selected': this.props.selected }, "direction-arrow")}
                onClick={this.props.onClick}
            >
                <img src="images/dir-picker-arrow.svg" style={arrowStyle} width="28"/>
            </span>
        );
    }
}

class DirectionPicker extends React.Component {
    handleClick(value) {
        this.props.onClick("direction", value);
    }

    render() {
        const arrows = [];
        for(let i = 0; i < 6; i++) {
            arrows.push(
                <DirectionPickerValue
                    onClick = {(value) => this.handleClick(i)}
                    value = {i}
                    selected = {this.props.value === i}
                />
            )
        }
        const direction = (this.props.value * 60) - 60;
        let arrowStyle = {
            transform: `rotate(${direction}deg)`
        }
        return (
            <span>
                {arrows}
            </span>
        );
    }
}

export default DirectionPicker;