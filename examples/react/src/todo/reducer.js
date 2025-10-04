import { useReducer } from "react";
import { LOAD_ITEMS, LOAD_SUCCESS, ADD_ITEM, UPDATE_ITEM, REMOVE_ITEM, TOGGLE_ITEM, REMOVE_ALL_ITEMS, TOGGLE_ALL, REMOVE_COMPLETED_ITEMS } from "./constants";
import { addTodo, deleteTodo, fetchTodos, updateTodo } from "./service";

/* Borrowed from https://github.com/ai/nanoid/blob/3.0.2/non-secure/index.js

The MIT License (MIT)

Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

// This alphabet uses `A-Za-z0-9_-` symbols.
// The order of characters is optimized for better gzip and brotli compression.
// References to the same file (works both for gzip and brotli):
// `'use`, `andom`, and `rict'`
// References to the brotli default dictionary:
// `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

function nanoid(size = 21) {
    let id = "";
    // A compact alternative for `for (var i = 0; i < step; i++)`.
    let i = size;
    while (i--) {
        // `| 0` is more compact and faster than `Math.floor()`.
        id += urlAlphabet[(Math.random() * 64) | 0];
    }
    return id;
}

let globalDispatch;
function triggerEffect (state, action) {
    // TODO: revert if the service fails?
    switch (action.type) {
        case LOAD_ITEMS:
            return fetchTodos().then((todos) => {
                globalDispatch({type:LOAD_SUCCESS, payload: todos});
            });
        case ADD_ITEM:
            // Last todo is the one added
            return addTodo(state[state.length - 1]);
        case UPDATE_ITEM:
            return updateTodo(action.payload);
        case REMOVE_ITEM:
            return deleteTodo(action.payload);
        case TOGGLE_ITEM:
            return updateTodo(action.payload);
        case REMOVE_ALL_ITEMS:
            return Promise.all(state.map(deleteTodo));
        case TOGGLE_ALL:
            return Promise.all(state
                .filter((todo) => todo.completed !== action.payload.completed)
                .map((todo) => ({...todo, completed: action.payload.completed}))
                .map(deleteTodo)
            );
        case REMOVE_COMPLETED_ITEMS:
            return Promise.all(state.filter((todo) => !todo.completed).map(deleteTodo));
    }
}

function todoReducer (state, action) {
    let futureState;
    switch (action.type) {
        case LOAD_ITEMS:
            futureState = state;
            break;
        case LOAD_SUCCESS:
            futureState = action.payload;
            break;
        case ADD_ITEM:
            futureState = state.concat({ id: nanoid(), title: action.payload.title, completed: false });
            break;
        case UPDATE_ITEM:
            futureState = state.map((todo) => (todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo));
            break;
        case REMOVE_ITEM:
            futureState = state.filter((todo) => todo.id !== action.payload.id);
            break;
        case TOGGLE_ITEM:
            futureState = state.map((todo) => (todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo));
            break;
        case REMOVE_ALL_ITEMS:
            futureState = [];
            break;
        case TOGGLE_ALL:
            futureState = state.map((todo) => (todo.completed !== action.payload.completed ? { ...todo, completed: action.payload.completed } : todo));
            break;
        case REMOVE_COMPLETED_ITEMS:
            futureState = state.filter((todo) => !todo.completed);
            break;
    }

    if (futureState) {
        triggerEffect(futureState, action);
        return futureState;
    }
    throw Error(`Unknown action: ${action.type}`);
};

export const useReducerWithEffects = () => {
    const [todos, dispatch] = useReducer(todoReducer, []);
    globalDispatch = dispatch

    return [todos, dispatch];
}
