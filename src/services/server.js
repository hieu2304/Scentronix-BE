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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServer = void 0;
exports.getServers = getServers;
exports.getServerLowestPriority = getServerLowestPriority;
const axios_1 = __importDefault(require("axios"));
const error_code_1 = __importDefault(require("../resources/error_code"));
const mock_data_1 = require("../resources/mock_data");
const util_1 = require("../resources/util");
/**
 * @param {Server} server
 * @returns {Promise<Server>}
 */
// Get list server valid
const getServer = (server) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield axios_1.default.get(server.url, {
            timeout: 20,
            validateStatus: (status) => {
                return (0, util_1.isValidRequest)(status);
            },
        });
        return yield Promise.resolve(server);
    }
    catch (error) {
        return yield Promise.reject(error);
    }
});
exports.getServer = getServer;
function getServers() {
    const result = [];
    for (const server of mock_data_1.SERVERS) {
        const request = (0, exports.getServer)(server);
        result.push(request);
    }
    return result;
}
function getServerLowestPriority(results) {
    let chosenServer = null;
    for (const result of results) {
        const { status } = result;
        if (status !== "fulfilled") {
            continue;
        }
        const server = result.value;
        if (!server) {
            continue;
        }
        if (!chosenServer || server.priority < chosenServer.priority) {
            chosenServer = server;
        }
    }
    if (!chosenServer) {
        return Promise.reject(error_code_1.default.SERVER_NOT_WORKING);
    }
    return Promise.resolve(chosenServer);
}
