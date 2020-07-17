import React from "react";
import "../../../style.css";
import { IRequest } from "../interfaces";

interface IProps {
  request: IRequest | null;
}

const CurrentlyPlayingTrack = ({ request }: IProps) => {
  if (!request) {
    return <div></div>;
  }
  return (
    <div className="w-full">
      <img
        className="w-full opacity-95"
        src={`https://i.scdn.co/image/${request.track.imageId}`}
        alt={request.track.id}
      />
      <div className="content">
        <div className="w-full absolute bottom-0 grid grid-rows-12 h-64 text-center mb-4 font-nunito font-bold">
          <div className="truncate text-6xl text-white row-start-1 row-end-6 font-bold mx-10 mt-4">
            {request.track.name}
          </div>
          <div className="text-5xl text-white row-start-6 row-end-8 leading-9 truncate">
            {request.track.artist}
          </div>
          <div className="text-4xl text-white row-start-8 row-end-10">
            <div className="grid grid-cols-6">
              <div className="col-start-1 col-end-3 grid grid-rows-1">
                <div className="row-span-1">Requested by:</div>
              </div>
            </div>
          </div>
          <div className="text-4xl text-white row-start-10 row-end-12">
            <div className="grid grid-cols-6">
              <div className="col-start-1 col-end-3 grid grid-rows-2">
                <div className="row-span-2 leading-10">{request.requestedBy}</div>
              </div>
              <div className="col-start-5 col-end-7 text-4.5xl leading-5">
                {request.upvotedBy.length} {request.upvotedBy.length === 1 ? `vote` : `votes`}
              </div>
            </div>
          </div>
        </div>
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
