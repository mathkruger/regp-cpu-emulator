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
    "FLAG": 43,
    "RET": 50,
    "PRINT": 60,
    "PRINTS": 61,
    "SCAN": 62,
    "CLS": 70,
    "PLOT": 81,
    "PLOTR": 82,
    "BKG": 83,
    "FRG": 84,
    "BEEPV": 90,
    "BEEPR": 91,
    "SLEEP": 254,
    "HALT": 255
};


const REGISTERS = {
    "R0": 0,
    "R1": 1,
    "R2": 2,
    "R3": 3,
    "R4": 4
};

const STRING_STOPPER = "\"".charCodeAt();

export {
    INSTRUCTIONS,
    REGISTERS,
    STRING_STOPPER
};