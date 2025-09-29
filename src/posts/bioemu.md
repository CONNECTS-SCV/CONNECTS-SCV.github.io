---
layout: post
title: "Bioemu : 아미노산 서열로부터 동적 평형 상태인 구조를 출력하는 모델"
description: "Diffusion 기반으로 동적 평형 상태의 단백질 구조를 예측하는 생성 모델"
categories: [analysis]
tags: [Bioemu, 단백질구조, Diffusion, MD시뮬레이션, AlphaFold]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---

## 개요

Bioemu (Biomolecular Emulator)는 아미노산 서열을 입력받아 동적 평형 상태의 단백질 구조를 예측하는 Diffusion 기반 생성 모델입니다. 기존 MD(Molecular Dynamics) 시뮬레이션이 제공하는 구조적 다양성과 에너지 안정성을 훨씬 빠르게 추출할 수 있도록 설계되었습니다.

## 작동 원리

**Pretraining 과정**
- AlphaFold2 임베딩을 입력으로 사용하여 AlphaFold DB와 자체 구축한 MD 데이터로 구조적 다양성을 (distribution) 학습합니다.

**Diffusion 기반 구조 샘플링**
- 노이즈로부터 단백질의 3D 구조를 복원하는 방식으로 folding 과정에서 겪을 수 있는 단백질의 다양한 안정 상태를 샘플링합니다.

**Fine-tuning**
- folding 에너지 데이터를 기반으로 에너지 landscape 보정하고 단백질의 안정성을 예측합니다. MD 시뮬레이션을 통해서 나올 수 있는 안정적인 에너지 상태를 스냅샷으로 얻는 느낌입니다.

## 입력・출력・설정 옵션

**입력** : 아미노산 서열 (FASTA, 일반적으로 500개 미만에서 효과적인 계산이 가능합니다.)

**출력** : 단백질의 3D 구조 파일 (PDB 포맷) + 검증용 라마찬드란 플롯

**설정 옵션** : 샘플링할 구조 갯수 (에너지적으로 안정한 state 중에서 확률적으로 샘플링을 진행합니다)

## 용도・차별 포인트

**용도** :
- 신약 개발에서 약물의 결합 포켓이나 기능 도메인의 구조 변화를 예측할 수 있습니다.
- 빠르게 구조를 샘플링 할 수 있어서 본격적인 MD 시뮬레이션을 하기 전 스크리닝에 활용할 수 있습니다.

**차별 포인트** :
- MD 대비 압도적으로 적은 계산량, 빠른 속도를 가지며 열역학적인 정확도도 1 (kcal/mol) 이내의 오차를 가질 정도로 아주 우수합니다.

## 비교해 볼만한 모델

- GROMACS와 같은 고전적인 분자동역학 시뮬레이션 도구와 비교할 수 있습니다.
- GROMACS는 시간 축에 따른 세밀한 원자 움직임을 추적할 수 있지만 계산량이 크고 속도가 느리다보니 Bioemu와 같은 도구로 보완할 필요가 있습니다.

## 연계해 볼 만한 모델

Bioemu는 backbone 구조만 결정해주는 도구입니다. 추가적으로 HPacker를 사용하면 side chain의 rotamer 정보를 최적화할 수 있습니다.

---

[tool-button:Bioemu]