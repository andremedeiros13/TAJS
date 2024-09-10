import { describe, it, expect, jest, beforeAll, afterAll, beforeEach } from '@jest/globals';
import fetch from 'node-fetch';
import Loki from 'lokijs';
import { randomUUID } from 'node:crypto';

function createTestDatabase() {
  const db = new Loki('test.db', { autoload: true });
  const people = db.addCollection('people123');

  // Inserindo dados de teste
  people.insert([
    { id: randomUUID(), name: 'John Doe', age: 30, email: 'john@example.com', phone: '555-5555', vehicle: 'Toyota' },
    { id: randomUUID(), name: 'Jane Smith', age: 25, email: 'john@example.com', phone: '555-5556', vehicle: 'Honda' },
    { id: randomUUID(), name: 'Mike Johnson', age: 40, email: 'mike@example.com', phone: '555-5557', vehicle: 'Ford' },
    { id: randomUUID(), name: 'Emily Davis', age: 35, email: 'emily@example.com', phone: '555-5558', vehicle: 'Chevrolet' },
    { id: randomUUID(), name: 'Robert Brown', age: 28, email: 'robert@example.com', phone: '555-5559', vehicle: 'Nissan' }
  ]);

  return db;
}



function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once('error', (err) => reject(err));
    server.once('listening', () => resolve());
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

  describe('E2E API Suite', () => {
    let _testServer;
    let _testServerAddress;
    beforeAll(async () => {
      process.env.NODE_ENV = "test";
      const { default: server } = await import("../src/index.js");
      _testServer = server.listen();

      await waitForServerStatus(_testServer);
      const serverInfo = _testServer.address();
      _testServerAddress = `http://localhost:${serverInfo.port}`;

      if (!_testServer.locals) {
        _testServer.locals = {};
      }
    });

    afterAll(async () => {
      await new Promise((resolve) => _testServer.close(resolve));
    });

    beforeEach(async () => {
      const db = createTestDatabase();
      _testServer.locals = db;  // Usando o banco de dados de teste
    });

    it('should create a new user', async () => {
      const newUsermock = {
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
        phone: '555-5555',
        vehicle: 'Toyota'
      };

      const response = await fetch(`${_testServerAddress}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUsermock),
      });
      const createdUser = await response.json();

      expect(response.status).toBe(201);
      console.log(createdUser)
      expect(createdUser).toHaveProperty('id');
      expect(createdUser.name).toBe(newUsermock.name);
    });

    it('should update an existing user', async () => {
      const updatedUsermock = {
        id: 1,
        name: 'John Doe',
        age: 35,
        email: 'johnsmith@example.com',
        phone: '555-5556',
        vehicle: 'Honda'
      };

      const response = await fetch(`${_testServerAddress}/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUsermock),
      });
      const user = await response.json();

      expect(response.status).toBe(200);
      expect(user.name).toBe(updatedUsermock.name);
    });

    it('should delete a user by name', async () => {
      const userToDelete = { name: 'Jane Smith' };

      // Deleta o usuário pelo nome
      const response = await fetch(`${_testServerAddress}/users?name=${userToDelete.name}`, {
        method: 'DELETE',
      });

      // Verifica se o usuário foi deletado com sucesso
      expect(response.status).toBe(204);

      // Verifica se o usuário não existe mais na base de dados
      const checkUserResponse = await fetch(`${_testServerAddress}/users?search=${encodeURIComponent(userToDelete.name)}`);
      const checkUsers = await checkUserResponse.json();
      expect(checkUsers.length).toBe(0);
    });



    it('should respond with a list of users', async () => {
      const response = await fetch(`${_testServerAddress}/users?limit=5`);

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeLessThanOrEqual(5);
      data.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('age');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('phone');
        expect(user).toHaveProperty('vehicle');
      });
    });

    it('should handle analytics POST requests', async () => {
      const requestBody = {
        appId: 'testApp',
        event: 'userLogin',
        timestamp: Date.now()
      };
      const response = await fetch(`${_testServerAddress}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      expect(response.status).toBe(200);
      const responseText = await response.text();
      expect(responseText).toBe('ok');
    });

    it('should handle CORS preflight requests', async () => {
      const response = await fetch(`${_testServerAddress}/users`, {
        method: 'OPTIONS'
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('*');
    });

    it('should handle resource not found error', async () => {
      const response = await fetch(`${_testServerAddress}/nonexistent-resource`, {
        method: 'GET',
      });

      expect(response.status).toBe(404);
      const responseBody = await response.json();
      expect(responseBody.error).toBe('Not Found');
    })
  });  
});

