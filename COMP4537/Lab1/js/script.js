console.log("Client script loaded")

const updateInterval = 2 * 1000; // 2000 milliseconds; 2 seconds
const statusMessage =  window.location.pathname.includes("writer") ? Placeholders.WRITE_STATUS : Placeholders.READ_STATUS;

function getCurrentTime() {
    const currentDate = new Date();

    // Get hours, minutes, and seconds
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();

    // Determine AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    // Add leading zeros to minutes and seconds if needed
    minutes = padZero(minutes);
    seconds = padZero(seconds);

    // Assemble the formatted time string
    const formattedTime = `${hours}:${minutes}:${seconds} ${amOrPm}`;

    return formattedTime;
}

function padZero(number) {
    return number < 10 ? '0' + number : number;
}

function updateStatus() {
    const statusDiv = document.getElementById('status');

    statusDiv.textContent = `${statusMessage}: ${getCurrentTime()}`
}


class DB {
    constructor() {
        this.texts = Array(0);
    }

    changeData(textArr) {
        this.texts = textArr;
    }

    read() {
        // retrieve the stringfied text array 
        const textsArrayString = localStorage.getItem('texts');

        // parse the stringified object to get back original array
        const data = JSON.parse(textsArrayString);

        this.texts = data;

        return data;
    }

    write() {
        // convert array to a json string
        const textsArrayString = JSON.stringify(this.texts);

        // Store the JSON string in local storage with a key (to be used to re-access)
        localStorage.setItem('texts', textsArrayString);
    }
}

class Widget {
    constructor(id, contentManagerRef) {
        this.text = "";
        this.id = id;
        this.textAreaRef = null;
        this.contentManagerRef = contentManagerRef;
    }

    // common part to writable and readable widget that creates a container and
    // text area within the widget
    createRow() {
        // create the div for row
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('widget');

        // create text area element
        const textarea = document.createElement('textarea');
        textarea.classList.add('text-area');
        textarea.placeholder = Placeholders.WRITE;
        // textarea.oninput = autoExpand(textarea);
        this.textAreaRef = textarea;

        return {rowContainer, textarea}
    }

    createWritableWidget(text) {
        const {rowContainer, textarea} = this.createRow();

        if (text != undefined && text != null) {
            textarea.value = text;
        }

        

        // create the button element
        const button = document.createElement('button');
        button.classList.add('widgetButton');
        button.textContent = 'Remove';
        this.buttonRef = button;

        // attach event listener for button clicks, and exchanging information with
        // content manager
        button.addEventListener('click', () => {
            rowContainer.parentNode.removeChild(rowContainer);

            this.contentManagerRef.widgets = this.contentManagerRef.widgets.slice(0, this.id)
                .concat(this.contentManagerRef.widgets.slice(this.id + 1));
            
            this.contentManagerRef.updateWidgetIds();
        });

        // append textarea and button to the container div
        rowContainer.appendChild(textarea);
        rowContainer.appendChild(button);

        // append the container div to the main container div
        const container = document.getElementById('container');
        container.appendChild(rowContainer);
    }

    createReadableWidget(text) {
        const {rowContainer, textarea} = this.createRow();

        textarea.setAttribute('readonly', true);

        textarea.value = text;
        textarea.placeholder = Placeholders.READ;

        rowContainer.append(textarea);

        const container = document.getElementById('container');

        container.appendChild(rowContainer);

        // create text area element for read only

    }

    displayText(text) {
        this.textAreaRef.textContent = text;
    }

    // update the widget ids when an element is removed,
    // necessary when the button removed is in between, because the order may get 
    // messed up out of order
    updateId(id) {
        this.id = id;
    }
}

class ContentManager {
    constructor() {
        this.db = new DB();
        this.editable = false; // false by default
        this.widgets = [];

        setInterval(() => {
            updateStatus();

            if (window.location.pathname.includes("writer")) {
                this.writeToStorage();
            } else {  // else read mode
                this.displayFromStorage();
            }
        }, updateInterval);
    }

    initializeWriter() {
        const textarr = this.db.read();

        textarr.forEach((text) => {
            const widget = new Widget(this.widgets.length, this);
            widget.createWritableWidget(text);
            this.widgets.push(widget);
        });
    }

    displayContent() {
        // get path of the current URL
        const path = window.location.pathname;

        // disable/enable buttons based on what page it is
        if (path.includes("writer")) {
            this.editable = true
        }

        // create p element to display status of reads and writes
        const fixedText = document.createElement('p');
        fixedText.textContent = window.location.pathname.includes("writer") ? Placeholders.WRITE_STARTED : Placeholders.READ_STARTED;
        fixedText.id = 'status';


        const addButton = document.createElement('button');
        addButton.textContent = 'add';
        addButton.id = 'addButton';
        addButton.addEventListener('click', () => {
            this.addWidget();
        });

        if (!this.editable) {
            addButton.style.display = 'none';
        }
        // container div for texts
        const container = document.createElement('div');
        container.id = 'container';

        // append fixedText and container to body
        container.appendChild(fixedText);
        document.body.appendChild(container);
        document.body.appendChild(addButton);

        // add the button that takes back to index
        var link = document.createElement('a');
        link.href = '../index.html';
        link.textContent = 'Back to MAIN';

        // Append the anchor element to the body
        document.body.appendChild(link);

        if (this.editable) {
            this.initializeWriter();
        }
    }

    writeToStorage() {
        // Select all child elements of container that are textareas
        const childElements = document.querySelectorAll('#container .text-area');

        const textArr = [];


        childElements.forEach((element) => {
            textArr.push(element.value);
        });

        console.log(textArr)


        // send the text array to the db
        this.db.changeData(textArr);

        // write to the storage using the db's write method
        this.db.write();
    }

    displayFromStorage() {
        console.log(this.db.read());

        // clear all child rows of container before adding updated text
        const container = document.getElementById('container');

        // Remove all children except the first one (status div)
        while (container.children.length > 1) {
            container.removeChild(container.children[1]);
        }
        // clear previous buttons
        this.widgets.length = 0;

        // add new text
        if (this.db.texts.length != 0) {
            for (let i = 0; i < this.db.texts.length; i++) {
                const widget = new Widget(this.db.texts.length, this);
                widget.createReadableWidget(this.db.texts[i]);
            }
            // this.db.texts.forEach((text) => {
            //     const widget = new Widget(this.db.texts.length, this);
            //     widget.createReadableWidget(text);
            // });
        } 
    }

    addWidget(text) {
        const widget = new Widget(this.widgets.length, this);
        widget.createWritableWidget(text);

        this.widgets.push(widget);
    }

    updateWidgetIds() {
        for (let i = 0; i < this.widgets.length; i++) {
            this.widgets[i].updateId(i);   
        }
    }
}

const cn = new ContentManager();
cn.displayContent();



