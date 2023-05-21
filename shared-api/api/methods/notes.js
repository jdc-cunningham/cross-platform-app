require('dotenv').config();
const { pool } = require('./../utils/dbConnect');
const { getDateTime, formatTimeStr } = require('./../utils/time');

// dual purpose create/update
const saveNote = (req, res) => {
    // get these from post params
    if (
        !Object.keys(req.body).length ||
        typeof req.body.noteName === "undefined" ||
        typeof req.body.noteBody === "undefined"
    ) {
        res.status(400).send('please make sure all fields are filled in');
    }

    const noteId = null; // autoincrementing primary key
    const noteName = req.body.noteName;
    const noteBody = req.body.noteBody;
    const now = formatTimeStr(getDateTime());

    // since there isn't a search to update, created_at/updated_at is kind of redundant
    pool.query(
        `INSERT INTO notes SET id = ?, name = ?, body = ?, created_at = ?, updated_at = ?`,
        [noteId, noteName, noteBody, now, now],
        (err, qres) => {
            if (err) {
                console.log('failed to create note', err);
                res.status(400).send('failed to create note');
            } else {
                res.status(200).send(`note created`); // don't check if it was actually made
            }
        }
    );
}

const getNotesCount = (req, res) => {
    pool.query(
        `SELECT id FROM notes`,
        (err, qres) => { // this is bad res vs. qres
            if (err) {
                console.log('failed to get notes count', err);
                res.status(400).send('request failed');
            } else {
                res.status(200).json({count: qres.length});
            }
        }
    );
}

const searchNotes = (req, res) => {
    // get these from post params
    if (
        !Object.keys(req.body).length ||
        typeof req.body.noteQueryStr === "undefined"
    ) {
        res.status(400).send('search is empty');
    }

    // this should search against the body too if the title is empty
    const partialNoteName = '%' + req.body.noteQueryStr + '%'; // left/right wild card search

    // straightouta SO
    // https://stackoverflow.com/questions/1066453/mysql-group-by-and-order-by
    // this does not work
    pool.query(
        `SELECT MAX(id), id, name FROM notes WHERE name LIKE ? GROUP BY name`,
        [partialNoteName],
        (err, qres) => { // this is bad res vs. qres
            if (err) {
                console.log('failed to search notes', err);
                res.status(400).send('request failed');
            } else {
                res.status(200).json({notes: qres});
            }
        }
    );
}

// I think I'm aware this could be subject to an enumeration attack or something
// like that since it's just an incrementing id
const getNoteBody = (req, res) => {
    // this could be like a middleware or something
    // get these from post params
    if (
        !Object.keys(req.body).length ||
        typeof req.body.noteId === "undefined" ||
        req.body.noteId === 0
    ) {
        res.status(400).send('note id is invalid');
    }

    const noteId = req.body.noteId;

    pool.query(
        `SELECT name, body FROM notes WHERE id = ?`,
        [noteId],
        (err, qres) => { // this is bad res vs. qres
            if (err) {
                console.log('failed to get note body', err);
                res.status(400).send('request failed');
            } else {
                res.status(200).json(qres);
            }
        }
    );
}

const deleteNote = (req, res) => {
    if (
        !Object.keys(req.body).length ||
        typeof req.body.noteName === "undefined"
    ) {
        res.status(400).send('note name is invalid');
    }

    const noteName = req.body.noteName;

    pool.query(
        `DELETE FROM notes WHERE name = ?`,
        [noteName],
        (err, qres) => { // this is bad res vs. qres
            if (err) {
                console.log('failed to delete note', err);
                res.status(400).send('request failed');
            } else {
                res.status(200).json(qres);
            }
        }
    );
}

module.exports = {
    getNotesCount,
    saveNote,
    searchNotes,
    getNoteBody,
    deleteNote
}
