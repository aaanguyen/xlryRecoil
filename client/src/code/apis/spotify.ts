import axios from "axios";

export const spotifyAuthClientCredentials = axios.create({
  baseURL: "https://accounts.spotify.com/api",
  headers: {
    Authorization:
      "Basic N2VkNTQyNzM0ZTEyNGM3NDg2ZWY1YzcxZDQ2NGE5MDU6ZDJkNDU1NDhhOTQ4NDU5ZGJiZDEzOGI5ZTc0NmRiOTU=",
    // "Content-Type": "application/x-www-form-urlencoded",
  },
});

export const spotifySearch = axios.create({
  baseURL: "https://api.spotify.com/v1",
});
