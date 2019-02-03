import React from 'react';
import './intPicker.css';
import './ruleEditor.css';
import MultiView from './MultiView.js';
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
        const options = this.props.options || ['#cccccc'];
        const optionElements = [];
        this.props.options.forEach((option, i) => {
            const selected = this.props.value === i ? true : false; 
            optionElements.push(
                <ColorPickerValue 
                    selected = {selected}
                    className="color-option"
                    onClick={() => {this.handleClick(i)}}
                    color = {option}
                />
            );
        });
        const style = {
            fill: options[this.props.value],
        }
        return (
            <span>
                {optionElements}
            </span>
        );
    }
}

class TargetPicker extends React.Component {
    render() {
        return(
            "Target picker."
        );
    }
}

// class DirectionPickerValue extends React.Component {
//     render() {
//         return();
//     }
// }

class DirectionPicker extends React.Component {
    render() {
        const direction = (this.props.value * 60) - 60;
        let arrowStyle = {
            transform: `rotate(${direction}deg)`
        }
        return (
            <div 
                className="direction-arrow-wrapper"
                onClick={()=>this.props.onClick("direction", this.props.value + 1 > 5 ? 0 : this.props.value + 1)}
            >
                <img src="images/dir-picker-arrow.svg" style={arrowStyle} width="22"/>
            </div>
        );
    }
}

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

class SamplePicker extends React.Component {
    render() {
        return (
            <span 
                className="sample-picker"
                onClick = {() => this.props.onClick("audioSample", this.props.value + 1 > 5 ? 0 : this.props.value + 1)}
            >
                {this.props.value}
            </span>
        );
    }
}

class Rule extends React.Component {
    handleClick = (component, value) => {
        this.props.rule.rule[component] = value;
        this.props.onClick(this.props.rule);
    }

    render() {
        const rule = this.props.rule.rule;
        const ruleComponents = [];
        for (var key in rule) {
            if (!rule.hasOwnProperty(key)) continue;
            switch(key){
                case("releaseOnBeat"):
                    ruleComponents.push(
                        <div className="rule-component">
                            <BeatPicker
                                value = {rule[key]}
                                onClick = {(component, value) => this.handleClick(component, value)}
                                max = {12}
                                min = {1}
                            />
                        </div>
                    );
                    break;
                case("color"):
                    ruleComponents.push(
                        <div className="rule-component">
                            <ColorPicker 
                                value = {rule[key]}
                                options = {this.props.ruleOptions.colorList}
                                onClick = {(component, value) => this.handleClick(component, value)}
                            />
                        </div>
                    );
                    break;
                case("direction"):
                    ruleComponents.push(
                        <div className="rule-component">
                            <DirectionPicker 
                                value = {rule[key]}
                                onClick = {(component, value) => this.handleClick(component, value)}
                            />
                        </div>
                    );
                    break;
                case("audioSample"):
                    ruleComponents.push(
                        <div className="rule-component">
                            <SamplePicker 
                                value = {rule[key]}
                                onClick = {(component, value) => this.handleClick(component, value)}
                            />
                        </div>
                    );
                    break;
                case("goal"):
                    ruleComponents.push(
                        <div className="rule-component">
                            <TargetPicker 
                                value = {rule[key]}
                                max = {12}
                                min = {1}
                                onClick = {(component, value) => this.handleClick(component, value)}
                            />
                        </div>
                    );
                    break;
                default:
                    break;
            }
        }
        return(
            <span className="rule">
                {ruleComponents}
            </span>
        ); 
    }
}

class RuleEditor extends React.Component {
    handleClick = (rule) => {
        this.props.onClick(rule.rule, rule.id);
    }
    render() {
        const output = [];
        this.props.rules.forEach((rule, id) => {
            output.push(<Rule 
                rule = {rule}
                ruleOptions = {this.props.ruleOptions}
                onClick = {(rule) => this.handleClick(rule)}
            />)
        });
        return(
            <div className="rule-editor">
                <div className="rule-button-container">
                    <button
                        className = {classNames({ 'hidden': this.props.rules.length < 1 }, "new-rule-button")}
                        onClick = {() => this.props.addNewRule(this.props.cellId)}
                    >new rule</button>
                </div>
            <MultiView>
                {output}
            </MultiView>
            </div>
        );
    }
}

export default RuleEditor;