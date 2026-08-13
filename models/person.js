const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
      .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })



const numberValidator = (number) => {
  let result = false
  //check if number contains only numbers and that it only contains one hyphen at index 2 or 3
  if (/^\d{2,3}-\d+$/.test(number)) {
    result = true
  }

  return result
}

const customValidator = [numberValidator, 'Number can contain only numbers and must contain a hyphen after 2 or 3 numbers.']

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: customValidator,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
/*
const findAll = () => {
console.log("phonebook:")
Person.find({}).then(result => {
  result.forEach(person => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
})
}

const addNew = () => {
person.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})

}

if (process.argv.length < 3) {
    console.log(process.argv.length);
    console.log('give password as argument')
    process.exit(1)
}
else if (process.argv.length == 3)  {
    console.log(process.argv.length);
    console.log("find");
    findAll()
}
else {
    console.log(process.argv.length);
    console.log("add");
    addNew()
}
*/
module.exports = mongoose.model('Person', personSchema)