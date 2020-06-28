import axios, { AxiosResponse } from "axios";
import { ITrack, ISpotifyTrack } from "./components/interfaces";

const OAuthToken: string =
  "BQDjnHNuwDTR8oW89j1Asluuri3rIzrXy5xGaffOysOQHEk79loWtRNMvk6pfuQ_O0mjBOXgnG0GYxJWQe3NCwKkpK4HP0OlVAldbU5GloUSyp98HV0Bu1O-_iEuBRRJC7pW4gWRRjqT1Jh2lLodEQlYYWJ6Ej7K7ENFWCK7409dNyN4ze_y0MKYSeHqYTIL_ajdsbOwhv6NdRw49j0Yk0fS7De6EpyzPW23uvs";

const clientId: string = "7ed542734e124c7486ef5c71d464a905";

const redirectUri: string = "http://192.168.0.16:8080/";

export class Worker {
  // constructor(inAccessToken: string) {
  //   Worker.accessToken;
  // }

  public getSearchResults = async (term: string): Promise<ISpotifyTrack[]> => {
    const response: AxiosResponse = await axios.get(`https://api.spotify.com/v1/search?limit=10`, {
      headers: {
        Authorization: `Bearer ${OAuthToken}`,
      },
      params: { q: term, type: "track" },
    });
    return response.data.tracks.items;
  };

  public redirectToAuthorization = async (codeChallenge: string): Promise<void> => {
    const response: AxiosResponse = await axios.get(`https://accounts.spotify.com/authorize`, {
      params: {
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        // state: '',
        scope: ["user-read-currently-playing", "user-modify-playback-state"],
      },
    });
  };

  public async getTrackData(trackId: string): Promise<ITrack> {
    const response: AxiosResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${OAuthToken}`,
      },
    });
    const { album, artists, explicit, name, duration_ms } = response.data;
    return {
      id: trackId,
      name,
      artist: artists[0].name,
      imageId: album.images[0].url,
      explicit,
      durationInMs: duration_ms,
    };
  }
}
