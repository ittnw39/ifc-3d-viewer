# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code(claude.ai/code)에 지침을 제공합니다.

## 저장소 목적

이 저장소는 **buildingSMART 샘플 및 테스트 파일** 데이터 저장소입니다. IFC 가져오기 기능에 대한 글로벌 소프트웨어 인증에 사용되는 IFC(Industry Foundation Classes) 모델 파일을 포함합니다. 소스 코드, 빌드 시스템, 실행 가능한 테스트는 없으며 `.ifc` 파일 자체가 테스트 아티팩트입니다.

이전 콘텐츠는 [buildingSMART 커뮤니티 조직](https://github.com/buildingsmart-community/Community-Sample-Test-Files)으로 이전되었습니다.

## 저장소 구조

- **`IFC 4.0.2.1 (IFC 4)/`** — IFC 버전 4.0.2.1 테스트 파일
  - `ISO Spec - ReferenceView_V1.2/` — ISO 참조 뷰 테셀레이션 예시
  - `PCERT-Sample-Scene/` — PCERT 분야별 모델 (건축, HVAC, 조경, 구조 등)
- **`IFC 4.3.2.0 (IFC4X3_ADD2)/`** — IFC 버전 4.3.2.0 테스트 파일 (도로 분야 추가)
  - `PCERT-Sample-Scene/` — 도로 표면/노면 표시 포함 PCERT 분야별 모델

## IFC 파일 규약

IFC 파일은 STEP Physical File 형식(`.ifc`)을 따릅니다. 테스트 모델에서 사용되는 주요 엔티티 유형:

- 공간 계층: `IfcProject > IfcSite > IfcBuilding > IfcBuildingStorey`
- 속성: `IfcPropertySet`, `IfcQuantitySet`, `IfcClassificationReference`
- 관계: `IfcGroup`, `IfcSystem`, `IfcRelAggregates`, `IfcRelAssociatesMaterial`
- 기하: `IfcSpace`, `IfcRelAggregates`를 통한 조립체

## 인증 테스트 기준

`import-certification.md`는 buildingSMART 인증을 위해 IFC 가져오기 소프트웨어가 충족해야 하는 14가지 최소 기준을 문서화합니다. 테스트 파일을 추가하거나 수정할 때 다음 항목이 검증되도록 해야 합니다:

1. 시각적 기하 정확성
2. 지리적 위치 및 CRS(좌표 참조 시스템)
3. 공간 계층 구조 (Project > Site > Building > Storey)
4. 재료 및 색상 할당
5. 객체 유형/발생 속성 및 GUID
6. 수량(`IfcQuantity`) 및 분류 참조(`IfcClassificationReference`)
7. 조립체, 그룹(`IfcGroup`), 시스템(`IfcSystem`)
8. 공간(`IfcSpace`)
9. 도로 표면/노면 표시 관계 *(IFC 4.3 전용)*

## Git LFS

대용량 바이너리 파일 유형은 `.gitattributes`에서 Git LFS로 관리됩니다: `*.ply`, `*.zip`, `*.pla`, `*.las`, `*.ttl`, `*.sp`, `*.pp`, `*.dwg`, `*.tiff`, `*.tif`, `*.rar`. 이러한 파일을 클론하거나 추가하기 전에 Git LFS가 설치되어 있는지 확인하세요.

## 라이선스

CC-BY 4.0 — buildingSMART International Ltd.
