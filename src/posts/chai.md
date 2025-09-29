---
layout: post
title: "Chai-1 : Transformer 기반 구조 예측 및 도킹"
description: "단백질 구조 예측과 도킹을 지원하는 Transformer 기반 AI 모델"
categories: [analysis]
tags: [Chai-1, 단백질구조, 도킹, Transformer, 리간드결합, Glycan]
author: "author1"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---

## 개요

Chai는 단백질 구조 예측과 도킹 (docking)을 동시에 지원하는 Transformer 기반 생성형 인공지능 모델입니다. Boltz-2 (Diffusion 기반)와 기능적으로 유사하지만 모델 아키텍처가 Transformer라는 차이가 있습니다.

## 작동 원리

단백질 서열과 리간드 서열, 글라이칸 서열을 각각 transformer encoder, GNN encoder, glycan 전용 encoder로 각각 임베딩한 후 통합 학습을 진행합니다. 이후 cross-attention map을 이용하여 구조와 binding site 위치를 동시에 추론합니다.

## 입력・출력・설정 옵션

**입력** : 단백질 서열 (FASTA 포맷), 리간드/당 (SMILES/CCD 포맷)
- Glycanbuilder를 사용하여 Glycan을 직접 만들어볼 수도 있습니다.

**출력** : 단백질-리간드/당 복합체의 3D 예측 구조
- **Aggregation score** : 예측된 복합체의 품질 (높을수록 고품질)
- **chain-chain clashes** : 체인 사이의 충돌 횟수 (적을수록 안정적임)
- **PTM** : 단백질 자체 구조의 예측 정확도 (1에 가까울 수록 정확도 높음)
- **iPTM** : 두 체인 사이의 배치 정확도 (1에 가까울 수록 신뢰도 높음)

**설정 옵션** : 따로 없음

## 용도・차별 포인트

**용도** :
단백질과 리간드/당 복합체의 구조를 예측하는 도구입니다.

**차별 포인트** :
- 신약개발 측면에서는 표적 단백질에 결합하는 리간드의 구조 최적화 과정을 자동화하여 빠르게 스크리닝 할 수 있습니다.
- 연구 측면에서는 특정 단백질 돌연변이가 리간드와의 결합 친화도에 미치는 영향을 분석할 수 있습니다.
- 기존 MSA/score 기반 모델에 비하여 빠르고 정확하게 예측해볼 수 있는 장점이 있습니다.

## 비교해 볼만한 모델

- Chai-1과 Boltz-2의 구조 예측 및 도킹 결과를 교차 검증해볼 수 있습니다.
- 도킹 부분은 Diffdock과 같은 도킹 특화 모델과 결과를 비교해볼 수 있습니다.

## 연계해 볼 만한 모델

- 생성된 결합구조의 자세한 interface는 PLIP/Prodigy로 평가할 수 있습니다.
- 관심있는 단백질이 효소일 경우 DLKCat을 통하여 binding mode의 변화가 효소 활성에 미치는 영향까지 관찰해볼 수 있습니다.

---

[tool-button:Chai]