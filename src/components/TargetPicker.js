import React from 'react';
import classNames from 'classnames';

class TargetPickerValue extends React.Component {
    render() {
        return (
            <span 
                className = {classNames("int", { 'selected':this.props.selected })}
                onClick = {this.props.onClick}
            >{this.props.value + 1}</span>
        );
    }
}

class TargetPicker extends React.Component {
    handleClick(value) {
        this.props.onClick("goal", value);
    }

    render() {
        const targetOptions = [];
        for( let i = 0; i < 6; i++ ){
            targetOptions.push(
                <TargetPickerValue
                    value = {i}
                    selected = {this.props.value === i}
                    onClick = {(targetPickerValue) => this.handleClick(i)}
                    key = {i}
                />
            );
        }
        return (
            <span 
                className="target-picker"
            >
                {targetOptions}
            </span>
        );
    }
}

export default TargetPicker;