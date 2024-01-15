import * as userConstants from '../lang/messages/en/user.js'

console.log("Client script loaded")

const colorArray = ["red", "green", "cyan", "beige", "purple", "yellow", "blue"]
const startingXValue = 20;
const gapButtons = 250;
const verticalGap = 100;

// button dimensions
const buttonWidth = 150;

// purely chatgpt function
function generateRandomValue(minValue, maxValue) {
    // Generate a random number between 0 (inclusive) and 1 (exclusive)
    const randomFraction = Math.random();

    // Scale the random number to the range [minValue, maxValue)
    const randomValue = minValue + randomFraction * (maxValue - minValue);

    return randomValue;
}

class Button {
    constructor(x, y, color, id, container, game) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id; 
        this.active = false;
        // div that contains the button 
        this.container = container;

        this.buttonRef = document.createElement("button");

        this.buttonRef.addEventListener('click', () => {
            if (this.active) {
                console.log(`Button with id ${this.id} clicked.`);
                game.handleClicks(this, this.id)
            }
        });
    }

    display() {

        // set attributes of the specific button element
        this.buttonRef.className = "custom-button";

        this.buttonRef.style.left = `${this.x}px`;
        this.buttonRef.style.top = `${this.y}px`;

        this.buttonRef.style.backgroundColor = this.color;

        // append the button to the container
        this.container.appendChild(this.buttonRef);
    }

    displayText(text) {
        this.buttonRef.textContent = text;
    }

    hideText() {
        this.buttonRef.textContent = "";
    }

    activateButton() {
        this.active = true;
    }

    deactivateButton() {
        this.active = false;
    }

    randomizePosition() {
        console.log("buttons scrambled")
        const container = document.getElementById("container");
        const containerWidth = document.body.offsetWidth;
        const containerHeight = window.innerHeight - this.container.getBoundingClientRect().top;
        // console.log(currentWidth);
        this.buttonRef.style.left = `${generateRandomValue(20, containerWidth - buttonWidth - 10)}px`;
        this.buttonRef.style.top = `${generateRandomValue(10, containerHeight - 10 - 80)}px`
    }
}

class Game {
    constructor() {
        // initiliaze an array of required size containing all button objects
        this.buttonArray = Array(0);
        this.intervalId = null;
        this.displayElement = null;
        this.nextButtonToBeClicked = 1; // 1 is the first button to be clicked
        this.handleResize = () => {
            const newWidth = document.body.offsetWidth;

            // Remove the existing container
            const container = document.getElementById('container');

            if (container) {
                container.remove();
            }

            this.showButtons(this.buttonArray.length, newWidth);
        }
    }

    startGameLoop(intervalSeconds) {
        
        this.displayMsg(UserEnum.GAME_STARTED, UserColors.GAME_STARTED, 3);

        // Clear any previous intervals if they exist
        clearInterval(this.intervalId);

        window.removeEventListener('resize', this.handleResize);

        this.buttonArray.forEach(button => {
            setTimeout(() => {
                button.hideText();
            }, (intervalSeconds - 1) * 1000);
        });

        this.intervalId = setInterval( () => {
            this.buttonArray.forEach(button => {
                button.randomizePosition();
                button.activateButton();
            });
        }, intervalSeconds * 1000); // has to be in milliseconds
    }

    stopGameLoop(text, color) {
        this.displayMsg(text, color, 10);

        // Clear the interval running game loop
        clearInterval(this.intervalId);

        this.buttonArray.forEach(button => {
            button.displayText(button.id);
            button.deactivateButton();
        });
    }

    restart() {

        // clear any existing interval which were set for scrambling buttons
        clearInterval(this.intervalId);

        this.buttonArray = Array(0);
        this.intervalId = null;
        this.displayElement = null;
        this.nextButtonToBeClicked = 1;
        
        // empty the container
        const container = document.getElementById('container');
        if (container) {
            container.remove();
        }
    }

    displayMsg(text, textColor, timeToDisplay) {
        this.displayMsgElement.textContent = text;
        this.displayMsgElement.style.color = textColor;

        setTimeout( () => {
            this.displayMsgElement.textContent = "";
            this.displayMsgElement.style.color = "white";
        }, timeToDisplay * 1000); // 2 secs is the duration to display msg
    }

