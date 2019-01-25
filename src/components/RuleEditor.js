import React from 'react';
import './intPicker.css';
import './ruleEditor.css';
import classNames from 'classnames';

class ColorPicker extends React.Component {    
    render() {
        const colorList = this.props.colorList || ['#cccccc'];
        const style = {
            fill: colorList[this.props.color],
        }
        return (
            <div
                className="color-picker"
                onClick={(cellID) => this.props.onClick(cellID, this.props.ruleID)}
            >
                
                <svg className="drop noselect" x="0px" y="0px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="20" style={style} />
                </svg>
            </div>
        );
    }
}

class DirectionPicker extends React.Component {
    render() {
        let arrowStyle = {
            transform: `rotate(${this.props.visualDirection}deg)`
        }
        return (
            <div className="direction-arrow-wrapper" onClick={() => this.props.onClick(this.props.cellID, this.props.ruleID)}>
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

class IntPickerValue extends React.Component {
    render() {
        return (
            <span
                className = {classNames({ 'selected': this.props.selected }, "int")}
                onClick = {() => this.props.onClick()}
            >
                {this.props.value}
            </span>
        );
    }
}
class IntPicker extends React.Component {
    handleClick(value) {
        this.props.onClick(this.props.cellID, this.props.ruleID, 4, value);
    }

    render() {
        const intValues = [];
        for( let i = 0; i < 25 - this.props.min; i ++ ){
            const selected = this.props.value === i ? true : false; 
            intValues.push(
                <IntPickerValue
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
    samplePosition = (value) => {
        var xGrid = (value % 3) * 14.5 + 4;
        var yGrid = (Math.floor(value/3) % 3) * 14.5 + 3.5;
        return {
            x: xGrid,
            y: yGrid,
        }
    }

    render() {
        let positions = this.samplePosition(this.props.audioSample);
        return (
            <span className="sample-picker" onClick={() => this.props.onClick(this.props.cellID, this.props.ruleID)}>
                {this.props.audioSample}
            </span>
        );
    }
}


function EmitterRule (props) {
    const index = props.index;
    const cellID = props.cellID;

    return (
        <span className="rule">
            <span className="rule-component">
                <span className="editor-label">On beat</span>        
                <IntPicker
                    value = {props.rule.releaseOnBeat}
                    onClick = {(cellID, index, cellType, value) => props.onClick(cellID, index, cellType, value)}
                    cellID = {cellID}
                    ruleID = {index}
                    max = {12}
                    min = {1}
                    elementID = {4}
                />
            </span>
            <span className="rule-component">
                <span className="editor-label">make a new</span>
                <ColorPicker
                    color = {props.rule.color}
                    colorList={props.colorList}
                    onClick = {() => props.onClick(cellID, index, 1)}
                    cellID = {cellID}
                    ruleID = {index}
                ></ColorPicker>
                <span className="editor-label">pulse, </span>
            </span>
            <span className="rule-component">
                <span className="editor-label">push it</span>
                <DirectionPicker
                    direction = {props.rule.direction}
                    visualDirection = {props.rule.visualDirection}
                    onClick = {() => props.onClick(cellID, index, 2)}
                    cellID = {cellID}
                    ruleID = {index}
                ></DirectionPicker>
                <span className="editor-label">and play a sound</span>
                <SamplePicker
                    audioSample = {props.rule.audioSample}
                    onClick = {() => props.onClick(cellID, index, 3)}
                    cellID = {cellID}
                    ruleID = {index}
                ></SamplePicker>
            </span>
        </span>
    );
}

function RouterRule (props) {
    const index = props.index;
    const cellID = props.cellID;
    return (
        <span key={index} className="rule">
            <span className="rule-component">
                <span className="editor-label">if a</span>
                <ColorPicker
                    color = {props.rule.color}
                    colorList={props.colorList}
                    onClick = {() => props.onClick(cellID, index, 1)}
                    cellID = {cellID}
                    ruleID = {index}
                ></ColorPicker>
                <span className="editor-label">hits me, </span>
            </span>
            <span className="rule-component">
                <span className="editor-label">then push it</span>
                <DirectionPicker
                    direction = {props.rule.direction}
                    visualDirection = {props.rule.visualDirection}
                    onClick = {() => props.onClick(cellID, index, 2)}
                    cellID = {cellID}
                    ruleID = {index}
                ></DirectionPicker>
            </span>
            <span className="rule-component">
                <span className="editor-label">and play a sound</span>
                <SamplePicker
                    audioSample = {props.rule.audioSample}
                    onClick = {() => props.onClick(cellID, index, 3)}
                    cellID = {cellID}
                    ruleID = {index}
                ></SamplePicker>
            </span>
        </span>
    );
}

function GoalRule (props) {
    const index = props.index;
    const cellID = props.cellID;
    return (<span className="rule">
        <span className="editor-label">I need</span>
            <IntPicker 
                value = {props.rule.goal}
                onClick = {() => props.onClick(cellID, index, 5)}
                cellID = {cellID}
                ruleID = {index}
            />
            <ColorPicker
                color = {props.rule.color}
                colorList={props.colorList}
                onClick = {() => props.onClick(cellID, index, 1)}
                cellID = {cellID}
                ruleID = {index}
            ></ColorPicker>
            <br />
            <span className="editor-label">when one hits me, </span>
            <br />
            <span className="editor-label">play a sound</span>
            <SamplePicker
                audioSample = {props.rule.audioSample}
                onClick = {() => props.onClick(cellID, index, 3)}
                cellID = {cellID}
                ruleID = {index}
            ></SamplePicker>
    </span>);
}

function RenderRule (props) {
    //TODO: stop cellType being stored as a string.
    switch(parseInt(props.cellType)){
        case 1:
            //emitter
            const emitterRulesOutput = [];
            props.rules.forEach((rule, index) => {
                emitterRulesOutput.push(
                    <EmitterRule 
                        rule={rule}
                        key={index}
                        index={index}
                        cellID={props.cellID}
                        onClick={props.onRuleClicked}
                        colorList={props.colorList}
                    />
                );
            });
            return (<span>{emitterRulesOutput}</span>);
        case 2:
            //router
            const routerRulesOutput = [];
            props.rules.forEach((rule, index) => {
                routerRulesOutput.push(
                    <RouterRule 
                        rule={rule}
                        key={index}
                        index={index}
                        cellID={props.cellID}
                        onClick={props.onRuleClicked}
                        colorList={props.colorList}
                    />
                );
            });
            return (<span>{routerRulesOutput}</span>);
        case 3:
            //goal
            const goalRulesOutput = [];
            props.rules.forEach((rule, index) => {
                goalRulesOutput.push(<GoalRule
                            rule={rule}
                            key={index}
                            index={index}
                            cellID={props.cellID}
                            onClick={props.onRuleClicked}
                            colorList={props.colorList}
                        />
                );
            });
            return goalRulesOutput;
        default:
            return <span>no rules</span>;
    }
}

class RuleEditor extends React.Component {
    render() {
        const currentCell = this.props.cell ? this.props.cell : 0;
        const cell = currentCell;
        let rules = cell.rules ? cell.rules : [];
        return(
            <div className="rule-editor">
                <RenderRule 
                    cellType = {cell.type}
                    rules = {cell.rules}
                    cellID = {this.props.cellID}
                    onRuleClicked = {this.props.onRuleClicked}
                    colorList = {this.props.colorList}
                />
                <div className="rule-button-container">
                    <button
                        className = {classNames({ 'hidden': rules.length < 1 }, "new-rule-button")}
                        onClick = {() => this.props.addNewRule(this.props.cellID, this.props.cell.type)}
                    >new rule</button>
                </div>
            </div>
        );
    }
}

export default RuleEditor;