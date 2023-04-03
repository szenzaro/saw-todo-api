import { v4 } from "uuid";

export interface TodoRequest {
    state: 'done' | 'ongoing';
    text: string;
}

export type Todo = { id: string; } & TodoRequest;

export class DB {
    todos = new Map<string, Todo>();

    constructor(...ts: Todo[]) {
        ts.forEach((t) => this.todos.set(t.id, t));
    }

    addTodo(t: TodoRequest): Todo {
        const todo: Todo = {
            id: v4(),
            ...t,
        }

        this.todos.set(todo.id, todo);
        return todo;
    }

    getAll(state: string | undefined): Todo[] {
        return [...this.todos.values()].filter((t) => !state || t.state === state);
    }
}