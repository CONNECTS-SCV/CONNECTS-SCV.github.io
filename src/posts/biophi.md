---
layout: post
title: "BioPhi : 항체 인간화, 유사도 평가, 서열 설계를 지원하는 통합 설계 플랫폼"
description: "대규모 항체 데이터를 이용한 항체 인간화 및 humanness 평가 모델"
categories: [analysis]
tags: [BioPhi, 항체, humanization, humanness, OAS, 딥러닝]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---

## 개요
---

Biophi는 대규모 항체 데이터 (OAS)를 이용하여 항체의 humanization 및 인간화 정도 (humanness)를 평가하는 딥러닝 모델입니다.

## 작동 원리
---

Biophi는 두 가지의 항체의 인간화, ation을 통해서 얻어지는 항체들을 humanization할 때 사용합니다.

::list-callout
- Sapiens
    - 항체 데이터를 언어 모델 기반으로 학습하여 입력 서열에서 non-human 서열을 탐지하여 human 서열로 대체하는 작업을 수행합니다. masking이나 infilling등의 복원기법이 이 과정에서 활용됩니다.
- OAsis
    - 먼저 항체 서열을 9-mer의 펩타이드 단위로 분해합니다. 그후 각 펩타이드가 OAS 데이터베이스 안에 있는 인간 항체 레퍼토어에 얼마나 자주 등장하는지 빈도를 계산하여 이를 바탕으로 각 잔기에 대한 humanness 점수를 산출합니다. 실제로 이렇게 계산된 점수는 임상에서의 면역원성 위험도와 상관관계를 갖습니다.
::/list-callout

## 입력・출력・설정 옵션
---

**입력** : 항체 아미노산 서열 (FASTA 포맷)

**출력** : Humanized 항체 서열, 잔기별 humanness score

**설정 옵션** : (업데이트 예정)

## 용도・차별 포인트
---

**용도** : Immunization을 통해서 얻어지는 항체들을 humanization할 때 사용합니다.

**차별 포인트** :
- 특히 Biophi는 전통적인 항체 humanization 방법 대비 빠르고 정교한 humanization을 가능하게 합니다.
  - 기존 humanization은 구조적 지식을 기반으로 아래와 같이 manual로 진행해 왔습니다:
    - **Chimeric 항체** : mouse 항체의 variable 부분은 그대로 구도 constant region만 인간 항체로 교체하는 방식. (Cetuximab 이나 Rituximab 같은 1세대 치료제에서 사용된 방식입니다.)
    - **CDR grafting** : mouse 항체의 CDR을 인간 항체 골격에 붙여 넣는 방법. CDR grafting 과정에서 binding affinity가 크게 영향을 받을 경우 back-mutation을 통해 CDR 근처 core region을 원래 서열로 복원하여 binding affinity를 회복시킬 수 있습니다.
    - **Resurfacing** : 항체 표면의 잔기들만 human antibody의 잔기로 치환하는 방식
    - **SDR grafting** : mouse 항체의 CDR 중에서도 실제 항원 결합에 중요한 SDR (Structural Determinant Residues)만 남기고 나머지는 인간화하는 방식
  - BioPhi는 이 중에서 CDR grafting과 back-mutation을 하는 과정을 항체 빅데이터를 기반으로 자동화한 모델이라 이해할 수 있습니다.
- 또한 Biophi의 경우에는 인간화 정도를 평가할 수 있는 모듈이 내장되어 있어 신뢰도 검증에 유용합니다.

## 비교해 볼만한 모델
---

Alignment를 기반으로 humanization을 지원하는 Humatch같은 모듈과 교차 검증하여 볼 수 있습니다.

## 연계해 볼 만한 모델
---

- Biophi를 통해 인간화된 항체에 대하여 MHCflurry를 이용하여 MHC I 결합 정도와 면역원성에 대한 예측을 진행해볼 수 있습니다.
- 또한 인간화된 항체가 표적 항원에 대한 결합력을 여전히 가지고 있는지에 대하여 HADDOCK과 같은 도킹 도구나, gromacs에서 PMF를 측정하는 방식으로 검증해볼 수 있습니다.

---

[tool-button:BioPhi]