const express = require('express');
const fs = require('fs')
const path = require('path')
const app = express();
const PORT = 3001;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log('An error occurred,', err)
        } else {
        console.log(data)
        res.json(JSON.parse(data));
        }
    })
})
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body
    fs.readFile('./db/db.json', 'utf8', err => {
        console.log('error occurred,', err)
    })

})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.listen(PORT, () => {
    console.info(`Note Taker app listening at http://localhost:${PORT} <3`);
})