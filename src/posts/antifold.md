---
layout: post
title: "Antifold : 항체 서열 설계 및 최적화 모듈"
description: "항체 구조로부터 최적화된 서열을 예측하는 AI 모델"
categories: [analysis]
tags: [Antifold, 항체, inverse-folding, ESM-IF1, 서열최적화]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---

## 개요
---

Antifold는 Meta에서 개발한 inverse folding model **ESM-IF1**을 기반으로 [SabDab](https://opig.stats.ox.ac.uk/webapps/sabdab-sabpred/sabdab)과 [OAS](https://opig.stats.ox.ac.uk/webapps/oas/)로부터 약 150,000개의 항체 구조를 활용하여 파인튜닝한 항체 특이적 inverse folding 모델입니다.

## 작동 원리
---

먼저 항체의 Ca (알파카본) 원자 좌표를 기준으로 backbone dihedral angles (φ, ψ)를 이용하여 local한 위치정보를 학습합니다. 이후 모든 residue pair에 대한 geometry를 임베딩으로 만들어서 residue의 정보를 담고 있는 토큰과 함께 transformer에 집어넣고 학습시키게 되면, transformer는 이를 기반으로 auto-regressive하게 각 아미노산 잔기를 N term에서 C term 방향으로 하나씩 샘플링하게 됩니다.

## 입력・출력・설정 옵션
---

**입력** : 항체 구조 (PDB 포맷) or 항원/항체 복합체 구조 (PDB 포맷)
- 항원 구조를 같이 넣어줄 경우에는 해당 항원에 결합하는 항체 서열로 Refine할 수 있습니다.
- 가능하면 항원과의 결합 구조를 함께 넣어서 예측해 보시는 걸 추천드립니다.

**출력** : Refinement가 이루어진 항체의 서열과 해당 서열의 신뢰도

**설정 옵션** :
- **Antibody or Nanobody** : 설계하고자 하는 형태에 맞춰 구조를 입력할 수 있습니다.
- **생성되는 서열의 다양성 [0-1]** : 수치를 낮추게 되면 확률이 가장 높은 서열을 보수적으로 출력하지만 수치를 높이게 되면 좀 더 다양한 서열을 출력하여 라이브러리의 다양성을 높일 수 있습니다.
- **CDR 영역 선택** : CDR1, CDR2, CDR3 중에서 원하는 영역만 선별하여 설계할 수 있습니다.
- **ESM-IF1 평가 모드** : 범용 inverse-folding 모델인 ESM-IF1으로 예측 성능을 평가할 수 있습니다.

## 용도・차별 포인트
---

**용도** :
- 항체 최적화 과정에서 결합이 유지되는 다양한 variant를 빠르게 스크리닝할 수 있습니다. (예를 들어서 기존 특허의 epitope을 벗어나는 variant가 있을 경우에는 특허 회피 전략으로도 사용할 수 있겠죠.)

**차별 포인트** :
- CDR-H3와 같이 변동성이 큰 영역에 대하여 다양한 variant sequence pool을 확보할 수 있습니다.
- 언어 모델을 기반으로 하기 때문에 MPNN에 비하여 상대적으로 정밀도와 안정성이 높습니다.

## 비교해 볼만한 모델
---

GNN (MPNN) 기반의 equivalent 모델인 AntiBMPNN과 성능을 비교해볼 수 있습니다.

## 연계해 볼 만한 모델
---

- 항체의 구조를 예측하는 Immunebuilder3로 항체 구조를 얻은 후 Haddock으로 항원과의 복합체 구조를 얻어, Antifold를 통해 항체 서열을 최적화하는 워크플로우를 진행해볼 수 있습니다.
- 서열이 최적화되면 GROMACS를 이용하여 PMF를 측정하는 방식으로 affinity를 측정해볼 수 있고, 항체의 안정성을 보는 DDG 모델을 이용하여 결합 구조의 안정성 변화를 확인해볼 수도 있습니다.

---

[tool-button:Antifold]