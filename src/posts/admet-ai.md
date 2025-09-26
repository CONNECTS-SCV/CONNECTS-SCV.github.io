---
layout: post
title: "ADMET-AI : 저분자 화합물 ADMET 예측"
description: "저분자 화합물의 구조를 기반으로 ADMET를 예측하는 AI 모델"
categories: [analysis]
tags: [ADMET-AI, 저분자, 화합물, ADMET, 독성예측, ChEMBL, PubChem, DrugBank]
author: "author1"
date: "2025-01-03"
thumbnail: "/image/default.webp"
---

## 개요

ADMET-AI는 저분자 화합물의 구조를 기반으로 물질의 ADMET (Absorption, Distribution, Metabolism, Excretion, Toxicity)를 예측하는 인공지능 모델입니다.

## 작동 원리

ChEMBL, PubChem, DrugBank 등에서 수집한 100만 개 이상의 화합물 구조를 그래프 임베딩하고, 용해도, 단백질 결합, CYP 대사, hERG 독성, LD50 등 다양한 특성과 함께 GNN·MPNN 기반 지도학습으로 통합학습한 인공지능 모델입니다.

사용자가 새로운 화합물 구조를 입력하면 입력된 화합물의 다양한 특성을 빠르게 한번에 예측합니다.

## 입력・출력・설정 옵션

**입력** : 화합물 (SMILES 포맷)

**출력** : 화합물의 기본 특성, ADMET 관련 특성 예측 값, 시각화 그래프 (예정)

**설정 옵션** : 따로 설정이 필요한 옵션은 없음.

## 용도・차별 포인트

**용도** : 약물 스크리닝 과정에서  ADMET에 대한 초기 스크리닝 용도로 활용할 수 있습니다.

**차별 포인트** : 특히 독성이나 대사 안정성을 예측하는 영역에서 성능이 특화되어 있습니다.

## 비교해 볼만한 모델

- 해당 용도로 사용할 수 있는 모듈 중에서는 ADMET-AI가 SOTA입니다.
- 다만 대규모의 결과를 효율적으로 시각화할 수 있는 방법을 찾는 것이 중요한 숙제입니다.

## 연계해 볼 만한 모델

- DILI, hERGAI 등 화합물의 개별 독성을 예측할 수 있는 전문 분석도구로 교차검증하여 신뢰도를 높일 수 있습니다.
- 화합물과 표적의 결합 구조를 출력하는 Diffdock이나, binding affinity를 수치화할 수 있는 PIGNET2와 함께 사용하여 특성과 효능을 동시에 필터링 할 수 있습니다.

---

[tool-button:ADMET-AI]