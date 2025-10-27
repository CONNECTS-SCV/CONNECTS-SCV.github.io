---
layout: post
title: "ToxinPred3.0 : 펩타이드의 독성 여부를 빠르게 예측하는 transformer 기반 모델"
description: "단백질 및 펩타이드 서열의 전역적, 지역적 특징을 분석하여 잠재적인 독성 여부를 예측하는 지도학습 기반 인공지능 모델입니다."
categories: [분석 모델]
tags: [ToxinPred3.0, 독성 예측, 펩타이드, 지도학습, 안전성 평가]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
comment_id: "toxinpred3_main"
paired_post: "toxinpred3_en"
---
## 개요
---
ToxinPred3.0은 단백질 및 펩타이드 서열을 대상으로 잠재적인 독성 여부를 예측하는 지도학습 기반 인공지능 모델입니다.

## 작동 원리
---
- 독성/비독성 펩타이드 데이터셋을 이용해 **지도학습**을 수행합니다.
- 입력된 펩타이드 서열로부터는 Global 특징(아미노산 조성, 물리화학적 특성)과 Local 특징(독성 motif)에 대한 정보를 추출합니다.
- ML 모드(전역 패턴), MERCI 모드(모티프 패턴), Hybrid 모드(통합 패턴)로 화합물의 독성을 평가하며, 최종적으로 각 서열에 대해 **독성 확률 점수**와 **분류 결과**를 산출합니다.

## 입력・출력・설정 옵션
---

**입력** :
- 펩타이드 서열 (FASTA 포맷)

**출력** : 독성 관련 종합 정보
- **ML score** - 1에 가까울 수록 toxic (숫자가 더 높다고 독성이 더 큰 건 아님)
- **MERCI score pos** - 해당 서열이 toxin이랑 얼마나 유사한 motif를 가지고 있는지 점수
- **MERCI score neg** - 해당 서열이 non-toxin이랑 얼마나 유사한 motif를 가지고 있는지 점수
- **Hybrind score** - ML score + MERCI score, 최종 점수
- **Prediction** - 최종 예측 결과 (0.5 기준으로 더 높으면 toxin, 낮으면 non-toxin)
- **PPV** (Positive Predictive Value) - 예측이 positive일때 실제 positive일 가능성
- 다만 Score가 높다고 해서 더 높은 독성을 가진 Peptide라는 의미는 아님

**설정 옵션** :
- 예측 모델 결정
    - ML : 서열의 Global 패턴 위주로 판단 (금방 끝나지만 조금 부정확)
    - MERCI : 서열의 Local 패턴 위주로 판단
    - Hybrid : ML+MERCI Global / Local 패턴을 모두 감안하여 판단 (오래 걸리지만 가장 정확)
- Region Importance : 어떤 부분이 독성에 기여하는지 표기

## 용도・차별 포인트
---

**용도** : 펩타이드 백신이나 치료제의 인체에 대한 독성을 평가할 때 사용합니다.

**차별 포인트** : 단백질로 이루어진 식품이나 나노바이오 소재의 안전성 검증에도 활용할 수 있습니다.

## 비교해 볼만한 모델
---
- **StrucToxNet** : ToxinPred3.0이 1D 서열 기반이라면, StrucToxNet은 3D 구조 기반 독성 예측이 가능하여 더 높은 정확도를 갖습니다.
- **tAMPER, HEMOPI2** : 단순 binary decision 대신 정량적 score 기반 독성 예측을 제공 > “얼마나 독성인지”를 수치로 표현할 수 있고, 특히 HEMOPI2의 경우에는 혈액 독성에 집중한 결과를 볼 수 있습니다.

## 연계해 볼 만한 모델
---

- 독성 예측 결과와 ThermoMPNN의 saturation mutagenesis를 활용하여 독성이 적고 안정성이 높은 peptide 돌연변이를 설계해볼 수 있습니다.
- 다양한 독성 평가 모듈과 연계해볼 수 있습니다.
    - 간 독성 ([DILI](https://github.com/srijitseal/DILI))
    - 심장 독성 ([hERG-prediction](https://github.com/WeilabMSU/hERG-prediction))
    - 신경 독성 ([NeuTox](https://github.com/xuejunhe/NeuTox-2.0))
    - 유전 독성 ([Amesformer](https://github.com/luke-a-thompson/AmesFormer))
    - 면역 독성 ([mhcflurry](https://github.com/openvax/mhcflurry), [DeepNeo](https://github.com/kaistomics/DeepNeo))

---

[tool-button:ToxinPred3.0]