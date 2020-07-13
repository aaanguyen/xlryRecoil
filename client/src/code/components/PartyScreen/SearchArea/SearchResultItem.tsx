import React from "react";
import "../../../../style.css";
import { ISpotifyTrack } from "../../interfaces";

interface IProps {
  searchResult: ISpotifyTrack;
  addTrackToRequests: Function;
  isTrackInRequests: Function;
  isTrackPlaying: Function;
  participantName: string;
}

const SearchResultItem = ({
  searchResult,
  addTrackToRequests,
  isTrackInRequests,
  isTrackPlaying,
}: IProps) => {
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
    <div className="flex h-40 text-white z-10 px-6 py-4 font-nunito">
      <img
        className="flex-none h-32 w-32"
        src={searchResult.album.images.length !== 0 ? searchResult.album.images[0].url : ""}
        alt={searchResult.id}
      />
      <div className="grid grid-rows-2 pl-4">
        <p className="row-span-1 truncate text-4.5xl pt-1-2">{searchResult.name}</p>
        <div className="row-span-2">
          {searchResult.explicit && (
            <span className="vertical-12 bg-gray-400 rounded-md px-1 text-2xl font-extrabold text-black">
              E
            </span>
          )}
          <span className="truncate text-gray-400 text-4xl">
            {searchResult.explicit ? " " : ""}
            {searchResult.artists[0].name}
          </span>
        </div>
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
        {!isTrackInRequests(searchResult) ? (
          isTrackPlaying(searchResult) ? (
            <span className="flex-none bg-xlry-blue rounded-lg px-4 py-4 text-3xl font-semibold">
              Playing
            </span>
          ) : (
            <svg
              className="flex-none fill-current text-xlry-blue w-28 h-28 pr-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 172 172"
            >
              <path d="M86,6.88c-43.62952,0 -79.12,35.49048 -79.12,79.12c0,43.62952 35.49048,79.12 79.12,79.12c43.62952,0 79.12,-35.49048 79.12,-79.12c0,-43.62952 -35.49048,-79.12 -79.12,-79.12zM110.08,89.44h-20.64v20.64c0,1.90232 -1.53768,3.44 -3.44,3.44c-1.90232,0 -3.44,-1.53768 -3.44,-3.44v-20.64h-20.64c-1.90232,0 -3.44,-1.53768 -3.44,-3.44c0,-1.90232 1.53768,-3.44 3.44,-3.44h20.64v-20.64c0,-1.90232 1.53768,-3.44 3.44,-3.44c1.90232,0 3.44,1.53768 3.44,3.44v20.64h20.64c1.90232,0 3.44,1.53768 3.44,3.44c0,1.90232 -1.53768,3.44 -3.44,3.44z"></path>
            </svg>
          )
        ) : (
          <span className="flex-none bg-xlry-blue rounded-lg px-4 py-4 text-3xl font-semibold">Queued</span>
        )}
      </div>
    </div>
  );
};

export default SearchResultItem;
