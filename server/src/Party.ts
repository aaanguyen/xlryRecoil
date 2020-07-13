import WebSocket from "ws";
import axios, { AxiosResponse } from "axios";
import qs from "querystring";

import { SPOTIFY_CLIENT, ITrack, IRequest } from "./server";

const CHECKING_DURATION = 10000;
const QUEUE_NEXT_TRACK_DURATION = 5000;
const NEW_TOKEN_DURATION = 3420000;
const ONE_HOUR = 3600000;

export default class Party {
  public playbackStarted: boolean;
  public participants: Map<string, string>;
  public connections: Map<string, WebSocket | null>;
  public requests: IRequest[];
  public currentlyPlayingRequest: IRequest;
  public intervalIdentifier: NodeJS.Timeout;
  public tokenRefresherIdentifier: NodeJS.Timeout;
  public progressCheckIdentifier: NodeJS.Timeout;
  public newTrackPlayedIdentifier: NodeJS.Timeout;
  public accessToken: string;
  public refreshToken: string;

  constructor(
    public name: string,
    public partyHost: string,
    public partyHostId: string,
    public partyHostSocket: WebSocket
  ) {
    this.accessToken = "";
    this.refreshToken = "";
    this.playbackStarted = false;
    this.participants = new Map([[partyHost, partyHostId]]) as Map<string, string>;
    this.connections = new Map([[partyHostId, partyHostSocket]]) as Map<string, WebSocket | null>;
    this.requests = [] as IRequest[];
    this.currentlyPlayingRequest = {} as IRequest;
    this.intervalIdentifier = {} as NodeJS.Timeout;
    this.progressCheckIdentifier = {} as NodeJS.Timeout;
    this.newTrackPlayedIdentifier = {} as NodeJS.Timeout;
    this.tokenRefresherIdentifier = setTimeout(() => {
      this.getAndSetNewAccessToken();
    }, NEW_TOKEN_DURATION);
  }

