const inquirer = require("inquirer");
const mysql = require('mysql2');

//Connect to database (db is an object because it will create an object)
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',         //include username
    password: '12345678', //include password
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);


//init function which starts the program; asking what user would like to do
const init = async () => {
    
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View Department', 'View Role', "View Employees", 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Exit']
        }
    ])

    .then( async (response) => {
        // based on choice it moves through if statments to perform the task being asked
        const option = response.options
        
        if (option == "View Department") {
            console.log("View Department")
            const sql = 'SELECT * FROM departments'
            const results = await db.promise().query(sql) 
            console.table(results[0]);
            
            
        }else if (option == "View Role") {
            console.log("View Role")
            const sql = `SELECT role.id, role.title, role.salary, departments.name
                    FROM role
                    JOIN departments
                    ON role.department_id = departments.id
                    ORDER BY role.id;`;
            const results = await db.promise().query(sql)
            console.table(results[0]);
            
        }else if (option == "View Employees") {
            console.log("View Employees")
             
            const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, departments.name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
                    FROM employee
                    JOIN role
                    ON employee.role_id = role.id
                    JOIN departments
                    ON departments.id = role.department_id 
                    LEFT JOIN employee AS manager
                    ON employee.manager_id = manager.id
                    ORDER BY employee.id;`;
            const results = await db.promise().query(sql)
            console.table(results[0]);
            
            
        }else if (option == "Add Department") {
            console.log("Add Department");
            await newDepartment();

        }else if (option == "Add Role") {
            console.log("Add Role");
            await newRole();

        }else if (option == "Add Employee") {
            console.log("Add Employee");
            await newEmployee();

        }else if (option == "Update Employee Role") {
            console.log("Update Employee Role")
            await updateRole();

        }else {
            console.log("Exiting")
            process.exit();
            return
        }

        return init()
    })
    
}

//Starts program running
init()

//inputs a new department in departments table
const newDepartment = async () => {

    return inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department?'
        }
    ])
    .then(async(response) => {
        console.log(response);
        const deptName = response.department_name;
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        return await db.promise().query(sql, [deptName])
    })
}

// inputs new role into role table
const newRole = async() => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'role_name',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department does the role belong to?',
            choices: async function(ans){
                
                // query all the dpt
                const result  = await db.promise().query(`SELECT departments.name, departments.id FROM departments;`);
                const departments = result[0];

                // generate the array
                // {name: dept_name, value: dept_id}
                return departments.map((department) => {
                    return {
                        name: department.name,
                        value: department.id,
                    }
                })
            }
        }
    ])
    .then( async(response) => {
        console.log(response);
        const title = response.role_name
        const salary = parseInt(response.salary)
        const department = response.department
        
        //inserts the new role into the role table
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);` 
        return await db.promise().query(sql, [title, salary, department] );
    });
}

//inputs a new employee
const newEmployee = async() => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: `What is the employee's first name?`
        },
        {
            type: 'input',
            name: 'last_name',
            message: `What is the employee's last name?`
        },
        {
            type: 'list',
            name: 'role',
            message: `What is the employee's role?`,
            choices: async function(ans){
                
                // query all the roles from the role table
                const result  = await db.promise().query(`SELECT role.title, role.id
                                                            FROM role;`);

                const roles = result[0];
                // generate the array
                // {name: dept_name, value: dept_id}
                return roles.map((role) => {
                
                    return {
                        name: role.title,
                        value: role.id,
                    }
                })
            }
        },
        {
            type: 'list',
            name: 'manager',
            message: `Who is the employee's manager?`,
            choices: async function(ans){
                
                // query returning the managers names from the list of employees 
                const result  = await db.promise().query(`SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name, employee.id 
                                                            FROM employee
                                                            WHERE employee.manager_id is NULL;`);

                const managers = result[0];

                // generate the array
                return managers.map((manager) => {
                    return {
                        name: manager.name,
                        value: manager.id,
                    }
                })
            }
        },
    ])
    .then(async(response) => {
        //inserts a new employee in to the employee table
        const params = [response.first_name, response.last_name, response.role, response.manager]
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
        return await db.promise().query(sql, params);
    })
}

//update's an employee's role
const updateRole = async () => {
    
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee has changed roles?',
            choices: async function(ans){
                
                // query returning all employees
                const result  = await db.promise().query(`SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name, employee.id 
                                                            FROM employee`);

                const employees = result[0];

                // generate the array employees
                return employees.map((employee) => {
                    return {
                        name: employee.name,
                        value: employee.id,
                    }
                })

            }
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the name of the new role?',
            choices: async function(ans){
                
                // query listing the roles
                const result  = await db.promise().query(`SELECT role.title, role.id FROM role;`);

                const roles = result[0];
                return roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id,
                    }
                })
            }
        }
    ])
    .then(async(response) => {
        //updating the new fole of the employee
        const params = [response.role, response.employee]
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?;`
        return await db.promise().query(sql, params);
    })
}



