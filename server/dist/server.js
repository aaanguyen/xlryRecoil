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
exports.SPOTIFY_CLIENT = void 0;
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var ws_1 = __importDefault(require("ws"));
var Party_1 = __importDefault(require("./Party"));
exports.SPOTIFY_CLIENT = "N2VkNTQyNzM0ZTEyNGM3NDg2ZWY1YzcxZDQ2NGE5MDU6ZDJkNDU1NDhhOTQ4NDU5ZGJiZDEzOGI5ZTc0NmRiOTU=";
var ONE_HOUR = 3600000;
// const clientId: string = "7ed542734e124c7486ef5c71d464a905";
// const clientSecret: string = "d2d45548a948459dbbd138b9e746db95";
var redirectUri = "http%3A%2F%2F192%2E168%2E0%2E16%3A8080%2F";
// interface IParty {
//   name: string;
//   partyHost: string;
//   accessToken: string;
//   playbackStarted: boolean;
//   participants: Map<string, string>;
//   connections: Map<string, WebSocket | null>;
//   requests: IRequest[];
//   currentlyPlayingTrack: IRequest;
// }
var parties = new Map();
var watchdogs = new Map();
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
var app = express_1.default();
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
app.listen(8080, function () {
    console.log("XLRY Express server ready");
});
var wsServer = new ws_1.default.Server({ port: 9090 }, function () {
    console.log("XLRY WS server ready");
});
wsServer.on("connection", function (socket) {
    var ppSocket = socket;
    ppSocket.isAlive = true;
    socket.on("pong", function () {
        var ppSocket = this;
        ppSocket.isAlive = true;
    });
    socket.on("message", function (inMsg) { return __awaiter(void 0, void 0, void 0, function () {
        var msgParts, message, partyName, participantName, _a, pid, tokenCode, ppSocket_1, party, party, pid, participantPid, assignedParticipantName, ppSocket_2, stringifiedRequests, stringifiedTrack, party, trackId_1, party_1, request, stringifiedRequests_1, trackId_2, party_2, request, stringifiedRequests_2, party, pid, stringifiedRequests;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    msgParts = inMsg.toString().split(".");
                    message = msgParts[0];
                    partyName = msgParts[1];
                    participantName = msgParts[2];
                    _a = message;
                    switch (_a) {
                        case "create": return [3 /*break*/, 1];
                        case "join": return [3 /*break*/, 6];
                        case "request": return [3 /*break*/, 7];
                        case "upvote": return [3 /*break*/, 8];
                        case "downvote": return [3 /*break*/, 9];
                        case "reconnect": return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 11];
                case 1:
                    if (!parties.has(partyName)) return [3 /*break*/, 2];
                    socket.send(partyName + ".create." + participantName + ".partyNameTaken");
                    return [3 /*break*/, 5];
                case 2:
                    pid = msgParts[3];
                    tokenCode = msgParts[4];
                    ppSocket_1 = socket;
                    ppSocket_1.partyName = partyName;
                    ppSocket_1.participantName = participantName;
                    parties.set(partyName, new Party_1.default(partyName, participantName, pid, socket));
                    party = parties.get(partyName);
                    if (!party) return [3 /*break*/, 4];
                    return [4 /*yield*/, party.init(tokenCode)];
                case 3:
                    _b.sent();
                    socket.send(party.name + ".create." + party.partyHost + ".success." + party.accessToken);
                    _b.label = 4;
                case 4:
                    watchdogs.set(partyName, setTimeout(function () {
                        endParty(partyName);
                    }, 600000));
                    _b.label = 5;
                case 5: return [3 /*break*/, 11];
                case 6:
                    {
                        if (parties.has(partyName)) {
                            party = parties.get(partyName);
                            if (party) {
                                pid = msgParts[3];
                                participantPid = party.participants.get(participantName);
                                if (participantPid && participantPid !== pid) {
                                    socket.send(partyName + ".join." + participantName + ".taken");
                                    return [3 /*break*/, 11];
                                }
                                if (party.connections.get(pid)) {
                                    console.log("this should be null: " + party.connections.get(pid));
                                    socket.send(partyName + ".join." + participantName + ".alreadyPresent");
                                    return [3 /*break*/, 11];
                                }
                                else {
                                    assignedParticipantName = addParticipantToParty(party, participantName, pid, socket);
                                    ppSocket_2 = socket;
                                    ppSocket_2.partyName = partyName;
                                    ppSocket_2.participantName = assignedParticipantName;
                                    stringifiedRequests = JSON.stringify(party.requests);
                                    socket.send(partyName + ".join." + assignedParticipantName + ".success." + party.accessToken + "." + stringifiedRequests + "." + JSON.stringify(party.currentlyPlayingRequest));
                                    console.log(assignedParticipantName + " joined " + partyName + "!");
                                }
                            }
                            hitParty(partyName);
                        }
                        else {
                            socket.send(partyName + ".join." + participantName + ".invalidParty");
                        }
                        return [3 /*break*/, 11];
                    }
                    _b.label = 7;
                case 7:
                    {
                        stringifiedTrack = msgParts[3];
                        party = parties.get(partyName);
                        console.log(party);
                        if (party) {
                            party.addTrackToRequests(participantName, stringifiedTrack);
                            hitParty(partyName);
                        }
                        else {
                            socket.send(partyName + ".request." + participantName + ".partyError");
                        }
                        return [3 /*break*/, 11];
                    }
                    _b.label = 8;
                case 8:
                    {
                        trackId_1 = msgParts[3];
                        party_1 = parties.get(partyName);
                        if (party_1) {
                            request = party_1.requests.find(function (request) { return request.track.id === trackId_1; });
                            if (request) {
                                upvoteRequest(request, participantName);
                                stringifiedRequests_1 = JSON.stringify(party_1.requests);
                                party_1.connections.forEach(function (itSocket, itId) {
                                    if (itSocket)
                                        itSocket.send(partyName + ".update." + stringifiedRequests_1 + "." + JSON.stringify(party_1.currentlyPlayingRequest));
                                });
                            }
                            else {
                                socket.send(partyName + ".upvote." + participantName + ".requestError." + trackId_1);
                            }
                            hitParty(partyName);
                        }
                        else {
                            socket.send(partyName + ".upvote." + participantName + ".partyError." + trackId_1);
                        }
                        return [3 /*break*/, 11];
                    }
                    _b.label = 9;
                case 9:
                    {
                        trackId_2 = msgParts[3];
                        party_2 = parties.get(partyName);
                        if (party_2) {
                            request = party_2.requests.find(function (request) { return request.track.id === trackId_2; });
                            if (request) {
                                downvoteRequest(request, participantName);
                                stringifiedRequests_2 = JSON.stringify(party_2.requests);
                                party_2.connections.forEach(function (itSocket, itId) {
                                    if (itSocket)
                                        itSocket.send(partyName + ".update." + stringifiedRequests_2 + "." + JSON.stringify(party_2.currentlyPlayingRequest));
                                });
                            }
                            else {
                                socket.send(partyName + ".downvote." + participantName + ".requestError." + trackId_2);
                            }
                            hitParty(partyName);
                        }
                        else {
                            socket.send(partyName + ".downvote." + participantName + ".partyError." + trackId_2);
                        }
                        return [3 /*break*/, 11];
                    }
                    _b.label = 10;
                case 10:
                    {
                        party = parties.get(partyName);
                        if (party) {
                            pid = msgParts[3];
                            party.connections.set(pid, socket);
                            stringifiedRequests = JSON.stringify(party.requests);
                            console.log(participantName + " is reconnecting to " + partyName);
                            socket.send(partyName + ".update." + stringifiedRequests + "." + JSON.stringify(party.currentlyPlayingRequest));
                        }
                        return [3 /*break*/, 11];
                    }
                    _b.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    }); });
    socket.onclose = function (event) {
        console.log("WebSocket is closed now. " + event.code + ", " + event.reason + ", " + event.wasClean);
        var ppSocket = socket;
        var party = parties.get(ppSocket.partyName);
        if (party) {
            party.connections.forEach(function (itSocket, itId) {
                if (socket === itSocket) {
                    console.log("just turned " + itId + "'s socket from " + itSocket);
                    party.connections.set(itId, null);
                    console.log("into " + party.connections.get(itId));
                }
                //set timeout for removing presence
            });
        }
    };
    socket.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };
});
wsServer.on("close", function close() {
    console.log("socket closed");
    clearInterval(interval);
});
wsServer.on("error", function (error) {
    console.log("socket error: " + error);
});
var interval = setInterval(function () {
    wsServer.clients.forEach(function (socket) {
        var ppSocket = socket;
        if (ppSocket.isAlive === false) {
            // handleParticipantDeparture(ppSocket.partyName, ppSocket.participantName);
            wsServer.clients.forEach(function (innerSocket) {
                var ppClient = innerSocket;
                // if (ppClient.partyName === ppSocket.partyName)
                //   innerSocket.send(`${ppSocket.partyName}.disconnected.${ppSocket.participantName}`);
            });
            return socket.terminate();
        }
        ppSocket.isAlive = false;
        ppSocket.ping(null, undefined);
    });
}, 30000);
var addParticipantToParty = function (party, newParticipant, pid, socket) {
    var participant = newParticipant;
    if (!party.connections.has(pid)) {
        party.participants.set(newParticipant, pid);
    }
    else {
        party.participants.forEach(function (itPid, itParticipant) {
            if (pid === itPid) {
                participant = itParticipant;
            }
        });
    }
    party.connections.set(pid, socket);
    return participant;
};
var upvoteRequest = function (request, upvotedBy) {
    if (request.downvotedBy.includes(upvotedBy)) {
        request.rank++;
        request.downvotedBy = request.downvotedBy.filter(function (participant) { return participant !== upvotedBy; });
        return;
    }
    if (!request.upvotedBy.includes(upvotedBy)) {
        request.rank++;
        request.upvotedBy.push(upvotedBy);
    }
    else {
        request.rank--;
        request.upvotedBy = request.upvotedBy.filter(function (participant) { return participant !== upvotedBy; });
    }
};
var downvoteRequest = function (request, downvotedBy) {
    // if (request.rank === 0) return false;
    if (request.upvotedBy.includes(downvotedBy)) {
        request.rank--;
        request.upvotedBy = request.upvotedBy.filter(function (participant) { return participant !== downvotedBy; });
        return;
    }
    if (!request.downvotedBy.includes(downvotedBy)) {
        request.rank--;
        request.downvotedBy.push(downvotedBy);
    }
    else {
        request.rank++;
        request.downvotedBy = request.downvotedBy.filter(function (participant) { return participant !== downvotedBy; });
    }
};
var handleParticipantDeparture = function (partyName, participantName) {
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
var encode = function (originalString) {
    var encodedString = originalString.replace(/\./g, "(dot)");
    return encodedString;
};
var hitParty = function (partyName) {
    var timeout = watchdogs.get(partyName);
    if (timeout) {
        clearTimeout(timeout);
        watchdogs.set(partyName, setTimeout(function () {
            endParty(partyName);
        }, 600000));
    }
    console.log(partyName + " hit");
};
var endParty = function (partyName) {
    parties.delete(partyName);
    watchdogs.delete(partyName);
    console.log("deleted party: " + partyName);
    console.log(parties);
};
//# sourceMappingURL=server.js.map