import React, { useState } from "react";
import { MathJax } from "better-react-mathjax";
import { evaluate } from "mathjs";
import axios from "axios";
import Plot from "react-plotly.js";


function OnePoint() {
    const [results, setResults] = useState([]);
    const [equation, setEquation] = useState("");
    const [x0, setX0] = useState("");
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
                setX0(randomEquation.xn);
            }
        } catch (error) {
            console.error("Error fetching random equation", error);
        }
    };



    const inputEquation = (e) => {
        setEquation(e.target.value);
    };

    const inputX0 = (e) => {
        setX0(parseFloat(e.target.value));
    };

    const inputErrorValue = (e) => {
        setErrorValue(parseFloat(e.target.value));
    };

    const calculateOnePoint = () => {
        let x0Num = parseFloat(x0);
        const errorValNum = parseFloat(errorValue);

        if (isNaN(x0Num)) {
            alert("กรุณาใส่ค่า X0 ที่ถูกต้อง");
            return;
        } else if (equation.trim() === "") {
            alert("กรุณาใส่สมการ");
            return;
        }

        const evaluateFunc = (x) => {
            try {
                return evaluate(equation, { x });
            } catch (error) {
                alert("สมการไม่ถูกต้อง");
                return null;
            }
        };

        const results = [];
        let x1;
        let iteration = 0;
        let error = Infinity;

        while (error >= errorValNum) {
            x1 = evaluateFunc(x0Num);
            error = Math.abs(x1 - x0Num) / x1;

            results.push({
                Iteration: iteration + 1,
                X0: x0Num,
                X1: x1,
                Error: error,
            });

            x0Num = x1;
            iteration++;
        }

        setChatr(results);
        setResults(results);
        setAns(x1);
    };

    const data = [
        {
            x: results.map((poin) => poin.Iteration),
            y: results.map((poin) => poin.X1),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
        },
    ];

    const layout = {
        width: 500, height: 500, title: 'OnePoint',
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
                <h1 className="mb-5">One Point Method</h1>
                <MathJax inline dynamic>
                    {"`X_n+_1 = $`".replaceAll("$", equation ? equation : "")}
                </MathJax>

                <div>
                    <input
                        type="text"
                        value={equation}
                        onChange={inputEquation}
                        placeholder="ใส่สมการ (เช่น: x^2 - x - 2)"
                        className="input input-bordered input-primary w-full max-w-xs mt-5"
                    />
                </div>

                <div className="mt-5">
                    <p className="flex justify-center">X Initial</p>
                    <input
                        type="number"
                        value={x0 || ""}
                        onChange={inputX0}
                        placeholder="ใส่ค่า X0"
                        className="input input-bordered input-primary w-full max-w-xs"
                    />
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
                    <button className="btn btn-primary mt-5" onClick={calculateOnePoint}>
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
                    <div className="mt-10 w-full">
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
                                    <th className="border border-gray-400 px-4 py-2">
                                        ค่าความผิดพลาด
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, index) => (
                                    <tr key={index} className="text-justify">
                                        <td className="border border-gray-400 px-4 py-2">
                                            {row.Iteration}
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            {row.X0}
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            {row.X1}
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            {row.Error}
                                        </td>
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

export default OnePoint;
