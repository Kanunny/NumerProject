import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import axios from "axios";

function SingTrap() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [Equation, setEquation] = useState("");
    const [ans, setAns] = useState("");

    const fetchRandomEquation = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/integral'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
            if (response.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.length);
                const randomEquation = response.data[randomIndex];
                setEquation(randomEquation.equation);
                setA(randomEquation.a);
                setB(randomEquation.b);
            }
        } catch (error) {
            console.error("Error fetching random equation", error);
        }
    };

    const inputEquation = (e) => {
        setEquation(e.target.value);
    };

    const inputA = (e) => {
        setA(e.target.value);
    };

    const inputB = (e) => {
        setB(e.target.value);
    };

    const calculateSingTrap = () => {
        const aNum = parseFloat(a);
        const bNum = parseFloat(b);

        // Input validation
        if (isNaN(aNum) || isNaN(bNum)) {
            alert("กรุณาใส่ค่า a และ b ที่ถูกต้อง");
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

        // Calculate using Single Trapezoidal Rule
        const h = (bNum - aNum) / 2; // Step size
        const sum = evaluateFunc(aNum) + evaluateFunc(bNum); // f(a) + f(b)
        const result = h * sum; // Area calculation

        setAns(result); // Set the result
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">Single Trapezoidal Rule</h1>

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
                </div>

                <div className="flex gap-6 justify-center">
                    <button className="btn btn-primary mt-5" onClick={calculateSingTrap}>
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
        </>
    );
}

export default SingTrap;
