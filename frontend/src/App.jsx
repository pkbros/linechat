import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import Room from "./components/Room";
import ChatPage from "./components/ChatPage";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  NumberDictionary,
} from "unique-names-generator";
function generateUsername() {
  const name = uniqueNamesGenerator({
    dictionaries: [
      adjectives,
      animals,
      NumberDictionary.generate({ min: 10, max: 99 }),
    ],
    separator: "",
    style: "capital",
  });
  return name;
}
const App = () => {
  const [username, setUsername] = useState(() => generateUsername());
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
