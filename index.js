import express from "express"
import swaggerUi from "swagger-ui-express";
import openapi from "./openapi.json" with { type: "json" };


const app = express()
const port = 3000

app.use(express.json());

const tasks = [
    {
        id: 1,
        title: "Eat",
        done: true
    },
    {
        id: 2,
        title: "Sleep",
        done: true
    },
    {
        id: 3,
        title: "Repeat",
        done: false
    },
]


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
    res.json(tasks)
})

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    res.json(tasks.filter(t => t.id == id))
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
    const id =  Number(req.params.id)
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