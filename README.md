# 3D 건물 뷰어 (my-3d-service)

React + Three.js 기반 IFC 파일 3D 뷰어. 여러 건물 모델을 슬라이드 방식으로 탐색하고, 레이어별로 켜고 끄며 투명도를 실시간 조절할 수 있다.

---

## 기술 스택

<table>
  <thead>
    <tr><th>항목</th><th>내용</th></tr>
  </thead>
  <tbody>
    <tr><td>프레임워크</td><td>React 18 + Vite</td></tr>
    <tr><td>3D 엔진</td><td>Three.js</td></tr>
    <tr><td>IFC 파싱</td><td>web-ifc-three (WASM)</td></tr>
    <tr><td>3D 브릿지</td><td>@react-three/fiber</td></tr>
    <tr><td>카메라 컨트롤</td><td>camera-controls (yomotsu)</td></tr>
  </tbody>
</table>

---

## 프로젝트 구조

```
my-3d-service/
├── public/
│   ├── wasm/
│   │   └── web-ifc.wasm          # IFC 파싱 엔진 (WASM)
│   └── models/                   # IFC 모델 파일
│       ├── pcert/                # buildingSMART PCERT 샘플 (9개 레이어)
│       ├── duplex-apartment/     # Duplex 아파트 (5개 레이어)
│       ├── revit-office/         # Revit 오피스 빌딩 (3개 레이어)
│       ├── hhs-office/           # 미국 HHS 정부청사 (3개 레이어)
│       ├── advanced-project/     # 대형 복합 건물
│       ├── fzk-haus/             # FZK 주거용 건물 (독일 KIT)
│       ├── institute/            # 연구소/오피스 (독일 KIT)
│       ├── tall-building/        # 고층 빌딩
│       └── large-building/       # 대형 상업 건물
└── src/
    └── App.jsx                   # 메인 컴포넌트 (전체 UI + 3D 로직)
```

---

## 수록 모델 목록

<table>
  <thead>
    <tr><th>#</th><th>씬 이름</th><th>레이어 구성</th><th>출처</th><th>IFC 버전</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>buildingSMART PCERT 도시</td><td>건축·구조·설비·조경·교량·배수·철도·도로 (9개)</td><td>buildingSMART International</td><td>IFC 4</td></tr>
    <tr><td>2</td><td>Duplex 아파트</td><td>건축·MEP·기계·배관·전기 (5개)</td><td>buildingSMART / youshengCode</td><td>IFC 2x3</td></tr>
    <tr><td>3</td><td>Revit 오피스 빌딩</td><td>건축·구조·MEP (3개)</td><td>Autodesk Revit 공식 샘플</td><td>IFC 4</td></tr>
    <tr><td>4</td><td>HHS 미국 정부청사</td><td>건축·MEP·시공 (3개)</td><td>opensourceBIM (실제 건물)</td><td>IFC 2x3</td></tr>
    <tr><td>5</td><td>Advanced Project 복합 건물</td><td>단일</td><td>andrewisen/bim-whale-ifc-samples</td><td>IFC</td></tr>
    <tr><td>6</td><td>FZK 주거용 건물</td><td>단일</td><td>Karlsruhe Institute of Technology</td><td>IFC 4</td></tr>
    <tr><td>7</td><td>연구소/오피스 빌딩</td><td>단일</td><td>Karlsruhe Institute of Technology</td><td>IFC 4</td></tr>
    <tr><td>8</td><td>고층 빌딩</td><td>단일</td><td>andrewisen/bim-whale-ifc-samples</td><td>IFC 2x3</td></tr>
    <tr><td>9</td><td>대형 상업 건물</td><td>단일</td><td>andrewisen/bim-whale-ifc-samples</td><td>IFC 2x3</td></tr>
  </tbody>
</table>

---

## 주요 기능

- **슬라이드 내비게이션** — 상단 `‹ ›` 버튼 또는 도트로 건물 전환
- **레이어 토글** — 우상단 패널에서 레이어별 체크박스로 표시/숨김
- **투명도 슬라이더** — 레이어별 실시간 투명도 조절 (0~100%)
- **전체 선택/해제** — 한 번에 모든 레이어 on/off
- **카메라 자동 fit** — 모델 로드 시 바운딩 스피어 기반 FOV 공식으로 카메라 자동 조정
- **모델 자동 정렬** — 바닥면을 격자(y=0) 위에 자동 배치
- **마우스 컨트롤** — 좌클릭 회전 / 우클릭 이동 / 휠 줌
- **무한 줌** — 건물 내부까지 진입 가능 (`infinityDolly`), 줌 한계 없음
- **커서 기준 줌** — 마우스 위치 방향으로 확대 (`dollyToCursor`)

---

## 카메라 컨트롤 설정 (camera-controls)

