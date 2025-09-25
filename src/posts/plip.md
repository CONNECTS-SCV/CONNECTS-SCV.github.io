---
title: "PLIP: 단백질-리간드 상호작용 분석 도구"
author: author1
date: 2024-12-20
categories: [analysis, structure, interaction]
tags: [PLIP, 단백질-리간드상호작용, 상호작용분석, docking후처리, 결합메커니즘, 구조기반분석]
description: "PLIP는 단백질-리간드 복합체에서 수소 결합, 소수성 상호작용, π-π stacking 등 다양한 결합 유형을 자동으로 탐지하고 시각화해주는 도구입니다."
slug: plip-protein-ligand-interaction-profiler
---

## 목적

단백질-리간드 복합체 구조로부터 구체적인 상호작용 정보를 자동으로 추출 및 분석

## 작동 원리

- 복합체 구조에서 다양한 상호작용 자동 탐지
- 수소 결합, 소수성, π-π, salt bridge, 금속 결합 등 분류
- 결합 pocket 내 상호작용을 체계적으로 분석 및 시각화

## 용도

- **후보물질 binding 메커니즘 검증**
- **결합 pocket 내 주요 잔기 확인 및 변이 설계**
- **동일 pocket 내 리간드별 상호작용 비교**
- **Docking 구조 신뢰도 평가 및 figure 제작**
- **MD 시뮬레이션 중 시점별 상호작용 변화 분석**

## 차별 포인트

- 복잡한 파라미터 설정 없이 자동 분석
- 다양한 상호작용 유형 동시 탐지
- 결합 pocket 시각화 이미지 제공
- Batch 처리 지원으로 대규모 분석 가능

## 비교해 볼 만한 모델

- **Arpeggio**: 상호작용 분석 도구
- **ProLIF**: MD trajectory 상호작용 분석
- **BINANA**: 결합 특성 분석

## 연계해 볼 만한 모델

- **Chai/DiffDock**: Docking 후 상호작용 분석
- **GROMACS**: MD 시뮬레이션 후 시점별 분석
- **PRODIGY**: 친화도 평가와 결합

## 사용 방법

### 입력
* **단백질-리간드 복합체 구조** (PDB 형식)

### 출력
* 상호작용 리스트 (결합 종류, 위치, 거리, 각도)
* 결합 pocket 확대 시각화 이미지

### 설정 옵션
* 별도 설정 없음 (자동 분석)

### 지원 상호작용
* H-bond (수소 결합)
* Hydrophobic (소수성)
* π-π stacking
* Salt bridge
* Metal coordination

### 주의사항
* 안정된 결합 구조 필요 (Docking/MD 이후)
* 복합체 구조 입력 필수

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/plip?from=blog', '_blank'); return false;">PLIP 사용하러 가기</a>