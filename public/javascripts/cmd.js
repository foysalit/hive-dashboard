$(document).ready(function() {
  //set credentials
  // set functions to call
  var deviceID = "53ff6e066667574845592267";
  var accessToken = "6d3faea8e2c0d23c4fb78b1ca846c619855010ae";
  var speed = '90'; // default speed changed from 40
  var currentCommand = '';

  var activeBot = null;


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


  // END OF ROBOT DRIVE COMMANDS ONLY

  $('#degBoxId').on('change', function(event) {
    speed = event.target.value;
    //$('#curPos').text(speed);//assigns ID #curPos the newly made speed
  });


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
  var $activator = $('input[name="activator"]'), // see if activate button works
    $bot_selectors = $('.bot-selector'); //grab class selectors, grabbing all of them


  var checkRobotAvailability = function(bot_id, cb) {
    var apiCall = $.ajax({
      method: 'GET',
      url: '/robots/availability',
      data: {
        id: bot_id
      },
      dataType: 'json'
    });

    apiCall.done(function(res) {
      if (typeof cb == 'function')
        cb(res.status);
    });

    apiCall.error(function() {
      if (typeof cb == 'function') // defines typeof which is equal to function
        cb(false); // send false
    });
  };

  // Update robot model 
  var updateRobotAvailability = function(bot_id, status, cb) { //grab bot id
    var apiCall = $.ajax({ // make call to availabilty api
      method: 'POST',
      url: '/robots/availability',
      data: {
        id: bot_id,
        status: status // same as availabile : available in model
      },
      dataType: 'json'
    });

    apiCall.done(function(res) {
      if (typeof cb == 'function') //check if callback sent reply
        cb(res.status);
    });

    apiCall.error(function() { //handle callback error
      if (typeof cb == 'function')
        cb(false);
    });
  };

  function hasOneActiveBot() {
    var active = false; //no active by default

    $bot_selectors.each(function(i, el) { //loop #bot selector tags
      if (!active && el.checked) // if selector botid is not active and now checked, make active to stop others from using it
        active = true;
    });
    return active; // return true or false
  }

  //validate if bot selected is active
  function isBotActive(bot_id) { // pass ID from jade app
    $bot_selector = $('#' + bot_id);

    return $bot_selector.is(':checked') // returns true or false
  }

  //validate if a commandable bot is there
  function hasCommandableBot() { // validate if a bot is chosen
    return hasOneActiveBot() && $activator.is(':checked'); // chosen and active bot
  }

  function isControlKey(keyCode) {
    return [37, 38, 39, 40, 74, 75, 76, 77].indexOf(keyCode) >= 0;
  }

  $bot_selectors.on('change', function (e) {
    var $bot = $(this),
      id = $bot.data('id');

    if (this.checked && !activeBot) {
      activeBot = id;
    } else if (this.checked && activeBot) {// check if double bots being chosen
      alert('You have already chosen a bot'); 
      this.checked = false; // reset to not checked
      e.preventDefault(); // preventing any listeners from firing off
    } else if (!this.checked) {
      activeBot = null;
    }
  });

  // Updating mechanism + messages
  $activator.on('change', function(e) {
    var totalRobots = $bot_selectors.length,
      activeRobots = 0,
      activating = this.checked;

    $bot_selectors.each(function(i, el) { //loop bots
      if (activeRobots > 0)
        return;

      var $el = $(el),
        id = $el.data('id'); // find bot id via data-id

      if (activating && this.checked) {
        ++activeRobots;
        checkRobotAvailability(id, function(status) {
          if (!status) { // robot occupied
            alert('The bot is occupied'); // msg
          } else {
            updateRobotAvailability(id, false); //
          }
        });

        return;
      }

      if (!activating && this.checked) {
        updateRobotAvailability(id, true); // bot id from line 132, now update db if checked
        this.checked = false;
        return;
      }
    });

    if (activating) {
      alert(' Robots is now active');
    } else {
      alert(' Robot is now available.'); //notfiy not checked
    }
  });

  $(document).on('keydown', function(event) { // whole page onclick
    if (!isControlKey(event.keyCode))
      return;

    if (!hasCommandableBot()) {
      alert('Bot is not activated or chosen');
      return;
    }

    if (is_keydown) return // dont do anything while a key is pressed down. 

    is_keydown = true;

    console.log(event.keyCode);
    actual_speed = speed; // 0
    switch (event.keyCode) {
      case 40:
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
      case 39:
        currentCommand = 'turnright';
        actual_speed = convertToDegrees(speed);
        break
      case 75:
        currentCommand = 'thr';
        actual_speed = '33';
        break;
      case 76:
        currentCommand = 'turnheadleft'
        actual_speed = '34';
        break;
      case 77:
        currentCommand = 'lookdown'
        actual_speed = '33';
        break;
      case 74:
        currentCommand = 'lookup'
        actual_speed = '240';
        break;
      default:
        currentCommand = null;
    }

    if (currentCommand) {
      var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + currentCommand + "/";
      // execution post of request string
      $.post(requestURL, {
        params: actual_speed,
        access_token: accessToken
      });
    }

  });


  $('body').on('keyup', function(e) {
    if (!isControlKey(e.keyCode))
      return;

    is_keydown = false;

    if (!hasCommandableBot()) {
      alert('bot is not activated or chosen');
      return;
    }

    if (!currentCommand) {
      return
    }
    if (currentCommand === 'turnheadleft' || currentCommand === 'thr' || currentCommand === 'lookup' || currentCommand === 'lookdown') {
      var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + currentCommand + "/";
      $.post(requestURL, {
        params: '0',
        access_token: accessToken
      });
    } else {
      var requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + currentCommand + "/";
      $.post(requestURL, {
        params: '90',
        access_token: accessToken
      });
    }

  });


  // Map mph to degrees of which the control is manipulated through
  function convertToDegrees(value) {
    var map = ['90', '80', '70', '65', '50', '40'];
    return map[value];
  }


  // Used in input form. Gets curPos string element value, changes it to an integer
  function fineAdjust(value) {
    var setValue = speed + value; //adds last value plus this one
    document.getElementById("degBoxId").value = setValue; // set degBoxId element value to setValue DISPLAY

    // conversion needs to happen here befoe being given to speed then to function on backend
    speed = setValue;
    alert(speed);
    //sp(setValue); //sets current position
  }
});