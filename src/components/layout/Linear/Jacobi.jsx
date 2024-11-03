import React, { useEffect, useState } from "react";
import { det } from "mathjs";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function Jacobi() {
    const [size, setSize] = useState(2); // Initial matrix size
    const [matrixA, setMatrixA] = useState(Array.from({ length: size }, () => Array(size).fill('')));
    const [matrixB, setMatrixB] = useState(Array(size).fill(''));
    const [matrixX, setMatrixX] = useState(Array(size).fill(''));
    const [resultX, setResultX] = useState(Array(size).fill(''));
    const [errorValue, setErrorValue] = useState(0.000001);
    const [solutionSteps, setSolutionSteps] = useState([]); // Store solution steps for InlineMath

    useEffect(() => {
        const newMatrixA = Array.from({ length: size }, () => Array(size).fill(''));
        const newMatrixB = Array(size).fill('');
        const newMatrixX = Array(size).fill('');
        const newResultX = Array(size).fill('');

        setMatrixA(newMatrixA);
        setMatrixB(newMatrixB);
        setMatrixX(newMatrixX);
        setResultX(newResultX);
        setSolutionSteps([]);
    }, [size]);

    const calculateJacobi = () => {
        const a = matrixA.map(row => row.map(Number));
        const b = matrixB.map(Number);
        let xNew = [...matrixX].map(Number);
        let xOld = Array(size).fill(0);
        let iteration = 0;
        let steps = [];
        let converged = false;

        while (!converged) {
            converged = true; // Assume converged unless proven otherwise
            for (let i = 0; i < size; i++) {
                let sum = 0;
                for (let j = 0; j < size; j++) {
                    if (j !== i) {
                        sum += a[i][j] * xOld[j];
                    }
                }
                xNew[i] = (b[i] - sum) / a[i][i];

                // Check if the difference between new and old values is less than epsilon
                if (abs(xNew[i] - xOld[i]) >= errorValue) {
                    abs(xNew[i] - xOld[i]);
                    converged = false; // Not converged yet
                }
            }

            // Log the current iteration step for the user
            steps.push(`Iteration ${iteration + 1}: x = [${xNew.join(', ')}] `);

            // Update old x values for the next iteration
            xOld = [...xNew];
            iteration++;

            // Safeguard to prevent infinite loop
            if (iteration > 1000) {
                break;
            }
        }

        setResultX(xNew);
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
        setMatrixA(Array.from({ length: size }, () => Array(size).fill('')));
        setMatrixB(Array(size).fill(''));
        setMatrixX(Array(size).fill(''));
        setEpsilon(0.000001);
        setSolutionSteps([]);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">Jacobi iteration method</h1>

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
                    <button className="btn btn-primary ml-4" onClick={calculateJacobi}>
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

                <div className="flex items-center justify-center gap-4 mt-1">
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
                        {matrixX.map((value, rowIndex) => (
                            <input
                                key={rowIndex}
                                type="text"
                                value={value}
                                onChange={(e) => handleInputChange(setMatrixX, matrixX, rowIndex, null, e.target.value)
                                }
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

export default Jacobi