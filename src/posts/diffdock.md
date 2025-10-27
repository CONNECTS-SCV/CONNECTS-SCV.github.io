---
layout: post
title: "Diffdock : 단백질과 리간드의 결합구조를 예측하는 모델"
description: "딥러닝 diffusion 기술을 사용하여 단백질에 대한 리간드의 최적 결합 자세를 예측하는 모델"
categories: [분석 모델]
tags: [Diffdock, Docking, Protein-Ligand]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
comment_id: "diffdock_main"
paired_post: "diffdock_en"
---

## 개요
---
Diffdock은 단백질–리간드 도킹을 수행하는 딥러닝 기반 diffusion 모델입니다. 단백질의 3차원 구조(PDB)는 고정해두고, 리간드의 위치·회전·torsion angle 을 최적화하여 가장 가능성 높은 결합 포즈(binding pose)를 만들어 줍니다.

## 작동 원리
---
- PDBbind 등의 대규모 단백질-리간드 복합체 구조를 Diffusion 기반으로 학습한 후 단백질의 위치는 고정해 두고 리간드의 위치를 noise로부터 denoising하는 과정을 통하여 업데이트합니다.
- 결합 친화도를 직접적으로 측정해가면서 더 좋은 포즈를 찾는 것이 아니라 diffusion을 통해서 학습된 분포와 유사한 구조를 찾아가는 방식이라서 빠른 속도로 예측이 가능합니다.

## 입력・출력・설정 옵션
---

**입력** : 단백질 구조 (PDB), 리간드 구조 (SMILE 포맷)

**출력** : 도킹된 단백질–리간드 복합체 구조 (PDB), 각 구조별 confidence score [0-1]

**설정 옵션** :
- 몇개의 포즈를 생성할지 선택할 수 있습니다.
- 추론 단계를 높이면 오랜 시간이 걸리지만 정확도는 더 높아집니다.

## 용도・차별 포인트
---

**용도** : 
- 신약 개발 초기단계에서 binding을 기준으로 스크리닝을 진행할 수 있습니다.
- Drug repositioning을 고려할 때에도 좋은 옵션입니다.

**차별 포인트** : 
- 전통적인 물리 기반 도킹에 비해 속도나 스케일에서 우위를 갖습니다.
- novel한 binding mode일 경우에는 전통적인 물리모델보다 예측력도 좋습니다.

## 비교해 볼만한 모델
---
전통적인 물리모델의 베이스라인은 AutoDock Vina입니다. 결과를 교차검증 해볼 수 있습니다.

## 연계해 볼 만한 모델
---

- Diffdock은 단백질의 pose를 고정하고 분석이 돌아갑니다. 만약 단백질의 서열을 원하는 부위에서 최적화해보고 싶다면 LigandMPNN을 이용하여 다시 서열을 써볼 수도 있습니다.
- Diffdock의 경우에는 binding affinity 수치를 주지는 않기 때문에 PIGNET2와 같은 모듈을 사용하여 binding affinity를 구할 수도 있습니다.

---

[tool-button:Diffdock]