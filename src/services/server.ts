import axios from "axios";

import ErrorCode from "../resources/error_code";
import { Server, SERVERS } from "../resources/mock_data";
import { isValidRequest } from "../resources/util";

/**
 * @param {Server} server
 * @returns {Promise<Server>}
 */

// Get list server valid
export const getServer = async (server: Server): Promise<Server> => {
  try {
    const res = await axios.get(server.url,
      {
        timeout: 20,
        validateStatus: (status_1) => {
          return isValidRequest(status_1);
        },
      });
    console.log(res)
    return await Promise.resolve(server);
  } catch (error) {
    return await Promise.reject(error);
  }
}

export function getServers(): Promise<Server>[] {
  const result: Promise<Server>[] = [];

  for (const server of SERVERS) {
    const request: Promise<Server> = getServer(server);
    result.push(request);
  }

  return result;
}

export function getServerLowestPriority(
  results: PromiseSettledResult<Server>[]
): Promise<string | Server> {
  let chosenServer: Server | null = null;
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
    return Promise.reject(ErrorCode.SERVER_NOT_WORKING);
  }

  return Promise.resolve(chosenServer);
}
