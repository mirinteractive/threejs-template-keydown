# Functions that used

## mod(a,b)
#### a/b 나머지
mod(vUv.y * 10.0, 1.0)는 y좌표로 면적을 10으로 나누고 vUv.y 색칠 그라데이션을 1.0칸씩 대입한다. 
(2.0칸씩 대입하면 10.0/2.0이므로 5칸씩 칠해진다.)

## step(a,b)
#### b가 a 보다 작으면 0을 반환, 그 외에는 1을 반환하는 함수
`mod(vUv.y * 10.0, 1.0)`
10칸씩 나누어서 y를 그라데이션으로 색칠하고
`step(0.5, strength)`
그걸 0.5(반)씩 나누어서 반만 색칠해준다.
(mod 2.0에 0.5로 나누어주면 25%의 면적만 칠해진다.)

## abs(a)
#### 절대값
abs(vUv.x - 0.5)는 x를 기준으로 0.5(반)으로 나누어서 그라데이션을 각각 적용한다.
(0.8을 대입하면 0.8 위치에서 그라데이션이 적용된다.)
(1.0이되면 오른쪽에서부터, 0.0이되면 왼쪽에서부터 검정색 그라데이션이 적용된다.)

## min(a,b)
#### 최소값
a와 b중 더 작은값을 리턴한다. 둘이 같을경우 a를 리턴.
`min(abs(vUv.x - 0.5), abs(vUv.y - 0.5))`
각 좌표의 최소를 가지고와서 병합

## max(a,b)
#### 최대값
a와 b중 더 큰값을 리턴한다. 둘이 같을경우 a를 리턴.
`max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))`
각 좌표의 최대를 가지고와서 병합

## floor(a)
#### 내림한 정수를 리턴
`floor(vUv.x*10.0)`
x를 기준으로 10으로 나누고 한칸만 칠함
(8.0이면 조금 더 칠함, 1.0이면 다 칠함)
`floor(vUv.x*10.0)/10.0`
10칸으로 니누어서 그라데이션 점점 옅어짐
(/3.0이면 앞에 세칸만 칠함)
(*0.2면 10칸중에 5칸은 검정, 나머지 5칸은 그 다음 짙은색으로 칠함)

## length(a)
#### 벡터의 길이를 계산, float을 리턴
`length(vUv)`
vUv의 길이를 리턴해서 왼쪽 밑에서부터 칠함
(vUv.x는 length없는 결과와 동일)
(vUv-0.5는 0.5(반)만큼 오프셋을 주어서 중앙에서부터 그라데이션)

## distance(a,b)
#### 두 벡터의 거리를 계산
`distance(vUv, vec2(0.5)`
vUv부터 vec(0.5)사이의 거리를 계산: x0.5 y0.5
그 지점 (중앙)부터 그라데이션
(0.8은 오른쪽 위로 올라가서 생성)
(1.0-은 반대 그라데이션)

## atan(a,b)
#### 역 삼각함수 (atan2의 glsl버전)
???????????

## sin(a)
#### sin 그래프 곡선 기억하기..!

## clamp(a, min, max)
#### a를 [min, max] 범위로 클램프
a가 범위안에 있으면 a를 그대로 리턴, min보다 작으면 min을 max보다 크면 max를 리턴
두개 이상의 색상이 겹쳐서(ex. x변수 색상과 y변수 색상이 충돌) 범위 밖의 색상으로 나오는경우 색상을 범위 안으로 유지하기 위해 사용

## rand(vec2(a, b))
#### a,b 사이의 random 값 
나중에 사용하보기

## mix(a, b, c)
#### a와 b를 섞는다
a와 b는 두개의 type가 동일하다면 뭐든 섞을 수 있다. (ex: 색상, float, vec2/3/4)
c가 0이면 a, 1이면 b, 0.5면 반반 섞는다

# Methods that used

## combine x and y into single strnegth
#### 방법1: strength에 하나를 먼저 정의, 다른걸 업데이트
x에 대한 strength를 먼저 정의한 뒤
`float strength = step(0.8, mod(vUv.x * 10.0, 1.0));`
y에 대한 strength를 업데이트(+=/*=/-+)해준다.
`strength += step(0.8, mod(vUv.y * 10.0, 1.0));`
#### 방법2: 각각 변수로 만들고 더해주기
x에 대한 strength 정의
`float barX = step(0.4, mod(vUv.x * 10.0, 1.0));`
`barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));`
y에 대한 strength 정의
`float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));`
`barY *= step(0.4, mod(vUv.y * 10.0, 1.0));`
두 정의를 strength에 병합
`float strength = barX+barY;`
