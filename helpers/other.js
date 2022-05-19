const inquirer = require("inquirer");
const fs = require("fs")

//function that directs user to what they would like to input
const init = () => {
    
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View Department', 'View Role', "View Employees", 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
        }
    ])

    .then((response) => {
        console.log(response)
        const option = response.options
        
        if (option == "View Department") {
            console.log("View Department")
        }else if (option == "View Role") {
            console.log("View Role")
        }else if (option == "View Employees") {
            console.log("View Employees")
        }else if (option == "Add Department") {
            console.log("Add Department")
            newdepartment()
        }else if (option == "Add Role") {
            console.log("Add Role")
        }else if (option == "Add Employee") {
            console.log("Add Employee")
        }else if (option == "Update Employee Role") {
            console.log("Update Employee Role")
        }else {
            console.log("No option chosen")
        }

        
    })

}

init()

//inputting a new department
const newdepartment = () => {

    return inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department?'
        }
    ])
}

// // inputting a new role function
// const newrole = () => {
//     return inquirer.prompt([
//         {
//             type: 'input',
//             name: 'role_name',
//             message: 'What is the name of the role?'
//         },
//         {
//             type: 'input',
//             name: 'salary',
//             message: 'What is the salary of the role?'
//         },
//         {
//             type: 'input',
//             name: 'department',
//             message: 'What department does the role belong to?'

//         }
//     ])

// }

// //inputting a new employee
// const newemployee = () => {
//     return inquirer.prompt([
//         {
//             type: 'input',
//             name: 'first_name',
//             message: `What is the employee's first name?`
//         },
//         {
//             type: 'input',
//             name: 'last_name',
//             message: `What is the employee's last name?`
//         },
//         {
//             type: 'input',
//             name: 'role',
//             message: `What is the employee's role?`
//         },
//         {
//             type: 'input',
//             name: 'manager',
//             message: `Who is the employee's manager?`
//         },

//     ])
// }

// //update employee role
// const updaterole = () => {
    
//     return inquirer.prompt([
//         {
//             type: 'list',
//             name: 'role',
//             message: 'What is the name of the new role?',
//             choices: []
//         }
//     ])
// }