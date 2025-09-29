---
layout: post
title: "HEMOPI2 : 펩타이드 용혈 독성 예측 모델"
description: "펩타이드 서열을 분석하여 적혈구 용혈성 여부와 농도(HC50)를 예측하는 혈액 독성 스크리닝 모델"
categories: [분석 모델]
tags: [hemolysis, toxicity prediction, peptide, drug safety]
author: "author1"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---

## 개요
HemoPI2는 펩타이드/단백질의 적혈구 용혈성 (hemolysis)를 서열만으로 예측하는 모델입니다. 이진분류 (hemolytic 여부) 뿐만 아니라 용혈 농도 (HC50, uM)까지 회귀분석을 통하여 산출해 줍니다. 펩타이드가 가지고 있을지도 모르는 혈액 독성 리스크를 사전에 예측하여 신약 후보 발굴 및 안전성 평가에 활용할 수 있습니다.

## 작동 원리
HemoPI2는 아미노산 조성, 위치/모티프 패턴, 물리화학적 특성 등 서열 기반 특징과 ESM2-t6과 같은 언어모델 임베딩을 사용합니다. 모티프를 검출하는 과정은 MERCI로 수행합니다.
::callout
**Regression** : Random forest Regressor (RFR)을 이용하여 HC50값을 예측합니다.

**Classification** : RF (앙상블), ESM2-t6 (단백질 전용 언어모델), MERCI (모티프 탐지)를 활용하여 hemolytic 여부를 판별합니다.
::/callout

HemoPI2는 포유류 RBC를 대상으로 한 1900여개의 실측 데이터를 기반으로 학습/평가되었고, RF와 MERCI를 하이브리드로 활용하여 평가한 결과에서 0.921의 가장 높은 AUROC를 보였습니다.
## 입력・출력・설정 옵션

**입력** : 펩타이드 서열 (FASTA 포맷)

**출력** : Hemolytic vs non-hemolytic (이진 분류), HC50 값 (회귀 분석, 낮을수록 높은 혈액 독성)

**설정 옵션** :
- Task 선택 : Regression or Classification
- (Classification일 경우) 분류 모델 선택 : RF, Hyb1 (RF+MERCI), Hyb2 (ESM+MERCI), ESM-t6
    - RF : 전통적인 이진 분류 기법입니다. HC50이 100uM 이상일 경우 비용혈성으로 판별합니다. 짧은 서열을 분석할 때 좋은 모델입니다.
    - ESM2-t6 : ESM2에서 얻은 서열 임베딩을 2개의 은닉층을 거쳐서 Sigmoid 활성화 함수를 이용하여 확률분포로 출력합니다. 긴 서열을 분석할 때 아주 좋은 모델입니다.
    - Hyb1 : ESM2-t6 분류 점수와 MERCI의 모티프 점수를 결합한 균형 있는 모델입니다.
    - Hyb2 : RF의 분류 점수와 MERCI의 모티프 점수를 결합한 모델입니다. 개발자들이 가장 좋은 결과를 얻은 하이브리드 모델입니다.
    - MERCI란 실험적으로 검증된 용혈성/비용혈성 서열에서 구별 능력이 높은 짧은 패턴을 탐지하는 method입니다. 서열 안에 MERCI motif가 있을 경우 분류 정확도를 많이 높여줍니다.
- Protein scanning size : 단백질을 8~20조각으로 잘라서 각 조각의 용혈성을 스캔하는 방법입니다.

## 용도・차별 포인트

**용도** :
- 펩타이드 신약개발 과정에서 혈액 독성에 대한 리스크를 사전 스크리닝을 통해 분류할 수 있습니다.
- 특히 scanning 과정을 통하여 혈액독성에 대한 리스크 높은 서열을 탐지하여 변이를 제작할 수 있습니다.

**차별 포인트** :
- 다른 도구들이 이진 분류를 위주로 지원하는 반면 HemoPI2는 회귀 분석을 이용한 HC50 (uM) 수치를 제공하며, 하이브리드 분석을 통하여 용혈성 motif 정보가 풍부하게 반영된 분류를 진행할 수 있습니다.

## 비교해 볼만한 모델
- ToxinPred3.0과 같이 hemolysis를 포함한 전반적인 독성을 판단하는 모듈로 교차검증을 해보는 것이 바람직합니다.

## 연계해 볼 만한 모델
- DILIpred, hERGAI와 같이 다른 독성 예측과 병행하여 화합물의 종합 안전성을 평가하는 파이프라인을 한번 만들어보세요.
- ADMET-AI도 아주 좋은 시도입니다. 최종적으로 in vitro RBC lysis assay를 하게 되면 in-silico 실험을 실제 실험 결과로 교차검증할 수 있습니다

---

[tool-button:HEMOPI2]