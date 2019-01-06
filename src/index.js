import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import classNames from 'classnames';
import RuleEditor from './components/RuleEditor';
import Slider from './components/Slider';
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

class PaintBoxButton extends React.Component {
    render () {
        return (
            <button onClick={() => this.props.onClick()}>
                {this.props.label}
            </button>
        );
    }
}

class PaintBox extends React.Component {
    render() {
        const buttons = [];
        this.props.cellTypes.forEach((type, index) => {
            buttons.push(
                <PaintBoxButton 
                    key = {type.label}
                    label = {type.label}
                    onClick={()=>this.props.onClick(type.id)}
                ></PaintBoxButton>
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
            level: this.constructLevel(10, 10, [{
                cellIndex: 0,
                releaseFrequency: 2,
                releaseRules: {
                    color: 1,
                    points: 3,
                    direction: 45,
                    sample: 1
                },
            }]),
            editingLevel: false,
            selectedCell: null,
            currentlyAdding: 0,
            cellTypes: [
                {id: 0, label: "Blank"},
                {id: 1, label: "Emitter"},
                {id: 2, label: "Router"},
                {id: 3, label: "Gate"},
            ],
            emitters: [
                {
                    cellID: 0,
                    releaseFrequency: 2,
                    releaseRules: {
                        color: 1,
                        points: 3,
                        direction: 45,
                        sample: 1 
                    },
                },
            ],
        };
    }

    cellClick = (cellID) => {
        if(this.state.editingLevel){
            const level = this.state.level.slice();
            level[cellID].type = this.state.currentlyAdding;
            this.setState({level: level});
        }else{
            const level = this.state.level.slice();
            level[cellID].selected = true;
            if(this.state.selectedCell || this.state.selectedCell === 0){
                level[this.state.selectedCell].selected = null;
            }
            this.setState({level: level});
            this.setState({selectedCell: cellID});
        }
    }

    setType = (type) => {
        this.setState({currentlyAdding: type});
    }

    toggleEditMode = () => {
        console.log('a');
        this.setState({editingLevel: !this.state.editingLevel});
    }

    render() {
      return (
        <div className="game">
            <div className="level">
                <LogicGrid
                    level = {this.state.level}
                    emitters = {this.state.emitters}
                    onClick = {(cellID) => this.cellClick(cellID)}
                ></LogicGrid>
                <LayoutToggle
                    editingLevel={this.state.editingLevel}
                    onClick = {() => this.toggleEditMode()}
                ></LayoutToggle>
                <PaintBox
                    cellTypes = {this.state.cellTypes}
                    onClick = {(type) => this.setType(type)}    
                ></PaintBox>
            </div>
            
            <RuleEditor
                points="5"
                color="0"
                direction="45"
                audioSample="0"
            ></RuleEditor>
            <RuleEditor
                points="3"
                color="3"
                direction="90"
                audioSample="3"
            ></RuleEditor>
        </div>
      );
    }
}
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);