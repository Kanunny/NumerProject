import React, { useState, useEffect } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import axios from "axios";

function Lagrange() {
    const [size, setSize] = useState(3);
    const [xValue, setXValue] = useState("");
    const [mOrder, setMOrder] = useState("");
    const [vectorX, setVectorX] = useState([]);
    const [vectorY, setVectorY] = useState([]);
    const [result, setResult] = useState("");

    const fetchRandomEquation = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/inter'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
            if (response.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.length);
                const randomEquation = response.data[randomIndex];
                setMOrder(randomEquation.m);
                setVectorX(randomEquation.x);
                setVectorY(randomEquation.y);
                setSize(randomEquation.size);
            }
        } catch (error) {
            console.error("Error fetching random equation", error);
        }
    };

    const inputSize = (event) => {
        const newSize = parseInt(event.target.value);
        if (newSize < 0) {
            return;
        }
        setSize(newSize);
    };

    const inputXValue = (event) => {
        setXValue(event.target.value);
    };

    const inputMOrder = (event) => {
        setMOrder(event.target.value);
    };

    useEffect(() => {
        setVectorX(Array(size).fill(""));
        setVectorY(Array(size).fill(""));
    }, [size]);

    const handleInputChange = (setVector, vector, rowIndex, value) => {
        const newVector = [...vector];
        newVector[rowIndex] = value;
        setVector(newVector);
    };

    const generateMatrix = (m) => {
        const X = vectorX.map(Number);
        const Y = vectorY.map(Number);
        let matrix = Array(m + 1).fill(0).map(() => Array(m + 1).fill(0));
        let vectorB = Array(m + 1).fill(0);
        let xx = [];

        // Calculate values in the matrix and vector
        for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= m; j++) {
                matrix[i][j] = X.reduce((sum, x) => sum + Math.pow(x, i + j), 0);
            }
            vectorB[i] = X.reduce((sum, x, index) => sum + Y[index] * Math.pow(x, i), 0);
        }

        // Calculate determinant of matrix A
        let detA = det(matrix);
        for (let i = 0; i <= m; i++) {
            const modifiedMatrix = matrix.map((row, rowIndex) => {
                const newRow = [...row];
                newRow[i] = vectorB[rowIndex]; // Replace column i
                return newRow;
            });

            const detAi = det(modifiedMatrix);
            xx[i] = detAi / detA;
        }

        return xx;
    };

    const calRegression = () => {
        const m = parseInt(mOrder);
        const x = parseFloat(xValue);
        let sum = 0;
        let a = generateMatrix(m);

        for (let i = 0; i <= m; i++) { // Change < to <= to include all orders
            sum += a[i] * Math.pow(x, i);
        }

        setResult(sum);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">Lagrange Interpolation</h1>
                <div className="bg-primary-200 shadow-lg rounded-lg p-6">
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <InlineMath math="Number \;of \;Points : (N)" />
                            <input
                                type='number'
                                value={size}
                                onChange={inputSize}
                                placeholder='Number of points'
                                className='input input-primary'
                            />
                        </div>

                        <div className="flex flex-col">
                            <InlineMath math="x \;Value" />
                            <input
                                type='text'
                                value={xValue}
                                onChange={inputXValue}
                                placeholder='X value'
                                className='input input-primary'
                            />
                        </div>

                        <div className="flex flex-col">
                            <InlineMath math="M \;Order" />
                            <input
                                type='text'
                                value={mOrder}
                                onChange={inputMOrder}
                                placeholder='M Order'
                                className='input input-primary'
                            />
                        </div>
                    </div>



                    <div className="flex flex-row mb-4 justify-center mt-4  ">
                        <div className="grid gap-2 mr-4">
                            {vectorX.map((value, rowIndex) => (
                                <div className="flex items-center" key={rowIndex}>
                                    <span className="mr-2">{rowIndex + 1}.</span>
                                    <input
                                        type="text"
                                        key={rowIndex}
                                        value={value}
                                        onChange={(e) => handleInputChange(
                                            setVectorX,
                                            vectorX,
                                            rowIndex,
                                            e.target.value)}
                                        placeholder={`x${rowIndex + 1}`}
                                        className="input input-primary"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-2">
                            {vectorY.map((value, rowIndex) => (
                                <div className="flex items-center" key={rowIndex}>
                                    <input
                                        type="text"
                                        key={rowIndex}
                                        value={value}
                                        onChange={(e) => handleInputChange(setVectorY,
                                            vectorY,
                                            rowIndex,
                                            e.target.value)}
                                        className="input input-primary"
                                        placeholder={`y${rowIndex + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex gap-6 justify-center">
                        <button className="btn btn-primary" onClick={calRegression}>Calculate</button>
                        <button className="btn btn-primary" onClick={fetchRandomEquation}>Random</button>
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

export default Lagrange;
