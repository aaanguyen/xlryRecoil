"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var querystring_1 = __importDefault(require("querystring"));
var server_1 = require("./server");
var CHECKING_DURATION = 10000;
var QUEUE_NEXT_TRACK_DURATION = 5000;
var NEW_TOKEN_DURATION = 3420000;
var ONE_HOUR = 3600000;
var Party = /** @class */ (function () {
    function Party(name, partyHost, partyHostId, partyHostSocket) {
        var _this = this;
        this.name = name;
        this.partyHost = partyHost;
        this.partyHostId = partyHostId;
        this.partyHostSocket = partyHostSocket;
        this.accessToken = "";
        this.refreshToken = "";
        this.playbackStarted = false;
        this.participants = new Map([[partyHost, partyHostId]]);
        this.connections = new Map([[partyHostId, partyHostSocket]]);
        this.requests = [];
        this.currentlyPlayingRequest = {};
        this.intervalIdentifier = {};
        this.progressCheckIdentifier = {};
        this.newTrackPlayedIdentifier = {};
        this.tokenRefresherIdentifier = setTimeout(function () {
            _this.getAndSetNewAccessToken();
        }, NEW_TOKEN_DURATION);
    }
    Party.prototype.init = function (tokenCode) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accessToken, refreshToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getSpotifyTokens(tokenCode)];
                    case 1:
                        _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                        this.accessToken = accessToken;
                        this.refreshToken = refreshToken;
                        return [2 /*return*/];
                }
            });
        });
    };
    Party.prototype.addTrackToRequests = function (requestedBy, stringifiedTrack) {
        var _this = this;
        var newTrack = JSON.parse(stringifiedTrack);
        if (!this.playbackStarted) {
            this.startPlayback(newTrack.id);
            this.playbackStarted = true;
            this.currentlyPlayingRequest = {
                rank: 1,
                requestedBy: requestedBy,
                upvotedBy: [requestedBy],
                downvotedBy: [],
                track: newTrack,
            };
            this.progressCheckIdentifier = setTimeout(function () {
                _this.progressCheck();
            }, newTrack.durationInMs - 10000);
        }
        else {
            this.requests.push({
                rank: 1,
                requestedBy: requestedBy,
                upvotedBy: [requestedBy],
                downvotedBy: [],
                track: newTrack,
            });
        }
        var stringifiedRequests = JSON.stringify(this.requests);
        this.connections.forEach(function (itSocket, itId) {
            if (itSocket)
                itSocket.send(_this.name + ".update." + stringifiedRequests + "." + JSON.stringify(_this.currentlyPlayingRequest));
        });
    };
    Party.prototype.startPlayback = function (trackId) {
        axios_1.default.put("https://api.spotify.com/v1/me/player/play", {
            uris: ["spotify:track:" + trackId],
        }, {
            headers: {
                Authorization: "Bearer " + this.accessToken,
            },
        });
    };
    Party.prototype.progressCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, progress_ms, is_playing, _b, id, duration_ms, millisecondsRemaining;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getCurrentlyPlaying()];
                    case 1:
                        response = _c.sent();
                        console.log(response.data);
                        _a = response.data, progress_ms = _a.progress_ms, is_playing = _a.is_playing, _b = _a.item, id = _b.id, duration_ms = _b.duration_ms;
                        millisecondsRemaining = duration_ms - progress_ms;
                        console.log("progressCheck(): " + millisecondsRemaining + " ms left");
                        if (millisecondsRemaining > CHECKING_DURATION) {
                            console.log("progressCheck(): track was probably paused at some point, next progressCheck in " + (millisecondsRemaining -
                                CHECKING_DURATION));
                            this.progressCheckIdentifier = setTimeout(function () {
                                _this.progressCheck();
                            }, millisecondsRemaining - CHECKING_DURATION);
                        }
                        else {
                            this.intervalIdentifier = setInterval(function () {
                                _this.checkIfEndOfTrack();
                            }, 1000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Party.prototype.checkIfEndOfTrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, progress_ms, is_playing, _b, id, duration_ms, millisecondsRemaining;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getCurrentlyPlaying()];
                    case 1:
                        response = _c.sent();
                        _a = response.data, progress_ms = _a.progress_ms, is_playing = _a.is_playing, _b = _a.item, id = _b.id, duration_ms = _b.duration_ms;
                        millisecondsRemaining = duration_ms - progress_ms;
                        console.log("checkIfEndOfTrack(): checking if end of track. " + millisecondsRemaining + " ms left");
                        if (millisecondsRemaining <= QUEUE_NEXT_TRACK_DURATION) {
                            console.log("checkIfEndOfTrack(): less than 5 seconds left in the track. queuing up next track!");
                            this.queueNextTrack();
                            clearInterval(this.intervalIdentifier);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Party.prototype.queueNextTrack = function () {
        var _this = this;
        this.requests.sort(function (x, y) {
            return y.rank - x.rank;
        });
        var nextRequest = this.requests.shift();
        if (nextRequest) {
            console.log("queuenextTrack(): supposed to be adding " + nextRequest.track.name);
            this.currentlyPlayingRequest = nextRequest;
            this.addTrackToPlaybackQueue(nextRequest.track);
            this.newTrackPlayedIdentifier = setTimeout(function () {
                _this.checkIfNextTrackStarted(nextRequest.track);
            }, CHECKING_DURATION);
            var stringifiedRequests_1 = JSON.stringify(this.requests);
            this.connections.forEach(function (itSocket, itId) {
                if (itSocket)
                    itSocket.send(_this.name + ".update." + stringifiedRequests_1 + "." + JSON.stringify(_this.currentlyPlayingRequest));
            });
        }
    };
    Party.prototype.addTrackToPlaybackQueue = function (track) {
        axios_1.default.post("https://api.spotify.com/v1/me/player/queue", {}, {
            headers: {
                Authorization: "Bearer " + this.accessToken,
            },
            params: { uri: "spotify:track:" + track.id },
        });
        console.log("addTrackToPlaybackQueue(): just added " + track.name + " to the playback queue.");
    };
    Party.prototype.checkIfNextTrackStarted = function (newTrack) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, progress_ms, is_playing, _b, id, duration_ms;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("checkIfNextTrackStarted(): getting currently playing");
                        return [4 /*yield*/, this.getCurrentlyPlaying()];
                    case 1:
                        response = _c.sent();
                        _a = response.data, progress_ms = _a.progress_ms, is_playing = _a.is_playing, _b = _a.item, id = _b.id, duration_ms = _b.duration_ms;
                        if (id !== newTrack.id) {
                            console.log("checkIfNextTrackStarted(): previous track is still playing. checking again in 10 seconds");
                            this.newTrackPlayedIdentifier = setTimeout(function () {
                                _this.checkIfNextTrackStarted(newTrack);
                            }, CHECKING_DURATION);
                        }
                        else {
                            console.log("checkIfNextTrackStarted(): new track has played. progressCheck()ing in " + (duration_ms -
                                progress_ms -
                                CHECKING_DURATION));
                            this.progressCheckIdentifier = setTimeout(function () {
                                _this.progressCheck();
                            }, duration_ms - progress_ms - CHECKING_DURATION);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Party.prototype.getCurrentlyPlaying = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.spotify.com/v1/me/player/currently-playing", {
                            headers: {
                                Authorization: "Bearer " + this.accessToken,
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Party.prototype.getAndSetNewAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("https://accounts.spotify.com/api/token", querystring_1.default.stringify({
                            grant_type: "refresh_token",
                            refresh_token: this.refreshToken,
                        }), {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                // Authorization: `Basic *${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}*`,
                                Authorization: "Basic " + server_1.SPOTIFY_CLIENT,
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        this.accessToken = response.data.access_token;
                        this.connections.forEach(function (itSocket, itId) {
                            if (itSocket)
                                itSocket.send(_this.name + ".newToken." + _this.accessToken);
                        });
                        if (response.data.hasOwnProperty("refresh_token")) {
                            this.refreshToken = response.data.refresh_token;
                        }
                        this.tokenRefresherIdentifier = setTimeout(function () {
                            _this.getAndSetNewAccessToken();
                        }, ONE_HOUR);
                        return [2 /*return*/];
                }
            });
        });
    };
    Party.prototype.destroy = function () {
        clearInterval(this.intervalIdentifier);
        clearTimeout(this.tokenRefresherIdentifier);
        clearTimeout(this.progressCheckIdentifier);
        clearTimeout(this.newTrackPlayedIdentifier);
        this.name = "";
        this.partyHost = "";
        this.partyHostId = "";
        this.partyHostSocket = {};
        this.playbackStarted = false;
        this.participants = new Map();
        this.connections = new Map();
        this.requests = [];
        this.currentlyPlayingRequest = {};
        this.intervalIdentifier = {};
        this.accessToken = "";
        this.refreshToken = "";
    };
    return Party;
}());
exports.default = Party;
var getSpotifyTokens = function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var response, _a, access_token, refresh_token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, axios_1.default.post("https://accounts.spotify.com/api/token", querystring_1.default.stringify({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: "http://192.168.0.16:8080/",
                }), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        // Authorization: `Basic *${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}*`,
                        Authorization: "Basic " + server_1.SPOTIFY_CLIENT,
                    },
                })];
            case 1:
                response = _b.sent();
                _a = response.data, access_token = _a.access_token, refresh_token = _a.refresh_token;
                return [2 /*return*/, {
                        accessToken: access_token,
                        refreshToken: refresh_token,
                    }];
        }
    });
}); };
//# sourceMappingURL=Party.js.map