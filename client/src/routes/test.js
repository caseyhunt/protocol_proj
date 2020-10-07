import React, { useRef, useEffect } from "react";
import ReactDOM from 'react-dom';
import io from "socket.io-client";

const Test = (props) => {
  function create() {
      const id = uuid();
      props.history.push(`/room/${id}`);
  }
  
return (
  </div>
  </div>
  <div class="intro light italic">be together now</div>
  <div class="button-container difference"><button onClick={create}>i'm ready</button></div>
</div>
  <div class="prompt-container">

      <div class="prompt subtitle">
      </div>

      <div class="next" onclick="">
          <div class="light difference next-button">next {">"}</div>
      </div>

  </div>
  </div>
);
};

export default Test;
