import React, { useRef, useEffect } from "react";
import ReactDOM from 'react-dom';
import io from "socket.io-client";
import { v1 as uuid } from "uuid";

const Test = (props) => {
  const userVideo = useRef();
      const userStream = useRef();

  function create() {
      const id = uuid();
      //props.history.push(`/room/${id}`);
  }



      useEffect(() => {
          navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
              userVideo.current.srcObject = stream;
              userStream.current = stream;
          });

      }, []);

return (
  <div>
      <div id="text-container">

          <div class="heading-container">
              <h1 class="pink difference">Intimacy Chat</h1>
          </div>

          <div class="link-container">
              <div class="light difference">invite someone to join you here with this link:</div>
              <div id="share-link" class="light difference"><a href="https://blooming-waters-99675.herokuapp.com/${id}">https://blooming-waters-99675.herokuapp.com/${id}}</a></div>
          </div>
          <div class="button-container">
              <button class="difference" onClick={create}>let's begin</button>
          </div>
      </div>


      <div class="vid-container">
          <div class="vid1"><video autoPlay muted ref={userVideo} className="vid1"/></div>
      </div>

  </div>

);
};

export default Test;
