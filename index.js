require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('post', (res) => JSON.stringify(res.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
  response.json(result)
})
.catch(error => next(error))
})


app.get('/info', (request, response,next) => {
  Person.find({}).then(result => {
    let length = result.length
    var date = new Date()
    date[Symbol.toPrimitive]("string");
    response.send(`Phonebook has info for ${length} people <br><br>${date}`)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(person => {
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
/*
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

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number || body.name.trim().length === 0 || body.number.trim().length === 0) {
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
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})