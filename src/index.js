import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import RuleEditor from './components/RuleEditor';
import Toolbox from './components/Toolbox';
import LevelList from './components/LevelList';
import LLOutput from './components/LLOutput';
import * as serviceWorker from './serviceWorker';
import HexGrid from './components/HexGrid';

// import ToolboxCreate from './components/ToolboxCreate';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            level: [],
            grid: [],
            rules: [],
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
            ruleOptions: {
                colorList: ['#1dd1a1','#ee5253', '#feca57', '#54a0ff'],
                sampleList: ['C', 'D', 'E', 'F', 'G', 'A'],
            },
            settings: {
                cols: 16,
                rows: 16,
                cellSize: 16,
            },
            saveFiles: [],
        };
        this.state.level = this.generateLevel(this.state.settings.cols * this.state.settings.rows);
        this.state.grid = this.generateGrid(this.state.settings.cols, this.state.settings.rows);
    }

    generateLevel = (numCells) => {
        const level = [];
        for(let i = 0; i < numCells; i ++) {
            level.push({
                id: i,
                type: 0,
                rulesById: [],
            });
        }
        return level;
    }

    generateGrid = (cols, rows) => {
        const grid = [];
        for(let i = 0; i < cols * rows; i ++) {
            const column = i % cols;
            const row = Math.floor(i / cols);
            grid.push({
                id: i,
                column: column,
                row: row,
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
        newLocation.rulesById = cellMoving.rulesById;
        cellMoving.type = 0;
        cellMoving.rulesById = [];
        this.setState({level: level});
    }

    cellMouseUp = (cellID) => {
        if(this.state.currentTool === 1){
            this.moveCell(this.state.cellDragging.draggingCellID, cellID);
        }
    }

    cellClick = (cellID) => {
        if(this.state.currentTool === 0){
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
                //setRule and return ID?
                rulesById: [this.newRule(this.state.currentlyAdding)],
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
                    id: this.state.rules.length,
                    rule: {
                        releaseOnBeat: 1,
                        points: 5,
                        color: 0,
                        direction: 0,
                        audioSample:0,
                    }
                }
                this.state.rules.push(rule);
                return this.state.rules.length - 1;
            case 2:
                rule = {
                    id: this.state.rules.length,
                    rule: {
                        points: 5,
                        color: 0,
                        direction: 0,
                        audioSample:0,
                    }
                }
                this.state.rules.push(rule);
                return this.state.rules.length - 1;
            case 3:
                rule = {
                    id: this.state.rules.length,
                    rule: {
                        goal: 5,
                        points: 5,
                        color: 0,
                        audioSample:0,
                    }
                }
                this.state.rules.push(rule);
                return this.state.rules.length - 1;
            default:
                break;
        }
    }

    addNewRule = (cellID, cellType) => {
        const level = this.state.level.slice();
        level[cellID].rulesById.push(this.newRule(cellType));
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
        //get existing saved files from local stoarge, and parse back to a list
        let saveFiles = JSON.parse(localStorage.getItem('saveFiles'));
        const newSave = {
            grid: this.state.grid,
            level: this.state.level,
            rules: this.state.rules,
            settings: this.state.settings,
        }
        if(saveFiles === null){
            saveFiles = [];
        }    
        saveFiles.push(newSave);
        localStorage.setItem('saveFiles', JSON.stringify(saveFiles));
        this.setState({saveFiles: saveFiles});
    }

    loadLevel = (ID) => {
        const saveFiles = JSON.parse(localStorage.getItem('saveFiles'));
        this.setState({grid: saveFiles[ID].grid});
        this.setState({level: saveFiles[ID].level});
        this.setState({rules: saveFiles[ID].rules});
        this.setState({settings: saveFiles[ID].settings});
    }

    getRule = (cellID, ruleID) => {
        const rules = this.state.rules.slice();
        return(rules[ruleID]);
    }

    updateRule = (newRule, ruleID) => {
        const rules = this.state.rules.slice();
        rules[ruleID].rule = newRule;
        this.setState({ rules : rules });
    }

    // edit rule functions
    // incrementColor = (rule) => {
    //     if(rule.color + 1 >= this.state.ruleOptions.colorList.length){
    //         rule.color = 0;
    //     }else{
    //         rule.color ++;
    //     }
    //     return rule;
    // }

    // incrementDirection = (rule) => {
    //     rule.direction = (rule.direction + 1) % 6;
    //     rule.visualDirection += 60;
    //     return rule;
    // }

    // incrementSound = (rule) => {
    //     rule.audioSample += 1;
    //     if(rule.audioSample > 8) rule.audioSample = 0;
    //     return rule;
    // }

    // setReleaseBeat = (rule, value) => {
    //     //TODO: use number of beats in bar instead of 12
    //     rule.releaseOnBeat = value;
    //     return rule;
    // }

    // incrementTarget = (rule) => {
    //     (rule.goal > 8) ? rule.goal = 1 : rule.goal += 1;
    //     return rule;
    // }

    render() {
        this.state.saveFiles = JSON.parse(localStorage.getItem('saveFiles'));
        if(this.state.saveFiles === null){
            this.saveLevel();
        }

        const rulesInEditor = [];
        if(this.state.selectedCell){
            const selectedRulesById = this.state.level[this.state.selectedCell].rulesById;
            selectedRulesById.forEach((ruleId)=>{
                rulesInEditor.push(this.state.rules[ruleId]);
            });
        }
      
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
                    <LevelList 
                        saveFiles = {this.state.saveFiles}
                        onClick = {(levelID) => this.loadLevel(levelID)}
                    />
                    <button onClick={() => this.saveLevel(this.state.level)}>save</button>
                    <button onClick={(ID) => this.loadLevel(0)}>load</button>
                </div>

                
                <div className="level">
                    <HexGrid
                        selected = {this.state.selectedCell}
                        level = {this.state.level}
                        onMouseDown = {(cellID) => this.cellClick(cellID)}
                        onMouseUp = {(cellID) => this.cellMouseUp(cellID)}
                        currentlyAdding = {this.state.currentlyAdding}
                        currentTool = {this.state.currentTool}
                        settings = {this.state.settings}
                    ></HexGrid>
                    <LLOutput
                        level = {this.state.level}
                        grid = {this.state.grid}
                        rules = {this.state.rules}
                        colorList = {this.state.ruleOptions.colorList}
                        cols = {this.state.settings.cols}
                        rows = {this.state.settings.rows}
                        cellSize = {this.state.settings.cellSize}
                    />
                </div>
                
                <RuleEditor
                    rules = {rulesInEditor}
                    ruleOptions = {this.state.ruleOptions}
                    cellId = {this.state.selectedCell}
                    onClick = {(rule, ruleId) => this.updateRule(rule, ruleId)}
                    // addNewRule = {(cellID, cellType) => this.addNewRule(cellID, cellType)}
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