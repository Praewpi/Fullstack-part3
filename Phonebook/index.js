require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person') //Importing the module from person.js

//function that is used to create an express application stored in the app variable
const app = express()
app.use(express.json()) //express json-parser 
app.use(cors())
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

let persons= [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//morgan
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))


// show list of people in json
app.get('/api/persons', (request, response) => {
   // response.json(persons)
   Person.find({}).then(persons => {
    console.log(persons)
    response.json(persons)
   })
  })
// test
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
// info page, use response.end() so, no further data can be sent in the response.
app.get('/info', (request, response) => {
    const info = `Phonebook has info for ${persons.length} people \n\n${Date()}`
    response.end(`${info}`)
  })

// displaying the information for a single phonebook entry. 
app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const person = persons.find(note => note.id === id)

    // // if no person found the server  respond with the status code 404.
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id).then(note => {
      response.json(note)
    })
  })

//delete
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
  })

//add
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!(body.name && body.number)) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }

    const names = persons.map(person => person.name)
    if (names.includes(body.name)) {
    return response.status(400).json({ 
        error: 'name must be unique' 
    })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 1000)
    })

    person.save().then(savedPerson => {
    console.log(person)
    response.json(savedPerson)
    })
  })

const PORT = process.env.PORT || '3001'
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})