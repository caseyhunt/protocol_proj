import React, { useRef, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import io from "socket.io-client";




const Room = (props) => {
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const initialState = true;
    const [state, setState] = useState(initialState);
    let promptNum = 0;
    const [prompt, setPrompt] = useState(promptNum);
    const prompts = ['prompt 1 partner 1', 'prompt1 partner 2', 'prompt 2 partner 1', 'prompt 2 partner 2'];

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            socketRef.current = io.connect("/");
            socketRef.current.emit("join room", props.match.params.roomID);

            socketRef.current.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });

            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
        });


    }, []);

    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

    const Title = () => (
      <div>
      <div class="heading-container">
          <h1 class="pink difference">Intimacy Chat</h1>
      </div>

      <div class="link-container">
          <div class="light difference">invite someone to join you here with this link:</div>
          <div id="share-link" class="light difference"><a href="https://blooming-waters-99675.herokuapp.com/room/${props.match.params.roomID}">https://blooming-waters-99675.herokuapp.com/room/${props.match.params.roomID}</a></div>
      </div>
      <div class="button-container">

          <button class="difference" onClick={() => setState(false)}>let's begin</button>

      </div>
      </div>
)

function nextClicked(){
  console.log('clicked');
  // promptNum=promptNum+1;
  // console.log(promptNum);

}


    const Prompt = () => (
      <div class="prompt-container">

          <div class="prompt subtitle">
          {prompts[promptNum]}
          </div>



          <div class="next" >
              <button class="light difference next-button" onClick={() => { console.log('worked'); }}>next {">"}</button>
          </div>

      </div>

    )

    const Button = () => (
      <div class="next">
      <button class="light difference next-button" onClick={() => { console.log('worked'); }}>next {">"}</button>
      </div>
    )


// function toggleHidden() => {(setState(true))};

//
// useEffect(() => {
//    // adding listeners everytime props.x changes
//    return () => {
//    console.log('doing ittt');
// };
//
// }, [props.visibility])








    return (
    <div>
          {state && <Title/>}
          {!state && <Prompt/>}
          {!state && <Button/>}





        <div class="vid-container">
            <div class="vid1"><video autoPlay muted ref={userVideo} className="vid1"/></div>
            <div class="vid2"><video autoPlay ref={partnerVideo} className="vid2" /></div>
        </div>
        <button class="light difference next-button" onClick={() => { console.log('worked'); }}>next {">"}</button>

    </div>




        // <div className="test">
        //
        //
        // </div>
    );
};


export default Room;
