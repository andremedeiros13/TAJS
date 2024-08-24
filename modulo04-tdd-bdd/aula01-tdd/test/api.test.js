import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";
import { server } from "../src/api.js";

/**
 * Deve Cadastrar usuários e definir uma categoria onde:
 *      - Jovens Adulstos:
 *          - Usuários 18-25
 *      - Adulos:
 *          - Usuários de 26-50
 *      - Idosos:
 *          - 51+
 *      - Menor:
 *          - Apresentar Erro!
 */
describe("API Users E2E Suite", () => {
  function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once("error", (err) => reject(err));
      server.once("listening", () => resolve());
    });
  }
  function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function findUserById(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`);
    return user.json();
  }

  let _testServer;
  let _testServerAddress;
  beforeAll(async () => {
    _testServer = server.listen();

    await waitForServerStatus(_testServer);
    const serverInfo = _testServer.address();
    _testServerAddress = `http://localhost:${serverInfo.port}`;
  });

  //   afterAll(async () => {
  //     await new Promise((resolve) => _testServer.close(resolve));
  //   });
  afterAll((done) => {
    server.closeAllConnections();
    _testServer.close(done);
  });

  it("should register a new user with young-adult category", async () => {
    const expectedCategory = "young-adult";
    // Importante pois com o passar do tempo o resultado do teste pode ser alterado ocasionando quebras
    // sempre que for feito validações em data é necessario, mockar o tempo!
    jest.useFakeTimers({
      now: new Date("2024-08-24T00:00"),
    });
    const response = await createUser({
      name: "Fulano da Silva",
      birthDay: "2001-01-01", //21 anos
    });

    expect(response.status).toBe(201); // 201 - created
    const result = await response.json();
    expect(result.id).not.toBeUndefined();
    const user = await findUserById(result.id);
    expect(user.category).toEqual(expectedCategory);
  });
  it("should register a new user with adult category", async () => {
    const expectedCategory = "adult";
    // Importante pois com o passar do tempo o resultado do teste pode ser alterado ocasionando quebras
    // sempre que for feito validações em data é necessario, mockar o tempo!
    jest.useFakeTimers({
      now: new Date("2024-08-24T00:00"),
    });
    const response = await createUser({
      name: "Fulano da Silva",
      birthDay: "1991-01-01", //21 anos
    });

    expect(response.status).toBe(201); // 201 - created
    const result = await response.json();
    expect(result.id).not.toBeUndefined();
    const user = await findUserById(result.id);
    expect(user.category).toEqual(expectedCategory);
  });
  it("should register a new user with senior category", async () => {
    const expectedCategory = "senior";
    // Importante pois com o passar do tempo o resultado do teste pode ser alterado ocasionando quebras
    // sempre que for feito validações em data é necessario, mockar o tempo!
    jest.useFakeTimers({
      now: new Date("2024-08-24T00:00"),
    });
    const response = await createUser({
      name: "Fulano da Silva",
      birthDay: "1940-01-01", //21 anos
    });

    expect(response.status).toBe(201); // 201 - created
    const result = await response.json();
    expect(result.id).not.toBeUndefined();
    const user = await findUserById(result.id);
    expect(user.category).toEqual(expectedCategory);
  });
  it("should throw an error when registering a under-age user", async () => {
    // Importante pois com o passar do tempo o resultado do teste pode ser alterado ocasionando quebras
    // sempre que for feito validações em data é necessario, mockar o tempo!
    jest.useFakeTimers({
      now: new Date("2024-08-24T00:00"),
    });
    const response = await createUser({
      name: "Fulano da Silva",
      birthDay: "2010-01-01", //14 anos
    });
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result).toEqual({
      message: "User must be 18yo or older",
    });
  });
});
