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

const addDepartment = [
    {
        type: 'input',
        name: 'department',
        message: 'What is the department name?',
    }
];

const addRole = [
    {
        type: 'input',
        name: 'role',
        message: 'What is the name of the role?',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
    },
    {
        type: 'input',
        name: 'department',
        message: 'What is the department of the role?',
    },
];

const addEmployee = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the first name of the employee?',
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the last name of the employee?',
    },
    {
        type: 'input',
        name: 'role',
        message: 'What is the role of the employee?',
    },
    {
        type: 'input',
        name: 'manager',
        message: 'Who is the manager of the employee?',
    },
];

// Function that runs the menu options
function init() {
    console.log(
`----------------------------------------------------------------
|                                                               |
|   EEEEEE M    M PPPPP   L      OOOOOO Y     Y EEEEEE EEEEEE   |
|   E      MM  MM P    P  L      O    O  Y   Y  E      E        |
|   EEEEEE M MM M PPPPP   L      O    O   YYY   EEEEEE EEEEEE   |
|   E      M    M P       L      O    O    Y    E      E        |
|   EEEEEE M    M P       LLLLLL OOOOOO    Y    EEEEEE EEEEEE   |
|                                                               |
|        M    M AAAAAA N   N AAAAAA GGGGGG EEEEEE RRRRR         |
|        MM  MM A    A NN  N A    A G      E      R    R        |
|        M MM M AAAAAA N N N AAAAAA G  GGG EEEEEE RRRRR         |
|        M    M A    A N  NN A    A G    G E      R  R          |
|        M    M A    A N   N A    A GGGGGG EEEEEE R   R         |
|                                                               |
-----------------------------------------------------------------`   
    );
    inquirer
        .prompt(options)
        .then(selection => {
            if (selection.menu === 'View All Employees') {
                db.query(
                    'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id;',
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        console.log('ID\tFIRST NAME\tLAST NAME\tTITLE\tDEPARTMENT\tSALARY');
                        console.log('--\t----------\t----------\t---------------\t------------\t------');
                        for (let i = 0; i < results.length; i++) {
                            console.log(`${results[i].id}\t${results[i].first_name}\t${results[i].last_name}\t${results[i].title}\t${results[i].department_name}\t${results[i].salary}`);
                        }
                    }
                )
                init();
            } else if (selection.menu === 'Add Employee') {
                inquirer
                    .prompt(addEmployee)
                    .then(newEmployee => {
                        db.query(
                            `SELECT `
                        );
                        db.query(
                            `INSERT INTO employee (first_name, last_name) VALUES ('${newDepartment.department}');`,
                            function (err, results) {
                                if (err) {
                                    console.log(err);
                                }
                                console.log(`${results.department} department added!`);
                            }
                        )
                    })
                    .then(() => {
                        init();
                    })
            } else if (selection.menu === 'View All Roles') {
                db.query(
                    'SELECT role.id, role.title, department.department_name, role.salary FROM role INNER JOIN department ON role.department_id=department.id;',
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        console.log('ID\tTITLE\t\tDEPARTMENT\tSALARY');
                        console.log('--\t------------------------------\t------------\t------');
                        for (let i = 0; i < results.length; i++) {
                            console.log(`${results[i].id}\t${results[i].title}\t${results[i].department_name}\t${results[i].salary}`);
                        }
                    }
                )
                init();
            } else if (selection.menu === 'Update Employee Role') {
                console.log(`${selection.menu}`);
            } else if (selection.menu === 'Add Role') {
                let department;
                inquirer
                    .prompt(addRole)
                    .then(newRole => {
                        db.query(
                            `SELECT id FROM department WHERE department_name='${newRole.department}';`,
                            function (err, results) {
                                console.log(results);
                                if (err) {
                                    console.log(err);
                                }
                                department = results[0].id;
                                db.query(
                                    `INSERT INTO role (title, salary, department_id) VALUES ('${newRole.role}', '${newRole.salary}', ${department});`,
                                    function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(`${newRole.role} role added!`);
                                    }
                                )
                            }
                        )
                    })
                    .then(() => {
                        init();
                    })
            } else if (selection.menu === 'View All Departments') {
                db.query(
                    'SELECT * FROM department;',
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        console.log('\nID   NAME');
                        console.log('--   ------------');
                        for (let i = 0; i < results.length; i++) {
                            console.log(`${results[i].id}    ${results[i].department_name}`);
                        }
                    }
                )
                init();
            } else if (selection.menu === 'Add Department') {
                inquirer
                    .prompt(addDepartment)
                    .then(newDepartment => {
                        db.query(
                            `INSERT INTO department (department_name) VALUES ('${newDepartment.department}');`,
                            function (err, results) {
                                if (err) {
                                    console.log(err);
                                }
                                console.log(`${results.department} department added!`);
                            }
                        )
                    })
                    .then(() => {
                        init();
                    })
            } else if (selection.menu === 'Quit') {
                console.log(`${selection.menu}`);
                return;
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