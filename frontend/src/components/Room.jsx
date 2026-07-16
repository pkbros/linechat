import { useState, useEffect } from "react";
import socket from "../socket";

const Room = ({username, onRoomReady}) => {
  const [roomId, setRoomId] = useState(0);
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onRoomCreated(newRoomId) {
      if (typeof onRoomReady !== "function") {
        console.warn(
          "Stale listener fired — ignoring. Restart dev server if this persists.",
        );
        return;
      }
      console.log("Room created", newRoomId);
      onRoomReady(newRoomId);
    }

    function onJoinedRoom(joinedRoomId) {
      console.log("Joined room", joinedRoomId);
      onRoomReady(joinedRoomId);
    }

    function onRoomNotFound() {
      setError("Room not found.");
    }

    socket.on("room-created", onRoomCreated);
    socket.on("joined-room", onJoinedRoom);
    socket.on("room-not-found", onRoomNotFound);
    return () => {
      socket.off("room-created", onRoomCreated);
      socket.off("joined-room", onJoinedRoom);
      socket.off("room-not-found", onRoomNotFound);
    };
  }, [onRoomReady]);

  const handleCreateRoom = () => {
    console.log("room create pressed");
    socket.emit("create-room");
  };

  const handleJoinRoom = () => {
    setError("");
    console.log("Initiated Room Join with ID: ", roomId);
    socket.emit("join-room", { roomId, username });
  };

  return (
    <>
      <div className="hero bg-base-300">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold">ROOMS</h1>
            <p className="py-6">Create Own Room or Join Other's Room</p>
            <button
              className="btn btn-soft btn-secondary m-4"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
            <button
              className="btn btn-soft btn-accent m-4"
              onClick={() => setIsJoinRoom(!isJoinRoom)}
            >
              {isJoinRoom ? "Cancel" : "Join Room"}
            </button>
          </div>
        </div>
      </div>

      {isJoinRoom && (
        <>
          <p className="text-center font-bold text-5xl">Enter Room ID</p>
          <div className="flex items-center justify-center m-4">
            <label className="otp">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <input
                type="text"
                autoComplete="one-time-code"
                onChange={(e) => setRoomId(e.target.value)}
                inputMode="numeric"
                maxLength="6"
                pattern="[0-9]{6}"
                required
              />
            </label>
            <button
              className="btn btn-soft btn-accent m-4"
              onClick={handleJoinRoom}
              disabled={roomId.length !== 6}
            >
              JOIN
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </>
  );
};

export default Room;
