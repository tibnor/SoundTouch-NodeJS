var soundTouchDiscovery = require('./discovery');
var isZoned = undefined;

soundTouchDiscovery.search(function(deviceAPI) {

    console.log(deviceAPI.name + " --> " + deviceAPI.getDevice().ip);

    //SOCKETS
    deviceAPI.socketStart();

    deviceAPI.setPoweredListener(function(poweredOn, nowPlaying) {
        console.log(deviceAPI.name + ' --> ' + (poweredOn ? 'Powered On' : 'Powered Off'));
        if (poweredOn && isZoned == undefined) {
          isZoned = deviceAPI.name;
          slaves = []
          console.log('Meging devices to a common zone');
          var devices = soundTouchDiscovery.getDevices();
            for (var device in devices) {
              if (device != deviceAPI.name){
                var d = devices[device].device;
                slaves.push(d);
              }
            }
            deviceAPI.setZone(slaves, function(t){});
        } else if (!poweredOn && isZoned) {
          console.log('Turning off all');
          if (isZoned == deviceAPI.name){
              isZoned = undefined;
          } else {
            isZoned = undefined;
            var devices = soundTouchDiscovery.getDevices();
            for (var device in devices) {
              if (device != deviceAPI.name){
                console.log("Turning off: "+device);
                devices[device].powerOff(function(json){});
              }
            }
          }
        }

    });

    soundTouchDiscovery.stopSearching();
});
