// lib/firebase.js
import { initializeApp } from 'firebase/app';
import {
    getDatabase,
    ref,
    set,
    get,
    onValue,
    onDisconnect,
    increment,
    runTransaction // เพิ่ม import นี้
} from 'firebase/database';
import { TIMER_DURATION, VOTE_STATES } from './utils';
const firebaseConfig = {
    apiKey: "AIzaSyDJAM3U710S9PWQPCDQVPPZ3vG5fNo-tF4",
    authDomain: "mudev-mini.firebaseapp.com",
    databaseURL: "https://mudev-mini-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mudev-mini",
    storageBucket: "mudev-mini.firebasestorage.app",
    messagingSenderId: "723572134697",
    appId: "1:723572134697:web:628d0ccffddf89e5649d38"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// ฟังก์ชันสำหรับ initialize room
export async function initializeRoom(roomCode) {
    const roomRef = ref(db, `rooms/${roomCode}`);
    await set(roomRef, {
        currentStep: 0,
        votes: [0, 0],
        voteState: VOTE_STATES.STORY,
        timeLeft: TIMER_DURATION,
        isGameOver: false,
        players: 0,
        createdAt: new Date().toISOString()
    });
    return roomCode;
}

export async function joinRoom(roomCode) {
    try {
        const playerCountRef = ref(db, `rooms/${roomCode}/players`);
        const connectionRef = ref(db, `.info/connected`);

        // ใช้ onValue เพื่อตรวจสอบการเชื่อมต่อ
        onValue(connectionRef, async (snap) => {
            if (snap.val() === true) {
                // เพิ่มผู้เล่นเมื่อเชื่อมต่อ
                await set(playerCountRef, increment(1));
                // ลดผู้เล่นเมื่อตัดการเชื่อมต่อ
                onDisconnect(playerCountRef).set(increment(-1));
            }
        });
    } catch (error) {
        console.error("Error joining room:", error);
        throw error;
    }
}

export async function leaveRoom(roomCode) {
    const playerCountRef = ref(db, `rooms/${roomCode}/players`);
    try {
        await runTransaction(playerCountRef, (currentCount) => {
            return (currentCount || 1) - 1;
        });
    } catch (error) {
        console.error("Error leaving room:", error);
        throw error;
    }
}

export async function initializeRoomIfNeeded(roomCode) {
    const roomRef = ref(db, `rooms/${roomCode}`);

    try {
        const snapshot = await get(roomRef);
        if (!snapshot.exists()) {
            await initializeRoom(roomCode);
        }
        await joinRoom(roomCode);
        return roomCode;
    } catch (error) {
        console.error("Error initializing room:", error);
        throw error;
    }
}

// ฟังก์ชันอัพเดทสถานะห้อง
export async function updateRoomState(roomCode, updates) {
    const roomRef = ref(db, `rooms/${roomCode}`);
    try {
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
            const currentData = snapshot.val();
            await set(roomRef, {
                ...currentData,
                ...updates
            });
        }
    } catch (error) {
        console.error("Error updating room:", error);
        throw error;
    }
}

// ฟังก์ชันเช็คว่าห้องยังมีอยู่ไหม
export async function checkRoomExists(roomCode) {
    try {
        const roomRef = ref(db, `rooms/${roomCode}`);
        const snapshot = await get(roomRef);
        return snapshot.exists();
    } catch (error) {
        console.error("Error checking room:", error);
        return false;
    }
}

// ฟังก์ชันลบห้องที่ไม่มีผู้เล่น
export async function cleanupEmptyRoom(roomCode) {
    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);

    if (snapshot.exists() && snapshot.val().players <= 0) {
        await set(roomRef, null);
    }
}

