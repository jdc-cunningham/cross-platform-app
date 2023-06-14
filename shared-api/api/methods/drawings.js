// html5 canvas drawing

require('dotenv').config();
const { pool } = require('./../utils/dbConnect');
const { getDateTime, formatTimeStr } = require('./../utils/time');

const saveDrawing = (req, res) => {
  const { topics, drawing } = req.body;

  if (
    !Object.keys(req.body).length
  ) {
    res.status(400).send('please make sure all fields are filled in');
  }

  const now = formatTimeStr(getDateTime());

  // since there isn't a search to update, created_at/updated_at is kind of redundant
  pool.query(
    `INSERT INTO canvas_drawings SET topics = ?, drawing = ?, date_added = ?`,
    [name, topics, drawing, now],
    (err, qres) => {
      if (err) {
        console.log('failed to save drawing', err);
        res.status(400).send('failed to save drawing');
      } else {
        res.status(200).send(`drawing saved`); // don't check if it was actually made
      }
    }
  );
}

const searchDrawing = (req, res) => {
  const { name, topic } = req.body;

  if (
    !Object.keys(req.body).length
  ) {
    res.status(400).send('please make sure all fields are filled in');
  }

  pool.query(
    `SELECT drawing FROM canvas_drawings WHERE ? LIKE %name% OR ? in topics`,
    [name, topic],
    (err, qres) => {
      if (err) {
        console.log('failed to search drawing', err);
        res.status(400).send('failed to searc drawing');
      } else {
        res.status(200).send({drawings: qres}); // don't check if it was actually made
      }
    }
  );
}

module.exports = {
  saveDrawing,
  searchDrawing,
  getDrawing
}
