require('dotenv').config()
const express = require('express')
//function that is used to create an express application stored in the app variable
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person') //Importing the module from person.js

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json()) //express json-parser
app.use(requestLogger)
//let persons = []

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

// info page, use response.end() so, no further data can be sent in the response
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const info = `Phonebook has info for ${persons.length} people \n\n${Date()}`
    response.end(`${info}`)
  })
})

// displaying the information for a single phonebook entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//delete
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//update
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//add
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000)
  })

  person.save()
    .then(savedPerson => {
      console.log(person)
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// those middleware has to be loaded the lastest
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || '3001'
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})