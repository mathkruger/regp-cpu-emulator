import { INSTRUCTIONS, REGISTERS, STRING_STOPPER } from "../common/instructions.js";

const DSM = {
    pc: 0,
    byteCodes: [],
    asmCode: [],

    load(byteCodes) {
        this.byteCodes = byteCodes;
    },

    run() {
        do {
            this.disassemble();
        } while (this.pc < this.byteCodes.length);

        return this.asmCode.map(x => {
            return x.join(" ");
        }).join("\n");
    },

    disassemble() {
        const instruction = this.byteCodes[this.pc];
        
        switch (instruction) {
            case INSTRUCTIONS.MOVR:
                this.pc++;
                var registerDestination = this.byteCodes[this.pc++];
                var registerSource      = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "MOVR",
                    this.getKeyByValue(REGISTERS, registerDestination),
                    this.getKeyByValue(REGISTERS, registerSource),
                ]);
            break;

            case INSTRUCTIONS.MOVV:
                this.pc++;
                var registerDestination = this.byteCodes[this.pc++];
                var value               = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "MOVV",
                    this.getKeyByValue(REGISTERS, registerDestination),
                    value.toString(),
                ]);
            break;

            case INSTRUCTIONS.ADD:
                this.pc++;
                var registerDestination = this.byteCodes[this.pc++];
                var registerSource      = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "ADD",
                    this.getKeyByValue(REGISTERS, registerDestination),
                    this.getKeyByValue(REGISTERS, registerSource),
                ]);
            break;

            case INSTRUCTIONS.SUB:
                this.pc++;
                var registerDestination = this.byteCodes[this.pc++];
                var registerSource      = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "SUB",
                    this.getKeyByValue(REGISTERS, registerDestination),
                    this.getKeyByValue(REGISTERS, registerSource),
                ]);
            break;

            case INSTRUCTIONS.PUSH:
                this.pc++;
                var registerSource = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "PUSH",
                    this.getKeyByValue(REGISTERS, registerSource),
                ]);
            break;

            case INSTRUCTIONS.POP:
                this.pc++;
                var registerDestination = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "POP",
                    this.getKeyByValue(REGISTERS, registerDestination),
                ]);
            break;

            case INSTRUCTIONS.JP:
                this.pc++;
                var address = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "JP",
                    address,
                ]);
            break;

            case INSTRUCTIONS.JL:
                this.pc++;
                var r1      = this.byteCodes[this.pc++];
                var r2      = this.byteCodes[this.pc++];
                var address = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "JL",
                    this.getKeyByValue(REGISTERS, r1),
                    this.getKeyByValue(REGISTERS, r2),
                    address.toString()
                ]);
            break;

            case INSTRUCTIONS.CALL:
                this.pc++;
                var address = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "CALL",
                    address.toString()
                ]);
            break;

            case INSTRUCTIONS.FLAG:
                this.pc++;
                this.asmCode.push([
                    "FLAG"
                ]);
            break;

            case INSTRUCTIONS.RET:
                this.pc++;
                this.asmCode.push([
                    "RET"
                ]);
            break;

            case INSTRUCTIONS.PRINT:
                this.pc++;
                var register = this.byteCodes[this.pc++];

                this.asmCode.push([
                    "PRINT",
                    this.getKeyByValue(REGISTERS, register),
                ]);
            break;

            case INSTRUCTIONS.PRINTS:
                this.pc++;
                var text = this.readString();
                
                this.asmCode.push([
                    "PRINTS",
                    "\"" + text + "\""
                ]);
            break;

            case INSTRUCTIONS.SCAN:
                this.pc++;
                var register = this.byteCodes[this.pc++];
                
                this.asmCode.push([
                    "SCAN",
                    this.getKeyByValue(REGISTERS, register),
                ]);
            break;

            case INSTRUCTIONS.CLS:
                this.pc++;

                this.asmCode.push([
                    "CLS"
                ]);
            break;

            case INSTRUCTIONS.GMOD:
                this.pc++;

                this.asmCode.push([
                    "GMOD"
                ]);
            break;

            case INSTRUCTIONS.PLOT:
                this.pc++;

                var xPos = this.byteCodes[this.pc++];
                var yPos = this.byteCodes[this.pc++];
                var size = this.byteCodes[this.pc++];
                
                this.asmCode.push([
                    "PLOT",
                    xPos.toString(),
                    yPos.toString(),
                    size.toString(),
                ]);
            break;

            case INSTRUCTIONS.TPLOT:
                this.pc++;

                var xPos = this.byteCodes[this.pc++];
                var yPos = this.byteCodes[this.pc++];
                var text = this.readString();
                
                this.asmCode.push([
                    "TPLOT",
                    xPos.toString(),
                    yPos.toString(),
                    "\"" + text + "\""
                ]);
            break;

            case INSTRUCTIONS.BKG:
                this.pc++;

                var color = this.readString();
                
                this.asmCode.push([
                    "BKG",
                    xPos.toString(),
                    yPos.toString(),
                    "\"" + color + "\""
                ]);
            break;

            case INSTRUCTIONS.HALT:
                this.pc++;
                
                this.asmCode.push([
                    "HALT",
                ]);
            break;

            case INSTRUCTIONS.TMOD:
                this.pc++;
                
                this.asmCode.push([
                    "TMOD",
                ]);
            break;
        
            default:
                console.error("Instruction not recognized: " + instruction);
                process.exit(instruction);
        }
    },

    getKeyByValue(obj, value) {
        return Object.keys(obj)
        .find(key => obj[key] === value);
    },

    readString() {
        var totalString = "";

        if (this.byteCodes[this.pc++] === STRING_STOPPER) {
            while(this.byteCodes[this.pc++] !== STRING_STOPPER) {
                totalString += String.fromCharCode(this.byteCodes[this.pc-1]);
            }
        }

        return totalString;
    }
}

export {
    DSM
}