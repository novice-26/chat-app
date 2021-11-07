const { User, Message } = require("../../models");
const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { JWT_SECRET } = require("../../config/env.json");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getUsers: async (parent, args, { user }, info) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        let users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt"],
          where: {
            username: { [Op.ne]: user.username },
          },
        });


        const allUserMessages = await Message.findAll({
          where:{
            [Op.or]:[{from:user.username},{to:user.username}]
          },
          order:[['createdAt','DESC']]
        });

        users = users.map(otherUser => {
          const latestMessage = allUserMessages.find(
            m => m.from === otherUser.username || m.to === otherUser.username
          );

          otherUser.latestMessage = latestMessage;
          return otherUser;
        });


        return users;
      } catch (err) {
        console.log("err in getUsers", err);
        throw err;
      }
    },
    login: async (parent, args, context, info) => {
      try {
        const { username, password } = args || {};
        const errors = {};
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password === "") errors.password = "Password must not be empty";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Bad input", { errors });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("User not found", { errors });
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
          errors.password = "Password is incorrect";
          throw new AuthenticationError("Password is incorrect", { errors });
        }

        const token = jwt.sign(
          {
            username: user.username,
          },
          JWT_SECRET, //can be placed in a environment variable
          { expiresIn: 60 * 60 }
        );

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      const { username, email, password, confirmPassword } = args || {};
      const errors = {};
      try {
        //validate input data
        if (email.trim() === "") errors.email = "Email must not be empty.";
        if (username.trim() === "")
          errors.username = "Username must not be empty.";
        if (password.trim() === "")
          errors.password = "Password must not be empty.";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "ConfirmPassword must not be empty.";

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords must match.";

        //check if the email or username exists
        // const userExistsByUsername=await User.findOne({where:{username}})
        // const userExistsByEmail = await User.findOne({where:{email}})
        // if(userExistsByUsername) errors.username="Username is already taken."
        // if(userExistsByEmail) errors.email="Email is already registered."

        if (Object.keys(errors).length > 0) {
          throw errors;
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 6);
        //create user
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
        });
        return user;
      } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad Input", { errors: err });
      }
    },
  },
};
