// __mocks__/loki.js
import { randomUUID } from 'node:crypto';

const mockPeople = [
  { id: randomUUID(), name: 'John Doe', age: 30, email: 'john@example.com', phone: '555-5555', vehicle: 'Toyota' },
  { id: randomUUID(), name: 'Jane Smith', age: 25, email: 'jane@example.com', phone: '555-5556', vehicle: 'Honda' },
  { id: randomUUID(), name: 'Mike Johnson', age: 40, email: 'mike@example.com', phone: '555-5557', vehicle: 'Ford' },
  { id: randomUUID(), name: 'Emily Davis', age: 35, email: 'emily@example.com', phone: '555-5558', vehicle: 'Chevrolet' },
  { id: randomUUID(), name: 'Robert Brown', age: 28, email: 'robert@example.com', phone: '555-5559', vehicle: 'Nissan' }
];

const mockCollection = {
  find: jest.fn(() => mockPeople),
  insert: jest.fn((doc) => {
    mockPeople.push(doc);
    return doc;
  }),
  update: jest.fn((doc) => {
    const index = mockPeople.findIndex(p => p.id === doc.id);
    if (index !== -1) {
      mockPeople[index] = doc;
      return doc;
    }
    return null;
  }),
  remove: jest.fn((doc) => {
    const index = mockPeople.findIndex(p => p.id === doc.id);
    if (index !== -1) {
      mockPeople.splice(index, 1);
      return doc;
    }
    return null;
  }),
};

const Loki = jest.fn(() => ({
  getCollection: jest.fn(() => mockCollection),
  addCollection: jest.fn(() => mockCollection),
}));

export default Loki;
