const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendsSchema=new Schema({
  friendEmail:{type:String},
  friendstatus:{type:String},
}, {
  timestamps: true
})

const Profile = new Schema({
    userName: {  type: String, required: true },
    email: { type: String, required: true, unique: true },
    city:{type:String},
    state:{type:String},
    gender:{type:String},
    profession:{type:String},
    img:{type:String},
    members:[friendsSchema],
}, {
  timestamps: true
})

module.exports = mongoose.model('Profile', Profile);