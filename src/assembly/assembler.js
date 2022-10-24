import { INSTRUCTIONS, REGISTERS } from "../common/instructions.js";

const ASM = {
    assemble(code) {
        var tokens = this.getTokens(code).map(x => x.filter(y => y != " "));
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

        return lines;
    },

    getBytecode(tokens) {
        const bytes = [];

        tokens.forEach(line => {
            line.forEach((item, i) => {
                const token = item.trim().toUpperCase();

                if (i === 0) {
                    bytes.push(INSTRUCTIONS[token] || -1);
                }
                else {
                    if (Object.keys(REGISTERS).includes(token)) {
                        bytes.push(REGISTERS[token])
                    }
                    else {
                        console.log(token);
                        if (parseInt(token) == NaN || token.includes("\"")) {
                            const chars = token.split("");
                            const charCodes = chars.map(x => x.charCodeAt());
                            bytes.push(...charCodes);
                        }
                        else {
                            bytes.push(parseInt(token));
                        }
                    }
                }
            });
        });

        return bytes;
    }
};

export {
    ASM
};