BKG "#004E98"
FRG "#3A6EA5"

; TOP LINE
MOVV R0 10
MOVV R1 10
MOVV R2 310

JP .LOOP_X

.LOOP_X:
PLOTR R0 R1 R1
ADD R0 R1
JL R0 R2 .LOOP_X

; LEFT LINE
MOVV R0 10
MOVV R1 10
MOVV R2 190

JP .LOOP_Y

.LOOP_Y:
PLOTR R1 R0 R1
ADD R0 R1
JL R0 R2 .LOOP_Y

; BOTTOM LINE
MOVV R0 10
MOVV R1 10
MOVV R2 310
MOVV R3 180

JP .LOOP_XX

.LOOP_XX:
PLOTR R0 R3 R1
ADD R0 R1
JL R0 R2 .LOOP_XX

; RIGHT LINE
MOVV R0 10
MOVV R1 10
MOVV R2 180
MOVV R3 300

JP .LOOP_YY

.LOOP_YY:
PLOTR R3 R0 R1
ADD R0 R1
JL R0 R2 .LOOP_YY

HALT