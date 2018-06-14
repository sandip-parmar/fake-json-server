var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// To close db connection at SIGINT event
let process = require('process');


/* Get new db instance */
let db = new sqlite3.Database('../db/todo.db', (err) => {
  if(err){
    return console.error(err.message);
  }
  console.log('Connected to database');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express JS' });
});

/* Get all todo items */
router.get('/todos', (req, res) => {

	let sql = `SELECT * FROM todo ORDER BY timestamp`;

  db.all(sql, [], (err, rows) => {

    if(err){
      throw err;
    }

    res.send(rows);
	})
	
});

/* Get todo itme by id */
router.get('/todo/:id', (req, res) => {

	let sql = `SELECT * FROM todo WHERE id=${req.params.id}`

	db.all(sql, [], (err, rows) => {
		if(err){
			throw err;
		}

		res.send(rows);
	})
});

/* Create new todo */
router.post('/todo', (req,res) => {
	
	/* Put validations  */
	let ts = Date.now();
	let sql = `INSERT INTO todo (title, user_id, timestamp, last_modified) VALUES ("${req.body.title}",${req.body.user_id}, ${ts}, ${ts})`;

	db.run(sql, [], (err, rows) => {
		if(err){
			throw err;
		}
		res.send(rows);
	})
})

/* Delete todo itme by id */
router.delete('/todo/:id', (req, res) => {

	let sql = `DELETE FROM todo WHERE id=${req.params.id}`;

	db.all(sql, [], (err, rows) => {
		if(err){
			throw err;
		}

		res.send(rows);
	})
});

/* Update todo item by id */
router.put('/todo/:id/:action', (req, res) => {
		
	let sql = `UPDATE todo SET ${req.params.action} = "${req.body.value}", last_modified = ${Date.now()} WHERE id=${req.params.id}`;

	db.run(sql, [], (err, rows) => {
		if(err){
			throw err;
		}

		res.send(rows)
	})
});

/* Close db connection at event */ 
process.on('SIGNINT', () => {
	db.close();
});

module.exports = router;
