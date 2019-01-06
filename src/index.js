import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import RuleEditor from './components/RuleEditor';
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
                className="square"
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
                cellType={cell}
                onClick={(cellID) => this.props.onClick(cellID)}
                ></Square>);
        });
        return(
            <div className="grid">{grid}</div>
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
                    label={type.label}
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
    constructor(props) {
        super(props);
        this.state = {
            level: [
                0,1,2,3,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,1,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,
            ],
            currentlyAdding: 0,
            cellTypes: [
                {id: 0, label: "Blank"},
                {id: 1, label: "Emitter"},
                {id: 2, label: "Router"},
                {id: 3, label: "Gate"},
            ],
            emitters: [
                {
                    x: 0,
                    y: 0,
                    releaseEverySeconds: 2,
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
        const level = this.state.level.slice();
        level[cellID] = this.state.currentlyAdding;
        this.setState({level: level});
    }

    setType = (type) => {
        this.setState({currentlyAdding: type});
    }

    render() {
      return (
        <div className="game">
            <div className="level">
                <LogicGrid
                    level = {this.state.level}
                    emitters = {this.props.emitters}
                    onClick = {(cellID) => this.cellClick(cellID)}
                ></LogicGrid>
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