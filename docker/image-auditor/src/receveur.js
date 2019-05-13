var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var net = require('net');
var moment = require('moment')

const TCP_PORT = 2205;

const PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";
const PROTOCOL_PORT = 9907;

var songs = new Map();
songs.set( "ti-ta-ti","piano");
songs.set( "pouet", "trumpet");
songs.set( "trulu","flute");
songs.set( "gzi-gzi","violin");
songs.set( "boum-boum","drum");

var musicians = new Map();

server.bind(PROTOCOL_PORT, () => {
    server.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});

server.on('message', (msg, source) => {
    console.log(msg);
    var musician = JSON.parse(msg);
    var storedMusician = {
        uuid : musician.UUID,
        instrument : songs.get(musician.MUSIC),
        lastSend : musician.activeSince
    }
    if(musicians.has(musician.UUID)) {
        musicians.get(musician.UUID).lastSend = storedMusician.lastSend;
    } else {
        storedMusician.activeSince = storedMusician.lastSend;
        musicians.set(storedMusician.uuid, storedMusician);
    }
});

var TCPserver = net.createServer((socket) => {
    var activeMusician = []
    musicians.forEach((item) => {
        activeMusician.push({
            uuid:item.uuid,
            instrument : item.instrument,
            activeSince : moment(item.activeSince).format(),
            lastSend : moment(item.lastSend).format()
        });
    });
    socket.write(JSON.stringify(activeMusician));
    socket.end();
});

TCPserver.listen(TCP_PORT);

function cleanPeriod(){
    musicians.forEach((item, key, musicians) => {
        var diffSeconds = moment().diff(moment(item.lastSend), "seconds");
        console.log(diffSeconds)
        if(diffSeconds > 5 ) {
            musicians.delete(key);
        }
    })
}

setInterval(cleanPeriod, 100);
