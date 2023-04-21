import { INSTRUCTIONS, STRING_STOPPER, TYPES } from "../common/instructions.js";

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
                            this.getRegisterName(registerDestination),
                            this.getRegisterName(registerSource),
                        ]
                    });
                break;

                case INSTRUCTIONS.MOVV:
                    this.pc++;
                    var type                = this.byteCodes[this.pc++];
                    var registerDestination = this.byteCodes[this.pc++];
                    var value = null;
                    var isString = false;

                    if (type === TYPES.INT) {
                        value = this.byteCodes[this.pc++];
                    } else if (type === TYPES.STR) {
                        value = this.readString();
                        isString = true;
                    }

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            type,
                            registerDestination,
                            ...(isString ? this.stringToCharCodeArray(value) : [value]),
                        ],
                        asm: [
                            "MOVV",
                            this.getTypeName(type),
                            this.getRegisterName(registerDestination),
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
                            this.getRegisterName(registerDestination),
                            this.getRegisterName(registerSource),
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
                            this.getRegisterName(registerDestination),
                            this.getRegisterName(registerSource),
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
                            this.getRegisterName(registerSource),
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
                            this.getRegisterName(registerDestination),
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
                            this.getRegisterName(r1),
                            this.getRegisterName(r2),
                            address.toString()
                        ]
                    });
                break;

                case INSTRUCTIONS.JE:
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
                            "JE",
                            this.getRegisterName(r1),
                            this.getRegisterName(r2),
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
                    var layer    = this.byteCodes[this.pc++];
                    var register = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            layer,
                            register
                        ],
                        asm: [
                            "PRINT",
                            layer.toString(),
                            this.getRegisterName(register),
                        ]
                    });
                break;

                case INSTRUCTIONS.PRINTS:
                    this.pc++;
                    var layer = this.byteCodes[this.pc++];
                    var text = this.readString();
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            layer,
                            ...this.stringToCharCodeArray(text)
                        ],
                        asm: [
                            "PRINTS",
                            layer.toString(),
                            text
                        ]
                    });
                break;

                case INSTRUCTIONS.SCAN:
                    this.pc++;
                    var type     = this.byteCodes[this.pc++];
                    var register = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            type,
                            register
                        ],
                        asm: [
                            "SCAN",
                            this.getTypeName(type),
                            this.getRegisterName(register),
                        ]
                    });
                break;

                case INSTRUCTIONS.GRKEY:
                    this.pc++;
                    var register = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            register
                        ],
                        asm: [
                            "GRKEY",
                            this.getRegisterName(register),
                        ]
                    });
                break;

                case INSTRUCTIONS.CLS:
                    this.pc++;
                    var layer = this.byteCodes[this.pc++];

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            layer
                        ],
                        asm: [
                            "CLS",
                            layer.toString(),
                        ]
                    });
                break;

                case INSTRUCTIONS.CLSC:
                    this.pc++;

                    var layer = this.byteCodes[this.pc++];
                    var color = this.readString();

                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            layer,
                            ...this.stringToCharCodeArray(color)
                        ],
                        asm: [
                            "CLSC",
                            layer.toString(),
                            color
                        ]
                    });
                break;

                case INSTRUCTIONS.PLOT:
                    this.pc++;

                    var layer = this.byteCodes[this.pc++];
                    var xPos = this.byteCodes[this.pc++];
                    var yPos = this.byteCodes[this.pc++];
                    var size = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            layer,
                            xPos,
                            yPos,
                            size
                        ],
                        asm: [
                            "PLOT",
                            layer.toString(),
                            xPos.toString(),
                            yPos.toString(),
                            size.toString(),
                        ]
                    });
                break;

                case INSTRUCTIONS.PLOTR:
                    this.pc++;

                    var layer = this.byteCodes[this.pc++];
                    var xPos = this.byteCodes[this.pc++];
                    var yPos = this.byteCodes[this.pc++];
                    var size = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            layer,
                            xPos,
                            yPos,
                            size
                        ],
                        asm: [
                            "PLOTR",
                            layer.toString(),
                            this.getRegisterName(xPos),
                            this.getRegisterName(yPos),
                            this.getRegisterName(size),
                        ]
                    });
                break;

                case INSTRUCTIONS.BKG:
                    this.pc++;

                    var layer = this.byteCodes[this.pc++];
                    var color = this.readString();
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            layer,
                            ...this.stringToCharCodeArray(color)
                        ],
                        asm: [
                            "BKG",
                            layer.toString(),
                            color
                        ]
                    });
                break;

                case INSTRUCTIONS.FRG:
                    this.pc++;

                    var layer = this.byteCodes[this.pc++];
                    var color = this.readString();
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            layer,
                            ...this.stringToCharCodeArray(color)
                        ],
                        asm: [
                            "FRG",
                            layer.toString(),
                            color
                        ]
                    });
                break;

                case INSTRUCTIONS.BEEPV:
                    this.pc++;

                    var duration = this.byteCodes[this.pc++];
                    var frequency = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            duration,
                            frequency
                        ],
                        asm: [
                            "BEEPV",
                            duration,
                            frequency
                        ]
                    });
                break;

                case INSTRUCTIONS.BEEPR:
                    this.pc++;

                    var duration = this.byteCodes[this.pc++];
                    var frequency = this.byteCodes[this.pc++];
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [
                            instruction,
                            duration,
                            frequency
                        ],
                        asm: [
                            "BEEPR",
                            this.getRegisterName(duration),
                            this.getRegisterName(frequency)
                        ]
                    });
                break;

                case INSTRUCTIONS.SLEEP:
                    this.pc++;

                    var duration = this.byteCodes[this.pc++]; 
                    
                    this.asmCode.push({
                        currentPC,
                        byte: [ instruction, duration ],
                        asm: [ "HALT", duration ]
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

    getRegisterName(value) {
        return "R" + value;
    },

    getTypeName(type) {
        return Object.keys(TYPES)
        .find(key => TYPES[key] === type);
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