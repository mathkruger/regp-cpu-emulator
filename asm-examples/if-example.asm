SCAN R0
SCAN R1

; if R0 < R1 then goto .minor
JL R0 R1 .minor

; else goto .bigger
JP .bigger

.exit:
HALT

.minor:
PRINTS "primeiro menor que segundo"
JP .exit

.bigger:
PRINTS "primeiro maior que segundo"
JP .exit