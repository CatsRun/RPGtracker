const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const characterRouter = require('../routes/characters');

const app = express();
app.use(express.json());

jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

app.use('/api/characters', characterRouter);

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

describe('Characters API', () => {

  let characterId;

  test('POST /api/characters - create a character', async () => {
    const res = await request(app)
      .post('/api/characters')
      .send({ name: 'Luna', friendshipLevel: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Luna');
    characterId = res.body._id;
  });

  test('POST /api/characters - fails without name', async () => {
    const res = await request(app)
      .post('/api/characters')
      .send({ friendshipLevel: 2 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('POST /api/characters - fails with negative friendshipLevel', async () => {
    const res = await request(app)
      .post('/api/characters')
      .send({ name: 'Luna', friendshipLevel: -1 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('GET /api/characters - get all characters', async () => {
    const res = await request(app).get('/api/characters');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/characters/:id - get character by ID', async () => {
    const res = await request(app).get(`/api/characters/${characterId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(characterId);
  });

  test('GET /api/characters/:id - 404 if not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/characters/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/characters/:id - update a character', async () => {
    const res = await request(app)
      .put(`/api/characters/${characterId}`)
      .send({ friendshipLevel: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.friendshipLevel).toBe(5);
  });

  test('PUT /api/characters/:id - fails with negative friendshipLevel', async () => {
    const res = await request(app)
      .put(`/api/characters/${characterId}`)
      .send({ friendshipLevel: -3 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('DELETE /api/characters/:id - delete a character', async () => {
    const res = await request(app).delete(`/api/characters/${characterId}`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /api/characters/:id - 404 after deletion', async () => {
    const res = await request(app).get(`/api/characters/${characterId}`);
    expect(res.statusCode).toBe(404);
  });

});