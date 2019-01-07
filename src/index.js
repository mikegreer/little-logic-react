import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import classNames from 'classnames';
import RuleEditor from './components/RuleEditor';
import Slider from './components/Slider';
import Toolbox from './components/Toolbox';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

class Emitter extends React.Component {
    render() {
        return (
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 46 46">
                <g>
                    <path className="st0" d="M45.2,39.6c0,3.1-2.6,5.7-5.7,5.7H7.1c-3.1,0-5.7-2.6-5.7-5.7V7.1c0-3.1,2.6-5.7,5.7-5.7h32.4
                        c3.1,0,5.7,2.6,5.7,5.7V39.6z"/>
                </g>
            </svg>
        );
    }
}

class Router extends React.Component {
    render() {
        return (
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="10px" y="10px" viewBox="-10 -10 66 66">
                <g>
                    <path className="st0" d="M45.2,39.6c0,3.1-2.6,5.7-5.7,5.7H7.1c-3.1,0-5.7-2.6-5.7-5.7V7.1c0-3.1,2.6-5.7,5.7-5.7h32.4
                        c3.1,0,5.7,2.6,5.7,5.7V39.6z"/>
                </g>
            </svg>
        );
    }
}

class Goal extends React.Component {
    render() {
        return (
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="10px" y="10px" viewBox="0 0 100 100">
                <g>
                    <circle cx="50" cy="50" r="40" stroke="black" fill="none" strokeWidth="10"  />
                </g>
            </svg>
        );
    }
}

class Square extends React.Component {
    render() {
        return (
            <button
                className={classNames({ 'selected': this.props.selected }, "square")}
                // className={this.props.selected ? "selected":"square2"}
                onClick={(cellIndex) => this.props.onClick(this.props.cellIndex)}
            >
                {this.props.cellType === 1 ? <Emitter></Emitter> : null}
                {this.props.cellType === 2 ? <Router></Router> : null}
                {this.props.cellType === 3 ? <Goal></Goal> : null}
            </button>
        );
    }
}

class LogicGrid extends React.Component {
    render() {
        const grid = [];
        this.props.level.forEach((cell, index) => {
            grid.push(<Square 
                key={index}
                cellIndex={index}
                cellType={cell.type}
                onClick={(cellID) => this.props.onClick(cellID)}
                selected={cell.selected}
                ></Square>);
        });
        const emitters = [];
        this.props.emitters.forEach((emitter, index) => {
            emitters.push(
                <Emitter
                    cellID={emitter.cellID}
                    releaseFrequency={emitter.releaseFrequency}
                    releaseRules={emitter.releaseRules}
                ></Emitter>)
        });
        return(
            <div className="grid">{grid}</div>
        );
    }
}

class LayoutToggle extends React.Component {
    render () {
        return (
            <span className="layout-edit-toggle">
                Editing layout
                <Slider
                    isChecked = {this.props.editingLevel}
                    onClick = {() => this.props.onClick()}
                ></Slider>
            </span>
        );
    }
}

class PaintBox extends React.Component {
    render() {
        const buttons = [];
        this.props.cellTypes.forEach((type, index) => {
            buttons.push(
                <span 
                    key = {type.label}
                    className={classNames({ "selected": type.id === this.props.currentlyAdding}, "editor-button")}
                    onClick={()=>this.props.onClick(type.id)}
                >{type.label}</span>
            );
        });
        return(
            <div className="paintbox">{buttons}</div>
        );
    }
}

class Game extends React.Component {
    constructLevel = (width, height, emitters) => {
        const level = [];
        // level.length = width * height;
        for(let i = 0; i < width * height; i ++){
            level.push({
                id: i,
                type: 0,
                rules: [],
                selected: false,
            })
        }
        emitters.forEach((emitter, index) => {
            level[emitter.cellIndex].type = 1;
        });
        return level;
    }

    constructor(props) {
        super(props);
        this.state = {
            level: this.constructLevel(10, 10, []),
            editingLevel: false,
            currentTool: 0,
            selectedCell: 0,
            currentlyAdding: 0,
            cellTypes: [
                {id: 0, label: "Blank"},
                {id: 1, label: "Emitter"},
                {id: 2, label: "Router"},
                {id: 3, label: "Gate"},
            ],
            emitters: [],
            colorList: ['#1dd1a1','#ee5253', '#feca57', '#54a0ff'],
        };
    }

