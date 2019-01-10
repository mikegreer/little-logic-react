import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import classNames from 'classnames';
import RuleEditor from './components/RuleEditor';
import Toolbox from './components/Toolbox';
import LLOutput from './components/LLOutput';
import * as serviceWorker from './serviceWorker';
// import ToolboxCreate from './components/ToolboxCreate';

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

class Ghost extends React.Component {
    render() {
        return (
            <span className="ghostElement">
                {this.props.currentlyAdding === 1 ? "emit":null}
                {this.props.currentlyAdding === 2 ? "route":null}
                {this.props.currentlyAdding === 3 ? "goal":null}
            </span>
        );
    }
}

class Square extends React.Component {
    render() {
        return (
            <button
                className={classNames(
                    { 'selected': this.props.selected },
                    { 'hover': this.props.hover },
                    "square")}
                style={
                    {cursor: this.props.currentTool === 1 ? 'move':'default'}
                }
                onMouseDown={(cellIndex) => this.props.onMouseDown(this.props.cellIndex)}
                onMouseOver={(cellIndex) => this.props.onHover(this.props.cellIndex)}
                onMouseUp={(cellIndex) => this.props.onMouseUp(this.props.cellIndex)}
            >
                {this.props.hover ? <Ghost currentlyAdding={this.props.currentlyAdding}></Ghost> : null}
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
                onMouseDown={(cellID) => this.props.onMouseDown(cellID)}
                onHover={(cellID) => this.props.onHover(cellID)}
                onMouseUp={(cellID) => this.props.onMouseUp(cellID)}
                selected={cell.selected}
                hover={cell.hover}
                currentlyAdding={this.props.currentlyAdding}
                currentTool={this.props.currentTool}
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            level: this.constructLevel(10, 10, []),
            currentTool: 0,
            selectedCell: 0,
            hoverCell: 0,
            currentlyAdding: 1,
            cellDragging: {
                isDragging: false,
                draggingCellID: null
            },
            cellTypes: [
                {id: 1, label: "emitter"},
                {id: 2, label: "router"},
                {id: 3, label: "goal"},
            ],
            emitters: [],
            colorList: ['#1dd1a1','#ee5253', '#feca57', '#54a0ff'],
        };
    }

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

    //helper function to update cell
    updateCell = (cellChanges, cellID) => {
        const level = this.state.level.slice();
        const updatedCell = Object.assign(level[cellID], cellChanges);
        level[cellID] = updatedCell;
        this.setState({level: level});
    }

    //TODO: helper function to update rule within cell

    cellMouseUp = (cellID) => {
        if(this.state.currentTool === 1){
            const originID = this.state.cellDragging.draggingCellID;
            const level = this.state.level.slice();
            const cellMoving = level[originID];
            this.updateCell(cellMoving, cellID);
            this.updateCell({
                type: 0,
                rules: [],
            }, originID);
        }
    }

