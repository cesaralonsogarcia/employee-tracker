const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

// Arrays of options for app menu
const options = [
    {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'View All Roles',
            'Update Employee Role',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit',
        ]
    }
];

const addEmployee = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the first name of the employee?'
    }
];

// Function that runs the menu options
function init() {
    inquirer
        .prompt(options)
        .then(selection => {
            if(selection.menu === 'View All Employees') {
                console.log(`${selection.menu}`);
                db.query(
                    'SELECT * FROM employee',
                    function(err, results) {
                        console.log(JSON.stringify(results));
                    }
                )
            } else if (selection.menu === 'Add Employee') {
                console.log(`${selection.menu}`);
            } else if (selection.menu === 'View All Roles') {
                console.log(`${selection.menu}`);
            } else if (selection.menu === 'Update Employee Role') {
                console.log(`${selection.menu}`);
            } else if (selection.menu === 'Add Role') {
                console.log(`${selection.menu}`);
            } else if (selection.menu === 'View All Departments') {
                db.query(
                    'SELECT * FROM department',
                    function(err, results) {
                        console.log('ID   NAME');
                        console.log('--   ------------');
                        for(let i = 0; i < results.length; i++){
                            console.log(`${results[i].id}    ${results[i].department_name}`);
                        }
                    }
                )
            } else if (selection.menu === 'Add Department') {
                console.log(`${selection.menu}`);
            } else if (selection.menu === 'Quit') {
                console.log(`${selection.menu}`);
            }
        })
};

init();

// Get all employees
app.get('/api/employees', (req, res) => {
    const sql = `SELECT * FROM employee`;
    
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });  