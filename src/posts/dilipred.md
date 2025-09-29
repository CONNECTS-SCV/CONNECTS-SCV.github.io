---
layout: post
title: "DILI : 약물 유발 간손상 (Drug-Induced Liver Injury) 조기 탐지를 위한 예측 도구"
description: "신약 개발 초기 단계에서 화합물의 간 독성 리스크를 평가하는 이진 분류 예측 모델"
categories: [분석 모델]
tags: [DILI, Drug-Induced Liver Injury, 간독성, 예측모델, 신약개발]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---

## 개요
DILI (Drug-Induced Liver Injury) Pred는 약물에 의해 유도되는 간 손상을 미리 예측하는 모델입니다. 신약 개발 초기 단계에서 화합물의 간 독성 리스크를 평가하고 후보 물질을 필터링할 때 활용합니다.

## 작동 원리
그래프로 변환된 화합물 (SMILES)의 구조와 함께 아래와 같은 다양한 feature를 통합 feature vector에 임베딩하여 supervised binary classification으로 학습합니다.

- 물리화학적 특성
- 분자 지문 (fingerprint)
- in vitro/in vivo DILI 지표 (9종)
- PK 지표

학습된 모델을 이용하여 새롭게 입력된 화합물에 대해 독성/비독성의 이진 분류 예측을 수행할 수 있습니다.

## 입력・출력・설정 옵션

**입력** : 
- 화합물 구조 (SMILES 포맷)

**출력** : 다양한 독성 기전에 대한 독성 예측 지표 제공하고 이를 기반으로 최종 독성 예측
- Source/Assay type/description: 어떤 DB/기전을 근거로 하는 독성 지표인지에 대한 정보 제공
  - (예제 : Mitotox, Human hepatox, Preclinical Hepatox 등)
- Value : 해당 assay에서 독성일 확률 (높을수록 독성에 기여)
- Pred : Value 값이 독성의 threshold 이상인지 판단 (True로 분류되면 독성, False일 경우 독성 없음)
- SHAP : 각 feature가 독성 판정에 얼마나 기여했는지 가중치 정보 제공

**설정 옵션** : 따로 없음

## 용도・차별 포인트

**용도** :
- 신약개발 과정에서 후보물질의 간독성 여부를 사전에 스크리닝 해볼 수 있습니다.
- 화합물의 구조를 기반으로 독성의 원인을 파악하고 이해하는데 사용할 수도 있습니다.

**차별 포인트** :
- 특히 단순히 결과만 예측해주는 것이 아니라 해석이 가능하도록 다양한 assay와 상응하는 예측 지표를 제공하여 사용자의 이해도를 높여줄 수 있습니다.

## 비교해 볼만한 모델
- 간독성 이외에도 심장 (hERGAI), 혈액독성 (HemoPI2)등을 예측하는 모델들을 사용해볼 수 있습니다.
- ADMET-AI와 같이 화합물의 종합적인 분석을 해주는 도구와 분석결과를 비교해볼 수 있습니다.

## 연계해 볼 만한 모델
- REINVENT4를 통해서 간 독성의 risk를 줄이는 방향으로 모델의 modification을 진행한 후 최적화 결과를 DILIPred를 통해서 비교해볼 수 있습니다.

---

[tool-button:DILIPred]