# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| UI 프레임워크 | React | ^19.0.0 |
| 빌드 도구 | Vite | ^6.3.1 |
| 언어 | TypeScript | ~5.7.2 |
| React 플러그인 | @vitejs/plugin-react | ^4.3.4 |

TypeScript는 `strict` 모드로 설정되어 있으며, `noUnusedLocals`, `noUnusedParameters` 옵션이 활성화되어 있어 미사용 변수/파라미터는 빌드 오류를 발생시킨다.

`tsconfig.json`은 프로젝트 참조(composite) 구조로, `tsconfig.app.json`(src 소스)과 `tsconfig.node.json`(vite.config.ts)을 분리 관리한다.

## 주요 명령어

```bash
# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 타입 체크 + 프로덕션 빌드 (dist/ 생성)
npm run build

# 빌드 결과물 로컬 미리보기
npm run preview
```

## 테스트 방법

Vitest + Testing Library + jsdom 환경이 설정되어 있다.

```bash
npm run test        # 감시 모드 (파일 변경 시 자동 재실행)
npm run test:run    # 1회 실행

# 단일 파일 실행
npx vitest run src/App.test.tsx
```

- 테스트 파일은 대상 파일과 같은 디렉토리에 `*.test.tsx` 형태로 작성
- `src/setupTests.ts` 에서 `@testing-library/jest-dom` 매처를 전역 등록
- `vite.config.ts` 의 `test.globals: true` 설정으로 `describe` / `it` / `expect` 를 import 없이 사용 가능

## 코드 구조

```
src/
├── main.tsx          # 앱 진입점, React DOM 마운트
├── App.tsx           # 루트 컴포넌트
├── setupTests.ts     # 테스트 전역 설정
└── vite-env.d.ts     # Vite 환경 타입 선언
index.html            # Vite HTML 엔트리 (script type="module" → src/main.tsx)
docs/
├── prd.md            # 팡 게임 전체 PRD
└── features/         # 기능별 상세 문서
```

컴포넌트는 `src/` 하위에 위치하며, 새 페이지나 기능 추가 시 `src/` 내부에 디렉토리를 만들어 확장한다.

## 프로젝트 문서

이 프로젝트는 아케이드 게임 **팡(Pang, 1989)** 을 React + Vite + TypeScript 로 구현하는 것을 목표로 한다.

### 기획 문서

| 문서 | 경로 | 내용 |
|------|------|------|
| PRD | [docs/prd.md](docs/prd.md) | 게임 전체 개요, 핵심 규칙, 구현 범위 |
| 개발 계획 | [docs/plan.md](docs/plan.md) | Phase 1~12 목표, 고객 확인 포인트, 진행 현황 |
| 메인 화면 | [docs/features/main.md](docs/features/main.md) | 첫 진입 화면 레이아웃 및 메뉴 구성 |
| 게임 룰 | [docs/features/game_rule.md](docs/features/game_rule.md) | 풍선 분열, 무기, 아이템, 점수 시스템 상세 |
| Mission 1 | [docs/features/mission1.md](docs/features/mission1.md) | 스테이지 1-1~1-3 난이도 및 구성 규칙 |

### 설계 문서

Phase 구현 전 반드시 해당 설계 문서를 먼저 확인한다. 설계와 구현이 다를 경우 설계 문서를 우선 기준으로 삼는다.

| 문서 | 경로 | 내용 |
|------|------|------|
| Phase 1 설계 | [docs/design/phase1.md](docs/design/phase1.md) | 메인 화면 컴포넌트 구조, 상태 설계, 키보드 처리, 스타일 방향 |
| Phase 2 설계 | [docs/design/phase2.md](docs/design/phase2.md) | 게임 화면 뼈대, HUD 구성, ESC 복귀, 게임 영역 레이아웃 |
