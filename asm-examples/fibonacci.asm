PRINTS "How many?"
SCAN R0

; calling the calc fibonacci address
CALL 17
HALT

; calc fibonacci address
PUSH R0

MOVV R0 0
MOVV R1 1
MOVV R3 1
PRINT R1

; repeat
MOVR R2 R0
ADD R2 R1
PRINT R2

MOVR R0 R1
MOVR R1 R2

MOVV R2 1
ADD R3 R2

POP R2
PUSH R2

; looping to repeat
JL R3 R2 30

POP R0

RET