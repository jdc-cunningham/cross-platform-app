// browser tabs

require('dotenv').config();
const { pool } = require('./../utils/dbConnect');
const { getDateTime, formatTimeStr } = require('./../utils/time');

const saveTabs = (req, res) => {
  const { topics, tabs } = req.body;

  if (
    !Object.keys(req.body).length ||
    typeof tabs === "undefined"
  ) {
    res.status(400).send('please make sure all fields are filled in');
  }

  const now = formatTimeStr(getDateTime());

  // since there isn't a search to update, created_at/updated_at is kind of redundant
  pool.query(
    `INSERT INTO canvas_drawings SET topics = ?, drawing = ?, date_added = ?`,
    [topics, tabs, now],
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

module.exports = {
  saveTabs
}
