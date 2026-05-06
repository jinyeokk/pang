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

현재 테스트 프레임워크가 설정되어 있지 않다. Vite 환경과 가장 잘 통합되는 **Vitest** 도입을 권장한다.

### Vitest 설치 및 설정 방법

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

`vite.config.ts`에 테스트 설정 추가:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
```

`package.json` scripts에 추가:

```json
"test": "vitest",
"test:run": "vitest run"
```

단일 테스트 파일 실행:

```bash
npx vitest run src/App.test.tsx
```

## 코드 구조

```
src/
├── main.tsx       # 앱 진입점, React DOM 마운트
├── App.tsx        # 루트 컴포넌트
└── vite-env.d.ts  # Vite 환경 타입 선언
index.html         # Vite HTML 엔트리 (script type="module" → src/main.tsx)
```

컴포넌트는 `src/` 하위에 위치하며, 새 페이지나 기능 추가 시 `src/` 내부에 디렉토리를 만들어 확장한다.
