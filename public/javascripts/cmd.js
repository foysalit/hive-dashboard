$(document).ready(function() {
//set credentials
// set functions to call
var deviceID    = "53ff6e066667574845592267";
var accessToken = "6d3faea8e2c0d23c4fb78b1ca846c619855010ae";
var speed = '90'; // default speed changed from 40
var currentCommand = '';


// USELESS
var fwd = "forward"; 
// DONT NEED THESE //
var tr = "turnright";
var tl = "turnleft";
var getFunc = "getpos";
var setFunc = "setpos";
// DONT NEED THESE //

//Mapping
// 0 mph = 90 degrees pos
// 5 mph = 30 degrees pos
// 1 mph = 12 degrees pos
// .083 mph = 1 degree pos



//Updating speed output

$('#degBoxId').val(speed); // sets any ID with degBoxId to value speed
// If i want to do multiple things use class. i.e. if i have multiple degree boxes and I want to set them. 
// use class anywhere I want it to be set. 
//Updates now for first update


// END OF ROBOT DRIVE COMMANDS ONLY

//whenever the slider changes, it will update the current position by re-assigning speed value
/*
$('#degBoxId').on('change', function (event) {
  speed = event.target.value;
  $('#curPos').text(speed);//assigns ID #curPos the newly made speed
});
*/
/*
// decrementing down with fineAdjust function
$('#minusbutton').on('click', function (event) {
  fineAdjust(-1);
});


// Incrementing 
$('#plusbutton').on('click', function (event) {
  fineAdjust(1);
});
*/

// ROBOT DRIVE COMMANDS ONLY
      var is_keydown = false;
      var $activator = $('input[name="activator"]'),
          $bot_selectors = $('.bot-selector');


      var checkRobotAvailability = function (bot_id, cb) {
        var apiCall = $.ajax({
          method: 'GET',
          url: '/robots/availability',
          data: {
            id: bot_id
          },
          dataType: 'json'
        });
        
        apiCall.done(function(res){
          if (typeof cb == 'function')
            cb(res.status);
        });
        
        apiCall.error(function (){
          if (typeof cb == 'function')
            cb(false);
        });
      };

      var updateRobotAvailability = function (bot_id, status, cb) {
        var apiCall = $.ajax({
          method: 'POST',
          url: '/robots/availability',
          data: {
            id: bot_id,
            status: status
          },
          dataType: 'json'
        });
        
        apiCall.done(function(res){
          if (typeof cb == 'function')
            cb(res.status);
        });
        
        apiCall.error(function (){
          if (typeof cb == 'function')
            cb(false);
        });
      };

          
      function isBotActive(bot_id) {
        $bot_selector = $('#'+ bot_id);
        
        return $bot_selector.is(':checked')
      }
      
      function hasCommandableBot() {
         return hasOneActiveBot() && $activator.is(':checked');
      }
      
      function hasOneActiveBot() {
        var active = false;
        
        $bot_selectors.each(function(i, el) {
          if (!active && el.checked)
            active = true;
        });
        
        return active;
      }
      
      $activator.on('change', function(e) {
        $bot_selectors.each(function (i, el){
          var $el = $(el),
              id = $el.data('id');
          
          if (!this.checked) {
            updateRobotAvailability(id, true, function (){
              alert('Robot is now available for others.');
            });
            return;
          }
            
          checkRobotAvailability(id, function(status){
            console.log(status);
            
            if (!status) {
              alert('The bot is occupied');
            } else {
              updateRobotAvailability(id, false);
            }
          });
        });
      });
      
      $(document).on('keydown', function (event) { // whole page onclick
        if (!hasCommandableBot()){
          alert('bot is not activated or chosen');
          return;
        }
        
        if(is_keydown) return // dont do anything while a key is pressed down. 
        
        is_keydown = true;
        
        console.log(event.keyCode);
        actual_speed = speed; // 0
        switch(event.keyCode){
          case 40 :
              currentCommand = 'backward';
              actual_speed = convertToDegrees(speed);
            break;
          case 38:
              currentCommand = 'forward';
              actual_speed = convertToDegrees(speed);
            break;
          case 37:
              currentCommand = 'turnleft';    
              actual_speed = convertToDegrees(speed);
            break;
          case  39:
              currentCommand = 'turnright';
              actual_speed = convertToDegrees(speed);
            break
          case 75:
              currentCommand = 'thr';
              actual_speed = '33';
            break;
          case 76:
              currentCommand = 'turnheadleft'
              actual_speed ='34';
            break;
          case 77:
              currentCommand = 'lookdown'
              actual_speed ='33';
            break;
          case 74:
              currentCommand = 'lookup'
              actual_speed ='240';
            break;
          default:
            currentCommand = null;
        }
           
        if(currentCommand){
          var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + currentCommand + "/";
                    // execution post of request string
          $.post(requestURL, { params: actual_speed, access_token: accessToken });          
        }

      });

       
      $('body').on('keyup', function () {
        is_keydown = false;
        
        if (!hasCommandableBot()){
          alert('bot is not activated or chosen');
          return;
        }
          
        if(!currentCommand){return}
        if(currentCommand === 'turnheadleft' || currentCommand === 'thr' || currentCommand === 'lookup' || currentCommand === 'lookdown'){
          var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + currentCommand + "/";
          $.post( requestURL, { params: '0', access_token: accessToken });
        }else{
          var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + currentCommand + "/";
          $.post( requestURL, { params: '90', access_token: accessToken });
        }
        
      });


// Map mph to degrees of which the control is manipulated through
function convertToDegrees(value){
  var map = ['90', '80', '70', '65', '50', '40'];
  return map[value];
}


// Used in input form. Gets curPos string element value, changes it to an integer
function fineAdjust(value) {
  var setValue = speed + value; //adds last value plus this one
  document.getElementById("degBoxId").value = setValue; // set degBoxId element value to setValue DISPLAY

  // conversion needs to happen here befoe being given to speed then to function on backend
  speed = setValue;
  //sp(setValue); //sets current position
}
});