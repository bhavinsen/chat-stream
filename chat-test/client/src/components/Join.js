import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { default as socket } from "../socket/ws";

import "../scss/app.scss";

const Join = () => {
  const [nickname, setNickname] = useState();
  const history = useHistory();
  const handleOnClick = () => {
    localStorage.setItem("nickname", nickname);
    history.push(`/chat/${nickname}`);
  };

  useEffect(() => {
    localStorage.setItem("chatConnected", "true");
  }, []);

  const submitNickname = () => {
    socket.emit("user nickname", nickname);
  };

  return (
    <div className="chat_wrapper">
      <div className="chat_inner">
        <h1 className="abc">Chat Stream</h1>
        <form className="form_inner">
          <div className="relative ">
            <input
              type="text"
              onChange={(e) => setNickname(e.target.value)}
              className="input_inner"
              placeholder="enter room name"
            />
          </div>
          <button
            className="button_inner"
            onClick={() => {
              submitNickname();
              handleOnClick();
            }}
            type="submit"
          >
            Join room
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;
