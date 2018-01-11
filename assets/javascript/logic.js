  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA6tUONxUjI6HxwWYm5y1fa-k4rE2v0woc",
    authDomain: "traintrails-b1526.firebaseapp.com",
    databaseURL: "https://traintrails-b1526.firebaseio.com",
    projectId: "traintrails-b1526",
    storageBucket: "",
    messagingSenderId: "398655274636"
  };
  firebase.initializeApp(config);
let database = firebase.database();
let editTrainKey = '';

// CLOCK
$('#clock').text(moment().format("hh:mm"));
  setInterval(function(){
    $('#clock').text(moment().format("hh:mm"));
  }, 1000)


$('#submit').on('click', function () {
  // TAKES USER INPUT 
  let trainName = $('#trainName').val().trim();
  let destination = $('#destination').val().trim();
  let firstTrain = $('#firstTrainTime').val().trim();
  let frequency = $('#frequency').val().trim();
  

  //LOCAL OBJECT TO HOLD TRAIN INFO
  newTrain = {
    name: trainName,
    place: destination,
    ftrain: firstTrain,
    freq: frequency,
  

  }

  // UPLOAD DATA TO FIREBASE
  database.ref().push(newTrain);

  console.log(newTrain);
  // CLEAR TEXT BOXES
  $('#trainName').val("");
  $('#destination').val("");
  $('#firstTrainTime').val("");
  $('#frequency').val("");

  return false;
});

// DELETE DATA FROM FIREBASE
let deleteButton = () => {
  $(document).on('click', '.deleteButton', function (event){
  console.log('click');
  let trainKey = $(this).attr('data-train');
  database.ref("traintrails-b1526/" + trainKey).remove();
  $("." + trainKey).remove();
  
  
  $(this).parent().parent().remove();

});
};

// -----------------
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());
  
 
  // STORE VALUES FROM ADDED CHILD TO VARIABLE
  let trainName = childSnapshot.val().name;
  let destination = childSnapshot.val().place;
  let firstTrain = childSnapshot.val().ftrain;
  let frequency = childSnapshot.val().freq;
  


  // FIRST TRAIN TIME 
  let firstTime = moment(firstTrain, "HH:mm");
  console.log(firstTrain);
  let currentTime = moment().format("HH:mm");
  

  // TIME DIFFERENCE FROM FIRST TRAIN
  let timeDifference = moment().diff(moment(firstTime), "minutes");
  

  // TIME REMAINING UNTIL TRAIN
  let remainingTime = timeDifference % frequency;
  console.log(remainingTime);

  // MINUTES UNTIL FIRST TRAIN
  let minToFirst = frequency - remainingTime; 

  // NEXT TRAIN
  let nextTrain = moment().add(minToFirst, "m").format("HH:mm");
  $("#trainTable").append(`
      <tr id="tablerow${trainName}">
        <th scope="row">${trainName}</th>
        <td>${destination}</td>
        <td>${frequency}</td>
        <td>${nextTrain}</td>
        <td>${minToFirst}</td>
        <td><button id="deleteButton" type="button" class="deleteButton btn btn-danger">X</button></td>
      </tr>`);


      deleteButton();

// REFRESHES TRAIN DATA EVERY MINUTE 
  setInterval(function(){
    location.reload();
  }, 60000);

  
});