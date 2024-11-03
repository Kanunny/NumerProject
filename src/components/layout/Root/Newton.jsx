import React, { useState } from "react";
import { MathJax } from "better-react-mathjax";
import { evaluate, derivative, im } from "mathjs"; // ใช้ derivative เพื่อหาอนุพันธ์ของสมการ
import axios from "axios";
import Plot from "react-plotly.js";

function Newton() {
  const [results, setResults] = useState([]);
  const [initialGuess, setInitialGuess] = useState(""); // ค่าเริ่มต้น
  const [Equation, setEquation] = useState("");
  const [errorValue, setErrorValue] = useState(0.000001);
  const [ans, setAns] = useState("");
  const [chatr, setChatr] = useState([]);

  const fetchRandomEquation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/root'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
      if (response.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomEquation = response.data[randomIndex];
        setEquation(randomEquation.equation);
        setInitialGuess(randomEquation.xn); // ตั้งค่าค่า xl จากโจทย์
      }
    } catch (error) {
      console.error("Error fetching random equation", error);
    }
  };


  const inputEquation = (e) => {
    setEquation(e.target.value);
  };

  const inputInitialGuess = (e) => {
    setInitialGuess(e.target.value);
  };

  const inputErrorValue = (e) => {
    setErrorValue(e.target.value);
  };

  const calculateNewtonRaphson = () => {
    const results = [];
    let xOld = parseFloat(initialGuess);
    const errorVal = parseFloat(errorValue);
    let iteration = 1;
    const maxIterations = 50;

    if (isNaN(xOld)) {
      alert("กรุณาใส่ค่าเริ่มต้นที่ถูกต้อง");
      return;
    } else if (Equation.trim() === "") {
      alert("กรุณาใส่สมการ");
      return;
    }

    const evaluateFunc = (x) => {
      try {
        return evaluate(Equation, { x });
      } catch (error) {
        alert("สมการไม่ถูกต้อง");
        return null;
      }
    };

    const evaluateDerivative = (x) => {
      try {
        const derivativeFunc = derivative(Equation, "x").evaluate({ x });
        return derivativeFunc;
      } catch (error) {
        alert("ไม่สามารถคำนวณอนุพันธ์ได้");
        return null;
      }
    };

    let error = Infinity;
    while (error > errorVal && iteration < maxIterations) {
      const fx = evaluateFunc(xOld);
      const fPrimeX = evaluateDerivative(xOld);

      if (fPrimeX === 0 || fx === null || fPrimeX === null) {
        alert("ไม่สามารถดำเนินการได้: อนุพันธ์เท่ากับ 0 หรือสมการไม่ถูกต้อง");
        return;
      }

      const xNew = xOld - fx / fPrimeX;
      error = Math.abs(xNew - xOld);

      results.push({
        Iteration: iteration,
        X: xNew,
        Error: error,
      });

      xOld = xNew;
      iteration++;
    }

    setChatr(results);
    setResults(results);
    setAns(xOld); // ค่าผลลัพธ์ที่ใกล้เคียงที่สุด
  };

  const data = [
    {
      x: results.map((poin) => poin.Iteration),
      y: results.map((poin) => poin.X),
      type: 'scatter',
      mode: 'lines+markers',
      marker: {color: 'red'},
    },
  ];

  const layout = {
    width: 500, height: 500, title: 'Newton',
    xaxis: {
      title: {
        text: 'Iteration',
      },
    },
    yaxis: {
      title: {
        text: 'X',
      },
    },
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-5">Newton Raphson Method</h1>
        <MathJax inline dynamic>
          {"`F(x) = $`".replaceAll("$", Equation ? Equation : "")}
        </MathJax>

        <div>
          <input
            type="text"
            value={Equation}
            onChange={inputEquation}
            placeholder="ใส่สมการ"
            className="input input-bordered input-primary w-full max-w-xs mt-5"
          />
        </div>

        <div className="grid grid-flow-col mt-5 gap-5">
          <div className="w-[200px]">
            <div>
              <p className="flex justify-center">Initial Guess</p>
            </div>
            <input
              type="number"
              value={initialGuess || ""}
              onChange={inputInitialGuess}
              placeholder="ค่าเริ่มต้น"
              className="input input-bordered input-primary w-full max-w-xs"
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="flex justify-center">Error</p>
          <input
            type="number"
            value={errorValue}
            onChange={inputErrorValue}
            placeholder="ค่าความผิดพลาด"
            className="input input-bordered input-primary w-full max-w-xs"
          />
        </div>

        <div className="flex gap-6">
          <button className="btn btn-primary mt-5" onClick={calculateNewtonRaphson}>
            คำนวณ
          </button>
          <button className="btn btn-primary mt-5" onClick={fetchRandomEquation}>
            Random
          </button>
        </div>

        {ans !== "" && (
          <div className="mt-10">
            <h2>ผลลัพธ์: {ans}</h2>
          </div>
        )}

        {/* ส่งข้อมูล results ไปยัง Graph */}
        {results.length > 0 && (
          <div className="mt-10">
            <Plot data={data} layout={layout} />
          </div>
        )}

        <h1 className="flex justify-center mt-10">Table</h1>
        <div className="flex justify-center">
          {results.length > 0 && (
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-400 px-4 py-2">รอบที่</th>
                  <th className="border border-gray-400 px-4 py-2">X</th>
                  <th className="border border-gray-400 px-4 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index} className="text-justify">
                    <td className="border border-gray-400 px-4 py-2">{row.Iteration}</td>
                    <td className="border border-gray-400 px-4 py-2">{row.X}</td>
                    <td className="border border-gray-400 px-4 py-2">{row.Error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Newton;
