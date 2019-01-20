import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import RuleEditor from './components/RuleEditor';
import Toolbox from './components/Toolbox';
import LLOutput from './components/LLOutput';
import * as serviceWorker from './serviceWorker';
import HexGrid from './components/HexGrid';
// import ToolboxCreate from './components/ToolboxCreate';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

class Game extends React.Component {
    //TODO: separate state to prevent entire game rerendering on a change.
    //grid shouldn't handle the emitters, etc.
    constructor(props) {
        super(props);
        this.state = {
            level: this.generateGrid(10, 8, 22),
            currentTool: 0,
            selectedCell: null,
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
            settings: {
                cols: 8,
                rows: 10,
                cellSize: 22,
            },
        };
    }

    generateGrid = (cols, rows, cellSize) => {
        const grid = [];
        const cellHeight = (cellSize * 2) * .75;
        const cellWidth = Math.sqrt(3) * cellSize;

        for(let i = 0; i < cols * rows; i ++) {
            const column = i % 8;
            const row = Math.floor(i / 8);
            grid.push({
                id: i,
                type: 0,
                rules: [],
                selected: false,
                column: column,
                row: row,
                gridX: row % 2 ? column * cellWidth : column * cellWidth + (cellWidth / 2),
                gridY: row * cellHeight + cellHeight / 2,
            });
        }
        return grid;
    }

    //helper function to update cell
    updateCell = (cellChanges, cellID) => {
        const level = this.state.level.slice();
        const updatedCell = Object.assign(level[cellID], cellChanges);
        level[cellID] = updatedCell;
        this.setState({level: level});
    }

    moveCell = (cellID, newLocationID) => {
        const level = this.state.level.slice();
        const cellMoving = level[cellID];
        const newLocation = level[newLocationID];
        newLocation.type = cellMoving.type;
        newLocation.rules = cellMoving.rules;
        cellMoving.type = 0;
        cellMoving.rules = [];
        this.setState({level: level});
    }

    cellMouseUp = (cellID) => {
        if(this.state.currentTool === 1){
            this.moveCell(this.state.cellDragging.draggingCellID, cellID);
        }
    }

    cellClick = (cellID) => {
        if(this.state.currentTool === 0){
            this.updateCell({
                selected: true,
            }, cellID);
            
            if(this.state.selectedCell !== null){
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
        //disabling. Shouldn't update whole state on cell hover!
        // if(this.state.currentTool === 2){
        //     this.updateCell({
        //         hover: true,
        //     }, cellID);

        //     if(this.state.hoverCell || this.state.hoverCell === 0){
        //         this.updateCell({
        //             hover: null,
        //         }, this.state.hoverCell);
        //     }
        //     this.setState({hoverCell: cellID});
        // }  
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
                    direction: 30,
                    visualDirection: 30,
                    audioSample:0
                }
                return rule;
            case 2:
                rule = {
                    points: 5,
                    color: 0,
                    direction: 210,
                    visualDirection: 210,
                    audioSample:0
                }
                return rule;
            case 3:
                rule = {
                    goal: 5,
                    points: 5,
                    color: 0,
                    audioSample:0
                }
                return rule;
            default:
                break;
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
            if(this.state.selectedCell !== null){
                this.updateCell({
                    selected: null,
                }, this.state.selectedCell);
                this.setState({selectedCell: null});
            }
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

    getRule = (cellID, ruleID) => {
        const level = this.state.level.slice();
        return(level[cellID].rules[ruleID]);
    }

    updateRule = (newRule, cellID, ruleID) => {
        const level = this.state.level.slice();
        level[cellID].rules[ruleID] = newRule;
        this.setState({ level : level });
    }

    // edit rule functions
    incrementShape = (rule) => {
        if(rule.points + 1 > 7){
            rule.points = 3;
        }else{
            rule.points +=1;
        }
        return rule;
    }

    incrementColor = (rule) => {
        if(rule.color + 1 >= this.state.colorList.length){
            rule.color = 0;
        }else{
            rule.color ++;
        }
        return rule;
    }

    incrementDirection = (rule) => {
        rule.direction = (rule.direction + 60) % 360;
        rule.visualDirection += 60;
        return rule;
    }

    incrementSound = (rule) => {
        rule.audioSample += 1;
        if(rule.audioSample > 8) rule.audioSample = 0;
        return rule;
    }

    incrementReleaseFrequency = (rule) => {
        (rule.releaseFrequency > 8) ? rule.releaseFrequency = 0 : rule.releaseFrequency += 1;
        return rule;
    }

    incrementTarget = (rule) => {
        (rule.goal > 8) ? rule.goal = 1 : rule.goal += 1;
        return rule;
    }

    //rule click functions
    onRuleClicked = (cellID, ruleID, elementID) => {
        let rule = this.getRule(cellID, ruleID);
        switch(elementID) {
            case 0:
                //shape clicked
                rule = this.incrementShape(rule);
                break;
            case 1:
                //color clicked
                rule = this.incrementColor(rule);
                break;
            case 2:
                //direction clicked
                rule = this.incrementDirection(rule);
                break;
            case 3:
                //sound clicked
                rule = this.incrementSound(rule);
                break;
            case 4:
                //release frequency
                rule = this.incrementReleaseFrequency(rule);
                break;
            case 5:
                //goal target
                rule = this.incrementTarget(rule);
                break;
            default:
                //nothing clicked
                break;
        }
        this.updateRule(rule, cellID, ruleID);
    }

    render() {
      return (
        <div className="wrapper">
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
                    <HexGrid
                        level = {this.state.level}
                        onMouseDown = {(cellID) => this.cellClick(cellID)}
                        onHover = {(cellID) => this.cellHover(cellID)}
                        onMouseUp = {(cellID) => this.cellMouseUp(cellID)}
                        currentlyAdding = {this.state.currentlyAdding}
                        currentTool = {this.state.currentTool}
                        settings = {this.state.settings}
                    ></HexGrid>
                    <LLOutput
                        level = {this.state.level}
                        width = {340}
                        height = {340}
                        colorList = {this.state.colorList}
                        cellSize = {this.state.cellSize}
                    />
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