// src/lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { scenarios } from './gameData';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// ฟังก์ชันสำหรับสร้าง room code
export function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ฟังก์ชันสำหรับจัดฟอร์แมตเวลา
export function formatTime(seconds) {
    if (seconds < 10) return `0:0${seconds}`;
    if (seconds < 60) return `0:${seconds}`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// ฟังก์ชันคำนวณเปอร์เซ็นต์
export function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

// ฟังก์ชันสำหรับสร้าง URL สำหรับแชร์
export function generateShareURL(roomCode) {
    const baseURL = window.location.origin;
    return `${baseURL}/vote/${roomCode}`;
}

// ฟังก์ชันสำหรับสร้าง QR Code URL
export function generateQRCodeURL(text) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
}

// ฟังก์ชันสำหรับ shuffle array
export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Constants สำหรับเกม
export const VOTE_STATES = {
    WAITING: 'waiting',
    VOTING: 'voting',
    SHOWING_RESULT: 'showing_result',
    ACTION: 'action',
    GAME_OVER: 'game_over',
    COMPLETE: 'complete',
    STORY: 'story'  // อย่าลืม state นี้
};

export const TIMER_DURATION = 20; // seconds

// ฟังก์ชันสำหรับตรวจสอบ device
export function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

// ฟังก์ชันสำหรับ handle errors
export function handleError(error) {
    console.error('Error:', error);
    // คุณอาจจะต้องการเพิ่ม error reporting service ในอนาคต
    return {
        message: error.message || 'An unexpected error occurred',
        code: error.code || 'UNKNOWN_ERROR'
    };
}

export function determineWinningChoice(votes, correctChoice) {
    const [Votes1, Votes2] = votes;

    // กรณีคะแนนเท่ากัน
    if (Votes1 === Votes2) {
        return {
            result: 'correct',
            winningChoice: 0,    // เลือก choice ที่ถูกต้องเสมอ
            isTieBreaker: true,
            message: "Votes were tied! P chose the safe approach..."
        };
    }

    // กรณีคะแนนไม่เท่ากัน
    const winningChoice = Votes1 > Votes2 ? 0 : 1;
    return {
        result: winningChoice === correctChoice ? 'correct' : 'wrong',
        winningChoice,
        isTieBreaker: false,
        message: winningChoice === correctChoice
            ? "Most people guided P to make the right choice!"
            : "Most people guided P towards a mistake..."
    };
}

// เพิ่มฟังก์ชันเช็คว่าเป็นด่านสุดท้ายหรือไม่
export function isLastScenario(currentStep) {
    return currentStep === scenarios.length - 1;
}

// เพิ่มฟังก์ชันเช็คว่าควรแสดง Game Over หรือไม่
export function shouldShowGameOver(currentStep, votes) {
    const { result } = determineWinningChoice(votes, scenarios[currentStep].correctChoice);
    // ด่านแรกให้ผ่านเสมอ ด่านอื่นๆ ต้องตอบถูก
    return currentStep > 0 && result === 'wrong';
}

// Firebase utils
export function getFirebaseErrorMessage(error) {
    switch (error.code) {
        case 'permission-denied':
            return 'You do not have permission to perform this action.';
        case 'disconnected':
            return 'Lost connection to the server. Please check your internet connection.';
        default:
            return error.message;
    }
}

// Local Storage utils
export const localStorage = {
    set: (key, value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    get: (key) => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },
    remove: (key) => {
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }
};