const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const itemRouter = require('../routes/items');

const app = express();
app.use(express.json());

jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

app.use('/api/items', itemRouter);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}, 30000);

describe('Items API', () => {

  let itemId;

  test('POST /api/items - create an item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ itemName: 'Turnip', category: 'crop', sellPrice: 50 });
    expect(res.statusCode).toBe(201);
    expect(res.body.itemName).toBe('Turnip');
    itemId = res.body._id;
  });

  test('POST /api/items - fails without itemName', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ category: 'crop', sellPrice: 50 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('POST /api/items - fails without category', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ itemName: 'Turnip', sellPrice: 50 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('POST /api/items - fails without sellPrice', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ itemName: 'Turnip', category: 'crop' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('POST /api/items - fails with negative sellPrice', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ itemName: 'Turnip', category: 'crop', sellPrice: -10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('POST /api/items - fails with negative growthTime', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ itemName: 'Turnip', category: 'crop', sellPrice: 50, growthTime: -1 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('GET /api/items - get all items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/items/:id - get item by ID', async () => {
    const res = await request(app).get(`/api/items/${itemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(itemId);
  });

  test('GET /api/items/:id - 404 if not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/items/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/items/:id - update an item', async () => {
    const res = await request(app)
      .put(`/api/items/${itemId}`)
      .send({ sellPrice: 75 });
    expect(res.statusCode).toBe(200);
    expect(res.body.sellPrice).toBe(75);
  });

  test('PUT /api/items/:id - fails with negative sellPrice', async () => {
    const res = await request(app)
      .put(`/api/items/${itemId}`)
      .send({ sellPrice: -5 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('PUT /api/items/:id - fails with negative growthTime', async () => {
    const res = await request(app)
      .put(`/api/items/${itemId}`)
      .send({ growthTime: -2 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('DELETE /api/items/:id - delete an item', async () => {
    const res = await request(app).delete(`/api/items/${itemId}`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /api/items/:id - 404 after deletion', async () => {
    const res = await request(app).get(`/api/items/${itemId}`);
    expect(res.statusCode).toBe(404);
  });

});