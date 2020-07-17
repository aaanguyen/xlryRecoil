import React from "react";
import SearchBar from "./SearchArea/SearchBar";
import SearchResultsList from "./SearchArea/SearchResultsList";
import { Worker as SpotifyWorker } from "../../Spotify";
import { ISpotifyTrack } from "../interfaces";

interface IProps {
  accessToken: string;
  addTrackToRequests: Function;
  isTrackInRequests: Function;
  isTrackPlaying: Function;
  participantName: string;
}

interface IState {
  searchResults: ISpotifyTrack[];
  active: boolean;
}

class SearchArea extends React.Component<IProps, IState> {
  state = {
    searchResults: [] as ISpotifyTrack[],
    active: false,
  };

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    // const result = await this.props.onSearchChange("tycho inside out");
    // console.log();
  };

  clearResults = () => {
    this.setState({ searchResults: [] });
  };

  onSearchChange = async (term: string) => {
    const spotifyWorker: SpotifyWorker = new SpotifyWorker();
    const searchResults = await spotifyWorker.getSearchResults(term, this.props.accessToken);
    this.setState({ searchResults });
  };

  maskSearchArea = () => {
    this.setState({ active: true });
  };

  unmaskSearchArea = () => {
    this.setState({ active: false });
  };

  render() {
    return (
      <div
        id="search-area"
        className={`bg-black bg-opacity-${
          this.state.active && this.state.searchResults.length ? "75" : "0"
        } absolute w-full z-50`}
      >
        <div className="flex">
          <SearchBar
            onSearchChange={this.onSearchChange}
            clearResults={this.clearResults}
            maskSearchArea={this.maskSearchArea}
            unmaskSearchArea={this.unmaskSearchArea}
          />
          <svg
            className="flex-none absolute right-0 fill-current text-white w-32 h-24 opacity-50 mt-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-200 -190 1000 1000"
          >
            <path d="M320 0c43.075 0 78.013 34.937 78.013 78.013 0 43.075-34.938 78-78.013 78s-78.013-34.925-78.013-78C241.987 34.937 276.925 0 320 0zm0 483.986c43.075 0 78.013 34.937 78.013 78.013 0 43.075-34.938 78-78.013 78s-78.013-34.925-78.013-78c0-43.076 34.938-78.013 78.013-78.013zm0-241.987c43.075 0 78.013 34.937 78.013 78.001 0 43.075-34.938 78.013-78.013 78.013S241.987 363.075 241.987 320c0-43.063 34.938-78.001 78.013-78.001z" />
          </svg>
        </div>
        {this.state.searchResults && (
          <SearchResultsList
            searchResults={this.state.searchResults}
            addTrackToRequests={this.props.addTrackToRequests}
            isTrackInRequests={this.props.isTrackInRequests}
            isTrackPlaying={this.props.isTrackPlaying}
            participantName={this.props.participantName}
          />
        )}
      </div>
    );
  }
}

export default SearchArea;
