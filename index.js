const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const Table = require('cli-table');

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

const updateEmployee = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the employee?',
    },
    {
        type: 'input',
        name: 'newRole',
        message: 'What is the new role of the employee?',
    },
];

// Function that displays the welcome screen
function init() {
    console.log(
        `         ----------------------------------------------------------------
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
}

// Function that runs the menu options
function menu() {
    inquirer
        .prompt(options)
        .then(selection => {
            // View All Employees option
            let employees = [];
            let employeeName;
            let managerName;
            if (selection.menu === 'View All Employees') {
                db.query(
                    `SELECT first_name, last_name, id FROM employee;`,
                    function(err, results) {
                        if (err) {
                            console.log(err);
                        }
                        for (let i = 0; i < results.length; i++) {
                            employeeName = `${results[i].first_name} ${results[i].last_name}`;
                            employees.push(employeeName);
                        }
                        db.query(
                            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id;',
                            function (err, results) {
                                if (err) {
                                    console.log(err);
                                }
                                const table = new Table({
                                    head: ['ID', 'FIRST NAME', 'LAST NAME', 'TITLE', 'DEPARTMENT', 'SALARY', 'MANAGER'],
                                    colWidths: [4, 30, 30, 30, 30, 8, 30]
                                });
                                for (let i = 0; i < results.length; i++) {
                                    if (results[i].manager_id !== null){
                                    managerName = employees[results[i].manager_id - 1];
                                    } else {
                                        managerName = null;
                                    }
                                    table.push(
                                        [`${results[i].id}`, `${results[i].first_name}`, `${results[i].last_name}`, `${results[i].title}`, `${results[i].department_name}`, `${results[i].salary}`, `${managerName}`]
                                    );
                                }
                                console.log(table.toString());
                                menu();
                            }
                        )
                    }
                )
            // Add Employee option
            } else if (selection.menu === 'Add Employee') {
                let roleID;
                let managerID;
                let managerName = [];
                inquirer
                    .prompt(addEmployee)
                    .then(newEmployee => {
                        managerName = newEmployee.manager.split(' ');
                        db.query(
                            `SELECT id FROM role WHERE title='${newEmployee.role}';`,
                            function (err, results) {
                                if (err) {
                                    console.log(err);
                                }
                                roleID = results[0].id;
                                db.query(
                                    `SELECT id FROM employee WHERE first_name='${managerName[0]}' AND last_name='${managerName[1]}';`,
                                    function (err, results) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        managerID = results[0].id;
                                        db.query(
                                            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${newEmployee.first_name}', '${newEmployee.last_name}', '${roleID}', '${managerID}');`,
                                            function (err, results) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                console.log(`\n${newEmployee.first_name} ${newEmployee.last_name} added to list of employees!\n`);
                                                menu();
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    })
            // View All Roles option
            } else if (selection.menu === 'View All Roles') {
                db.query(
                    'SELECT role.id, role.title, department.department_name, role.salary FROM role INNER JOIN department ON role.department_id=department.id;',
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        const table = new Table({
                            head: ['ID', 'TITLE', 'DEPARTMENT', 'SALARY'],
                            colWidths: [4, 30, 30, 8]
                        });
                        for (let i = 0; i < results.length; i++) {
                            table.push(
                                [`${results[i].id}`, `${results[i].title}`, `${results[i].department_name}`, `${results[i].salary}`]
                            );
                        }
                        console.log(table.toString());
                        menu();
                    }
                )
            // Update Employee Role option
            } else if (selection.menu === 'Update Employee Role') {
                let employeeName = [];
                let roleID;
                inquirer
                    .prompt(updateEmployee)
                    .then(updatedEmployee => {
                        employeeName = updatedEmployee.name.split(' ');
                        db.query(
                            `SELECT id FROM role WHERE title='${updatedEmployee.newRole}';`,
                            function (err, results) {
                                if (err) {
                                    console.log(err);
                                }
                                roleID = results[0].id;
                                db.query(
                                    `UPDATE employee SET role_id=${roleID} WHERE first_name='${employeeName[0]}' AND last_name='${employeeName[1]}';`,
                                    function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log('\nEmployee role updated successfully!\n');
                                        menu();
                                    }
                                )
                            }
                        )
                    })
            // Add Role option
            } else if (selection.menu === 'Add Role') {
                let department;
                inquirer
                    .prompt(addRole)
                    .then(newRole => {
                        db.query(
                            `SELECT id FROM department WHERE department_name='${newRole.department}';`,
                            function (err, results) {
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
                                        console.log(`\n${newRole.role} role added!\n`);
                                        menu();
                                    }
                                )
                            }
                        )
                    })
            // View All Departments option
            } else if (selection.menu === 'View All Departments') {
                db.query(
                    'SELECT * FROM department;',
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        const table = new Table({
                            head: ['ID', 'DEPARTMENT'],
                            colWidths: [4, 30]
                        });
                        for (let i = 0; i < results.length; i++) {
                            table.push(
                                [`${results[i].id}`, `${results[i].department_name}`]
                            );
                        }
                        console.log(table.toString());
                        menu();
                    }
                )
            // Add Department option
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
                                console.log(`\n${newDepartment.department} department added!\n`);
                                menu();
                            }
                        )
                    })
            // Quit option
            } else if (selection.menu === 'Quit') {
                console.log(`Good Bye!`);
                return;
            }
        })
};

init();
menu();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});  