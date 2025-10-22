import React, { useEffect } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { LOAD_ITEMS } from "./constants";
import { useReducerWithEffects } from "./reducer";

import "./app.css";

export function App() {
    const [todos, dispatch] = useReducerWithEffects();

    useEffect(() => dispatch({type: LOAD_ITEMS}), []);
    return (
        <>
            <Header dispatch={dispatch} />
            <Main todos={todos} dispatch={dispatch} />
            <Footer todos={todos} dispatch={dispatch} />
        </>
    );
}
