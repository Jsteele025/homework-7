console.log("hi");

var ONLOAD = true;

var config = {
  apiKey: "AIzaSyClqOajm5xk7_MWqAQZwYA67S3To7WWz3o",
  authDomain: "train-times-aka-persistence.firebaseapp.com",
  databaseURL: "https://train-times-aka-persistence.firebaseio.com",
  storageBucket: "train-times-aka-persistence.appspot.com",
  messagingSenderId: "457703769690"
};

firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var firstTime = "";
var frequency= "";



$("#myButton").on("click", function (event) {
    
    event.preventDefault();

    trainName = $("#trainname").val().trim();
    destination = $("#destination").val().trim();
    firstTime = $("#first-time").val().trim();
    frequency = $("#frequency").val().trim();

    console.log(trainName + ' ' + destination + " " + firstTime + " " + frequency);

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    });

    $("#trainname").val('');
    $("#destination").val('');
    $("#first-time").val('');
    $("#frequency").val('');

});

function myNextTrain(initial,interval){
    
    var arr = [];

    var firstTimeConverted = moment(initial, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % interval;
    console.log(tRemainder);

    var tMinutesTillTrain = interval - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    arr.push(moment(nextTrain).format("hh:mm"));
    arr.push(tMinutesTillTrain);
    return arr;
}


function buildLine(obj){

    var scheduletimes =myNextTrain(parseInt(obj.firstTime), parseInt(obj.frequency));
    var arr = [];
    arr.push(obj.trainName);
    arr.push(obj.destination);
    arr.push(obj.frequency);
    arr.push(scheduletimes[0]);
    arr.push(scheduletimes[1]);
  
    var newTr = $("<tr>");
    for(var i = 0; i< arr.length; i++){
        var newTd = $("<td>").html(arr[i]);
        newTd.appendTo(newTr);
    }
    $('tbody').prepend(newTr);

}


database.ref().on("value", function(snapshot) {
   
    var sv = snapshot.val();

    var svArr = Object.keys(sv);

    var lastIndex = svArr.length - 1;

    var lastKey = svArr[lastIndex];

    var lastObj = sv[lastKey];

    if(ONLOAD){
        for (var i = 0; i < svArr.length; i++) {
            
            buildLine(sv[svArr[i]]);
        }
        ONLOAD = false;
    }else {
        buildLine(lastObj);
    }
    
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});