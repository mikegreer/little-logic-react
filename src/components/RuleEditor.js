import React from 'react';
import './intPicker.css';
import './ruleEditor.css';
import ColorPicker from './ColorPicker.js';
import DirectionPicker from './DirectionPicker.js';
import SamplePicker from './SamplePicker.js';
import BeatPicker from './BeatPicker.js';
import MultiView from './MultiView.js';
import classNames from 'classnames';

//TODO: move remaining picker UIs to separate files.
class TargetPicker extends React.Component {
    render() {
        return(
            "Target picker."
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

    changeRuleView = (id) => {
        console.log(id);
        this.props.updateSelectedRule(id, this.props.cellId);
    }

    render() {
        console.log(this.props.rules);
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
                {/* <div className="rule-button-container"> */}
                    <button
                        className = {classNames({ 'hidden': this.props.rules.length < 1 }, "new-rule-button")}
                        onClick = {() => this.props.addNewRule(this.props.cellId)}
                    >new rule</button>
                {/* </div> */}
                <MultiView
                    selectedView = {this.props.selectedRule}
                    onClick = {(id) => this.changeRuleView(id)}
                >
                    {output}
                </MultiView>
            </div>
        );
    }
}

export default RuleEditor;