import React, { useState } from "react";
import "../../../style.css";
import { IRequest } from "../interfaces";

interface IProps {
  request: IRequest | null;
}

const CurrentlyPlayingTrack = ({ request }: IProps) => {
  const [votesDisplay, setVotesDisplay] = useState(false);
  if (!request) {
    return <div></div>;
  }
  return (
    <div className="w-full bg-black">
      <img
        className="w-full"
        src={`https://i.scdn.co/image/${request.track.imageId}`}
        alt={request.track.id}
      />
      <div className="content">
        <div
          className="w-full absolute bottom-0 grid grid-rows-12 h-64 text-center mb-8"
          onClick={() => setVotesDisplay(!votesDisplay)}
        >
          <div className="truncate text-6xl text-white row-start-2 row-end-6 font-bold mx-12 font-nunito font-bold">
            {request.track.name}
          </div>
          <div className="text-5xl text-white row-start-6 row-end-9 leading-10 truncate font-nunito font-bold">
            {request.track.artist}
          </div>
          <div className="text-4xl text-white row-start-9 row-end-11 font-mulish font-semibold">
            <div className="grid grid-cols-6">
              <div className="col-start-1 col-end-3 grid grid-rows-1">
                <div className="row-span-1">Requested by:</div>
              </div>
            </div>
          </div>
          <div className="text-4xl text-white row-start-11 row-end-13 font-mulish font-semibold">
            <div className="grid grid-cols-6">
              <div className="col-start-1 col-end-3 grid grid-rows-2">
                <div className="row-span-2 leading-10">{request.requestedBy}</div>
              </div>
              <div className="col-start-5 col-end-7 text-4.5xl leading-3">
                {request.upvotedBy.length} {request.upvotedBy.length === 1 ? `vote` : `votes`}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`text-4xl font-semibold font-mulish text-white mx-10 text-center accordion -mt-3 ${
          votesDisplay ? `expanded mb-4` : ``
        }`}
        onClick={() => setVotesDisplay(!votesDisplay)}
      >
        Upvoted by: {request.upvotedBy.join(", ")}
      </div>
    </div>
    // <div className="flex h-40 text-white font-medium px-6 py-4">
    //   <img
    //     className="flex-none h-32 w-32"
    //     src={`https://i.scdn.co/image/${request.track.imageId}`}
    //     alt={request.track.id}
    //   />
    //   <div className="grid grid-rows-2 pl-4">
    //     <p className="flex-none truncate text-45xl text-xlry-blue pt-1-2">{request.track.name}</p>
    //     <p className="flex-none truncate text-gray-400 text-4xl">
    //       {`${request.track.artist} · ${request.requestedBy}`}
    //     </p>
    //   </div>
    // </div>
  );
};

export default CurrentlyPlayingTrack;
