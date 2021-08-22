const { User, Message } = require("../../models");
const { Op } =require("sequelize");
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    getMessages: async (parent, { from}, { user }, info) => {
      try {

        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }
          const otherUser = await User.findOne({
            where:{username:from}
          });
          
          if(!otherUser) throw new UserInputError('user not found');

          const usernames=[user.username,otherUser.username];
          const messages = await Message.findAll({where:{
            from:{ [Op.in]:usernames},
            to:{ [Op.in]:usernames},
          },
          order:[['createdAt','DESC']],
        });


        return messages;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }, info) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }
        const recipient = await User.findOne({ where: { username: to } });

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient.username === user.username) {
          throw new UserInputError(
            "How self obsessed are you..u cant message yourself"
          );
        }
        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });
        return message;
      } catch (err) {
        throw err;
      }
    },
  },
};
