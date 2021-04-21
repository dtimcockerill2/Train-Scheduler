$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyAQD76e7IG7VdoWxSp5eGp8mneZRqPs9uY",
        authDomain: "train-scheduler-96fd4.firebaseapp.com",
        databaseURL: "https://train-scheduler-96fd4.firebaseio.com",
        projectId: "train-scheduler-96fd4",
        storageBucket: "",
        messagingSenderId: "521397764511",
        appId: "1:521397764511:web:46ddc9ef320966b9"
    };

    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    var trainName = "";
    var dest = "";
    var firstArrive = "";
    var frequency = "";
    var counter = 0;

    $(".form-button").on("click", function (event) {
        event.preventDefault();
        console.log("hello");

        trainName = $("#name-input").val().trim();
        dest = $("#dest-input").val().trim();
        firstArrive = $("#firstTime-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        console.log(trainName);
        console.log(dest);
        console.log(firstArrive);
        console.log(frequency);
        
        database.ref().push({
            trainName: trainName,
            dest: dest,
            firstArrive: firstArrive,
            frequency: frequency,
        });

        $("#name-input").val("");
        $("#dest-input").val("");
        $("#firstTime-input").val("");
        $("#frequency-input").val("");
    })

    database.ref().on("child_added", function (snapshot) {
        var addTrain = snapshot.val();
        var newTrain = [
            addTrain.trainName,
            addTrain.dest,
            addTrain.frequency,
            addTrain.firstArrive
        ];

        var tFrequency = newTrain[2];
        var firstTime = newTrain[3];

        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        var tRemainder = diffTime % tFrequency;

        var tMinutesTillTrain = tFrequency - tRemainder;

        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var displayTime = moment(nextTrain).format("hh:mm A");

        counter++;
        $("tbody").append($("<tr id='row-" + counter + "'>"));
        for (var i = 0; i < 3; i++) {
            $("#row-" + counter).append($("<td>").text(newTrain[i]));
        };
        $("#row-" + counter).append($("<td>").text(displayTime));
        $("#row-" + counter).append($("<td id='minutesLeft'>").text(tMinutesTillTrain));
    });

});