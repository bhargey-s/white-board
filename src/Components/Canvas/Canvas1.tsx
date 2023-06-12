import { useEffect, useRef } from 'react';
import Modal from '../Modal/InputModal';

function Canvas1() {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let ctx: any;

  //   Rectangles, Lines, Circles, Text

  useEffect(() => {
    if (canvasRef?.current) {
      const canvas: any = canvasRef.current;
      canvas.width = (window.innerWidth * 11) / 12;
      canvas.height = (window.innerHeight * 3) / 4;
      ctx = canvas.getContext('2d');
    }
  }, []);

  const createRect = () => {
    let arr = prompt(
      'Enter the starting x co-ordinate, starting y co-ordinate, the width, the height (x, y, w, h)'
    )?.split(',');
    ctx.fillStyle = 'rgb(98, 23, 124)';
    ctx.strokeRect(arr?.[0], arr?.[1], arr?.[2], arr?.[3]);
    ctx.fillRect(10, 10, 50, 50);
  };

  const hanldeRectClick = () => {
    let obj = {
      "x-coordinate": "text",
      "y-coordinate": "text",
      "Width(px)":"text",
      "Height(px)":"text",
      "Fill color": "color",
      "Border color":"color",
      "Border width(px)": "text"
    }
  }

  const createLine = () => {
    let arr = prompt(
      'Enter the starting x co-ordinate, starting y co-ordinate, ending x co-ordinate, ending y co-ordinate, (x, y, x1, y1)'
    )?.split(',');
    ctx.beginPath();
    ctx.moveTo(arr?.[0], arr?.[1]);
    ctx.lineTo(arr?.[2], arr?.[3]);
    ctx.stroke();
  };
  const hanldeLineClick = () => {
    let obj = {
      "Starting x-coordinate": "text",
      "Starting y-coordinate": "text",
      "Ending x-coordinate":"text",
      "Ending y-coordinate":"text",
      "Line color":"color",
      "Line width(px)": "text"
    }
  }

  const createCircle = () => {};

  const createText = () => {
    let arr = prompt('Enter the starting x co-ordinate, starting y co-ordinate, the text (x, y, text)')?.split(',');
    ctx.fillText(arr?.[2], arr?.[0], arr?.[1]);
  };

  return (
    <div className="jam-board">
      <header>
        <h1>Canvas 1</h1>
      </header>
      <main>
        <canvas className="canvas" ref={canvasRef}>
          Use a Modern Browser which supports Canvas
        </canvas>
        <div className="side-bar">
          <section className="side-bar-btns" onClick={() => createRect()}>
            Add Rectangle
          </section>
          <section className="side-bar-btns" onClick={() => createLine()}>
            Add Line
          </section>
          <section className="side-bar-btns">Add Circle</section>
          <section className="side-bar-btns" onClick={() => createText()}>
            Add Text
          </section>
        </div>
      </main>
      <div></div>
    </div>
  );
}

export default Canvas1;
