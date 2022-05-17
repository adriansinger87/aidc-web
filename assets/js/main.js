$(function () {

    var mqtt;
    var vue;
    var refreshInterval;

    $(document).ready(function() {
        startMaterialize();
        startVue();
        startMqtt();
    });
    
    console.log("main.js done");

    // -- functions

    function startMaterialize() {
        M.AutoInit();
    }

    function startVue() {
        vue = new Vue({
            el: "#vue-app",
            data: {
                lastUpdate: null,
                products: null 
            },
            methods: {
                castLastUpdate: castLastUpdate,
                castTimestamp: castTimestamp,
                castSeconds: castSeconds,
                castSignal: castSignal
            },
            updated: function () {
            }
        });
    }

    function startMqtt() {

        var broker = "broker.hivemq.com";
        var port = 8000;
        var clientId = "aidc-web-" + getRandomInt(9999);
        mqtt = new Paho.MQTT.Client(broker, port, clientId);

        // set callback handlers
        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;
        
        // connect the client
        mqtt.connect({
            cleanSession: true,
            onSuccess: function () {
                mqtt.subscribe("m40/aidc/products");
                showSuccessToast( 'Mqtt connected to ' + broker);
            },
            onFailure: function () {
                console.error("mqtt connection failed to host: " + broker + " port: " + port);
                showErrorToast('Mqtt connection failed for ' + broker +' and port ' + port);
            }
        });
    }

    function onConnectionLost() {
        showErrorToast('Mqtt connection lost');
    }

    function onMessageArrived(message) {
        var data = JSON.parse(message.payloadString);
        console.log(data);
        vue.products = data;
        vue.lastUpdate = new Date(); 
        startInterval();

        Vue.nextTick(() => {
            $('.tooltipped').tooltip();
        });

    }

    // -- vue methods

    function castLastUpdate(timestamp) {
        if (timestamp == null) {
            return "never";
        }

        var now = moment();
        var last = moment(timestamp);
        var duration = moment(now.diff(last));
        // var d = duration.days() > 0 ? duration.days() + "d " : "";
        // var h = (d === "" && duration.hours() === 0) ? "" : duration.hours() + "h ";
        var m = duration.minutes() + "m ";
        var s = duration.seconds() + "s";
        return /*d + h +*/ m + s + " ago";
    }

    function castTimestamp(millis) {
        if (millis == null) {
            return "never";
        }
        return moment(millis).format("hh:mm:ss");
    }

    function castSeconds(sec) {
        var mdiClass = "left mdi mdi-sm ";
        if (sec < 2)            mdiClass += "mdi-circle-slice-8 light-green-text text-accent-4";
        else if (sec < 4)       mdiClass += "mdi-circle-slice-7 green-text";
        else if (sec < 6)       mdiClass += "mdi-circle-slice-6 light-green-text";
        else if (sec < 8)       mdiClass += "mdi-circle-slice-5 lime-text";
        else if (sec < 10)      mdiClass += "mdi-circle-slice-4 teal-text";
        else if (sec < 12)      mdiClass += "mdi-circle-slice-3 cyan-text";   
        else if (sec < 14)      mdiClass += "mdi-circle-slice-2 blue-text text-accent-2";
        else if (sec < 16)      mdiClass += "mdi-circle-slice-1 blue-grey-text";
        else if (sec > 16)      mdiClass += "mdi-circle-outline deep-orange-text";
        else                    mdiClass += "mdi-circle-outline blue-grey-text";

        return mdiClass;
    }
    
    function castSignal(signal) {
        var mdiClass = "left mdi mdi-signal ";
        console.log(signal);

        if (signal >= -45)          mdiClass += "mdi-signal-cellular-3 green-text";
        else if (signal >= -65)     mdiClass += "mdi-signal-cellular-2 light-green-text";
        else if (signal >= -75)     mdiClass += "mdi-signal-cellular-1 cyan-text";
        else if (signal >= -85)     mdiClass += "mdi-signal-cellular-outline blue-text text-accent-2";
        else if (signal < -85)      mdiClass += "mdi-signal-off blue-grey-text";     
        
        return mdiClass;
    }

    // -- helper

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function startInterval() {
        if (refreshInterval != null) {
            return;
        }

        refreshInterval = setInterval(refresh, 200);
    }

    function refresh() {
        if (vue.products == null) {
            clearInterval(refreshInterval);
            return;
        }
        vue.products.forEach(p => {
            var now = moment();
            var lastSeen = moment(p.Timestamp);
            
            var dur = now.diff(lastSeen, "seconds");
            p.seconds = dur;
        });

        vue.$forceUpdate();
        
    }  
});