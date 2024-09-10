import { createServer } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import Loki from 'lokijs';

let db = new Loki('people.db', {
  autoload: true,
  autoloadCallback: () => {
    let people = db.getCollection('people');
    if (people === null) {
      people = db.addCollection('people', { unique: ['email'] });
      people.insert([
        { id: randomUUID(), name: 'John Doe', age: 30, email: 'john@example.com', phone: '555-5555', vehicle: 'Toyota' },
        { id: randomUUID(), name: 'Jane Smith', age: 25, email: 'jane@example.com', phone: '555-5556', vehicle: 'Honda' },
        { id: randomUUID(), name: 'Mike Johnson', age: 40, email: 'mike@example.com', phone: '555-5557', vehicle: 'Ford' },
        { id: randomUUID(), name: 'Emily Davis', age: 35, email: 'emily@example.com', phone: '555-5558', vehicle: 'Chevrolet' },
        { id: randomUUID(), name: 'Robert Brown', age: 28, email: 'robert@example.com', phone: '555-5559', vehicle: 'Nissan' }
      ]);
    }
  },
  autosave: true,
  autosaveInterval: 4000
});

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let people = db.getCollection('people');
  if (!people) {
    people = db.addCollection('people', { unique: ['email'] });
  }
  const params = new URLSearchParams(req.url.split('?')[1]);
  const limit = parseInt(params.get('limit')) || 10;
  const skip = parseInt(params.get('skip')) || 0;
  const search = params.get('search')?.toLowerCase() || '';

  if (req.url.startsWith('/users') && req.method === 'GET') {
    const filteredPeople = people
      .chain()
      .find({ name: { $regex: new RegExp(search, 'i') } })
      .offset(skip)
      .limit(limit)
      .data();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filteredPeople));
    return;
  }

  if (req.url.startsWith('/users') && req.method === 'POST') {
    try {
      const newUser = JSON.parse(await once(req, 'data'));

      // Verifica se todos os campos obrigatórios estão presentes
      const requiredFields = ['name', 'age', 'email', 'phone', 'vehicle'];
      for (const field of requiredFields) {
        if (!newUser[field]) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Missing required field: ${field}` }));
          return;
        }
      }

      // Atribui um novo ID UUID ao usuário
      newUser.id = randomUUID();

      // Insere o novo usuário na base de dados
      people.insert(newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
    return;
  }

  if (req.url.startsWith('/users') && req.method === 'PUT') {
    const updatedUser = JSON.parse(await once(req, 'data'));
    const user = people.findOne({ name: updatedUser.name });

    if (user) {
      people.update(Object.assign(user, updatedUser));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
    }
    return;
  }

  if (req.url.startsWith('/users') && req.method === 'DELETE') {
    const userName = params.get('name');         
    const user = people.findOne({ name: userName });;
  
    if (user) {
      people.remove(user); 
      res.writeHead(204); 
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' }); // Retorna um status 404 (Not Found) se o usuário não for encontrado
      res.end(JSON.stringify({ error: 'User not found' }));
    }
    return;
  }
  

  

  if (req.url.includes('/analytics') && req.method === 'POST') {
    const { appId, ...args } = JSON.parse(await once(req, 'data'));
    console.log(`[app: ${appId}]`, args);

    res.writeHead(200);
    res.end('ok');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

export default server;
