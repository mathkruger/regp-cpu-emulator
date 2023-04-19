import { JOYSTICK } from "../common/instructions.js";

const IO = {
    output: {
        canvasCursor: 10,
        fontSize: 14,
        font: "Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,serif",
        colors: ["#33cf04", "#33cf04", "#33cf04"],
        canvas: [null, null, null],
        contexts: [null, null, null],

        initialize(layers) {
            this.canvas = Array.from(layers);
            this.contexts = this.canvas.map(x => x.getContext("2d"));
            this.canvasCursor = 10;
            this.colors = ["#33cf04", "#33cf04", "#33cf04"];

            console.log(this.canvas, this.contexts);
        },

        log(result, layer = 0) {
            let cursor = this.canvasCursor;
    
            if (cursor > this.canvas[layer].height) {
                cursor = 10;
                this.clear();
            }
    
            this.contexts[layer].font = this.fontSize + this.font;
            this.contexts[layer].fillStyle = this.colors[layer];
            this.contexts[layer].fillText(result, 5, cursor);
    
            this.canvasCursor = cursor + this.fontSize;
        },

        clear(layer = 0) {
            this.canvasCursor = 10;
            this.contexts[layer].clearRect(0, 0, this.canvas[layer].width, this.canvas[layer].height);
        },

        clearWithColor(color, layer = 0) {
            this.contexts[layer].fillStyle = color;
            this.contexts[layer].fillRect(0, 0, this.canvas[layer].width, this.canvas[layer].height);
        },

        fillRect(x, y, size = null, color = null, layer = 0) {
            this.contexts[layer].fillStyle = color ? color : this.colors[layer];
            this.contexts[layer].fillRect(x, y, size ? size : this.canvas[layer].width, size ? size : this.canvas[layer].height);
        },

        fillStyle (color, layer = 0) {
            this.colors[layer] = color;
        },

        error (message, layer) {
            this.fillStyle("red", layer);
            this.log("!!!!! ERROR: " + message, layer);
        }
    },
    
    input: {
        inputContainer: null,
        currentPromise: null,

        joystickLastPressed: JOYSTICK.NOKEY,

        initialize(input) {
            this.inputContainer = input;

            this.inputContainer.addEventListener("keyup", (e) => {
                if (e.key === "Enter" && this.currentPromise !== null) {
                    const value = this.inputContainer.value;
                    const resolve = this.currentPromise;

                    this.currentPromise = null;
                    this.inputContainer.value = "";
                    resolve(value);
                }
            });

            this.listenJoystick();
        },

        listenJoystick() {
            this.inputContainer.addEventListener("keydown", (e) => {
                switch(e.key.toLowerCase()) {
                    case "z":
                        this.joystickLastPressed = JOYSTICK.KA;
                        break;
                    case "arrowup":
                        this.joystickLastPressed = JOYSTICK.KU;
                        break;
                    case "arrowright":
                        this.joystickLastPressed = JOYSTICK.KR;
                        break;
                    case "arrowdown":
                        this.joystickLastPressed = JOYSTICK.KD;
                        break;
                    case "arrowleft":
                        this.joystickLastPressed = JOYSTICK.KL;
                        break;
                }
            });

            this.inputContainer.addEventListener("keyup", (e) => {
                switch(e.key.toLowerCase()) {
                    case "z":
                    case "arrowup":
                    case "arrowright":
                    case "arrowdown":
                    case "arrowleft":
                        this.joystickLastPressed = JOYSTICK.NOKEY;
                        break;
                }
            });
        },

        get() {
            return new Promise(resolve => {
                this.currentPromise = resolve;
            });
        },

        getLastJoystickPressed() {
            return this.joystickLastPressed;
        }
    }
};

export {
    IO
};