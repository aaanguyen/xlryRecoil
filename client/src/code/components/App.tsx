import React, { Component } from "react";
import crypto from "crypto";

import { createState } from "../state";
import "../../style.css";
import SearchArea from "./PartyScreen/SearchArea";
import RequestsArea from "./PartyScreen/RequestsArea";
import StartScreenHeader from "./StartScreen/StartScreenHeader";
import StartScreenButtons from "./StartScreen/StartScreenButtons";
import Form from "./StartScreen/Form";

class App extends Component {
  state = createState(this);

  clientId: string = "7ed542734e124c7486ef5c71d464a905";
  redirectUri: string = "http%3A%2F%2F192%2E168%2E0%2E16%3A8080%2F";

  getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  // onSearchChange = async term => {
  //   const response = await spotifySearch.get("/search", {
  //     headers: {
  //       Authorization: `Bearer ${this.state.accessToken}`,
  //     },
  //     params: { q: term, type: "track" },
  //   });

  //   this.setState({ searchResults: response.data.tracks.items });
  // };

  // clearOnEmptyBar = () => {
  //   this.setState({ searchResults: [] });
  // };

  // componentDidMount = async () => {
  //   const params = new URLSearchParams();
  //   params.append("grant_type", "client_credentials");
  //   const response = await spotifyAuthClientCredentials.post("/token", params);
  //   this.setState({ accessToken: response.data.access_token });
  // };

  componentDidMount = async () => {
    window.addEventListener("focus", () => {
      console.log(`yoooooo just focused`);
      this.state.reconnect();
    });
    if (!window.localStorage.getItem("pid")) {
      window.localStorage.setItem("pid", new Date().getTime().toString());
    }
    this.setState({ pid: window.localStorage.getItem("pid") });
    console.log(window.localStorage.getItem("pid"));
  };

  render() {
    return (
      <div className="bg-black h-screen">
        {!this.state.partyScreenVisible && <StartScreenHeader />}
        {!this.state.signUpScreenVisible && !this.state.partyScreenVisible && (
          <StartScreenButtons
            onHostClick={() => {
              const codeVerifier: string = crypto.randomBytes(this.getRandomInt(22, 64)).toString("hex");
              const codeVerifierCopy: string = codeVerifier.slice(0);
              const codeChallenge: string = crypto
                .createHash("sha256")
                .update(codeVerifier)
                .digest("base64");
              window.location.replace(
                `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user-read-currently-playing%20user-modify-playback-state&state=${codeVerifierCopy}&code_challenge=${codeChallenge}&code_challenge_method=S256`
              );
            }}
            onJoinClick={this.state.showSignUpScreen}
          />
        )}
        {this.state.signUpScreenVisible && (
          <Form
            role={this.state.role}
            pid={this.state.pid}
            createParty={this.state.createParty}
            joinParty={this.state.joinParty}
            fromServerPartyErrorMessage={this.state.fromServerPartyErrorMessage}
            fromServerScreennameErrorMessage={this.state.fromServerScreennameErrorMessage}
          />
        )}
        {this.state.partyScreenVisible && (
          <SearchArea
            onSearchChange={this.state.onSearchChange}
            addTrackToRequests={this.state.addTrackToRequests}
            isTrackInRequests={this.state.isTrackInRequests}
            participantName={this.state.participantName}
          />
        )}
        {this.state.partyScreenVisible && (
          <RequestsArea
            requestsList={this.state.requests}
            handleVote={this.state.handleVote}
            participantName={this.state.participantName}
          />
        )}
        {/* <div className="options-area two wide row">
              <OptionsArea state={this.state} />
            </div> */}
      </div>
    );
  }
}

export default App;
