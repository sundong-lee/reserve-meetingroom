# 구현 계획

## 기술 구조

**스택**
- Frontend: React 19 + TypeScript + Tailwind CSS
- Backend: Supabase (PostgreSQL + Edge Functions)
- 상태관리: React Query + Context API
- 배포: Vercel

**폴더 구조**
```
src/
├─ components/
│  ├─ Layout/
│  ├─ RoomCard/
│  ├─ Dashboard/
│  ├─ TimelineView/
│  ├─ ReservationModal/
│  └─ MyReservations/
├─ pages/
│  ├─ Home.tsx
│  ├─ Dashboard.tsx
│  └─ MyReservations.tsx
├─ lib/
│  ├─ supabase.ts
│  ├─ reservationLogic.ts
│  └─ timeSlots.ts
├─ types/
│  └─ index.ts
└─ App.tsx
```

---

## 데이터 모델

**회의실 (rooms)**
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,           -- "회의실A"
  capacity INT NOT NULL,         -- 5
  location TEXT NOT NULL,        -- "3층"
  created_at TIMESTAMP
);
```

**예약 (reservations)**
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY,
  room_id UUID REFERENCES rooms(id),
  user TEXT NOT NULL,            -- "김철수" (간단한 username)
  start_time TIMESTAMP NOT NULL, -- 2026-09-03 15:00:00
  end_time TIMESTAMP NOT NULL,   -- 2026-09-03 15:30:00
  created_at TIMESTAMP
);

-- 더블부킹 방지 제약
CREATE UNIQUE INDEX no_double_booking
ON reservations (room_id, start_time, end_time)
WHERE deleted_at IS NULL;
```

---

## 마일스톤 개요

| M | 목표 | 끝나면 보이는 것 | 예상 시간 |
|---|------|-----------------|---------|
| M1 | 프로젝트 셋업 + 기본 UI 골격 | 회의실 목록 페이지 로드 | 15분 |
| M2 | 회의실 카드 표시 + DB 연동 | Supabase에서 회의실 목록 조회 표시 | 20분 |
| M3 | 대시보드 화면 + 시간별 현황 | 시간×회의실 매트릭스 렌더링 | 20분 |
| M4 | 예약 기능 + 더블부킹 감지 | 예약 시도 → 성공/충돌 안내 | 25분 |
| M5 | 마이 예약 + 취소 기능 | 예약 목록 보기 + 취소 가능 | 15분 |
| M6 | 반응형 + 마무리 | 모바일/태블릿에서도 정상 작동 | 15분 |
| M7 | 최종 QA | 전체 시나리오 검증 완료 | 10분 |

**총 예상 시간**: 120분

---

## 마일스톤 상세

### M1. 프로젝트 셋업 + 기본 UI 골격

**할 일**
- React + TS 프로젝트 생성 (Vite)
- Tailwind CSS 설정
- Supabase 클라이언트 설정 (기존 계정 사용)
- 기본 레이아웃 컴포넌트 (Header, Nav, Main)
- 페이지 라우팅 구조 (Home / Dashboard / MyReservations)

**검증**
- 자동: 빌드 성공, 타입 체크 통과
- 수동: 로컬호스트에서 레이아웃 표시 확인

---

### M2. 회의실 카드 표시 + DB 연동

**할 일**
- Supabase rooms 테이블 마이그레이션 (3개 샘플 데이터)
- RoomCard 컴포넌트 (이름, 인원, 위치 표시)
- Home 페이지: 회의실 카드 그리드 렌더링
- 날짜/시간 선택 UI (데이트피커 또는 선택박스)

**검증**
- 자동: 데이터 fetch 호출 성공, 컴포넌트 렌더링
- 수동: 카드 그리드 표시 확인 + "예약하기" 버튼 동작 미리보기

---

### M3. 대시보드 화면 + 시간별 현황

**할 일**
- Dashboard 페이지 구현
- 시간(14:00~18:00) ×회의실 매트릭스 테이블 생성
- 예약 데이터 fetch + 셀에 표시 (예약자명)
- 빈 슬롯(▢) vs 예약됨(▣) 시각화

**검증**
- 자동: 테이블 렌더링, 데이터 정렬 확인
- 수동: 대시보드 탭 클릭 → 시간×회의실 현황 표시

---

### M4. 예약 기능 + 더블부킹 감지 ⭐ (차별점)

**할 일**
- ReservationModal 컴포넌트 (회의실, 시간, 사용자명 입력)
- 예약 제출 전 더블부킹 체크 로직:
  - 선택한 시간대에 이미 예약이 있는가?
  - 있으면 "이 시간에는 예약할 수 없습니다" 표시
  - 없으면 예약 저장
- Supabase reservations 테이블 쓰기
- 예약 성공 메시지 표시

**검증**
- 자동: 더블부킹 로직 단위 테스트
- 수동: 
  - 시나리오 S1: 가능한 시간 예약 → 성공
  - 시나리오: 이미 예약된 시간 시도 → "불가능" 안내

---

### M5. 마이 예약 + 취소 기능

**할 일**
- MyReservations 페이지
- 현재 사용자의 예약 목록 조회 (username 기반)
- 각 예약마다 "취소" 버튼
- 취소 기능: reservations 테이블에서 삭제 또는 soft delete

**검증**
- 자동: 예약 목록 쿼리 성공
- 수동: 
  - 예약 후 "내 예약" 탭에서 표시 확인
  - 취소 → 목록에서 제거 확인

---

### M6. 반응형 + 마무리

**할 일**
- Tailwind 반응형 클래스 적용 (md/sm 브레이크포인트)
- 모바일: 카드 스택 레이아웃, 테이블 스크롤
- README.md 작성 (설치·실행 방법)
- .env.example 작성

**검증**
- 자동: 빌드, 타입 체크
- 수동: 
  - 데스크톱 (1920px) 확인
  - 태블릿 (768px) 확인
  - 모바일 (375px) 확인

---

### M7. 최종 QA

**할 일**
- S1, S2 시나리오 전체 재현
- 엣지 케이스 테스트:
  - 동시 다중 예약 시도
  - 빈 username으로 예약 시도 → 거절
  - 긴 이름 입력
  - 한글 입력 (IME) 확인
- 브라우저 성능 확인

**검증**
- 자동: 빌드·린트 최종 통과
- 수동: 체크리스트 완료

---

## 차별점 반영 위치

**요구사항**: "더블부킹을 자동으로 감지해서 예약 충돌을 방지"

→ **M4 (예약 기능)** 의 "더블부킹 체크 로직"에서 구현
- DB 제약: `UNIQUE INDEX no_double_booking`
- UI 안내: 예약 불가 시 명확한 메시지

---

## v2로 미루기

- 캘린더 내보내기 (ics 다운로드)
- 메일 알림
- 반복 예약 (매주 같은 시간 자동 예약)
- 회의실 사진/상세 설명
- 관리자 승인 워크플로우
- 사용자 인증 (현재: 간단한 username)

---

## 가정 목록

- **(가정) 사용자 인증**: 이 v1에서는 username 텍스트 입력만. 나중에 OAuth/email 추가.
- **(가정) 예약 시간대**: 9:00~18:00만 표시 (업무 시간).
- **(가정) 스타일**: Tailwind CSS 기본. 디자인 세부는 구현 중 결정.
- **(가정) 회의실 샘플 데이터**: 3개 회의실(A, B, C)로 시작.
- **(가정) 배포**: Vercel (또는 수동 배포 가능).
