import React from 'react';

class LLOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pulses: this.props.pulses,
    }
    // const pulses = this.props.pulses  
  }
 
  drawShape(shapeString, x, y, w, h, color) {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = color;
    if(color === 'red'){
      ctx.fillStyle = '#c0392b';
    }
    if(color === 'blue'){
      ctx.fillStyle = '#2980b9';
    }
    if(shapeString === 'square'){
      ctx.rect(x - w/2, y - h/2, w, h);
    }
    if(shapeString === 'circle'){
      const r = w/2;
      ctx.ellipse(x, y, r, r, 45 * Math.PI/180, 0, 2 * Math.PI);
    }
    ctx.fill();
  };
  
  tick() {
  //  console.log(pulses);
    // this.state.pulses.forEach((pulse, index) => {
    //   console.log(pulse);
    //   this.drawShape(pulse.shape, pulse.x, pulse.y, 10, 10, pulse.color);
    // });
    // requestAnimationFrame(this.tick);
  }

  

  componentDidMount() {
   
    console.log(this.state.pulses);
    const addPulse = this.props.addPulse;
    console.log(this.state.pulses);
    
    addPulse({
      x: 100,
      y: 100,
      shape: "circle",
      color: "red",
      dx: 4,
      dy: 4
    });
    requestAnimationFrame(this.tick);
  }

  render() {
    return(
      <div>
        <canvas ref="canvas" width={200} height={200} />
      </div>
    )
  }
}

export default LLOutput;