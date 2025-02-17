const Employee = require('../models/employee');
const User = require('../models/user'); 

const resolvers = {
  Query: {
    getAllEmployees: async () => {
      return await Employee.find();
    },
    getEmployeeByEid: async (_, { eid }) => {
      return await Employee.findById(eid);
    },
    getEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      return await Employee.find({
        $or: [{ designation: designation }, { department: department }],
      });
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (user && user.password === password) {  
        return 'JWT_Token_Here'; 
        
      }
      throw new Error('Invalid credentials');
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const newUser = new User({ username, email, password });
      await newUser.save();
      return newUser;
    },
    addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department }) => {
      const newEmployee = new Employee({
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
      });
      await newEmployee.save();
      return newEmployee;
    },
    updateEmployee: async (_, { eid, first_name, last_name, email, gender, designation, salary, department }) => {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        eid,
        { first_name, last_name, email, gender, designation, salary, department },
        { new: true }
      );
      return updatedEmployee;
    },
    deleteEmployee: async (_, { eid }) => {
      const deletedEmployee = await Employee.findByIdAndDelete(eid);
      return deletedEmployee;
    },
  },
};

module.exports = resolvers;
