// const API_ENDPOINT = 'http://localhost:3000';
const API_ENDPOINT = 'http://10.0.2.2:3000';
const defaultHeaders = {
  "Content-Type": "application/json",
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export function fetchTodos(): Promise<Todo[]> {
  return fetch(`${API_ENDPOINT}/todos`)
    .then(r => r.json())
    .catch(e => {
      console.log({
        message: 'Failed to fetch todos',
        error: e
      });
      return [];
    });
}

export function addTodo(todo: Todo) {
  return fetch(`${API_ENDPOINT}/todos`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(todo),
  })
    .catch(e => {
      console.log({
        message: 'Failed to add todo with id ' + todo.id,
        error: e
      });
    });
}

export function updateTodo(todo: Todo) {
  return fetch(`${API_ENDPOINT}/todos/${todo.id}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify(todo),
  })
    .catch(e => {
      console.log({
        message: 'Failed to update todo with id ' + todo.id,
        error: e
      });
    });
}

export function deleteTodo(todo: Todo) {
  return fetch(`${API_ENDPOINT}/todos/${todo.id}`, {
    method: 'DELETE',
  })
    .catch(e => {
      console.log({
        message: 'Failed to delete todo with id ' + todo.id,
        error: e
      });
    });
}