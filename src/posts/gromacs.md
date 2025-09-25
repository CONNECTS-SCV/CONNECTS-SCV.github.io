---
title: "GROMACS: 분자동역학 시뮬레이션 도구 정복하기"
author: author1
date: 2024-12-20
categories: [analysis, structure, simulation]
tags: [GROMACS, MD시뮬레이션, 분자동역학, 포스필드, 시뮬레이션파이프라인, GPU가속, RMSD, 자유에너지]
description: "GROMACS는 생체분자와 재료계 모두에 적용 가능한 고성능 오픈소스 분자동역학(MD) 시뮬레이션 도구입니다."
slug: gromacs-molecular-dynamics-simulation
---

## 목적

분자동역학(MD) 시뮬레이션으로 생체분자 및 재료 시스템의 시간적 변화 분석

## 작동 원리

- 포스필드로 원자 간 상호작용 정의
- 뉴턴 방정식 수치 적분으로 원자 움직임 계산
- CPU/GPU 병렬화로 대형 시스템 고속 처리

## 시뮬레이션 단계

1. 에너지 최소화 (EM)
2. NVT 등온 등적 조건
3. NPT 등온 등압 조건
4. 생산 런 (Production MD)

## 용도

- **리간드 안정성 평가**: RMSD/RMSF, 접촉 수, H-bond 지속 시간
- **돌연변이 영향 분석**: WT vs Mutant 구조 변화 비교
- **막단백질-지질 상호작용**: 삽입 깊이, 침투성 평가
- **자유에너지/친화도 계산**: MM/PBSA, FEP/PMF 활용
- **재료 물성 시뮬레이션**: 확산, 계면 거동, 기계적 특성

## 차별 포인트

- 속도와 효율: 짧은 타임스텝 반복을 빠르게 수행
- 다양한 포스필드 지원: AMBER, CHARMM, OPLS-AA 등
- 강력한 분석 기능: gmx rms, sasa, hbond, cluster 등 내장

## 비교해 볼 만한 도구

- **NAMD**: 초대형 시스템, 슈퍼컴 최적화
- **AMBER**: 포스필드 다양성, 생물학계 특화
- **CHARMM**: 샘플링 기법/분석 도구 다양
- **OpenMM**: Python 기반, GPU 강점
- **LAMMPS**: 재료계, 커스텀 상호작용 최적

## 연계해 볼 만한 모델

- **DiffDock/AutoDock → MD**: 도킹 포즈 안정성 검증
- **PLIP/Arpeggio**: MD 후 상호작용 프로파일링
- **PRODIGY/MM-PBSA**: 친화도 정량 분석
- **MDAnalysis/PyEMMA**: 대규모 데이터 자동 분석
- **VMD/PyMOL**: 시각화 최적화

## 사용 방법

### 입력
* 구조 파일 (.pdb, .gro)
* 포스필드/물 모델 선택
* 시뮬레이션 파라미터 (.mdp)

### 주요 계산 파라미터
* **장거리 전기력**: PME (Particle Mesh Ewald)
* **제약 알고리즘**: LINCS (H-결합 고정시 dt = 2 fs 가능)
* **온도/압력 조절**: V-rescale, Nosé-Hoover / Parrinello-Rahman
* **컷오프**: rcoulomb = 1.0, rvdw = 1.0

### 품질 체크리스트
* EM 수렴: Fmax < 1000 kJ/mol/nm
* NVT: 온도 안정화 확인
* NPT: 밀도 ~1.0 g/cm³ 도달
* Production: RMSD plateau 확인

### 분석 명령 예시
```bash
gmx rms -s md.tpr -f md.xtc -o rmsd.xvg
gmx rmsf -s md.tpr -f md.xtc -o rmsf.xvg -res
gmx hbond -s md.tpr -f md.xtc -num hbond_count.xvg
gmx sasa -s md.tpr -f md.xtc -o sasa.xvg
```

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/gromacs?from=blog', '_blank'); return false;">GROMACS 사용하러 가기</a>