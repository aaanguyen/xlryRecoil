import React from "react";
import RequestItem from "./RequestItem";
import { IRequest } from "../interfaces";

// interface IProps {
//   requests: Map<string, IRequest>;
//   upvoteClick: Function;
//   downvoteClick: Function;
//   participantStatus: string;
// }

// const RequestsArea = ({ requests, upvoteClick, downvoteClick, participantStatus }: IProps) => {
//   const renderedList: FC[] = requests.forEach((request: IRequest, trackId: string) => {
//     <RequestItem key={trackId} request={request} upvoteClick={upvoteClick} downvoteClick={downvoteClick} />;
//   });

//   return <React.Fragment>{participantStatus === "present" && renderedList}</React.Fragment>;
// };

interface IProps {
  requestsList: IRequest[];
  handleVote: Function;
  participantName: string;
}

const RequestsArea = ({ requestsList, handleVote, participantName }: IProps) => {
  const renderedList = [...requestsList.values()].map((request: IRequest) => (
    <RequestItem
      key={request.track.id}
      request={request}
      handleVote={handleVote}
      participantName={participantName}
    />
  ));
  return (
    <div id="requests-area" className="bg-black">
      {renderedList}
    </div>
  );
};

export default RequestsArea;
