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
class ColorPickerDisplay extends React.Component {
    render() {
        const style = {
            backgroundColor: this.props.color,
        }
        return(
            <span className="color-picker-display">
                <div
                    className = "drop"
                    onClick = {this.props.onClick}
                    style={style}
                />
                <div
                    className = {classNames("color-picker-shadow", "noselect")}
                />
            </span>
        );
    }
}
class ColorPicker extends React.Component {  
    constructor(props) {
        super(props);
        this.state = {
            optionsOpen: false,
        }
    }

    handleClick(value) {
        this.props.onClick("color", value);
        this.setState({optionsOpen: false});
    }

    toggleOptions() {
        this.setState({optionsOpen: !this.state.optionsOpen});
    }

    render() {
        const optionElements = [];
        let currentValue = "";
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
            if(selected) {
                currentValue = <ColorPickerDisplay color = {option} />
            }
        });
        return (
            <span className="dropdown-container" onClick = { () => this.toggleOptions() }>
                {currentValue}
                {this.state.optionsOpen && <span className = "dropdown-picker">
                    {optionElements}
                </span>}
                
            </span>
        );
    }
}

export default ColorPicker;