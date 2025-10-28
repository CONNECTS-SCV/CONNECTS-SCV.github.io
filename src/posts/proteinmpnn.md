---
layout: post
title: "ProteinMPNN : 단백질 구조에 맞는 서열을 디자인해주는 모델"
description: "단백질의 3D 구조를 입력받아 해당 구조에 적합한 아미노산 서열을 설계하는 Inverse folding 계열의 MPNN 기반 인공지능 모델입니다."
categories: [analysis]
tags: [ProteinMPNN, Inverse Folding, 단백질 설계, MPNN, 서열 생성]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
comment_id: "proteinmpnn_main"
paired_post: "proteinmpnn_en"
---
## 개요
---
ProteinMPNN은 단백질의 3D 구조를 입력받아 해당 구조에 적합한 아미노산 서열을 설계하는 MPNN 기반 단백질 설계 인공지능 모델입니다. Inverse folding 계열 모델로 구조 > 서열 매핑에 특화되어 있습니다.

## 작동 원리
---
- 기본적인 MPNN의 구조를 차용합니다. 단백질의 3D 구조로부터 노드 (아미노산 정보), 엣지 (노드 간 거리, 방향)를 추출하고, 이웃 노드들의 정보를 모으고 업데이트하는 과정을 거쳐서 현재 구조에 가장 적합한 아미노산의 확률 분포를 출력하는 구조입니다.
- 다만 Garbage in Garbage out으로 입력 구조 품질이 나쁘면 불안정한 결과를 얻게 되고 학습 데이터에 없는 희귀 구조, fusion protein 등에 대해 정확도가 떨어진다는 한계점도 존재합니다.
- 뿐만 아니라 최적화된 서열이 특정한 기능적인 특성을 가질 것이라는 보장이 없어 별도의 모델을 이용한 교차 검증이나 실험 검증이 꼭 필요합니다.

## 입력・출력・설정 옵션
---

**입력** :
- 단백질 3D 구조 (PDB 포맷)

**출력** :
- 입력한 구조에 최적화된 아미노산 서열 (FASTA 포맷)

**설정 옵션** :
- Sampling temperature : 다양성 조절 (높을수록 도전적 서열 생성)
- Sequences for target : 생성할 서열 개수
- 제약조건
  - fixed : 특정 위치는 그대로 유지
  - tied : 서로 동일한 아미노산으로 고정
  - design only : 일부 영역만 변경
  - auto-tie : 대칭 구조 자동 tie 처리
  - 특정 아미노산 선호/배제 가능 (예: 소수성 잔기 줄이기)
  - PSSM multiplier : MSA 기반 아미노산 선호도를 얼마나 반영할지 조절

## 용도・차별 포인트
---

**용도** : De novo 단백질 설계과정에서 신규 구조에 맞는 서열을 생성할 수 있고, 항체에 적용하면 CDR loop 서열을 항원과의 결합구조에 맞춰 부여할 수 있습니다.

**차별 포인트** : 레거시 모델 대비 시뮬레이션 속도가 매우 빠르며, 실제 PDB 데이터를 기반으로 학습을 진행하였기 때문에 보다 realistic한 서열 생성이 가능합니다.

## 비교해 볼만한 모델
---
- ProteinMPNN은 inverse folding 영역에서는 속도와 정확도가 가장 뛰어난 SOTA 모델입니다.
- 다만 항체 서열에 대한 inverse folding은 antifold라는 특화된 모델을 통해 교차검증할 수 있습니다.

## 연계해 볼 만한 모델
---

- RFdiffusion으로 구조를 생성한 후 ProteinMPNN으로 해당 구조에 적합한 서열을 할당할 수 있습니다. RFantibody가 이러한 구조의 워크플로우로 구성된 모듈입니다.
- ProteinMPNN에 의하여 생성된 서열에 대하여 boltz-2 또는 alphafold로 구조예측한 후 prodigy로 표적과의 결합 친화도를 평가해볼 수 있습니다.

---

[tool-button:ProteinMPNN]
