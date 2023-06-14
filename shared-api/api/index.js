require('dotenv').config({
    path: __dirname + '/.env'
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const { getNotesCount, saveNote, searchNotes, getNoteBody, deleteNote } = require('./methods/notes');
const { saveTabs } = require('./methods/tabs');
const { saveDrawing, searchDrawing, getDrawing } = require('./methods/drawings');

// CORs
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json()); // can set limit

// routes
app.get('/get-notes-count', getNotesCount);
app.post('/save-note', saveNote);
app.post('/search-notes', searchNotes);
app.post('/get-note-body', getNoteBody);
app.post('/delete-note', deleteNote);
app.post('/save-tabs', saveTabs);
app.post('/save-drawing', saveDrawing);
app.post('/search-drawing', searchDrawing);
app.post('/get-drawing', getDrawing);

app.listen(port, () => {
    console.log(`App running... on port ${port}`);
});
