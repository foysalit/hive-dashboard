var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

function sendEmail(email, callback){

	var smtpTransport= nodemailer.createTransport();
	smtpTransport.sendMail({
		from:'no-reply@hiveproject.org',
		subject:"Hello",
		to:email,
		text:'Welcome to the machine'
	},callback);
}
//First define schemas
var UserSchema = new mongoose.Schema({
	email:{type:String,unique:true,required:true},
	fname:{type:String, required:true},
	lname:{type:String, required:true},
	interests:{type:String},
	password:{type:String,required:true},
	beta:{type:Boolean,default:false},
	provider:{type:String}
});

//define mongoose variable
///collection -> Users
var User = mongoose.model('User', UserSchema); // best practice to declare as singular but it becomes plural
// default has all CRUD functions
//module.exports = User;
//all methods that manipulate the data have to be inside export wrapper

module.exports = {
	create:function (email, fname,lname, interests,password,provider,callback) {
		var new_user = new User({
			'email':email,
			'fname':fname,
			'lname':lname,
			'interests':interests,
			'password': 'hello',
			'provider':provider
		});

		new_user.save(function(){
			sendEmail(email,function(error){
				console.log(error, 'USER:', email);
			});
			callback();
		});
	},
	login:function(email,password,callback){
		User.findOne({email:email,password:password},{},callback);
	},
	approve:function (user_email) {
		User.findOne({email:user_email},{},function(error,doc){ // as this
			doc.beta=true
		});

		//User.update({email:user_email},{$set:{beta:true}},{upsert:false}); //  ths is the same as above
	}
}