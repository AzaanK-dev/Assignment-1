import express from "express"

const app = express()
const port = 3000

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


app.get('/tasks', (req,res)=>{
    res.json(tasks)
})

app.get('/tasks/:id', (req,res)=>{
    const id = req.params.id
    res.json(tasks.filter(t => t.id==id))
})

app.get('/',(req,res)=>{
    res.json({
        "name": "Task API", 
        "version": "1.0", 
        "endpoints": ["/tasks"]
    })
})

app.get('/health',(req,res)=>{
    res.json({ "status": "ok" })
})

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
})