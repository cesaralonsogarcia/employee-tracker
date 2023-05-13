INSERT INTO department (department_name)
VALUES ("Executive"),
       ("Accounting"),
       ("Engineering"),
       ("Marketing"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 250000, 1)
       ("Accountant", 80000, 2),
       ("Electrical Engineer", 115000, 3),
       ("Mechanical Engineer", 100000, 3),
       ("Software Engineer", 120000, 3),
       ("Account Manager", 150000, 4),
       ("Public Relations", 75000, 4),
       ("Sales Manager", 90000, 5),
       ("Sales Associate", 55000, 5),
       ("Customer Service", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dua", "Lipa", 1, null),
       ("Georgina", "Perez", 2, 1),
       ("Cesar", "Garcia", 3, 1),
       ("Kayla", "Bennett", 4, 1),
       ("Daniel", "Salaises", 5, 1),
       ("Jacob", "Kearns", 6, 1),
       ("Stephie", "Harvel", 7, 1),
       ("Carlo", "Ramirez", 8, 7),
       ("Taylor", "Swift", 9, 1),
       ("Aimee", "Groves", 10, 9);