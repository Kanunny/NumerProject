import React, { useState, useEffect } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import axios from "axios";

function NewtonDivided() {
    const [size, setSize] = useState(3);
    const [xValue, setXValue] = useState("");
    const [vectorX, setVectorX] = useState(Array(size).fill(""));
    const [vectorY, setVectorY] = useState(Array(size).fill(""));
    const [result, setResult] = useState("");

    const fetchRandomEquation = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/inter'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
            if (response.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.length);
                const randomEquation = response.data[randomIndex];
                setVectorX(randomEquation.x);
                setVectorY(randomEquation.y);
                setSize(randomEquation.size);
            }
        } catch (error) {
            console.error("Error fetching random equation", error);
        }
    };

    const inputSize = (event) => {
        const newSize = Number(event.target.value);
        if (newSize < 0) {
            return;
        } else {
            setSize(Number(newSize));
        }
    };

    const inputXValue = (event) => {
        setXValue(event.target.value);
    };

    useEffect(() => {
        const newVectorX = Array(Number(size)).fill("");
        const newVectorY = Array(Number(size)).fill("");
        setVectorX(newVectorX);
        setVectorY(newVectorY);
    }, [size]);

    const handleInputChange = (setVector, vector, rowIndex, value) => {
        const newVector = [...vector];
        newVector[rowIndex] = value;
        setVector(newVector);
    };

    const recursive = (xNew, xOld, i, a, y) => {
        if (xNew >= a.length || xOld >= a.length || xNew < 0 || xOld < 0) {
            throw new Error("Index out of bounds");
        }

        if (i === 0) {
            return y[xOld];
        } else if (i === 1) {
            return (y[xNew] - y[xOld]) / (a[xNew] - a[xOld]);
        } else {
            return (
                (recursive(xNew, xOld + 1, i - 1, a, y) -
                    recursive(xNew - 1, xOld, i - 1, a, y)) /
                (a[xNew] - a[xOld])
            );
        }
    };

    const calNewtondivi = () => {
        const a = vectorX.map(Number);
        const y = vectorY.map(Number);
        const x = parseFloat(xValue);
        let sum = 0;
        let multiX = 1;
        if (isNaN(xValue) || xValue === "") {
            alert("กรุณาใส่ค่า x");
            return;
        } else if (vectorX.includes("") || vectorY.includes("")) {
            alert("กรุณาใส่ค่าแต่ละจุด x และ f(x)");
            return;
        }
        for (let i = 0; i < size; i++) {
            multiX = 1;
            for (let j = 0; j < i; j++) {
                multiX *= x - a[j];
            }
            sum += recursive(i, 0, i, a, y) * multiX;
        }
        setResult(sum);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">Newton's Divided Difference</h1>
                <div className="bg-primary-200 shadow-lg rounded-lg p-6">
                    <div className="flex gap-4">
                        <div>
                            <InlineMath math="Number \;of \;Points : (N)" />
                            <input
                                type="number"
                                value={size}
                                onChange={inputSize}
                                className="input input-primary mb-4 w-full"
                            />
                        </div>

                        <div>
                            <InlineMath math="x \;Value" />
                            <input
                                type="number"
                                value={xValue}
                                onChange={inputXValue}
                                placeholder="ใส่ค่า x"
                                className="input input-primary mb-4 w-full"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row mb-4 justify-center">
                        <div className="grid gap-2 mr-4">
                            {vectorX.map((value, rowIndex) => (
                                <div className="flex items-center" key={rowIndex}>
                                    <span className="mr-2">{rowIndex + 1}.</span>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) =>
                                            handleInputChange(
                                                setVectorX,
                                                vectorX,
                                                rowIndex,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`x${rowIndex + 1}`}
                                        className="input input-primary "
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-2">
                            {vectorY.map((value, rowIndex) => (
                                <div className="flex items-center" key={rowIndex}>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) =>
                                            handleInputChange(
                                                setVectorY,
                                                vectorY,
                                                rowIndex,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`f(x${rowIndex + 1})`}
                                        className="input input-primary "
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-6 justify-center">
                    <button className="btn btn-primary" onClick={calNewtondivi}>
                        คำนวณ
                    </button>
                        <button className="btn btn-primary" onClick={fetchRandomEquation}>
                            Random
                        </button>
                    </div>

                    <div className="flex justify-center mt-4">
                        <InlineMath
                            math={`Result = ${result}`}
                            className="text-xl font-semibold"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewtonDivided;
