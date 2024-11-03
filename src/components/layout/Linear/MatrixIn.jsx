import React, { useEffect, useState } from "react";
import { det } from "mathjs";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";


function MatrixIn() {
    const [size, setSize] = useState(2); // Initial matrix size
    const [matrixA, setMatrixA] = useState(Array.from({ length: size }, () => Array(size).fill("")));
    const [matrixB, setMatrixB] = useState(Array(size).fill("")); // Matrix B
    const [resultX, setResultX] = useState(Array(size).fill("")); // Resulting X matrix
    const [solutionSteps, setSolutionSteps] = useState([]); // Store solution steps for InlineMath
    const [errorValue, setErrorValue] = useState(0.000001);

    useEffect(() => {
        const newMatrixA = Array.from({ length: size }, () => Array(size).fill(""));
        const newMatrixB = Array(size).fill("");
        const newResultX = Array(size).fill("");
        setMatrixA(newMatrixA);
        setMatrixB(newMatrixB);
        setResultX(newResultX);
        setSolutionSteps([]);
    }, [size]);

    const calculateMatrixInversion = () => {
        let a = matrixA.map((row) => row.map(Number)); // Matrix A
        let b = matrixB.map(Number); // Matrix B
        let n = a.length;
        let identity = Array.from({ length: n }, (_, i) =>
            Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
        );
        let steps = [];

        // Augment matrix A with the identity matrix [A | I]
        for (let i = 0; i < n; i++) {
            a[i] = a[i].concat(identity[i]);
        }

        // Gauss-Jordan Elimination for matrix inversion with detailed steps
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(a[k][i]) > Math.abs(a[maxRow][i])) {
                    maxRow = k;
                }
            }

            // Swap rows
            if (i !== maxRow) {
                let temp = a[i];
                a[i] = a[maxRow];
                a[maxRow] = temp;
                steps.push(`R_{${i + 1}} \\leftrightarrow R_{${maxRow + 1}}`);
                steps.push(
                    `\\begin{bmatrix}${a
                        .map((row) => row.join(" & "))
                        .join(" \\\\ ")}\\end{bmatrix}`
                );
            }

            // Normalize pivot row
            let pivot = a[i][i];
            if (pivot !== 0) {
                for (let j = 0; j < 2 * n; j++) {
                    a[i][j] /= pivot;
                }
                steps.push(`R_{${i + 1}} = \\frac{R_{${i + 1}}}{${pivot.toFixed(6)}}`);
                steps.push(
                    `\\begin{bmatrix}${a
                        .map((row) => row.join(" & "))
                        .join(" \\\\ ")}\\end{bmatrix}`
                );
            }

            // Eliminate other rows
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    let factor = a[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        a[k][j] -= factor * a[i][j];
                    }
                    steps.push(
                        `R_{${k + 1}} = R_{${k + 1}} - (${factor.toFixed(6)}) R_{${i + 1}}`
                    );
                    steps.push(
                        `\\begin{bmatrix}${a
                            .map((row) => row.join(" & "))
                            .join(" \\\\ ")}\\end{bmatrix}`
                    );
                }
            }
        }

        // Extract the inverse matrix from the augmented matrix
        let inverseMatrix = a.map((row) => row.slice(n));

        // Multiply inverseMatrix with matrix B to find matrix X (AX = B -> X = A^(-1)B)
        let x = inverseMatrix.map((row) =>
            row.reduce((sum, value, index) => sum + value * b[index], 0)
        );

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
        setSolutionSteps([]);
    };


    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">Matrix inversion</h1>

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
                    <button className="btn btn-primary ml-4" onClick={calculateMatrixInversion}>
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
                                            handleInputChange(
                                                setMatrixA,
                                                matrixA,
                                                rowIndex,
                                                colIndex,
                                                e.target.value
                                            )
                                        }
                                        className="border rounded w-12 h-12 m-1 text-center"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Matrix B */}
                    <div className="flex flex-col">
                        <InlineMath math="[B]" />
                        {matrixB.map((value, rowIndex) => (
                            <input
                                key={rowIndex}
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    handleInputChange(setMatrixB, matrixB, rowIndex, null, e.target.value)
                                }
                                className="border rounded w-12 h-12 m-1 text-center"
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

                {/* Display Inverse Matrix Results */}
                <div className="mt-4 text-center">
                    {Array.isArray(resultX) && resultX.length > 0 && (
                        <InlineMath
                            math={`X = \\begin{bmatrix} ${resultX.join(" \\\\ ")} \\end{bmatrix}`}
                        />
                    )}
                </div>
            </div>
        </>
    )
};

export default MatrixIn