---
layout: post
title: "GROMACS : 생체분자 시스템을 위한 분자 동역학 시뮬레이션"
description: "단백질, 지질, 핵산 등의 생체분자를 원자 단위로 시뮬레이션하는 분자 동역학 오픈소스 소프트웨어입니다."
categories: [분석 모델]
tags: [MD, Molecular Dynamics, GROMACS, Simulation]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
---

## 개요
---
**GROMACS (GROningen MAchine for Chemical Simulations)** 는 분자 동역학(Molecular Dynamics, MD) 시뮬레이션을 수행하기 위한 오픈소스 소프트웨어입니다. 단백질, 지질, 핵산 등의 생체분자를 원자 단위로 시뮬레이션할 수 있으며, 에너지 최소화, 평형화, 자유에너지 계산 등 다양한 생물물리적 분석에 활용됩니다.

## 작동 원리
---
GROMACS는 분자동역학(MD) 시뮬레이션의 기본 원리인 뉴턴의 운동 방정식을 바탕으로, 시스템 내 모든 원자에 작용하는 힘을 계산하고 시간에 따라 그 움직임을 적분하여 추적합니다.

**힘장(Force Field)**
- AMBER, CHARMM, OPLS-AA, GROMOS 등의 파라미터 세트를 이용하여 원자 간 결합, 각도, 비결합 상호작용을 계산합니다.

**적분 및 병렬화**
- **Leap-Frog** 또는 **Velocity-Verlet** 알고리즘으로 시간 적분을 수행합니다.
- MPI + OpenMP + GPU 병렬화를 지원하여 대규모 시스템에서도 높은 성능을 발휘합니다.

**전기적 상호작용 계산**
- 장거리 쿨롱 상호작용은 **Particle Mesh Ewald (PME)** 알고리즘으로 빠르고 정확하게 계산합니다.

**온도·압력 제어**
- **V-rescale** 또는 **Nosé–Hoover thermostat**, **Parrinello–Rahman barostat**을 사용하여 시스템의 온도 및 압력을 일정하게 유지합니다.


## 입력・출력・설정 옵션
---
**입력**: 
- 분자 구조 파일 (PDB 또는 GRO 형식)
- Topology 파일 (.top, .itp)
- 시뮬레이션 설정 파일 (.mdp)
- 인덱스 파일 (.ndx)

**출력**: 
- 시뮬레이션 궤적 (XTC 또는 TRR)
- 에너지 파일 (EDR)
- 로그 파일 (LOG)
- 체크포인트 파일 (CPT)

**설정 옵션**:
- 시뮬레이션 시간(step), 온도 및 압력 커플링 방식, 절단거리(cutoff), 전하 처리 방식(PME 등)
- .mdp 파일 내에서 세부 파라미터를 지정하여 실험 조건을 조절할 수 있습니다.


## 용도・차별 포인트
---
**용도**:
- 단백질 안정성 분석 (RMSD, RMSF, Radius of gyration, Hydrogen bond 등)
- 자유에너지 계산 (Umbrella sampling, Steered MD 등)
- 리간드 결합 안정성 및 확산 연구
- 나노 소재 및 막 단백질 상호작용 분석, 돌연변이 분석

**차별 포인트**:
- 병렬화 및 GPU 가속 최적화로 **가장 빠른 MD 엔진 중 하나**입니다.
- 풍부한 내장 분석 도구(gmx rms, gyrate, sasa 등)를 통해 별도의 후처리 소프트웨어 없이 대부분의 계산이 가능합니다.
- 상용 라이선스 비용 없이 연구, 교육, 산업 모두에 활용할 수 있습니다.


## 비교해 볼만한 모델
---
- **NAMD**: 대규모 클러스터 환경에서의 성능이 우수하며, Charm++ 기반의 병렬화 구조를 가집니다.
- **AMBER**: 생체분자 전용 포스필드와 분석 도구가 강점이며, 정확도가 높습니다.
- **OpenMM**: Python 기반 인터페이스를 제공하며, GPU 활용에 매우 최적화되어 있습니다.
- **LAMMPS**: 다양한 재료 및 물리 시스템을 시뮬레이션할 수 있어 범용성이 높습니다.


## 연계해 볼 만한 모델
---
- **PLUMED**: 메타다이내믹스나 자유에너지 계산에 자주 사용되는 확장 모듈로, GROMACS와 쉽게 연동됩니다.
- **MDAnalysis** / **MDTraj**: 시뮬레이션 결과 파일(XTC, TRR 등)을 Python 환경에서 분석하기 위한 라이브러리입니다.
- **PyMOL**, **VMD**: GROMACS에서 생성된 구조 및 궤적을 시각화하기 위한 대표적인 도구입니다.
- **DeepSP** / **RFdiffusion과의 연계**: 서열 기반 구조 예측 결과를 GROMACS로 시뮬레이션하여 안정성, 집합 경향성, 동역학을 분석할 수 있습니다.

---

[tool-button:GROMACS]
