import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import rectangleIcon from '../assets/Icons/rectangle.png';
import circleIcon from '../assets/Icons/circle.png';
import lineIcon from '../assets/Icons/line.png';
import textIcon from '../assets/Icons/text.png';
import fillColorIcon from '../assets/Icons/fill-color.png';
import borderColorIcon from '../assets/Icons/crayon.png';

function Canvas() {
  const [canvasData, setCanvasData] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [styles, setStyles] = useState({ fillColor: '#000', borderColor: '#000', borderWidth: 1 });
  const [toolInputs, setToolInputs] = useState({ type: '', details: [{ label: '', type: '' }] });

  let canvasRef = useRef<HTMLCanvasElement>(null);
  let ctxRef = useRef<any>(null);
  let borderColorInputRef = useRef<HTMLInputElement>(null);
  let fillColorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Retrieve canvas data from localStorage
    const data = localStorage.getItem('canvasData');
    if (data) {
      setCanvasData(data);
    }
  }, []);

  useEffect(() => {
    // Store canvas data in localStorage whenever it changes
    localStorage.setItem('canvasData', canvasData);
  }, [canvasData]);

  function handleCanvasChange(data: any) {
    console.log(data);
    setCanvasData(data);
  }

  useEffect(() => {
    if (canvasRef?.current) {
      const canvas: any = canvasRef.current;
      // canvas.width = (window.innerWidth * 11) / 12;
      canvas.style.width = '85vw';
      canvas.style.height = '75vh';
      // canvas.height = (window.innerHeight * 3) / 4;
      ctxRef.current = canvas.getContext('2d');

      ctxRef.current.restore();
    }
  }, []);

  const handleColorIconClick = (styleType: String) => {
    if (styleType === 'fill') {
      let fillColorInput = fillColorInputRef.current;
      fillColorInput?.click();
    } else if (styleType === 'border') {
      let borderColorInput = borderColorInputRef.current;
      borderColorInput?.click();
    }
  };

  const handleColorInputChange = (e: any, styleType: String) => {
    if (styleType === 'fill') {
      setStyles({ ...styles, fillColor: e.target.value });
    } else if (styleType === 'border') {
      setStyles({ ...styles, borderColor: e.target.value });
    }
  };

  const showModal = () => {
    setModalShow(true);
  };
  const hideModal = () => {
    setModalShow(false);
    return true;
  };

  const handleRectClick = () => {
    const obj = {
      type: 'rect',
      details: [
        { name: 'x', label: 'x-coordinate', type: 'number' },
        { name: 'y', label: 'y-coordinate', type: 'number' },
        { name: 'w', label: 'Width(px)', type: 'number' },
        { name: 'h', label: 'Height(px)', type: 'number' },
        { name: 'fc', label: 'Fill color', type: 'color' },
        { name: 'bc', label: 'Border color', type: 'color' },
        { name: 'bw', label: 'Border width(px)', type: 'number' },
      ],
    };
    setToolInputs(obj);
    showModal();
  };

  const handleLineClick = () => {
    const obj = {
      type: 'line',
      details: [
        { name: 'sx', label: 'Starting x-coordinate', type: 'number' },
        { name: 'sy', label: 'Starting y-coordinate', type: 'number' },
        { name: 'ex', label: 'Ending x-coordinate', type: 'number' },
        { name: 'ey', label: 'Ending y-coordinate', type: 'number' },
        { name: 'lc', label: 'Line color', type: 'color' },
        { name: 'lw', label: 'Line width(px)', type: 'number' },
      ],
    };

    setToolInputs(obj);
    showModal();
  };

  const handleTextClick = () => {
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

  const drawElements = (obj: any) => {
    // const canvas: any = canvasRef.current;
    // ctxRef.current = canvas.getContext('2d');
    console.log(ctxRef.current);
    if (obj.type === 'rect') {
      ctxRef.current.fillStyle = obj.details.fc || '#000';
      ctxRef.current.strokeStyle = obj.details.bc || '#000';
      ctxRef.current.lineWidth = obj.details.bw || 1;
      ctxRef.current.strokeRect(obj.details.x || 0, obj.details.y || 0, obj.details.w, obj.details.h);
      ctxRef.current.fillRect(obj.details.x || 0, obj.details.y || 0, obj.details.w, obj.details.h);
    } else if (obj.type === 'line') {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(obj.details.sx || 0, obj.details.sy || 0);
      ctxRef.current.lineTo(obj.details.ex || 0, obj.details.ey || 0);
      ctxRef.current.strokeStyle = obj.details.lc || '#000';
      ctxRef.current.lineWidth = obj.details.lw || 1;
      ctxRef.current.stroke();
    } else if (obj.type === 'text') {
      ctxRef.current.font = `${obj.details.fs || 14}px Arial`;
      ctxRef.current.fillText(obj.details.t || '', obj.details.x || 0, obj.details.y || 0);
    }

    ctxRef.current.save();
  };

  useEffect(() => {
    console.log(styles);
  }, [styles]);

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
        <canvas className="canvas" ref={canvasRef} onChange={handleCanvasChange}>
          Use a Modern Browser which supports Canvas
        </canvas>
        <div className="side-bar">
          <div className="side-bar-btns">
            <img src={rectangleIcon} onClick={() => handleRectClick()} />
          </div>
          <div className="side-bar-btns">
            <img src={lineIcon} onClick={() => handleLineClick()} />
          </div>
          <div className="side-bar-btns">
            <img src={circleIcon} />
          </div>
          <div className="side-bar-btns">
            <img src={textIcon} onClick={() => handleTextClick()} />
          </div>
        </div>
      </main>
      <Modal showModal={modalShow} onClose={hideModal} toolInputs={toolInputs} draw={drawElements} />
    </div>
  );
}

export default Canvas;
