import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve());
  });
}

describe("E2E Test Suite", () => {
  describe("E2E Tests for Server in a non-test env", () => {
    it("should start server with PORT 4000", async () => {
      const PORT = 4000;
      process.env.NODE_ENV = "production";
      process.env.PORT = PORT;
      jest.spyOn(console, console.log.name);

      const { default: server } = await import("../src/index.js");

      await waitForServerStatus(server);
      const serverInfo = server.address();

      expect(serverInfo.port).toBe(4000);
      expect(console.log).toHaveBeenCalledWith(
        `server is running as ${serverInfo.address}:${serverInfo.port}`
      );
      return new Promise((resolve) => server.close(resolve));
    });
  });
  // describe("E2E Testes for Server", () => {
  //   let _testServer;
  //   let _testServerAddress;
  //   beforeAll(async () => {
  //     process.env.NODE_ENV = "test";
  //     const { default: server } = await import("../src/index.js");
  //     _testServer = server.listen();

  //     await waitForServerStatus(_testServer);
  //     const serverInfo = _testServer.address();
  //     _testServerAddress = `http://localhost:${serverInfo.port}`;
  //   });

  //   afterAll(async () => {
  //     await new Promise((resolve) => _testServer.close(resolve));
  //   });

  //   // afterAll(done => _testServer.close(done))

  //   it("should return 404 for unsupported routes", async () => {
  //     const response = await fetch(`${_testServerAddress}/unsupported`, {
  //       method: "POST",
  //     });
  //     expect(response.status).toBe(404);
  //   });
  //   it("should return 400 and missing field message when body(CPF) is invalid", async () => {
  //     const invalidPerson = { name: "Fulano da Silva" }; //missing cpf
  //     const response = await fetch(`${_testServerAddress}/persons`, {
  //       method: "POST",
  //       body: JSON.stringify(invalidPerson),
  //     });
  //     expect(response.status).toBe(400);
  //     const data = await response.json();
  //     expect(data.validationError).toEqual("cpf is required");
  //   });

  //   it("should return 400 and missing field message when body(name) is invalid", async () => {
  //     const invalidPerson = { cpf: "111.111.111-11" }; //missing name
  //     const response = await fetch(`${_testServerAddress}/persons`, {
  //       method: "POST",
  //       body: JSON.stringify(invalidPerson),
  //     });
  //     expect(response.status).toBe(400);
  //     const data = await response.json();
  //     expect(data.validationError).toEqual("name is required");
  //   });
    
  //   it("should return 500 when an unexpected error occurs", async () => {
  //     const invalidJson = "{ invalidJson: true";
  //     const response = await fetch(`${_testServerAddress}/persons`, {
  //       method: "POST",
  //       body: invalidJson,
  //     });

  //     expect(response.status).toBe(500);
  //   });
  //   it("should process a valid person", async () => {
  //     const validPerson = { name: "Fulano da Silva", cpf: "111.111.111-11" };
  //     const response = await fetch(`${_testServerAddress}/persons`, {
  //       method: "POST",
  //       body: JSON.stringify(validPerson),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     expect(response.status).toBe(200);

  //     const data = await response.json();
  //     expect(data.result).toBe("ok");
  //   });
  // });
});
