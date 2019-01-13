import React from 'react';
import ReactAnimationFrame from 'react-animation-frame';

class LLOutput extends React.Component {
	constructor(props) {
    	super(props);
		this.canvas = React.createRef();
		this.ctx = null;
		this.pulses = [];
		this.emitters = [];
		this.time = {
			currentBeat: 0,
			previousBeat: 0,
			beatLength: 500,
			barLength: 10,
		}
		this.state = {
			paused: false,
		}
	}

	componentDidMount() {
		this.ctx = this.canvas.current.getContext("2d");
	}
 
	idToCoordinates(id) {
		const cellSize = 34;
		const coordinates = {
			x: id % 10 * cellSize + (cellSize / 2),
			y: (Math.floor((id / 10) % 10) * cellSize) + (cellSize / 2),
		}
		return coordinates;
	}

	angleToDirection(angle, speed){
		const radians = (angle - 90) * (Math.PI / 180);
		const direction = {
			dx: (Math.cos(radians)),
			dy: (Math.sin(radians)),
		}
		return direction;
	}

	drawShape(shape, x, y, w, h, color) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		if(color === 'red'){
			this.ctx.fillStyle = '#c0392b';
		}
		if(color === 'blue'){
			this.ctx.fillStyle = '#2980b9';
		}
		
		this.ctx.fillStyle = this.props.colorList[color];

		//temporary. Add shape rendering in.
		switch(shape){
			case 3:
				this.ctx.rect(x - w/2, y - h/2, w, h);
				break;
			case 4:
				this.ctx.rect(x - w/2, y - h/2, w, h);
				break;
			case 5:
				const r = w/2;
				this.ctx.ellipse(x, y, r, r, 45 * Math.PI/180, 0, 2 * Math.PI);
				break;
			default:
				console.log(shape);
				break;
		}
		this.ctx.fill();
	};

	restart() {
		this.pulses = [];
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
	}

	updatePulse(pulse) {
		if(pulse.x + pulse.dx + (pulse.w/2) > this.props.width || pulse.x + pulse.dx - (pulse.w/2) < 0){
			pulse.dx *= -1;
		}
		if(pulse.y + pulse.dy + (pulse.h/2) > this.props.height || pulse.y + pulse.dy - (pulse.h/2) < 0){
			pulse.dy *= -1;
		}
		pulse.x += pulse.dx;
		pulse.y += pulse.dy;
		
		return pulse;
	}

	emitParticle(emitter, rule) {
		const coordinates = this.idToCoordinates(emitter.id);
		const direction = this.angleToDirection(rule.direction);
		this.pulses.push({
			x: coordinates.x,
			y: coordinates.y,
			shape: rule.points,
			color: rule.color,
			dx: direction.dx,
			dy: direction.dy,
			w: 34,
			h: 34,
		});
	}

	onAnimationFrame(time) {
		//TODO: add pausing into the timer too (save current timestamp when pause is pressed?)
		if(!this.state.paused){
			this.ctx.clearRect(0, 0, this.props.width, this.props.height);

			//add new pulses from emitters
			let currentBeat = Math.floor(time / this.time.beatLength) % this.time.barLength;
			if(currentBeat !== this.time.previousBeat) {
				this.time.previousBeat = currentBeat;
				this.time.currentBeat = currentBeat;
	
				let beatCount = Math.floor(time / this.time.beatLength);
				this.emitters.forEach((emitter, index) => {
					emitter.rules.forEach((rule) => {
						if(beatCount % rule.releaseFrequency === 0){
							this.emitParticle(emitter, rule);
						}
					});
				});
			}
	
			//update pulses
			this.pulses.forEach(pulse => {
				this.drawShape(pulse.shape, pulse.x, pulse.y, pulse.w, pulse.h, pulse.color);
				pulse = this.updatePulse(pulse);
			});
		}	
	}

	pausePlay() {
		this.setState({paused: !this.state.paused});
	}

	render() {
		this.emitters = [];
		this.props.level.forEach((cell, index) => {
			if(cell.type === 1){
				this.emitters.push(cell);
			}
		});
		return(
			<div>
				<canvas ref={this.canvas} width={this.props.width} height={this.props.height} />
				<button onClick={() => this.restart()}>restart</button>
				<button onClick={() => this.pausePlay()}>{this.state.paused ? "play" : "pause"}</button>
			</div>
		)
	}
}

export default ReactAnimationFrame(LLOutput, 15);