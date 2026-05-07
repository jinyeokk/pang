# Phase 2 설계 — 게임 화면 뼈대

> 참고 문서: [docs/plan.md](../plan.md) · [docs/features/game_rule.md](../features/game_rule.md)

---

## 목표

게임이 실제로 벌어지는 공간(게임 영역)과 상태를 표시하는 HUD를 갖춘 게임 화면 뼈대를 만든다.  
이 단계에서 게임 로직은 없으며, 레이아웃과 ESC 복귀만 완성한다.

---

## 화면 레이아웃

```
┌─────────────────────────────────────────────┐
│  SCORE        ♥ ♥ ♥         TIME           │  ← HUD 영역 (고정 높이 50px)
│  000000                      60             │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│                                             │
│               게임 영역                      │  ← 플레이어·풍선이 등장할 공간
│                                             │
│                                             │
│                                             │
│─────────────────────────────────────────────│  ← 바닥선
└─────────────────────────────────────────────┘
```

- 전체 배경: 어두운 단색 (`#111`)
- HUD: 최상단 고정, 반투명 배경으로 게임 영역과 구분
- 게임 영역: HUD 아래부터 바닥선까지
- 바닥선: 플레이어가 서 있는 지면 기준선

---

## 컴포넌트 구조

```
src/
├── App.tsx                      # onBack 콜백 추가, screen = 'main' 복귀 처리
├── screens/
│   └── GameScreen.tsx           # 수정 — HUD + 게임 영역 레이아웃, ESC 처리
└── components/
    └── HUD.tsx                  # 신규 — 점수 / 잔기 / 제한시간 표시
```

### App.tsx
- `GameScreen`에 `onBack` prop 전달
- `onBack` 호출 시 `screen = 'main'`으로 전환

### GameScreen.tsx
- `onBack: () => void` prop 수신
- `useEffect`로 `keydown` 이벤트 등록, ESC 키 감지 → `onBack` 호출
- HUD + 게임 영역 레이아웃 렌더링

### HUD.tsx
- `score`, `lives`, `time` 을 props로 받아 표시
- Phase 2에서는 더미 값(score: 0, lives: 3, time: 60)을 고정으로 전달
- 이후 Phase에서 실제 게임 상태와 연동

---

## 상태 설계

### App.tsx 변경
```ts
// 기존
<GameScreen />

// 변경
<GameScreen onBack={() => setScreen('main')} />
```

### GameScreen.tsx
```ts
interface Props {
  onBack: () => void
}
```

### HUD.tsx
```ts
interface Props {
  score: number
  lives: number
  time: number
}
```

---

## 키보드 조작

| 키 | 동작 |
|----|------|
| `Escape` | 게임 화면 → 메인 화면으로 복귀 |

- `keydown` 이벤트는 `GameScreen` 마운트 시 등록, 언마운트 시 제거
- `Escape` 키는 브라우저 기본 동작이 없으므로 `e.preventDefault()` 불필요

---

## 화면 전환 흐름

```
MainScreen
  │
  │  GAME START 선택 (Phase 1 구현 완료)
  ▼
GameScreen
  │
  │  ESC 키
  ▼
MainScreen
```

---

## HUD 구성 상세

```
┌────────────────────────────────────────────┐
│ SCORE          ♥ ♥ ♥            TIME       │
│ 000000                           60        │
└────────────────────────────────────────────┘
```

| 영역 | 위치 | 내용 |
|------|------|------|
| 점수 | 좌측 | "SCORE" 레이블 + 6자리 숫자 (`000000`) |
| 잔기 | 중앙 | ♥ 아이콘 × 잔기 수 (초기값 3) |
| 시간 | 우측 | "TIME" 레이블 + 초 단위 숫자 (`60`) |

- 폰트: `monospace`
- 색상: 흰색(`#fff`)
- HUD 배경: `rgba(0, 0, 0, 0.6)` 반투명

---

## 게임 영역 구성

| 요소 | 설명 |
|------|------|
| 배경 | 단색 (`#111827`), Phase 11에서 테마 배경으로 교체 예정 |
| 바닥선 | HUD 제외 영역 하단에 고정, 높이 4px, 색상 `#888` |
| 내부 | Phase 2에서는 비어 있음. Phase 3부터 플레이어 추가 |

---

## 스타일 방향

- Phase 1과 동일하게 인라인 스타일 사용
- 게임 영역은 `position: relative` 로 설정 (이후 Phase에서 플레이어·풍선을 절대 위치로 배치)
- HUD와 게임 영역은 `flexbox` 세로 배치

```
GameScreen (display: flex, flexDirection: column, height: 100vh)
  ├── HUD     (height: 50px, flex-shrink: 0)
  └── 게임 영역 (flex: 1, position: relative)
        └── 바닥선 (position: absolute, bottom: 0)
```

---

## 파일별 구현 요약

| 파일 | 신규/수정 | 주요 작업 |
|------|-----------|-----------|
| `src/App.tsx` | 수정 | `GameScreen`에 `onBack` prop 전달 |
| `src/screens/GameScreen.tsx` | 수정 | HUD + 게임 영역 레이아웃, ESC 키 처리 |
| `src/components/HUD.tsx` | 신규 | 점수·잔기·시간 표시 컴포넌트 |

---

## 미결 사항 (검토 요청)

1. **게임 영역 크기**: 전체 화면 기준으로 HUD 아래를 모두 사용할지, 고정 비율(예: 4:3)로 중앙 정렬할지
2. **잔기 표시 방식**: ♥ 아이콘 반복 표시 vs 숫자(`× 3`) 표시
3. **ESC 동작**: 즉시 메인으로 복귀할지, "정말 나가시겠습니까?" 확인 없이 바로 전환할지
