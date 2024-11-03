import React, { useEffect, useState } from "react";
import { det } from "mathjs";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function LU() {
    const [size, setSize] = useState(2); // Initial matrix size
    const [matrixA, setMatrixA] = useState(Array.from({ length: size }, () => Array(size).fill('')));
    const [matrixB, setMatrixB] = useState(Array(size).fill(''));
    const [resultX, setResultX] = useState(Array(size).fill(''));
    const [errorValue, setErrorValue] = useState(0.000001);
    const [solutionSteps, setSolutionSteps] = useState([]); // Store solution steps for InlineMath

    useEffect(() => {
        const newMatrixA = Array.from({ length: size }, () => Array(size).fill(''));
        const newMatrixB = Array(size).fill('');
        const newResultX = Array(size).fill('');

        setMatrixA(newMatrixA);
        setMatrixB(newMatrixB);
        setResultX(newResultX);
        setSolutionSteps([]);
    }, [size]);

    const calculateLud = () => {
        const a = matrixA.map(row => row.map(Number)); // Convert inputs to numbers
        const b = matrixB.map(Number);
        let x = Array(size).fill(0);
        let y = Array(size).fill(0);
        let l = Array.from({ length: size }, () => Array(size).fill(0));
        let u = Array.from({ length: size }, () => Array(size).fill(0));
        let steps = [];

        for (let i = 0; i < size; i++) {
            //find upper triangular matrix
            for (let k = i; k < size; k++) {
                let sum = 0;
                for (let j = 0; j < i; j++) {
                    sum += l[i][j] * u[j][k];
                }
                u[i][k] = a[i][k] - sum;
            }

            //find lower triangular matrix
            for (let k = i; k < size; k++) {
                if (i === k) {
                    l[i][i] = 1;
                } else {
                    let sum = 0;
                    for (let j = 0; j < i; j++) {
                        sum += l[k][j] * u[j][i];
                    }
                    l[k][i] = (a[k][i] - sum) / u[i][i];
                }
            }
        }
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += l[i][j] * y[j];
            }
            y[i] = b[i] - sum;
        }
        for (let i = size - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < size; j++) {
                sum += u[i][j] * x[j];
            }
            x[i] = (y[i] - sum) / u[i][i];
        }

        for (let i = 0; i < size; i++) {
            steps.push(`X_{${i + 1}} = ${x[i]}`);
        }
        setResultX(x);
        setSolutionSteps(steps); // Set the solution steps for display
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
        setMatrixA(Array.from({ length: size }, () => Array(size).fill('')));
        setMatrixB(Array(size).fill(''));
        setResultX(Array(size).fill(''));
        setEpsilon(0.000001);
        setSolutionSteps([]);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">LU decomposition method</h1>

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
                    <button className="btn btn-primary ml-4" onClick={calculateLud}>
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
    )
};

export default LU