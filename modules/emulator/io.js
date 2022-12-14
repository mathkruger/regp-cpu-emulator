const IO = {
    output: {
        canvasCursor: 10,
        fontSize: 14,
        font: "Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,serif",
        color: "#33cf04",
        canvas: null,
        context: null,

        initialize(canvas) {
            this.canvas = canvas;
            this.context = this.canvas.getContext("2d");
            this.canvasCursor = 10;
        },

        log(result) {
            let cursor = this.canvasCursor;
    
            if (cursor > this.canvas.height) {
                cursor = 10;
                this.clear();
            }
    
            this.context.font = this.fontSize + this.font;
            this.context.fillStyle = this.color;
            this.context.fillText(result, 5, cursor);
    
            this.canvasCursor = cursor + this.fontSize;
        },

        clear() {
            this.canvasCursor = 10;
            this.context.fillStyle = "black";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        },

        fillRect(x, y, size = null, color = null) {
            this.context.fillStyle = color ? color : this.color;
            this.context.fillRect(x, y, size ? size : this.canvas.width, size ? size : this.canvas.height);
        },

        fillStyle (color) {
            this.color = color;
        },

        error (message) {
            this.canvas.value = "ERRO: " + message;
        }
    },
    
    input: {
        inputContainer: null,
        currentPromise: null,

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
            })
        },

        get() {
            return new Promise(resolve => {
                this.currentPromise = resolve;
            });
        },
    }
};

export {
    IO
};