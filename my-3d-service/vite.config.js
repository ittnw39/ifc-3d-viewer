import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// web-ifc-three는 mergeGeometries를 사용하지만 three@0.149에는 없음 → resolveId로 shim 주입
const patchWebIfcThree = {
  name: 'patch-buffer-geometry-utils',
  resolveId(source, importer) {
    if (
      source.includes('BufferGeometryUtils') &&
      importer?.includes('web-ifc-three')
    ) {
      return path.resolve(__dirname, 'src/BufferGeometryUtils-shim.js')
    }
  },
}

export default defineConfig({
  plugins: [react(), patchWebIfcThree],
})
