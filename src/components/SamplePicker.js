import React from 'react';
import classNames from 'classnames';

class SamplePickerValue extends React.Component {
    render() {
        return (
            <span 
                className = {classNames("int", { 'selected':this.props.selected })}
                onClick = {this.props.onClick}
            >{this.props.value + 1}</span>
        );
    }
}

class SamplePicker extends React.Component {
    handleClick(value) {
        this.props.onClick("audioSample", value);
    }

    render() {
        const sampleOptions = [];
        for( let i = 0; i < 6; i++ ){
            sampleOptions.push(
                <SamplePickerValue
                    value = {i}
                    selected = {this.props.value === i}
                    onClick = {(samplePickerValue) => this.handleClick(i)}
                />
            );
        }
        return (
            <span 
                className="sample-picker"
            >
                {sampleOptions}
            </span>
        );
    }
}

export default SamplePicker;