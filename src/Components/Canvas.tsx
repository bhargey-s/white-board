import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import rectangleIcon from '../assets/Icons/rectangle.png';
import circleIcon from '../assets/Icons/circle.png';
import lineIcon from '../assets/Icons/line.png';
import textIcon from '../assets/Icons/text.png';
import fillColorIcon from '../assets/Icons/fill-color.png';
import borderColorIcon from '../assets/Icons/crayon.png';

function Canvas() {
  const [modalShow, setModalShow] = useState(false);
  const [styles, setStyles] = useState({ fillColor: '#000', borderColor: '#000', borderWidth: 1 });
  const [toolInputs, setToolInputs] = useState({ type: '', details: [{ label: '', type: '' }] });
  const [currentTool, setCurrentTool] = useState('');

  let canvasRef = useRef<HTMLCanvasElement>(null);
  let ctxRef = useRef<any>(null);
  let borderColorInputRef = useRef<HTMLInputElement>(null);
  let fillColorInputRef = useRef<HTMLInputElement>(null);

  let startX: number = 0;
  let startY: number = 0;
  let endX: number = 0;
  let endY: number = 0;
  let isMouseDown = false;

  useEffect(() => {
    if (canvasRef?.current) {
      const canvas: any = canvasRef.current;

      canvas.style.width = '85vw';
      canvas.style.height = '75vh';
      // canvas.offsetHeight = 0;
      // canvas.offsetLeft = 0;
      // canvas.offsetParent = 0;
      // canvas.offsetTop = 0;
      // canvas.offsetWidth = 0;
      ctxRef.current = canvas.getContext('2d');

      console.log(canvas);
      console.log(ctxRef.current);
    }
  }, []);

  const handleColorIconClick = (styleType: string) => {
    if (styleType === 'fill') {
      let fillColorInput = fillColorInputRef.current;
      fillColorInput?.click();
    } else if (styleType === 'border') {
      let borderColorInput = borderColorInputRef.current;
      borderColorInput?.click();
    }
  };

  const handleColorInputChange = (e: any, styleType: string) => {
    if (styleType === 'fill') {
      setStyles({ ...styles, fillColor: e.target.value });
    } else if (styleType === 'border') {
      setStyles({ ...styles, borderColor: e.target.value });
    }
  };

  const handleMouseDown = (event: any) => {
    isMouseDown = true;
    const canvas = canvasRef?.current;
    if (canvas?.offsetLeft) {
      startX = event.clientX - canvas.offsetLeft;
    }
    if (canvas?.offsetTop) {
      startY = event.clientY - canvas.offsetTop;
    }
  };

  const handleMouseMove = (event: any) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    let prevEndX = endX;
    let prevEndY = endY;

    if (canvas?.offsetLeft) {
      endX = event.clientX - canvas.offsetLeft;
    }
    if (canvas?.offsetTop) {
      endY = event.clientY - canvas.offsetTop;
    }

    if (isMouseDown) {
      console.log(startX, startY, prevEndX, prevEndY, endX, endY);
      console.log(ctxRef.current);
      console.log(currentTool);

      if (currentTool === 'rect') {
        // Clear previous rectangles
        // Put some condition here
        var width = prevEndX - startX;
        var height = prevEndY - startY;
        console.log(startX, startY, width, height);
        console.log(ctx);
        ctx.clearRect(startX, startY, width, height);

        var width = endX - startX;
        var height = endY - startY;
        console.log(startX, startY, endX, endY);
        ctx.strokeStyle = styles.borderColor;
        ctx.fillStyle = styles.fillColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);
        ctx.fillRect(startX, startY, width, height);
      } else if (currentTool === 'line') {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(startX, startY);
        ctxRef.current.lineTo(endX, endY);
        ctxRef.current.stroke();
      }
    }
  };

  const handleMouseUp = (event: any) => {
    // Store all the shapes
    isMouseDown = false;
  };

  const showModal = () => {
    setModalShow(true);
  };
  const hideModal = () => {
    setModalShow(false);
    return true;
  };

  const handleTextClick = () => {
    setCurrentTool('text');
    let obj = {
      type: 'text',
      details: [
        { name: 't', label: 'Text', type: 'text' },
        { name: 'x', label: 'X-coordinate', type: 'number' },
        { name: 'y', label: 'Y-coordinate', type: 'number' },
        { name: 'fs', label: 'Font size', type: 'number' },
      ],
    };

    setToolInputs(obj);
    showModal();
  };

  const drawElements = () => {};
  // const drawElements = (obj: any) => {
  //   console.log(obj);
  //   console.log(ctxRef.current);
  //   if (obj.type === 'rect') {
  //     ctxRef.current.fillStyle = obj.details.fc || '#000';
  //     ctxRef.current.strokeStyle = obj.details.bc || '#000';
  //     ctxRef.current.lineWidth = obj.details.bw || 1;
  //     ctxRef.current.strokeRect(obj.details.x || 0, obj.details.y || 0, obj.details.w, obj.details.h);
  //     ctxRef.current.fillRect(obj.details.x || 0, obj.details.y || 0, obj.details.w, obj.details.h);
  //   } else if (obj.type === 'line') {
  //     ctxRef.current.beginPath();
  //     ctxRef.current.moveTo(obj.details.sx || 0, obj.details.sy || 0);
  //     ctxRef.current.lineTo(obj.details.ex || 0, obj.details.ey || 0);
  //     ctxRef.current.strokeStyle = obj.details.lc || '#000';
  //     ctxRef.current.lineWidth = obj.details.lw || 1;
  //     ctxRef.current.stroke();
  //   } else if (obj.type === 'text') {
  //     ctxRef.current.font = `${obj.details.fs || 14}px Arial`;
  //     ctxRef.current.fillText(obj.details.t || '', obj.details.x || 0, obj.details.y || 0);
  //   }

  //   ctxRef.current.save();
  // };

  return (
    <div className="jam-board">
      <header>
        <h1>Canvas</h1>
        <div className="tool-bar">
          <div></div>
          <div></div>
          <div className="tool-bar-section">
            <div className="tool-bar-btns">
              <img src={borderColorIcon} onClick={() => handleColorIconClick('border')} />
              <div className="color-tab" style={{ backgroundColor: styles.borderColor }}></div>
              <input
                type="color"
                style={{ display: 'none' }}
                ref={borderColorInputRef}
                onChange={(e) => handleColorInputChange(e, 'border')}
              />
            </div>
            <div className="tool-bar-btns">
              <img src={fillColorIcon} onClick={() => handleColorIconClick('fill')} />
              <div className="color-tab" style={{ backgroundColor: styles.fillColor }}></div>
              <input
                type="color"
                style={{ display: 'none' }}
                ref={fillColorInputRef}
                onChange={(e) => handleColorInputChange(e, 'fill')}
              />
            </div>
            <div className="tool-bar-btns">{/* <img src={} /> */}</div>
          </div>
        </div>
      </header>
      <main>
        <canvas
          className="canvas"
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          Use a Modern Browser which supports Canvas
        </canvas>
        <div className="side-bar">
          <div
            className={`${currentTool === 'rect' ? 'clicked' : null} side-bar-btns`}
            onClick={() => setCurrentTool('rect')}
          >
            <img src={rectangleIcon} />
          </div>
          <div
            className={`${currentTool === 'line' ? 'clicked' : null} side-bar-btns`}
            onClick={() => setCurrentTool('line')}
          >
            <img src={lineIcon} />
          </div>
          <div
            className={`${currentTool === 'circle' ? 'clicked' : null} side-bar-btns`}
            onClick={() => setCurrentTool('circle')}
          >
            <img src={circleIcon} />
          </div>
          <div
            className={`${currentTool === 'text' ? 'clicked' : null} side-bar-btns`}
            onClick={() => handleTextClick()}
          >
            <img src={textIcon} />
          </div>
        </div>
      </main>
      <Modal showModal={modalShow} onClose={hideModal} toolInputs={toolInputs} draw={drawElements} />
    </div>
  );
}

export default Canvas;
