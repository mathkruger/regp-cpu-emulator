const INSTRUCTIONS = {
    "MOVR": 10,
    "MOVV": 11,
    "ADD": 20,
    "SUB": 21,
    "PUSH": 30,
    "POP": 31,
    "JP": 40,
    "JL": 41,
    "CALL": 42,
    "RET": 50,
    "PRINT": 60,
    "PRINTS": 61,
    "SCAN": 62,
    "HALT": 255
};

var STRING_STOPPER = "\"".charCodeAt();

const REGISTERS = {
    "R0": 0,
    "R1": 1,
    "R2": 2,
    "R3": 3
};

export {
    INSTRUCTIONS,
    REGISTERS,
    STRING_STOPPER
};