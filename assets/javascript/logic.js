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

//Button for adding trains
$("#addbutton").on("click", function () {
    event.preventDefault();  // Prevent the page from refreshing

    //Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var trainDestination = $("#destinationInput").val().trim();
    var firstTrain = $("#trainInput").val().trim();
    var trainFrequency = $("#frequencyInput").val().trim();

    //Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        train: firstTrain,
        frequency: trainFrequency
    };

    //Uploads train data to the database
    database.ref().push(newTrain);

    //Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.train);
    console.log(newTrain.frequency);

    //Alert
    alert("Train successfully added");

    //Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#trainInput").val("");
    $("#frequencyInput").val("");

    return false;
});

database.ref().on("child_added", function (snapshot) {
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var train = snapshot.val().train;
    var frequency = snapshot.val().frequency;

    console.log("Step 1");
    console.log("-----------------------");
    console.log(name);
    console.log(destination);
    console.log(train);
    console.log(frequency);


    console.log("Step 2");
    console.log("-----------------------");
    // First Time (pushed back 1 year to make sure it comes before current time)
    var conFirstTime = moment(train, "HH:mm").subtract(1, "years");
    console.log(conFirstTime);

    // Get current time
    var currentTime = moment();
    console.log("This is the current time: " + moment(currentTime).format("hh:mm"));

    // Get the time difference in minutes.
    var diffTime = moment().diff(moment(conFirstTime), "minutes");
    console.log("This is the difference in time.: " + diffTime);

    // Take the difference mod and the frequency equal tiem remaining.
    var timeRem = diffTime % frequency;
    console.log(timeRem);

    // How many minutes until next train.
    var minutes = frequency - timeRem;
    console.log("Train will arrive in (minutes): " + minutes);

    // Train will arrive
    var arrival = moment().add(minutes, "minutes");
    console.log("Arrival Time: " + moment(arrival).format("hh:mm"));


    $("#trainTable > tBody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival.format("hh:mm") + "</td><td>" + minutes + "</td></tr>");


});
