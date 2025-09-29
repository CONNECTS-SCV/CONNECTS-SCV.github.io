---
layout: post
title: "RFantibody : De novo 항체 설계 모델 (in-silico 항체 라이브러리)"
description: "RFdiffusion, ProteinMPNN, RoseTTAFold2 모델을 통합하여 항원 구조 기반으로 새로운 항체를 설계하는 End-to-End 워크플로우입니다."
categories: [분석 모델]
tags: [RFantibody, 항체 설계, De Novo Design, RFdiffusion, ProteinMPNN]
author: "author1"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---
## 개요
RFantibody는 De novo 항체 설계 파이프라인으로, 기존에는 phage display나 물리적 라이브러리를 이용해 항체를 선별·설계하던 과정을 in silico에서 빠르고 체계적으로 수행할 수 있게 해주는 모델입니다. 단백질 설계용 SOTA 인공지능 모델 세 가지 (RFdiffusion, PRoteinMPNN, RoseTTAFold2)를 통합하여 편의성을 극대화하였습니다.

## 작동 원리
항체 구조 생성 - CDR 서열 할당 - 구조 예측 및 검증의 세 단계로 이루어져 있습니다.

::callout
**구조 생성 단계 (RFdiffusion)**
  - Diffusion 모델 기반으로 noise에서 시작해 CDR을 중심으로 항체 구조를 생성합니다.
  - PDB 단백질 구조 데이터베이스를 기반으로 noise-to-structure 복원 과정에서 항체 CDR conformational diversity를 학습한 모델입니다.

**서열 할당 단계 (ProteinMPNN)**
  - MPNN을 기반으로 주어진 CDR 구조에 최적화된 아미노산 서열을 할당합니다.
  - 구조-서열 적합성을 극대화하도록 학습된 조건부 서열 디자인 모델입니다.

**구조 재예측 및 검증 단계 (RoseTTAFold2)**
  - 할당된 아미노산 서열을 입력받아 다시 구조를 예측합니다.
  - 예측된 구조와 첫번째 구조 생성단계에서 만들어진 초기 구조를 비교하여 설계 타당성을 검증합니다.
::/callout
 
## 입력・출력・설정 옵션

**입력** :
- 표적 항원의 단백질 구조 (PDB 포맷)
- 프레임 워크 항체의 구조 (PDB 포맷)

**출력** :
- 최종적으로 설계된 항체 구조 (PDB 포맷)
- 적합도 평가 지표

**설정 옵션** :
- Epitope 정보
- CDR 루프 범위
- Designs (생성할 항체 갯수)
- Diffusion step (전체 diffusion layer 수)
- Final step (전체 diffusion layer중 몇 번째 step에서 결과를 뽑을지?)
- Deterministic inference : Randomness에 대한 부분 - TRUE로 놓을 경우 randomness 최소화
- Temperature (실제 온도가 아님, 낮을수록 다양성 저하, 높을수록 다양성 올라감)
- Sequences for design 한 종류의 구조에 대하여 생성하는 서열의 갯수 (proteinMPNN step)

## 용도・차별 포인트

**용도** :
- 항원의 에피포트를 기반으로 새로운 항체를 설계할 수 있습니다.
- 이 과정에서 새로운 CDR loop이 설계되고 결합 정보도 예측할 수 있습니다.

**차별 포인트** :
- 기존에는 개별적으로 사용되던 RFdiffusion과 ProteinMPNN, RF2를 통합하면서 end-to-end 항체 설계가 자동화된 워크플로우로 가능하게 되었습니다.
- 특히 CDR-H3에 대한 높은 예측 신뢰성을 가지고 있는 것으로 보고되었습니다.

## 비교해 볼만한 모델
- 항체의 구조 예측과 devlopability 평가 등을 통합하여 할 수 있는 **SabPred**라는 플랫폼도 있습니다.
- CDR 특이적으로 디자인 하기 위해서는 **ABlooper**같은 디자인 도구를 활용할 수 있습니다.
- OPIG에서 개발한 **Abodybuilder3**도 좋은 성능을 가진 항체 설계 도구입니다. 서열 기반으로 구조를 예측해줍니다.

## 연계해 볼 만한 모델

- 만들어진 항체에 대하여 **DeepSP**를 이용하여 개발 가능성에 대한 지표를 추출해볼 수 있습니다.
- 항원과 항체의 결합 양상을 확인하기 위하여 **Prodigy**나 **HADDOCK**과 같은 모델이 사용될 수 있습니다.

---

[tool-button:RFantibody]