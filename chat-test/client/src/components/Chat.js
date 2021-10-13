import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useHistory } from "react-router-dom";
import { default as socket } from "../socket/ws";
import UserOnline from "./UserOnline";
import AttachmentImage from "../assest/attch.png";
import "./index.scss";

const Chat = () => {
  let { user_nickName } = useParams();
  const [image, setImage] = useState(null);
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [toUser, setToUser] = useState("");
  const history = useHistory();
  const fileinput = useRef("");

  console.log(image, "image");
  useEffect(() => {
    if (!localStorage.getItem("chatConnected")) {
      history.push(`/`);
    }

    window.addEventListener("beforeunload", () =>
      localStorage.removeItem("chatConnected")
    );

    setNickname(user_nickName);

    socket.on("chat message", ({ nickname, msg }) => {
      setChat([...chat, { nickname, msg }]);
    });

    socket.on("private msg", ({ id, nickname, msg }) => {
      setChat([...chat, `Private Message from ${nickname}: ${msg}`]);
    });

    let objDiv = document.getElementById("msg");
    objDiv.scrollTop = objDiv.scrollHeight;

    return () => {
      socket.off();
    };
  }, [chat, toUser, user_nickName, history]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("new-user");
    });

    socket.on("users-on", (list) => {
      setUsersOnline(list);
    });

    socket.on("welcome", (user) => {
      setChat([...chat, `Welcome to our chat ${user}`]);
    });

    socket.on("img", (e) => {
      console.log(e);
      socket.emit([...image, "newImg"]);
    });
 
 

    socket.on("user-disconnected", (user) => {
      if (user !== null) {
        setChat([...chat, `${user} left the chat 👋🏻`]);
      }
    });

    return () => {
      socket.off();
    };
  }, [chat]);
  
  // const handleChange=()
  const submitMsg = (e) => {
    console.log(e.target, "++++++++++++++");
    e.preventDefault();

    if (msg === "" || image?.length > 0) {
      toast("Enter a message.", {
        duration: 4000,
        style: {},
        className: "",
        icon: "⚠️",
        role: "status",
        ariaLive: "polite",
      });
    } else if (toUser === nickname) {
      toast("Select a different user.", {
        duration: 4000,
        style: {},
        className: "",
        icon: "⚠️",
        role: "status",
        ariaLive: "polite",
      });
    } else if (toUser !== "") {
      let selectElem = document.getElementById("usersOn");
      selectElem.selectedIndex = 0;
      socket.emit("chat message private", { toUser, nickname, msg });
      setChat([...chat, { nickname, msg }]);
      setChat([...chat, `Private Message for ${toUser}: ${msg}`]);
      setMsg("");
      setToUser("");
    } else {
      socket.emit("chat message", { nickname, msg });
      setChat([...chat, { nickname, msg }]);
      setMsg("");
    }
  };

  const saveUserToPrivateMsg = (userID) => {
    setToUser(userID);
  };

  const handleChange = (e) => {
    console.log(e.target);
  };

  return (
    <div className="chat-screen">
      <Toaster />
      <div className="chat-mid-screen">
        <div className="hidden lg:block pl-4 pr-4 w-64 text-white">
          <p className="font-black my-4 text-xl">
            {" "}
            User online: ({usersOnline !== null ? usersOnline?.length : "0"})
          </p>
          <ul className="divide-y divide-gray-300 truncate">
            {usersOnline !== null
              ? usersOnline.map((el, index) => (
                  <button
                    key={index}
                    onClick={() => saveUserToPrivateMsg(el)}
                    className="block focus:outline-none truncate"
                  >
                    <UserOnline nickname={el} />
                  </button>
                ))
              : ""}
          </ul>
        </div>
        <div className="flex flex-col flex-grow lg:max-w-full bg-white">
          <p className="font-black mt-4 mb-2 pl-4 lg:pl-8 text-2xl">
            Chat Stream
          </p>
          <div
            id="msg"
            className="h-5/6 overflow-y-auto pl-4 lg:pl-8 pt-4 mb-2 lg:mb-0"
          >
            <ul className="w-full lg:w-96">
              {chat &&
                chat.map((el, index) => (
                  <li
                    key={index}
                    className="w-screen break-words pr-6 lg:pr-0 lg:w-full"
                  >
                    {console.log(chat, "++++++++++++++++++++++chat")}
                    {el.nickname != null ? (
                      `${el.nickname}: ${el.msg}`
                    ) : (
                      <p className="text-base font-semibold text-purple-900 rounded py-1">
                        {el}
                      </p>
                    )}
                  </li>
                ))}
            </ul>
          </div>
          <form className="">
            <div className="px-8">
              <select
                className="lg:hidden text-xs flex-1 appearance-none border border-gray-300 w-full py-2 px-1 lg:px-4 bg-white text-green-400 placeholder-gray-400 shadow-sm focus:outline-none"
                id="usersOn"
                onChange={(e) => saveUserToPrivateMsg(e.target.value)}
              >
                <option value="" className="">
                  All
                </option>
                {usersOnline !== null
                  ? usersOnline.map((el, index) => (
                      <option value={el} className="" key={index}>
                        {el}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="w-full flex p-4 lg:p-8 bg-purple-50">
              {" "}
              <div className="flex relative w-full lg:w-5/6">
                <span className="rounded-l-md inline-flex items-center px-1 lg:px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  {toUser === "" ? (
                    <p className="bg-purple-400 text-white text-xs lg:text-base font-normal rounded p-1">
                      To: All
                    </p>
                  ) : (
                    <p className="bg-purple-700 text-white text-xs lg:text-base font-semibold rounded p-1 w-20 lg:w-28 truncate">
                      To: {toUser}
                    </p>
                  )}
                </span>
                <input
                  type="text"
                  className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-1 lg:px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none"
                  name="message"
                  onChange={(e) => setMsg(e.target.value)}
                  value={msg}
                />
              </div>
              <button
                className="ml-8 flex-shrink-0 bg-green-400 text-gray-700 text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2"
                onClick={(e) => fileinput.current.click()}
              >
                <img
                  src={AttachmentImage}
                  style={{ width: "23px", height: "27px" }}
                />
              </button>
              <div className="hidden lg:block ">
                <input
                  ref={fileinput}
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                />
              </div>
              <div className="hidden lg:block ">
                <button
                  className="ml-8 flex-shrink-0 bg-green-400 text-gray-700 text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2"
                  onClick={(e) => submitMsg(e)}
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