[camera-controls](https://github.com/yomotsu/camera-controls) 라이브러리 사용. OrbitControls 대비 선형 줌, 무한 dolly, 커서 기준 줌 지원.

<table>
  <thead>
    <tr><th>속성</th><th>기본값</th><th>적용값</th><th>설명</th></tr>
  </thead>
  <tbody>
    <tr><td><code>dollySpeed</code></td><td>1.0</td><td><strong>0.5</strong></td><td>휠 줌 속도</td></tr>
    <tr><td><code>truckSpeed</code></td><td>2.0</td><td><strong>0.8</strong></td><td>우클릭 이동 속도</td></tr>
    <tr><td><code>azimuthRotateSpeed</code></td><td>1.0</td><td><strong>0.4</strong></td><td>좌우 회전 속도</td></tr>
    <tr><td><code>polarRotateSpeed</code></td><td>1.0</td><td><strong>0.4</strong></td><td>상하 회전 속도</td></tr>
    <tr><td><code>dollyToCursor</code></td><td>false</td><td><strong>true</strong></td><td>마우스 커서 방향으로 줌</td></tr>
    <tr><td><code>infinityDolly</code></td><td>false</td><td><strong>true</strong></td><td>줌 한계 없음 (내부 진입 가능)</td></tr>
  </tbody>
</table>

> BIM/CAD 뷰어 특성상 기본값보다 낮은 감도로 설정. 조정이 필요하면 `src/App.jsx`의 `CameraRig` 컴포넌트 내 수치를 변경.

---

## 실행 방법

```bash
cd my-3d-service
npm install
npm run dev
# → http://localhost:5173
```

---

## 새 IFC 모델 추가 방법

1. `public/models/<폴더명>/` 에 `.ifc` 파일 복사
2. `src/App.jsx` 상단 `SCENES` 배열에 항목 추가:

```js
{
  id: 'my-building',
  name: '건물 이름',
  desc: '설명',
  tag: 'IFC 4  ·  Office',
  layers: [
    { id: 'arc', name: '건축', url: '/models/<폴더명>/Architecture.ifc', visible: true, opacity: 1 },
    { id: 'str', name: '구조', url: '/models/<폴더명>/Structural.ifc',   visible: true, opacity: 1 },
  ],
}
```

---

## IFC 파일 출처 (모델별)

<table>
  <thead>
    <tr><th>폴더</th><th>원본 제작</th><th>다운로드 출처</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>pcert/</code></td>
      <td>buildingSMART International</td>
      <td><a href="https://github.com/buildingSMART/Sample-Test-Files">github.com/buildingSMART/Sample-Test-Files</a></td>
    </tr>
    <tr>
      <td><code>duplex-apartment/</code></td>
      <td>buildingSMART / Autodesk</td>
      <td><a href="https://github.com/youshengCode/IfcSampleFiles">github.com/youshengCode/IfcSampleFiles</a></td>
    </tr>
    <tr>
      <td><code>revit-office/</code></td>
      <td>Autodesk Revit</td>
      <td><a href="https://github.com/youshengCode/IfcSampleFiles">github.com/youshengCode/IfcSampleFiles</a></td>
    </tr>
    <tr>
      <td><code>hhs-office/</code></td>
      <td>미국 보건복지부 (HHS) — 실제 건물</td>
      <td><a href="https://github.com/opensourceBIM/IFC-files">github.com/opensourceBIM/IFC-files</a></td>
    </tr>
    <tr>
      <td><code>advanced-project/</code></td>
      <td>andrewisen (BIM Whale)</td>
      <td><a href="https://github.com/andrewisen/bim-whale-ifc-samples">github.com/andrewisen/bim-whale-ifc-samples</a></td>
    </tr>
    <tr>
      <td><code>tall-building/</code></td>
      <td>andrewisen (BIM Whale)</td>
      <td><a href="https://github.com/andrewisen/bim-whale-ifc-samples">github.com/andrewisen/bim-whale-ifc-samples</a></td>
    </tr>
    <tr>
      <td><code>large-building/</code></td>
      <td>andrewisen (BIM Whale)</td>
      <td><a href="https://github.com/andrewisen/bim-whale-ifc-samples">github.com/andrewisen/bim-whale-ifc-samples</a></td>
    </tr>
    <tr>
      <td><code>fzk-haus/</code></td>
      <td>Karlsruhe Institute of Technology (KIT)</td>
      <td><a href="https://www.steptools.com/docs/stpfiles/ifc/">steptools.com/docs/stpfiles/ifc</a></td>
    </tr>
    <tr>
      <td><code>institute/</code></td>
      <td>Karlsruhe Institute of Technology (KIT)</td>
      <td><a href="https://www.steptools.com/docs/stpfiles/ifc/">steptools.com/docs/stpfiles/ifc</a></td>
    </tr>
  </tbody>
</table>

---

## 향후 계획

- 센서 데이터 표시 (위치 기반 마커)
- Spring Boot 백엔드 연동 (실시간 센서 API)
- 클릭 시 객체 속성 정보 표시 (IFC 메타데이터)
- 단면 클리핑 플레인
