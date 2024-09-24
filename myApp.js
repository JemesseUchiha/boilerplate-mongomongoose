// Carica le variabili di ambiente dal file .env
require('dotenv').config();

// Importa Mongoose per connettersi al database MongoDB
const mongoose = require('mongoose');

// Connettiti a MongoDB utilizzando l'URI fornito nelle variabili d'ambiente
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Definizione dello schema per la collezione Person
// Lo schema include: 
// - name (stringa obbligatoria)
// - age (numero)
// - favoriteFoods (array di stringhe)
let personSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number,
  favoriteFoods: [String]
});

// Modello Mongoose basato sullo schema personSchema per interagire con la collezione 'Person'
let Person = mongoose.model("Person", personSchema);

// Funzione per creare e salvare un singolo documento Person nel database
const createAndSavePerson = (done) => {
  // Crea un nuovo documento basato sul modello Person
  const gatto = new Person({
    name: "Gatto Grasso",
    age: 10,
    favoriteFoods: ["Skifo", "Sporko"]
  });

  // Salva il documento nel database e gestisci eventuali errori
  gatto.save(function(err, data) {
    if (err) return console.log(err); // Stampa l'errore se presente
    done(null, data); // Al termine, chiama la callback 'done' con i dati salvati
  });
};

// Funzione per creare e salvare molte persone usando Person.create
const createManyPeople = (arrayOfPeople, done) => {
  // Inserisce più documenti nel database basati su un array di persone
  Person.create(arrayOfPeople, function(err, people) {
    if (err) return console.log(err); // Gestione errori
    done(null, people); // Chiama la callback con i documenti creati
  });
};

// Funzione per trovare persone per nome utilizzando Person.find
const findPeopleByName = (personName, done) => {
  // Cerca i documenti che hanno un campo 'name' corrispondente a 'personName'
  Person.find({ name: personName }, (err, people) => {
    if (err) return console.log(err); // Gestione errori
    done(null, people); // Restituisce i risultati trovati alla callback
  });
};

// Funzione per trovare una persona che ha un determinato cibo preferito
const findOneByFood = (food, done) => {
  // Trova il primo documento che ha 'food' nell'array 'favoriteFoods'
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return console.log(err); // Gestione errori
    done(null, person); // Restituisce il primo risultato trovato alla callback
  });
};

// Funzione per trovare una persona per ID
const findPersonById = (personId, done) => {
  // Trova una persona usando il suo '_id'
  Person.findById({ _id: personId }, (err, person) => {
    if (err) return console.log(err); // Gestione errori
    done(null, person); // Restituisce il documento trovato alla callback
  });
};

// Funzione per trovare una persona per ID, modificare l'array 'favoriteFoods' e salvarla
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger"; // Cibo da aggiungere all'array favoriteFoods

  // Trova una persona per ID
  Person.findById(personId, (err, person) => {
    if (err) return console.log(err); // Gestione errori

    // Aggiungi 'hamburger' all'array favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // Salva il documento aggiornato nel database
    person.save((err, data) => {
      if (err) return console.log(err); // Gestione errori
      done(null, data); // Restituisce il documento aggiornato
    });
  });
};

// Funzione per trovare una persona per nome e aggiornare la sua età
const findAndUpdate = (personName, done) => {
  const ageToSet = 20; // Nuova età da impostare

  // Trova una persona per nome e aggiorna il campo 'age', restituendo il documento aggiornato
  Person.findOneAndUpdate(
    { name: personName }, // Condizione di ricerca
    { age: ageToSet }, // Campo da aggiornare
    { new: true }, // Restituisce il documento aggiornato
    (err, person) => {
      if (err) return console.log(err); // Gestione errori
      done(null, person); // Restituisce il documento aggiornato
    }
  );
};

// Funzione per rimuovere una persona dal database per ID
const removeById = (personId, done) => {
  // Trova una persona per ID e la rimuove dal database
  Person.findByIdAndRemove(personId, (err, person) => {
    if (err) return console.log(err); // Gestione errori
    done(null, person); // Restituisce il documento rimosso
  });
};

// Funzione per rimuovere molte persone con lo stesso nome
const removeManyPeople = (done) => {
  const nameToRemove = "Mary"; // Nome delle persone da rimuovere

  // Rimuove tutte le persone con 'name' uguale a 'Mary'
  Person.remove({ name: nameToRemove }, (err, person) => {
    if (err) return console.log(err); // Gestione errori
    done(null, person); // Restituisce le informazioni sull'operazione di rimozione
  });
};

// Funzione che utilizza una query a catena per trovare persone
// Trova persone che hanno 'burrito' tra i cibi preferiti, le ordina per nome, limita i risultati a 2, ed esclude il campo 'age'
const queryChain = (done) => {
  const foodToSearch = "burrito"; // Cibo da cercare nell'array favoriteFoods

  // Costruisce la query a catena
  Person.find({ favoriteFoods: foodToSearch }) // Trova persone con 'burrito' nei cibi preferiti
    .sort({ name: 1 }) // Ordina per nome in ordine alfabetico
    .limit(2) // Limita i risultati a 2 persone
    .select('-age') // Esclude il campo 'age' dai risultati
    .exec((err, data) => { // Esegue la query e restituisce i risultati
      if (err) return console.log(err); // Gestione errori
      done(null, data); // Restituisce i dati trovati alla callback
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

// Esporta i modelli e le funzioni per l'uso esterno
exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
