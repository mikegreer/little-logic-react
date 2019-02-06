import React from 'react';
import classNames from 'classnames';

class ColorPickerValue extends React.Component {
    render() {
        const style = {
            backgroundColor: this.props.color,
        }
        return(
            <span className="color-picker-value">
                <div
                    className = {classNames({ 'selected': this.props.selected }, "drop", "noselect")}
                    onClick = {this.props.onClick}
                    style={style}
                />
                <div
                    className = {classNames("color-picker-shadow", "noselect")}
                />
                <img
                    src="images/selected-cross.svg"
                    className = {classNames({ 'selected': this.props.selected }, "cross")}
                    alt="selected"
                />
            </span>
        );
    }
}
class ColorPicker extends React.Component {  
    handleClick(value) {
        this.props.onClick("color", value);
    }

    render() {
        const optionElements = [];
        this.props.options.forEach((option, i) => {
            const selected = this.props.value === i ? true : false; 
            optionElements.push(
                <ColorPickerValue 
                    selected = {selected}
                    key={i}
                    className="color-option"
                    onClick={() => {this.handleClick(i)}}
                    color = {option}
                />
            );
        });
        return (
            <span>
                {optionElements}
            </span>
        );
    }
}

export default ColorPicker;