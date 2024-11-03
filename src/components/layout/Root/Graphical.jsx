import React, { useState } from "react";
import { MathJax } from "better-react-mathjax";
import { evaluate } from "mathjs";
import axios from "axios";
import Plot from "react-plotly.js";

function Graphical() {
    const [results, setResults] = useState([]);
    const [xl, setxl] = useState("");
    const [xr, setxr] = useState("");
    const [Equation, setEquation] = useState("");
    const [errorvalue, seterrorvalue] = useState(0.000001);
    const [ans, setans] = useState("");
    const [chatr, setChatr] = useState([]);

    const fetchRandomEquation = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/root'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
            if (response.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.length);
                const randomEquation = response.data[randomIndex];
                setEquation(randomEquation.equation);
                setxl(randomEquation.xl); // ตั้งค่าค่า xl จากโจทย์
                setxr(randomEquation.xr); // ตั้งค่าค่า xr จากโจทย์
            }
        } catch (error) {
            console.error("Error fetching random equation", error);
        }
    };
    // useEffect(() => {
    //     fetchRandomEquation(); // เรียกใช้ฟังก์ชันดึงโจทย์เมื่อคอมโพเนนต์ติดตั้ง
    // }, []);

    const inputEquation = (e) => {
        setEquation(e.target.value);
    };

    const inputXL = (e) => {
        setxl(e.target.value);
    };

    const inputXR = (e) => {
        setxr(e.target.value);
    };

    const inputerrorvalue = (e) => {
        seterrorvalue(e.target.value);
    };

    const evaluateFunc = (x) => {
        return evaluate(Equation, { x });
    };

    const CalGraphical = (xlNum, xrNum) => {
        let iteration = 0;
        const results = [];
        const e = 0.000001;
        let l = xlNum;
        let r = xrNum;
        let foundRoot = false;

        // Find an interval containing a root
        for (let x = xlNum; x < xrNum; x += 0.1) {
            const fxl = evaluateFunc(x);
            const fxr = evaluateFunc(x + 0.1);

            if (fxl * fxr < 0) {
                l = x;
                r = x + 0.1;
                foundRoot = true;
                break;
            }
        }

        if (!foundRoot) {
            alert("ไม่พบช่วงที่มีรากในช่วงที่กำหนด");
            return;
        }

        while (l <= r && iteration < 50) {
            const fxs = evaluateFunc(l);
            const fxplus = evaluateFunc(l + e);

            if (fxs * fxplus < 0) {
                break;
            }

            results.push({
                Iteration: iteration,
                Xl: l,
                Xr: r,
                Xm: l
            });

            l += e;
            iteration++;
        }

        setResults(results); // Update results state
        setans(l); // Update the answer to the last value of l
        setChatr(results);
    };

    const calculateGraphical = () => {
        const xlNum = parseFloat(xl);
        const xrNum = parseFloat(xr);

        // Check for valid numeric inputs
        if (isNaN(xlNum) || isNaN(xrNum)) {
            alert("กรุณาใส่ค่า XL และ XR ที่ถูกต้อง");
            return;
        }

        // Check for a valid equation
        try {
            evaluateFunc(0); // Check if the equation is valid with x=0
        } catch (error) {
            alert("สมการไม่ถูกต้อง");
            return;
        }

        CalGraphical(xlNum, xrNum);
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
        width: 500, height: 500, title: 'Graphical',
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
                <h1 className="mb-5">Graphical Method</h1>
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
                            <p className="flex justify-center">XL</p>
                        </div>
                        <input
                            type="number"
                            value={xl || ""}
                            onChange={inputXL}
                            placeholder="ใส่ XL"
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </div>

                    <div className="w-[200px]">
                        <p className="flex justify-center">XR</p>
                        <input
                            type="number"
                            value={xr || ""}
                            onChange={inputXR}
                            placeholder="ใส่ XR"
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </div>
                </div>

                <div className="mt-5">
                    <p className="flex justify-center">Error</p>
                    <input
                        type="number"
                        value={errorvalue}
                        onChange={inputerrorvalue}
                        placeholder="ค่าความผิดพลาด"
                        className="input input-bordered input-primary w-full max-w-xs"
                    />
                </div>

                <div className="flex gap-6">
                    <button className="btn btn-primary mt-5" onClick={calculateGraphical}>
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
                                    <th className="border border-gray-400 px-4 py-2">XL</th>
                                    <th className="border border-gray-400 px-4 py-2">XR</th>
                                    <th className="border border-gray-400 px-4 py-2">XM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, index) => (
                                    <tr key={index} className="text-justify">
                                        <td className="border border-gray-400 px-4 py-2">
                                            {row.Iteration}
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            {row.Xl}
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            {row.Xr}
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            {row.Xm}
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

export default Graphical;
