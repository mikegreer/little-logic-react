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
 
	angleToDirection(angle){
		const radians = (angle - 90) * (Math.PI / 180);
		const direction = {
			dx: (Math.cos(radians)),
			dy: (Math.sin(radians)),
		}
		return direction;
	}

	drawShape(pointCount, x, y, w, h, color) {
		this.ctx.beginPath();
		// this.ctx.fillStyle = color;
		// if(color === 'red'){
		// 	this.ctx.fillStyle = '#c0392b';
		// }
		// if(color === 'blue'){
		// 	this.ctx.fillStyle = '#2980b9';
		// }
		
		this.ctx.fillStyle = this.props.colorList[color];

		const angleUnit = (360/pointCount) * Math.PI / 180;
		let pointAngle = 0;
		this.ctx.beginPath();
		this.ctx.moveTo(x - w/2, y - h/2);
		// this.ctx.rect(x - w/2, y - h/2, w, h);
		for(var i = 1; i <= pointCount; i++){
			// if(i < shape){
			// 	ctx.lineTo();
			// 	pointAngle = angleUnit * i + rotationOffset;
			// }else{
			pointAngle = angleUnit * pointCount;
			// }
			let px = Math.cos(pointAngle) * w;
			let py = Math.sin(pointAngle) * w;
			this.ctx.lineTo(px, py);
			// console.log(px, py);
		}
		this.ctx.closePath();
		this.ctx.fill();
		// temporary. Add shape rendering in.
		switch(pointCount){
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
				console.log(pointCount);
				break;
		}
		this.ctx.fill();
	};

	restart() {
		this.pulses = [];
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
	}

	updatePulse(pulse) {
		pulse.x += pulse.dx;
		pulse.y += pulse.dy;
		
		return pulse;
	}

	// removePulse(pulseID){
	// 	this.pulses.splice(pulseID, 1);
	// }

	checkBounds(pulse, i){
		//check if pulse is off left or right
		if(
			pulse.x + pulse.dx + (pulse.w/2) > this.props.width || 
			pulse.x + pulse.dx - (pulse.w/2) < 0 ||
			pulse.y + pulse.dy + (pulse.h/2) > this.props.height ||
			pulse.y + pulse.dy - (pulse.h/2) < 0
		){
			// this.removePulse(i);  
			return true;
		}
	}

	centerPoint(gridX, gridY, cellSize){
		let posX = gridX + (cellSize * Math.sqrt(3) / 2);
		let posY = gridY + ((cellSize * 2)/8);
		return {
			posX: posX,
			posY: posY,
		}
	}

	emitParticle(emitter, rule) {
		const direction = this.angleToDirection(rule.direction);

		//TODO: change to use scale property
		const centerPoint = this.centerPoint(emitter.gridX, emitter.gridY, 22);
		this.pulses.push({
			x: centerPoint.posX,
			y: centerPoint.posY,
			shape: rule.points,
			color: rule.color,
			dx: direction.dx,
			dy: direction.dy,
			w: 15,
			h: 15,
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
	
			//update and draw pulses
			const pulsesToRemove = [];
			// this.emitters.forEach((emitter, i) => {
			// 	const cellSize = 22;
			// 	const cellHeight = (cellSize * 2) * .75;
			// 	const cellWidth = Math.sqrt(3) * cellSize;
			// 	let pulseX = emitter.gridX + (cellSize * Math.sqrt(3) / 2); //emitter.column * cellWidth;
			// 	// pulseX += emitter.row % 2 ? cellWidth / 2 : cellWidth;
			// 	let pulseY = emitter.gridY + ((cellSize * 2)/8); //emitter.row * cellHeight + cellHeight / 2; //+6
			// 	this.centerPoint(pulseX, pulseY, 22);
			// });
			this.pulses.forEach((pulse, i) => {			
				//check pulses against routers
				//TODO: factor in pulse speed
				const hitBoxSize = 1;
				for(var j = 0; j < this.routers.length; j ++) {
					const routerPosition = this.centerPoint(this.routers[j].gridX, this.routers[j].gridY, 22);
					if(
						pulse.x > routerPosition.posX - hitBoxSize &&
						pulse.x < routerPosition.posX + hitBoxSize &&
						pulse.y > routerPosition.posY - hitBoxSize &&
						pulse.y < routerPosition.posY + hitBoxSize
					) {
						if(!pulse.currentlyRouting){
							pulse.x = routerPosition.posX;
							pulse.y = routerPosition.posY;
							pulse.currentlyRouting = true;
							const direction = this.angleToDirection(this.routers[j].rules[0].direction);
							pulse.dx = direction.dx;
							pulse.dy = direction.dy;
						}else{
							pulse.currentlyRouting = false;
						}
						
					}
				}

				if(this.checkBounds(pulse, i)){
					pulsesToRemove.push(i);
				};
				this.drawShape(pulse.shape, pulse.x, pulse.y, pulse.w, pulse.h, pulse.color);
				pulse = this.updatePulse(pulse);
			});

			//remove dead pulses
			pulsesToRemove.sort(function(a,b){ return b - a; });
			for (var i = 0; i < pulsesToRemove.length; i++) {
				this.pulses.splice(pulsesToRemove[i], 1);
			}
		}	
	}

	pausePlay() {
		this.setState({paused: !this.state.paused});
	}

	render() {
		this.emitters = [];
		this.routers = [];
		this.goals = [];
		this.props.level.forEach((cell, index) => {
			switch(cell.type){
				case 0:
					break;
				case 1:
					this.emitters.push(cell);
					break;
				case 2:
					this.routers.push(cell);
					break;
				case 3:
					this.goals.push(cell);
					break;
				default:
					break;
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