import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

class RuleEditor extends React.Component {  
    constructor(props) {
        super(props);
        this.state = {
            points: this.props.points || 3,
            color: this.props.color || 0,
            direction: this.props.direction || 90,
            directionLabel: this.angleToCompass(this.props.direction),
            visualDirection: this.props.direction || 90,
            audioSample: this.props.audioSample || 0,
            colorList: ['#1dd1a1','#ee5253', '#feca57', '#54a0ff'],
        };
    }

    angleToCompass = (angle) => {
        let compassLabels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return compassLabels[Math.floor(angle / 45)];
    }

    polyClick = () => {
        let points = parseInt(this.state.points);
        if(points + 1 > 7){
            points = 3;
        }else{
            points +=1;
        }
        this.setState({ points: points });
    }

    colorPickerClick = () => {
        let colorIndex = parseInt(this.state.color);
        if(colorIndex + 1 >= this.state.colorList.length){
            colorIndex = 0;
        }else{
            colorIndex ++;
        }
        this.setState({ color: colorIndex });
    }

    samplePickerClick = () => {
        let newSample = parseInt(this.state.audioSample) + 1;
        if(newSample > 8) newSample = 0;
        this.setState({ audioSample: newSample });
    }

    directionPickerClick = () => {
        let direction = ((parseInt(this.state.direction) + 45) % 360);
        this.setState({direction: direction});
        let visualDirection = parseInt(this.state.visualDirection) + 45;
        this.setState({visualDirection: visualDirection});
        this.setState({directionLabel: this.angleToCompass(direction)});
    }

    render() {
        return(
            <div className="rule-editor">
                if
                <PolyPicker
                    points={this.state.points}
                    onClick = {() => this.polyClick()}
                ></PolyPicker>
                and
                <ColorPicker
                    color={this.state.color}
                    colorList={this.state.colorList}
                    onClick = {() => this.colorPickerClick()}
                ></ColorPicker>
                <br />
                then
                <DirectionPicker
                    direction={this.state.direction}
                    visualDirection={this.state.visualDirection}
                    onClick = {() => this.directionPickerClick()}
                ></DirectionPicker>
                and
                <SamplePicker
                    audioSample={this.state.audioSample}
                    onClick = {() => this.samplePickerClick()}
                ></SamplePicker>
                <RuleOutput
                    points={this.state.points}
                    color={this.state.color}
                    direction={this.state.directionLabel}
                    audioSample={this.state.audioSample}
                ></RuleOutput>
            </div>
        );
    }
}

class RuleOutput extends React.Component {
    render() {
        return (
            <div>{this.props.points}, {this.props.color}, {this.props.direction}, {this.props.audioSample}</div>
        );
    }
}

class ColorPicker extends React.Component {    
    render() {
        const colorList = this.props.colorList || ['#cccccc'];
        const style = {
            fill: colorList[this.props.color],
        }
        return (
            <div
                className="color-picker"
                onClick={() => this.props.onClick()}
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
            <div className="direction-arrow-wrapper" onClick={() => this.props.onClick()}>
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
        console.log(positions);
        return (
            <svg className="drum" onClick={() => this.props.onClick()} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 46.9 46.9">
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
          onClick={() => this.props.onClick()}
        ><path d={generatePath(this.props.points)}></path></svg>
      )
    }
  }
  
//   class Square extends React.Component {
//     render() {
//       return (
//         <button className="square">
//             <Poly 
//                 points={this.props.value} 
//                 onClick={() => this.addOne()}
//             />
//         </button>
//       );
//     }
//   }
  
//   class Board extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//           squares: [
//             2,2,2,
//             1,1,1,
//             2,2,2
//           ],
//         };
//     }

//     renderSquare(i) {
//       return (
//         <Square
//             value={this.state.squares[i]}
//         />
//       )
//     }
  
//     render() {
//       return (
//         <div>
//           <div className="board-row">
//             {this.renderSquare(0)}
//             {this.renderSquare(1)}
//             {this.renderSquare(2)}
//           </div>
//           <div className="board-row">
//             {this.renderSquare(3)}
//             {this.renderSquare(4)}
//             {this.renderSquare(5)}
//           </div>
//           <div className="board-row">
//             {this.renderSquare(6)}
//             {this.renderSquare(7)}
//             {this.renderSquare(8)}
//           </div>
          
//         </div>
//       );
//     }
//   }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
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
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  