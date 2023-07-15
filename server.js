const express = require('express')
const {v4: uuid} = require('uuid')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = 3001


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// identifies index.html as the root url, basically the main page.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log('An error occurred,', err)
        } else {
        console.log(data)
        res.json(JSON.parse(data))
        }
    })
})

app.delete('/api/notes/:id', (req, res) => {
    if (req.params.id) {
      const noteID = req.params.id
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.log('Error occurred,', err)
          res.status(500).json({ error: 'An error occurred while reading the data.' })
        } else {
          const notes = JSON.parse(data)
          // findIndex() searches the index which works with splice(), where as find() does not 
          const note = notes.findIndex(note => note.id === noteID)
          console.log('this is the note:', note)
         // when nothing is found in the find() method, it returns a '-1', hence the code below 
          if (note !== -1) {
            notes.splice(note, 1)
           // writes the file without the deleted note
            fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
              if (err) {
                console.log('Unable to write file', err)
                res.status(500).json({ error: 'An error occurred while writing data' })
              } else {
                console.log('Note deleted successfully')
              // sends 204 which means 'no content', meaning note was deleted successfully
                res.sendStatus(204)
              }
            })
          } else {
            res.status(404).json({ error: 'Note was not found' })
          }
        }
      })
    } else {
      res.status(400).json({ error: 'Note ID missing, check db.json' })
    }
  })
  

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
        console.log('error occurred,', err)
        } else {
        const notes = JSON.parse(data)
        const newNote = {
            title,
            text,
            // gives a random id
            id: uuid()
        }
        notes.push(newNote)
        const updatedNotes = JSON.stringify(notes)
        fs.writeFile('./db/db.json', updatedNotes, (err) => {
            if (err) {
                console.log('Unable to write file', err)
            } else {
                console.log('file saved successfully.')
                res.json(newNote)
            }
        })
    }
    })

})

// sends the user to index.html when anything that isnt handled is put in the url
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(PORT, () => {
    console.info(`Note Taker app listening at http://localhost:${PORT} <3`)
})