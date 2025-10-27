---
layout: post
title: "NetsolP : 단백질 용해도 및 활용도 예측 도구"
description: "아미노산 서열만으로 E. coli 발현 기준 단백질의 용해도와 정제 가능성을 예측하는 트랜스포머 기반 모델입니다."
categories: [분석 모델]
tags: [NetsolP, 단백질 용해도, 단백질 발현, ESM, 예측 모델]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
comment_id: "netsolp_main"
paired_post: "netsolp_en"
---
## 개요
---
NetsolP는 아미노산 서열만 가지고 E. coli 발현 기준으로 단백질의 용해도와 정제 가능성을 예측하는 트랜스포머 기반 모델입니다.

## 작동 원리
---
- ESM 언어모델 임베딩: 단백질 서열을 문장처럼 처리하여 문맥적 특징을 추출합니다.
- E. coli 발현량/용해도 라벨 데이터 (PSI Biology, NESG 등)를 이용해 ESM을 파인튜닝합니다.
    - Solubility의 경우에는 발현 이후의 용해 정도를 평가하고 Usability는 단백질의 발현량과 정제 가능성을 포함한 실제적인 사용 가능성을 제공합니다.
- 동일한 서열이나 유사한 서열의 경우 파티셔닝을 통해 정리하여 데이터 편향을 최소화합니다.

## 입력・출력・설정 옵션
---

**입력** :
- 아미노산 서열 (FASTA 포맷)

**출력** :
- Solubility prediction (0–1) : 1에 가까우면 용해도가 좋다는 뜻입니다.
- Usability prediction (0–1) : 1에 가까울면 발현 성공 가능성이 높습니다.
- 점수 자체는 정량적 수치가 아니라 예측 확률/스코어이므로 기준값은 연구자가 상황에 맞게 설정해야 합니다.
  - 예를 들어서 점수가 0.8인 단백질A가 존재하고, 0.7인 단백질 B가 존재한다고 해서 단백질 A가 B에 비해서 용해도가 높은 것은 아닙니다.

**설정 옵션** :
- ESM1b : 대형 모델이고 높은 정확도를 가집니다.
- ESM12 : 소형 모델이고 빠른 1차 필터링용으로 사용합니다.
- ESM1b distilled : 균형 잡힌 모델입니다.

## 용도・차별 포인트
---

**용도** :
- 단백질 라이브러리가 제작되면 발현 성공 가능성이 높은 후보를 일차적으로 필터링할 수 있습니다.
- 대규모 서열 데이터셋에 대한 저비용/고속 스크리닝이 가능합니다.

**차별 포인트** :
- MSA 없이 단백질 언어모델을 기반으로 예측하기 때문에 속도가 아주 빠르고, 일반화 성능이 우수합니다.
- 다만 residue level에서 hotspot을 찾는다던가 하는 기능은 없어서 아쉬움이 있습니다.

## 비교해 볼만한 모델
---
- Camsol을 사용하면 residue level에서 hotspot을 탐색해볼 수 있습니다.
- Soluprot과 같은 전통적인 solubility의 예측결과와 비교해보는 것도 좋겠습니다.

## 연계해 볼 만한 모델
---

- Temstapro를 활용하면 단백질의 열안정성이 solubility와 correlation이 있는지 확인해볼 수 있습니다.
- 단백질의 낮은 solubility에 특정 aggregation hotspot이 영향을 주고 있는지에 대하여 aggrescan3D 등으로 확인해볼 수 있습니다.

---

[tool-button:NetsolP]