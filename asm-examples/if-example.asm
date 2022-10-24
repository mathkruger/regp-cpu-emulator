SCAN R0
SCAN R1

; if R0 < R1 then goto .minor
JL R0 R1 13

; if R1 < R0 then goto .bigger
JL R1 R0 44

HALT

; .minor
PRINTS "primeiro menor que segundo"
JP 12

; .bigger
PRINTS "primeiro maior que segundo"
JP 12