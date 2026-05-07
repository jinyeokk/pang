# Phase 1 설계 — 메인 화면

> 참고 문서: [docs/features/main.md](../features/main.md) · [docs/plan.md](../plan.md)

---

## 목표

브라우저를 열면 게임 타이틀과 메뉴가 표시되고,  
키보드 방향키로 커서를 이동하고 Enter로 선택할 수 있는 진입 화면을 만든다.

---

## 화면 레이아웃

```
┌──────────────────────────────────────────┐
│                                          │
│   ●        ○          ●        ○         │  ← 장식 버블 (배경 애니메이션)
│                                          │
│                  PANG                    │  ← 타이틀 (네온 컬러 순환)
│           © 1989 MITCHELL CORP           │  ← 서브타이틀
│                                          │
│           ▶  GAME START                  │  ← 선택된 항목 (골드 강조)
│              HIGH SCORE                  │
│              GAME QUIT                   │
│                                          │
│         PRESS ENTER TO SELECT            │  ← 안내 문구 (깜빡임)
│                                          │
└──────────────────────────────────────────┘
```

- 전체 배경: 방사형 그라데이션 (`#1a1a4e` → `#000008`)
- 타이틀 "PANG": 3초 주기 네온 컬러 순환 + 글로우
- 메뉴 항목 (선택): 골드(`#FFD700`) + 글로우 + 연한 배경 + 테두리
- 메뉴 항목 (비선택): 연보라(`#aaaadd`)
- 안내 문구: 1초 간격 깜빡임

---

## 컴포넌트 구조

```
src/
├── App.tsx                        # screen 상태 관리 및 화면 분기
├── screens/
│   ├── MainScreen.tsx             # 타이틀 + 배경 버블 + MainMenu + 안내 문구
│   └── GameScreen.tsx             # 빈 화면 (Phase 2에서 구현)
└── components/
    └── MainMenu.tsx               # 메뉴 항목 렌더링 + 키보드/마우스 처리
```

### App.tsx
- `screen: 'main' | 'game'` 상태로 현재 화면 결정
- Phase 1에서는 `main` → `game` 단방향 전환만 구현

### MainScreen.tsx
- 배경 그라데이션 + 장식 버블 애니메이션
- 타이틀, 서브타이틀, `MainMenu`, 안내 문구 레이아웃 조합
- `onStart` 콜백을 `MainMenu`에 전달

### MainMenu.tsx
- `MENU_ITEMS` 배열과 `selectedIndex` 상태 관리
- `keydown` 이벤트 등록/해제 (`useEffect`)
- 선택 항목 강조 렌더링
- 마우스 클릭 지원

---

## 상태 설계

### App.tsx
```ts
type Screen = 'main' | 'game'
const [screen, setScreen] = useState<Screen>('main')
```

### MainMenu.tsx
```ts
const MENU_ITEMS = ['GAME START', 'HIGH SCORE', 'GAME QUIT'] as const
type MenuItem = typeof MENU_ITEMS[number]

const [selectedIndex, setSelectedIndex] = useState(0)
const [notice, setNotice] = useState<string | null>(null)
```

---

## 키보드 조작

`MainMenu.tsx` 내부에서 `useEffect`로 `keydown` 이벤트 등록.  
컴포넌트 언마운트 시 리스너 반드시 제거.

| 키 | 동작 |
|----|------|
| `ArrowUp` | `selectedIndex` 감소. 첫 번째(0)에서 누르면 마지막으로 순환 |
| `ArrowDown` | `selectedIndex` 증가. 마지막에서 누르면 첫 번째(0)으로 순환 |
| `Enter` | 현재 `selectedIndex`의 항목 실행 |

### 브라우저 기본 스크롤 방지

`ArrowUp` / `ArrowDown` / `Enter` 키는 브라우저 기본 동작(페이지 스크롤, 폼 제출)이 있다.  
키 입력 시 반드시 `e.preventDefault()`를 호출해 화면이 움직이지 않도록 막는다.

```ts
const handleKeyDown = (e: KeyboardEvent) => {
  if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
    e.preventDefault()
  }
  // 이후 로직
}
```

전체 화면 스크롤도 CSS로 차단한다.  
`index.html` 의 `<body>` 또는 루트 컨테이너에 `overflow: hidden` 을 적용한다.

