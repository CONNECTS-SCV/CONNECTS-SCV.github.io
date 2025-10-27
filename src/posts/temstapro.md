---
layout: post
title: "TemStaPro : 단백질 열 안정성 예측 도구"
description: "단백질의 아미노산 서열만을 입력받아, 다양한 온도 조건에서 단백질의 열안정성(thermal stability)을 예측하는 도구입니다."
categories: [분석 모델]
tags: [TemStaPro, 단백질 안정성, 열안정성, ProtT5, 예측 모델]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
comment_id: "temstapro_main"
paired_post: "temstapro_en"
---
## 개요
---
TemStaPro는 단백질 서열(아미노산 서열)만을 입력으로 받아, 다양한 온도 조건에서 단백질의 열안정성(thermal stability)을 예측하는 도구입니다.

## 작동 원리
---
- 아미노산 서열을 ProtT5라는 단백질 언어모델에 통과시키면 아미노산 잔기마다 고차원 벡터 임베딩을 만들어줍니다. 이에 따라 입력된 단백질은 고차원 행렬의 형태로 변환되게 됩니다.
- 학습에 사용된 데이터는 온도 구간별로 stability 레이블이 붙어 있습니다. 즉 온도별로 stable/unstable에 대한 이진분류 문제를 풀어내는 구조입니다.
- Temstapro는 각 온도 구간에서 binary classifier를 이용하여 안정성 여부를 출력하게 됩니다.

## 입력・출력・설정 옵션
---

**입력** :
- 아미노산 서열 (FASTA 포맷)

**출력** :
- 단백질 전체 안정성 스코어
- 잔기별 local 안정성 스코어
- segment 단위/온도 구간별 안정성 스코어

**설정 옵션** :
- 예측 온도 조건 (구간별로 예측이 진행됩니다.)
- 잘라내서 분석할 segment의 크기를 설정할 수 있습니다.

## 용도・차별 포인트
---

**용도** :
- 단백질 엔지니어링 과정에서 변이체 설계 전후로 안정성을 스크리닝해볼 수 있습니다.
- 신약개발 과정에서 후보 물질의 안정성을 체크할 수 있습니다.
- 실제로 CRISPR‑Cas Class II effector proteins (C2EPs) 연구에서 활용 및 검증된 적도 있습니다.

**차별 포인트** :
- OGT 기반 대규모 데이터를 활용하여 높은 coverage를 갖습니다.

## 비교해 볼만한 모델
---
- 현재까지 Temstapro의 상위호환 모델은 없고, 기존 회귀분석 기반 알고리즘 대비 높은 정확도와 속도를 갖습니다.

## 연계해 볼 만한 모델
---

- 단백질의 용해도와 발현가능성을 예측하는 NetsolP와 연계하여 단백질의 용해도와 안정성을 함께 살펴볼 수 있습니다.
- MPNN류 모듈을 사용하여 De novo로 생성된 서열에 대하여 기본적인 서열 안정성을 확인하는데 Temstapro를 활용할 수 있습니다.

---

[tool-button:TemStaPro]