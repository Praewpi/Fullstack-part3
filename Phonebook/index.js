const express = require('express')
//function that is used to create an express application stored in the app variable
const app = express()

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

// show list of people in json
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

// info page, use response.end() so, no further data can be sent in the response.
app.get('/info', (request, response) => {
    const info = `Phonebook has info for ${persons.length} people \n\n${Date()}`
    response.end(`${info}`)
  })

// displaying the information for a single phonebook entry. 
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)

    // if no person found the server  respond with the status code 404.
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

//delete
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = persons.filter(note => note.id !== id)
  
    response.status(204).end()
  })



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})