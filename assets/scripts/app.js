setInterval(function() {
    var currentTime = moment().format("hh:mm A");
    $("#current-time").html(currentTime);
}, 1000);

const timeZone = moment.tz.guess();
console.log(timeZone);

// Firebase configuration
var config = {
    apiKey: "AIzaSyDkXHjll24maztcRW_DSA6qUwJ-r47LV7E",
    authDomain: "train-scheduler-9714d.firebaseapp.com",
    databaseURL: "https://train-scheduler-9714d.firebaseio.com",
    projectId: "train-scheduler-9714d",
    storageBucket: "",
    messagingSenderId: "342592922355",
    appId: "1:342592922355:web:6b4662506d4f2d4a"
};

// Initialize Firebase
firebase.initializeApp(config);

var database = firebase.database();

// declare initial variables
var name;
var destination;
var firstTime;
var frequency;

$("#submit").on("click", function(event) {

    event.preventDefault();

    var firebase
    name = $("#nameForm").val().trim();
    destination = $("#destinationForm").val().trim();
    // first time input converted to date, parsed as HH:mm, subtract 10 years to make sure that first train comes before, converted to UNIX format
    firstTime = moment($("#firstTimeForm").val().trim(), "HH:mm").subtract(10, "years").format("X");
    frequency = $("#frequencyForm").val().trim();

    var newTrainObject = {
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
    }

    database.ref().push(newTrainObject);

});

database.ref().on("child_added", function(snapshot) {

    let data = snapshot.val();
    let trainNames = data.name;
    let trainDestination = data.destination;
    let trainFrequency = data.frequency;
    let firstTrain = data.firstTime;
    // the tRemainder takes the difference between the current time and the first train time, and then calculates the remainder between the two using % modulo
    let tRemainder = moment().diff(moment.unix(firstTrain), "minutes") % trainFrequency;
    let tMinutes = trainFrequency - tRemainder;

    // To calculate the arrival time, add the tMinutes to the currrent time
    let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

    $("#table").append("<tr><td>" + trainNames + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});