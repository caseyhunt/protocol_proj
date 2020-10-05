import React from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
      <div id="text-container" class="dark">
  <div class="heading-container">
    <h1 class="outline">Intimacy Chat</h1>
  </div>
  <div class="intro light italic">be together now</div>
  <div class="button-container difference"><a href="screen1.html"><button onClick={create}>i'm ready</button></a></div>
</div>
        // <button onClick={create}>Create Room</button>
    );
}

export default CreateRoom;
