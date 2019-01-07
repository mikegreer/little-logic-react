import React from 'react';
import classNames from 'classnames';

// class RuleOutput extends React.Component {
//     render() {
//         return (
//             <div>{this.props.points}, {this.props.color}, {this.props.direction}, {this.props.audioSample}</div>
//         );
//     }
// }

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

class RuleEditor extends React.Component {  
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         pointsLabel: this.shapeToString(parseInt(this.props.points)),
    //         directionLabel: this.angleToCompass(this.props.direction),
    //         // visualDirection: this.props.direction || 90,
    //     };
    // }

    shapeToString = (points) => {
        let shapeLabel;
        if(points === 3){
            shapeLabel = "triangle";
        }else if(points === 4){
            shapeLabel = "square";
        }else if(points === 5){
            shapeLabel = "pentagon";
        }else if(points === 6){
            shapeLabel = "hexagon";
        }else if(points === 7){
            shapeLabel = "heptagon";
        }
        return shapeLabel;
    }

    // angleToCompass = (angle) => {
    //     let compassLabels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    //     return compassLabels[Math.floor(angle / 45)];
    // }

    render() {
        const cell = this.props.level[this.props.cell];
        let rules = cell.rules ? cell.rules : [];

        const ruleEditors = [];
        rules.forEach((rule, index) => {
            ruleEditors.push(
                <span key = {index} className = "rule">
                    <span className="editor-label">if</span>
                    <PolyPicker
                        points = {rule.points}
                        onClick = {() => this.props.onPolyClick(this.props.cell, index)}
                        cellID = {this.props.cell}
                        ruleID = {index}
                    ></PolyPicker>
                    <span className="editor-label">and</span>
                    <ColorPicker
                        color = {rule.color}
                        colorList={this.props.colorList}
                        onClick = {() => this.props.onColorPickerClick(this.props.cell, index)}
                        cellID = {this.props.cell}
                        ruleID = {index}
                    ></ColorPicker>
                    <span className="editor-label">then</span>
                    <DirectionPicker
                        direction = {rule.direction}
                        visualDirection = {rule.visualDirection}
                        onClick = {() => this.props.onDirectionPickerClick(this.props.cell, index)}
                        cellID = {this.props.cell}
                        ruleID = {index}
                    ></DirectionPicker>
                    <span className="editor-label">and</span>
                    <SamplePicker
                        audioSample = {rule.audioSample}
                        onClick = {() => this.props.onSamplePickerClick(this.props.cell, index)}
                        cellID = {this.props.cell}
                        ruleID = {index}
                    ></SamplePicker>
                </span>
            )
        });
        

        return(
            <div className="rule-editor">
                {ruleEditors}
                <div className="rule-button-container">
                <button
                    className = {classNames({ 'hidden': rules.length < 1 }, "new-rule-button")}
                    onClick = {() => this.props.addNewRule(this.props.cell)}
                >new rule</button>
                </div>
                {/* <RuleOutput
                    points = {this.state.pointsLabel}
                    color = {this.state.color}
                    direction = {this.state.directionLabel}
                    audioSample = {this.state.audioSample}
                ></RuleOutput> */}
            </div>
        );
    }
}

export default RuleEditor;