const { User } = require('../models');
const {Profile}=require('../models');
const jwt = require('jsonwebtoken');
const {mongoUrl, privateKey} = require('../config');
const NodeRSA=require('node-rsa');
const Forge= require('node-forge');
const {Member} =require('../models/member.model')

//const key=new NodeRSA({b:1024});


let key_private=new NodeRSA(private_key);
let key_public=new NodeRSA(public_key);



const create = async (req, res) => {  
    const { userName,email,password } = req.body;
    console.log('Account of '+userName+' created Successfully')
    let status;
    let message;
    try {
      const user = new User({ 
          userName:userName,
          email:email,
          password:key_public.encrypt(password,'base64')

      });
      await user.save();
      const profile = new Profile({
        userName:userName,
          email:email,
      });
      await profile.save();
      status = 200;
      message = 'Account of '+userName+' created Successfully';
    } catch (err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Email Id Already Exists please use Different one';
    }
  
    res.status(status).send({ message});
  }

  const getByCustID = async (req, res) => {
    console.log(req.params);
    const { email } = req.params;
  
    let status;
    let message;
  
    try {
      const user = await User.find({ email:email });
      status = 200;
      message =user[0].userName;
  
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message,status });
  }
 

const loginFunction= async (req, res) => {
  const { email, password } = req.body;
  const usersInfo = await User.find({email:email});
  console.log("Login done by "+usersInfo[0].userName);
  //console.log(key_private.decrypt(check,'utf8'));
  
if (usersInfo !== null) {
  const rsa = Forge.pki.privateKeyFromPem(private_key);
  if (key_private.decrypt(usersInfo[0].password ,'utf8')=== rsa.decrypt(password)) {
    // login should be successful
    token = jwt.sign({ userName: usersInfo[0].userName }, privateKey);
    res.status(200).send({ message: "Login Success", token ,email})
  } else {
    // login pwd / email mismatch
    res.status(401).send({ message: "Invalid Email/Password Entered"})
  }
} else {
  // user does not exit;
  res.status(404).send({ message: "User Not found"});
}
}


  const auth = (req, res, next) => {
    if (req.headers) {
      //console.log(req.headers);
      if (req.headers.authorization) {
        const [bearer, token] = req.headers.authorization.split(" "); // Bearer <token>
        const decode = jwt.verify(token, privateKey);
        //console.log(decode);
        if (decode['userName']) {
          req.userName = decode['userName'];
          next()
        }
      }
    }
    res.status(401).send('Unauthorised from middleware');

    
  }
  
  module.exports = {
    create,
    auth,
    loginFunction,
    getByCustID
  }
