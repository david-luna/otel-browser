// Usage:
//  node --import @otiny/server index.js
//  curl -i http://127.0.0.1:3000/todos
//  curl -i http://127.0.0.1:3000/todos -X POST -d '{ "task":"my-task","date": 12345}' -H content-type:application/json

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const port = process.env.PORT || '3000';
const todos = [];

function validateString(obj, prop) {
  const val = obj[prop];
  if (typeof val !== 'string') {
    return `Property "${prop}" must be string`;
  } else if (val === '') {
    return `Property "${prop}" must not be empty`;
  }
}

function validateTodo(todo) {
  return [
    validateString(todo, 'id'),
    validateString(todo, 'title'),
  ].filter(e => !!e);
}

// Backend for a basic TodoApp
const app = express();
// Configure with middlewares
app.use(bodyParser.json({strict: true}));
app.use(cors());

// Handle routes
app.get('/todos', (req, res) => {
  res.status(200).send(todos);
  res.end();
});
app.post('/todos', (req, res) => {
  const errs = validateTodo(req.body);
  if (errs.length > 0) {
    res.status(400).send({ code: 400, errors: errs });
    res.end();
    return;
  }

  const { id, title, completed } = req.body;
  if (todos.some(t => t.id === id)) {
    res.status(400).send({ code: 400, errors: [`A todo with the id "${id}" already exists`] });
    res.end();
  }
  todos.push({ id, title, completed: !!completed });
  res.status(200).send({id});
  res.end();
});
app.put('/todos/:todoId', (req, res) => {
  const {todoId} = req.params
  const todo = todos.find(t => t.id === todoId);

  if (!todo) {
    res.status(404).send({ code: 404, error: `Todo with id "${todoId}" not found.` });
    res.end();
    return;
  }

  const errs = validateTodo(req.body);
  if (errs.length > 0) {
    res.status(400).send({ code: 400, errors: errs });
    res.end();
    return;
  }

  const { title, completed } = req.body;
  if (title) {
    todo.title = title;
  }
  if (typeof completed === 'boolean') {
    todo.completed = completed;
  }
  res.status(200).send({});
  res.end();
});
app.delete('/todos/:todoId', (req, res) => {
  const {todoId} = req.params
  const todoIndex = todos.findIndex(t => t.id === todoId);

  if (todoIndex == -1) {
    res.status(404).send({ code: 404, error: `Todo with id "${todoId}" not found.` });
    res.end();
    return;
  }
  
  todos.splice(todoIndex, 1);
  res.status(200).send({});
  res.end();
});

app.listen(port, () => {
  console.log(`TodoApp backend listening on port ${port}`)
});