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
    `INSERT INTO notes SET topics = ?, tabs = ?, date_added = ?`,
    [topics, tabs, now],
    (err, qres) => {
      if (err) {
        console.log('failed to save tabs', err);
        res.status(400).send('failed to save tabs');
      } else {
        res.status(200).send(`tabs saved`); // don't check if it was actually made
      }
    }
  );
}

module.exports = {
  saveTabs
}
