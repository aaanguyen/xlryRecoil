import React from "react";

type IProps = {
  partyName: string;
};

const HostInstructions = ({ partyName }: IProps) => {
  return (
    <div className="text-white text-5xl pt-56 mx-10 font-nunito font-semibold leading-snug">
      <p></p>
      <p className="mt-5"></p>
      <p className="mt-5"></p>
      <p className="mt-5"></p>
      <p className="mt-5"></p>
    </div>
  );
};

export default HostInstructions;
