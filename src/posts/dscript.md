---
layout: post
title: "Dscript : 단백질의 상호작용 여부를 예측하는 CNN 기반 모듈"
description: "두 단백질의 아미노산 서열 정보만을 이용해 상호작용(PPI) 여부를 예측하는 딥러닝 모델"
categories: [분석 모델]
tags: [PPI, protein interaction, CNN, sequence analysis]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
comment_id: "dscript_main"
paired_post: "dscript_en"
---

## 개요
---
Dscript는 두 종류의 단백질 아미노산 서열을 입력받아 Protein–Protein Interaction (PPI)을 예측하는 CNN 기반 인공지능 모델입니다. 단백질 간 상호작용을 구조 정보 없이도 빠르게 대규모로 스크리닝할 수 있습니다.

## 작동 원리
---
- 먼저 아미노산 서열을 CNN 기반 인코더로 벡터 임베딩으로 변환합니다.
- 상호작용을 확인하고자 하는 두 단백질의 임베딩을 결합한 후 MLP에 입력하여 상호작용 확률을 출력하는 방식으로 예측합니다. 손실 함수는 binary cross-entropy loss를 사용합니다.
- BioGRID, IntAct, DIP 같은 대규모 PPI 데이터베이스로부터 실험적으로 상호작용이 확인된 단백질 쌍을 수집하여 학습하였기 때문에 높은 정확도를 가지며 특히 intra-species의 정확도가 더 높은 것으로 확인되었습니다.

## 입력・출력・설정 옵션
---

**입력** : 단백질 서열 (FASTA 포맷), 상호작용을 확인하고자 하는 단백질 pair 리스트

**출력** : 각 단백질 pair별 상호작용 확률 점수 (0~1, 1에 가까울수록 상호작용 가능성 높음)

**설정 옵션** : Prediction 모델 선택
- Human : 인간 단백질 데이터셋 기반
- Topsy : 다양한 종 데이터를 통합 학습한 범용 모델
- tt3d : 3D 구조 정보를 추가적으로 학습한 고정확도 모델 (정확도 ↑, 연산 비용 ↑)

## 용도・차별 포인트
---

**용도** :
- 돌연변이에 의하여 PPI가 영향을 받는지 확인해볼 수 있습니다.
- digenic interactome과 같은 질병 관련 네트워크 분석에도 활용할 수 있습니다.

**차별 포인트** :
- PPI 상호작용 가능성에 대한 빠른 스크리닝이 가능합니다.

## 비교해 볼만한 모델
---
PPI-graphomer를 이용하여 3D 구조 기반 예측을 진행할 수 있습니다. 다만 최근 업데이트된 tt3d 모델을 활용하게 되면 Dscript로도 3D 구조 기반 예측을 동일하게 진행할 수 있습니다. 두 모듈 사이의 예측 결과를 비교하여 교차검증을 해볼 수 있겠습니다.

## 연계해 볼 만한 모델
---
Dscript로 빠르게 스크리닝을 진행한 후 Prodigy나 Haddock을 이용해 실제 interaction 구조, affinity를 예측해볼 수 있습니다.

---

[tool-button:Dscript]