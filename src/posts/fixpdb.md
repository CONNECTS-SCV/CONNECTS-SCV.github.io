---
layout: post
title: "FixPDB : PDB 파일 구조 자동 보정 도구"
description: "PDB 파일의 누락된 원자, 비정상적 구조 등을 감지하고 자동으로 교정하여 분자동역학 시뮬레이션 전처리를 돕는 도구"
categories: [분석 모델]
tags: [PDB repair, structure correction, GROMACS, molecular dynamics]
author: "author1"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---

## 개요
FixPDB는 PDB 파일의 구조를 자동으로 보정(Structure Repair) 해주는 도구다. PDB 파일에 누락된 부분을 살펴보고 자동으로 채워줄 수 있어서 GROMACS 등의 분석 도구에 사용하기 위한 입력 파일에 생길 수 있는 오류를 해결해줍니다.

## 작동 범위
::callout
**구조 검사 단계**
  - PDB 좌표를 스캔하여 누락된 원자, 비정상적인 거리·각도, steric clash등을 탐지합니다.
  - rule-based 알고리즘과 기하학적 제약조건 (표준 결합 길이, 각도, Van der Waals 반발 기준)을 기준으로 오류를 탐색합니다.
    
**자동 교정 단계**
  - Rotamer 라이브러리를 기반으로 side chain orientation 을 최적화합니다.
  - Protonation rule (pKa 추정, 전하 상태 고려)에 따라서 수소 원자를 재배치합니다.
  - 잘못된 좌표들에 대해서는 로컬로 재보정을 실시합니다.

**에너지 최소화 단계**
  - CHARMM이나 Amber 계열의 단순화된 force field를 사용하여 local energy minimization을 수행합니다.
  - 이 과정에서 물리적으로 합리적인 최소 에너지 상태로 분자가 수렵됩니다.
::/callout

## 입력・출력・설정 옵션

**입력** : 단백질 구조 (PDB 포맷)

**출력** : 정리된 단백질 구조 PDB 파일

**설정 옵션** : 따로 없음

## 용도・차별 포인트

**용도** : GROMACS 등 단백질의 에너지를 계산하는 분자동역학 시뮬레이션을 돌리기 위해서는 입력으로 들어가는 분자의 각 원자가 명확하게 정의되고 오류가 없어야 합니다.

**차별 포인트** : FixPDB를 활용하면 이러한 전처리, 후처리 과정을 빠르게 진행할 수 있습니다.

## 비교해 볼만한 모델
- OpenMM에서 제공하는 PDBfixer를 사용하면 특정 원자나 수소를 추가하거나 clash를 해결하는 기능들을 활용할 수 있습니다.
- Rosetta Relax는 Rosetta forcefield를 기반으로 구조의 심층 최적화가 가능하지만 계산량이 크다보니 속도에는 한계가 있습니다.

## 연계해 볼 만한 모델
- **FixPDB → FoldX** : 안정화된 구조를 기반으로 돌연변이 도입 후 ΔΔG를 계산할 수 있습니다.
- **FixPDB → GROMACS** : 보정된 구조를 이용하여 MD 안정화 및 시뮬레이션을 수행할 수 있습니다.
- **FixPDB → PLIP** : 단백질–리간드 상호작용 분석을 위한 clash-free 구조를 제공합니다.
- **FixPDB → Boltz-2** : 복합체 예측 후 구조 정제 및 에너지 분석 준비에 활용할 수 있습니다.

---

[tool-button:FixPDB]