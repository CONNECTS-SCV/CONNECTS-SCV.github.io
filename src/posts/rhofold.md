---
layout: post
title: "RhoFold : 언어 모델 기반 RNA 3차 구조 예측 방법"
description: "RNA-FM 언어 모델과 AlphaFold 아키텍처를 결합한 RNA 3차 구조 예측 모델"
categories: [academic]
tags: [RhoFold, RNA구조, 언어모델, RNA-FM, 3차구조예측]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/preview/rhofold_1.webp"
comment_id: "rhofold_preview"
---

![RhoFold 메인 이미지](/image/info/preview/rhofold_1.webp){center:700}

## 서론

단백질 분야의 경우에는 Rosetta와 alphafold를 중심으로 꽤 오래전부터 3차 구조 중심의 예측이 발전해왔습니다. 하지만 RNA의 경우에는 염기쌍의 결합 패턴을 통해 Hairpin이나 Loop등의 2차 구조를 예측하는 형태로 주로 연구가 이루어졌습니다. ViennaRNA (RNAfold)나 CONTRAfold 등의 알고리즘이 대표적인 예제입니다.

단백질의 구조 예측 분야에서 AF2가 큰 성공을 거두면서 RNA 구조 예측에서도 딥러닝 기반의 접근법이 시도되기 시작했는데요. 2024년 11월 Nature Methods에 게재된 RhoFold라는 RNA 3차구조 예측모델을 오늘 소개해드릴까 합니다. (홍콩 대학 Yu Li팀이 개발한 언어 모델 기반 RNA 3차 구조 예측 모델입니다.)

2차 구조 기반의 기존 모델들은 RNA의 기본적인 구조를 파악하는데는 유용하지만 유전병과 같은 특수한 질병에서 원인 분자가 되기도 하는 Structured RNA의 기능이나 작용 기전을 예측하기 위해 필요한 RNA의 3차원 입체 구조를 정확하게 이해하기에는 한계가 있었습니다. 최근 RNA 표적 저분자 화합물이나 ASO등이 활발하게 연구되기 시작하면서 RhoFold와 같이 RNA의 3차 구조를 예측하는 모델들이 앞으로 더 많은 관심을 받게 되리라 생각합니다.

## 모델 핵심

### 모델 구조 비교

위쪽이 RhoFold+의 모델 구조이고, 아래쪽이 AlphaFold의 모델 구조입니다.
전반적으로 Alphafold의 모델 구조를 차용하고 있으나, Alphafold의 경우 MSA (서열이 유사한 다중 서열을 정렬하여 비교하는 도구)를 통해서 서열의 관계와 문맥을 포괄적으로 이해하는 반면 RhoFold의 경우에는 RNA-FM이라는 RNA 전용 언어 모델을 추가적으로 활용하면서 서열 수준의 통계적인 규칙을 보완한다는 차이가 있습니다. 단백질과 달리 RNA의 경우에는 짧은 서열, 높은 구조적인 다양성, 약한 보존성으로 인해서 MSA 만으로 충분한 정보를 얻기 어렵기 때문입니다. Meta에서 개발한 ESM이라는 단백질 전용 언어 모델도 존재하는데요. 추후 별도의 글을 통해 설명 드릴 예정입니다.

![Alphafold 모델 구조](/image/info/preview/rhofold_2.webp){center:880}[Alphafold 모델 구조]

![Rhofold 모델 구조](/image/info/preview/rhofold_3.webp){center:880}[Rhofold 모델 구조]

### 언어 모델 (RNA-FM)

MSA 단독으로는 학습하기 부족한 RNA의 언어적인 특징을 이해하기 위하여 사용되는 RNA 전용 언어모델입니다. RNA-FM은 해석 가능한 RNA 연구에 지향점을 두고 Yu Li 그룹에서 직접 개발한 언어모델로 80만종, 2300만개 이상의 RNA 서열을 학습하여 염기 간의 문맥 정보를 self-attention 기반으로 파악하였습니다. 학습에 사용된 RNA는 rRNA, tRNA, snRNA, riboswitch 등의 structured RNA가 약 70%, 그 외에 mRNA등의 non-structured RNA가 약 30% 정도 되는 것으로 알려져 있습니다. Rho-FM은 MSA로부터 충분한 정보를 얻기 어려운 RNA의 특성을 보완하여 언어적 문맥을 완성시키는 용도로 활용됩니다. 예를 들어 GNRA라는 서열이 loop 구조와 연관되었다던지 하는 특성들을 RNA-FM을 통해서 보충하는 것이죠! 이러한 정보들은 MSA 피처와 결합되어 추후 Rhoformer 인코더로 통합됩니다.

### IPA

