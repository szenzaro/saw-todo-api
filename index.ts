import express from 'express';
import { DB, TodoRequest } from './db.js';

const app = express();
const port = "1234";
const db = new DB(
    { id: '1', text: 'git add .', state: 'done' },
    { id: '2', text: 'git commit', state: 'done' },
    { id: '3', text: 'git push', state: 'ongoing' },
    { id: '4', text: 'escape building', state: 'ongoing' },
);

app.use(express.json());


app.get('/api/v1/todos', (req, res) => {
    const state = req.query.state as string | undefined;
    const data = db.getAll(state);

    res.status(200).send({
        links: {
            self: "/todos"
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

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})