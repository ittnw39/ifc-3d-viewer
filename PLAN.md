오늘의 목표인 **"리액트에서 3D 건물을 띄우고 마우스로 돌려보기"**와 다음 목표인 **"센서 표시 및 클릭 이벤트"**까지 한 번에 실행할 수 있는 완성형 가이드를 드릴게요.

1단계: 프로젝트 생성 및 필수 라이브러리 설치
터미널(CMD 또는 터미널 앱)을 열고 아래 명령어를 순서대로 입력하세요.

Bash

# 1. Vite를 이용해 리액트 프로젝트 생성

npm create vite@latest my-3d-service -- --template react
cd my-3d-service

# 2. 3D 구현을 위한 핵심 라이브러리 설치

# three: 3D 엔진

# web-ifc-three: IFC 파일을 직접 읽는 라이브러리

# @react-three/fiber: 리액트용 3D 브릿지

# @react-three/drei: 3D 유틸리티(카메라 컨트롤 등)

npm install three web-ifc-three @react-three/fiber @react-three/drei
2단계: WASM 파일 및 IFC 파일 배치 (매우 중요)
IFC.js는 웹 어셈블리(WASM)라는 기술을 써서 브라우저에서 파일을 읽습니다. 이 설정이 안 되면 에러가 납니다.

WASM 복사: node_modules/web-ifc 폴더 안에 있는 web-ifc.wasm 파일을 복사해서 프로젝트의 public/wasm/ 폴더를 만들고 그 안에 넣으세요.

IFC 파일 복사: 가지고 계신 샘플 파일 중 Building-Architecture.ifc와 Infra-Plumbing.ifc를 public/models/ 폴더에 넣으세요.

3단계: 전체 소스 코드 (App.jsx)
src/App.jsx 파일을 열어 기존 내용을 다 지우고 아래 코드를 그대로 붙여넣으세요. 주석으로 각 기능(모델 로딩, 센서 생성, 클릭 이벤트)을 상세히 적어두었습니다.

JavaScript
import React, { Suspense, useEffect, useState, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { IFCLoader } from 'web-ifc-three/IFCLoader'

// 1. IFC 모델을 불러오는 컴포넌트
function IFCModel({ url, opacity = 1, onSelect }) {
const { scene } = useThree()

useEffect(() => {
const ifcLoader = new IFCLoader()
// WASM 경로 설정 (2단계에서 만든 경로)
ifcLoader.ifcManager.setWasmPath('/wasm/')

    ifcLoader.load(url, (ifcModel) => {
      // 투명도 조절 (껍데기 건물용)
      ifcModel.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true
          child.material.opacity = opacity
        }
      })
      scene.add(ifcModel)
    })

}, [url, scene, opacity])

return null
}

// 2. 센서를 표시하는 컴포넌트 (빨간 구체)
function Sensor({ position, data }) {
return (
<mesh
position={position}
onClick={(e) => {
e.stopPropagation();
alert(`센서 데이터: ${data.value}${data.unit}`);
}} >
<sphereGeometry args={[0.3, 32, 32]} />
<meshStandardMaterial color="red" emissive="red" emissiveIntensity={2} />
</mesh>
)
}

export default function App() {
// 임시 하드코딩 데이터 (나중에 스프링부트에서 받아올 데이터)
const [sensorData] = useState([
{ id: 1, position: [5, 2, 3], value: 25.4, unit: '°C' },
{ id: 2, position: [10, 5, -2], value: 1.2, unit: 'mm' }
])

return (

<div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
<Canvas>
{/_ 카메라 및 조명 설정 _/}
<PerspectiveCamera makeDefault position={[20, 20, 20]} />
<ambientLight intensity={0.5} />
<pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
          {/* 목표 1: 건물 껍데기와 배수관 띄우기 */}
          <IFCModel url="/models/Building-Architecture.ifc" opacity={0.2} />
          <IFCModel url="/models/Infra-Plumbing.ifc" opacity={1} />

          {/* 목표 2: 특정 좌표에 센서 찍기 */}
          {sensorData.map(sensor => (
            <Sensor key={sensor.id} position={sensor.position} data={sensor} />
          ))}
        </Suspense>

        {/* 마우스 드래그로 돌려보기 기능 */}
        <OrbitControls />
        <Stars />
      </Canvas>

      {/* 상단 UI 레이어 */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', pointerEvents: 'none' }}>
        <h1>건물 안전 진단 시스템 (MVP)</h1>
        <p>마우스 드래그: 회전 / 휠: 확대 / 빨간 점: 센서 클릭</p>
      </div>
    </div>

)
}
4단계: 실행 및 테스트
터미널에서 npm run dev를 입력합니다.

브라우저에서 출력된 주소(보통 http://localhost:5173)로 접속합니다.

오늘의 목표 확인: \* 건물이 화면에 나오나요?

마우스 왼쪽 드래그로 회전, 오른쪽 드래그로 이동, 휠로 확대/축소가 되나요?

다음 목표 확인:

건물 안에 떠 있는 빨간 구체가 보이나요?

그 구체를 클릭했을 때 alert 창이 뜨나요?
