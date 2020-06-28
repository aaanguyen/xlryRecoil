import path from "path";
import express, { Express } from "express";
import WebSocket from "ws";
import axios, { AxiosResponse } from "axios";

const OAuthToken: string =
  "BQDjnHNuwDTR8oW89j1Asluuri3rIzrXy5xGaffOysOQHEk79loWtRNMvk6pfuQ_O0mjBOXgnG0GYxJWQe3NCwKkpK4HP0OlVAldbU5GloUSyp98HV0Bu1O-_iEuBRRJC7pW4gWRRjqT1Jh2lLodEQlYYWJ6Ej7K7ENFWCK7409dNyN4ze_y0MKYSeHqYTIL_ajdsbOwhv6NdRw49j0Yk0fS7De6EpyzPW23uvs";

interface PingPongWebSocket extends WebSocket {
  isAlive: boolean;
  partyName: string;
  participantName: string;
}

interface ITrack {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  explicit: boolean;
  durationInMs: number;
}

interface IRequest {
  rank: number;
  requestedBy: string;
  upvotedBy: string[];
  downvotedBy: string[];
  track: ITrack;
}

interface IParty {
  name: string;
  partyHost: string;
  accessToken: string;
  playbackStarted: boolean;
  participants: Map<string, string>;
  connections: Map<string, WebSocket | null>;
  requests: IRequest[];
}

const parties: Map<string, IParty> = new Map();

// const firstParty: IParty = {
//   partyHost: "ant",
//   accessToken: "tokenhere",
//   playbackStarted: true,
//   participants: new Set(["ant", "tawny", "sally", "landon", "joe", "esam", "pamela", "george", "amelia"]),
//   requests: [
//     {
//       rank: 8,
//       requestedBy: "ant",
//       upvotedBy: ["tawny", "sally", "landon", "joe", "esam", "pamela", "george", "amelia"],
//       downvotedBy: [],
//       track: {
//         id: "0sNY26ONhumtJKFJGdu7kr",
//         name: "I'm Not Alright",
//         artist: "Loud Luxury",
//         imageUrl: "ab67616d0000b27349fc34f6d6a857dff2f7a5d5",
//         explicit: false,
//         durationInMs: 3000,
//       },
//     },
//     {
//       rank: 5,
//       requestedBy: "tawny",
//       upvotedBy: ["pamela", "sally", "amelia", "george", "pamela", "joe"],
//       downvotedBy: ["landon"],
//       track: {
//         id: "0VjIjW4GlUZAMYd2vXMi3b",
//         name: "Blinding Lights",
//         artist: "The Weeknd",
//         imageUrl: "ab67616d0000b2738863bc11d2aa12b54f5aeb36",
//         explicit: false,
//         durationInMs: 3000,
//       },
//     },
//     {
//       rank: 2,
//       requestedBy: "sally",
//       upvotedBy: ["tawny", "pamela"],
//       downvotedBy: [],
//       track: {
//         id: "3Dv1eDb0MEgF93GpLXlucZ",
//         name: "Say So",
//         artist: "Doja Cat",
//         imageUrl: "ab67616d0000b27382b243023b937fd579a35533",
//         explicit: true,
//         durationInMs: 3000,
//       },
//     },
//     {
//       rank: 3,
//       requestedBy: "landon",
//       upvotedBy: ["tawny", "sally", "esam", "ant"],
//       downvotedBy: ["amelia"],
//       track: {
//         id: "4nK5YrxbMGZstTLbvj6Gxw",
//         name: "Supalonely",
//         artist: "BENEE",
//         imageUrl: "ab67616d0000b27382f4ec53c54bdd5be4eed4a0",
//         explicit: true,
//         durationInMs: 3000,
//       },
//     },
//     {
//       rank: 0,
//       requestedBy: "joe",
//       upvotedBy: [],
//       downvotedBy: [],
//       track: {
//         id: "4HBZA5flZLE435QTztThqH",
//         name: "Stuck with U (with Justin Bieber)",
//         artist: "Ariana Grande",
//         imageUrl: "ab67616d0000b2732babb9dbd8f5146112f1bf86",
//         explicit: false,
//         durationInMs: 3000,
//       },
//     },
//     {
//       rank: 6,
//       requestedBy: "esam",
//       upvotedBy: ["tawny", "sally", "ant", "george", "landon", "pamela", "landon"],
//       downvotedBy: ["amelia"],
//       track: {
//         id: "017PF4Q3l4DBUiWoXk4OWT",
//         name: "Break My Heart",
//         artist: "Dua Lipa",
//         imageUrl: "ab67616d0000b273c966c2f4e08aee0442b6b8d6",
//         explicit: true,
//         durationInMs: 3000,
//       },
//     },
//   ],
// };
// parties.set("firstparty", firstParty);

