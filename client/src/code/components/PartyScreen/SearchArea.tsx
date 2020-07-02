import React from "react";
import SearchBar from "./SearchArea/SearchBar";
import SearchResultsList from "./SearchArea/SearchResultsList";
import { Worker as SpotifyWorker } from "../../Spotify";
import { ISpotifyTrack } from "../interfaces";

interface IProps {
  accessToken: string;
  addTrackToRequests: Function;
  isTrackInRequests: Function;
  participantName: string;
}

interface IState {
  searchResults: ISpotifyTrack[];
}

class SearchArea extends React.Component<IProps, IState> {
  state = {
    searchResults: [] as ISpotifyTrack[],
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

  render() {
    return (
      <div id="search-area" className="bg-black">
        <SearchBar onSearchChange={this.onSearchChange} clearResults={this.clearResults} />
        {this.state.searchResults && (
          <SearchResultsList
            searchResults={this.state.searchResults}
            addTrackToRequests={this.props.addTrackToRequests}
            isTrackInRequests={this.props.isTrackInRequests}
            participantName={this.props.participantName}
          />
        )}
      </div>
    );
  }
}

export default SearchArea;
