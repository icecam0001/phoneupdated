const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
// Create a custom token for logging request body
morgan.token('body', (req) => JSON.stringify(req.body))

// Use morgan with a custom format that includes the body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const generateid = (persons) => {
    const id = persons.length > 0 ? Math.max(... persons.map(p=> Number(p.id))): 0
    return id
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/info', (request, response) => {
    const currentDate = new Date();
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
       <p>${currentDate}</p>`
    );
  })
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id ==id)
    if (person) {
        response.json(person)

    }
    else {
        response.status(404).end()
    }
})
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p=> p.id !== id)
    response.status(204).end()
})
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.number || !body.name) {
        return response.status(400).json({ 
            error: 'content missing' })
    }
    if (persons.find(p => p.name==body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    
    const numbero = body.number
    const nameo = body.name
    const id = String(generateid(persons)+1)
    const personToAdd = {
        number:numbero,
        name:nameo,
        id:id

    }
    
    persons = persons.concat(personToAdd)
    response.json(persons)


})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })