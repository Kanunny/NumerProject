import React, { useState } from 'react';
import Navbar from '../../Navbar';
import { MathJax } from 'better-react-mathjax';
import SimRegress from '../Extrapolation/SimRegress';

function ExtrapolationPage() {
    const [methods] = useState([
        "Simple Regression extrapolation",
    ]);
    const [selectedMethod, setSelectedMethod] = useState("");

    const handleMethodChange = (e) => {
        const method = e.target.value;
        setSelectedMethod(method); // ตั้งค่าที่เลือกโดยไม่ต้อง navigate ไปยังหน้าอื่น
    };

    return (
        <>
            <Navbar />
            <h1 className="flex justify-center text-4xl mt-10">Extrapolation</h1>
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
                            {selectedMethod === "Simple Regression extrapolation" && <SimRegress />}
                        </div>
                    </MathJax>
                </div>
            )}
        </>
    );
}

export default ExtrapolationPage;
