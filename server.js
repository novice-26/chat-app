const { ApolloServer, gql } = require('apollo-server');
const resolvers=require("./graphql/resolvers")
const typeDefs=require("./graphql/typedefs");
const {sequelize}=require("./models")
const contextMiddleware = require("./utils/contextMiddleware")


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize.authenticate().then(()=>{
    console.log(`Database connected`);
  })
  .catch(err=>console.log(`Error while connecting`,err))
});