"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findServer = findServer;
const server_1 = require("./src/services/server");
function findServer() {
    const listServer = (0, server_1.getServers)();
    const getServer = Promise.allSettled(listServer).then((results) => (0, server_1.getServerLowestPriority)(results));
    return getServer;
}
