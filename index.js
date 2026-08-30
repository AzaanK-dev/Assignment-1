import express from "express"
import sqlite3 from "sqlite3"
import swaggerUi from "swagger-ui-express";
import openapi from "./openapi.json" with { type: "json" };


const app = express()
app.use(express.json());
const port = 3000

const db = new sqlite3.Database("./tasks.db", (err) => {
    if (err) console.error("Error while db connection", err);
    else console.log("Connected to database");
})

db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done BOOLEAN DEFAULT 0
    )    
`)

db.get(`SELECT COUNT(*) AS count FROM tasks`, (err, row) => {
    if(err) return console.error(err.message);

    if (row.count === 0) {
        db.run(`
            INSERT INTO tasks(title, done)
            VALUES 
                ('Eat',0),
                ('Sleep',0),
                ('Gym',1)
        `)
    }
})



// const tasks = [
//     {
//         id: 1,
//         title: "Eat",
//         done: true
//     },
//     {
//         id: 2,
//         title: "Sleep",
//         done: true
//     },
//     {
//         id: 3,
//         title: "Repeat",
//         done: false
//     },
// ]


// Stage 1

app.get('/', (req, res) => {
    res.json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
    })
})

app.get('/health', (req, res) => {
    res.json({ "status": "ok" })
})


// Stage 2
app.get('/tasks', (req, res) => {
    // res.json(tasks)
    // Stage 1 (A2)
    const sqlTasks = "SELECT * FROM tasks"
    db.all(sqlTasks, [], (err,rows)=>{
        if(err)  return res.status(500).json({error: "Failed to get tasks"});
        return res.status(200).json(rows);
    })
})

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    // res.json(tasks.filter(t => t.id == id))

    db.get("SELECT * FROM tasks WHERE id = ?",[id],(err,task)=>{
        if(err)  return res.status(500).json({error: "Failed to get task by id"});

        if (!task) return res.status(404).json({ message: 'Task not found' });
        return res.status(200).json(task)
    })
})

// Stage 3
app.post('/tasks', (req, res) => {
    const task = req.body
    if (!task.title) {
        return res.status(400).json({ message: "Title is missing!" })
    }
    const newTask = {
        id: tasks.length + 1,
        title: task.title,
        done: false
    }
    tasks.push(newTask)
    return res.status(201).json({ message: "Done, here is your receipt" })
})

// Stage 4
app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = tasks.findIndex(t => t.id == id)
    if (index === -1) {
        return res.status(404).json({ message: "ID is Unknown!" });
    }

    const { title, done } = req.body
    if (!title && !done) {
        return res.status(400).json({ message: "Empty body" })
    }
    const updatedTask = {
        id,
        title,
        done
    }

    tasks[index] = updatedTask
    return res.status(200).json({ message: "Task Updated" })
})

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = tasks.findIndex(t => t.id == id)
    if (index === -1) {
        return res.status(404).json({ message: "ID is Unknown!" });
    }
    tasks.splice(index, 1)    // splice(index,delete,add)
    return res.status(200).json({ message: "Task Deleted" })
})

// Stage 5
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})