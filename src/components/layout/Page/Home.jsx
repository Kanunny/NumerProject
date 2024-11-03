import React from "react";
import Navbar from "../../Navbar";


function Home() {

  return (
    <>
      <Navbar />
      <h1 className="flex justify-center text-4xl mt-10">Welcome to My Project Numer</h1>

      <div className="flex flex-col justify-center items-center">
        <h1 className="flex justify-center text-4xl mt-10">Problem solving</h1>
      </div>
    </>
  );
}

export default Home;