    handleClicks(buttonClicked, buttonClickedId) {
        console.log("handleClicks function triggered from game")
        if (buttonClickedId == this.nextButtonToBeClicked 
            && buttonClickedId == this.buttonArray.length) {
            // stop game and display win message.
            console.log("Win");
            this.stopGameLoop(UserEnum.WIN, UserColors.WIN);
        } else if (buttonClickedId == this.nextButtonToBeClicked) {
            console.log("Correct")
            this.nextButtonToBeClicked++;
            buttonClicked.displayText(buttonClicked.id);
            buttonClicked.deactivateButton();
        } else {
            console.log("wrong button clicked.")
            this.stopGameLoop(UserEnum.WRONG, UserColors.WRONG);
        }
    }


    setup() {
        const minButtons = 3;
        const maxButtons = 7;

        function checkValidity(num) {
            return num >= minButtons && num <= maxButtons;
        }

        function createInputElement() {
            const inputElement = document.createElement("input");
            inputElement.id = "input";
            inputElement.type = "text";
            inputElement.placeholder = "Enter no. of buttons";
            inputElement.min = 3;
            inputElement.max = 7;
            inputElement.pattern = "\\d+"; //Only allow digits

            return inputElement;
        }

        // Create a div to hold input and button
        const divElement = document.createElement("div");
        divElement.id = "initialDiv";
        divElement.style.display = "flex";
        divElement.style.flexDirection = "column"; // Stack children vertically

        // Create text element
        const paraElement = document.createElement("p");
        paraElement.textContent = UserEnum.NUM_BUTTONS;

        // Create input element
        const inputElement = createInputElement();

        // Create display message element
        const displayElement = document.createElement("p");
        this.displayMsgElement = displayElement;
                        
        // Create button element
        const buttonElement = document.createElement("button");
        buttonElement.innerHTML = "GO";
        buttonElement.addEventListener('click', () => {
            // Check if input is valid
            if (checkValidity(parseInt(inputElement.value))) {
                this.restart();
                this.showButtons(parseInt(inputElement.value), document.body.offsetWidth);
                this.setupResizeListener();
                this.startGameLoop(this.buttonArray.length);
            } else {
                console.log("Invalid Input. Please try again.")
                this.displayMsg(UserEnum.INVALID_INPUT, UserColors.WRONG, 1.5);
            }
        });

        // Append input and button to the div for the very first thing
        divElement.appendChild(paraElement);
        divElement.appendChild(inputElement);
        divElement.appendChild(displayElement);
        divElement.appendChild(buttonElement);

        // Append the div to the body
        document.body.appendChild(divElement);
    }

    setupResizeListener() {
        window.addEventListener('resize', this.handleResize);
    }

    showButtons(n, width) {

        const container = document.createElement("div");
        container.id = "container";
        // const container = document.getElementById('container');

        let currentRow = 0;
        let currentCol = 0;

        for (let i = 0; i < n; i++) {
            let startXi = startingXValue + currentCol * gapButtons;

            if (startXi >= width - buttonWidth - 10) {
                currentCol = 0;
                currentRow++;
            }
            this.buttonArray[i] = new Button(startingXValue + currentCol * gapButtons, currentRow * verticalGap, colorArray[i], i + 1, container, this);
            this.buttonArray[i].display();
            this.buttonArray[i].displayText(i + 1);
            currentCol++;
        }
        document.body.appendChild(container);
    }
}



let game = new Game(1);
game.setup()
// game.showButtons(7);
// game.setupResizeListener();
































    // showButtons(n) {
    //     const container = document.createElement("div");
    //     container.id = "container";

    //     const currentWidth = document.body.offsetWidth;
    //     console.log(currentWidth);
        
    //     // container.textContent = "Div for container";

    //     let currentRow = 0;
    //     let currentCol = 0;

    //     for (let i = 0; i < n; i++) { // i counts the number of buttons to stuff in whereas row and column count where the buttons should go
    //         let startXi = startingXValue + currentCol * gapButtons;

    //         if (startXi >= currentWidth - buttonWidth - 10) {
    //             console.log(`condition triggered, ${i},`)
    //             currentCol = 0;
    //             currentRow++;
    //         }
    //         this.buttonArray[i] = new Button(startingXValue + currentCol * gapButtons, currentRow * verticalGap, "orange", container);
    //         this.buttonArray[i].display();
    //         currentCol++; // increment the column
    //     }

    //     document.body.appendChild(container);
    // }