    cellClick = (cellID) => {
        if(this.state.currentTool === 0){
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
        if(this.state.currentTool === 1){
            //start dragging cell
            const cellDragging = {
                isDragging: true,
                draggingCellID: cellID
            }
            this.setState({cellDragging: cellDragging});
        }
        if(this.state.currentTool === 2){
            this.updateCell({
                type: this.state.currentlyAdding,
                rules: [this.newRule(this.state.currentlyAdding)],
            }, cellID);
        }else if(this.state.currentTool === 3){
            this.updateCell({
                type: 0,
                rules: [],
            }, cellID);
        }else{
            
        }
    }

    cellHover = (cellID) => {
        if(this.state.currentTool === 2){
            this.updateCell({
                hover: true,
            }, cellID);

            if(this.state.hoverCell || this.state.hoverCell === 0){
                this.updateCell({
                    hover: null,
                }, this.state.hoverCell);
            }
            this.setState({hoverCell: cellID});
        }  
    }
    
    setCreateType = (type) => {
        this.setState({currentlyAdding: type});
    }

    newRule = (cellType) => {
        let rule = null;
        switch(cellType){
            case 1:
                rule = {
                    releaseFrequency: 6,
                    points: 5,
                    color: 0,
                    direction: 45,
                    visualDirection: 45,
                    audioSample:0
                }
                return rule;
            case 2:
                rule = {
                    points: 5,
                    color: 0,
                    direction: 45,
                    visualDirection: 45,
                    audioSample:0
                }
                return rule;
            case 3:
                rule = {
                    goal: 5,
                    points: 5,
                    color: 0,
                    direction: 45,
                    visualDirection: 45,
                    audioSample:0
                }
                return rule;
        }
    }

    addNewRule = (cellID, cellType) => {
        const level = this.state.level.slice();
        level[cellID].rules.push(this.newRule(cellType));
        this.setState({level: level});
    }

    toolboxClick = (toolID) => {
        this.setState({currentTool: parseInt(toolID)});
        if(toolID !== 0){
            this.setState({selectedCell: 0});
        }
    }

    saveLevel = (level) => {
        let levels = JSON.parse(localStorage.getItem('levels'));
        if(levels === null){
            levels = [];
            localStorage.setItem('levels', JSON.stringify(levels));
        }
        levels.push(level);
        localStorage.setItem('levels', JSON.stringify(levels));
    }

    loadLevel = () => {
        const levels = JSON.parse(localStorage.getItem('levels'));
        this.setState({level: levels[0]});
    }

    // edit rule functions
    incrementShape = (cellID, ruleID) => {
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

    incrementColor = (cellID, ruleID) => {
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

    incrementDirection = (cellID, ruleID) => {
        const level = this.state.level.slice();
        let direction = level[cellID].rules[ruleID].direction;
        direction = (direction + 45) % 360;
        let visualDirection = level[cellID].rules[ruleID].visualDirection + 45;
        level[cellID].rules[ruleID].direction = direction;
        level[cellID].rules[ruleID].visualDirection = visualDirection;
        this.setState({ level : level });
    }

    incrementSound = (cellID, ruleID) => {
        const level = this.state.level.slice();
        let audioSample = level[cellID].rules[ruleID].audioSample;
        audioSample += 1;
        if(audioSample > 8) audioSample = 0;
        level[cellID].rules[ruleID].audioSample = audioSample;
        this.setState({ level : level });
    }

    incrementReleaseFrequency = (cellID, ruleID) => {
        const level = this.state.level.slice();
        let rf = level[cellID].rules[ruleID].releaseFrequency;
        (rf > 8) ? rf = 0 : rf += 1;
        level[cellID].rules[ruleID].releaseFrequency = rf;
        this.setState({ level : level });
    }

    incrementTarget = (cellID, ruleID) => {
        const level = this.state.level.slice();
        let goal = level[cellID].rules[ruleID].goal;
        (goal > 8) ? goal = 1 : goal += 1;
        console.log(goal);
        level[cellID].rules[ruleID].goal = goal;
        this.setState({ level : level });
    }

    //rule click functions
    onRuleClicked = (cellID, ruleID, elementID) => {
        //shape
        switch(elementID) {
            case 0:
                //shape clicked
                this.incrementShape(cellID, ruleID);
                break;
            case 1:
                //color clicked
                this.incrementColor(cellID, ruleID);
                break;
            case 2:
                //direction clicked
                this.incrementDirection(cellID, ruleID);
                break;
            case 3:
                //sound clicked
                this.incrementSound(cellID, ruleID);
                break;
            case 4:
                //release frequency
                this.incrementReleaseFrequency(cellID, ruleID);
                break;
            case 5:
                //goal target
                this.incrementTarget(cellID, ruleID);
                break;
            default:
                //nothing clicked
                break;
        }
    }

    render() {
      return (
        <div className="wrapper">
            <LLOutput />
            <div className="game">
                <div className="level-editor">
                    <Toolbox
                        onClick = {(toolID) => this.toolboxClick(toolID)}
                        selected = {this.state.currentTool}
                        cellTypes = {this.state.cellTypes}
                        currentlyAdding = {this.state.currentlyAdding}
                        setCreateType = {(type) => this.setCreateType(type)}
                    ></Toolbox>
                <button onClick={() => this.saveLevel(this.state.level)}>save</button>
                <button onClick={() => this.loadLevel()}>load</button>
                </div>

                <div className="level">
                    <LogicGrid
                        level = {this.state.level}
                        emitters = {this.state.emitters}
                        onMouseDown = {(cellID) => this.cellClick(cellID)}
                        onHover = {(cellID) => this.cellHover(cellID)}
                        onMouseUp = {(cellID) => this.cellMouseUp(cellID)}
                        currentlyAdding = {this.state.currentlyAdding}
                        currentTool = {this.state.currentTool}
                    ></LogicGrid>
                </div>
                
                <RuleEditor
                    cell = {this.state.level[this.state.selectedCell]}
                    cellID = {this.state.selectedCell}
                    colorList = {this.state.colorList}
                    onRuleClicked = {(cellID, ruleID, elementID) => this.onRuleClicked(cellID, ruleID, elementID)}
                    addNewRule = {(cellID, cellType) => this.addNewRule(cellID, cellType)}
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