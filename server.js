const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminBooks = require('./adminBooks'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'your_database_name'
});
db.connect(err => { if(err) throw err; console.log('DB connected!') });


app.use('/admin', adminBooks(db));

app.listen(3000, () => console.log('Server running on port 3000'));
