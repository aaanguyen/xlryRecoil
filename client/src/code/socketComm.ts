import React from "react";

// import {atom, RecoilState} from 'recoil'

// export const socketCommState: RecoilState<Function> = atom({
//   key: 'socketCommState',
//   default: createSocketComm()
// })

export function createSocketComm(inParentComponent: React.Component) {
  let connection: WebSocket;
  connection = new WebSocket("ws://192.168.0.16:9090");
  connection.onopen = () => {
    console.log("Connection opened to WS server");
  };

  const connectionSetup = (connection: WebSocket) => {
    connection.onerror = error => {
      console.log(`WebSocket error: ${error}`);
    };
    connection.onclose = (error: CloseEvent) => {
      console.log(`Websocket closed: ${error.code}, ${error.reason}, ${error.wasClean}`);
    };
    connection.onmessage = function(inMessage: any) {
      console.log(`WebSocket message received: ${inMessage.data}`);
      const msgParts: string[] = inMessage.data.split(".");
      const partyName: string = msgParts[0];
      const message: string = msgParts[1];
      switch (message) {
        case "create": {
          const participantName: string = msgParts[2];
          const subMsg: string = msgParts[3];
          const accessToken: string = msgParts[4];
          this.state.handleMessage_create(partyName, participantName, subMsg, accessToken);
          break;
        }
        case "join": {
          const participantName: string = msgParts[2];
          const subMsg: string = msgParts[3];
          const accessToken: string = msgParts[4];
          const stringifiedRequests: string = msgParts[5];
          const stringifiedCurrentlyPlayingTrack: string = msgParts[6];
          this.state.handleMessage_join(
            partyName,
            participantName,
            subMsg,
            accessToken,
            stringifiedRequests,
            stringifiedCurrentlyPlayingTrack
          );
          break;
        }
        case "request": {
          const subMsg: string = msgParts[3];
          this.state.handleMessage_request(subMsg);
          break;
        }
        // case "upvote": {
        //   const subMsg: string = msgParts[3];
        //   this.state.handleMessage_upvote(subMsg);
        //   break;
        // }
        // case "downvote": {
        //   const subMsg: string = msgParts[3];
        //   this.state.handleMessage_downvote(subMsg);
        //   break;
        // }
        case "update": {
          const stringifiedRequests: string = msgParts[2];
          const stringifiedCurrentlyPlayingTrack: string = msgParts[3];
          this.state.handleMessage_update(stringifiedRequests, stringifiedCurrentlyPlayingTrack);
          break;
        }
        case "newToken": {
          const newToken: string = msgParts[2];
          this.state.handleMessage_newToken(newToken);
          break;
        }
        case "disconnected": {
          const participantName: string = msgParts[2];
          this.state.handleMessage_disconnected(participantName);
          break;
        }
      }
    }.bind(inParentComponent);
  };

  connectionSetup(connection);

  this.send = function(inMessage: string) {
    console.log(`WebSocket sending: ${inMessage}`);
    connection.send(inMessage);
  };

  this.reconnect = function(partyName: string, participantName: string, pid: string) {
    if (connection.readyState > 1) {
      connection = new WebSocket("ws://192.168.0.16:9090");
      connection.onopen = () => {
        console.log(`WebSocket reconnecting`);
        connection.send(`reconnect.${partyName}.${participantName}.${pid}`);
      };
      connectionSetup(connection);
    } else {
      console.log(`didn't need to reconnect`);
    }
  };

  return this;
}
