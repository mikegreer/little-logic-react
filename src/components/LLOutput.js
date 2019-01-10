import React from 'react';

class LLOutput extends React.Component {
  // constructor() {
  //    
  // }
 
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    function drawShape (shapeString, x, y, w, h, color){
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
    }

    drawShape("circle", Math.random()*100, 10, 10, 10, "red");
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