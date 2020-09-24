//webpage elements
var divSelectRoom = document.getElementById('selectRoom');
var divConsultingRoom = document.getElementById("consultingRoom");
var inputRoomNumber = document.getElementById("roomNumber");
var btnGoRoom = document.getElementById("goRoom");
var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');

//global variables
var roomNumber;
var localStream;
var remoteStream;
var pc;

//STUN server
var iceServers={
  'iceServers':[
    {'url':'stun:stun.services.mozilla.com'},
    {'url':'stun:stun.l.google.com:19302'}
  ]
}
var streamConstraints = {audio: true , video: true};
var isCaller;

//connect to socket server
var socket = io();

//click event on button
btnGoRoom.onclick = function(){
  if(inputRoomNumber.value ===""){
  alert("Please type a room number");
}else{
  roomNumber = inputRoomNumber.value;
  socket.emit('create or join', roomNumber);
  divSelectRoom.style = "display:none;"; //don't show display room dialogue (selectRoom div)
  divConsultingRoom.style = "display:block;"; //show video call interface (consultingRoom div)
}}


//when server gets created, use var streamConstraints to access user media.
//set localStream html to stream from the user
//if there's a problem with media, send message to console
socket.on('created', function (room){
  navigator.mediaDevices.getUserMedia(streamConstraints).then(function(stream){
    localStream = stream;
    // localVideo.src = URL.createObjectURL(stream);
    localVideo.srcObject = stream;
    isCaller = true;
  }).catch(function(err){
    console.log('An error occurred when accessing media devices')
  })
})

//do the same thing as socket.on('created') except for the user joining an existing room
socket.on('joined', function(room){
  navigator.mediaDevices.getUserMedia(streamConstraints).then(function(stream){
    localStream = stream;
    localVideo.srcObject = stream;
    socket.emit('ready',roomNumber);
  }).catch(function(err){
    console.log('an error occurred when accessing media devices');
  })
})



//webRTC stuff that manages sending the video/audio files in real time
//this is an API, I don't understand it whatsoever. I got the information for this code from: https://webrtc.ventures/2018/07/tutorial-build-video-conference-application-webrtc-2/

//when server says 'ready'
socket.on('ready', function(){
  //creates an pc object
  pc = new RTCPeerConnection(iceServers);

  //adds event listeners to the newly created object
  pc.onicecandidate = onIceCandidate;
  pc.onaddstream = onAddStream;

  //adds current local stream to the object
  pc.addStream(localStream);

  //prepares an Offer
  pc.createOffer(setLocalAndOffer, function(e){
    console.log(e)
  });

});

//when server emits Offer
socket.on('offer', function(event){
  if(!isCaller){//is caller is set to true in on socket 'created'
    //creates an pc object
    pc = new RTCPeerConnection(iceServers);

    //adds event listeners to the newly created created object
    pc.onicecandidate = onIceCandidate;
    pc.onaddstream = onAddStream;

    //adds the current local stream to the object
    pc.addStream(localStream);

    //stores the offer as remote description
    pc.setRemoteDescription(event);

    //prepares an answer
    // pc.createAnswer(setLocalAndAnswer, function(e){console.log(e)});
    // }
    pc.createAnswer(setLocalAndAnswer, function(e){console.log(e)});
    }
});

//when server emits answer
socket.on('answer', function(event){
  //stores it as remote description
  pc.setRemoteDescription(sessionDescription);
})

//when server emits candidate
socket.on('candidate', function(event){
  //creates a candidate object
  var candidate = new RTCIceCandidate({
    sdpMLineIndex:event.label,
    candidate:event.candidate
  });
  //stores candidate
  pc.addIceCandidate(candidate);
});


//display the other user's video!
function onAddStream(event){
  remoteVideo.srcObject = stream;
  console.log('onAddStream is running!')
  remoteStream = event.stream;
}



//sends a candidate message to the server
function onIceCandidate(event){
  if(event.candidate){
    console.log('sending ice candidate');
    socket.emit('candidate', {
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
      room: roomNumber
    })
  }
}

//stores offer and sends message to server
function setLocalAndOffer(sessionDescription){
  pc.setLocalDescription(sessionDescription);
  socket.emit('offer',{
    type:'offer',
    sdp: sessionDescription,
    room: roomNumber
  });
}

//stores answer and sends message to server
function setLocalAndAnswer(sessionDescription){
  pc.setLocalDescription(sessionDescription);
  socket.emit('answer',{
    type:'answer',
    sdp:sessionDescription,
    room: roomNumber
  });
}
