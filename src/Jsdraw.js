/* eslint-disable */
import { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
function Jsdraw() {
  const width = 225;
  const height = 300;
  const canvasRef = useRef(null);
  const printRef = useRef();
  const [wartosc, setWartosc] = useState("");
  const T = [width / 2, width / 6]; // translation x, y
  const Z = [0, 0, 0, width]; // zero
  // coordinates x-start, y-start, x-end, y-end
  const JE = [0, 0, 1, 0]; // one
  const DW = [0, 1, 1, 1]; // two
  const TR = [0, 0, 1, 1]; // three
  const CZ = [0, 1, 1, 0]; // four
  const SZ = [1, 0, 1, 1]; // five
  // number ABCD - order of magnitude depending transformation
  const A = [-1, 1];
  const B = [1, 1];
  const C = [-1, 0];
  const D = [1, 0];
  const drawZero = (context) => {
    context.beginPath();
    context.moveTo(Z[0] + T[0], Z[1] + T[1]);
    context.lineTo(Z[2] + T[0], Z[3] + T[1]);
    context.stroke();
  };
  // drawing 1, 2, 3, 4, 6
  // PX, PY - factors ABCD correspond to the order of magnitude
  const drawLine = (context, DIGIT, PX, PY) => {
    context.beginPath();
    context.moveTo(((DIGIT[0] * height) / 4) * PX + T[0], (DIGIT[1] * height) / 4 + T[1] + PY * (width - (2 * DIGIT[1] * height) / 4));
    context.lineTo(((DIGIT[2] * height) / 4) * PX + T[0], (DIGIT[3] * height) / 4 + T[1] + PY * (width - (2 * DIGIT[3] * height) / 4));
    context.stroke();
  };
  // drawing 5, 7, 8
  const drawDouble = (context, LI, BI, PX, PY) => {
    drawLine(context, LI, PX, PY);
    drawLine(context, BI, PX, PY);
  };
  // drawing 9
  const drawNine = (context, PX, PY) => {
    drawLine(context, JE, PX, PY);
    drawLine(context, DW, PX, PY);
    drawLine(context, SZ, PX, PY);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.strokeStyle = "black";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 15;
    if (wartosc != "") {
      drawZero(context);
      let a = wartosc?.slice(-4, -3);
      let b = wartosc?.slice(-3, -2);
      let c = wartosc?.slice(-2, -1);
      let d = wartosc?.slice(-1);
      const arrFunctions = [
        (X) => drawLine(context, JE, X[0], X[1]),
        (X) => drawLine(context, DW, X[0], X[1]),
        (X) => drawLine(context, TR, X[0], X[1]),
        (X) => drawLine(context, CZ, X[0], X[1]),
        (X) => drawDouble(context, JE, CZ, X[0], X[1]),
        (X) => drawLine(context, SZ, X[0], X[1]),
        (X) => drawDouble(context, JE, SZ, X[0], X[1]),
        (X) => drawDouble(context, DW, SZ, X[0], X[1]),
        (X) => drawNine(context, X[0], X[1]),
      ];
      if (d > 0) arrFunctions[d - 1](D);
      if (c > 0) arrFunctions[c - 1](C);
      if (b > 0) arrFunctions[b - 1](B);
      if (a > 0) arrFunctions[a - 1](A);
    }
  }, [wartosc]);
  const fireChange = (e) => {
    let isCorrectForm = /^[0-9]+$/.test(e.target.value);
    if (isCorrectForm) {
      setWartosc(e.target.value);
    } else {
      setWartosc("");
    }
  };
  // DWONLOAD IMAGE, EXTERNAL LIBRARY
  const handleDownloadImage = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const [view, setView] = useState(false);
  const handleInfo = () => {
    setView(!view);
  };
  return (
    <div className="flex_container">
      <div className="info">
        {view && (
          <div className="text">
            <span className="title">About The Runes</span>
            <br />
            <br />
            author : Q 2023
            <br />
            task :{" "}
            <a href="https://moleculeone.notion.site/Code-assignment-JS-Q4-22-f1f17670f99245d0b821c5768ea1fcdf" target="_blank">
              Numbers to runic...
            </a>
            <br />
            git repo :{" "}
            <a href="https://github.com/Kervion/runes-public" target="_blank">
              Runes - public
            </a>
            <br />
            algorithm : cross matrix
            <br />
            backgroud : midjourney
          </div>
        )}
        <div className="open" onClick={handleInfo}>
          info
        </div>
      </div>
      <h1>The Runes</h1>
      <div ref={printRef} className="square">
        <canvas ref={canvasRef} className="canvas" />
      </div>
      <h4>Insert any number from 0 to 9999</h4>
      <div className="interface">
        <input value={wartosc} className="inputx" onChange={fireChange} maxLength={4} />
        <button onClick={handleDownloadImage} className="buttonx">
          Generate image
        </button>
      </div>
    </div>
  );
}
export default Jsdraw;
