---
layout: post
title: "PIGNET2 : 단백질-리간드 상호작용의 결합 친화도를 계산하는 모델"
description: "단백질과 리간드 상호작용의 결합 친화도(binding affinity)를 정량적으로 예측하는 그래프 신경망 기반 모델입니다."
categories: [분석 모델]
tags: [PIGNET2, 결합 친화도, Binding Affinity, 단백질-리간드, GNN]
author: "author1"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---
## 개요
PIGNET2는 단백질-리간드 상호작용의 binding affinity (결합 친화도)를 예측하는 모델입니다.

## 작동 원리
- 단백질 리간드 복합체 구조를 그래프로 변환합니다. (아미노산 잔기는 노드, 상호작용은 엣지)
- 결합 에너지나, 정전기적 상호작용, 소수성 상호작용, 수소결합 같은 물리적 에너지 항을 함께 학습합니다.
- 이미 알려진 단백질-리간드 binding affinity 데이터를 정답으로 사용하여, 잘못된 도킹 데이터는 -, 올바른 도킹 (near-native) 데이터는 +로 증강학습을 진행합니다.
- GNN기반 학습을 통하여 상호작용 패턴을 추출하고 스코어링 네트워크에서 최종적인 binding affinity 점수를 출력하는 구조입니다.

## 입력・출력・설정 옵션

**입력** : 단백질 구조 (PDB 포맷), 리간드 구조 (SDF 포맷)

**출력** : 다양한 물리 에너지 변화량 및 총 에너지 변화량
- Complex_IDE : 복합체의 총 에너지 (Estimated Total Energy)
- elecE : 전기적 (electrostatic) 상호작용 에너지
- vdwE : 반데르발스 (van der Waals) 상호작용 에너지
- hbondE : 수소 결합 (hydrogen bond) 에너지
- hydrophobicE : 소수성 (hydrophobic) 상호작용 에너지
- metalE : 금속 결합 (metal coordination) 에너지
- piE : π-π 상호작용 및 기타 방향족 (pi-stacking) 관련 에너지
- total : 전체 결합 에너지의 합 (종합 binding affinity score)

**설정 옵션** : 사용자 설정 옵션 없음

## 용도・차별 포인트

**용도** : 
- 단백질과 리간드의 상호작용을 관찰하는 다양한 모델이 있지만 정확한 결합 친화도를 예측해주는 모델이 많지 않습니다.
- PIGNET2는 좋은 복합체 구조가 존재하기만 한다면 정량적인 비교가 가능하여 리간드의 ranking을 매길 수 있는 특별한 모듈입니다.

**차별 포인트** :
- 물리적인 상호작용 에너지를 학습하여 반영할 수 있다는 점도 좋은 차별점입니다.

## 비교해 볼만한 모델
- Genscore의 경우에는 docking 포즈의 퀄리티를 평가하는 스코어링 함수를 제공합니다. 하지만 binding affinity를 직접적으로 예측해주지는 않아서 아쉬움이 있는 모델입니다.
- Boltz-2같은 경우에는 복합체 구조 예측부터 결합 친화도 측정까지 원스텝으로 진행할 수 있는 모델로 PIGNET2의 상위호환 느낌이지만 교차검증용으로 두 모델을 함께 사용해볼 수 있습니다.

## 연계해 볼 만한 모델

- Diffdock으로 얻은 단백질 복합체를 PIGNET2를 돌리기 위한 입력으로 활용할 수 있습니다. 결합구조 생성 + 친화도 탐색을 위한 통합 워크플로우입니다.

---

[tool-button:PIGNET2]