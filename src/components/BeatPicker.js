import React from 'react';
import classNames from 'classnames';

class BeatPickerValue extends React.Component {
    render() {
        return (
            <span 
                className = {classNames({ 'selected': this.props.selected }, "int")}
                onClick = {this.props.onClick}
            >
                {this.props.value + 1}
            </span>
        );
    }
}
class BeatPicker extends React.Component {
    handleClick(value) {
        this.props.onClick("releaseOnBeat", value);
    }

    render() {
        const intValues = [];
        for( let i = 0; i <= 12 - this.props.min; i ++ ){
            const selected = this.props.value === i ? true : false; 
            intValues.push(
                <BeatPickerValue
                    key = {i}
                    selected = {selected}
                    value = {i}
                    onClick={() => this.handleClick(i)}
                />
            )
        }
        return (
            <span className="int-picker">
                {intValues}
            </span>
        );
    }
}

export default BeatPicker;