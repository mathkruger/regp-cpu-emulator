import { INSTRUCTIONS, JOYSTICK, TYPES } from "../common/instructions.js";

const ASM = {
    assemble(code) {
        var tokens = this.getTokens(code);
        return this.getBytecode(tokens);
    },

    getTokens(code) {
        var lines = code.split(/\r?\n/);

        for (let index = lines.length - 1; index >= 0; index--) {
            const element = lines[index].trim();
            if (!element || element.startsWith(";")) {
                lines.splice(index, 1);
                continue;
            }

            lines[index] = element.split(/([\s,])(?=(?:[^\"]|\"[^\"]*\")*$)/);
        }

        return lines.map(x => x.filter(y => y != " "));
    },

    getBytecode(tokens) {
        const bytes = [];

        tokens.forEach(line => {
            line.forEach((item, i) => {
                const token = item.trim().toUpperCase();

                if (i === 0) {
                    // Check if it's not a flag (definition or call)
                    if (!token.startsWith(".") && !token.includes(":")) {
                        bytes.push(INSTRUCTIONS[token] || -1);
                    }

                    // Checks if it's a flag definition, then add the FLAG instruction
                    else if (token.startsWith(".") && token.includes(":")) {
                        bytes.push(INSTRUCTIONS.FLAG);
                    }
                }
                else {
                    if (this.isTokenARegister(token)) {
                        bytes.push(parseInt(token.replace("R", "")));
                    } else if (Object.keys(JOYSTICK).includes(token)) {
                        bytes.push(JOYSTICK[token]);
                    } else if (Object.keys(TYPES).includes(token)) {
                        bytes.push(TYPES[token]);
                    } else {
                        // Check strings and push all ASCII Codes for it
                        if (token.includes("\"")) {
                            const chars = token.split("");
                            const charCodes = chars.map(x => x.charCodeAt());
                            bytes.push(...charCodes);
                        }

                        // Check if its a flag call, find its position and push it,
                        // counting the strings lenghts as well
                        else if (token.startsWith(".") && !token.includes(":")) {
                            const tokensFlatten = tokens.flatMap(x => x);

                            const listToFind = tokensFlatten.map(x => {
                                if (x.includes("\"")) {
                                    return x.split("");
                                }
                                return x;
                            }).flatMap(x => x);

                            const address = listToFind.findIndex(x => {
                                return token + ":" == x.toUpperCase()
                            });

                            if (address > -1) {
                                bytes.push(parseInt(address));
                            }
                        }

                        // Check if it's not a flag definition, if not, just push the
                        // value.
                        else {
                            if (!token.includes(":")) {
                                bytes.push(parseInt(token));
                            }
                        }
                    }
                }
            });
        });

        return bytes;
    },

    isTokenARegister(token) {
        if (token.startsWith("R") &&
            !isNaN(token.replace("R", ""))) {
            return true;
        }

        return false;
    }
};

export {
    ASM
};