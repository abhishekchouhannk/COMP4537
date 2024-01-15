// user.js

// Constants for messages
const UserEnum = {
    GAME_STARTED: "Game Started!!",
    WRONG: "Wrong Order!",
    WIN: "Excellent Memory!",
    NUM_BUTTONS: "How many buttons to create?",
    INVALID_INPUT: "Invalid Input. Please enter num b/w 3-7"
};

// Colors for messages
const UserColors = {
    GAME_STARTED: "blue",
    WIN: "green",
    WRONG: "red",
};

// Add the enums and colors to the global scope
window.UserEnum = UserEnum;
window.UserColors = UserColors;
