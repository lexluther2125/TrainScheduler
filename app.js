 
$( document ).ready(function() {
 var config = {
      apiKey: "AIzaSyAd3sCZbBTGn_ZSWiixPAXis2toV7tSDGU",
      authDomain: "lexitrainhw.firebaseapp.com",
      databaseURL: "https://lexitrainhw.firebaseio.com",
      projectId: "lexitrainhw",
      storageBucket: "lexitrainhw.appspot.com",
      messagingSenderId: "711949321063"
    };
    firebase.initializeApp(config);

    var database = firebase.database();


    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();

        // Grabs user input
        var name = $("#train-name").val().trim();
        var place = $("#train-destination").val().trim();
        var startTime = $("#first-train-time").val().trim();
        var frequency = $("#train-frequency").val().trim();

        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: name,
            destination: place,
            firstTrainTime: startTime,
            trainFrequency: frequency
        };

        // Uploads train data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrainTime);
        console.log(newTrain.trainFrequency);

        // Clears all of the text-boxes
        $("#train-name").val("");
        $("#train-destination").val("");
        $("#first-train-time").val("");
        $("#train-frequency").val("");

        // // Prevents moving to new page
        // return false;
    });

    //Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());
        // console.log(prevChildKey);

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var firstTrainTime = childSnapshot.val().firstTrainTime;
        var trainFrequency = childSnapshot.val().trainFrequency;

        // Train Info
        // console.log(trainName);
        // console.log(destination);
        // console.log(firstTrainTime);
        // console.log(trainFrequency);

        console.log(firstTrainTime);

        var convertedDate = moment(firstTrainTime, "hh:mm a");
        console.log("Converted Time: " + convertedDate + " Type of: " + typeof convertedDate);

        // var newMinutes = moment().diff(moment.unix(firstTrainTime, "X"), "minutes");
        var newMinutes = moment(convertedDate).minutes();
        console.log("Minutes: " + newMinutes + " Type of: " + typeof newMinutes);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrainTime, "hh:mm a").subtract(1, "years");
        console.log("Updated Time: " + firstTimeConverted + " Type of: " + typeof firstTrainTime);

        // Current Time
        // var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "m");
        console.log("DIFFERENCE IN TIME: " + diffTime + " Type of Difference " + typeof diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var minutes = trainFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minutes);

        // Next Train
        // .format("LT")
        var nextTrain = moment().add(minutes, "m").format("hh:mm a");
        console.log("ARRIVAL TIME: " + moment().format("hh:mm a")); // removed nextTrain from here, didn't like it - invalid time given


        // Add each train's data into the table
        $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minutes + "</td><td>");

    });
}