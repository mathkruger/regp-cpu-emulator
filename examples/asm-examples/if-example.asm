PRINTS 0 "INPUT THE FIRST NUMBER"
SCAN INT R0
PRINTS 0 "INPUT THE SECOND NUMBER"
SCAN INT R1

; IF R0 < R1 THEN GOTO .MINOR
JL R0 R1 .MINOR

; ELSE GOTO .BIGGER
JP .BIGGER

.MINOR:
PRINTS 0 "SECOND NUMBER IS BIGGER"
JP .EXIT

.BIGGER:
PRINTS 0 "FIRST NUMBER IS BIGGER"
JP .EXIT

.EXIT:
HALT