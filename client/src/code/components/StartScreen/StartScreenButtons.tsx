import React from "react";

interface IProps {
  onHostClick: Function;
  onJoinClick: Function;
}

const StartScreenButtons = ({ onHostClick, onJoinClick }: IProps) => {
  return (
    <div className="font-nunito">
      <div className="h-64"></div>
      <div className="h-24"></div>
      <div className="flex justify-center">
        <button
          className="bg-xlry-blue text-white font-extrabold rounded-lg text-4xl w-11/12 py-8"
          onClick={() => onHostClick()}
        >
          HOST
        </button>
      </div>
      <div className="h-12"></div>
      <div className="flex justify-center">
        <button
          className="bg-xlry-blue text-white font-extrabold rounded-lg text-4xl w-11/12 py-8"
          onClick={() => onJoinClick("guest")}
        >
          JOIN
        </button>
      </div>
    </div>
  );
};

export default StartScreenButtons;
