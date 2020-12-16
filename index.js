const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Connecting to MongoDB
mongoose.connect(
    'mongodb://127.0.0.1:27017/',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    (err) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log('MongoDB Connected')
    }
)

// Importing model
const todosModel = require('./models/todo')

app.post('/addTodo', (req, res) => {
    var todo = req.body.todo
    new todosModel({ yourTodo: todo }).save().then((createdTodo) => {
        if (createdTodo) {
            console.log('Todo Created')
            res.redirect('/')
        }
    })
})

app.get('/', (req, res) => {
    todosModel.find().then((todos) => {
        if (todos) {
            res.render('index.ejs', { todos: todos })
        }
    })
})

app.post('/deleteTodo', (req,res)=>{
    var todoID = req.body.todoID
    todosModel.findById(todoID).then(todo=>{
        todo.delete().then((deletedTodo)=>{
            if(deletedTodo){
                res.send('Todo Deleted')
            }
        })
    })
})

app.post('/doneTodo', (req,res)=>{
    var todoID = req.body.todoID
    todosModel.findById(todoID).then((todo)=>{
        todo.isDone = true
        todo.save().then(updatedTodo=>{
            if(updatedTodo){
                res.redirect('/')
            }
        })
    })
})

app.listen(3000, () => {
    console.log("Server is listening.")
})
