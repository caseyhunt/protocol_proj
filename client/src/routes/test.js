import React, { useRef, useEffect } from "react";
import ReactDOM from 'react-dom';
import io from "socket.io-client";

const Test = (props) => {
return (

  <div class="prompt-container">

      <div class="prompt subtitle">
      </div>

      <div class="next" onclick="">
          <div class="light difference next-button">next {">"}</div>
      </div>

  </div>
);
};

export default Test;
