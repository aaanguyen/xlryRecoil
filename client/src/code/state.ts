import React from "react";
import { createSocketComm } from "./socketComm";
import { Worker as SpotifyWorker } from "./Spotify";
import { ITrack, ISpotifyTrack, IRequest } from "../code/components/interfaces";

export function createState(inParentComponent: React.Component) {
  // const spotifyWorker: SpotifyWorker = new SpotifyWorker();
  return {
    partyName: "" as string,
    participantName: "" as string,
    pid: "" as string,
    requests: [] as IRequest[],
    status: "waitingToJoin" as string,
    role: "" as string,
    socketComm: createSocketComm(inParentComponent) as Function,
    accessToken: "" as string,
    searchField: "" as string,
    searchResults: [] as ISpotifyTrack[],
    signUpScreenVisible: false as boolean,
    partyScreenVisible: false as boolean,
    fromServerPartyErrorMessage: "" as string,
    fromServerScreennameErrorMessage: "" as string,
    currentlyPlayingTrack: null as IRequest | null,

    handleMessage_create: function(
      partyName: string,
      participantName: string,
      subMsg: string,
      accessToken: string
    ) {
      switch (subMsg) {
        case "partyNameTaken": {
          this.setState({
            fromServerPartyErrorMessage: "That name is already taken.",
          });
          break;
        }
        case "success": {
          this.setState({
            partyName,
            participantName,
            accessToken,
            status: "joined",
            role: "host",
            requests: [] as IRequest[],
            signUpScreenVisible: false,
            partyScreenVisible: true,
          });
          break;
        }
      }
    }.bind(inParentComponent),

    handleMessage_join: function(
      partyName: string,
      participantName: string,
      subMsg: string,
      accessToken: string | undefined,
      stringifiedRequests: string,
      stringifiedCurrentlyPlayingTrack: string
    ) {
      switch (subMsg) {
        case "taken": {
          this.setState({
            fromServerScreennameErrorMessage: "That name is already taken.",
          });
          break;
        }
        case "invalidParty": {
          this.setState({
            fromServerPartyErrorMessage: `Invalid party.`,
          });
          break;
        }
        case "alreadyPresent": {
          this.setState({
            fromServerScreennameErrorMessage: `You're already in this party! Join as ${participantName}.`,
          });
          break;
        }
        case "success": {
          const inRequests: IRequest[] = JSON.parse(stringifiedRequests.replace(/--dot--/g, "."));
          inRequests.sort((x: IRequest, y: IRequest) => {
            return y.rank - x.rank;
          });
          this.setState({
            partyName,
            participantName,
            status: "joined",
            role: "guest",
            accessToken,
            requests: inRequests,
            signUpScreenVisible: false,
            partyScreenVisible: true,
            currentlyPlayingTrack: JSON.parse(stringifiedCurrentlyPlayingTrack.replace(/--dot--/g, ".")),
          });
          break;
        }
      }
    }.bind(inParentComponent),

    handleMessage_request: function(subMsg: string, trackId: string | undefined) {
      if (subMsg === "partyError" && trackId) {
      }
      // this.setState({});
    }.bind(inParentComponent),

    // handleMessage_upvote: function(subMsg: string, trackId: string | undefined) {
    //   if (subMsg === "requestError" && trackId) {
    //   }
    //   if (subMsg === "partyError") {
    //   }
    //   this.setState({});
    // }.bind(inParentComponent),

    // handleMessage_downvote: function(subMsg: string, trackId: string | undefined) {
    //   if (subMsg === "requestError" && trackId) {
    //   }
    //   if (subMsg === "partyError") {
    //   }
    //   this.setState({});
    // }.bind(inParentComponent),

    handleMessage_update: function(stringifiedRequests: string, stringifiedCurrentlyPlayingTrack: string) {
      const inRequests: IRequest[] = JSON.parse(stringifiedRequests.replace(/--dot--/g, "."));
      inRequests.sort((x: IRequest, y: IRequest) => {
        return y.rank - x.rank;
      });
      this.setState({
        requests: inRequests,
        currentlyPlayingTrack: JSON.parse(stringifiedCurrentlyPlayingTrack.replace(/--dot--/g, ".")),
      });
      // switch (subMsg) {
      //   case "requested": {
      //     // const spotifyWorker: SpotifyWorker = new SpotifyWorker();
      //     // const trackData: ITrack = await spotifyWorker.getTrackData(requestedTrackId);
      //     // const updatedRequests: Map<string, IRequest> = new Map() as Map<string, IRequest>;
      //     // this.state.requests.forEach((request: IRequest, trackId: string) => {
      //     //   updatedRequests.set(trackId, this.state.cloneExactRequest(request));
      //     // });
      //     // updatedRequests.set(requestedTrackId, this.newRequest(updatingParticipant, requestedTrackId));
      //     // this.setState({ requests: updatedRequests });
      //     break;
      //   }
      //   case "upvoted": {
      //     // const updatedRequests: Map<string, IRequest> = new Map() as Map<string, IRequest>;
      //     // this.state.requests.forEach((request: IRequest, trackId: string) => {
      //     //   if (trackId !== requestedTrackId) {
      //     //     updatedRequests.set(trackId, this.state.cloneExactRequest(request));
      //     //   } else {
      //     //     updatedRequests.set(trackId, this.state.updateVotedRequest(request, updatingParticipant, "up"));
      //     //   }
      //     // });
      //     // this.setState({ requests: updatingParticipant });
      //     break;
      //   }
      //   case "downvoted": {
      //     // const updatedRequests: Map<string, IRequest> = new Map() as Map<string, IRequest>;
      //     // this.state.requests.forEach((request: IRequest, trackId: string) => {
      //     //   if (trackId !== requestedTrackId) {
      //     //     updatedRequests.set(trackId, this.state.cloneExactRequest(request));
      //     //   } else {
      //     //     updatedRequests.set(
      //     //       trackId,
      //     //       this.state.updateVotedRequest(request, updatingParticipant, "down")
      //     //     );
      //     //   }
      //     // });
      //     // this.setState({ requests: updatingParticipant });
      //     break;
      //   }
      // }
    }.bind(inParentComponent),

    handleMessage_newToken: function(newToken: string) {
      this.setState({ accessToken: newToken });
    }.bind(inParentComponent),

    cloneExactRequest: function(request: IRequest): IRequest {
      const { rank, requestedBy, upvotedBy, downvotedBy, track } = request;
      const clonedRequest: IRequest = {
        rank: rank,
        requestedBy: requestedBy,
        upvotedBy: [] as string[],
        downvotedBy: [] as string[],
        track: { ...track },
      };
      return clonedRequest;
    }.bind(inParentComponent),

    newRequest: function(requester: string, track: ISpotifyTrack): IRequest {
      return {
        rank: 1,
        requestedBy: requester,
        upvotedBy: [requester] as string[],
        downvotedBy: [] as string[],
        track: {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          imageId: track.album.images[0].url.slice(track.album.images[0].url.lastIndexOf("/") + 1),
          explicit: track.explicit,
          durationInMs: track.duration_ms,
        },
      };
    }.bind(inParentComponent),

    cloneUpdatedRequest: function(request: IRequest, voter: string, choice: string): IRequest {
      const { rank, requestedBy, upvotedBy, downvotedBy, track } = request;
      let change: number = 0;
      const updatedUpvotedBy: string[] = [...upvotedBy];
      const updatedDownvotedBy: string[] = [...downvotedBy];
      if (choice === "up") {
        change = 1;
        updatedUpvotedBy.push(voter);
      } else if (choice === "down") {
        change = -1;
        updatedDownvotedBy.push(voter);
      } else {
        console.log(`ERROR: cloneUpdatedRequest. Something went wrong with vote`);
      }
      const clonedRequest: IRequest = {
        rank: rank + change,
        requestedBy: requestedBy,
        upvotedBy: updatedUpvotedBy,
        downvotedBy: updatedDownvotedBy,
        track: { ...track },
      };
      return clonedRequest;
    }.bind(inParentComponent),

    addTrackToRequests: function(spotifyTrack: ISpotifyTrack) {
      const track: ITrack = this.state.strippedTrack(spotifyTrack);
      if (this.state.currentlyPlayingTrack && track.id === this.state.currentlyPlayingTrack.track.id) {
        return;
      }
      if (this.state.requests.filter((request: IRequest) => request.track.id === track.id).length > 0) {
        return;
      }
      this.state.socketComm.send(
        `request.${this.state.partyName}.${this.state.participantName}.${JSON.stringify(track)}`
      );
    }.bind(inParentComponent),

    // onSearchChange: async function(term: string) {
    //   const spotifyWorker: SpotifyWorker = new SpotifyWorker();
    //   const searchResults = await spotifyWorker.getSearchResults(term, this.state.accessToken);
    //   this.setState({ searchResults });
    // }.bind(inParentComponent),

    handleVote: function(trackId: string, voter: string, choice: string) {
      if (choice === "up") {
        this.state.socketComm.send(`upvote.${this.state.partyName}.${voter}.${trackId}`);
      } else if (choice === "down") {
        this.state.socketComm.send(`downvote.${this.state.partyName}.${voter}.${trackId}`);
      }
      // let updatedRequests: IRequest[] = this.state.requests;
      // if (request.upvotedBy.includes(voter)) {
      //   updatedRequests.forEach((itRequest: IRequest) => {
      //     if (itRequest.track.id === request.track.id) {
      //       itRequest.upvotedBy = itRequest.upvotedBy.filter((name: string) => name !== voter);
      //       itRequest.rank--;
      //     }
      //   });
      // } else if (request.downvotedBy.includes(voter)) {
      //   updatedRequests.forEach((itRequest: IRequest) => {
      //     if (itRequest.track.id === request.track.id) {
      //       itRequest.downvotedBy = itRequest.downvotedBy.filter((name: string) => name !== voter);
      //       itRequest.rank++;
      //     }
      //   });
      // } else {
      //   const updatedRequest: IRequest = this.state.cloneUpdatedRequest(request, voter, choice);
      //   updatedRequests = this.state.requests.filter(
      //     (itRequest: IRequest) => itRequest.track.id !== request.track.id
      //   );
      //   updatedRequests.push(updatedRequest);
      // }
      // updatedRequests.sort((x: IRequest, y: IRequest) => {
      //   return y.rank - x.rank;
      // });
      // this.setState({ requests: updatedRequests });
    }.bind(inParentComponent),

    isTrackInRequests: function(track: ISpotifyTrack) {
      let result: boolean = false;
      this.state.requests.forEach((itRequest: IRequest) => {
        if (itRequest.track.id === track.id) {
          result = true;
        }
      });
      return result;
    }.bind(inParentComponent),

    isTrackPlaying: function(track: ISpotifyTrack) {
      let result: boolean = false;
      if (this.state.currentlyPlayingTrack && this.state.currentlyPlayingTrack.track.id === track.id) {
        result = true;
      }
      return result;
    }.bind(inParentComponent),

    showSignUpScreen: function(role: string) {
      if (role === "host") {
        this.setState({ role, signUpScreenVisible: true });
      } else if (role === "guest") {
        this.setState({ role, signUpScreenVisible: true });
      }
    }.bind(inParentComponent),

    createParty: async function(partyName: string, screenname: string, pid: string, tokenCode: string) {
      this.state.socketComm.send(`create.${partyName}.${screenname}.${pid}.${tokenCode}`);
    }.bind(inParentComponent),

    joinParty: function(partyName: string, screenname: string, pid: string) {
      this.state.socketComm.send(`join.${partyName}.${screenname}.${pid}`);
    }.bind(inParentComponent),

    strippedTrack: function({ id, name, artists, album, explicit, duration_ms }: ISpotifyTrack) {
      const track: ITrack = {
        id,
        name: name.replace(/\./g, "--dot--"),
        artist: artists[0].name.replace(/\./g, "--dot--"),
        imageId: album.images[0].url.slice(album.images[0].url.lastIndexOf("/") + 1),
        explicit,
        durationInMs: duration_ms,
      };
      return track;
    }.bind(inParentComponent),

    // reviver: function(key: string, value: any) {
    //   console.log(key, value);
    //   if (typeof value === "object" && value !== null) {
    //     if (value.dataType === "Map") {
    //       return new Map(value.value);
    //     } else if (value.dataType === "Set") {
    //       return new Set(value.value);
    //     }
    //   }
    //   return value;
    // },

    // onSearchChange = async (term: string) => {
    //   const searchResults = await this.spotifyWorker.getSearchResults(term);
    //   this.setState({ searchResults });
    // }

    reconnect: function() {
      this.state.socketComm.reconnect(this.state.partyName, this.state.participantName, this.state.pid);
    }.bind(inParentComponent),
  };
}
