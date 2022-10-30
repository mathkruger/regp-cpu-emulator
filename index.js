import { CPU }      from "./modules/emulator/cpu.js";
import { IO }       from "./modules/emulator/io.js";
import { SPEAKER }  from "./modules/emulator/speaker.js";
import { ASM }      from "./modules/assembly/assembler.js";
import { DSM }      from "./modules/assembly/disassembler.js";

import { EventsHandler } from "./modules/common/events-handler.js";

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
    maximizeButtons     : null,

    initialize() {
        this.loadElements();
        this.listenEvents();
        this.setupEmulator();
    },

    setupEmulator() {
        IO.input.initialize(this.terminalInput);
        IO.output.initialize(this.terminal);
        SPEAKER.initialize();

        CPU.initialize(IO.input, IO.output, SPEAKER);
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
        this.maximizeButtons     = document.querySelectorAll(".maximize-button");

        this.codeEditor.value    = `PRINTS "HEY REGP!"\nHALT`;
    },

    listenEvents() {
        EventsHandler.click(this.assembleButton, () => {
            this.assembleCode();
        });

        EventsHandler.click(this.disassembleButton, () => {
            this.disassembleCode();
        });

        EventsHandler.click(this.runButton, () => {
            this.runCode();
        });

        EventsHandler.click(this.assembleAndRun, () => {
            this.assembleCode();
            this.runCode();
        });

        EventsHandler.click(this.closeDisassemble, () => {
            this.disassembleResult
            .parentElement
            .parentElement
            .parentElement.classList.add("closed");
        });

        EventsHandler.click(this.uploadASMButton, () => {
            this.uploadASMInput.click();
        });

        EventsHandler.change(this.uploadASMInput, () => {
            this.uploadContent(this.codeEditor, e);
        });

        EventsHandler.click(this.downloadASMButton, () => {
            this.downloadContent(this.codeEditor, ".asm");
        });

        EventsHandler.click(this.uploadBytesButton, () => {
            this.uploadBytesInput.click();
        });

        EventsHandler.change(this.uploadBytesInput, () => {
            this.uploadContent(this.byteCodesEditor, e);
        });

        EventsHandler.click(this.downloadBytesButton, () => {
            this.downloadContent(this.byteCodesEditor, "");
        });

        EventsHandler.click(Array.from(this.maximizeButtons), (button) => {
            this.toggleMaximizeContainer(button.dataset.container);
        });
    },

    disassembleCode() {
        this.disassembleResult
        .parentElement
        .parentElement
        .parentElement.classList.remove("closed");
    
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
        link.EventsHandler.click(); 
    },

    uploadContent(container, e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = (txt) => {
            container.value = txt.target.result;
        };
    },

    toggleMaximizeContainer(container) {
        document.getElementById(container).classList.toggle("maximized");
    },
}

app.initialize();