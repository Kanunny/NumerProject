import React, { useState } from "react";
import { MathJax } from "better-react-mathjax";
import { evaluate } from "mathjs";
import axios from "axios";
import Plot from "react-plotly.js";

function Secant() {
    const [results, setResults] = useState([]);
    const [x0, setX0] = useState("");
    const [x1, setX1] = useState("");
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
                setX0(randomEquation.xl); // ตั้งค่าค่า xl จากโจทย์
                setX1(randomEquation.xr); // ตั้งค่าค่า xr จากโจทย์
            }
        } catch (error) {
            console.error("Error fetching random equation", error);
        }
    };


    const inputEquation = (e) => {
        setEquation(e.target.value);
    };

    const inputX0 = (e) => {
        setX0(e.target.value);
    };

    const inputX1 = (e) => {
        setX1(e.target.value);
    };

    const inputErrorValue = (e) => {
        setErrorValue(e.target.value);
    };

    const calculateSecant = () => {
        const results = [];
        let xOld0 = parseFloat(x0);
        let xOld1 = parseFloat(x1);
        const errorVal = parseFloat(errorValue);
        let iteration = 0;
        const maxIterations = 50;

        if (isNaN(xOld0) || isNaN(xOld1)) {
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

        let xNew;
        let error = Infinity;

        while (error > errorVal && iteration < maxIterations) {  // แก้ไขเงื่อนไขที่นี่
            const fxOld0 = evaluateFunc(xOld0);
            const fxOld1 = evaluateFunc(xOld1);

            if (fxOld1 - fxOld0 === 0) {
                alert("เกิดข้อผิดพลาด: หารด้วย 0");
                return;
            }

            xNew = xOld1 - (fxOld1 * (xOld1 - xOld0)) / (fxOld1 - fxOld0);
            error = Math.abs(xNew - xOld1);

            results.push({
                Iteration: iteration + 1,
                X0: xOld0,
                X1: xOld1,
                Xm: xNew,
                Error: error,
            });

            xOld0 = xOld1;
            xOld1 = xNew;
            iteration++;
        }

        setChatr(results);
        setResults(results);
        setAns(xNew); // ค่าผลลัพธ์ที่ใกล้เคียงที่สุด
    };

    const data = [
        {
            x: results.map((poin) => poin.Iteration),
            y: results.map((poin) => poin.Xm),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
        },
    ];

    const layout = {
        width: 500, height: 500, title: 'Secant',
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
                <h1 className="mb-5">Secant Method</h1>
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
                            <p className="flex justify-center">ค่าเริ่มต้น X0</p>
                        </div>
                        <input
                            type="number"
                            value={x0 || ""}
                            onChange={inputX0}
                            placeholder="ค่าเริ่มต้น X0"
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </div>
                    <div className="w-[200px]">
                        <div>
                            <p className="flex justify-center">ค่าเริ่มต้น X1</p>
                        </div>
                        <input
                            type="number"
                            value={x1 || ""}
                            onChange={inputX1}
                            placeholder="ค่าเริ่มต้น X1"
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
                    <button className="btn btn-primary mt-5" onClick={calculateSecant}>
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
                                    <th className="border border-gray-400 px-4 py-2">X0</th>
                                    <th className="border border-gray-400 px-4 py-2">X1</th>
                                    <th className="border border-gray-400 px-4 py-2">Xm</th>
                                    <th className="border border-gray-400 px-4 py-2">Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, index) => (
                                    <tr key={index} className="text-justify">
                                        <td className="border border-gray-400 px-4 py-2">{row.Iteration}</td>
                                        <td className="border border-gray-400 px-4 py-2">{row.X0}</td>
                                        <td className="border border-gray-400 px-4 py-2">{row.X1}</td>
                                        <td className="border border-gray-400 px-4 py-2">{row.Xm}</td>
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

export default Secant;
