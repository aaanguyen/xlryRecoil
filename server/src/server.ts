import path from "path";
import express, { Express } from "express";
import WebSocket from "ws";

import Party from "./Party";

export const SPOTIFY_CLIENT =
  "N2VkNTQyNzM0ZTEyNGM3NDg2ZWY1YzcxZDQ2NGE5MDU6ZDJkNDU1NDhhOTQ4NDU5ZGJiZDEzOGI5ZTc0NmRiOTU=";
const ONE_HOUR = 3600000;

// const clientId: string = "7ed542734e124c7486ef5c71d464a905";
// const clientSecret: string = "d2d45548a948459dbbd138b9e746db95";
const redirectUri: string = "http%3A%2F%2F192%2E168%2E0%2E16%3A8080%2F";

interface PingPongWebSocket extends WebSocket {
  isAlive: boolean;
  partyName: string;
  participantName: string;
}

export interface ITrack {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  explicit: boolean;
  durationInMs: number;
}

export interface IRequest {
  rank: number;
  requestedBy: string;
  upvotedBy: string[];
  downvotedBy: string[];
  track: ITrack;
}

const parties: Map<string, Party> = new Map();
const watchdogs: Map<string, NodeJS.Timeout> = new Map();

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
  socket.on("message", async (inMsg: string) => {
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
          const tokenCode: string = msgParts[4];
          const ppSocket = socket as PingPongWebSocket;
          ppSocket.partyName = partyName;
          ppSocket.participantName = participantName;
          parties.set(partyName, new Party(partyName, participantName, pid, socket));
          const party = parties.get(partyName);
          if (party) {
            await party.init(tokenCode);
            socket.send(`${party.name}.create.${party.partyHost}.success.${party.accessToken}`);
          }
          watchdogs.set(
            partyName,
            setTimeout(() => {
              endParty(partyName);
            }, 600000)
          );
        }
        break;
      }
      case "join": {
        if (parties.has(partyName)) {
          const party: Party | undefined = parties.get(partyName);
          if (party) {
            const pid: string = msgParts[3];
            const participantPid: string | undefined = party.participants.get(participantName);
            if (participantPid) {
              if (participantPid !== pid) {
                socket.send(`${partyName}.join.${participantName}.taken`);
                break;
              } else {
                const oldSocket: WebSocket | undefined | null = party.connections.get(pid);
                if (oldSocket) oldSocket.terminate();
                party.connections.set(pid, socket);
                const stringifiedRequests = JSON.stringify(party.requests);
                socket.send(
                  `${partyName}.join.${participantName}.success.${
                    party.accessToken
                  }.${stringifiedRequests}.${JSON.stringify(party.currentlyPlayingRequest)}`
                );
              }
            }
            if (party.connections.get(pid)) {
              // console.log(`this should be null: ${party.connections.get(pid)}`);
              let alreadyPresentName: string = "";
              party.participants.forEach((itId: string, itName: string) => {
                if (itId === pid) {
                  alreadyPresentName = itName;
                }
              });
              socket.send(`${partyName}.join.${alreadyPresentName}.alreadyPresent`);
              break;
            } else {
              const assignedParticipantName = party.addParticipant(participantName, pid, socket);
              const ppSocket = socket as PingPongWebSocket;
              ppSocket.partyName = partyName;
              ppSocket.participantName = assignedParticipantName;
              const stringifiedRequests = JSON.stringify(party.requests);
              socket.send(
                `${partyName}.join.${assignedParticipantName}.success.${
                  party.accessToken
                }.${stringifiedRequests}.${JSON.stringify(party.currentlyPlayingRequest)}`
              );
              console.log(`${assignedParticipantName} joined ${partyName}!`);
            }
          }
          hitParty(partyName);
        } else {
          socket.send(`${partyName}.join.${participantName}.invalidParty`);
        }
        break;
      }
      case "request": {
        const stringifiedTrack: string = msgParts[3];
        const party: Party | undefined = parties.get(partyName);
        console.log(party);
        if (party) {
          party.addTrackToRequests(participantName, stringifiedTrack);
          hitParty(partyName);
        } else {
          socket.send(`${partyName}.request.${participantName}.partyError`);
        }
        break;
      }
      case "upvote": {
        const trackId: string = msgParts[3];
        const party: Party | undefined = parties.get(partyName);
        if (party) {
          const request: IRequest | undefined = party.requests.find(
            (request: IRequest) => request.track.id === trackId
          );
          if (request) {
            upvoteRequest(request, participantName);
            const stringifiedRequests = JSON.stringify(party.requests);
            party.connections.forEach((itSocket: WebSocket | null, itId: string) => {
              if (itSocket)
                itSocket.send(
                  `${partyName}.update.${stringifiedRequests}.${JSON.stringify(
                    party.currentlyPlayingRequest
                  )}`
                );
            });
          } else {
            socket.send(`${partyName}.upvote.${participantName}.requestError.${trackId}`);
          }
          hitParty(partyName);
        } else {
          socket.send(`${partyName}.upvote.${participantName}.partyError.${trackId}`);
        }
        break;
      }
      case "downvote": {
        const trackId: string = msgParts[3];
        const party: Party | undefined = parties.get(partyName);
        if (party) {
          const request: IRequest | undefined = party.requests.find(
            (request: IRequest) => request.track.id === trackId
          );
          if (request) {
            downvoteRequest(request, participantName);
            const stringifiedRequests = JSON.stringify(party.requests);
            party.connections.forEach((itSocket: WebSocket | null, itId: string) => {
              if (itSocket)
                itSocket.send(
                  `${partyName}.update.${stringifiedRequests}.${JSON.stringify(
                    party.currentlyPlayingRequest
                  )}`
                );
            });
          } else {
            socket.send(`${partyName}.downvote.${participantName}.requestError.${trackId}`);
          }
          hitParty(partyName);
        } else {
          socket.send(`${partyName}.downvote.${participantName}.partyError.${trackId}`);
        }
        break;
      }
      case "reconnect": {
        const party: Party | undefined = parties.get(partyName);
        if (party) {
          // const ppSocket = socket as PingPongWebSocket;
          // ppSocket.partyName = partyName;
          // ppSocket.participantName = participantName;
          const pid: string = msgParts[3];
          const oldSocket: WebSocket | undefined | null = party.connections.get(pid);
          if (oldSocket) oldSocket.terminate();
          party.connections.set(pid, socket);
          const stringifiedRequests = JSON.stringify(party.requests);
          console.log(`${participantName} is reconnecting to ${partyName}`);
          socket.send(
            `${partyName}.update.${stringifiedRequests}.${JSON.stringify(party.currentlyPlayingRequest)}`
          );
        }
        break;
      }
    }
  });
  socket.onclose = event => {
    console.log(`WebSocket is closed now. ${event.code}, ${event.reason}, ${event.wasClean}`);
    // const ppSocket = socket as PingPongWebSocket;
    // const party: Party | undefined = parties.get(ppSocket.partyName);
    // if (party) {
    //   party.connections.forEach((itSocket: WebSocket | null, itId: string) => {
    //     if (socket === itSocket) {
    //       console.log(`just turned ${itId}'s socket from ${itSocket}`);
    //       party.connections.set(itId, null);
    //       console.log(`into ${party.connections.get(itId)}`);
    //     }
    //     //set timeout for removing presence
    //   });
    // }
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

const hitParty = (partyName: string) => {
  const timeout: NodeJS.Timeout | undefined = watchdogs.get(partyName);
  if (timeout) {
    clearTimeout(timeout);
    watchdogs.set(
      partyName,
      setTimeout(() => {
        endParty(partyName);
      }, 600000)
    );
  }
  console.log(`${partyName} hit`);
};

const endParty = (partyName: string) => {
  let party: Party | undefined = parties.get(partyName);
  if (party) party.destroy();
  parties.delete(partyName);
  party = undefined;
  const timeout: NodeJS.Timeout | undefined = watchdogs.get(partyName);
  if (timeout) clearTimeout(timeout);
  watchdogs.delete(partyName);
  console.log(`deleted party: ${partyName}`);
  console.log(parties);
};
