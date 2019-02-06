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
        let subCountKey = 0;
        for (var subrule in rule) {
            if (!rule.hasOwnProperty(subrule)) continue;
            switch(subrule){
                case("releaseOnBeat"):
                    subCountKey ++;
                    ruleComponents.push(
                        <div className="rule-component" key = {subCountKey}>
                            <BeatPicker
                                value = {rule[subrule]}
                                onClick = {(component, value) => this.handleClick(component, value)}
                                max = {12}
                                min = {1}
                            />
                        </div>
                    );
                    break;
                case("color"):
                    subCountKey ++;
                    ruleComponents.push(
                        <div className="rule-component" key = {subCountKey}>
                            <ColorPicker 
                                value = {rule[subrule]}
                                options = {this.props.ruleOptions.colorList}
                                onClick = {(component, value) => this.handleClick(component, value)}
                            />
                        </div>
                    );
                    break;
                case("direction"):
                    subCountKey ++;
                    ruleComponents.push(
                        <div className="rule-component" key = {subCountKey}>
                            <DirectionPicker 
                                value = {rule[subrule]}
                                onClick = {(component, value) => this.handleClick(component, value)}
                            />
                        </div>
                    );
                    break;
                case("audioSample"):
                    subCountKey ++;
                    ruleComponents.push(
                        <div className="rule-component" key = {subCountKey}>
                            <SamplePicker 
                                value = {rule[subrule]}
                                onClick = {(component, value) => this.handleClick(component, value)}
                            />
                        </div>
                    );
                    break;
                case("goal"):
                    subCountKey ++;
                    ruleComponents.push(
                        <div className="rule-component" key = {subCountKey}>
                            <TargetPicker 
                                value = {rule[subrule]}
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
            <span className="rule" key={this.props._key}>
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
        const output = [];
        this.props.rules.forEach((rule, id) => {
            output.push(<Rule 
                rule = {rule}
                ruleOptions = {this.props.ruleOptions}
                key = {id}
                _key = {id}
                onClick = {(rule) => this.handleClick(rule)}
            />)
        });
        return(
            <div className="rule-editor">
                <button
                    className = {classNames({ 'hidden': this.props.rules.length < 1 }, "new-rule-button")}
                    onClick = {() => this.props.addNewRule(this.props.cellId)}
                >new rule</button>
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