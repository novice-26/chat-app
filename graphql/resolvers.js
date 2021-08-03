const {User}=require('../models')
const bcrypt=require('bcryptjs')
const {UserInputError}=require('apollo-server')
module.exports={
    Query: {
      getUsers: async () => {
         try{
          const users=await User.findAll()
          return users
         }catch(err){
          console.log("err in getUsers",err);
          throw err;
         }
      },
    },
    Mutation:{
      register:async(parent,args,context,info)=>{
      const {username,email,password,confirmPassword}=args||{}
      const errors={}
      try{
        //validate input data
        if(email.trim()==="") errors.email="Email must not be empty."
        if(username.trim()==="") errors.username="Username must not be empty."
        if(password.trim()==="") errors.password="Password must not be empty."
        if(confirmPassword.trim()==="") errors.confirmPassword="ConfirmPassword must not be empty."

        if(password !== confirmPassword) errors.confirmPassword="Passwords must match."

        //check if the email or username exists
        // const userExistsByUsername=await User.findOne({where:{username}})
        // const userExistsByEmail = await User.findOne({where:{email}})
        // if(userExistsByUsername) errors.username="Username is already taken."
        // if(userExistsByEmail) errors.email="Email is already registered."

        if(Object.keys(errors).length > 0){
          throw errors;
        }
        // hash password
        const hashedPassword= await bcrypt.hash(password,6)
        //create user
        const user = await User.create({
          username,
          email,
          password:hashedPassword,
        })
        return user;

      }catch(err){
        if(err.name === 'SequelizeUniqueConstraintError'){
          err.errors.forEach(e=>(errors[e.path]= `${e.path} is already taken`))
        }
        else if(err.name === 'SequelizeValidationError'){
          err.errors.forEach(e=>(errors[e.path]=e.message))
        }
        throw new UserInputError('Bad Input',{errors:err});
      }
      }
    }
  };