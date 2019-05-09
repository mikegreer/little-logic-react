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
                <img src="images/dir-picker-arrow.svg" style={arrowStyle} width="28" alt={"set direction to "+direction} />
            </span>
        );
    }
}

class DirectionPickerDisplay extends React.Component {
    render() {
        const direction = (this.props.value * 60) - 60;
        let arrowStyle = {
            transform: `rotate(${direction}deg)`
        }
        return(
            <span 
                className = {classNames("direction-picker-display")}
                
                onClick={this.props.onClick}
            >
                <img src="images/dir-picker-arrow.svg" style={arrowStyle} width="28" alt={"set direction to "+direction} />
            </span>
        );
    }
}

class DirectionPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionsOpen: false,
        }
    }

    handleClick(value) {
        this.props.onClick("direction", value);
        this.setState({optionsOpen: false});
    }

    toggleOptions() {
        this.setState({optionsOpen: !this.state.optionsOpen});
    }

    render() {
        const arrows = [];
        let currentValue = "";
        for(let i = 0; i < 6; i++) {
            let angle = i;
            if(angle > 2){
                angle = 8 - i;
            }
            arrows.push(
                <DirectionPickerValue
                    onClick = {(value) => this.handleClick(angle)}
                    value = {angle}
                    selected = {this.props.value === angle}
                    key = {angle}
                />
            )
            if(this.props.value === i) {
                currentValue = <DirectionPickerDisplay value = {i} />
            }
        }
        return (
            <span className="dropdown-container" onClick = { () => this.toggleOptions() }>
                {currentValue}
                {this.state.optionsOpen && <span className = "dropdown-picker dropdown-picker-large">
                    {arrows}
                </span>}        
            </span>
        );
    }
}

export default DirectionPicker;