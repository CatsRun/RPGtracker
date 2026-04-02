const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const taskRouter = require('../routes/tasks');

const app = express();
app.use(express.json());

jest.mock('../middleware/ensureAuth', () => (req, res, next) => next());

app.use('/api/tasks', taskRouter);

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

describe('Tasks API', () => {

  let taskId;

  test('POST /api/tasks - create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', type: 'daily' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
    taskId = res.body._id;
  });

  test('POST /api/tasks - fails without title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ type: 'daily' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('POST /api/tasks - fails without type', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('GET /api/tasks - get all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/tasks/:id - get task by ID', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(taskId);
  });

  test('GET /api/tasks/:id - 404 if not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/tasks/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/tasks/:id - update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ status: 'completed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  test('PUT /api/tasks/:id - fails with invalid status', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ status: 'invalid' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  test('DELETE /api/tasks/:id - delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /api/tasks/:id - 404 after deletion', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(404);
  });

});