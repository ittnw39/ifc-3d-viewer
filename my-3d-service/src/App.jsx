import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CameraControls from 'camera-controls'

CameraControls.install({ THREE })

// ── 건물 씬 정의 ──────────────────────────────────────────────
const SCENES = [
  {
    id: 'pcert',
    name: 'buildingSMART PCERT 도시',
    desc: 'buildingSMART 국제 인증용 샘플 · 건물+인프라 복합 씬',
    tag: 'IFC 4.0  ·  Multi-discipline',
    layers: [
      { id: 'arch',        name: '건축 Architecture',  url: '/models/pcert/Building-Architecture.ifc', visible: true,  opacity: 0.35 },
      { id: 'struct',      name: '구조 Structural',    url: '/models/pcert/Building-Structural.ifc',   visible: true,  opacity: 1    },
      { id: 'hvac',        name: '설비 HVAC',          url: '/models/pcert/Building-Hvac.ifc',         visible: false, opacity: 1    },
      { id: 'landscaping', name: '조경 Landscaping',   url: '/models/pcert/Building-Landscaping.ifc',  visible: false, opacity: 1    },
      { id: 'bridge',      name: '인프라 Bridge',       url: '/models/pcert/Infra-Bridge.ifc',          visible: false, opacity: 1    },
      { id: 'infra-land',  name: '인프라 조경',          url: '/models/pcert/Infra-Landscaping.ifc',     visible: false, opacity: 1    },
      { id: 'plumbing',    name: '배수 Plumbing',       url: '/models/pcert/Infra-Plumbing.ifc',        visible: false, opacity: 1    },
      { id: 'rail',        name: '철도 Rail',           url: '/models/pcert/Infra-Rail.ifc',            visible: false, opacity: 1    },
      { id: 'road',        name: '도로 Road',           url: '/models/pcert/Infra-Road.ifc',            visible: false, opacity: 1    },
    ],
  },
  {
    id: 'duplex',
    name: 'Duplex 아파트',
    desc: 'buildingSMART 공식 샘플 · 건축/전기/기계/MEP/배관 5개 레이어',
    tag: 'IFC 2x3  ·  Residential  ·  Multi-discipline',
    layers: [
      { id: 'dup-arch', name: '건축 Architecture', url: '/models/duplex-apartment/Architecture.ifc', visible: true,  opacity: 0.4 },
      { id: 'dup-mep',  name: '설비 MEP',          url: '/models/duplex-apartment/MEP.ifc',          visible: true,  opacity: 1   },
      { id: 'dup-mech', name: '기계 Mechanical',   url: '/models/duplex-apartment/Mechanical.ifc',   visible: false, opacity: 1   },
      { id: 'dup-plb',  name: '배관 Plumbing',     url: '/models/duplex-apartment/Plumbing.ifc',     visible: false, opacity: 1   },
      { id: 'dup-ele',  name: '전기 Electrical',   url: '/models/duplex-apartment/Electrical.ifc',   visible: false, opacity: 1   },
    ],
  },
  {
    id: 'revit-office',
    name: 'Revit 오피스 빌딩',
    desc: 'Autodesk Revit 공식 BIM 샘플 · 건축/구조/MEP 3개 레이어',
    tag: 'IFC 4  ·  Office  ·  Multi-discipline',
    layers: [
      { id: 'rev-arc', name: '건축 Architecture', url: '/models/revit-office/Architecture.ifc', visible: true,  opacity: 0.35 },
      { id: 'rev-str', name: '구조 Structural',   url: '/models/revit-office/Structural.ifc',   visible: true,  opacity: 1    },
      { id: 'rev-mep', name: '설비 MEP',          url: '/models/revit-office/MEP.ifc',          visible: false, opacity: 1    },
    ],
  },
  {
    id: 'hhs',
    name: 'HHS 미국 정부청사 오피스',
    desc: '미국 보건복지부(HHS) 실제 건물 · 건축/MEP/시공 3개 레이어',
    tag: 'IFC 2x3  ·  Real Building  ·  Multi-discipline',
    layers: [
      { id: 'hhs-arc',  name: '건축 Architecture',  url: '/models/hhs-office/Architecture.ifc',  visible: true,  opacity: 0.35 },
      { id: 'hhs-mep',  name: '설비 MEP',            url: '/models/hhs-office/MEP.ifc',            visible: true,  opacity: 1    },
      { id: 'hhs-con',  name: '시공 Construction',   url: '/models/hhs-office/Construction.ifc',   visible: false, opacity: 1    },
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced Project 복합 건물',
    desc: 'BIM Whale 고급 샘플 · 복잡한 복합 건물 구조',
    tag: 'IFC  ·  Mixed-use',
    layers: [
      { id: 'adv', name: 'Building', url: '/models/advanced-project/Building.ifc', visible: true, opacity: 1 },
    ],
  },
  {
    id: 'fzk',
    name: 'FZK 주거용 건물',
    desc: '독일 카를스루에 공과대학(KIT) 제공 · 전통 유럽 2층 주택',
    tag: 'IFC 4  ·  Residential',
    layers: [
      { id: 'fzk', name: 'FZK Haus', url: '/models/fzk-haus/FZK-Haus.ifc', visible: true, opacity: 1 },
    ],
  },
  {
    id: 'institute',
    name: '연구소 / 오피스 빌딩',
    desc: '독일 카를스루에 공과대학(KIT) 제공 · 대형 연구소 & 사무동',
    tag: 'IFC 4  ·  Office / Institute',
    layers: [
      { id: 'inst', name: 'Institute', url: '/models/institute/Institute.ifc', visible: true, opacity: 1 },
    ],
  },
  {
    id: 'tall',
    name: '고층 빌딩 (Tall Building)',
    desc: '다층 고층 오피스 · 커튼월 외장 구조',
    tag: 'IFC 2x3  ·  High-rise Office',
    layers: [
      { id: 'tall', name: 'Tall Building', url: '/models/tall-building/TallBuilding.ifc', visible: true, opacity: 1 },
    ],
  },
  {
    id: 'large',
    name: '대형 상업 건물 (Large Building)',
    desc: '복잡한 대형 상업·업무 복합 시설',
    tag: 'IFC 2x3  ·  Commercial',
    layers: [
      { id: 'large', name: 'Large Building', url: '/models/large-building/LargeBuilding.ifc', visible: true, opacity: 1 },
    ],
  },

  // ── BIMData / DURAARK 오픈 데이터셋 ──────────────────────────
  {
    id: 'sgd-hitos',
    name: 'SGD HiTOS 오피스 (노르웨이)',
    desc: '노르웨이 오피스 빌딩 · 건축/전기/HVAC 3개 레이어',
    tag: 'IFC 2x3  ·  Office  ·  Multi-discipline',
    layers: [
      { id: 'hitos-arc',  name: '건축 Architecture', url: '/models/SGD_HiTOS/SGD_HiTOS_Arch.ifc',      visible: true,  opacity: 0.35 },
      { id: 'hitos-ele',  name: '전기 Electrical',   url: '/models/SGD_HiTOS/SGD_HiTOS_Eng-ELE.ifc',   visible: true,  opacity: 1    },
      { id: 'hitos-hvac', name: '설비 HVAC',          url: '/models/SGD_HiTOS/SGD_HiTOS_Eng-HVAC.ifc',  visible: false, opacity: 1    },
    ],
  },
  {
    id: 'sgd-blueberry',
    name: 'SGD Blueberry 아파트 (노르웨이)',
    desc: '노르웨이 주거용 아파트 · 건축/HVAC/배관/환기 다층 구성',
    tag: 'IFC 2x3  ·  Residential  ·  Multi-discipline',
    layers: [
      { id: 'bb-arc1',  name: '건축 1동 Arch-1',  url: '/models/SGD_Blueberry/SGD_Blueberry_Arch-1.ifc',                visible: true,  opacity: 0.35 },
      { id: 'bb-arc2',  name: '건축 2동 Arch-2',  url: '/models/SGD_Blueberry/SGD_Blueberry_Arch-2.ifc',                visible: false, opacity: 0.35 },
      { id: 'bb-arc3',  name: '건축 3동 Arch-3',  url: '/models/SGD_Blueberry/SGD_Blueberry_Arch-3.ifc',                visible: false, opacity: 0.35 },
      { id: 'bb-hvac',  name: '설비 HVAC',         url: '/models/SGD_Blueberry/SGD_Blueberry_Eng-HVAC.ifc',              visible: true,  opacity: 1    },
      { id: 'bb-plb1',  name: '배관 Plumbing-1',   url: '/models/SGD_Blueberry/SGD_Blueberry_Eng-HVAC-Plumbing-1.ifc',  visible: false, opacity: 1    },
      { id: 'bb-plb2',  name: '배관 Plumbing-2',   url: '/models/SGD_Blueberry/SGD_Blueberry_Eng-HVAC-Plumbing-2.ifc',  visible: false, opacity: 1    },
      { id: 'bb-vent',  name: '환기 Ventilation',   url: '/models/SGD_Blueberry/SGD_Blueberry_Eng-HVAC-Ventilation.ifc', visible: false, opacity: 1    },
    ],
  },
  {
    id: 'sgd-munkerud',
    name: 'SGD Munkerud 주거단지 (노르웨이)',
    desc: '노르웨이 주거 단지 · 건축/전기/위생/환기 4개 레이어',
    tag: 'IFC 2x3  ·  Residential  ·  Multi-discipline',
    layers: [
      { id: 'mun-arc1', name: '건축 1동 Arch-1',   url: '/models/SGD_Munkerud/SGD_Munkerud_Arch-1.ifc',               visible: true,  opacity: 0.35 },
      { id: 'mun-arc2', name: '건축 2동 Arch-2',   url: '/models/SGD_Munkerud/SGD_Munkerud_Arch-2.ifc',               visible: false, opacity: 0.35 },
      { id: 'mun-arc3', name: '건축 3동 Arch-3',   url: '/models/SGD_Munkerud/SGD_Munkerud_Arch-3.ifc',               visible: false, opacity: 0.35 },
      { id: 'mun-ele',  name: '전기 Electrical',    url: '/models/SGD_Munkerud/SGD_Munkerud_Eng-ELE.ifc',              visible: true,  opacity: 1    },
      { id: 'mun-san',  name: '위생 Sanitary',      url: '/models/SGD_Munkerud/SGD_Munkerud_Eng-HVAC-Sanitary.ifc',   visible: false, opacity: 1    },
      { id: 'mun-vent', name: '환기 Ventilation',   url: '/models/SGD_Munkerud/SGD_Munkerud_Eng-HVAC-Ventilation.ifc', visible: false, opacity: 1    },
    ],
  },
  {
    id: 'sgd-bodo',
    name: 'SGD BODO 건물 (노르웨이)',
    desc: '노르웨이 복합 건물 · 건축/배관/환기 3개 레이어',
    tag: 'IFC 2x3  ·  Mixed-use  ·  Multi-discipline',
    layers: [
      { id: 'bodo-arc1', name: '건축 1동 Arch-1',  url: '/models/SGD_BODO/SGD_BODO_Arch-1.ifc',                visible: true,  opacity: 0.35 },
      { id: 'bodo-arc2', name: '건축 2동 Arch-2',  url: '/models/SGD_BODO/SGD_BODO_Arch-2.ifc',                visible: false, opacity: 0.35 },
      { id: 'bodo-arc3', name: '건축 3동 Arch-3',  url: '/models/SGD_BODO/SGD_BODO_Arch-3.ifc',                visible: false, opacity: 0.35 },
      { id: 'bodo-plb',  name: '배관 Plumbing',     url: '/models/SGD_BODO/SGD_BODO_Eng-HVAC-Plumbing.ifc',   visible: true,  opacity: 1    },
      { id: 'bodo-vent', name: '환기 Ventilation',  url: '/models/SGD_BODO/SGD_BODO_Eng-HVAC-Ventilation.ifc', visible: false, opacity: 1    },
    ],
  },
  {
    id: 'nbu-duplex',
    name: 'NBU Duplex 아파트 (미국)',
    desc: '미국 듀플렉스 아파트 · 건축/HVAC/MEP 3개 레이어',
    tag: 'IFC 2x3  ·  Residential  ·  Multi-discipline',
    layers: [
      { id: 'nbud-arc',  name: '건축 Architecture', url: '/models/NBU_Duplex/NBU_Duplex-Apt_Arch-Optimized.ifc', visible: true,  opacity: 0.35 },
      { id: 'nbud-hvac', name: '설비 HVAC',          url: '/models/NBU_Duplex/NBU_Duplex-Apt_Eng-HVAC.ifc',      visible: true,  opacity: 1    },
      { id: 'nbud-mep',  name: 'MEP',                url: '/models/NBU_Duplex/NBU_Duplex-Apt_Eng-MEP-1.ifc',     visible: false, opacity: 1    },
    ],
  },
  {
    id: 'nvw-dcr',
    name: 'NVW DCR 건물 LOD300 (네덜란드)',
    desc: '네덜란드 건물 · LOD300 건축/구조/HVAC 3개 레이어',
    tag: 'IFC 2x3  ·  LOD300  ·  Multi-discipline',
    layers: [
      { id: 'nvw-arc',  name: '건축 Architecture', url: '/models/NVW_DCR/NVW_DCR-LOD300_Arch.ifc',      visible: true,  opacity: 0.35 },
      { id: 'nvw-con',  name: '구조 Construction',  url: '/models/NVW_DCR/NVW_DCR-LOD300_Eng-CON.ifc',   visible: true,  opacity: 1    },
      { id: 'nvw-hvac', name: '설비 HVAC',           url: '/models/NVW_DCR/NVW_DCR-LOD300_Eng-HVAC.ifc',  visible: false, opacity: 1    },
    ],
  },
  {
    id: 'nbu-clinic',
    name: 'NBU 메디컬 클리닉 (미국)',
    desc: '미국 의료 클리닉 건물 · 건축/전기/HVAC/MEP/시공 5개 레이어',
    tag: 'IFC 2x3  ·  Medical  ·  Multi-discipline',
    layers: [
      { id: 'cli-arc',  name: '건축 Architecture', url: '/models/NBU_MedicalClinic/NBU_MedicalClinic_Arch-Optimized.ifc',   visible: true,  opacity: 0.35 },
      { id: 'cli-ele',  name: '전기 Electrical',   url: '/models/NBU_MedicalClinic/NBU_MedicalClinic_Eng-ELE.ifc',          visible: true,  opacity: 1    },
      { id: 'cli-hvac', name: '설비 HVAC',          url: '/models/NBU_MedicalClinic/NBU_MedicalClinic_Eng-HVAC.ifc',         visible: false, opacity: 1    },
      { id: 'cli-mep',  name: 'MEP',                url: '/models/NBU_MedicalClinic/NBU_MedicalClinic_Eng-MEP-Optimized.ifc', visible: false, opacity: 1    },
      { id: 'cli-con',  name: '시공 Construction',  url: '/models/NBU_MedicalClinic/NBU_MedicalClinic_Eng-CON-Optimized.ifc', visible: false, opacity: 1    },
    ],
  },
  {
    id: 'ltu-ahouse',
    name: 'LTU A-House (스웨덴)',
    desc: '스웨덴 룰레오 공과대학 · 냉난방/배관/환기/구조 9개 레이어',
    tag: 'IFC 2x3  ·  Residential  ·  Multi-discipline',
    layers: [
      { id: 'ltu-str',  name: '구조 Structure',     url: '/models/LTU_AHouse/LTU_A-House_K-modell.ifc',   visible: true,  opacity: 0.35 },
      { id: 'ltu-air',  name: '환기 Air',            url: '/models/LTU_AHouse/LTU_A-House_Air.ifc',         visible: true,  opacity: 1    },
      { id: 'ltu-duct', name: '덕트 Ducting',        url: '/models/LTU_AHouse/LTU_A-House_Ducting.ifc',     visible: false, opacity: 1    },
      { id: 'ltu-heat', name: '난방 Heating',        url: '/models/LTU_AHouse/LTU_A-House_Heating.ifc',     visible: false, opacity: 1    },
      { id: 'ltu-cool', name: '냉방 Cooling',        url: '/models/LTU_AHouse/LTU_A-House_Cooling.ifc',     visible: false, opacity: 1    },
      { id: 'ltu-plb',  name: '배관 Plumbing',       url: '/models/LTU_AHouse/LTU_A-House_Plumbing.ifc',    visible: false, opacity: 1    },
      { id: 'ltu-san',  name: '위생 Sanitation',     url: '/models/LTU_AHouse/LTU_A-House_Sanitation.ifc',  visible: false, opacity: 1    },
    ],
  },
]

// ── IFC 모델 로딩 컴포넌트 (커스텀 Web Worker — web-ifc 직접 파싱) ──
function IFCModel({ url, opacity = 1, onLoaded }) {
  const { scene } = useThree()
  const modelRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let cancelled = false

    const worker = new Worker(
      new URL('./ifcWorker.js', import.meta.url),
      { type: 'module' }
    )

    worker.onmessage = ({ data }) => {
      if (cancelled) return

      if (!data.ok) {
        console.error('IFC Worker 오류:', url, data.error)
        setLoading(false)
        return
      }

      const group = new THREE.Group()

      for (const { color, transform, vertices, indices } of data.meshGroups) {
        const verts = new Float32Array(vertices)
        const idxs  = new Uint32Array(indices)

        // web-ifc 버텍스 포맷: [x, y, z, nx, ny, nz] 6개 단위
        const count = verts.length / 6
        const positions = new Float32Array(count * 3)
        const normals   = new Float32Array(count * 3)
        for (let i = 0, j = 0; i < verts.length; i += 6, j += 3) {
          positions[j]   = verts[i];   positions[j+1] = verts[i+1]; positions[j+2] = verts[i+2]
          normals[j]     = verts[i+3]; normals[j+1]   = verts[i+4]; normals[j+2]   = verts[i+5]
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('normal',   new THREE.BufferAttribute(normals, 3))
        geometry.setIndex(new THREE.BufferAttribute(idxs, 1))

        const mat = new THREE.MeshLambertMaterial({
          color: new THREE.Color(color.r, color.g, color.b),
          transparent: true,
          opacity: color.a * opacity,
          side: THREE.DoubleSide,
        })

        const mesh = new THREE.Mesh(geometry, mat)
        mesh.applyMatrix4(new THREE.Matrix4().fromArray(transform))
        group.add(mesh)
      }

      // 바닥을 y=0에 맞추고 XZ 중앙 정렬
      const box    = new THREE.Box3().setFromObject(group)
      const center = box.getCenter(new THREE.Vector3())
      group.position.x -= center.x
      group.position.z -= center.z
      group.position.y -= box.min.y

      scene.add(group)
      modelRef.current = group
      setLoading(false)

      if (onLoaded) {
        const sphere = new THREE.Box3().setFromObject(group).getBoundingSphere(new THREE.Sphere())
        onLoaded(sphere.radius)
      }
    }

    worker.onerror = (e) => {
      console.error('Worker 에러:', url, e.message)
      setLoading(false)
    }

    worker.postMessage({ id: url, url })

    return () => {
      cancelled = true
      worker.terminate()
      if (modelRef.current) {
        scene.remove(modelRef.current)
        modelRef.current = null
      }
    }
  }, [url, scene])

  // opacity 실시간 반영
  useEffect(() => {
    if (!modelRef.current) return
    modelRef.current.traverse((child) => {
      if (!child.isMesh) return
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m) => { m.transparent = true; m.opacity = opacity })
    })
  }, [opacity])

  return null
}



