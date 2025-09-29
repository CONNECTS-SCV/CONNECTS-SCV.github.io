---
layout: post
title: "hERG : 화합물의 hERG 채널 차단 여부 예측을 통한 심장 독성 평가"
description: "화합물이 hERG 칼륨 채널을 차단하는지 예측하여 신약 개발의 심장 독성 리스크를 사전에 평가하는 모델"
categories: [분석 모델]
tags: [hERG, 심장 독성, 약물 스크리닝, 예측 모델]
author: "author1"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---
## 개요
심실 근육 세포에 존재하는 칼륨 채널 hERG(human Ether-à-go-go-Related Gene)을 화합물이 차단하는지 예측하여, 신약 개발 과정에서 발생할 수 있는 심장 독성 리스크를 사전에 평가하는 모델입니다.

## 작동 원리
- ChEMBL, GOSTAR, PubChem (NCGC), hERGCentral 등에 데이터베이스에서 얻은 SMILES 구조들을 transformer로 학습하여 분자의 특징을 생성합니다.
- 분자 특성을 GB 이진분류 모델로 학습하여 IC50을 예측합니다.
- Threshold (IC50=10uM) 기준으로 blocker와 non-blocker를 이진 분류합니다.

## 입력・출력・설정 옵션

**입력** : 화합물 구조 (SMILES 포맷)

**출력** : ERG 채널 Blocker 여부 (0 : non-blocker)

**설정 옵션** : 따로 없음

## 용도・차별 포인트

**용도** : 신약 개발 초기 단계에서 후보 물질의 심장 독성 가능성 사전 스크리닝에 사용합니다.

**차별 포인트** : NLP 기반 transformer로 학습하였기 때문에 기존 2D 패턴 기반 QSPR에 비하여 더 일반화된 패턴을 확보할 수 있고, 빠르고 광범위한 전이 학습이 가능합니다.

## 비교해 볼만한 모델
약 30만개의 데이터를 학습하여 3D 구조를 기반으로 심장독성을 예측하는 hERGAI 모델을 고려해볼 수 있습니다. hERGAI는 앙상블 학습을 통하여 더 높은 예측 안정성을 가집니다. 추후 교체 예정입니다.

## 연계해 볼 만한 모델

- 화합물 전반에 대한 ADMET 통합 프로파일링을 하는 ADMET-AI 도구의 상세 예측치와 연계하여 종합적인 약물 안전성을 평가할 수 있습니다.

---

[tool-button:hERG]