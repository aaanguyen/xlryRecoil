import React from "react";

const StartScreenHeader = () => {
  return (
    <div>
      <div className="h-64"></div>
      <div className="h-64"></div>
      <div className="h-24"></div>
      <div className="flex content-center justify-center">
        <img className="w-40 h-40" src={require("../../../images/xlrylogo.png")} alt="XLRY" />
        <p className="text-9xl ml-4 font-medium text-white font-bold">XLRY</p>
      </div>
      <div className="h-8"></div>
      <p className="text-white text-3xl text-center">No more auxiliary cord disputes.</p>
    </div>
  );
};

export default StartScreenHeader;