// ── 상단 슬라이드 내비게이터 ───────────────────────────────────
function SceneNavigator({ scenes, current, onChange }) {
  return (
    <div style={{
      position: 'absolute', top: 56, left: 0, right: 0,
      height: 88,
      background: '#f7f7f7',
      borderBottom: '1px solid #ddd',
      display: 'flex', flexDirection: 'column',
      zIndex: 10,
      userSelect: 'none',
    }}>
      {/* 메인 행: 버튼 + 텍스트 */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <button
          onClick={() => onChange((current - 1 + scenes.length) % scenes.length)}
          style={navBtnStyle}
        >
          ‹
        </button>

        <div style={{ flex: 1, textAlign: 'center', padding: '0 12px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111', letterSpacing: '-0.3px' }}>
            {scenes[current].name}
          </div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
            {scenes[current].desc}
          </div>
          <div style={{ fontSize: 10, color: '#aaa', marginTop: 1, fontFamily: 'monospace' }}>
            {scenes[current].tag}
          </div>
        </div>

        <button
          onClick={() => onChange((current + 1) % scenes.length)}
          style={navBtnStyle}
        >
          ›
        </button>
      </div>

      {/* 도트 인디케이터 — 텍스트 아래 별도 행 */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 6, height: 18, paddingBottom: 4,
      }}>
        {scenes.map((_, i) => (
          <div
            key={i}
            onClick={() => onChange(i)}
            style={{
              width: i === current ? 18 : 6, height: 6,
              borderRadius: 3,
              background: i === current ? '#111' : '#ccc',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

const navBtnStyle = {
  width: 48, flexShrink: 0, alignSelf: 'stretch',
  background: 'none', border: 'none',
  fontSize: 28, color: '#444', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

// ── 레이어 토글 UI ─────────────────────────────────────────────
function LayerControl({ layers, onToggle, onOpacity, onToggleAll }) {
  const allVisible = layers.every((l) => l.visible)
  return (
    <div style={{
      position: 'absolute', top: 160, right: 16,
      background: '#ffffff',
      border: '1px solid #111111',
      borderRadius: 6,
      padding: '14px 18px',
      minWidth: 240,
      zIndex: 10,
      fontFamily: "'Pretendard', sans-serif",
      maxHeight: 'calc(100vh - 200px)',
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', color: '#111', textTransform: 'uppercase' }}>
          레이어 Layer
        </div>
        <button
          onClick={() => onToggleAll(!allVisible)}
          style={{
            fontSize: 11, fontWeight: 500, color: '#111',
            background: 'none', border: '1px solid #bbb', borderRadius: 4,
            padding: '2px 8px', cursor: 'pointer',
          }}
        >
          {allVisible ? '전체 해제' : '전체 선택'}
        </button>
      </div>

      {layers.map((layer) => (
        <div key={layer.id} style={{ marginBottom: 12 }}>
          {/* 체크박스 + 이름 */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layer.visible}
              onChange={() => onToggle(layer.id)}
              style={{ accentColor: '#111', width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, fontWeight: 400, color: layer.visible ? '#111' : '#aaa' }}>
              {layer.name}
            </span>
          </label>

          {/* 투명도 슬라이더 */}
          {layer.visible && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, paddingLeft: 24 }}>
              <input
                type="range"
                min="0.05" max="1" step="0.05"
                value={layer.opacity}
                onChange={(e) => onOpacity(layer.id, parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: '#111', height: 3, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 10, color: '#888', width: 28, textAlign: 'right' }}>
                {Math.round(layer.opacity * 100)}%
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── CameraControls 컴포넌트 ────────────────────────────────────
function CameraRig() {
  const { camera, gl } = useThree()
  const ccRef = useRef(null)

  useEffect(() => {
    const cc = new CameraControls(camera, gl.domElement)

    // 기본 감도 설정
    cc.dollySpeed       = 0.5     // 줌 속도
    cc.truckSpeed       = 0.8     // 이동 속도
    cc.azimuthRotateSpeed = 0.4   // 좌우 회전
    cc.polarRotateSpeed   = 0.4   // 상하 회전
    cc.dollyToCursor    = true    // 마우스 커서 방향으로 줌
    cc.infinityDolly    = true    // 줌 한계 없음 — 내부까지 진입 가능

    cc.setPosition(30, 30, 30, false)
    cc.setTarget(0, 0, 0, false)

    camera.near = 0.01
    camera.far  = 100000
    camera.updateProjectionMatrix()

    ccRef.current = cc

    const handler = (e) => {
      const { radius } = e.detail
      const fovRad = (camera.fov * Math.PI) / 180
      const dist   = (radius / Math.sin(fovRad / 2)) * 0.8

      camera.near = 0.01
      camera.far  = radius * 200
      camera.updateProjectionMatrix()

      cc.setPosition(dist, dist, dist, true)
      cc.setTarget(0, 0, 0, true)
    }
    window.addEventListener('ifc-fit', handler)

    return () => {
      window.removeEventListener('ifc-fit', handler)
      cc.dispose()
    }
  }, [camera, gl])

  useFrame((_, delta) => ccRef.current?.update(delta))

  return null
}

// ── 메인 App ──────────────────────────────────────────────────
export default function App() {
  const [sceneIdx, setSceneIdx] = useState(0)
  const [layers, setLayers] = useState(SCENES[0].layers)
  const cameraRef = useRef(null)

  // 씬이 바뀔 때 레이어 초기화
  const handleSceneChange = (idx) => {
    setSceneIdx(idx)
    setLayers(SCENES[idx].layers)
    cameraRef.current = null  // 카메라 fit 초기화
  }

  const toggleLayer = (id) =>
    setLayers((prev) => prev.map((l) => l.id === id ? { ...l, visible: !l.visible } : l))

  const toggleAll = (visible) =>
    setLayers((prev) => prev.map((l) => ({ ...l, visible })))

  const changeOpacity = (id, opacity) =>
    setLayers((prev) => prev.map((l) => l.id === id ? { ...l, opacity } : l))

  // 첫 번째 모델 로드 시 카메라 거리 맞추기
  const fitCamera = (radius) => {
    if (cameraRef.current) return  // 이미 맞춰짐
    cameraRef.current = radius
    window.dispatchEvent(new CustomEvent('ifc-fit', { detail: { radius } }))
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#ffffff', fontFamily: "'Pretendard', sans-serif" }}>

      {/* 상단 헤더 바 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 56,
        background: '#ffffff',
        borderBottom: '1px solid #111111',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        zIndex: 20, pointerEvents: 'none',
      }}>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', color: '#111' }}>
          3D 건물 뷰어
        </span>
        <span style={{ marginLeft: 16, fontWeight: 300, fontSize: 12, color: '#555', letterSpacing: '0.02em' }}>
          드래그 회전 &nbsp;·&nbsp; 휠 줌 &nbsp;·&nbsp; 우클릭 이동
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#999' }}>
          {sceneIdx + 1} / {SCENES.length}
        </span>
      </div>

      {/* 슬라이드 내비게이터 */}
      <SceneNavigator scenes={SCENES} current={sceneIdx} onChange={handleSceneChange} />

      {/* 레이어 패널 */}
      <LayerControl layers={layers} onToggle={toggleLayer} onOpacity={changeOpacity} onToggleAll={toggleAll} />

      {/* 3D 캔버스 */}
      <div style={{ position: 'absolute', inset: 0, top: 128 }}>
        <Canvas key={sceneIdx}>
          <CameraRig />
          <ambientLight intensity={1.2} color="#ffffff" />
          <directionalLight position={[20, 40, 20]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-20, 10, -20]} intensity={0.4} color="#dddddd" />

          <Suspense fallback={null}>
            {layers.map((layer) =>
              layer.visible
                ? <IFCModel key={layer.id} url={layer.url} opacity={layer.opacity} onLoaded={fitCamera} />
                : null
            )}
          </Suspense>

          <gridHelper args={[200, 40, '#cccccc', '#eeeeee']} />
        </Canvas>
      </div>

      {/* 하단 상태 표시 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 32,
        borderTop: '1px solid #e0e0e0',
        background: '#ffffff',
        display: 'flex', alignItems: 'center', paddingLeft: 20,
        zIndex: 10, pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 11, fontWeight: 400, color: '#888', letterSpacing: '0.02em' }}>
          처음 로딩 시 수 초가 소요됩니다 · ‹ › 버튼으로 건물 전환
        </span>
      </div>
    </div>
  )
}
