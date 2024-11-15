import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import {
  initializeRoomIfNeeded,
  joinRoom,
  leaveRoom,
  checkRoomExists,
  db,
} from "./lib/firebase";
import { generateRoomCode } from "./lib/utils";
import Game from "./components/Game";
import StartPage from "./components/StartPage"; // เพิ่ม import
import { ref, onValue } from "firebase/database";

// DisplayPage Component
function DisplayPage() {
  const [roomCode] = useState(generateRoomCode());
  const [isReady, setIsReady] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [playerCount, setPlayerCount] = useState(0); // เพิ่ม state สำหรับนับผู้เล่น

  useEffect(() => {
    const initRoom = async () => {
      try {
        await initializeRoomIfNeeded(roomCode);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize room:", error);
      }
    };

    initRoom();
  }, [roomCode]);

  // เพิ่ม useEffect สำหรับติดตามจำนวนผู้เล่น
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}/players`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const count = snapshot.val() || 0;
      setPlayerCount(count);
    });

    return () => unsubscribe();
  }, [roomCode]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (!showGame) {
    return (
      <StartPage
        roomCode={roomCode}
        playerCount={playerCount} // ส่ง playerCount เป็น prop
        onStart={() => setShowGame(true)}
      />
    );
  }

  return <Game isDisplayView={true} roomCode={roomCode} />;
}

// VotingPage Component
function VotingPage() {
  const { roomId } = useParams();
  const [isRoomValid, setIsRoomValid] = useState(null);

  useEffect(() => {
    const checkAndJoinRoom = async () => {
      if (!roomId) return;

      try {
        const exists = await checkRoomExists(roomId); // เพิ่มการเช็คว่าห้องมีอยู่จริง
        if (!exists) {
          setIsRoomValid(false);
          return;
        }

        await joinRoom(roomId);
        setIsRoomValid(true);
      } catch (error) {
        console.error("Failed to join room:", error);
        setIsRoomValid(false);
      }
    };

    checkAndJoinRoom();

    return () => {
      if (roomId) {
        leaveRoom(roomId).catch(console.error);
      }
    };
  }, [roomId]);

  // เพิ่ม useEffect สำหรับ cleanup เมื่อปิดแท็บหรือออกจากหน้า
  useEffect(() => {
    return () => {
      if (roomId && isRoomValid) {
        leaveRoom(roomId).catch(console.error);
      }
    };
  }, [roomId, isRoomValid]);

  if (isRoomValid === null) {
    return <div>Connecting to room...</div>;
  }

  if (isRoomValid === false) {
    return <Navigate to="/" replace />;
  }

  return <Game isDisplayView={false} roomCode={roomId} />;
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Routes>
          {/* Home route สำหรับ Display View */}
          <Route path="/" element={<DisplayPage />} />

          {/* Vote route สำหรับผู้เล่น */}
          <Route path="/vote/:roomId" element={<VotingPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
