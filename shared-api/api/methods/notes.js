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

}

module.exports = {
    getNotesCount,
    saveNote
};