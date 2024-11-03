
import { InlineMath } from "react-katex"
import "katex/dist/katex.min.css";
import React, { use } from "react"
import { useState, useEffect } from "react"
import { im } from "mathjs";
import axios from "axios";

function Spline() {
    const [size, setSize] = useState(3)
    const [xValue, setXValue] = useState("")
    const [vectorX, setVectorX] = useState(Array(size).fill([]))
    const [vectorY, setVectorY] = useState(Array(size).fill([]))
    const [result, setResult] = useState('');

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
        if (event.target.value < 0) {
            return
        }
        setSize(parseInt(event.target.value) || 0)
    }

    const inputXValue = (event) => {
        setXValue(event.target.value)
    }

    useEffect(() => {
        const newVectorX = Array(size).fill("")
        const newVectorY = Array(size).fill("")

        setVectorX(newVectorX)
        setVectorY(newVectorY)
    }, [size])

    const handleInputChange = (setVector, vector, rowIndex, value) => {
        const newVector = [...vector]
        newVector[rowIndex] = value
        setVector(newVector)
    }

    const calSpline = () => {
        const a = vectorX.map(Number);
        const y = vectorY.map(Number);
        const x = parseFloat(xValue);
        let fxn = 0;

        for (let i = 1; i < size; i++) {
            if (x < a[i]) {
                let m = (y[i] - y[i - 1]) / (a[i] - a[i - 1])
                fxn = y[i - 1] + m * (x - a[i - 1])
                break;
            }
        }
        setResult(fxn);
    }
    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">Spline interpolation</h1>
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
                        <button className="btn btn-primary" onClick={calSpline}>
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
    )
}

export default Spline