import React from "react";
import "../../../style.css";
import { IRequest } from "../interfaces";

interface IProps {
  request: IRequest;
  handleVote: Function;
  participantName: string;
}

const RequestItem = ({ request, handleVote, participantName }: IProps) => {
  return (
    <div className="flex h-40 text-white px-6 py-4">
      <img
        className="flex-none h-32 w-32"
        src={`https://i.scdn.co/image/${request.track.imageId}`}
        alt={request.track.id}
      />
      <div className="grid grid-rows-2 pl-4">
        <p className="flex-none truncate text-45xl pt-1-2">{request.track.name}</p>
        <p className="flex-none truncate text-gray-400 text-4xl">
          {`${request.track.artist} · ${request.requestedBy}`}
        </p>
      </div>
      <div className="flex ml-auto text-white text-6xl">
        <div
          className="my-auto"
          onClick={() => {
            handleVote(request.track.id, participantName, "up");
          }}
        >
          <svg
            className={request.upvotedBy.includes(participantName) ? "arrowBlue" : "arrowGray"}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 172 172"
          >
            <path d="M33.07692,74.75901c18.52824,-27.77944 47.6256,-52.92308 48.94351,-53.59495c0.67187,-0.64603 2.66165,-1.31791 3.97956,-1.31791c1.31791,0 3.30769,0.67188 4.6256,1.31791c1.31791,0.67187 30.4411,26.46154 48.96935,53.59495c1.3179,1.98979 1.3179,4.6256 0.64603,7.26142c-1.31791,1.98978 -3.30769,3.97956 -5.94351,3.97956h-24.47175c0,0 -3.30769,57.54868 -5.29748,60.21034c-3.30769,3.30769 -11.24098,5.94351 -18.52824,5.94351c-7.28726,0 -14.54868,-2.63581 -17.21033,-5.94351c-1.31791,-2.66166 -5.94351,-60.21034 -5.94351,-60.21034h-24.47176c-2.66165,0 -4.6256,-1.31791 -5.96935,-3.97956c-1.31791,-1.96394 -0.64604,-4.6256 0.67187,-7.26142z"></path>{" "}
          </svg>
        </div>
        <div className="my-auto">{request.rank}</div>
        <div
          className="my-auto"
          onClick={() => {
            handleVote(request.track.id, participantName, "down");
          }}
        >
          <svg
            className={request.downvotedBy.includes(participantName) ? "arrowBlue" : "arrowGray"}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 172 172"
          >
            <path d="M138.92308,97.24099c-18.52824,27.77945 -47.6256,52.92308 -48.94351,53.59495c-0.67188,0.64604 -2.66166,1.31791 -3.97957,1.31791c-1.31791,0 -3.30769,-0.67187 -4.6256,-1.31791c-1.3179,-0.67187 -30.4411,-26.46154 -48.96935,-53.59495c-1.31791,-1.98978 -1.31791,-4.6256 -0.64604,-7.26142c1.98979,-2.66166 3.95373,-3.97957 6.61538,-3.97957h24.47176c0,0 3.30769,-57.54868 5.29747,-60.21033c2.63582,-3.30769 10.56912,-5.94351 17.85637,-5.94351c7.28726,0 14.54868,2.63582 17.21034,5.94351c1.96394,2.66165 5.94351,60.21033 5.94351,60.21033h24.47176c2.66166,0 4.6256,1.31791 5.96935,3.97957c1.3179,1.96394 0.64603,4.6256 -0.67188,7.26142z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RequestItem;
