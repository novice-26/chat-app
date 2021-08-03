const { ApolloServer, gql } = require('apollo-server');
const resolvers=require("./graphql/resolvers")
const typeDefs=require("./graphql/typedefs")
const {sequelize}=require("./models")

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ctx => ctx
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize.authenticate().then(()=>{
    console.log(`Database connected`);
  })
  .catch(err=>console.log(`Error while connecting`,err))
});