const { body } = require("express-validator");

exports.employeeValidator = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("salary").isFloat({ min: 1000 }).withMessage("Salary must be at least 1000"),
];
