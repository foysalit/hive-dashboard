var mongoose = require('mongoose');

//Robot schema
RobotSchema = new mongoose.Schema({
	name:{type:String,unique:true,required:true},
	available:{type:Boolean, required:true}, //true or false
	offline:{type:Boolean, required:true},
});

var Robot = mongoose.model('Robot', RobotSchema); 

module.exports = {
	updateAvailability:function (available, id, callback) {
		Robot.update({_id: id}, {available: available}, callback);
	},
	getAvailability: function (id, callback) {
		Robot.findOne({_id:id},callback);
	},
	fetchRobots: function (callback) {
		Robot.find({}, function(err, robots){
			callback(robots);
		});
	}
};
