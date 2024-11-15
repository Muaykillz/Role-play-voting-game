// src/components/Game.jsx
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, set, get } from "firebase/database";
import DisplayView from "./DisplayView";
import VotingView from "./VotingView";
import StartPage from "./StartPage";
import StoryPage from "./StoryPage";
import ActionPage from "./ActionPage";
import ResultDialog from "./ResultDialog";
import CongratulationPage from "./CongratulationPage";
import { scenarios } from "../lib/gameData";
import {
  VOTE_STATES,
  TIMER_DURATION,
  handleError,
  determineWinningChoice,
  isLastScenario,
  shouldShowGameOver,
} from "../lib/utils";

export default function Game({ isDisplayView, roomCode }) {
  // ปรับ state ให้รองรับหน้าต่างๆ
  const [gameState, setGameState] = useState({
    votes: [0, 0],
    currentStep: 0,
    timeLeft: TIMER_DURATION,
    voteState: VOTE_STATES.STORY,
    isGameOver: false,
    players: 0,
    showResultDialog: false,
  });

  // Firebase listeners
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState((prevState) => ({
          ...prevState,
          ...data,
          voteState: isDisplayView
            ? data.voteState
            : data.voteState === "story"
            ? "waiting"
            : data.voteState,
        }));
      }
    });

    return () => unsubscribe();
  }, [roomCode, isDisplayView]);

  // Timer logic - ปรับให้ทำงานเฉพาะตอน voting
  useEffect(() => {
    let timer;
    if (gameState.voteState === VOTE_STATES.VOTING && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState((prevState) => {
          const newTimeLeft = prevState.timeLeft - 1;
          if (newTimeLeft === 0) {
            handleTimeUp();
          }
          return { ...prevState, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.voteState, gameState.timeLeft]);

  // เพิ่ม useEffect สำหรับจัดการ players count
  useEffect(() => {
    if (!roomCode) return;

    const playersRef = ref(db, `rooms/${roomCode}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const players = snapshot.val() || 0;
      setGameState((prevState) => ({
        ...prevState,
        players,
      }));
    });

    return () => unsubscribe();
  }, [roomCode]);

  const updateGameState = async (updates) => {
    try {
      if (!roomCode) return;

      const roomRef = ref(db, `rooms/${roomCode}`);
      const updatedState = {
        ...gameState,
        ...updates,
      };

      setGameState(updatedState);
      await set(roomRef, updatedState);
    } catch (error) {
      handleError(error);
    }
  };

  // เพิ่มฟังก์ชันจัดการเมื่อหมดเวลา
  const handleTimeUp = async () => {
    // const result = determineWinningChoice(gameState.votes);
    await updateGameState({
      showResultDialog: true,
      timeLeft: 0,
    });
  };

  // ฟังก์ชันจัดการ flow ของเกม
  const handleStartGame = async () => {
    await updateGameState({
      voteState: VOTE_STATES.STORY,
      currentStep: 0,
    });
  };

  const handleStartVoting = async () => {
    await updateGameState({
      voteState: VOTE_STATES.VOTING,
      timeLeft: TIMER_DURATION,
      votes: [0, 0],
      showResultDialog: false,
    });
  };

  const handleResultDialogNext = async () => {
    // const result = determineWinningChoice(gameState.votes);

    if (shouldShowGameOver(gameState.currentStep, gameState.votes)) {
      await updateGameState({
        isGameOver: true,
        voteState: VOTE_STATES.ACTION,
      });
      return;
    }

    await updateGameState({
      voteState: VOTE_STATES.ACTION,
      showResultDialog: false,
    });
  };

  const handleActionNext = async () => {
    if (isLastScenario(gameState.currentStep)) {
      await updateGameState({
        voteState: VOTE_STATES.GAME_OVER,
        isGameComplete: true, // เพิ่ม flag นี้
      });
      return;
    }

    await updateGameState({
      currentStep: gameState.currentStep + 1,
      voteState: VOTE_STATES.STORY,
    });
  };

  const handleRestart = async () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`voted_${roomCode}`)) {
        localStorage.removeItem(key);
      }
    });

    await updateGameState({
      votes: [0, 0],
      timeLeft: TIMER_DURATION,
      voteState: VOTE_STATES.STORY,
      isGameOver: false,
      showResultDialog: false,
    });
  };

  const handleVote = async (choice) => {
    try {
      const roomRef = ref(db, `rooms/${roomCode}`);
      const snapshot = await get(roomRef);
      const currentData = snapshot.val() || {};
      const currentVotes = currentData.votes || [0, 0];

      const newVotes = [...currentVotes];
      newVotes[choice]++;

      await updateGameState({
        votes: newVotes,
      });
    } catch (error) {
      handleError(error);
    }
  };

  // Render logic based on voteState
  if (isDisplayView) {
    switch (gameState.voteState) {
      case VOTE_STATES.STORY:
        return (
          <StoryPage
            situation={scenarios[gameState.currentStep].situation}
            previousResponse={
              gameState.currentStep > 0
                ? scenarios[gameState.currentStep - 1].waiResponse
                : null
            }
            onNext={handleStartVoting}
          />
        );

      case VOTE_STATES.VOTING:
        return (
          <DisplayView {...gameState} onRestart={handleRestart}>
            {gameState.showResultDialog && (
              <ResultDialog
                selectedChoice={
                  scenarios[gameState.currentStep].choices[
                    determineWinningChoice(
                      gameState.votes,
                      scenarios[gameState.currentStep].correctChoice
                    ).winningChoice
                  ]
                }
                isTieBreaker={
                  determineWinningChoice(
                    gameState.votes,
                    scenarios[gameState.currentStep].correctChoice
                  ).isTieBreaker
                }
                onNext={handleResultDialogNext}
              />
            )}
          </DisplayView>
        );

      case VOTE_STATES.ACTION:
        return (
          <ActionPage
            isSuccess={!gameState.isGameOver}
            message={
              gameState.isGameOver
                ? "P made a critical mistake!"
                : "The conversation continues smoothly!"
            }
            failReason={
              gameState.isGameOver
                ? scenarios[gameState.currentStep].failReason
                : null
            }
            onNext={gameState.isGameOver ? handleRestart : handleActionNext}
          />
        );

      case VOTE_STATES.GAME_OVER:
        if (gameState.isGameComplete) {
          return <CongratulationPage />;
        }

      default:
        return (
          <StartPage
            roomCode={roomCode}
            playerCount={gameState.players}
            onStart={handleStartGame}
          />
        );
    }
  }

  return <VotingView {...gameState} onVote={handleVote} roomCode={roomCode} />;
}
