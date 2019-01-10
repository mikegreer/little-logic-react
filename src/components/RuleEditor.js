import React from 'react';
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
            <svg className="drop noselect" version="1.1" id="Layer_1" x="0px" y="0px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 55.9 79.7">
                <path 
                    style={style}
                    d="M47.3,29.5c-3.8-6-9.1-14.2-15.8-27.5c-1.3-2.7-5.8-2.7-7.1,0C17.7,15.3,12.5,23.5,8.6,29.5
    C3.2,37.9,0,42.9,0,51.7c0,15.4,12.5,28,27.9,28s27.9-12.5,27.9-28C55.9,42.9,52.7,37.9,47.3,29.5z">
                </path>
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
                <svg style={arrowStyle} className="direction-arrow noselect" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 46.9 46.9">
                    <g>
                        <path d="M45.8,31.2c0.6,0.7,0.3,1.3-0.6,1.3h-8.5c-0.9,0-1.7,0.8-1.7,1.7v7.3c0,0.9-0.8,1.7-1.7,1.7H13.5c-0.9,0-1.7-0.8-1.7-1.7
                            v-7.4c0-0.9-0.8-1.7-1.7-1.7H1.7c-0.9,0-1.2-0.6-0.6-1.3L22.3,6.3c0.6-0.7,1.6-0.7,2.2,0L45.8,31.2z"/>
                    </g>
                </svg>
            </div>
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
            <svg className="drum" onClick={() => this.props.onClick(this.props.cellID, this.props.ruleID)} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 46.9 46.9">
                <g>
                    <path className="st0" d="M45.2,39.6c0,3.1-2.6,5.7-5.7,5.7H7.1c-3.1,0-5.7-2.6-5.7-5.7V7.1c0-3.1,2.6-5.7,5.7-5.7h32.4
                        c3.1,0,5.7,2.6,5.7,5.7V39.6z"/>
                </g>
                <line className="st1" x1="1.4" y1="16" x2="45.2" y2="16"/>
                <line className="st1" x1="1.4" y1="30.7" x2="45.2" y2="30.7"/>
                <line className="st1" x1="30.6" y1="1.4" x2="30.6" y2="45.3"/>
                <line className="st1" x1="16" y1="1.4" x2="16" y2="45.3"/>
                <rect className="drum-marker" x={positions.x} y={positions.y} rx="4" ry="4" width="10" height="10"/>
            </svg>
        );
    }
}

class PolyPicker extends React.Component {
    render(){
        function generatePath(pointsCount) {
            var path = "";
            var rotationOffset = 0;
            var angleUnit = (360/pointsCount) * Math.PI / 180;
            var pointAngle;
            for(var i = 1; i <= pointsCount; i++){
                if(i < pointsCount){
                    pointAngle = angleUnit * i + rotationOffset;
                }else{
                    pointAngle = angleUnit * pointsCount + rotationOffset;
                }
                var px = Math.cos(pointAngle) * 50 + 50;
                var py = Math.sin(pointAngle) * 50 + 50;
                if(path === ""){
                    path = "M" + px + " " + py + " ";
                }
                path += "L " + px + " " + py + " ";
            }
            path += "Z";
            return path;
        };
        return(
        <svg
            className="shape-select" 
            viewBox="0 0 100 100"
            onClick={() => this.props.onClick(this.props.cellID, this.props.ruleID)}
        ><path d={generatePath(this.props.points)}></path></svg>
        )
    }
}

