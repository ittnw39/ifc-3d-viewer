// web-ifc-three가 mergeGeometries를 사용하지만 three@0.149에는 없음 → shim으로 주입
export * from 'three/examples/jsm/utils/BufferGeometryUtils.js'
export { mergeBufferGeometries as mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
