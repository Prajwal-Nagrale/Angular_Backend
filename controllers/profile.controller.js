const {Profile}=require('../models');

  const getByCustID = async (req, res) => {
    console.log(req.params);
    const { email } = req.params;
  
    let status;
    let message;
  
    try {
      const user = await Profile.find({ email:email });
      status = 200;
      message =user;
  
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message });
  }

  const updateFriends=async(req,res)=>{
    const { email} = req.params;
    console.log("updating "+req.params)
    let status;
    let message;
    const friendEmail=req.body.friendEmail;
    const friendstatus=req.body.friendstatus;
    try {
      await Profile.findOneAndUpdate({ email:email},{
        $addToSet:{
          members:{
            friendEmail,friendstatus,
          }
        }
      });
      
      status = 200;
      message = "Added Friend in  "+email;
  
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message });
  }

  const updateById=async(req,res)=>{
    const { email} = req.params;
    console.log("updating "+req.params)
    let status;
    let message;
    const userName=req.body.userName;
    console.log(userName);
    const city=req.body.city;
    console.log(city);
    const state=req.body.state;
    console.log(state);
    const gender=req.body.gender;
    console.log(gender);
    const profession=req.body.profession;
    console.log(profession);
    const img=req.body.img;
    console.log(img);
    try {
      const profile = await Profile.findOne({ email:email});
      if(userName)
      profile.userName=userName;
      if(city)
      profile.city=city;
      if(state)
      profile.state=state;
      if(img)
      profile.img=img;
      if(gender)
      profile.gender=gender;
      if(profession)
      profile.profession=profession;
      await profile.save();
      status = 200;
      message = "Updated profile data of Id "+email;
  
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message });
  }

const getAllUser = async (req, res) => {
    let status;
    let message;
    try {
      
      message = await Profile.find();
      status = 200;
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request'
    }
    res.status(status).send({ message: message.map((user) => ({
      userName: user.userName,
      email: user.email,
      city:user.city,
      state:user.state,
      gender:user.gender,
      profession:user.profession,
      img:user.img,
    })) });
  }


  module.exports ={
      getByCustID,
      updateById,
      getAllUser,
      updateFriends
  }