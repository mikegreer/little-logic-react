import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './level-editor.css';
import App from './App';
import RuleEditor from './components/RuleEditor';
import SettingsEditor from './components/SettingsEditor';
import Toolbox from './components/Toolbox';
import LevelLoader from './components/LevelLoader';
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
            currentlyAdding: 1,
            cellDragging: {
                isDragging: false,
                draggingCellID: null
            },
            cellTypes: [
                {id: 1, label: <span><span className='hotkey-hint'>e</span>mitter</span>},
                {id: 2, label: <span><span className='hotkey-hint'>r</span>outer</span>},
                {id: 3, label: <span><span className='hotkey-hint'>g</span>oal</span>},
                {id: 4, label: <span><span className='hotkey-hint'>h</span>ole</span>},
            ],
            emitters: [],
            ruleOptions: {
                colorList: ['#ff007a','#f9ff00', '#00b7ff', '#ff9100'],
                sampleList: ['arp (1).wav', 'arp (2).wav', 'arp (3).wav', 'arp (4).wav', 'crash (1).wav', 'crash (2).wav'],
            },
            settings: {
                cols: 6,
                rows: 11,
                cellSize: 25,
            },
            saveFiles: [],
            puzzleId: 0,
        };
        this.cutOffCells = [];
        this.state.level = this.generateLevel(this.state.settings.cols, this.state.settings.rows);
        this.state.grid = this.generateGrid(this.state.settings.cols, this.state.settings.rows);
    }

    clearGrid = () => {
        this.cutOffCells = [];
        const level = [];
        for(let i = 0; i < this.state.settings.cols * this.state.settings.rows; i ++) {
            level.push({
                id: i,
                type: 0,
                rulesById: [],
                selectedRule: 0,
            });
        }
        this.setState({
            emitters: [],
            level: level,
            grid: this.generateGrid(this.state.settings.cols, this.state.settings.rows),
            rules: [],
        });
    }

    hexPosToArrayPos = (col, row, cols, rows) => {
        let arrayPos = null;
        if(col < cols && row < rows){
            arrayPos = row * cols + col;
        }
        return arrayPos;
    }

    generateLevel = (cols, rows) => {
        const numCells = cols * rows;
        const currentLevel = this.state.level.slice();
        const level = [];
        for(let i = 0; i < numCells; i ++) {
            level.push({
                id: i,
                type: 0,
                rulesById: [],
                selectedRule: 0,
            });
        }
        //move any pre-existing cells into new level map
        currentLevel.forEach((cell) => {
            if(cell.type !== 0){
                const newPos = this.hexPosToArrayPos(cell.column, cell.row, cols, rows);
                if(newPos !== null) {
                    cell.id = newPos;
                    level[newPos] = cell;
                } else {
                    this.cutOffCells.push(cell);
                }
            }
        });
        //restore cutoff cells when map is made bigger
        const cutOffCellsToRemove = [];
        this.cutOffCells.forEach((cell, id) => {
            if(cell.column < cols && cell.row  < rows){
                const newPos = this.hexPosToArrayPos(cell.column, cell.row, cols, rows);
                cell.id = newPos;
                level[newPos] = cell;
                cutOffCellsToRemove.push(id);
            }
        });
        cutOffCellsToRemove.sort(function(a,b){ return b - a; });
		for (var i = 0; i < cutOffCellsToRemove.length; i++) {
			this.cutOffCells.splice(cutOffCellsToRemove[i], 1);
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
        if(this.state.currentTool === 0 || this.state.currentTool === 2){
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
        }
        if(this.state.currentTool === 3){
            this.updateCell({
                type: 0,
                rules: [],
            }, cellID);
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
                    id: this.state.rules.length,
                    rule: {
                        releaseOnBeat: 1,
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
                        color: 0,
                        audioSample:0,
                    }
                }
                this.state.rules.push(rule);
                return this.state.rules.length - 1;
            case 4:
                rule = {
                    id: this.state.rules.length,
                    rule: {
                        damage: 5,
                    }
                }
                this.state.rules.push(rule);
                return this.state.rules.length - 1;
            default:
                break;
        }
    }

    getCellById = (id) => {
        return this.state.level[id];
    }

    addNewRule = (cellId) => {
        const level = this.state.level.slice();
        console.log(this.getCellById(cellId));
        const cellType = this.getCellById(cellId).type; 
        level[cellId].rulesById.push(this.newRule(cellType));
        level[cellId].selectedRule = level[cellId].rulesById.length - 1;
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

    loadLevel = (id) => {
        const saveFiles = JSON.parse(localStorage.getItem('saveFiles'));
        this.setState({
            grid: saveFiles[id].grid,
            level: saveFiles[id].level,
            rules: saveFiles[id].rules,
            settings: saveFiles[id].settings
        });
        this.cutOffCells = [];
    }

    loadLevelFromFile = (levelJSON) => {
        this.setState({
            grid: levelJSON.grid,
            level: levelJSON.level,
            rules: levelJSON.rules,
            settings: levelJSON.settings
        });
        this.cutOffCells = [];
    }

    deleteSave = (id) => {
        let saveFiles = JSON.parse(localStorage.getItem('saveFiles'));
        const removed = saveFiles.splice(id, 1);
        localStorage.setItem('saveFiles', JSON.stringify(saveFiles));
        this.setState({saveFiles: saveFiles});
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

    updateGoalCount = (ruleId, goal) => {
        const rules = this.state.rules.slice();
        rules[ruleId].goal = goal;
        this.setState({ rules : rules });
    }

    updateSettings = (settings) => {
        //calculate cellSize to fit width
        const cellSizeToFitWidth = 285 / Math.sqrt(3) / (settings.cols + 0.5);
        const cellSizeToFitHeight = 435 /(settings.rows + 0.5) / 2 / 0.75;
        if(cellSizeToFitWidth > cellSizeToFitHeight){
            settings.cellSize = cellSizeToFitHeight;
        }else{
            settings.cellSize = cellSizeToFitWidth;
        }
        const newLevel = this.generateLevel(settings.cols, settings.rows);
        const newGrid = this.generateGrid(settings.cols, settings.rows);
        this.setState({
            settings : settings,
            level : newLevel,
            grid : newGrid,
            selectedCell : null,
        });
    }

    updateSelectedRule = (id, cell) => {
        const cells = this.state.level.slice();
        cells[cell].selectedRule = id;
        this.setState({ level : cells });
    }

    handleKeyPress = (event) => {
        let currentCellId = 0;
        let currentRuleId = 0;
        let newRuleId = 0;
        let ruleCount = 0;
        switch (event.key) {
            case 's':
                this.toolboxClick(0);
                break;
            case 'm':            
                this.toolboxClick(1);
                break;
            case 'e':
                this.toolboxClick(2);
                this.setCreateType(1);
                break;
            case 'r':
                this.toolboxClick(2);
                this.setCreateType(2);
                break;
            case 'g':
                this.toolboxClick(2);
                this.setCreateType(3);
                break;
            case 'h':
                this.toolboxClick(2);
                this.setCreateType(4);
                break;
            case 'c':
                this.toolboxClick(3);
                break;
            case 'p':
                console.log('play / pause');
                break;
            case 'ArrowLeft':
                currentCellId = this.state.selectedCell;
                currentRuleId = this.state.level[currentCellId].selectedRule;
                newRuleId = currentRuleId - 1 > 0 ? currentRuleId - 1 : 0;
                if(newRuleId !== currentRuleId){
                    this.updateSelectedRule(newRuleId, currentCellId);
                }
                break;
            case 'ArrowRight':
                currentCellId = this.state.selectedCell;
                currentRuleId = this.state.level[currentCellId].selectedRule;
                ruleCount = this.state.level[currentCellId].rulesById.length;
                newRuleId = currentRuleId + 1 < ruleCount ? currentRuleId + 1 : currentRuleId;
                if(newRuleId !== currentRuleId){
                    this.updateSelectedRule(newRuleId, currentCellId);
                }
                break;
            default:
                break;
        }
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
        this.setState({saveFiles: JSON.parse(localStorage.getItem('saveFiles'))});
    }    
    
    handlePuzzleComplete = (puzzleId) => {
        // console.log("COMPLETE!");
        this.setState({ puzzleId : puzzleId + 1 });
    }

    render() {
        //crete blank savefile if no local storage exists.
        // if(this.state.saveFiles === null){
        //     this.saveLevel();
        // }

        const rulesInEditor = [];
        let selectedRule = null;
        if(this.state.selectedCell || this.state.selectedCell === 0){
            const selectedRulesById = this.state.level[this.state.selectedCell].rulesById;
            selectedRulesById.forEach((ruleId)=>{
                rulesInEditor.push(this.state.rules[ruleId]);
            });
            selectedRule = this.state.level[this.state.selectedCell].selectedRule;
        }
        
        return (
        <div className="wrapper">
            <div className="game"> 
                <div className="level-editor">
                    <LevelLoader
                        loadLevelFromFile = {(levelJSON) => this.loadLevelFromFile(levelJSON)}
                    />
                    <SettingsEditor
                        cols = {this.state.settings.cols}
                        rows = {this.state.settings.rows}
                        cellSize = {this.state.settings.cellSize}
                        updateSettings = {(settings) => this.updateSettings(settings)}
                    />
                    <LevelList 
                        saveFiles = {this.state.saveFiles}
                        deleteSave = {(id) => this.deleteSave(id)}
                        loadLevel = {(levelId) => this.loadLevel(levelId)}
                    />
                    <button onClick={() => this.saveLevel(this.state.level)}>save</button>
                    <button onClick={() => this.clearGrid()}>clear grid</button>
                    {/* TODO: replace with blank creation button
                    <button onClick={(ID) => this.loadLevel(0)}>load</button> */}
                </div>
                <div className="level">
                    <LLOutput
                        level = {this.state.level}
                        grid = {this.state.grid}
                        rules = {this.state.rules}
                        colorList = {this.state.ruleOptions.colorList}
                        sampleList = {this.state.ruleOptions.sampleList}
                        cols = {this.state.settings.cols}
                        rows = {this.state.settings.rows}
                        cellSize = {this.state.settings.cellSize}
                        updateGoalCount = {(ruleID, goal) => this.updateGoalCount(ruleID, goal)}
                        puzzleComplete = {(puzzleId) => this.handlePuzzleComplete(puzzleId)}
                        puzzleId = {this.state.puzzleId}
                    >
                        <HexGrid
                            selected = {this.state.selectedCell}
                            level = {this.state.level}
                            onMouseDown = {(cellID) => this.cellClick(cellID)}
                            onMouseUp = {(cellID) => this.cellMouseUp(cellID)}
                            currentlyAdding = {this.state.currentlyAdding}
                            currentTool = {this.state.currentTool}
                            settings = {this.state.settings}
                        ></HexGrid>
                    </LLOutput>
                    <Toolbox
                        onClick = {(toolID) => this.toolboxClick(toolID)}
                        selected = {this.state.currentTool}
                        cellTypes = {this.state.cellTypes}
                        currentlyAdding = {this.state.currentlyAdding}
                        setCreateType = {(type) => this.setCreateType(type)}
                    ></Toolbox>
                </div>
                
                <RuleEditor
                    rules = {rulesInEditor}
                    selectedRule = {selectedRule}
                    ruleOptions = {this.state.ruleOptions}
                    cellId = {this.state.selectedCell}
                    onClick = {(rule, ruleId) => this.updateRule(rule, ruleId)}
                    updateSelectedRule = {(id, cell) => this.updateSelectedRule(id, cell)}
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