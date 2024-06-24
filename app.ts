import { Server } from "./src/resources/mock_data";
import {
  getServers,
  getServerLowestPriority,
} from "./src/services/server";

export function findServer(): Promise<string | Server> {
  const listServer: Promise<Server>[] = getServers();
  const getServer: Promise<string | Server> = Promise.allSettled(
    listServer
  ).then((results) => getServerLowestPriority(results));
  return getServer;
}

findServer();