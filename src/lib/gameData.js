// src/lib/gameData.js

export const scenarios = [
    {
        situation: "P is about to meet Wai, the security guard 👮🏻‍♂️",
        question: "How should P greet Wai? 👋",
        choices: [
            "Hi! I'm P from the Sales team. What's your name?",
            "Hey! You look scary! What's your name?"
        ],
        correctChoice: 0,
        waiResponse: "Hello, I'm Wai from Security. Nice to meet you! Is this your first day here? 🤝",
        failReason: "First impressions matter! Commenting on someone's appearance negatively is unprofessional."
    },
    {
        situation: "Wai is asking if it's P's first day at work?",
        question: "How should P respond? 🤔",
        choices: [
            "Yes, but I bet my salary is higher than an old security guard like you!",
            "Yes, it's my first day. I'm getting to know my coworkers and learning about the systems here.",
        ],
        correctChoice: 1,
        waiResponse: "That's good. Which university did you graduate from? 🎓",
        failReason: "Never make assumptions or brag about salary. It creates a negative work environment."
    },
    {
        situation: "Wai is asking for which university P graduated from",
        question: "What should P say? 💭",
        choices: [
            "Oh, I have a degree from MIT. I guess you wouldn't understand what that means in your position.",
            "I graduated from MIT Business School. That's why I'm interested in sales. How long have you worked here, Wai?",
        ],
        correctChoice: 1,
        waiResponse: "Ten years now. You look fit - do you work out?",
        failReason: "Education is not a competition. Always show respect for others regardless of their position."
    },
    {
        situation: "Wai is asking if P works out 🏋️",
        question: "How should P respond? 🤔",
        choices: [
            "Yes, I exercise regularly. It helps me work better!",
            "Yeah, Look at that belly! Must be nice getting paid to sit and get fat, while real workers like me actually do something!"
        ],
        correctChoice: 0,
        waiResponse: "That's good. This company really cares about employee health. 💪🏻",
        failReason: "Body shaming is never okay. Always maintain a positive and respectful attitude."
    },
    {
        situation: "Ending the conversation with Wai 👋",
        question: "What should P say? 🤝",
        choices: [
            "Really? But why is our boss so fat then?",
            "I'm happy to work at a company that cares about its employees. Hope to see you around!"
        ],
        correctChoice: 1,
        waiResponse: "Nice meeting you too. Hope you enjoy working here! 😊",
        failReason: "Always maintain a positive attitude and avoid negative comments about others."
    }
];