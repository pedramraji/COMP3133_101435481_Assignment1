const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP
const mongoose = require('mongoose');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();

app.use('/graphql', expressGraphQL({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

mongoose.connect('mongodb+srv://pedramraji:1Hyom38guD9JEDXy@cluster0.dxzep.mongodb.net/comp3133_101435481_assigment1?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.log('MongoDB connection error', err);
  });

app.listen(4000, () => {
  console.log('Server running at http://localhost:4000/graphql');
});
