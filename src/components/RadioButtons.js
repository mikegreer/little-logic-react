import React from 'react';
import './radiobuttons.css';
import classNames from 'classnames';

class RadioButton extends React.Component {
    render () {
        return (
            <span
                className = {classNames({ 'selected': this.props.selected }, "radio-button")}
                onClick = {this.props.onClick}
            ></span>
        );
    }
}

class RadioButtons extends React.Component {
    render () {
        const buttons = [];
        for(let i = 0; i < this.props.optionCount; i ++){
            // console.log(this.props.value);
            buttons.push(
                <RadioButton
                    key = {i}
                    selected = {this.props.value === i}
                    onClick = {(viewID) => this.props.onClick(i)}
                />
            )
        }
        return (
            <div className="radio-button-container">
                {buttons}
            </div>
        )
    }
}

export default RadioButtons;