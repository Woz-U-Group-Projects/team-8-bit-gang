var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('../chinook.sqlite', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Yay! You are connected to the database!');
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../public/index', { title: 'Express' });
});

/* Dispaly username from database of current user */
router.get('/:users', (req, res) => {
  displayName = req.params.UserId; //matches ':userId' above

  db.all(
    'SELECT * FROM users WHERE Username=username',
    username = displayName,
    (err, rows) => {
      if(rows.length < 0) {
        res.send('Invalid Username');
      }else{
        document.getElementById("username").value = displayName;
        }
    }
  );
})

module.exports = router;
