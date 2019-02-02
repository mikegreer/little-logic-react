import React from 'react';
import classNames from 'classnames';

class Emitter extends React.Component {
    render() {
        const hexWidth = Math.sqrt(3) * this.props.hexScale;
        return (
            <g className="emitter">
                <circle cx={hexWidth/2} cy="0" r={this.props.hexScale/2} stroke="black" fill="none" strokeWidth="1"  />
            </g>
        );
    }
}

class Router extends React.Component {
    render() {
        const hexWidth = Math.sqrt(3) * this.props.hexScale;
        return (
            <g className="router">
                <circle cx={hexWidth/2} cy="0" r={this.props.hexScale/2} stroke="red" fill="none" strokeWidth="5"  />
            </g>
        );
    }
}

class Goal extends React.Component {
    render() {
        const hexWidth = Math.sqrt(3) * this.props.hexScale;
        return (
            <g className="goal">
                <circle cx={hexWidth/2} cy="0" r={this.props.hexScale/2} stroke="blue" fill="none" strokeWidth="10"  />
            </g>
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

class Hexagon extends React.Component {
    render () {
        const scale = this.props.hexScale;
        const width = Math.sqrt(3) * scale;
        const hexPoints = [
            {x: width, y: (scale/2)*-1},
            {x: width, y: scale/2},
            {x: width/2, y: scale},
            {x: 0, y: scale/2},
            {x: 0, y: (scale/2)*-1},
            {x: width/2, y: scale*-1}
        ];
        let points = "";
        hexPoints.forEach(point => {
            points += point.x + "," + point.y + " ";
        });
        const center = this.props.coordinates;
        center.x += 1;
        center.y += 6;
        return(
            <g style = { 
                {transform: "translate(" + center.x + "px, " + center.y + "px)"}
            }>
            <polygon
                points={points}
                fill="none" 
                strokeWidth="1"
                className={classNames(
                    { 'selected': this.props.selected },
                    { 'hover': this.props.hover },
                    "hex")}
                style={
                    {cursor: this.props.currentTool === 1 ? 'move':'default'}
                }
                onMouseDown={(cellIndex) => this.props.onMouseDown(this.props.cellIndex)}
                // onMouseOver={(cellIndex) => this.props.onHover(this.props.cellIndex)}
                onMouseUp={(cellIndex) => this.props.onMouseUp(this.props.cellIndex)}
                // {this.props.hover ? <Ghost currentlyAdding={this.props.currentlyAdding}></Ghost> : null}
            ></polygon>
            {this.props.cellType === 1 ? <Emitter hexScale={scale}></Emitter> : null}
            {this.props.cellType === 2 ? <Router hexScale={scale}></Router> : null}
            {this.props.cellType === 3 ? <Goal hexScale={scale}></Goal> : null}
            </g>
        );
    }
}

class HexGrid extends React.Component {
    render() {
        const hexScale = this.props.settings.cellSize;
        const width = Math.sqrt(3) * this.props.settings.cellSize * (this.props.settings.cols + 0.5) + 2;
        const height = 0.75 * this.props.settings.cellSize * (this.props.settings.rows + 0.5) * 2 + 2;

        const hexGrid = [];

        //TODO: part of below temp moving calcs
        const cellHeight = (hexScale * 2) * .75;
        const cellWidth = Math.sqrt(3) * hexScale;

        this.props.level.forEach((hex, index) => {
            const cell = this.props.level[index];
            
            //TODO: temporary: trying calculating this here instead of at root to remove data from main state
            const column = hex.id % this.props.settings.cols;
            const row = Math.floor(hex.id / this.props.settings.cols);
           
            const gridX = row % 2 ? column * cellWidth : column * cellWidth + (cellWidth / 2);
            const gridY = row * cellHeight + cellHeight / 2;
            hexGrid.push(<Hexagon
                key={index}
                cellIndex={index}
                hexScale={hexScale}
                coordinates = {{x: gridX, y: gridY}}
                cellType={cell.type}
                onMouseDown={(i) => this.props.onMouseDown(i)}
                selected={this.props.selected === index ? true : false}
                // onHover={(cellID) => this.props.onHover(cellID)}
                onMouseUp={(i) => this.props.onMouseUp(i)}
                // hover={cell.hover}
                currentlyAdding={this.props.currentlyAdding}
                currentTool={this.props.currentTool}
            />);
        });

        return(
            <div className="grid">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
                    {hexGrid}
                </svg>
            </div>
        );
    }
}

export default HexGrid;