    //helper function to update cell
    updateCell = (cellChanges, cellID) => {
        const level = this.state.level.slice();
        const updatedCell = Object.assign(level[cellID], cellChanges);
        level[cellID] = updatedCell;
        this.setState({level: level});
    }

    //TODO: helper function to update rule within cell

    cellClick = (cellID) => {
        if(this.state.currentTool === 2){
            this.updateCell({
                type: this.state.currentlyAdding,
                rules: [
                    {
                        points: 5,
                        color: 0,
                        direction: 45,
                        visualDirection: 45,
                        audioSample:0
                    }
                ],
            }, cellID);
        }else{
            this.updateCell({
                selected: true,
            }, cellID);

            if(this.state.selectedCell || this.state.selectedCell === 0){
                this.updateCell({
                    selected: null,
                }, this.state.selectedCell);
            }
            this.setState({selectedCell: cellID});
        }
    }

    setType = (type) => {
        this.setState({currentlyAdding: type});
    }

    toggleEditMode = () => {
        this.setState({editingLevel: !this.state.editingLevel});
    }

    //TODO: merge poly, color, direction, and sample click handlers into one?
    polyClick = (cellID, ruleID) => {
        const level = this.state.level.slice();
        let points = level[cellID].rules[ruleID].points;
        if(points + 1 > 7){
            points = 3;
        }else{
            points +=1;
        }
        level[cellID].rules[ruleID].points = points;
        this.setState({level: level});
    }

    colorPickerClick = (cellID, ruleID) => {
        const level = this.state.level.slice();
        let colorIndex = level[cellID].rules[ruleID].color;
        if(colorIndex + 1 >= this.state.colorList.length){
            colorIndex = 0;
        }else{
            colorIndex ++;
        }
        level[cellID].rules[ruleID].color = colorIndex;
        this.setState({ level : level });
    }

    directionPickerClick = (cellID, ruleID) => {
        //TODO: direction object with direction, visualDirection, and direction label
        const level = this.state.level.slice();
        let direction = level[cellID].rules[ruleID].direction;
        direction = (direction + 45) % 360;
        let visualDirection = level[cellID].rules[ruleID].visualDirection + 45;
        level[cellID].rules[ruleID].direction = direction;
        level[cellID].rules[ruleID].visualDirection = visualDirection;
        this.setState({ level : level });
    }

    samplePickerClick = (cellID, ruleID) => {
        const level = this.state.level.slice();
        let audioSample = level[cellID].rules[ruleID].audioSample;
        audioSample += 1;
        if(audioSample > 8) audioSample = 0;
        level[cellID].rules[ruleID].audioSample = audioSample;
        
        this.setState({ level : level });
    }

    addNewRule = (cellID) => {
        const level = this.state.level.slice();
        level[cellID].rules.push(
            {
                points: 5,
                color: 0,
                direction: 45,
                visualDirection: 45,
                audioSample:0
            }
        );
        this.setState({level: level});
    }

    toolboxClick = (toolID) => {
        this.setState({currentTool: parseInt(toolID)});
    }

    render() {
      return (
        <div className="wrapper">
        <div className="game">
            <div className="level-editor">
                <Toolbox
                    onClick = {(toolID) => this.toolboxClick(toolID)}
                ></Toolbox>
                <LayoutToggle
                    editingLevel={this.state.editingLevel}
                    onClick = {() => this.toggleEditMode()}
                ></LayoutToggle>
                <PaintBox
                    cellTypes = {this.state.cellTypes}
                    currentlyAdding = {this.state.currentlyAdding}
                    onClick = {(type) => this.setType(type)}    
                ></PaintBox>
            </div>

            <div className="level">
                <LogicGrid
                    level = {this.state.level}
                    emitters = {this.state.emitters}
                    onClick = {(cellID) => this.cellClick(cellID)}
                ></LogicGrid>
            </div>
            
            
            <RuleEditor 
                level = {this.state.level}
                cell = {this.state.selectedCell}
                colorList = {this.state.colorList}
                addNewRule = {(cellID, ruleID) => this.addNewRule(cellID, ruleID)}
                onPolyClick = {(cellID, ruleID) => this.polyClick(cellID, ruleID)}
                onColorPickerClick = {(cellID, ruleID) => this.colorPickerClick(cellID, ruleID)}
                onDirectionPickerClick = {(cellID, ruleID) => this.directionPickerClick(cellID, ruleID)}
                onSamplePickerClick = {(cellID, ruleID) => this.samplePickerClick(cellID, ruleID)}
            ></RuleEditor>
        </div>
        </div>
      );
    }
}
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);