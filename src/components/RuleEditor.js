import React from 'react';
import './intPicker.css';
import './ruleEditor.css';
import ColorPicker from './ColorPicker.js';
import DirectionPicker from './DirectionPicker.js';
import SamplePicker from './SamplePicker.js';
import BeatPicker from './BeatPicker.js';
import TargetPicker from './TargetPicker.js';
import MultiView from './MultiView.js';
import classNames from 'classnames';

class Rule extends React.Component {
    handleClick = (component, value) => {
        this.props.rule.rule[component] = value;
        this.props.onClick(this.props.rule);
        console.log(this.props.rule);
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
                            if( pulse is 
                            <ColorPicker 
                                value = {rule[subrule]}
                                options = {this.props.ruleOptions.colorList}
                                onClick = {(component, value) => this.handleClick(component, value)}
                            />
                             ) {'\{'}
                        </div>
                    );
                    break;
                case("direction"):
                    subCountKey ++;
                    ruleComponents.push(
                        <div className="rule-component" key = {subCountKey}>
                            <span className="rule-inset">
                                pulse direction = 
                                <DirectionPicker 
                                    value = {rule[subrule]}
                                    onClick = {(component, value) => this.handleClick(component, value)}
                                />
                            </span><br/>
                            {'\}'}
                        </div>
                    );
                    break;
                // case("audioSample"):
                //     subCountKey ++;
                //     ruleComponents.push(
                //         <div className="rule-component" key = {subCountKey}>
                //             <SamplePicker 
                //                 value = {rule[subrule]}
                //                 onClick = {(component, value) => this.handleClick(component, value)}
                //             />
                //         </div>
                //     );
                //     break;
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
                
                {/* <MultiView
                    selectedView = {this.props.selectedRule}
                    onClick = {(id) => this.changeRuleView(id)}
                > */}
                    {output}
                    <div className="rule-component">
                            <span className={classNames({"hidden" : this.props.rules.length > 3 || this.props.rules.length < 1},"new-rule")} onClick = {() => this.props.addNewRule(this.props.cellId)}>
                                new rule
                            </span>
                    </div>
                {/* </MultiView> */}
            </div>
        );
    }
}

export default RuleEditor;