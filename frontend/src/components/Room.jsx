import { useState } from "react";

const Room = () => {
  const [roomId, setRoomId] = useState(0);
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  // const [isCreateRoom, setIsCreateRoom] = useState(false);

  const handleCreateRoom = () => {
    // Logic to create room
    console.log("room create pressed");
  };

  const handleJoinRoom = () => {
    // Logic to join room
    console.log(roomId);
    console.log("Initated Room Join with ID: ", roomId);
    // console.log(roomId.toString().length)
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
              onClick={() => {
                {
                  setIsJoinRoom(!isJoinRoom);
                }
              }}
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
                onChange={(e) => {
                  setRoomId(e.target.value.toUpperCase());
                }}
                inputMode="numeric"
                style={{ textTransform: "uppercase" }}
                maxLength="6"
                pattern="[0-9]{6}"
                required
              />
            </label>
            <button
              className="btn btn-soft btn-accent m-4"
              onClick={handleJoinRoom}
              disabled={roomId.toString().length !== 6 || 0}
            >
              JOIN
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Room;
