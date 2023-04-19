import { INSTRUCTIONS, STRING_STOPPER } from "../common/instructions.js";

const CPU = {
    regs: [0, 0, 0, 0, 0, 0, 0],
    stack: [],
    clock: 0,
    pc: 0,
    halted: false,
    program: [],
    input: null,
    output: null,
    speaker: null,

    initialize(input, output, speaker) {
        this.reset();
        this.input = input;
        this.output = output;
        this.speaker = speaker;
    },

    load(program) {
        this.reset();
        this.program = program;
    },

    reset() {
        this.regs      = [0, 0, 0, 0, 0, 0, 0];
        this.stack     = [];
        this.pc        = 0;
        this.halted    = false;
        this.program   = [];
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

            case INSTRUCTIONS.JE:
                this.pc++;
                var r1      = this.program[this.pc++];
                var r2      = this.program[this.pc++];
                var address = this.program[this.pc++];

                if (this.regs[r1] === this.regs[r2]) {
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
                var layer    = this.program[this.pc++];
                var register = this.program[this.pc++];
                this.output.log(this.regs[register], layer);
            break;

            case INSTRUCTIONS.PRINTS:
                this.pc++;
                var layer = this.program[this.pc++];
                var text  = this.readString();
                this.output.log(text, layer);
            break;

            case INSTRUCTIONS.SCAN:
                this.pc++;
                var register = this.program[this.pc++];
                var userInput = await this.input.get();
                this.regs[register] = parseInt(userInput);
                this.output.log(this.regs[register]);
            break;

            case INSTRUCTIONS.GRKEY:
                this.pc++;
                var register = this.program[this.pc++];
                var userInput = this.input.getLastJoystickPressed();

                this.regs[register] = parseInt(userInput);
            break;

            case INSTRUCTIONS.CLS:
                this.pc++;
                var layer = this.program[this.pc++];
                this.output.clear(layer);
            break;

            case INSTRUCTIONS.CLSC:
                this.pc++;
                var layer = this.program[this.pc++];
                var color = this.readString();
                this.output.clearWithColor(color, layer);
            break;

            case INSTRUCTIONS.PLOT:
                this.pc++;
                var layer = this.program[this.pc++];
                var xPos = this.program[this.pc++];
                var yPos = this.program[this.pc++];
                var size = this.program[this.pc++];
                
                this.output.fillRect(xPos, yPos, size, null, layer);
            break;

            case INSTRUCTIONS.PLOTR:
                this.pc++;
                var layer = this.program[this.pc++];
                var xPos = this.regs[this.program[this.pc++]];
                var yPos = this.regs[this.program[this.pc++]];
                var size = this.program[this.pc++];

                console.log(layer, xPos, yPos);
                
                this.output.fillRect(xPos, yPos, size, null, layer);
            break;

            case INSTRUCTIONS.BKG:
                this.pc++;
                var layer = this.program[this.pc++];
                var color = this.readString();

                this.output.fillRect(0, 0, null, color, layer);
            break;

            case INSTRUCTIONS.FRG:
                this.pc++;
                var layer = this.program[this.pc++];
                var color = this.readString();

                this.output.fillStyle(color, layer);
            break;

            case INSTRUCTIONS.BEEPV:
                this.pc++;
                var duration  = this.program[this.pc++];
                var frequency = this.program[this.pc++];

                await this.speaker.beep(duration, frequency);
            break;

            case INSTRUCTIONS.BEEPR:
                this.pc++;
                var duration  = this.regs[this.program[this.pc++]];
                var frequency = this.regs[this.program[this.pc++]];

                await this.speaker.beep(duration, frequency);
            break;

            case INSTRUCTIONS.SLEEP:
                this.pc++;

                var duration = this.program[this.pc++];

                await this.sleep(duration);
            break;

            case INSTRUCTIONS.HALT:
                this.pc++;
                this.halted = true;
            break;

            default:
                this.output.error("Instruction not recognized: " + instr);
                this.halted = true;
            break;
        }

        await new Promise(resolve => setTimeout(() => resolve(true), this.clock));
    },
    readString() {
        var totalString = "";

        if (this.program[this.pc++] === STRING_STOPPER) {
            while(this.program[this.pc++] !== STRING_STOPPER) {
                totalString += String.fromCharCode(this.program[this.pc-1]);
            }
        }

        return totalString;
    },

    sleep(duration) {
        return new Promise(resolve => setTimeout(() => resolve(true), duration));
    }
}

export {
    CPU
};