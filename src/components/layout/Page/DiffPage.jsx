import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar';
import { evaluate } from 'mathjs';
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import axios from 'axios';

function DiffPage() {

    const fetchRandomEquation = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/diff'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
            if (response.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.length);
                const randomEquation = response.data[randomIndex];
                setEquation(randomEquation.equation);
                setX(randomEquation.x); // ตั้งค่าค่า xl จากโจทย์
                setH(randomEquation.h); // ตั้งค่าค่า xr จากโจทย์
            }
        } catch (error) {
            console.error("Error fetching random equation", error);
        }
    };

    const [Equation, setEquation] = useState("");
    const [x, setX] = useState("");
    const [h, setH] = useState("");
    const [result, setResult] = useState("");

    const [order] = useState(["First", "Second", "Third", "Fourth"]);
    const [selectedOrder, setSelectedOrder] = useState("");
    const [error] = useState(["O(h)", "O(h^2)", "O(h^4)"]);
    const [selectedError, setSelectedError] = useState("");
    const [direction] = useState(["Forward", "Backward", "Centered"]);
    const [selectedDirection, setSelectedDirection] = useState("");

    const inputEquation = (e) => setEquation(e.target.value);

    const handleOrderChange = (e) => setSelectedOrder(e.target.value);
    const handleErrorChange = (e) => setSelectedError(e.target.value);
    const handleDirectionChange = (e) => setSelectedDirection(e.target.value);

    const calculateDiff = () => {
        const f = (xVal) => {
            try {
                return evaluate(Equation, { x: xVal });
            } catch (error) {
                alert("Invalid equation");
                return null;
            }
        };

        const xNum = parseFloat(x);
        const hNum = parseFloat(h);
        if (isNaN(xNum) || isNaN(hNum)) {
            alert("Please enter valid numbers for x and h");
            return;
        }

        let ans;
        if (selectedOrder === "First") {
            if (selectedError === "O(h)") {
                if (selectedDirection === "Backward") {
                    ans = (f(xNum) - f(xNum - hNum)) / hNum;
                } else if (selectedDirection === "Forward") {
                    ans = (f(xNum + hNum) - f(xNum)) / hNum;
                } else if (selectedDirection === "Centered") {
                    ans = (f(xNum + hNum) - f(xNum - hNum)) / (2 * hNum);
                }
            } else if (selectedError === "O(h^2)") {
                if (selectedDirection === "Backward") {
                    ans = (3 * f(xNum) - 4 * f(xNum - hNum) + f(xNum - 2 * hNum)) / (2 * hNum);
                } else if (selectedDirection === "Forward") {
                    ans = (-f(xNum + 2 * hNum) + 4 * f(xNum + hNum) - 3 * f(xNum)) / (2 * hNum);
                } else if (selectedDirection === "Centered") {
                    ans = (-f(xNum + 2 * hNum) + 8 * f(xNum + hNum) - 8 * f(xNum - hNum) + f(xNum - 2 * hNum)) / (12 * hNum);
                }
            }
        } else if (selectedOrder === "Second") {
            if (selectedError === "O(h)") {
                if (selectedDirection === "Backward") {
                    ans = (f(xNum) - 2 * f(xNum - hNum) + f(xNum - 2 * hNum)) / Math.pow(hNum, 2);
                } else if (selectedDirection === "Forward") {
                    ans = (f(xNum + 2 * hNum) - 2 * f(xNum + hNum) + f(xNum)) / Math.pow(hNum, 2);
                } else if (selectedDirection === "Centered") {
                    ans = (f(xNum + hNum) - 2 * f(xNum) + f(xNum - hNum)) / Math.pow(hNum, 2);
                }
            }
        }
        setResult(ans);
        console.log(ans);
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <Navbar />
            <h1 className='text-4xl mt-10 mb-5'>Numerical Differentiation</h1>

            <InlineMath>{`\\frac{dy}{dx} = ${Equation ? Equation : "f(x)"} \\, dx`}</InlineMath>

            <div className='flex mt-10 gap-4'>
                <div>
                    <p>Order</p>
                    <select onChange={handleOrderChange} value={selectedOrder} className="select select-bordered w-[150px] max-w-xs">
                        <option disabled value="">-</option>
                        {order.map((ord, idx) => (
                            <option key={idx} value={ord}>{ord}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p>Error</p>
                    <select onChange={handleErrorChange} value={selectedError} className="select select-bordered w-[150px] max-w-xs">
                        <option disabled value="">-</option>
                        {error.map((err, idx) => (
                            <option key={idx} value={err}>{err}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p>Direction</p>
                    <select onChange={handleDirectionChange} value={selectedDirection} className="select select-bordered w-[150px] max-w-xs">
                        <option disabled value="">-</option>
                        {direction.map((dir, idx) => (
                            <option key={idx} value={dir}>{dir}</option>
                        ))}
                    </select>
                </div>
            </div>

            <input type="text" value={Equation} onChange={inputEquation} placeholder="Enter equation" className="input input-bordered input-primary w-full max-w-xs mt-4" />

            <div className='flex gap-5 mt-4'>
                <input type="number" value={x} onChange={(e) => setX(e.target.value)} placeholder="Enter x" className="input input-bordered input-primary w-[100px]" />
                <input type="number" value={h} onChange={(e) => setH(e.target.value)} placeholder="Enter h" className="input input-bordered input-primary w-[100px]" />
            </div>

            <div className="flex gap-6 justify-center">
                <button className="btn btn-primary mt-5" onClick={calculateDiff}>Calculate</button>
                <button className="btn btn-primary mt-5" onClick={fetchRandomEquation}>Random</button>
            </div>

            {result !== "" && <div className="mt-10"><h2>Result: {result}</h2></div>}
        </div>
    );
}

export default DiffPage;
