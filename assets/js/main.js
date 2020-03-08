$(function () {

    var client;

    $(document).ready(function() {
        startMaterialize();
        startMqtt();
    });
    
    console.log("main.js done");

    // -- functions

    function startMaterialize() {
        M.AutoInit();
    }

    function startMqtt() {
        client = new Paho.MQTT.Client("broker.hivemq.com", 8000, "aidc-web-" + getRandomInt(9999));

        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        
        // connect the client
        client.connect({
            cleanSession: true,
            onSuccess: function () {
                console.log("Mqtt connecting...");
                client.subscribe("m40/aidc/products");
                console.log("Mqtt is connected");
                showSuccessToast( 'Mqtt connected');
            },
            onFailure: function () {
                console.error("mqtt connection failed to host: " + host + " port: " + port);
                showErrorToast('Mqtt disconnected');
            }
        });
    }

    function onConnectionLost() {
        console.error("mqtt connection lost");
    }

    function onMessageArrived(message) {
        console.log(message);
        var data = JSON.parse(message.payloadString);

        console.log(data);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
});