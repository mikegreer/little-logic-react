import React from 'react';
import ReactAnimationFrame from 'react-animation-frame';
import Tone from 'tone';

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
			beatLength: 100,
			barLength: 24,
		}
		
		this.cellHeight = (this.props.cellSize * 2) * .75;
		this.cellWidth = Math.sqrt(3) * this.props.cellSize;
		this.state = {
			paused: false,
			width: this.cellWidth * this.props.cols + (this.cellWidth / 2),
			height: this.cellHeight * this.props.rows + (this.cellHeight / 4),
		};
		
		//maintain an array of audio contexts, and pass cells reference.
		//prevents contexts being stored on state / level saves
		this.audioContexts = [];
	}

	componentDidMount() {
		this.ctx = this.canvas.current.getContext("2d");
	}

	drawPulseOnHex(col, row, color) {
		let x = row % 2 ? col * this.cellWidth : col * this.cellWidth + (this.cellWidth / 2);
		x += this.cellWidth / 2;
		let y = row * this.cellHeight + this.cellHeight / 2;
		y += this.cellHeight * .25;
		this.ctx.beginPath();
		this.ctx.fillStyle = this.props.colorList[color];
		this.ctx.ellipse(x, y, this.props.cellSize/2, this.props.cellSize/2, 45 * Math.PI/180, 0, 2 * Math.PI);
		this.ctx.fill();
	}

	restart() {
		this.pulses = [];
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
	}

	updatePulse(pulse) {
		switch(pulse.direction){
			case 0:
				pulse.gridY -= 1;
				if(pulse.gridY % 2){
					pulse.gridX += 1;
				}
				break;
			case 1:
				pulse.gridX += 1;
				break;
			case 2:		
				pulse.gridY += 1;
				if(pulse.gridY % 2){
					pulse.gridX += 1;
				}
				break;
			case 3:
				pulse.gridY += 1;
				if(pulse.gridY % 2 === 0){
					pulse.gridX -= 1;
				}
				break;
			case 4:
				pulse.gridX -= 1;
				break;
			case 5:
				pulse.gridY -= 1;
				if(pulse.gridY % 2 === 0){
					pulse.gridX -= 1;
				}
				break;
			default:
				break;
		}
		// console.log(pulse);
		return pulse;
	}

	// removePulse(pulseID){
	// 	this.pulses.splice(pulseID, 1);
	// }

	checkBounds(pulse){
		//check if pulse is off left or right
		if(
			pulse.col > this.props.cols || pulse.cols < 0 ||
			pulse.row > this.props.rows || pulse.row < 0
		){
			return true;
		}
	}

	emitParticle(emitter, rule) {
		//TODO: change to use scale property
		this.pulses.push({
			gridX: emitter.column,
			gridY: emitter.row,
			color: rule.color,
			direction: rule.direction
		});
	}

	playSound(soundID, ctx) {
		switch(soundID){
			case 0:
				ctx.triggerAttackRelease("C3", "8n", '+0.05');
				break;
			case 1:
				ctx.triggerAttackRelease("Eb3", "8n", '+0.05');
				break;
			case 2:
				ctx.triggerAttackRelease("G3", "8n", '+0.05');
				break;
			case 3:
				ctx.triggerAttackRelease("Bb3", "8n", '+0.05');
				break;
			case 4:
				ctx.triggerAttackRelease("G2", "8n", '+0.05');
				break;
			case 5:
				ctx.triggerAttackRelease("Bb2", "8n", '+0.05');
				break;
			case 6:
				ctx.triggerAttackRelease("D2", "8n", '+0.05');
				break;
			case 7:
				ctx.triggerAttackRelease("E2", "8n", '+0.05');
				break;
			case 8:
				ctx.triggerAttackRelease("F2", "8n", '+0.05');
				break;
			default:
				break;
		}
	}

	checkRule(pulse, rule) {
		// if(rule.color) {
			if(rule.color === pulse.color) {
				return true;
			}
		// }
	}

	advancePulsePositions() {
		const pulsesToRemove = [];
		this.ctx.clearRect(0, 0, this.state.width, this.state.height);

		this.pulses.forEach((pulse, i) => {
			//check router collisions
			this.routers.forEach((router) => {
				if(pulse.gridX === router.column && pulse.gridY === router.row) {
					router.rules.forEach((rule) => {
						if(this.checkRule(pulse, rule)) {
							const ctx = this.audioContexts[rule.audioCtx];
							this.playSound(rule.audioSample, ctx);
							pulse.direction = rule.direction;
						}
					});
				}
			});
			//check goal collisions
			for(var k = 0; k < this.goals.length; k ++) {
				const goal = this.goals[k];
				if(pulse.gridX === goal.column && pulse.gridY === goal.row){
					goal.rules.forEach((rule) => {
						const ctx = this.audioContexts[rule.audioCtx];
						this.playSound(rule.audioSample, ctx);
						pulsesToRemove.push(i);
					});
				}
			}

			if(this.checkBounds(pulse, i)){
				pulsesToRemove.push(i);
			};
			// const pulseLocation = this.centerPoint(pulse.gridX, pulse.gridY, 22);
			// this.drawShape(pulseLocation.x, pulseLocation.y, pulse.r, pulse.color);
			this.drawPulseOnHex(pulse.gridX, pulse.gridY, pulse.color);
			pulse = this.updatePulse(pulse);
		});

		//remove dead pulses
		pulsesToRemove.sort(function(a,b){ return b - a; });
		for (var i = 0; i < pulsesToRemove.length; i++) {
			console.log('removing', i);
			this.pulses.splice(pulsesToRemove[i], 1);
		}
	}

	onAnimationFrame(time) {
		//TODO: add pausing into the timer too (save current timestamp when pause is pressed?)
		if(!this.state.paused){
			//on beat
			let currentBeat = Math.floor(time / this.time.beatLength) % this.time.barLength - 1;
			if(currentBeat !== this.time.previousBeat) {			
				this.time.previousBeat = currentBeat;
				this.time.currentBeat = currentBeat;
				let beatCount = Math.floor(time / this.time.beatLength) % this.time.barLength;
				// console.log(beatCount, beatCount % this.time.barLength);

				//emitters
				this.emitters.forEach((emitter, index) => {
					emitter.rules.forEach((rule) => {
						if(beatCount === rule.releaseOnBeat){
							this.emitParticle(emitter, rule);
							const ctx = this.audioContexts[rule.audioCtx];
							this.playSound(rule.audioSample, ctx);
						}
					});
				});
				
				//move pulses along a cell
				this.advancePulsePositions();
			}
		}	
	}

	pausePlay() {
		this.setState({paused: !this.state.paused});
	}

	render() {
		//TODO: prevent having to rebuild audio contexts on rule change. (Only needs to add when level is edited.)
		this.emitters = [];
		this.routers = [];
		this.goals = [];
		this.audioContexts = [];
		// Tone.context.close();
		// Tone.context = new AudioContext();

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
		//add to local instance of state to prevent them being saved onto save files / main context.
		this.emitters.forEach((emitter) => {
			emitter.rules.forEach((rule) => {
				this.audioContexts.push(new Tone.Synth().toMaster());
				rule.audioCtx = this.audioContexts.length - 1;
			});
		});
		this.routers.forEach((router) => {
			router.rules.forEach((rule) => {
				this.audioContexts.push(new Tone.Synth().toMaster());
				rule.audioCtx = this.audioContexts.length - 1;
			});
		});
		this.goals.forEach((goal) => {
			goal.rules.forEach((rule) => {
				this.audioContexts.push(new Tone.Synth().toMaster());
				rule.audioCtx = this.audioContexts.length - 1;
			});
		});
		// console.log('num routers:', this.routers.length);
		// console.log('audio context count:', this.audioContexts.length);
		return(
			<div>
				<canvas ref={this.canvas} width={this.state.width} height={this.state.height} />
				<button onClick={() => this.restart()}>restart</button>
				<button onClick={() => this.pausePlay()}>{this.state.paused ? "play" : "pause"}</button>
			</div>
		)
	}
}

export default ReactAnimationFrame(LLOutput, 15);