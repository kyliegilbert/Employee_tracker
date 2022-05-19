-- displays employee information --
SELECT employee.id, employee.first_name, employee.last_name, role.title, departments.name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM employee
JOIN role
ON employee.role_id = role.id
JOIN departments
ON departments.id = role.department_id 
LEFT JOIN employee AS manager
ON employee.manager_id = manager.id
ORDER BY employee.id;

-- displays role information --
SELECT role.id, role.title, role.salary, departments.name
FROM role
JOIN departments
ON role.department_id = departments.id
ORDER BY role.id;

-- displays department information --


SELECT * FROM employee;

SELECT *
FROM departments

SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS manager_name
FROM employee
WHERE employee.manager_id is NULL;


UPDATE employee
SET role_id = 3
WHERE id = 2;
-- 