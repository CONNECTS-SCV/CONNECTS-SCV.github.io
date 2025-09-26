---
layout: post
title: "AbDev : 항체 개발 가능성 예측"
description: "항체의 물리적 특성을 기반으로 개발 가능성을 예측하는 AI 모델"
categories: [analysis]
tags: [AbDev, 항체, 개발가능성, 물리화학적 특성, DeepSP]
author: "author1"
date: "2025-01-02"
thumbnail: "/image/default.webp"
---

## 개요

Abdev (Antibody developability)는 항체의 주요한 물리적 특성을 기반으로 항체의 개발 가능성 (developability)을 예측하는 모델입니다.

## 작동 원리

먼저 DeepSP라는 알고리즘을 이용하여 항체 서열로부터 다음 세 가지 특징을 얻고, 아래 특징들을 기반으로 Conv1D 회귀 모델을 이용하여 최종적인 항체의 개발 가능성을 예측하게 됩니다.

::callout
- **SAP** (Spatial Aggregation Propensity) **:** Val, Ile, Leu, Phe, Trp, Tyr, Met과 같은 소수성 아미노산에 영향을 받는 수치로, 항체의 aggregation risk를 증가시킵니다.
- **SCM(Surface Charge Map)_pos** : Lys, Arg, His와 같은 양전하 아미노산에 영향을 받는 수치로,
  항체의 비특이적인 결합을 유도하고 aggregation이나 viscosity를 높이는 **안 좋은 지표**입니다.
- **SCM(Surface Charge Map)_neg** : Asp, Glu와 같은 음전하 아미노산에 영향을 받는 수치로,
  비특이적인 결합이나, 점도 등의 위험성을 오히려 완화해주는 **좋은 지표**입니다.
::/callout

## 입력・출력・설정 옵션

- **입력** : PDB 구조 또는 항체 서열 (FASTA 포맷), 여러 개 동시에 분석할 수 있음.
- **출력** : 항체 개발 가능성과 연관된 특성 지표 (Aggregation, Viscosity, Specificity, Stability) 수치
- 따로 설정이 필요한 옵션은 없으나, ANARCI와 DeepSP를 통해 항체의 서열에 따른 특성 지표를 얻는 과정이 먼저 수행되어야 합니다.

## 용도・차별 포인트

- 후보 항체의 물리적인 특성을 서열 기반으로 예측할 수 있습니다.
- 특히 직접적으로 실험하기 어려운 특성들도 빠르게 예측할 수 있어 스크리닝에 많은 도움이 됩니다.
- TANGO와 같은 기존 모델에 비하여 범용성은 떨어지지만 계산 환경만 충분하다면 개발 가능성 관련 통합 지표를 한 번에 제공한다는 측면에서 큰 장점이 있습니다.

## 비교해 볼만한 모델

OPIG에서 제공하는 TAP(Therapeutic Antibody Profiler)의 지표와 abdev의 지표들을 비교해볼만 합니다.

※ 다만 TAP는 학술 목적으로만 무료로 제공되고, 상업적으로 이용하기 위해서는 비용을 내야 합니다.

## 연계해 볼 만한 모델

- Antifold나 RFantibody를 이용한 Affinity maturation 과정에서 항체의 개발 가능성은 손상되지 않고 유지하기 위한 목적으로 연계하여 활용할 수 있습니다.
- 또는 개발가능성이 낮은 항체를 최적화하는 과정을 거친 후 최적화 전/후의 개발 가능성을 비교하여 평가하는 방향으로도 활용할 수 있고, 항체의 Tm이나 PSR을 확인하는 실제 wet 시험과 연계하여 결과를 검증해볼 수도 있습니다.

---

[tool-button:AbDev]