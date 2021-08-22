const messageResolver=require("./messages");
const userResolver = require("./users");

module.exports={
    Message:{
     createdAt: (parent) => parent.createdAt.toISOString()
    },
    Query:{
        ...userResolver.Query,...messageResolver.Query
    },
    Mutation:{
        ...userResolver.Mutation,...messageResolver.Mutation
    }
}