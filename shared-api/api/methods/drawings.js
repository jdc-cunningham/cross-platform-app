// html5 canvas drawing

require('dotenv').config();
const { pool } = require('./../utils/dbConnect');
const { getDateTime, formatTimeStr } = require('./../utils/time');

const findDrawing = (drawingName) => {
  return new Promise(resolve => {
    pool.query(
      `SELECT id FROM canvas_drawings WHERE name = ?`,
      [drawingName],
      (err, qres) => {
        if (err) {
          resolve([]);
        } else {
          resolve(qres);
        }
      }
    );
  });
}

const saveDrawing = async (req, res) => {
  const { name, topics, drawing } = req.body;

  if (
    !Object.keys(req.body).length
  ) {
    res.status(400).send('please make sure all fields are filled in');
  }

  const now = formatTimeStr(getDateTime());
  const existingDrawing = await findDrawing(name);

  // since there isn't a search to update, created_at/updated_at is kind of redundant
  if (existingDrawing.length) {
    pool.query(
      `UPDATE canvas_drawings SET topics = ?, drawing = ? WHERE id = ?`,
      [topics, drawing, existingDrawing[0].id],
      (err, qres) => {
        if (err) {
          console.log('failed to save drawing', err);
          res.status(400).send('failed to save drawing');
        } else {
          res.status(200).send(`drawing saved`); // don't check if it was actually made
        }
      }
    );
  } else {
    pool.query(
      `INSERT INTO canvas_drawings SET name = ?, topics = ?, drawing = ?, date_added = ?`,
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
}

const searchDrawing = (req, res) => {
  const { name, topic } = req.body;

  // sending an empty payload returns all

  if (
    !Object.keys(req.body).length
  ) {
    res.status(400).send('please make sure all fields are filled in');
  }

  // dumb
  if (name && !topic) {
    pool.query(
      `SELECT id, name FROM canvas_drawings WHERE name LIKE ?`, // not correct way to search against comma list
      ['%' + name + '%'],
      (err, qres) => {
        if (err) {
          console.log('failed to search drawing', err);
          res.status(400).send('failed to search drawing');
        } else {
          res.status(200).send({drawings: qres}); // don't check if it was actually made
        }
      }
    );
  } else if (!name && topic) {
    pool.query(
      `SELECT id, name FROM canvas_drawings WHERE topics LIKE ?`, // not correct way to search against comma list
      ['%' + topic + '%'],
      (err, qres) => {
        if (err) {
          console.log('failed to search drawing', err);
          res.status(400).send('failed to search drawing');
        } else {
          res.status(200).send({drawings: qres}); // don't check if it was actually made
        }
      }
    );
  } else {
    pool.query(
      `SELECT id, name FROM canvas_drawings WHERE name LIKE ? AND topics LIKE ?`, // not correct way to search against comma list
      ['%' + name + '%', '%' + topic + '%'],
      (err, qres) => {
        if (err) {
          console.log('failed to search drawing', err);
          res.status(400).send('failed to search drawing');
        } else {
          res.status(200).send({drawings: qres}); // don't check if it was actually made
        }
      }
    );
  }
}

const getDrawing = (req, res) => {
  const { id } = req.body;

  if (
    !Object.keys(req.body).length
  ) {
    res.status(400).send('please make sure all fields are filled in');
  }

  pool.query(
    `SELECT drawing FROM canvas_drawings WHERE id = ?`,
    [id],
    (err, qres) => {
      if (err) {
        console.log('failed to get drawing', err);
        res.status(400).send('failed to get drawing');
      } else {
        res.status(200).send(qres); // don't check if it was actually made
      }
    }
  );
}

module.exports = {
  saveDrawing,
  searchDrawing,
  getDrawing
}
