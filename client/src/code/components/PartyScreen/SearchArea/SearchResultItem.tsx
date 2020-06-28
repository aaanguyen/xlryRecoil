import React from "react";
import "../../../../style.css";
import { ISpotifyTrack } from "../../interfaces";

interface IProps {
  searchResult: ISpotifyTrack;
  addTrackToRequests: Function;
  isTrackInRequests: Function;
  participantName: string;
}

const SearchResultItem = ({ searchResult, addTrackToRequests, isTrackInRequests }: IProps) => {
  const handleClick = (result: ISpotifyTrack) => {
    addTrackToRequests(result);
  };
  return (
    // <div className="item search-result-item">
    //   <div className="right floated content">
    //     <button onClick={() => addTrackToRequests(searchResult)} className="ui button primary">
    //       Add To Queue
    //     </button>
    //   </div>
    //   <img alt={searchResult.id} className="ui image" src={searchResult.album.images[0].url} />
    //   <div className="content">
    //     <div className="header">{searchResult.name}</div>
    //     <div>
    //       {searchResult.explicit ? "*E*" : ""} {searchResult.artists[0].name}
    //     </div>
    //   </div>
    // </div>
    <div className="flex h-40 text-white z-10 px-6 py-4">
      <img
        className="flex-none h-32 w-32"
        src={searchResult.album.images.length !== 0 ? searchResult.album.images[0].url : ""}
        alt={searchResult.id}
      />
      <div className="grid grid-rows-2 pl-4">
        <p className="flex-none truncate text-45xl pt-1-2">{searchResult.name}</p>
        <p className="flex-none truncate text-gray-400 text-4xl">{searchResult.artists[0].name}</p>
      </div>
      <div
        onClick={
          () => {
            handleClick(searchResult);
          }
          // addTrackToRequests("ant", searchResult);
        }
        className="ml-auto my-auto"
      >
        <svg
          className={isTrackInRequests(searchResult) ? "hideRequestBtn" : "showRequestBtn"}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 172 172"
        >
          <path d="M86,6.88c-43.62952,0 -79.12,35.49048 -79.12,79.12c0,43.62952 35.49048,79.12 79.12,79.12c43.62952,0 79.12,-35.49048 79.12,-79.12c0,-43.62952 -35.49048,-79.12 -79.12,-79.12zM110.08,89.44h-20.64v20.64c0,1.90232 -1.53768,3.44 -3.44,3.44c-1.90232,0 -3.44,-1.53768 -3.44,-3.44v-20.64h-20.64c-1.90232,0 -3.44,-1.53768 -3.44,-3.44c0,-1.90232 1.53768,-3.44 3.44,-3.44h20.64v-20.64c0,-1.90232 1.53768,-3.44 3.44,-3.44c1.90232,0 3.44,1.53768 3.44,3.44v20.64h20.64c1.90232,0 3.44,1.53768 3.44,3.44c0,1.90232 -1.53768,3.44 -3.44,3.44z"></path>
        </svg>
        <span className={isTrackInRequests(searchResult) ? "showInQueueBadge" : "hideInQueueBadge"}>
          Queued
        </span>
      </div>
    </div>
  );
};

export default SearchResultItem;
