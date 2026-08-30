# 아카이브 블로그 (Notion CMS)

노션 데이터베이스에 글을 쓰면 자동으로 사이트에 반영되는 개인 아카이브형 블로그입니다.
모바일이든 공용 PC든 노션 앱/웹만 열면 글을 쓸 수 있고, 코드는 건드릴 필요가 없습니다.

---

## 1. 노션에서 데이터베이스 만들기

1. 노션에서 새 페이지를 만들고 **데이터베이스(표) 보기**를 추가합니다.
2. 아래 속성(컬럼)을 정확히 이 이름과 타입으로 만들어주세요.

| 속성 이름 | 타입 | 설명 |
|---|---|---|
| Name | 제목(Title) | 글 제목. 데이터베이스 기본 제목 컬럼을 그대로 사용 |
| Slug | 텍스트 | 주소에 쓰일 영문 슬러그 (예: `first-record`) |
| Date | 날짜 | 게시일 |
| Category | 셀렉트 | 분류 (예: 기록, 프로젝트, 단상) |
| Excerpt | 텍스트 | 카드에 보일 한두 줄 요약 (선택) |
| Cover | 파일과 미디어 | 대표 이미지 (선택 — 페이지 자체 커버를 써도 됩니다) |
| Published | 체크박스 | 체크해야 사이트에 노출됨 |

3. 각 행(row)을 클릭해 열면 그 페이지 본문에 실제 글을 씁니다 — 텍스트, 사진, 인용, 구분선 등을 자유롭게 섞어 쓰면 됩니다.

## 2. 노션 API 연동(Integration) 만들기

1. https://www.notion.so/my-integrations 접속 → **New integration**
2. 이름은 자유롭게 (예: "archive-blog"), 워크스페이스 선택 후 생성
3. 생성되면 나오는 **Internal Integration Secret**를 복사해둡니다 → 이게 `NOTION_API_KEY`
4. 아까 만든 데이터베이스 페이지로 가서 오른쪽 위 **···** → **연결(Connections)** → 방금 만든 integration을 검색해 연결합니다.
   (이 단계를 빼먹으면 API가 "찾을 수 없음" 오류를 냅니다.)
5. 데이터베이스 페이지 URL을 복사합니다. 예:
   `https://www.notion.so/yourname/1a2b3c4d5e6f...?v=...`
   → `1a2b3c4d5e6f...` 32자리 부분이 `NOTION_DATABASE_ID` 입니다.

## 3. 로컬에서 확인해보기 (선택)

```bash
npm install
cp .env.local.example .env.local
# .env.local 파일을 열어 NOTION_API_KEY, NOTION_DATABASE_ID 입력
npm run dev
```

`http://localhost:3000` 접속해서 확인.

## 4. Vercel로 배포하기

1. 이 프로젝트 폴더를 GitHub 저장소로 올립니다 (GitHub Desktop이나 `git push`).
2. https://vercel.com 가입 → **Add New Project** → 방금 만든 저장소 선택 → Import.
3. **Environment Variables**에 아래 두 개를 추가:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
4. **Deploy** 클릭. 몇 분 뒤 `https://프로젝트이름.vercel.app` 주소가 생깁니다.
5. 이후로는 노션에 새 글을 쓰고 Published를 체크하기만 하면, 최대 30초 이내에 사이트에 자동으로 반영됩니다. 재배포할 필요 없습니다.

## 5. 사이트 이름/문구 바꾸기

루트의 `site.config.js` 파일 하나만 열어서 이니셜, 사이트 이름, 설명 문구를 바꾸면 전체 화면에 자동 반영됩니다.

```js
module.exports = {
  siteName: "기록",
  initials: "K.R",
  description: "일과 기록을 모아두는 개인 아카이브",
  footerNote: "Archive since 2026"
};
```

## 커스텀 도메인 연결하고 싶다면

Vercel 프로젝트 → Settings → Domains 에서 갖고 계신 도메인을 추가하고, 안내되는 DNS 레코드를 도메인 구매처(가비아, 후이즈 등)에 등록하면 됩니다.
