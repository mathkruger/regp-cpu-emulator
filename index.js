import { CPU } from "./modules/emulator/cpu.js";
import { IO }  from "./modules/emulator/io.js";
import { ASM } from "./modules/assembly/assembler.js";
import { DSM } from "./modules/assembly/disassembler.js";

const app = {
    codeEditor          : null,
    byteCodesEditor     : null,
    disassembleResult   : null,
    terminal            : null,
    terminalInput       : null,
    
    assembleButton      : null,
    disassembleButton   : null,
    runButton           : null,
    assembleAndRun      : null,
    closeDisassemble    : null,
    uploadASMButton     : null,
    uploadASMInput      : null,
    downloadASMButton   : null,
    uploadBytesButton   : null,
    uploadBytesInput    : null,
    downloadBytesButton : null,

    initialize() {
        this.loadElements();
        this.listenEvents();

        IO.input.initialize(this.terminalInput);
        IO.output.initialize(this.terminal);
        CPU.initialize(IO.input, IO.output);
    },

    loadElements() {
        this.codeEditor          = document.querySelector(".code-editor");
        this.byteCodesEditor     = document.querySelector(".bytecodes-editor");
        this.disassembleResult   = document.querySelector(".disassemble-result");
        this.terminal            = document.getElementsByTagName("canvas")[0];
        this.terminalInput       = document.querySelector(".terminal-input");

        this.assembleButton      = document.querySelector(".assemble");
        this.disassembleButton   = document.querySelector(".disassemble");
        this.runButton           = document.querySelector(".run");
        this.assembleAndRun      = document.querySelector(".assemble-run");
        this.closeDisassemble    = document.querySelector(".close-disassemble-panel");

        this.uploadASMButton     = document.querySelector(".upload-code");
        this.uploadASMInput      = document.querySelector(".upload-code-input");
        this.downloadASMButton   = document.querySelector(".download-code");
        this.uploadBytesButton   = document.querySelector(".upload-bytes");
        this.uploadBytesInput    = document.querySelector(".upload-bytes-input");
        this.downloadBytesButton = document.querySelector(".download-bytes");
    },

    listenEvents() {
        this.assembleButton.addEventListener("click", () => {
            this.assembleCode()
        });

        this.disassembleButton.addEventListener("click", () => {
            this.disassembleCode();
        });

        this.runButton.addEventListener("click", () => {
            this.runCode();
        });

        this.assembleAndRun.addEventListener("click", () => {
            this.assembleCode();
            this.runCode();
        });

        this.closeDisassemble.addEventListener("click", () => {
            this.disassembleResult.parentElement.classList.add("closed");
        });

        this.uploadASMButton.addEventListener("click", () => {
            this.uploadASMInput.click();
        });

        this.uploadASMInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            this.uploadContent(this.codeEditor, file);
        });

        this.downloadASMButton.addEventListener("click", () => {
            this.downloadContent(this.codeEditor, ".asm");
        });

        this.uploadBytesButton.addEventListener("click", () => {
            this.uploadBytesInput.click();
        });

        this.uploadBytesInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            this.uploadContent(this.byteCodesEditor, file);
        });

        this.downloadBytesButton.addEventListener("click", () => {
            this.downloadContent(this.byteCodesEditor, "");
        });
    },

    disassembleCode() {
        this.disassembleResult.parentElement.classList.remove("closed");
    
        const byteCodes                  = this.byteCodesEditor.value.split(",").map(x => parseInt(x));
        const asmCode                    = DSM.disassemble(byteCodes);
        this.disassembleResult.innerHTML = asmCode;
    },
    
    assembleCode() {
        const program  = this.codeEditor.value;
        const bytes    = ASM.assemble(program);
        this.byteCodesEditor.value = bytes;
    },
    
    runCode() {
        const bytes = this.byteCodesEditor.value.split(",").map(x => parseInt(x));

        IO.output.clear();

        CPU.load(bytes);
        CPU.run();
    },

    downloadContent(container, extension) {
        const content = container.value;
        const link = document.createElement("a");
        const mimeType = "text/plain";

        link.setAttribute("download", "export" + extension);
        link.setAttribute("href", "data:" + mimeType  +  ";charset=utf-8," + encodeURIComponent(content));
        link.click(); 
    },

    uploadContent(container, file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = (txt) => {
            container.value = txt.target.result;
        };
    }
}

app.initialize();