import express from 'express';
import { DB, Todo, TodoRequest } from './db.js';
import { Request } from 'express';
import { Response } from 'express';
import cors from 'cors';

const app = express();
const port = "1234";
const db = new DB(
    { id: '1', text: 'git add .', state: 'done' },
    { id: '2', text: 'git commit', state: 'done' },
    { id: '3', text: 'git push', state: 'ongoing' },
    { id: '4', text: 'escape building', state: 'ongoing' },
);

app.use(express.json());
app.use(cors());

app.get('/api/v1/todos', (req, res) => {
    const state = req.query.state as string | undefined;
    const data = db.getAll(state);

    res.status(200).send({
        links: {
            self: "/api/v1/todos"
        },
        metadata: {
            timestamp: new Date().toJSON(),
            count: data.length,
        },
        data,
    });
})

app.post('/api/v1/todos', (req, res) => {
    const tr: TodoRequest = req.body;
    const todo = db.addTodo(tr);

    res.status(201).send(todo);
});

app.get('/api/v1/todos/:id', (req, res) => {
    const data = db.getTodo(req.params.id);
    if (data === undefined) {
        res.status(404).end();
        return;
    }

    res.status(200).send({
        links: { self: `api/v1/todos/${data.id}` },
        data,
    })
});

app.put('/api/v1/todos/:id', (req: Request, res: Response) => {
    updateTodo(req, res);
});

app.patch('/api/v1/todos/:id', (req, res) => {
    updateTodo(req, res);
});

app.delete('/api/v1/todos/:id', (req, res) => {
    const deleted = db.delete(req.params.id);
    if (!deleted) {
        res.status(404).end();
        return;
    }
    res.status(204).end();
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

const updateTodo = (req: Request, res: Response) => {
    const { id, ...todoRequest }: Todo = req.body;
    const data = db.updateTodo(req.params.id, { ...todoRequest });
    if (data === undefined) {
        res.status(404).end();
        return;
    }
    res.status(200).send({
        links: { self: `api/v1/todos/${data.id}` },
        data,
    })
}