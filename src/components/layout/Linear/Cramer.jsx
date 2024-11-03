import React, { useEffect, useState } from "react";
import { det } from "mathjs";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function Cramer() {
    const [size, setSize] = useState(2);
    const [matrixA, setMatrixA] = useState(Array.from({ length: size }, () => Array(size).fill("")));
    const [matrixB, setMatrixB] = useState(Array(size).fill(""));
    const [resultX, setResultX] = useState(Array(size).fill(""));
    const [errorValue, setErrorValue] = useState(0.000001);
    const [solutionSteps, setSolutionSteps] = useState([]);

    useEffect(() => {
        const newMatrixA = Array.from({ length: size }, () => Array(size).fill(""));
        const newMatrixB = Array(size).fill("");
        const newResultX = Array(size).fill("");

        setMatrixA(newMatrixA);
        setMatrixB(newMatrixB);
        setResultX(newResultX);
        setSolutionSteps([]);
    }, [size]);

    const calculateCramer = () => {
        const a = matrixA.map(row => row.map(Number));
        const b = matrixB.map(Number);
        const detA = det(a);

        if (Math.abs(detA) <= errorValue) {
            alert("The determinant of the matrix is zero. The system has no unique solution.");
            return;
        }

        const x = [...resultX];
        let steps = [];

        // Step for det(A)
        steps.push(`\\text{det}(A) = ${detA.toFixed(6)}`);

        // Calculation of each variable x_i
        for (let i = 0; i < size; i++) {
            const modifiedMatrix = a.map((row, rowIndex) => {
                const newRow = [...row];
                newRow[i] = b[rowIndex];
                return newRow;
            });

            const detAi = det(modifiedMatrix);
            x[i] = (detAi / detA).toFixed(6);

            steps.push(`x_{${i + 1}} = \\frac{\\text{det}(A_{${i + 1}})}{\\text{det}(A)} = \\frac{${detAi.toFixed(6)}}{${detA.toFixed(6)}} = ${x[i]}`);
        }

        setResultX(x);
        setSolutionSteps(steps);
    };

    const handleInputChange = (setMatrix, matrix, rowIndex, colIndex, value) => {
        const newMatrix = [...matrix];
        if (colIndex !== null) {
            newMatrix[rowIndex][colIndex] = value;
        } else {
            newMatrix[rowIndex] = value;
        }
        setMatrix(newMatrix);
    };

    const resetMatrix = () => {
        setMatrixA(Array.from({ length: size }, () => Array(size).fill("")));
        setMatrixB(Array(size).fill(""));
        setResultX(Array(size).fill(""));
        setErrorValue(0.000001);
        setSolutionSteps([]);
    };

    return (
        <>
        <div className="flex flex-col justify-center items-center">
            <h1 className="mb-5">Cramer's Rule</h1>

            <div className="flex items-center">
                <label>Matrix size (NxN):</label>
                <input
                    type="number"
                    value={size}
                    min="1"
                    onChange={(e) => setSize(parseInt(e.target.value) || 1)}
                    placeholder="Size"
                    className="input input-bordered w-full max-w-xs ml-2"
                    />
                <button className="btn btn-error ml-4" onClick={resetMatrix}>
                    Reset
                </button>
                <button className="btn btn-primary ml-4" onClick={calculateCramer}>
                    Calculate
                </button>
            </div>

            <div className="mt-5">
                <p className="flex justify-center">Error</p>
                <input
                    type="number"
                    value={errorValue}
                    onChange={(e) => setErrorValue(parseFloat(e.target.value) || 0.000001)}
                    placeholder="Error Tolerance"
                    className="input input-bordered input-primary w-full max-w-xs"
                    />
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                {/* Matrix A */}
                <div className="flex flex-col items-center">
                    <InlineMath math="[A]" />
                    {matrixA.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex">
                            {row.map((value, colIndex) => (
                                <input
                                key={colIndex}
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    handleInputChange(setMatrixA, matrixA, rowIndex, colIndex, e.target.value)
                                }
                                className="border rounded w-12 h-12 m-1 text-center"
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Matrix X */}
                <div className="flex flex-col items-center">
                    <InlineMath math="{x}" />
                    {resultX.map((value, rowIndex) => (
                        <input
                        key={rowIndex}
                        type="text"
                        value={value}
                        readOnly
                        className="border rounded w-12 h-12 m-1 text-center"
                        placeholder={`x${rowIndex + 1}`}
                        />
                    ))}
                </div>

                {/* Equals sign */}
                <div>
                    <InlineMath math="=" />
                </div>

                {/* Matrix B */}
                <div className="flex flex-col items-center">
                    <InlineMath math="{B}" />
                    {matrixB.map((value, rowIndex) => (
                        <input
                        key={rowIndex}
                        type="text"
                        value={value}
                        onChange={(e) =>
                            handleInputChange(setMatrixB, matrixB, rowIndex, null, e.target.value)
                        }
                        className="border rounded w-12 h-12 m-1 text-center"
                        placeholder={`b${rowIndex + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Display Solution Steps */}
            <div className="mt-4">
                {solutionSteps.map((step, index) => (
                    <div key={index} className="mb-2">
                        <InlineMath math={step} />
                    </div>
                ))}
            </div>
        </div>
            </>
    );
}

export default Cramer;
