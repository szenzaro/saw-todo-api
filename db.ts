import { v4 } from "uuid";

export interface TodoRequest {
    state: 'done' | 'ongoing';
    text: string;
}

export type Todo = { id: string; } & TodoRequest;

export class DB {
    private todos = new Map<string, Todo>();

    constructor(...ts: Todo[]) {
        ts.forEach((t) => this.todos.set(t.id, t));
    }

    getTodo(id: string) : Todo | undefined {
        const todo = this.todos.get(id);
        return !!todo ? { ...todo } as Todo : undefined;
    }

    delete(id: string) {
        return this.todos.delete(id)
    }

    updateTodo(id: string, td: Partial<TodoRequest>) {
        const todo = this.getTodo(id);
        if (todo === undefined) {
            return undefined;
        }
        this.todos.set(id, { ...todo, ...td} as Todo);
        return this.getTodo(id);
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