function EmitterRule (props) {
    const index = props.index;
    const cellID = props.cellID;
    return (
        <span className="rule">
            <p>Every (int picker) beats</p>
            <span className="editor-label">Make a new</span>
            <PolyPicker
                points = {props.rule.points}
                onClick = {() => props.onClick(cellID, index, 0)}
                cellID = {cellID}
                ruleID = {index}
            ></PolyPicker>
            <ColorPicker
                color = {props.rule.color}
                colorList={props.colorList}
                onClick = {() => props.onClick(cellID, index, 1)}
                cellID = {cellID}
                ruleID = {index}
            ></ColorPicker>
            <span className="editor-label">, </span>
            <br />
            <span className="editor-label">and push it</span>
            <DirectionPicker
                direction = {props.rule.direction}
                visualDirection = {props.rule.visualDirection}
                onClick = {() => props.onClick(cellID, index, 2)}
                cellID = {cellID}
                ruleID = {index}
            ></DirectionPicker>
            <span className="editor-label">, </span>
            <br />
            <span className="editor-label">and play a sound</span>
            <SamplePicker
                audioSample = {props.rule.audioSample}
                onClick = {() => props.onClick(cellID, index, 3)}
                cellID = {cellID}
                ruleID = {index}
            ></SamplePicker>
        </span>
    );
}

function RouterRule (props) {
    const index = props.index;
    const cellID = props.cellID;
    return (
        <span key={index} className="rule">
            <span className="editor-label">if</span>
            <PolyPicker
                points = {props.rule.points}
                onClick = {() => props.onClick(cellID, index, 0)}
                cellID = {cellID}
                ruleID = {index}
            ></PolyPicker>
            <span className="editor-label">and</span>
            <ColorPicker
                color = {props.rule.color}
                colorList={props.colorList}
                onClick = {() => props.onClick(cellID, index, 1)}
                cellID = {cellID}
                ruleID = {index}
            ></ColorPicker>
            <span className="editor-label">, </span>
            <br />
            <span className="editor-label">then</span>
            <DirectionPicker
                direction = {props.rule.direction}
                visualDirection = {props.rule.visualDirection}
                onClick = {() => props.onClick(cellID, index, 2)}
                cellID = {cellID}
                ruleID = {index}
            ></DirectionPicker>
            <span className="editor-label">and</span>
            <SamplePicker
                audioSample = {props.rule.audioSample}
                onClick = {() => props.onClick(cellID, index, 3)}
                cellID = {cellID}
                ruleID = {index}
            ></SamplePicker>
        </span>
    );
}

function GoalRule (props) {
    const index = props.index;
    const cellID = props.cellID;
    return (<span className="rule">
        <p>Target (int editor)</p>
        <span className="editor-label">If</span>
            <PolyPicker
                points = {props.rule.points}
                onClick = {() => props.onClick(cellID, index, 0)}
                cellID = {cellID}
                ruleID = {index}
            ></PolyPicker>
            <span className="editor-label">and</span>
            <ColorPicker
                color = {props.rule.color}
                colorList={props.colorList}
                onClick = {() => props.onClick(cellID, index, 1)}
                cellID = {cellID}
                ruleID = {index}
            ></ColorPicker>
            <br />
            <span className="editor-label">Add (int editor) to target,</span>
            <br />
            <span className="editor-label">and play</span>
            <SamplePicker
                audioSample = {props.rule.audioSample}
                onClick = {() => props.onClick(cellID, index, 3)}
                cellID = {cellID}
                ruleID = {index}
            ></SamplePicker>
    </span>);
}

function RenderRule (props) {
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
                        onClick={props.onGateRuleClicked}
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
                        onClick={props.onGateRuleClicked}
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
                            onClick={props.onGateRuleClicked}
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
        const cell = this.props.level[this.props.cellID];
        let rules = cell.rules ? cell.rules : [];
        return(
            <div className="rule-editor">
                <RenderRule 
                    cellType = {cell.type}
                    rules = {cell.rules}
                    cellID = {this.props.cellID}
                    onGateRuleClicked = {this.props.onGateRuleClicked}
                    colorList = {this.props.colorList}
                />
                <div className="rule-button-container">
                    <button
                        className = {classNames({ 'hidden': rules.length < 1 }, "new-rule-button")}
                        onClick = {() => this.props.addNewRule(this.props.cellID)}
                    >new rule</button>
                </div>
            </div>
        );
    }
}

export default RuleEditor;