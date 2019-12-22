// Web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDlVZ0vRFo_5lEuuhaftcaBaRwaTXOYTuI",
  authDomain: "train-time-ea8c5.firebaseapp.com",
  databaseURL: "https://train-time-ea8c5.firebaseio.com",
  projectId: "train-time-ea8c5",
  storageBucket: "train-time-ea8c5.appspot.com",
  messagingSenderId: "282195264188",
  appId: "1:282195264188:web:63a552a9fb086186fe46b9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var desName = $("#destination-input")
    .val()
    .trim();
  var firstTrainTime = moment(
    $("#first-train-time-input")
      .val()
      .trim(),
    "HH:mm"
  ).format("HH:mm");
  var trainFrequency = $("#frequency-input")
    .val()
    .trim();
  var newTrain = {
    name: trainName,
    destination: desName,
    start: firstTrainTime,
    frequency: trainFrequency
  };
  db.ref().push(newTrain);
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");
});

db.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());
  var trainName = childSnapshot.val().name;
  var desName = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  var trainStartMin =
    parseInt(firstTrainTime.split(":")[0]) * 60 +
    parseInt(firstTrainTime.split(":")[1]);
  var now = moment();
  var nowFromMidnight = now.clone().startOf("day");
  var diffMinutes = now.diff(nowFromMidnight, "minutes");
  var num = Math.ceil((diffMinutes - trainStartMin) / trainFrequency);
  var nextTrainDiffMin = trainStartMin + num * trainFrequency;
  var minutesAway;
  var nextTrainTime;
  if (nextTrainDiffMin < 1440) {
    minutesAway = trainStartMin + num * trainFrequency - diffMinutes;
    var nextTrainHr = Math.floor(nextTrainDiffMin / 60);
    var nextTrainMin = nextTrainDiffMin % 60;
    if (nextTrainMin === 0) {
      nextTrainTime = nextTrainHr + ":00";
    } else {
      nextTrainTime = nextTrainHr + ":" + nextTrainMin;
    }
  } else {
    nextTrainTime = firstTrainTime + " Tomorrow";
    minutesAway = 24 * 60 - diffMinutes + trainStartMin;
  }
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(desName),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrainTime),
    $("<td>").text(minutesAway)
  );
  $("#train-table > tbody").append(newRow);
});