  public async init(tokenCode: string) {
    const { accessToken, refreshToken } = await getSpotifyTokens(tokenCode);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public addTrackToRequests(requestedBy: string, stringifiedTrack: string) {
    const newTrack: ITrack = JSON.parse(stringifiedTrack);
    if (!this.playbackStarted) {
      this.startPlayback(newTrack.id);
      this.playbackStarted = true;
      this.currentlyPlayingRequest = {
        rank: 1,
        requestedBy,
        upvotedBy: [requestedBy] as string[],
        downvotedBy: [] as string[],
        track: newTrack,
      };
      this.progressCheckIdentifier = setTimeout(() => {
        this.progressCheck();
      }, newTrack.durationInMs - 10000);
    } else {
      this.requests.push({
        rank: 1,
        requestedBy,
        upvotedBy: [requestedBy] as string[],
        downvotedBy: [] as string[],
        track: newTrack,
      });
    }
    const stringifiedRequests = JSON.stringify(this.requests);
    this.connections.forEach((itSocket: WebSocket | null, itId: string) => {
      if (itSocket)
        itSocket.send(
          `${this.name}.update.${stringifiedRequests}.${JSON.stringify(this.currentlyPlayingRequest)}`
        );
    });
  }

  public startPlayback(trackId: string) {
    axios.put(
      `https://api.spotify.com/v1/me/player/play`,
      {
        uris: [`spotify:track:${trackId}`],
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
  }

  public async progressCheck() {
    const response: AxiosResponse = await this.getCurrentlyPlaying();
    console.log(response.data);
    const {
      progress_ms,
      is_playing,
      item: { id, duration_ms },
    } = response.data;
    const millisecondsRemaining: number = duration_ms - progress_ms;
    console.log(`progressCheck(): ${millisecondsRemaining} ms left`);
    if (millisecondsRemaining > CHECKING_DURATION) {
      console.log(
        `progressCheck(): track was probably paused at some point, next progressCheck in ${millisecondsRemaining -
          CHECKING_DURATION}`
      );
      this.progressCheckIdentifier = setTimeout(() => {
        this.progressCheck();
      }, millisecondsRemaining - CHECKING_DURATION);
    } else {
      this.intervalIdentifier = setInterval(() => {
        this.checkIfEndOfTrack();
      }, 1000);
    }
  }

  public async checkIfEndOfTrack() {
    const response: AxiosResponse = await this.getCurrentlyPlaying();
    const {
      progress_ms,
      is_playing,
      item: { id, duration_ms },
    } = response.data;
    const millisecondsRemaining: number = duration_ms - progress_ms;
    console.log(`checkIfEndOfTrack(): checking if end of track. ${millisecondsRemaining} ms left`);
    if (millisecondsRemaining <= QUEUE_NEXT_TRACK_DURATION) {
      console.log(`checkIfEndOfTrack(): less than 5 seconds left in the track. queuing up next track!`);
      this.queueNextTrack();
      clearInterval(this.intervalIdentifier);
    }
  }

  public queueNextTrack() {
    this.requests.sort((x: IRequest, y: IRequest) => {
      return y.rank - x.rank;
    });
    const nextRequest: IRequest | undefined = this.requests.shift();
    if (nextRequest) {
      console.log(`queuenextTrack(): supposed to be adding ${nextRequest.track.name}`);
      this.currentlyPlayingRequest = nextRequest;
      this.addTrackToPlaybackQueue(nextRequest.track);
      this.newTrackPlayedIdentifier = setTimeout(() => {
        this.checkIfNextTrackStarted(nextRequest.track);
      }, CHECKING_DURATION);
      const stringifiedRequests = JSON.stringify(this.requests);
      this.connections.forEach((itSocket: WebSocket | null, itId: string) => {
        if (itSocket)
          itSocket.send(
            `${this.name}.update.${stringifiedRequests}.${JSON.stringify(this.currentlyPlayingRequest)}`
          );
      });
    }
  }

  public addTrackToPlaybackQueue(track: ITrack) {
    axios.post(
      `https://api.spotify.com/v1/me/player/queue`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: { uri: `spotify:track:${track.id}` },
      }
    );
    console.log(`addTrackToPlaybackQueue(): just added ${track.name} to the playback queue.`);
  }

  public async checkIfNextTrackStarted(newTrack: ITrack) {
    console.log(`checkIfNextTrackStarted(): getting currently playing`);
    const response: AxiosResponse = await this.getCurrentlyPlaying();
    const {
      progress_ms,
      is_playing,
      item: { id, duration_ms },
    } = response.data;
    if (id !== newTrack.id) {
      console.log(`checkIfNextTrackStarted(): previous track is still playing. checking again in 10 seconds`);
      this.newTrackPlayedIdentifier = setTimeout(() => {
        this.checkIfNextTrackStarted(newTrack);
      }, CHECKING_DURATION);
    } else {
      console.log(
        `checkIfNextTrackStarted(): new track has played. progressCheck()ing in ${duration_ms -
          progress_ms -
          CHECKING_DURATION}`
      );
      this.progressCheckIdentifier = setTimeout(() => {
        this.progressCheck();
      }, duration_ms - progress_ms - CHECKING_DURATION);
    }
  }

  public async getCurrentlyPlaying() {
    const response: AxiosResponse = await axios.get(
      `https://api.spotify.com/v1/me/player/currently-playing`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return response;
  }

  public async getAndSetNewAccessToken() {
    const response: AxiosResponse = await axios.post(
      `https://accounts.spotify.com/api/token`,
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // Authorization: `Basic *${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}*`,
          Authorization: `Basic ${SPOTIFY_CLIENT}`,
        },
      }
    );
    this.accessToken = response.data.access_token;
    this.connections.forEach((itSocket: WebSocket | null, itId: string) => {
      if (itSocket) itSocket.send(`${this.name}.newToken.${this.accessToken}`);
    });
    if (response.data.hasOwnProperty("refresh_token")) {
      this.refreshToken = response.data.refresh_token;
    }
    this.tokenRefresherIdentifier = setTimeout(() => {
      this.getAndSetNewAccessToken();
    }, ONE_HOUR);
  }

  public destroy() {
    clearInterval(this.intervalIdentifier);
    clearTimeout(this.tokenRefresherIdentifier);
    clearTimeout(this.progressCheckIdentifier);
    clearTimeout(this.newTrackPlayedIdentifier);
    this.name = "";
    this.partyHost = "";
    this.partyHostId = "";
    this.partyHostSocket = {} as WebSocket;
    this.playbackStarted = false;
    this.participants = new Map() as Map<string, string>;
    this.connections = new Map() as Map<string, WebSocket | null>;
    this.requests = [] as IRequest[];
    this.currentlyPlayingRequest = {} as IRequest;
    this.intervalIdentifier = {} as NodeJS.Timeout;
    this.accessToken = "";
    this.refreshToken = "";
  }
}

const getSpotifyTokens: Function = async (code: string): Promise<Object> => {
  const response: AxiosResponse = await axios.post(
    `https://accounts.spotify.com/api/token`,
    qs.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://192.168.0.16:8080/",
      // client_id: clientId,
      // client_secret: clientSecret,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Authorization: `Basic *${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}*`,
        Authorization: `Basic ${SPOTIFY_CLIENT}`,
      },
    }
  );
  const { access_token, refresh_token } = response.data;
  return {
    accessToken: access_token,
    refreshToken: refresh_token,
  };
};
