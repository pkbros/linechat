import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import Room from "./components/Room";
import ChatPage from "./components/ChatPage";

const App = () => {
  const [username, setUsername] = useState("RedPanda007");
  const [activeRoomId, setActiveRoomId] = useState(null);
  if (activeRoomId) {
    return (
      <ChatPage
        roomId={activeRoomId}
        username={username}
        onLeave={() => setActiveRoomId(null)}
      />
    );
  }
  return (
    <>
      <ProfileCard username={username} setUsername={setUsername} />
      <Room username={username} onRoomReady={setActiveRoomId} />
    </>
  );
};

export default App;
