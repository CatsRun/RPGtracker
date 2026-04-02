const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const locationRouter = require('../routes/locations');

// Import Character model so populate('npcsPresent') works
require('../models/Character');

const app = express();
app.use(express.json());

jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

app.use('/api/locations', locationRouter);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'ValidationError', message: err.message });
  }
  res.status(500).json({ error: err.message });
});

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

describe('Locations API', () => {

  let locationId;

  test('POST /api/locations - create a location', async () => {
    const res = await request(app)
      .post('/api/locations')
      .send({ name: 'Sunny Farm', type: 'farm' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Sunny Farm');
    locationId = res.body._id;
  });

  test('POST /api/locations - fails without name', async () => {
    const res = await request(app)
      .post('/api/locations')
      .send({ type: 'farm' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('POST /api/locations - fails without type', async () => {
    const res = await request(app)
      .post('/api/locations')
      .send({ name: 'Sunny Farm' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('GET /api/locations - get all locations', async () => {
    const res = await request(app).get('/api/locations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/locations/:id - get location by ID', async () => {
    const res = await request(app).get(`/api/locations/${locationId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(locationId);
  });

  test('GET /api/locations/:id - 404 if not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/locations/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/locations/:id - update a location', async () => {
    const res = await request(app)
      .put(`/api/locations/${locationId}`)
      .send({ resourcesAvailable: ['wood', 'stone'] });
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/locations/:id - delete a location', async () => {
    const res = await request(app).delete(`/api/locations/${locationId}`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /api/locations/:id - 404 after deletion', async () => {
    const res = await request(app).get(`/api/locations/${locationId}`);
    expect(res.statusCode).toBe(404);
  });

});