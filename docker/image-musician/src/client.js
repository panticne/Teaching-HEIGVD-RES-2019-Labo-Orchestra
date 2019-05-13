var PORT = 2205;
var HOST = '239.255.22.5';

var dgram = require('dgram');
var message = new Buffer(process.argv[3]);
var piano = 'ti-ta-ti';
var trumpet = 'pouet';
var flute = 'trulu';
var violin = 'gzi-gzi';
var drum = 'boum-boum';
const uuidv1 = require('uuid/v1');


/*
   * We will simulate temperature changes on a regular basis. That is something that
   * we implement in a class method (via the prototype)
   */
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var s = dgram.createSocket('udp4');


function Music() {

Music.prototype.update = function() {
/*
	  * Let's create the measure as a dynamic javascript object, 
	  * add the 3 properties (timestamp, location and temperature)
	  * and serialize the object to a JSON string
	  */
		var measure = {
			uuid: uuidv1(),
			instrument: process.argv[3],
			activeSince: moment();
		};
		var payload = JSON.stringify(measure);

/*
	   * Finally, let's encapsulate the payload in a UDP datagram, which we publish on
	   * the multicast address. All subscribers to this address will receive the message.
	   */
		message = new Buffer(payload);
		s.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + PORT);
		});

	}

/*
	 * Let's take and send a measure every 500 ms
	 */
	setInterval(this.update.bind(this), 100);

}
var t1 = new Music();

