import React, { FC } from "react";
import SearchResultItem from "./SearchResultItem";
import { ISpotifyTrack } from "../../interfaces";

interface IProps {
  searchResults: ISpotifyTrack[];
  addTrackToRequests: Function;
  isTrackInRequests: Function;
  participantName: string;
}

const SearchResultList = ({
  searchResults,
  addTrackToRequests,
  isTrackInRequests,
  participantName,
}: IProps) => {
  const renderedList = searchResults.map((searchResult: ISpotifyTrack) => (
    <SearchResultItem
      key={searchResult.id}
      searchResult={searchResult}
      addTrackToRequests={addTrackToRequests}
      isTrackInRequests={isTrackInRequests}
      participantName={participantName}
    />
  ));
  return <div>{renderedList}</div>;
};

export default SearchResultList;
