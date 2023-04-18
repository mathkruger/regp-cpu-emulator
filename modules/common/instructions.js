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
    "JE": 44,
    "RET": 50,
    "PRINT": 60,
    "PRINTS": 61,
    "SCAN": 62,
    "GRKEY": 63,
    "CLS": 70,
    "CLSC": 71,
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
    "R4": 4,
    "R5": 5,
};

const JOYSTICK = {
    "KA": 0,
    "KU": 1,
    "KR": 2,
    "KD": 3,
    "KL": 4,
    "NOKEY": 255
};

const STRING_STOPPER = 34;

export {
    INSTRUCTIONS,
    REGISTERS,
    JOYSTICK,
    STRING_STOPPER
};