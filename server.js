const express = require('express');
const db = require('../../../db/db.json');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'))
})

app.listen(PORT, () => {
    console.info(`Note Taker app listening at http://localhost:${PORT}`)
})