const app: Express = express();
app.use("/", express.static(path.join(__dirname, "../../client/dist")));

app.listen(8080, () => {
  console.log("XLRY Express server ready");
});

const wsServer = new WebSocket.Server({ port: 9090 }, () => {
  console.log("XLRY WS server ready");
});

wsServer.on("connection", (socket: WebSocket) => {
  const ppSocket = socket as PingPongWebSocket;
  ppSocket.isAlive = true;
  socket.on("pong", function() {
    const ppSocket = this as PingPongWebSocket;
    ppSocket.isAlive = true;
  });
  socket.on("message", (inMsg: string) => {
    const msgParts: string[] = inMsg.toString().split(".");
    const message: string = msgParts[0];
    const partyName: string = msgParts[1];
    const participantName: string = msgParts[2];
    switch (message) {
      case "create": {
        if (parties.has(partyName)) {
          socket.send(`${partyName}.create.${participantName}.partyNameTaken`);
        } else {
          const pid: string = msgParts[3];
          const accessToken: string = msgParts[4];
          const ppSocket = socket as PingPongWebSocket;
          ppSocket.partyName = partyName;
          ppSocket.participantName = participantName;
          parties.set(partyName, {
            name: partyName,
            partyHost: participantName,
            accessToken,
            playbackStarted: false,
            connections: new Map([[pid, socket]]) as Map<string, WebSocket>,
            requests: [] as IRequest[],
            participants: new Map([[participantName, pid]]) as Map<string, string>,
          });
          socket.send(`${partyName}.create.${participantName}.success`);
        }
        break;
      }
      case "join": {
        if (parties.has(partyName)) {
          const party: IParty | undefined = parties.get(partyName);
          if (party) {
            const pid: string = msgParts[3];
            const participantPid: string | undefined = party.participants.get(participantName);
            if (participantPid && participantPid !== pid) {
              socket.send(`${partyName}.join.${participantName}.taken`);
              break;
            }
            if (party.connections.get(pid)) {
              console.log(`this should be null: ${party.connections.get(pid)}`);
              socket.send(`${partyName}.join.${participantName}.alreadyPresent`);
              break;
            } else {
              const assignedParticipantName = addParticipantToParty(party, participantName, pid, socket);
              const ppSocket = socket as PingPongWebSocket;
              ppSocket.partyName = partyName;
              ppSocket.participantName = assignedParticipantName;
              const stringifiedRequests = JSON.stringify(party.requests);
              socket.send(
                `${partyName}.join.${assignedParticipantName}.success.${party.accessToken}.${stringifiedRequests}`
              );
              console.log(`${assignedParticipantName} joined ${partyName}!`);
            }
          }
        } else {
          socket.send(`${partyName}.join.${participantName}.invalidParty`);
        }
        break;
      }
      case "request": {
        const stringifiedTrack: string = msgParts[3];
        const party: IParty | undefined = parties.get(partyName);
        if (party) {
          addTrackToRequests(party, participantName, stringifiedTrack);
          // wsServer.clients.forEach((inClient: WebSocket) => {
          //   let ppSocket = inClient as PingPongWebSocket;
          //   const stringifiedRequests = JSON.stringify(party.requests);
          //   if (ppSocket.partyName === partyName) {
          //     inClient.send(`${partyName}.update.${stringifiedRequests}`);
          //   }
          // });
          const stringifiedRequests = JSON.stringify(party.requests);
          party.connections.forEach((itSocket: WebSocket | null, itId: string) => {
            if (itSocket) itSocket.send(`${partyName}.update.${stringifiedRequests}`);
          });
        } else {
          socket.send(`${partyName}.request.${participantName}.partyError`);
        }
        break;
      }
      case "upvote": {
        const trackId: string = msgParts[3];
        const party: IParty | undefined = parties.get(partyName);
        if (party) {
          const request: IRequest | undefined = party.requests.find(
            (request: IRequest) => request.track.id === trackId
          );
          if (request) {
            upvoteRequest(request, participantName);
            const stringifiedRequests = JSON.stringify(party.requests);
            party.connections.forEach((itSocket: WebSocket | null, itId: string) => {
              if (itSocket) itSocket.send(`${partyName}.update.${stringifiedRequests}`);
            });
          } else {
            socket.send(`${partyName}.upvote.${participantName}.requestError.${trackId}`);
          }
        } else {
          socket.send(`${partyName}.upvote.${participantName}.partyError.${trackId}`);
        }
        break;
      }
      case "downvote": {
        const trackId: string = msgParts[3];
        const party: IParty | undefined = parties.get(partyName);
        if (party) {
          const request: IRequest | undefined = party.requests.find(
            (request: IRequest) => request.track.id === trackId
          );
          if (request) {
            downvoteRequest(request, participantName);
            const stringifiedRequests = JSON.stringify(party.requests);
            party.connections.forEach((itSocket: WebSocket | null, itId: string) => {
              if (itSocket) itSocket.send(`${partyName}.update.${stringifiedRequests}`);
            });
          } else {
            socket.send(`${partyName}.downvote.${participantName}.requestError.${trackId}`);
          }
        } else {
          socket.send(`${partyName}.downvote.${participantName}.partyError.${trackId}`);
        }
        break;
      }
      case "reconnect": {
        const party: IParty | undefined = parties.get(partyName);
        if (party) {
          // const ppSocket = socket as PingPongWebSocket;
          // ppSocket.partyName = partyName;
          // ppSocket.participantName = participantName;
          const pid: string = msgParts[3];
          party.connections.set(pid, socket);
          const stringifiedRequests = JSON.stringify(party.requests);
          console.log(`${participantName} is reconnecting to ${partyName}`);
          socket.send(`${partyName}.update.${stringifiedRequests}`);
        }
        break;
      }
    }
  });
  socket.onclose = event => {
    console.log(`WebSocket is closed now. ${event.code}, ${event.reason}, ${event.wasClean}`);
    const ppSocket = socket as PingPongWebSocket;
    const party: IParty | undefined = parties.get(ppSocket.partyName);
    if (party) {
      party.connections.forEach((itSocket: WebSocket | null, itId: string) => {
        if (socket === itSocket) {
          console.log(`just turned ${itId}'s socket from ${itSocket}`);
          party.connections.set(itId, null);
          console.log(`into ${party.connections.get(itId)}`);
        }
        //set timeout for removing presence
      });
    }
  };
  socket.onerror = function(event) {
    console.error("WebSocket error observed:", event);
  };
});

