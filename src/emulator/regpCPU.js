import { INSTRUCTIONS, STRING_STOPPER } from "../common/instructions.js";
import * as readline from "readline-sync";

const regpCPU = {
    regs: [0, 0, 0, 0],
    stack: [],
    pc: 0,
    halted: false,
    program: [],
    
    load(program) {
        this.program = program;
    },

    run() {
        while (!this.halted) {
            this.runOne();
        }
    },

    runOne() {
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
                console.log(this.regs[register]);
            break;

            case INSTRUCTIONS.PRINTS:
                this.pc++;
                var totalString = "";

                if (this.program[this.pc++] === STRING_STOPPER) {
                    while(this.program[this.pc++] !== STRING_STOPPER) {
                        totalString += String.fromCharCode(this.program[this.pc-1]);
                    }
                }

                console.log(totalString);
            break;

            case INSTRUCTIONS.SCAN:
                this.pc++;
                var register = this.program[this.pc++];
                var userInput = readline.question("");
                this.regs[register] = parseInt(userInput);
            break;

            case INSTRUCTIONS.HALT:
                this.pc++;
                this.halted = true;
            break;

            default:
                console.error("Instruction not recognized: " + instr);
                process.exit(instr);
            break;
        }
    }
}

export {
    regpCPU
};