### 순환 계산식

```ts
// ArrowUp
(prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length

// ArrowDown
(prev + 1) % MENU_ITEMS.length
```

### 순환 동작 예시

```
현재: GAME START (index 0)
  ↑ 입력 → GAME QUIT   (index 2)  ← 처음에서 끝으로 순환
  ↓ 입력 → HIGH SCORE  (index 1)

현재: GAME QUIT (index 2)
  ↓ 입력 → GAME START  (index 0)  ← 끝에서 처음으로 순환
  ↑ 입력 → HIGH SCORE  (index 1)
```

### 마우스 클릭
- 항목 클릭 시 `selectedIndex`를 해당 항목으로 이동한 뒤 즉시 실행
- 키보드와 동일한 `selectItem` 함수 사용

---

## 메뉴 항목별 동작

| 항목 | 동작 |
|------|------|
| `GAME START` | `onStart` 콜백 → `App`에서 `screen = 'game'` 전환 |
| `HIGH SCORE` | `notice` 상태에 "준비 중입니다." 표시 (현재 화면 유지) |
| `GAME QUIT` | `notice` 상태에 "브라우저 탭을 닫아 종료해주세요." 표시 |

> `GAME QUIT` 은 브라우저 보안 정책상 `window.close()` 강제 종료가 불가하므로 안내 문구로 대체한다.

### 안내 문구(`notice`) 동작
- 메뉴 커서를 ↑↓ 로 이동하면 `notice` 초기화
- 안내 문구는 페이드인 애니메이션으로 등장

---

## 화면 전환 흐름

```
앱 시작
  │
  ▼
MainScreen (screen = 'main')
  │
  ├─ GAME START 선택 → GameScreen (screen = 'game')
  ├─ HIGH SCORE 선택 → notice 표시 (화면 유지)
  └─ GAME QUIT 선택  → notice 표시 (화면 유지)
```

---

## 배경 장식 버블

장식용 버블은 게임 풍선을 연상시키는 시각적 힌트로, 게임 로직과 무관하다.

```ts
const BUBBLES = [
  { size, left, duration, delay, color }
  // 6개, 크기/색상/속도/딜레이 각각 다름
]
```

- 화면 하단(`bottom: -120px`)에서 시작해 상단 방향으로 이동
- `floatUp` 애니메이션: 위로 올라가며 `scale` 축소 + `opacity` 페이드아웃
- 루프(`infinite`) 반복

---

## 스타일 요약

| 요소 | 스타일 |
|------|--------|
| 전체 배경 | `radial-gradient(#1a1a4e → #000008)` |
| 타이틀 | `font-size: 6rem`, 네온 컬러 순환 애니메이션 |
| 서브타이틀 | `color: #8888cc`, `font-size: 0.8rem` |
| 메뉴 (선택) | `color: #FFD700`, 글로우, 배경 + 테두리 |
| 메뉴 (비선택) | `color: #aaaadd` |
| notice 문구 | `color: #ff9966`, 페이드인 애니메이션 |
| 안내 문구 | `color: #6666aa`, 1초 깜빡임 |
| 인라인 스타일 | 모든 스타일을 인라인으로 작성 (CSS 파일 없음) |

---

## 파일별 구현 현황

| 파일 | 상태 | 주요 내용 |
|------|------|-----------|
| `src/App.tsx` | ✅ 완료 | screen 상태, 화면 분기 렌더링 |
| `src/screens/MainScreen.tsx` | ✅ 완료 | 배경 버블, 타이틀, 레이아웃 |
| `src/screens/GameScreen.tsx` | ✅ 완료 | 빈 화면 (Phase 2 자리 표시) |
| `src/components/MainMenu.tsx` | ✅ 완료 | 메뉴 항목, 키보드/마우스, notice |

---

## 결정된 사항 (미결 → 확정)

| 항목 | 결정 내용 |
|------|-----------|
| 폰트 | 외부 의존성 없이 `monospace` 사용 |
| HIGH SCORE | 선택 시 "준비 중입니다." 인라인 표시 |
| 메뉴 순환 | 끝에서 반대쪽으로 순환 (아케이드 표준 방식) |