wsServer.on("close", function close() {
  console.log("socket closed");
  clearInterval(interval);
});

wsServer.on("error", (error: Error) => {
  console.log(`socket error: ${error}`);
});

const interval = setInterval(() => {
  wsServer.clients.forEach((socket: WebSocket) => {
    const ppSocket = socket as PingPongWebSocket;
    if (ppSocket.isAlive === false) {
      // handleParticipantDeparture(ppSocket.partyName, ppSocket.participantName);
      wsServer.clients.forEach((innerSocket: WebSocket) => {
        let ppClient = innerSocket as PingPongWebSocket;
        // if (ppClient.partyName === ppSocket.partyName)
        //   innerSocket.send(`${ppSocket.partyName}.disconnected.${ppSocket.participantName}`);
      });
      return socket.terminate();
    }
    ppSocket.isAlive = false;
    ppSocket.ping(null, undefined);
  });
}, 30000);

const addParticipantToParty = (
  party: IParty,
  newParticipant: string,
  pid: string,
  socket: WebSocket
): string => {
  let participant: string = newParticipant;
  if (!party.connections.has(pid)) {
    party.participants.set(newParticipant, pid);
  } else {
    party.participants.forEach((itPid: string, itParticipant: string) => {
      if (pid === itPid) {
        participant = itParticipant;
      }
    });
  }
  party.connections.set(pid, socket);
  return participant;
};

const addTrackToRequests = (party: IParty, requestedBy: string, stringifiedTrack: string): void => {
  const newTrack: ITrack = JSON.parse(stringifiedTrack);
  if (!party.playbackStarted) {
    startPlayback(newTrack.id);
    party.playbackStarted = true;
    setTimeout(() => {
      handleQueue(party);
    }, 5000);
  } else {
    party.requests.push({
      rank: 1,
      requestedBy,
      upvotedBy: [requestedBy] as string[],
      downvotedBy: [] as string[],
      track: newTrack,
    });
  }
};

const upvoteRequest = (request: IRequest, upvotedBy: string): void => {
  if (request.downvotedBy.includes(upvotedBy)) {
    request.rank++;
    request.downvotedBy = request.downvotedBy.filter((participant: string) => participant !== upvotedBy);
    return;
  }
  if (!request.upvotedBy.includes(upvotedBy)) {
    request.rank++;
    request.upvotedBy.push(upvotedBy);
  } else {
    request.rank--;
    request.upvotedBy = request.upvotedBy.filter((participant: string) => participant !== upvotedBy);
  }
};

