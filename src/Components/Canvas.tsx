import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import rectangleIcon from "../assets/Icons/rectangle.png";
import circleIcon from "../assets/Icons/circle.png";
import lineIcon from "../assets/Icons/line.png";
import textIcon from "../assets/Icons/text.png";
import fillColorIcon from "../assets/Icons/fill-color.png";
import borderColorIcon from "../assets/Icons/crayon.png";
import drawingBoard from "../assets/Icons/drawing-board-24.png";

function Canvas() {
  const [styles, setStyles] = useState({
    fillColor: "#000",
    borderColor: "#000",
    borderWidth: 1,
  });
  const [modalShow, setModalShow] = useState(false);
  const [toolInputs, setToolInputs] = useState({
    type: "",
    details: [{ label: "", type: "" }],
  });
  const [currentTool, setCurrentTool] = useState("");

  let borderColorInputRef = useRef<HTMLInputElement>(null);
  let fillColorInputRef = useRef<HTMLInputElement>(null);

  let startX: number = 0;
  let startY: number = 0;
  let endX: number = 0;
  let endY: number = 0;
  let draw = false;

  // Try to replace it with some window load or resize event
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.canvas.width = (window.innerWidth * 90) / 100;
    ctx.canvas.height = (window.innerHeight * 80) / 100;
  }, []);

  const handleColorIconClick = (styleType: string) => {
    if (styleType === "fill") {
      let fillColorInput = fillColorInputRef.current;
      fillColorInput?.click();
    } else if (styleType === "border") {
      let borderColorInput = borderColorInputRef.current;
      borderColorInput?.click();
    }
  };

  const handleColorInputChange = (e: any, styleType: string) => {
    if (styleType === "fill") {
      setStyles({ ...styles, fillColor: e.target.value });
    } else if (styleType === "border") {
      setStyles({ ...styles, borderColor: e.target.value });
    }
  };

  const handleToolClick = (tool: string) => {
    if (tool === currentTool) {
      setCurrentTool("");
      return;
    }
    setCurrentTool(tool);
  };

  const getPosition = (event: any) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let x = 0;
    let y = 0;
    if (canvas?.offsetLeft) {
      x = event.clientX - canvas.offsetLeft;
    }
    if (canvas?.offsetTop) {
      y = event.clientY - canvas.offsetTop;
    }

    return [x, y];
  };

  const clearRectangle = (
    x: number,
    y: number,
    x1: number,
    y1: number,
    ctx: CanvasRenderingContext2D
  ) => {
    let startX = Math.min(x, x1);
    let startY = Math.min(y, y1);
    let width = Math.abs(x1 - x);
    let height = Math.abs(y1 - y);

    // It is erasing anything below it, look into that
    ctx.clearRect(startX, startY, width, height);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(startX, startY, width, height);
    ctx.strokeStyle = styles.borderColor;
  };

  const handleMouseDown = (event: any) => {
    draw = true;
    [startX, startY] = getPosition(event);
    endX = startX;
    endY = startY;
  };

  const handleMouseMove = (event: any) => {
    if (!draw) return;

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.strokeStyle = styles.borderColor;
    ctx.fillStyle = styles.fillColor;
    ctx.lineWidth = 8; // With lineWidth 5 clear rectangle not working

    if (draw) {
      if (currentTool === "rect") {
        // Clear previous rectangles
        // Put some condition here for the first event call
        clearRectangle(startX, startY, endX, endY, ctx);

        [endX, endY] = getPosition(event);

        let width = endX - startX;
        let height = endY - startY;

        ctx.strokeRect(startX, startY, width, height);
        ctx.fillRect(startX, startY, width, height);
      } else if (currentTool === "line") {
        // Clear previous lines
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.lineWidth = 8;
        ctx.strokeStyle = styles.borderColor;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        [endX, endY] = getPosition(event);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      } else {
        ctx.moveTo(endX, endY);
        [endX, endY] = getPosition(event);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
  };

  // Add these function to windows mouse up event because if you take the cursor out of the canvas and then do mouse up and then take bake the cursor back to the canvas then still it will draw
  const handleMouseUp = () => {
    // Store all the shapes
    draw = false;
  };

  const showModal = () => {
    setModalShow(true);
  };
  const hideModal = () => {
    setModalShow(false);
    return true;
  };

  const handleTextClick = () => {
    handleToolClick("text");
    let obj = {
      type: "text",
      details: [
        { name: "t", label: "Text", type: "text" },
        { name: "x", label: "X-coordinate", type: "number" },
        { name: "y", label: "Y-coordinate", type: "number" },
        { name: "fs", label: "Font size", type: "number" },
      ],
    };

    setToolInputs(obj);
    showModal();
  };

  const drawElements = (obj: any) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (obj.type === "rect") {
      ctx.fillStyle = obj.details.fc || "#000";
      ctx.strokeStyle = obj.details.bc || "#000";
      ctx.lineWidth = obj.details.bw || 1;
      ctx.strokeRect(
        obj.details.x || 0,
        obj.details.y || 0,
        obj.details.w,
        obj.details.h
      );
      ctx.fillRect(
        obj.details.x || 0,
        obj.details.y || 0,
        obj.details.w,
        obj.details.h
      );
    } else if (obj.type === "line") {
      ctx.beginPath();
      ctx.moveTo(obj.details.sx || 0, obj.details.sy || 0);
      ctx.lineTo(obj.details.ex || 0, obj.details.ey || 0);
      ctx.strokeStyle = obj.details.lc || "#000";
      ctx.lineWidth = obj.details.lw || 1;
      ctx.stroke();
    } else if (obj.type === "text") {
      ctx.font = `${obj.details.fs || 14}px Arial`;
      ctx.fillText(obj.details.t || "", obj.details.x || 0, obj.details.y || 0);
    }
  };

  return (
    <div className="jam-board">
      <header>
        <div className="jam-board-header">
          <img src={drawingBoard} alt="Drawing Board" />
          <p>Canvas</p>
        </div>
        <div className="tool-bar">
          <div></div>
          <div></div>
          <div className="tool-bar-section">
            <div className="tool-bar-btns">
              <img
                src={borderColorIcon}
                onClick={() => handleColorIconClick("border")}
              />
              <div
                className="color-tab"
                style={{ backgroundColor: styles.borderColor }}
              ></div>
              <input
                type="color"
                style={{ display: "none" }}
                ref={borderColorInputRef}
                onChange={(e) => handleColorInputChange(e, "border")}
              />
            </div>
            <div className="tool-bar-btns">
              <img
                src={fillColorIcon}
                onClick={() => handleColorIconClick("fill")}
              />
              <div
                className="color-tab"
                style={{ backgroundColor: styles.fillColor }}
              ></div>
              <input
                type="color"
                style={{ display: "none" }}
                ref={fillColorInputRef}
                onChange={(e) => handleColorInputChange(e, "fill")}
              />
            </div>
            <div className="tool-bar-btns">{/* <img src={} /> */}</div>
          </div>
        </div>
      </header>
      <main>
        <div className="side-bar">
          <div
            className={`${
              currentTool === "rect" ? "clicked" : null
            } side-bar-btns`}
            onClick={() => handleToolClick("rect")}
          >
            <img src={rectangleIcon} />
          </div>
          <div
            className={`${
              currentTool === "line" ? "clicked" : null
            } side-bar-btns`}
            onClick={() => handleToolClick("line")}
          >
            <img src={lineIcon} />
          </div>
          <div
            className={`${
              currentTool === "circle" ? "clicked" : null
            } side-bar-btns`}
            onClick={() => handleToolClick("circle")}
          >
            <img src={circleIcon} />
          </div>
          <div
            className={`${
              currentTool === "text" ? "clicked" : null
            } side-bar-btns`}
            onClick={() => handleTextClick()}
          >
            <img src={textIcon} />
          </div>
        </div>
        <canvas
          id="canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          Use a Modern Browser which supports Canvas
        </canvas>
      </main>
      <Modal
        showModal={modalShow}
        onClose={hideModal}
        toolInputs={toolInputs}
        draw={drawElements}
      />
    </div>
  );
}

export default Canvas;
