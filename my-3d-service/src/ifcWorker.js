// Custom IFC Web Worker — web-ifc WASM 직접 사용
// web-ifc-three의 깨진 Worker 대신 web-ifc를 직접 파싱
import { IfcAPI } from 'web-ifc'

const api = new IfcAPI()

// Worker 컨텍스트에서 locateFile로 WASM 경로를 절대 URL로 강제 지정
const wasmAbsoluteUrl = new URL('/web-ifc.wasm', self.location.origin).href
const initPromise = api.Init((path) => {
  if (path.endsWith('.wasm')) return wasmAbsoluteUrl
  return path
})

self.onmessage = async ({ data }) => {
  const { id, url } = data
  await initPromise

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
    const buffer = await res.arrayBuffer()

    const modelID = api.OpenModel(new Uint8Array(buffer))

    const meshGroups = []

    api.StreamAllMeshes(modelID, (flatMesh) => {
      const size = flatMesh.geometries.size()
      for (let i = 0; i < size; i++) {
        const placed = flatMesh.geometries.get(i)
        const geom = api.GetGeometry(modelID, placed.geometryExpressID)

        const vData = api.GetVertexArray(geom.GetVertexData(), geom.GetVertexDataSize())
        const iData = api.GetIndexArray(geom.GetIndexData(), geom.GetIndexDataSize())

        // 빈 지오메트리 건너뜀
        if (!vData || !iData || iData.length === 0 || vData.length === 0) {
          geom.delete()
          continue
        }

        // 복사본 만들어서 전송 (WASM 힙은 재사용되므로 반드시 복사)
        const vertices = new Float32Array(vData).buffer
        const indices = new Uint32Array(iData).buffer
        const transform = Array.from(placed.flatTransformation)
        const color = {
          r: placed.color.x,
          g: placed.color.y,
          b: placed.color.z,
          a: placed.color.w,
        }

        meshGroups.push({ color, transform, vertices, indices })
        geom.delete()
      }
    })

    api.CloseModel(modelID)

    // ArrayBuffer는 transfer로 zero-copy 전송
    const transfers = meshGroups.flatMap((m) => [m.vertices, m.indices])
    self.postMessage({ id, ok: true, meshGroups }, transfers)
  } catch (err) {
    self.postMessage({ id, ok: false, error: err.message })
  }
}
