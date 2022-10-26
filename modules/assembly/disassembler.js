import { INSTRUCTIONS, REGISTERS, STRING_STOPPER } from "../common/instructions.js";

const DSM = {
    pc: 0,
    byteCodes: [],
    asmCode: [],

    disassemble(byteCodes) {
        this.pc = 0;
        this.asmCode = [];
        this.byteCodes = byteCodes;
        
        do {
            const instruction = this.byteCodes[this.pc];
            const currentPC = this.pc;
            
            switch (instruction) {
                case INSTRUCTIONS.MOVR:
                    this.pc++;
                    var registerDestination = this.byteCodes[this.pc++];
                    var registerSource      = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            registerDestination,
                            registerSource
                        ],
                        asm: [
                            "MOVR",
                            this.getKeyByValue(REGISTERS, registerDestination),
                            this.getKeyByValue(REGISTERS, registerSource),
                        ]
                    });
                break;

                case INSTRUCTIONS.MOVV:
                    this.pc++;
                    var registerDestination = this.byteCodes[this.pc++];
                    var value               = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            registerDestination,
                            value
                        ],
                        asm: [
                            "MOVV",
                            this.getKeyByValue(REGISTERS, registerDestination),
                            value.toString(),
                        ]
                    });
                break;

                case INSTRUCTIONS.ADD:
                    this.pc++;
                    var registerDestination = this.byteCodes[this.pc++];
                    var registerSource      = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            registerDestination,
                            registerSource
                        ],
                        asm: [
                            "ADD",
                            this.getKeyByValue(REGISTERS, registerDestination),
                            this.getKeyByValue(REGISTERS, registerSource),
                        ]
                    });
                break;

                case INSTRUCTIONS.SUB:
                    this.pc++;
                    var registerDestination = this.byteCodes[this.pc++];
                    var registerSource      = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            registerDestination,
                            registerSource
                        ],
                        asm: [
                            "SUB",
                            this.getKeyByValue(REGISTERS, registerDestination),
                            this.getKeyByValue(REGISTERS, registerSource),
                        ]
                    });
                break;

                case INSTRUCTIONS.PUSH:
                    this.pc++;
                    var registerSource = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            registerSource
                        ],
                        asm: [
                            "PUSH",
                            this.getKeyByValue(REGISTERS, registerSource),
                        ]
                    });
                break;

                case INSTRUCTIONS.POP:
                    this.pc++;
                    var registerDestination = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            registerDestination
                        ],
                        asm: [
                            "POP",
                            this.getKeyByValue(REGISTERS, registerDestination),
                        ]
                    });
                break;

                case INSTRUCTIONS.JP:
                    this.pc++;
                    var address = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            address
                        ],
                        asm: [
                            "JP",
                            address,
                        ]
                    });
                break;

                case INSTRUCTIONS.JL:
                    this.pc++;
                    var r1      = this.byteCodes[this.pc++];
                    var r2      = this.byteCodes[this.pc++];
                    var address = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            r1,
                            r2,
                            address
                        ],
                        asm: [
                            "JL",
                            this.getKeyByValue(REGISTERS, r1),
                            this.getKeyByValue(REGISTERS, r2),
                            address.toString()
                        ]
                    });
                break;

                case INSTRUCTIONS.CALL:
                    this.pc++;
                    var address = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            address
                        ],
                        asm: [
                            "CALL",
                            address.toString()
                        ]
                    });
                break;

                case INSTRUCTIONS.FLAG:
                    this.pc++;
                    this.asmCode.push({
                        currentPC,
                        byte: [ instruction ],
                        asm: [ "FLAG" ]
                    });
                break;

                case INSTRUCTIONS.RET:
                    this.pc++;
                    this.asmCode.push({
                        currentPC,
                        byte: [ instruction ],
                        asm: [ "RET" ]
                    });
                break;

                case INSTRUCTIONS.PRINT:
                    this.pc++;
                    var register = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            register
                        ],
                        asm: [
                            "PRINT",
                            this.getKeyByValue(REGISTERS, register),
                        ]
                    });
                break;

                case INSTRUCTIONS.PRINTS:
                    this.pc++;
                    var text = this.readString();
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            ...this.stringToCharCodeArray(text)
                        ],
                        asm: [
                            "PRINTS",
                            text
                        ]
                    });
                break;

                case INSTRUCTIONS.SCAN:
                    this.pc++;
                    var register = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            register
                        ],
                        asm: [
                            "SCAN",
                            this.getKeyByValue(REGISTERS, register),
                        ]
                    });
                break;

                case INSTRUCTIONS.CLS:
                    this.pc++;

                    this.asmCode.push({
                        currentPC,
                        byte: [ instruction ],
                        asm: [ "CLS" ]
                    });
                break;

                case INSTRUCTIONS.PLOT:
                    this.pc++;

                    var xPos = this.byteCodes[this.pc++];
                    var yPos = this.byteCodes[this.pc++];
                    var size = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            xPos,
                            yPos,
                            size
                        ],
                        asm: [
                            "PLOT",
                            xPos.toString(),
                            yPos.toString(),
                            size.toString(),
                        ]
                    });
                break;

                case INSTRUCTIONS.PLOTR:
                    this.pc++;

                    var xPos = this.byteCodes[this.pc++];
                    var yPos = this.byteCodes[this.pc++];
                    var size = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            xPos,
                            yPos,
                            size
                        ],
                        asm: [
                            "PLOTR",
                            this.getKeyByValue(REGISTERS, xPos),
                            this.getKeyByValue(REGISTERS, yPos),
                            this.getKeyByValue(REGISTERS, size),
                        ]
                    });
                break;

                case INSTRUCTIONS.BKG:
                    this.pc++;

                    var color = this.readString();
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            ...this.stringToCharCodeArray(color)
                        ],
                        asm: [
                            "BKG",
                            color
                        ]
                    });
                break;

                case INSTRUCTIONS.FRG:
                    this.pc++;

                    var color = this.readString();
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            ...this.stringToCharCodeArray(color)
                        ],
                        asm: [
                            "FRG",
                            color
                        ]
                    });
                break;

                case INSTRUCTIONS.HALT:
                    this.pc++;
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [ instruction ],
                        asm: [ "HALT" ]
                    });
                break;
            
                default:
                    console.error("Instruction not recognized: " + instruction);
                    this.pc = this.byteCodes.length;
                break;
            }
        } while (this.pc < this.byteCodes.length);

        return this.format();
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

        return "\"" + totalString + "\"";
    },

    stringToCharCodeArray(string) {
        return string.split("").map(x => x.charCodeAt())
    },

    format() {
        const biggestByteLenght = this.asmCode
            .map(x => x.byte.join(" "))
            .reduce((savedText, text) => (text.length > savedText.length ? text : savedText), '')
            .length;

        return this.asmCode.map(x => {
            let line = x.currentPC + "\t";
            const bytes = x.byte.join(" ");
            const asm = x.asm.join(" ");

            line += bytes;
            line = line.padEnd(biggestByteLenght + 10, " ");
            line += "\t" + asm;

            return line;
        }).join("\n");
    }
}

export {
    DSM
}