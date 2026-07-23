# YOON WOOK Portfolio

```powershell
npm install
npm run dev
```

GitHub Pages: Settings → Pages → Source: GitHub Actions

## 2026-07 업데이트

- 홈페이지 전 영역의 `PMO` 표기를 `사업관리`로 변경
- AI 자동견적시스템(AOS) 프로젝트 역할을 `사업관리`로 통일
- 메인페이지, 소개, 프로젝트 카드의 표현을 동일 기준으로 정비


## 이미지 반영
- 메인 프로필: 배경 투명 처리 후 금융 도시 야경 위에 배치
- 프로젝트 카드: 각 프로젝트별 이미지 배경 적용


## 관리자 화면

홈페이지에서 `관리자` 버튼을 누르거나 아래 주소로 접속합니다.

`https://yoonwook66-cloud.github.io/yoonwook-portfolio/#/admin`

초기 PIN: `1966`

관리 기능:
- 메인 프로필 사진 및 배경 교체
- 이력서·포트폴리오 파일 교체
- 경력 항목 추가·수정·삭제
- 프로젝트 추가·수정·삭제 및 배경 이미지 교체
- 메인 문구 및 연락처 수정
- 전체 데이터 JSON 백업·복구

### 저장 방식의 제한

현재 GitHub Pages는 정적 호스팅이므로 관리자 변경 사항은 해당 브라우저의
`IndexedDB`와 `localStorage`에만 저장됩니다. 다른 기기와 모든 방문자에게 같은
내용을 공개하려면 Supabase/Firebase 같은 백엔드 연결이 필요합니다.
