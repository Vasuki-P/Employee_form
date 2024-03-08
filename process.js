// process.js
const express = require('express');
const mysql = require('mysql');
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'testing',
    user: 'root',
    password: 'root123'
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

connection.connect(function (error) {
    if (error) {
        console.error('MySQL Database connection failed:', error);
    } else {
        console.log('MySQL Database connection successful');
    }
});

let formData1 = {};

app.get('/', function (request, response, next) {
    response.sendFile(path.join(__dirname, 'form1.html'));
});

app.post('/next', function (request, response, next) {
    formData1 = request.body;
    response.sendFile(path.join(__dirname, 'form2.html'));
});

app.post('/process', function (request, response, next) {
    const { employee_name, employee_id, department, dob, gender, designation, salary, address, phone, emergency_contact, email, joining_date } = Object.assign({}, formData1, request.body);

    const query = 'INSERT INTO employees (employee_name, employee_id, department, dob, gender, designation, salary, address, phone, emergency_contact, email, joining_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [employee_name, employee_id, department, dob, gender, designation, salary, address, phone, emergency_contact, email, joining_date];

    connection.query(query, values, function (error, result) {
        if (error) {
            console.error('Error inserting data into database:', error);
            response.status(500).send('Error inserting data into database');
        } else {
            console.log('Data inserted into database');
            response.send('Data inserted into database');
        }
    });
});

app.listen(2000, () => {
    console.log('Server running on port 2000');
});
