import { INSTRUCTIONS, STRING_STOPPER } from "../common/instructions.js";

const CPU = {
    regs: [0, 0, 0, 0, 0],
    stack: [],
    pc: 0,
    halted: false,
    program: [],
    input: null,
    output: null,

    initialize(input, output) {
        this.reset();
        this.input = input;
        this.output = output;
    },

    load(program) {
        this.reset();
        this.program = program;
    },

    reset() {
        this.regs = [0, 0, 0, 0];
        this.stack = [];
        this.pc = 0;
        this.halted = false;
        this.program = [];
        this.canvas = null;
        this.canvasCtx = null;
    },

    async run() {
        while (!this.halted) {
            await this.runOne();
        }

        this.reset();
    },

    async runOne() {
        if (this.halted) return;

        const instr = this.program[this.pc];

        switch (instr) {
            case INSTRUCTIONS.MOVR:
                this.pc++;
                var registerDestination         = this.program[this.pc++];
                var registerSource              = this.program[this.pc++];
                this.regs[registerDestination]  = this.regs[registerSource];
            break;

            case INSTRUCTIONS.MOVV:
                this.pc++;
                var registerDestination        = this.program[this.pc++];
                var value                      = this.program[this.pc++];
                this.regs[registerDestination] = value;
            break;
            
            case INSTRUCTIONS.ADD:
                this.pc++;
                var registerDestination         = this.program[this.pc++];
                var registerSource              = this.program[this.pc++];
                this.regs[registerDestination] += this.regs[registerSource];
            break;

            case INSTRUCTIONS.SUB:
                this.pc++;
                var registerDestination         = this.program[this.pc++];
                var registerSource              = this.program[this.pc++];
                this.regs[registerDestination] -= this.regs[registerSource];
            break;

            case INSTRUCTIONS.PUSH:
                this.pc++;
                var registerSource = this.program[this.pc++];
                this.stack.push(this.regs[registerSource]);
            break;

            case INSTRUCTIONS.POP:
                this.pc++;
                var registerDestination = this.program[this.pc++];
                this.regs[registerDestination] = this.stack.pop();
            break;

            case INSTRUCTIONS.JP:
                this.pc++;
                var address = this.program[this.pc++];
                this.pc     = address;
            break;

            case INSTRUCTIONS.JL:
                this.pc++;
                var r1      = this.program[this.pc++];
                var r2      = this.program[this.pc++];
                var address = this.program[this.pc++];
                if (this.regs[r1] < this.regs[r2]) {
                    this.pc = address;
                }
            break;

            case INSTRUCTIONS.CALL:
                this.pc++;
                var address = this.program[this.pc++];
                this.stack.push(this.pc);
                this.pc = address;
            break;

            case INSTRUCTIONS.FLAG:
                // does nothing, just means that a flag was called
                this.pc++;
            break;

            case INSTRUCTIONS.RET:
                this.pc++;
                var address = this.stack.pop();
                this.pc = address;
            break;

            case INSTRUCTIONS.PRINT:
                this.pc++;
                var register = this.program[this.pc++];
                this.output.log(this.regs[register]);
            break;

            case INSTRUCTIONS.PRINTS:
                this.pc++;
                var text = this.readString();
                this.output.log(text);
            break;

            case INSTRUCTIONS.SCAN:
                this.pc++;
                var register = this.program[this.pc++];
                var userInput = await this.input.get();
                this.regs[register] = parseInt(userInput);
                this.output.log(this.regs[register]);
            break;

            case INSTRUCTIONS.CLS:
                this.pc++;
                this.output.clear();
            break;

            case INSTRUCTIONS.PLOT:
                this.pc++;
                var xPos = this.program[this.pc++];
                var yPos = this.program[this.pc++];
                var size = this.program[this.pc++];
                
                this.output.fillRect(xPos, yPos, size);
            break;

            case INSTRUCTIONS.PLOTR:
                this.pc++;
                var xPos = this.regs[this.program[this.pc++]];
                var yPos = this.regs[this.program[this.pc++]];
                var size = this.regs[this.program[this.pc++]];
                
                this.output.fillRect(xPos, yPos, size);
            break;

            case INSTRUCTIONS.BKG:
                this.pc++;
                var color = this.readString();

                this.output.fillRect(0, 0, null, color);
            break;

            case INSTRUCTIONS.FRG:
                this.pc++;
                var color = this.readString();

                this.output.fillStyle(color);
            break;

            case INSTRUCTIONS.HALT:
                this.pc++;
                this.halted = true;
            break;

            default:
                console.error("Instruction not recognized: " + instr);
                this.halted = true;
            break;
        }
    },
    readString() {
        var totalString = "";

        if (this.program[this.pc++] === STRING_STOPPER) {
            while(this.program[this.pc++] !== STRING_STOPPER) {
                totalString += String.fromCharCode(this.program[this.pc-1]);
            }
        }

        return totalString;
    }
}

export {
    CPU
};