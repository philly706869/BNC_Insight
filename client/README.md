# BNC_Inght 프론트

## 디렉토리 개요

- [**`public/`**](./public/): 공개 파일 디렉토리

  - 예) `GET: localhost:3000/example.png` 요청 시 `public/example.png` 파일 제공

- [**`src/`**](./src/): 소스 코드 디렉토리

  - [**`setupProxy.ts`**](./src/setupProxy.ts): 개발용 프록시 설정 파일

    - React 개발 서버로 보내진 요청중 `/api` 하위 엔드포인트 요청 시 백엔드 서버로 요청 전달

  - [**`index.tsx`**](./src/index.tsx): 프로젝트 진입점 파일

    - [`index.html`](./public/index.html)에 연결됨

  - [**`App.tsx`**](./src/App.tsx): 메인 컴포넌트 파일

    - body에 포함된 React 렌더용 `<div>`에 렌더링됨
    - [`pages/`](#pages)의 컴포넌트 라우팅 포함 ([라우트 보기](#라우트-엔드포인트))

  - [**`Layout.tsx`**](./src/Layout.tsx): 전체 레이아웃 컴포넌트 파일.

    - `<Outlet />` 위치에 하위 컴포넌트 렌더링.

  - [**`assets/`**](./src/assets/): 페이지에 포함되는 에셋 모음 폴더

    - SVG, PNG 등의 파일 포함 가능

    - [**`svg/`**](./src/assets/svg/): SVG 에셋 폴더

  - <a id="pages"></a>[**`pages/`**](./src/pages/): 내부 컴포넌트 라우팅 포함

  - [**`components/`**](./src/components/): 컴포넌트 모음 폴더

    - 다양한 컴포넌트에서 재활용됨

  - [**`contexts/`**](./src/contexts/): React Context 모음 폴더

  - [**`services/`**](./src/services/): 백엔드 API 래핑 함수 모음 폴더

    - 예) `getArticle(0)`: `GET: /api/articles/0`.

  - [**`styles/`**](./src/styles/): css 모음 폴더

  - [**`types/`**](./src/types/): 타입 정의 모음 폴더

  - [**`utils/`**](./src/utils/): 기타 유틸 함수 모음 폴더

## 라우트 엔드포인트

- **`/`** [&lt;Home /&gt;](./src/pages/Home.tsx)
- **`/signin`** [&lt;Signin /&gt;](./src/pages/Signin.tsx)
- **`/signup`** [&lt;Signup /&gt;](./src/pages/Signup.tsx)
- **`/category/:category`** [&lt;Category /&gt;](./src/pages/Category.tsx)
- **`/myarticles`** [&lt;MyArticles /&gt;](./src/pages/article/MyArticles.tsx)
- **`/article/view/:id`** [&lt;ViewArticle /&gt;](./src/pages/article/ViewArticle.tsx)
- **`/article/new`** [&lt;NewArticle /&gt;](./src/pages/article/NewArticle.tsx)
- **`/article/edit`** [&lt;EditArticle /&gt;](./src/pages/article/EditArticle.tsx)
- **`/myaccount`** [&lt;MyAccount /&gt;](./src/pages/MyAccount.tsx)
- **`/user/:username`** [&lt;User /&gt;](./src/pages/User.tsx)
- **`/*`** [&lt;NotFound /&gt;](./src/pages/NotFound.tsx)
