import { regpCPU } from "./modules/emulator/regpCPU.js";
import { ASM } from "./modules/assembly/assembler.js";
import { DSM } from "./modules/assembly/disassembler.js";

// Panels
const codeEditor        = document.querySelector(".code-editor");
const byteCodesEditor   = document.querySelector(".bytecodes-editor");
const results           = document.getElementsByTagName("canvas")[0];
const disassembleResult = document.querySelector(".disassemble-result");

// Buttons
const assembleButton    = document.querySelector(".assemble");
const disassembleButton = document.querySelector(".disassemble");
const runButton         = document.querySelector(".run");
const assembleAndRun    = document.querySelector(".assemble-run");
const closeDisassemble  = document.querySelector(".close-disassemble-panel");

const terminalConfigs = {
    canvasCursor: 0,
    fontSize: 14,
    font: "Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,serif",
    color: "#33cf04",
};

// IO
const customConsole = {
    log: (result) => {
        results.getContext("2d").font = terminalConfigs.fontSize + terminalConfigs.font;
        results.getContext("2d").fillStyle = terminalConfigs.color;
        results.getContext("2d").fillText(result, 5, terminalConfigs.canvasCursor + 4);

        terminalConfigs.canvasCursor += terminalConfigs.fontSize + 4;
    },
    clear: () => {
        terminalConfigs.canvasCursor = 10;
        results.getContext("2d").fillStyle = "black";
        results.getContext("2d").fillRect(0, 0, results.width, results.height);
    },
    fillRect: (x, y, size = null, color = null) => {
        results.getContext("2d").fillStyle = color ? color : terminalConfigs.color;
        results.getContext("2d").fillRect(x, y, size ? size : results.width, size ? size : results.height);
    },
    fillStyle: (color) => {
        results.getContext("2d").fillStyle = color;
    },
    error: (message) => {
        results.value = "ERRO: " + message;
    }
};

const customInput = () => {
    return new Promise(resolve => {
        const input = document.querySelector(".terminal-input");
    
        window.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                const value = input.value;

                customConsole.log(value);
                input.value = "";
                
                resolve(value);
            }
        });
    });
};

// Assemble, disassemble and run
const disassembleCode = () => {
    disassembleResult.parentElement.classList.remove("closed");

    const byteCodes  = byteCodesEditor.value.split(",").map(x => parseInt(x));
    const asmCode = DSM.disassemble(byteCodes);
    disassembleResult.innerHTML = asmCode;
};

const assembleCode = () => {
    const program  = codeEditor.value;
    const bytes    = ASM.assemble(program);
    byteCodesEditor.value = bytes;
}

const runCode = () => {
    customConsole.clear();

    const bytes = byteCodesEditor.value.split(",").map(x => parseInt(x));
    regpCPU.load(bytes, customConsole, customInput.bind(this));
    regpCPU.run();
};

// Buttons event handling
assembleButton.addEventListener("click", assembleCode);
disassembleButton.addEventListener("click", disassembleCode);
runButton.addEventListener("click", runCode);
assembleAndRun.addEventListener("click", () => {
    assembleCode();
    runCode();
});

closeDisassemble.addEventListener("click", () => {
    disassembleResult.parentElement.classList.add("closed");
});