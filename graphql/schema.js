const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList } = require('graphql');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Employee = require("../models/employee");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const EmployeeType = new GraphQLObjectType({
  name: "Employee",
  fields: {
    _id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: { type: GraphQLString },
    designation: { type: GraphQLString },
    salary: { type: GraphQLFloat },
    date_of_joining: { type: GraphQLString },
    department: { type: GraphQLString },
  },
});


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
        getAllEmployees: {
          type: new GraphQLList(EmployeeType),
          resolve(parent, args) {
            return Employee.find();
          },
        },

        getEmployeeByEid: {
          type: EmployeeType,
          args: { eid: { type: GraphQLString } },
          resolve(parent, args) {
            return Employee.findById(args.eid); 
          },
        },

    login: {
      type: GraphQLString,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.findOne({ username: args.username })
          .then(user => {
            if (!user) {
              throw new Error("User not found");
            }
            return bcrypt.compare(args.password, user.password).then(isMatch => {
              if (!isMatch) {
                throw new Error("Invalid credentials");
              }

              const token = jwt.sign(
                { userId: user.id, username: user.username },
                "IKUGEFLJBVEFuejv$#3gffcbehcvbekfvqdwrtesnh*U3bj3uyfgw329dekoqKHYVFyhew",
                { expiresIn: "1h" }
              );

              return token; // Return JWT token
            });
          })
          .catch(err => {
            throw new Error(err.message);
          });
      },
    },


getEmployeeByDesignationOrDepartment: {
          type: new GraphQLList(EmployeeType),
          args: {
            designation: { type: GraphQLString },
            department: { type: GraphQLString },
          },
          resolve(parent, args) {
            return Employee.find({
              $or: [
                { designation: args.designation },
                { department: args.department },
              ],
            });
          },
        },

  
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {

signup: {
  type: UserType,
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve(parent, args) {
    const hashedPassword = bcrypt.hashSync(args.password, 10);

    const user = new User({
      username: args.username,
      email: args.email,
      password: hashedPassword,
    });

    return user.save();
  },
},

    addEmployee: {
      type: EmployeeType,
      args: {
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        designation: { type: GraphQLString },
        salary: { type: GraphQLFloat },
        date_of_joining: { type: GraphQLString },
        department: { type: GraphQLString },
      },
      resolve(parent, args) {
        const employee = new Employee({
          first_name: args.first_name,
          last_name: args.last_name,
          email: args.email,
          gender: args.gender,
          designation: args.designation,
          salary: args.salary,
          date_of_joining: args.date_of_joining,
          department: args.department,
        });
        return employee.save();
      },
    },
    updateEmployee: {
      type: EmployeeType,
      args: {
        eid: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        designation: { type: GraphQLString },
        salary: { type: GraphQLFloat },
        department: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Employee.findByIdAndUpdate(args.eid, args, { new: true });
      },
    },
    deleteEmployee: {
      type: EmployeeType,
      args: { eid: { type: GraphQLString } },
      resolve(parent, args) {
        return Employee.findByIdAndDelete(args.eid);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
