import { regpCPU } from "./modules/emulator/regpCPU.js";
import { ASM } from "./modules/assembly/assembler.js";
import { DSM } from "./modules/assembly/disassembler.js";

const codeEditor        = document.querySelector(".code-editor");
const byteCodesEditor   = document.querySelector(".bytecodes-editor");
const textResult        = document.querySelector(".results");
const disassembleResult = document.querySelector(".disassemble-result");

const assembleButton    = document.querySelector(".assemble");
const disassembleButton = document.querySelector(".disassemble");
const runButton         = document.querySelector(".run");
const assembleAndRun    = document.querySelector(".assemble-run");
const closeDisassemble  = document.querySelector(".close-disassemble-panel")

const customConsole = {
    log: (result) => {
        textResult.value += result + "\n";
    },
    clear: () => {
        textResult.value = "";
    },
    error: (message) => {
        textResult.value = "ERRO: " + message;
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