const downvoteRequest = (request: IRequest, downvotedBy: string): void => {
  // if (request.rank === 0) return false;
  if (request.upvotedBy.includes(downvotedBy)) {
    request.rank--;
    request.upvotedBy = request.upvotedBy.filter((participant: string) => participant !== downvotedBy);
    return;
  }
  if (!request.downvotedBy.includes(downvotedBy)) {
    request.rank--;
    request.downvotedBy.push(downvotedBy);
  } else {
    request.rank++;
    request.downvotedBy = request.downvotedBy.filter((participant: string) => participant !== downvotedBy);
  }
};

const handleParticipantDeparture = (partyName: string, participantName: string): void => {
  // const party: IParty | undefined = parties.get(partyName);
  // if (party) {
  //   party.participants.delete(participantName);
  //   // party.requests = new Map(
  //   //   [...party.requests].filter(([k, v]) => v.requestedBy !== participantName)
  //   // );
  //   for (let trackId of party.requests.keys()) {
  //     const request: IRequest | undefined = party.requests.get(trackId);
  //     if (request) {
  //       // const upvotedIndex = request.upvotedBy.indexOf(participantName);
  //       // const downvotedIndex = request.downvotedBy.indexOf(participantName);
  //       if (request.requestedBy === participantName) {
  //         party.requests.delete(trackId);
  //         console.log(`deleting ${trackId}, requested by ${participantName}`);
  //       }
  //       if (request.upvotedBy.has(participantName)) {
  //         request.upvotedBy.delete(participantName);
  //         console.log(`removing ${participantName} from upvoted list for ${trackId}`);
  //       }
  //       if (request.downvotedBy.has(participantName)) {
  //         request.downvotedBy.delete(participantName);
  //         console.log(`removing ${participantName} from downvoted list for ${trackId}`);
  //       }
  //     }
  //   }
  // }
};

const encode = (originalString: string): string => {
  const encodedString = originalString.replace(/\./g, "(dot)");
  return encodedString;
};

const startPlayback = (trackId: string): void => {
  axios.put(
    `https://api.spotify.com/v1/me/player/play`,
    {
      uris: [`spotify:track:${trackId}`],
    },
    {
      headers: {
        Authorization: `Bearer ${OAuthToken}`,
      },
    }
  );
  // return response.statusText === "No Content";
};

const addTrackToPlaybackQueue = (request: IRequest): void => {
  axios.post(
    `https://api.spotify.com/v1/me/player/queue`,
    {},
    {
      headers: {
        Authorization: `Bearer ${OAuthToken}`,
      },
      params: { uri: `spotify:track:${request.track.id}` },
    }
  );
  console.log(`just added ${request.track.name} to the playback queue.`);
};

const handleQueue = async (party: IParty) => {
  const timeUntilSongEnds = await getTimeUntilSongEnds();
  const timeToSecondFunc: number = timeUntilSongEnds - 5000;
  console.log(`first step of handleQueue: second step is called in ${timeToSecondFunc / 1000} seconds.`);
  setTimeout(() => {
    queueNextSong(party);
    console.log(`second step of handleQueue: waiting 10 seconds until next handleQueue`);
    setTimeout(() => {
      handleQueue(party);
    }, 10000);
  }, timeToSecondFunc);
};

const getTimeUntilSongEnds = async (): Promise<number> => {
  const response: AxiosResponse = await axios.get(`https://api.spotify.com/v1/me/player/currently-playing`, {
    headers: {
      Authorization: `Bearer ${OAuthToken}`,
    },
  });
  return response.data.item.duration_ms - response.data.progress_ms;
};

const queueNextSong = (party: IParty) => {
  party.requests.sort((x: IRequest, y: IRequest) => {
    return y.rank - x.rank;
  });
  const nextSong: IRequest | undefined = party.requests.shift();
  if (nextSong) {
    console.log(`supposed to be adding ${nextSong.track.name}`);
    addTrackToPlaybackQueue(nextSong);
    const stringifiedRequests = JSON.stringify(party.requests);
    party.connections.forEach((itSocket: WebSocket | null, itId: string) => {
      if (itSocket) itSocket.send(`${party.name}.update.${stringifiedRequests}`);
    });
  }
};
// const startPlayback = async (trackId: string): Promise<AxiosResponse> => {
//   const response: AxiosResponse = await axios.put(`https://api.spotify.com/v1/me/player/play`, {
//     headers: {
//       Authorization: `Bearer ${OAuthToken}`,
//     },
//     data: { uris: [`spotify:track:${trackId}`] },
//   });
//   return response;
// };

// const addTrackToPlaybackQueue = async (trackId: string): Promise<AxiosResponse> => {
//   const response: AxiosResponse = await axios.post(`https://api.spotify.com/v1/me/player/queue`, {
//     headers: {
//       Authorization: `Bearer ${OAuthToken}`,
//     },
//     params: { uri: `spotify:track:${trackId}` },
//   });
//   return response;
// };
