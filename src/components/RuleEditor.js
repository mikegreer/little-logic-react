import React from 'react';
import './intPicker.css';
import './ruleEditor.css';
import classNames from 'classnames';

class ColorPicker extends React.Component {    
    render() {
        const options = this.props.options || ['#cccccc'];
        const style = {
            fill: options[this.props.value],
        }
        return (
            <div className="color-picker" onClick={()=>this.props.onClick("color", this.props.value + 1 < this.props.options.length ? this.props.value + 1 : 0)}>
                <svg className="drop noselect" x="0px" y="0px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="20" style={style} />
                </svg>
            </div>
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
class DirectionPicker extends React.Component {
    render() {
        const direction = (this.props.value * 60) + 30;
        let arrowStyle = {
            transform: `rotate(${direction}deg)`
        }
        return (
            <div 
                className="direction-arrow-wrapper"
                onClick={()=>this.props.onClick("direction", this.props.value + 1 > 5 ? 0 : this.props.value + 1)}
            >
                <svg style={arrowStyle} className="direction-arrow noselect" x="0px" y="0px" viewBox="0 0 46.9 46.9">
                    <g>
                        <path d="M45.8,31.2c0.6,0.7,0.3,1.3-0.6,1.3h-8.5c-0.9,0-1.7,0.8-1.7,1.7v7.3c0,0.9-0.8,1.7-1.7,1.7H13.5c-0.9,0-1.7-0.8-1.7-1.7
                            v-7.4c0-0.9-0.8-1.7-1.7-1.7H1.7c-0.9,0-1.2-0.6-0.6-1.3L22.3,6.3c0.6-0.7,1.6-0.7,2.2,0L45.8,31.2z"/>
                    </g>
                </svg>
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
                {this.props.value}
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
        for( let i = 0; i < 25 - this.props.min; i ++ ){
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
        console.log("sample");
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
        console.log(component, value);
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
            <span>
                {ruleComponents}
            </span>
        ); 
    }
}

class RuleEditor extends React.Component {
    handleClick = (rule) => {
        console.log(rule);
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
                {output}
                <div className="rule-button-container">
                    <button
                        className = {classNames({ 'hidden': this.props.rules.length < 1 }, "new-rule-button")}
                        onClick = {() => this.props.addNewRule(this.props.cellID, this.props.cell.type)}
                    >new rule</button>
                </div>
            </div>
        );
    }
}

export default RuleEditor;