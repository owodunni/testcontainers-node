import { DockerConfig } from "./types";

import fs from "fs";
import { readDockerConfig } from "./config";

const spy = jest.spyOn(fs, "existsSync").mockImplementation();

describe("Config", () => {
  afterEach(() => (process.env.DOCKER_AUTH_CONFIG = undefined));

  it("should return empty object if no config file exists", async () => {
    spy.mockReturnValue(false);

    const config = await readDockerConfig();
    expect(config).toEqual({});
  });

  it("should use the docker environment variable config", async () => {
    const dockerConfig: DockerConfig = {
      auths: {
        "https://registry.example.com": {
          email: "user@example.com",
          username: "user",
          password: "pass",
        },
      },
    };
    process.env.DOCKER_AUTH_CONFIG = JSON.stringify(dockerConfig);

    spy.mockReturnValue(false);

    const config = await readDockerConfig();
    expect(config).toEqual(dockerConfig);
  });
});