통합된 임베딩은 IPA (Invariant Point Attention)라는 문법을 통해서 위치를 부여받게 됩니다. IPA 모듈은 alphafold에서도 동일하게 활용되었던 모듈인데요. 분자의 절대 좌표가 아니라 상대 좌표를 이용하여 위치를 학습하도록 도와주기 때문에 분자의 회전이나 이동에 관계없이 3차원 좌표를 체계적으로 학습하고 구현할 수 있습니다. 
다만 이러한 상대 좌표를 표현하는 방식이 조금 다릅니다. 단백질의 경우 Ca 프레임과 φ, ψ, ω 의 세 가지 torsion angle로 상대 좌표를 표현하지만 RNA의 경우 C1/C4//N/P 원자와 α, β, γ, δ, ε, ζ, χ의 일곱 가지 torsion angle로 상대 좌표를 표현하고 있습니다.

## RhoFold의 RNA 구조 예측 프로세스는 다음과 같습니다.
- RNA 서열이 입력되면 MSA를 수행하여 유사성이 높은 서열들을 찾고 비교합니다.
- 동시에 RNA-FM을 이용하여 각 염기에 대한 contextual embedding을 생성합니다.
- RNA-FM 임베딩과 MSA feature를 결합하여 Rhoformer encoder를 구성합니다.

![프로세스 다이어그램](/image/info/preview/rhofold_4.webp){center:400}

- 통합된 임베딩을 IPA 모듈에 전달하여 3D 좌표를 예측합니다.
- pLDDT 기반의 신뢰도 점수를 바탕으로 높은 신뢰도를 가진 구조를 최종적으로 예측합니다.

![신뢰도 예측](/image/info/preview/rhofold_5.webp){center:500}

## RhoFold의 특징
- **성능** : RhoFold는 24 종의 [RNA puzzles](https://www.rnapuzzles.org/)과 [CASP15 데이터셋](https://predictioncenter.org/casp15/)을 이용하여 전향적, 후향적으로 모델의 성능을 검증하였습니다. 전반적으로 기존 benchmark 모델 대비 훨씬 높은 정확도 (낮은 RMSD)를 보였습니다. 특히 붉은색으로 표시된 PZ34와 PZ38의 경우에는 다른 퍼즐과는 달리 정답 구조가 나중에 공개된 blind set이었음에도 불구하고 3차 구조를 꽤 정확하게 예측해내기도 하였습니다.

![성능 비교 차트](/image/info/preview/rhofold_6.webp){center:600}

- **속도** : 아주 짧은 런타임도 Rhofold의 주요한 장점입니다. Rhofold는 기존 방법들에 비하여 압도적으로 빠른 추론 속도를 보였습니다. 다만 MSA에 필요한 시간 (꽤 오래 걸립니다)은 여기 포함되지 않았고, MSA 의존성을 어떻게 벗어날 것인가에 대한 고민은 추후 필요해 보입니다.

![속도 비교](/image/info/preview/rhofold_7.webp){center:400}

- **언어 모델의 유용성** : 특정 템플레이트를 기반으로 구조를 예측하는 기존 방법론과의 성능을 비교해보면 Rhofold가 기존 템플레이트 기반 예측 방법에 준하는 정확도를 보여주는 것을 확인해볼 수 있습니다. template-free 분석은 짧은 런타임과, orphan 서열에 대한 예측 정확도에 많은 영향을 줍니다.

![템플레이트 비교](/image/info/preview/rhofold_8.webp){center:400}

- **실패 사례들** : 이미 완벽에 가까운 모델은 아닙니다. CASP15 일부 타겟 (R1156)에서는 미진한 정확도를 보이고, 추가적인 모델 개선이 필요한 것으로 보입니다.

![실패 사례](/image/info/preview/rhofold_9.webp){center:600}

## RhoFold : 앞으로의 숙제
- 여전히 남아 있는 MSA 의존성
    - 아직까지는 RhoFold의 예측을 MSA에 의존하고 있습니다. 이러한 구조는 orphan RNA에 대한 예측에 취약할 뿐만 아니라 MSA 계산에 필요한 시간 때문에 대규모의 예측이 어렵다는 한계가 존재합니다.
    - MSA를 보완하는 RNA-FM이 zero-shot 학습을 기반으로 더 정교화되면 MSA-free RNA 예측이 가능할 것으로 기대됩니다.
    - co-evolutio정보를 self-distillation으로 학습시키는 implicit MSA encoding 기법도 좋은 해결방법이 될 수 있겠습니다.
- 복합체 예측을 도와줄 수 있는 multi-chain IPA 확장형 아키텍쳐 개발도 필요합니다. Alphafold로부터 Alphafold-multimer가 개발되었던 방향을 따라가면 많은 도움이 될 것으로 생각합니다.
