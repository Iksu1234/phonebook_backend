require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('post', (res) => JSON.stringify(res.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

/*
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
]*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
  response.json(result)
})
})

app.get('/info', (request, response) => {
    var length = persons.length
    var date = new Date()
    date[Symbol.toPrimitive]("string");
    response.send(`Phonebook has info for ${length} people <br><br>${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  
  if (request.params.id.length < 24) {
    response.status(400).end()
    return
  }

  Person.findById(request.params.id).then(person => {
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
  .catch(error => {
    console.log(error)
    response.status(500).end()
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
/*
const generateId = () => {
    const id = Math.floor(Math.random() * 9000);
    return id
}

const checkName = (name) => {
        let result = false
        persons.forEach(person => {
        if (person.name.toLowerCase() == name.toLowerCase()){
            result = true
            return
        }
    });
    return result
}

const checkNumber = (number) => {
    let result = false
    persons.forEach(person => {
        if (person.number == number){
            result = true
            return
        }
    });
    return result
}*/

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name and / or number is missing' 
    })
  }
/*
  if (checkName(body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  if (checkNumber(body.number)) {
    return response.status(400).json({ 
      error: 'number must be unique' 
    })
  }*/
  
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})