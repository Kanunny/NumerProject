import React, { useState, useEffect } from "react";
import { evaluate, im } from "mathjs";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import Plot from "react-plotly.js";
import axios from "axios";

function CompoSimson() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [n, setN] = useState(2); // Number of intervals
    const [Equation, setEquation] = useState("");
    const [ans, setAns] = useState("");
    const [chatr, setChatr] = useState([]);

    const fetchRandomEquation = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/integral'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
            if (response.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.length);
                const randomEquation = response.data[randomIndex];
                setEquation(randomEquation.equation);
                setA(randomEquation.a);
                setB(randomEquation.b);
                setN(randomEquation.n);
            }
        } catch (error) {
            console.error("Error fetching random equation", error);
        }
    };
    useEffect(() => {
        fetchRandomEquation(); // เรียกใช้ฟังก์ชันดึงโจทย์เมื่อคอมโพเนนต์ติดตั้ง
    }, []);

    const inputEquation = (e) => {
        setEquation(e.target.value);
    };

    const inputA = (e) => {
        setA(e.target.value);
    };

    const inputB = (e) => {
        setB(e.target.value);
    };

    const inputN = (e) => {
        setN(e.target.value);
    };


    const calculateCompositeSimpson = () => {
        const aNum = parseFloat(a);
        const bNum = parseFloat(b);
        const nNum = parseInt(n);

        // Input validation
        if (isNaN(aNum) || isNaN(bNum) || isNaN(nNum) || nNum <= 0 || nNum % 2 !== 0) {
            alert("กรุณาใส่ค่า a, b ที่ถูกต้อง และ n จะต้องเป็นจำนวนคู่");
            return;
        }
        if (Equation.trim() === "") {
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

        const h = (bNum - aNum) / nNum; // Step size
        let sum = evaluateFunc(aNum) + evaluateFunc(bNum); // f(a) + f(b)

        const newChart = [{ x: aNum, result: sum }];

        for (let i = 1; i < nNum; i++) {
            const x = aNum + i * h;
            if (i % 2 === 0) {
                sum += 2 * evaluateFunc(x); // Even indexed terms
                newChart.push({ x: x, result: sum });
            } else {
                sum += 4 * evaluateFunc(x); // Odd indexed terms
                newChart.push({ x: x, result: sum });
            }
        }
        setChatr(newChart);
        const result = (h / 3) * sum; // Final area calculation
        setAns(result); // Set the result
        console.log(chatr);
    };

    const data = [
        {
            x: chatr.map((poin) => poin.x),
            y: chatr.map((poin) => poin.result),
            fill: "tozeroy",
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
        },
        {
            x: chatr.map((poin) => poin.x),
            y: chatr.map((poin) => poin.result),
            type: "scatter",
            mode: "lines",
            marker: { color: "blue" },
        },
    ];

    const layout = {
        title: "Composite Simpson's Rule",
        xaxis: {
            title: "x",
        },
        yaxis: {
            title: "f(x)",
        },
    };


    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">Composite Simpson's Rule</h1>

                <InlineMath className='text-2xl'>
                    {`\\int_{${a}}^{${b}} ${Equation ? Equation : "f(x)"} \\, dx`}
                </InlineMath>

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
                            <p className="flex justify-center">a</p>
                        </div>
                        <input
                            type="number"
                            value={a}
                            onChange={inputA}
                            placeholder="ใส่ a"
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </div>

                    <div className="w-[200px]">
                        <p className="flex justify-center">b</p>
                        <input
                            type="number"
                            value={b}
                            onChange={inputB}
                            placeholder="ใส่ b"
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </div>

                    <div className="w-[200px]">
                        <p className="flex justify-center">n</p>
                        <input
                            type="number"
                            value={n}
                            onChange={inputN}
                            placeholder="ใส่ n (คู่)"
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </div>
                </div>

                <div className="flex gap-6 justify-center">
                    <button className="btn btn-primary mt-5" onClick={calculateCompositeSimpson}>
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
            </div>
            <Plot data={data} layout={layout} />
        </>
    );
}

export default CompoSimson;
