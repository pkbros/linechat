import { useEffect, useRef, useState } from "react";
import socket from "../socket";

const ChatPage = ({ roomId, username, onLeave }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    function onReceiveMessage(data) {
      setMessages((prev) => [...prev, { type: "message", ...data }]);
    }
    function onSystemMessage(data) {
      setMessages((prev) => [...prev, { type: "system", ...data }]);
    }

    socket.on("receive-message", onReceiveMessage);
    socket.on("system-message", onSystemMessage);

    return () => {
      socket.off("receive-message", onReceiveMessage);
      socket.off("system-message", onSystemMessage);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send-message", { roomId, username, message: input });
    setInput("");
  };

  const leaveRoom = () => {
    socket.emit("leave-room", { roomId, username });
    onLeave();
  };

  return (
    <div className="hero bg-base-300 min-h-screen">
      <div className="hero-content text-center flex-col w-full max-w-2xl">
        <div className="flex justify-between w-full items-center">
          <h2 className="text-xl font-bold">Room: {roomId}</h2>
          <button className="btn btn-soft btn-error" onClick={leaveRoom}>
            Leave
          </button>
        </div>

        <div className="bg-base-100 rounded-box p-4 w-full h-96 overflow-y-auto text-left">
          {messages.map((m, i) =>
            m.type === "system" ? (
              <p key={i} className="italic text-gray-400">
                {m.message}
              </p>
            ) : (
              <p key={i}>
                <b>{m.username}:</b> {m.message}
              </p>
            )
          )}
          <div ref={bottomRef} />
        </div>

        <div className="join w-full mt-4">
          <input
            className="input input-bordered join-item flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button className="btn btn-soft btn-accent join-item" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;