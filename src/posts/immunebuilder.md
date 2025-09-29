---
layout: post
title: "Immunebuilder : 항체/ TCR 구조 예측에 전문화된 alphafold 기반 모델"
description: "항체(nanobody, antibody)와 T세포 수용체(TCR)의 3차원 구조를 예측하는 데 특화된 인공지능 모델입니다."
categories: [분석 모델]
tags: [항체 구조 예측, TCR, 3D 구조, Immunebuilder, Alphafold]
author: "author1"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---
## 개요
Immunebuilder는 항체(nanobody, antibody)와 T세포 수용체(TCR)의 3차원 구조를 예측하는 데 특화된 인공지능 모델입니다. OPIG에서 연구하여 공개된 모델이고 항체 예측용 Antibodybuilder의 경우 v3까지 개발되었습니다.

## 작동 원리
- Immunebuilder는 Alphafold multimer에서 사용하는 구조 모듈을 항체/나노바디/TCR에 맞춰서 추가학습하여 최적화한 모델입니다.
- transformer 기반의 attention 네트워크를 활용하여 아미노산 잔기 사이의 공간적인 관계를 학습합니다.
- 단백질 서열이 입력되면 처음에는 모든 잔기가 한 점에 모여서 존재하다가 iteration을 통해서 좌표와 방향 정보를 업데이트하면서 최종적인 위치를 잡아가게 됩니다.
- 마지막 업데이트가 끝나면 잔기 사이의 torsion을 조정하고 결과를 출력합니다. N-C one direction으로 그림을 그리는 모델과는 다르게 전체 구조를 동시에 그려가는 모델입니다.

## 입력・출력・설정 옵션

**입력** : 아미노산 서열 (FASTA 포맷)

**출력** : 입력된 서열에 대하여 예측된 3D 단백질 구조 파일

**설정 옵션** : 항체 or 나노바디 or TCR 선택

## 용도・차별 포인트

**용도** :
- 항체 연구 초기단계에서 in silico library를 서열 기반으로 제작하는데 활용할 수 있습니다.
- 항체 CDR loop engineering의 결과를 예측하는 초기 모델로 활용할 수 있습니다.

**차별 포인트** :
- 항체 구조에 대한 추가학습을 진행하다보니 항체 구조에 대해서는 벤치마크 alphafold multimer보다 빠르고 정확한 예측이 가능합니다.
- 다만 항원과의 상호작용을 고려하지는 않고 있어서, RFantibody 등을 통한 추가적인 최적화가 필요합니다.

## 비교해 볼만한 모델
- 범용 구조 예측 모델인 Alphafold multimer로 예측된 구조와 교차 검증해볼 수 있습니다.
- 또한 CDR3 loop 구조 예측에 특화된 DeepAb로 보다 섬세한 최적화를 진행할 수도 있습니다.
- Nanobody 디자인에 대해서는 Nanonet이라는 모듈도 존재합니다.

## 연계해 볼 만한 모델

- Immunebuilder를 이용하여 항체 구조 예측 후 HadDOCK과 같은 도구를 이용하여 도킹을 진행해볼 수 있습니다. 결합 친화도 예측은 Prodigy에서 가능합니다.
- 항원과의 결합을 감안한 최적화를 하기 위해서는 MPNN과 Diffusion 모델을 추가적으로 활용해야 합니다.

---

[tool-button:Immunebuilder]