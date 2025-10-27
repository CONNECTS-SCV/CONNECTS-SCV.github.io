---
layout: post
title: "PRODIGY : 단백질 복합체 사이의 결합 친화도를 예측"
description: "단백질-단백질 복합체의 3D 구조로부터 접촉 수(ICs) 및 비상호작용 표면(NIS) 특성을 활용하여 결합 친화도를 예측하는 구조 기반 회귀 모델입니다."
categories: [분석 모델]
tags: [PRODIGY, 결합 친화도, 단백질-단백질 상호작용, PPI, 회귀 모델]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
comment_id: "prodigy_main"
paired_post: "prodigy_en"
---
## 개요
---
PRODIGY는 단백질-단백질 복합체의 3D 구조(PDB/mmCIF)를 입력하면 결합 친화도(ΔG, kcal/mol) 와 Kd를 예측하는 구조 기반 도구입니다. 딥러닝이 아니라 접촉 수(Interfacial Contacts, ICs) 및 비상호작용 표면(NIS) 특성을 활용한 선형 회귀 모델을 활용하고 있습니다.

## 작동 원리
---
- 먼저 단백질 복합체 구조가 입력되면 상호작용 인터페이스를 추출합니다. 이때 정해진 거리 이내 (예 : 5.5옹스트롬)의 상호작용을 접촉으로 정의하고, polar, non-polar, charged 접촉을 각각 집계합니다.
- 인터페이스 외곽에 존재하는 비 상호작용 표면에서도 apolar 영역의 비율과, charged 영역의 비율 등을 산출하여 최종적인 binding affinity 계산에 반영합니다. 예를 들어서 주변 표면에 소수성 잔기들이 많다면 결합을 안정화하는 쪽으로 기여할 수 있습니다.
- 위 특징들과 SKEMPI 데이터베이스 (단백질 결합 친화도 벤치마크)를 기반으로 선형 회귀 학습을 진행합니다.
- 추출된 다음 특징들은 ΔG를 예측하는데 활용됩니다.
  - 인터페이스에 존재하는 아미노산 종류
  - 접촉하는 잔기의 수
  - 소수성/극성 상호작용 패턴, 수소 결합 갯수
  - 표면적 (ASA)

## 입력・출력・설정 옵션
---

**입력** :
- 단백질 복합체 구조 (PDB/mmCIF 포맷)

**출력** :
- ΔG (kcal/mol), Kd (상온 기준)
- 복합체의 상호작용 계면 구조 + 상호작용 잔기의 리스트/성격
- 상호작용 종류별 통계, 복합체 pair의 binding affinity (Kd value)

  ![PRODIGY 상호작용 통계 결과](/image/info/prodigy1.webp){left:400}


**설정 옵션** :
- Distance Cutoff (Å) : 접촉했다고 판단할 최대 거리 (보통 5 Å)
- Acc Threshold (Å²) : ASA 변화량의 최소 기준치 (보통 0.5 Å² )
- Temperature (°C) : ΔG ↔ Kd 변환에 사용하는 온도 값 (보통 상온)
- Selection Chains : 내가 상호작용을 보고 싶은 chain만 선택할 수 있는 옵션
  - 예를 들어서 항체의 heavy chain, light chain, antigen의 복합체라면 heavy chain과 light chain 사이의 interaction은 굳이 보지 않아도 됩니다.

## 용도・차별 포인트
---

**용도** :
- 두 종류의 단백질에 대하여 PPI 결합 친화도를 빠르게 예측할 수 있습니다.
- 돌연변이가 있을 경우에는 돌연변이에 따른 계면 변화, 자유에너지의 변화를 빠르게 예측할 수 있습니다.

**차별 포인트** :
- MD simulation이나 기존 물리모델 기반 계산에 비하여 빠른 속도로 계산/예측을 수행할 수 있습니다.

## 비교해 볼만한 모델
---
- 보다 정밀한 예측을 위해서는 DeepRank2와 같은 CNN/GNN 기반 딥러닝 모델을 사용할 수 있습니다.

## 연계해 볼 만한 모델
---

- HADDOCK은 Prodigy의 input으로 사용되는 단백질-단백질 복합구조를 만들어주는 모델입니다. 다양한 복합체 앙상블을 Prodigy로 일괄분석하면 에너지 준위의 순위를 매길 수 있습니다.

---

[tool-button:PRODIGY]