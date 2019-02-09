import React from 'react';
import ReactAnimationFrame from 'react-animation-frame';
import Tone from 'tone';
import arp1 from '../assets/audio/gb_drums/arp (1).wav';
import hihat from '../assets/audio/gb_drums/hihat (2).wav';
import kick from '../assets/audio/gb_drums/kick (1).wav';
import perc from '../assets/audio/gb_drums/perc (9).wav';
import pulse from '../assets/audio/gb_drums/pulse (2).wav';
import sfx from '../assets/audio/gb_drums/sfx (1).wav';
import snare from '../assets/audio/gb_drums/snare (3).wav';

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
			beatLength: 200,
			barLength: 12,
		}
		this.cellHeight = (this.props.cellSize * 2) * .75;
		this.cellWidth = Math.sqrt(3) * this.props.cellSize;
		this.paused = false;
		this.win = false;
		this.puzzleIsPlaying = true;
		this.width = this.cellWidth * this.props.cols + (this.cellWidth / 2);
		this.height = this.cellHeight * this.props.rows + (this.cellHeight / 4);
		//maintain an array of audio contexts, and pass cells reference
		// this.audioContexts = [];

		//TODO: build asset loader to pre-load all the audio files passed in with sampleList
		// this.samples = [];
		// this.props.sampleList.forEach((sample) => {
		// 	console.log(sample);
		// 	const filePath = '../assets/audio/gb_drums/' + sample
		// 	import a from filePath;
		// });
	}

	componentDidMount() {
		this.ctx = this.canvas.current.getContext("2d");
		if(this.props.puzzleId !== null){
			console.log(this.props.puzzleId);
			// this.puzzle = 
		}
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
		this.ctx.clearRect(0, 0, this.width, this.height);
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
		return pulse;
	}

	checkBounds(pulse){
		//check if pulse is off left or right
		if(
			pulse.gridX > this.props.cols - 1 || pulse.gridX < 0 ||
			pulse.gridY > this.props.rows - 1 || pulse.gridY < 0
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

	playSound(soundID) {
		var player;
		switch(soundID){
			case 0:
				player = new Tone.Player(arp1).toMaster();
				player.autostart = true;
				break;
			case 1:
				player = new Tone.Player(hihat).toMaster();
				player.autostart = true;
				break;
			case 2:
				player = new Tone.Player(kick).toMaster();
				player.autostart = true;
				break;
			case 3:
				player = new Tone.Player(pulse).toMaster();
				player.autostart = true;
				break;
			case 4:
				player = new Tone.Player(perc).toMaster();
				player.autostart = true;
				break;
			case 5:
				player = new Tone.Player(snare).toMaster();
				player.autostart = true;
				break;
			default:
				break;
		}
	}

	checkRule(pulse, rule) {
		let ruleMatch = true;
		if(rule.color !== pulse.color) {
			ruleMatch = false;
		}
		if(rule.goal) {
			if(rule.goal < 0){
				ruleMatch = false;
			}
		}
		return ruleMatch;
	}

	advancePulsePositions() {
		const pulsesToRemove = [];
		this.ctx.clearRect(0, 0, this.width, this.height);

		this.pulses.forEach((pulse, i) => {
			//check router collisions
			this.routers.forEach((router) => {
				if(pulse.gridX === router.column && pulse.gridY === router.row) {
					router.rulesById.forEach((ruleId) => {
						const rule = this.props.rules[ruleId].rule;
						if(this.checkRule(pulse, rule)) {
							this.playSound(rule.audioSample);
							pulse.direction = rule.direction;
						}
					});
				}
			});
			//check goal collisions
			for(var k = 0; k < this.goals.length; k ++) {
				const goal = this.goals[k];
				if(pulse.gridX === goal.column && pulse.gridY === goal.row){
					goal.rulesById.forEach((ruleId) => {
						const rule = this.props.rules[ruleId].rule;
						if(this.checkRule(pulse, rule)){
							this.playSound(rule.audioSample);
							pulsesToRemove.push(i);	
							rule.goal -= 1;
							this.props.updateGoalCount(ruleId, rule.goal);
						}
					});
				}
			}
			//check gap collisions
			for(var l = 0; l < this.gaps.length; l ++) {
				const gap = this.gaps[l];
				if(pulse.gridX === gap.column && pulse.gridY === gap.row){
					pulsesToRemove.push(i);
					var player = new Tone.Player(sfx).toMaster();
					player.autostart = true;
				}
			}

			if(this.checkBounds(pulse, i)){
				pulsesToRemove.push(i);
			};
			this.drawPulseOnHex(pulse.gridX, pulse.gridY, pulse.color);
			pulse = this.updatePulse(pulse);
		});

		//remove dead pulses
		pulsesToRemove.sort(function(a,b){ return b - a; });
		for (var i = 0; i < pulsesToRemove.length; i++) {
			this.pulses.splice(pulsesToRemove[i], 1);
		}
	}

	checkPuzzleComplete(){
		let complete = true;
		this.props.rules.forEach((rule) => {
			//TODO: if goal is 0, check to see if the property exists is false.
			if(rule.rule.goal) {
				if(rule.rule.goal > -1) {
					complete = false;
				}
			}
		});
		return complete;
	}

	onAnimationFrame(time) {
		if(!this.paused){
			//on beat
			let currentBeat = Math.floor(time / this.time.beatLength) % this.time.barLength;
			if(currentBeat !== this.time.previousBeat) {			
				this.time.previousBeat = currentBeat;
				this.time.currentBeat = currentBeat;
				let beatCount = Math.floor(time / this.time.beatLength) % this.time.barLength;

				//emitters
				this.emitters.forEach((emitter, index) => {
					emitter.rulesById.forEach((ruleId) => {
						const rule = this.props.rules[ruleId].rule;
						if(beatCount === rule.releaseOnBeat){
							this.emitParticle(emitter, rule);
							this.playSound(rule.audioSample);
						}
					});
				});
				
				//move pulses along a cell
				this.advancePulsePositions();

				//check to see if puzzle is complete
				// if(this.puzzleIsPlaying){
					if(this.checkPuzzleComplete()){
						this.win = true;
						this.paused = true;
						this.props.puzzleComplete(this.props.puzzleId);
						//play win state.
					}
				// }
			}
		}
		//if paused for win, restart when no longer winning
		if(this.win === true) {
			if(!this.checkPuzzleComplete()){
				this.win = false;
				this.paused = false;
			}
		}	
	}

	pausePlay() {
		this.paused = !this.paused;
	}

	render() {
		this.emitters = [];
		this.routers = [];
		this.goals = [];
		this.gaps = [];
		this.cellHeight = (this.props.cellSize * 2) * .75;
		this.cellWidth = Math.sqrt(3) * this.props.cellSize;
		this.width = this.cellWidth * this.props.cols + (this.cellWidth / 2);
		this.height = this.cellHeight * this.props.rows + (this.cellHeight / 4);

		this.props.level.forEach((cell, index) => {
			switch(cell.type){
				case 0:
					break;
				case 1:
					const emitter = cell;
					emitter.column = this.props.grid[index].column;
					emitter.row = this.props.grid[index].row;
					this.emitters.push(emitter);
					break;
				case 2:
					const router = cell;
					router.column = this.props.grid[index].column;
					router.row = this.props.grid[index].row;
					this.routers.push(router);
					break;
				case 3:	
					const goal = cell;
					goal.column = this.props.grid[index].column;
					goal.row = this.props.grid[index].row;
					this.goals.push(goal);
					break;
				case 4:	
					const gap = cell;
					gap.column = this.props.grid[index].column;
					gap.row = this.props.grid[index].row;
					this.gaps.push(gap);
					break;
				default:
					break;
			}
		});

		// this.goals.forEach((goal) => {
		// 	goal.rulesById.forEach((rule) => {
		// 		console.log(this.props.rules[rule].rule);
		// 		//TODO: track all goal progress in this object (prevent app rerendering by not saving at top level context.)
				
		// 	});
		// });
		return(
			<div className="output-player">
				<div className="toolbar">
					<button onClick={() => this.pausePlay()}>{this.paused ? "play" : "pause"}</button>
					<button onClick={() => this.restart()}>restart</button>
				</div>
				<canvas ref={this.canvas} width={this.width} height={this.height} />
				{this.props.children}
			</div>
		)
	}
}

export default ReactAnimationFrame(LLOutput, 15);