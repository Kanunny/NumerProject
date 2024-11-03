import React, { useEffect, useState } from "react";
import { det } from "mathjs";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";



function Guass() {
    const [size, setSize] = useState(2) // Initial matrix size
    const [matrixA, setMatrixA] = useState(Array.from({ length: size }, () => Array(size).fill("")))
    const [matrixB, setMatrixB] = useState(Array(size).fill(""))
    const [resultX, setResultX] = useState(Array(size).fill(""))
    const [errorValue, setErrorValue] = useState(0.000001);
    const [solutionSteps, setSolutionSteps] = useState([]) // Store solution steps for InlineMath

    useEffect(() => {
        const newMatrixA = Array.from({ length: size }, () => Array(size).fill(""))
        const newMatrixB = Array(size).fill("")
        const newResultX = Array(size).fill("")

        setMatrixA(newMatrixA)
        setMatrixB(newMatrixB)
        setResultX(newResultX)
        setSolutionSteps([])
    }, [size])

    const calculateGauss = () => {
        let a = matrixA.map((row) => row.map(Number)) // Matrix A
        let b = matrixB.map(Number) // Vector B
        let n = a.length
        let steps = []

        // Augmented Matrix [A|B]
        for (let i = 0; i < n; i++) {
            a[i].push(b[i])
        }

        // Gaussian Elimination process
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(a[k][i]) > Math.abs(a[maxRow][i])) {
                    maxRow = k
                }
            }

            // Swap rows
            if (i !== maxRow) {
                let temp = a[i]
                a[i] = a[maxRow]
                a[maxRow] = temp
            }

            // Normalize row
            let pivot = a[i][i]
            for (let j = i; j <= n; j++) {
                a[i][j] /= pivot
            }

            // Eliminate column below the pivot
            for (let k = i + 1; k < n; k++) {
                let factor = a[k][i]
                for (let j = i; j <= n; j++) {
                    a[k][j] -= factor * a[i][j]
                }
            }

            // Save the current matrix state
            let stepMatrix = a.map((row) => row.join(" & ")).join(" \\\\ ")
            steps.push(`\\begin{bmatrix}${stepMatrix}\\end{bmatrix}`)
        }

        // Back substitution
        let x = Array(n).fill(0)
        for (let i = n - 1; i >= 0; i--) {
            x[i] = a[i][n]
            for (let j = i + 1; j < n; j++) {
                x[i] -= a[i][j] * x[j]
            }
        }

        setResultX(x)
        setSolutionSteps(steps)
    }

    const handleInputChange = (setMatrix, matrix, rowIndex, colIndex, value) => {
        const newMatrix = [...matrix]
        if (colIndex !== null) {
            newMatrix[rowIndex][colIndex] = value
        } else {
            newMatrix[rowIndex] = value
        }
        setMatrix(newMatrix)
    }

    const resetMatrix = () => {
        setMatrixA(Array.from({ length: size }, () => Array(size).fill("")))
        setMatrixB(Array(size).fill(""))
        setResultX(Array(size).fill(""))
        setEpsilon(0.000001)
        setSolutionSteps([])
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="mb-5">Guass Elimination Methods</h1>

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
                    <button className="btn btn-primary ml-4" onClick={calculateGauss}>
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
                <div className='flex items-center justify-center gap-4 mt-4'>
                    {/* Matrix A */}
                    <div className='flex flex-col items-center'>
                        <InlineMath math='[A]' />
                        {matrixA.map((row, rowIndex) => (
                            <div key={rowIndex} className='flex'>
                                {row.map((value, colIndex) => (
                                    <input
                                        key={colIndex}
                                        type='text'
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
                                        className='border rounded w-12 h-12 m-1 text-center'
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Matrix X */}
                    <div className='flex flex-col items-center'>
                        <InlineMath math='{x}' />
                        {resultX.map((value, rowIndex) => (
                            <input
                                key={rowIndex}
                                type='text'
                                readOnly
                                className='border rounded w-12 h-12 m-1 text-center'
                                placeholder={`x${rowIndex + 1}`}
                            />
                        ))}
                    </div>

                    {/* Equals sign */}
                    <div>
                        <InlineMath math='=' />
                    </div>

                    {/* Matrix B */}
                    <div className='flex flex-col items-center'>
                        <InlineMath math='{B}' />
                        {matrixB.map((value, rowIndex) => (
                            <input
                                key={rowIndex}
                                type='text'
                                value={value}
                                onChange={(e) =>
                                    handleInputChange(
                                        setMatrixB,
                                        matrixB,
                                        rowIndex,
                                        null,
                                        e.target.value
                                    )
                                }
                                className='border rounded w-12 h-12 m-1 text-center'
                                placeholder={`b${rowIndex + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Display Solution Steps */}
                <div className='mt-4'>
                    {solutionSteps.map((step, index) => (
                        <div key={index} className='mb-2'>
                            <InlineMath math={step} />
                        </div>
                    ))}
                </div>

                {/* Display X Results */}
                <div className='mt-4 text-center'>
                    {resultX.length > 0 && (
                        <InlineMath
                            math={`x = \\begin{bmatrix} ${resultX.join(" & ")} \\end{bmatrix}`}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default Guass