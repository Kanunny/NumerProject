import React, { useState } from 'react';
import Navbar from '../../Navbar';
import { MathJax } from 'better-react-mathjax';
import Cramer from '../Linear/Cramer';
import Guass from '../Linear/Guass';
import Gusassjordan from '../Linear/Gusassjordan';
import MatrixIn from '../Linear/MatrixIn';
import LU from '../Linear/LU';
import Jacobi from '../Linear/Jacobi';

function LinearPage() {
    const [methods] = useState([
        "Cramer",
        "Guass Elimination",
        "Guassjordan Elimination",
        "Matrix inversion",
        "LU decomposition method",
        "Jacobi iteration method",
    ]);
    const [selectedMethod, setSelectedMethod] = useState("");

    const handleMethodChange = (e) => {
        const method = e.target.value;
        setSelectedMethod(method); // ตั้งค่าที่เลือกโดยไม่ต้อง navigate ไปยังหน้าอื่น
    };

    return (
        <>
            <Navbar />
            <h1 className="flex justify-center text-4xl mt-10">Linear Algebra</h1>
            <div className="flex flex-row items-center justify-center">
                <div className="grid grid-flow-col gap-5">
                    <div className="mt-10">
                        <select
                            className="select select-primary w-full max-w-xs"
                            onChange={handleMethodChange}
                            value={selectedMethod}
                        >
                            <option disabled value="">
                                -Select Method-
                            </option>
                            {methods.map((method, index) => (
                                <option key={index} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* แสดงเนื้อหาตามที่เลือก */}
            {selectedMethod && (
                <div className='flex justify-center mt-10'>
                    <MathJax>
                        <div>
                            {selectedMethod === "Cramer" && <Cramer />}
                            {selectedMethod === "Guass Elimination" && <Guass />}
                            {selectedMethod === "Guassjordan Elimination" && <Gusassjordan />}
                            {selectedMethod === "Matrix inversion" && <MatrixIn />}
                            {selectedMethod === "LU decomposition method" && <LU />}
                            {selectedMethod === "Jacobi iteration method" && <Jacobi />}
                        </div>
                    </MathJax>
                </div>
            )}
        </>
    );
}

export default LinearPage;
