import React, { FC } from "react";
import SearchResultItem from "./SearchResultItem";
import { ISpotifyTrack } from "../../interfaces";

interface IProps {
  searchResults: ISpotifyTrack[];
  addTrackToRequests: Function;
  isTrackInRequests: Function;
  isTrackPlaying: Function;
  participantName: string;
}

const SearchResultList = ({
  searchResults,
  addTrackToRequests,
  isTrackInRequests,
  isTrackPlaying,
  participantName,
}: IProps) => {
  const renderedList = searchResults.map((searchResult: ISpotifyTrack) => (
    <SearchResultItem
      key={searchResult.id}
      searchResult={searchResult}
      addTrackToRequests={addTrackToRequests}
      isTrackInRequests={isTrackInRequests}
      isTrackPlaying={isTrackPlaying}
      participantName={participantName}
    />
  ));
  return <div className="mt-4">{renderedList}</div>;
};

export default SearchResultList;
