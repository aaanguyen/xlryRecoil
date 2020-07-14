import React from "react";

type IProps = {
  partyName: string;
};

const HostInstructions = ({ partyName }: IProps) => {
  return (
    <div className="text-white text-5xl pt-56 mx-10 font-nunito font-semibold leading-snug">
      <p>Welcome to the XLRY alpha!</p>
      <p className="mt-5">
        1) Before you begin, make sure your Spotify device is active by playing any song from it.
      </p>
      <p className="mt-5">
        2) Then come back here and search for some songs to kick off your party! The first song requested will
        play immediately.
      </p>
      <p className="mt-5">
        3) Invite everyone to visit xlry.live and join your party using the code
        <span className="font-bold text-xlry-blue"> {partyName}</span>!
      </p>
    </div>
  );
};

export default HostInstructions;
