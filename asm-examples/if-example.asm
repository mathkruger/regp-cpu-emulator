SCAN R0
SCAN R1

; if R0 < R1 then goto .minor
JL R0 R1 11

; else goto .bigger
JP 42

; .exit
HALT

; .minor
PRINTS "primeiro menor que segundo"

; goto .exit
JP 10

; .bigger
PRINTS "primeiro maior que segundo"

; goto .exit
JP 10