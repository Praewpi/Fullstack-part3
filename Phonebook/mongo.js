const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please give password as argument')
  process.exit(1)
}

else if(process.argv.length > 5){
  console.log('Too many arguments')
  process.exit(1)
}

else if(process.argv.length === 4){
  console.log('Please specify both name and number')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://praewpi_fullstack:${password}@cluster0.7dfxkrl.mongodb.net/?retryWrites=true&w=majority`

// create schema
const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

// create model
const Person = mongoose.model('Person', personSchema)

// add a new phone number, entrie
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    phone: process.argv[4],
  })

  mongoose
    .connect(url)
    .then(result => {
      console.log('connected to db')
      return person.save()
    })
    .then(result => {
      console.log(`added ${result.name} number ${result.phone} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))

  // list all phone numbers
}
else if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(result => {
      console.log('phonebook:')
      Person.find({})
        .then(result => {
          result.forEach(person => {
            console.log(person.name, person.phone)
          })
          return mongoose.connection.close()
        })
    })
    .catch((err) => console.log(err))
}