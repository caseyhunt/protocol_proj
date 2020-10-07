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
  <div class="intro light">be together now</div>
  <div class="button-container difference"><button onClick={create}>i'm ready</button></div>
</div>
        // <button onClick={create}>Create Room</button>
    );
}

export default CreateRoom;
