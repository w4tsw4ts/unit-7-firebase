//   ____    ____  _       ____  _____ __ __    ___  ____  
//  |    \  /    || |     /    |/ ___/|  |  |  /  _]|    \ 
//  |  o  )|  o  || |    |  o  (   \_ |  |  | /  [_ |  D  )
//  |    < |     || |___ |     |\__  ||  _  ||    _]|    / 
//  |  o  \|  _  ||     ||  _  |/  \ ||  |  ||   [_ |    \ 
//  |      |  |  ||     ||  |  |\    ||  |  ||     ||  .  \
//  |_____/|__|__||_____||__|__| \___||__|__||_____||__|\_|

// Make sure that your app suits this basic spec:

// When adding trains, administrators should be able to submit the following:
// Train Name
// Destination 
// First Train Time -- in military time
// Frequency -- in minutes
// Code this app to calculate when the next train will arrive; this should be relative to the current time.
// Users from many different machines must be able to view same train times.
// Styling and theme are compvarely up to you. Get Creative!


$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBeOBqjmN9OAd1zhsyQOdZ7YFCMnKXx-tg",
        authDomain: "traintime-8f486.firebaseapp.com",
        databaseURL: "https://traintime-8f486.firebaseio.com",
        projectId: "traintime-8f486",
        storageBucket: "traintime-8f486.appspot.com",
        messagingSenderId: "953899188732"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
  
    // Create variables
    var train = '';
    var destination = '';
    var trainTime = '';
    var trainFrequency = '';
  
    // Click Button changes what is stored in firebase
    $("#add-train-btn").on("click", function (event) {
      event.preventDefault(); // Prevent the page from refreshing
  
      // get input values
      train = $("#trainNameInput").val().trim();
      destination = $("#destinationInput").val().trim();
      trainTime = $("#trainInput").val().trim();
      trainFrequency = $("#frequencyInput").val().trim();
  
      database.ref().push({
        trainName: train,
        destinationName: destination,
        time: trainTime,
        frequency: trainFrequency
      });
  
    });
    // Get added info from dB
    database.ref().on('child_added', function (snapshot) {
      var value = snapshot.val();
      // console.log(value);
      console.log(value.trainName);
      console.log(value.destinationName);
      console.log(value.time);
      console.log(value.frequency);
  
      //setting variables
      var initialStartTime = value.time;
      var timeFrequency = value.frequency;
      var nextTrain = gettingTimeTrain(initialStartTime, timeFrequency);
  
      // Change the HTML
      $('#trainTable').append(`
        <tr>
          <td>${value.trainName}</td>
          <td>${value.destinationName}</td>
          <td>${value.frequency}</td>
          <td>${nextTrain[0]}</td>
          <td>${nextTrain[1]}</td>
        </tr>
        ` );
    });
  
    //Calculation Function
    function gettingTimeTrain(initialStartTime, timeFrequency) {
      //setting variables
      var now = moment().format('HH:mm');
      var startTime = initialStartTime;
      timeFrequency = timeFrequency; //reconfirm the timeFrequency variable is recognized for future functions
      //Converting now and startTime to minutes
      var sTime = convert(startTime);
      // console.log('Start Time in minutes: ' + startTime);
      var nTime = convert(now);
      // console.log('Now in minutes: ' + now);
      //Calling function to get the next Train Array/Information
      var newTrain = nextTrain(sTime, nTime, timeFrequency);
      // console.log(newTrain);
      //Calls function to set up values for the last 2 columns in table
      nextTrainTime = revert(newTrain);
      trainWillArrive = newTrain[1];
      // console.log(revert);
      var finalResults = [];
      finalResults.push(nextTrainTime, trainWillArrive);
      // console.log(finalResults);
      return finalResults
    }
    
    //revert minutes back to military time
    function revert(a) {
      // console.log(a);
      var time = parseFloat(a[0] / 60);
      console.log(time)
      timeH = parseInt(time);
      timeM = time - timeH;
      timeM = timeM * 60;
      if (timeM < 10) {
        timeM = '0' + timeM;
      }
      // console.log(`${timeH}:${timeM}`);
      var timerz = `${timeH}:${timeM}`
      return timerz;
    }
  
    //convert string to minutes
    function convert(e) {
      console.log(e);
      var time = e.split(':');
      return parseInt((time[0] * 60)) + parseInt((time[1]));
    }
  
    // use convert function to get the next train info
    function nextTrain(sTime, nTime, timeFrequency) {
      // console.log("stime", sTime);
  
      var nextTrainArray = [];
      // console.log(timeFrequency + 'freq2' + typeof timeFrequency);
      var x = parseInt(timeFrequency);
      //for loop to find next train
      for (var index = sTime; index < 1440; index += x) {
        // console.log(index);
        if (index > nTime) {
          var newTrainz = index;
          // console.log('newTrains= ' + newTrainz);
          var minutesTill = index - nTime;
          // console.log('TILL: ' + minutesTill);
          nextTrainArray.push(newTrainz, minutesTill)
          return nextTrainArray;
        }
      }
    }
  
  }); // End doc ready