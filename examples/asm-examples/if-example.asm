PRINTS "INPUT THE FIRST NUMBER"
SCAN R0
PRINTS "INPUT THE SECOND NUMBER"
SCAN R1

; IF R0 < R1 THEN GOTO .MINOR
JL R0 R1 .MINOR

; ELSE GOTO .BIGGER
JP .BIGGER

.MINOR:
PRINTS "SECOND NUMBER IS BIGGER"
JP .EXIT

.BIGGER:
PRINTS "FIRST NUMBER IS BIGGER"
JP .EXIT

.EXIT:
HALT