import axios, { AxiosError } from "axios";

import { getServer } from "../services/server";
import {  Server } from "./resources/mock_data_test";

jest.mock("axios");

jest.mock("./resources/mock_data_test", () => ({
    get SERVERS() {
        return [
            {
                url: "https://does-not-work.perfume.new",
                priority: 1,
            },
            {
                url: "https://gitlab.com",
                priority: 4,
            },
            {
                url: "http://app.scnt.me",
                priority: 3,
            },
            {
                url: "https://offline.scentronix.com",
                priority: 2,
            },
        ];
    },
}));

const mAxiosGet = jest.mocked(axios.get);

describe("getServer", () => {
    afterEach(() => {
        mAxiosGet.mockRestore();
    });

    it("should reject and return the error when get failed", () => {
        const error: AxiosError = new AxiosError();
        const server: Server = {
            url: "https://does-not-work.perfume.new",
            priority: 1,
        };
        mAxiosGet.mockRejectedValueOnce(error);

        return expect(getServer(server)).rejects.toEqual(error);
    });

    it("should resolve when the server status 200 => success", () => {
        const server: Server = {
            url: "https://does-not-work.perfume.new",
            priority: 1,
        };
        mAxiosGet.mockResolvedValueOnce({ status: 200 });
        return expect(getServer(server)).resolves.toEqual(server);
    });
});
