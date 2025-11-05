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

![RhoFold 메인 이미지](/image/info/preview/rhofold_1.webp){center:880}[언어 모델 기반 RNA 3차 구조 예측 방법 : RhoFold]

## 서론

**단백질 분야**의 경우 **Rosetta,** **AlphaFold** 등을 중심으로 이미 오래전부터 3차 구조 중심의 예측이 활발하게 발전해왔습니다. 반면 **RNA**의 경우에는 염기쌍의 결합 패턴을 통해 Hairpin이나 Loop 등의 **2차 구조를** 예측하는 형태로 연구가 진행되어 왔습니다. 대표적인 2차 구조 예측 알고리즘의 예제로는 ViennaRNA (RNAfold)나 CONTRAfold 등이 있습니다.

최근 단백질의 구조 예측 분야에서 딥러닝 기반의 **AF2**가 큰 성공을 거두면서, RNA 구조 예측에서도 딥러닝 기반의 접근법이 본격적으로 시도되기 시작했는데요. 그 대표적인 예제가 바로 오늘 소개드릴 2024년 11월 Nature Methods에 게재된 **RhoFold**, 홍콩대학교 Yu Li 연구팀이 개발한 **언어 모델 기반 RNA 3차 구조 예측 모델**입니다.

기존 2차 구조 기반 모델들은 RNA의 기본적인 구조를 파악하는데는 유용했지만 유전병 등에서 원인 분자로 작용하는 Structured RNA의 기능이나 작용 기전을 이해하기에는 한계가 있었습니다. RNA 3차 구조에 대한 이해도가 깊어지면 이러한 연구뿐만 아니라 최근 각광을 받고 있는 RNA 표적 저분자 화합물이나 ASO 등의 개발에도 많은 도움이 될 것이라 생각합니다.

RhoFold 모델의 핵심적인 부분에 대하여 간략하게 소개 드려볼까 합니다.

## 모델 핵심

위쪽이 **AlphaFold**의 모델 구조이고, 아래쪽이 **RhoFold**의 모델 구조입니다.

전체적으로는 AlphaFold의 모델 구조를 기반으로 하고 있지만, 두 모델의 접근 방식에는 중요한 차이가 있습니다. AlphaFold는 **MSA(다중 서열 정렬)** 를 통해 서로 유사한 서열들을 비교함으로써, 서열 간의 관계와 문맥적 정보를 포괄적으로 학습합니다.

반면 RhoFold는 이러한 MSA 기반 접근에 더해 **RNA 전용 언어 모델인 RNA-FM**을 활용합니다. 이를 통해 서열 수준의 통계적 규칙과 문맥을 보완하여, MSA만으로는 충분히 포착하기 어려운 RNA의 구조적 특성을 반영합니다. RNA의 경우 단백질에 비해 서열이 짧고 구조적 다양성이 높으며 진화적 보존성이 약하기 때문에 MSA만으로는 충분한 정보를 얻기 어렵기 때문입니다.

참고로, Meta에서 개발한 단백질 전용 언어 모델 [ESM](https://github.com/facebookresearch/esm)과 해당 언어모델만을 기반으로 단백질의 구조를 예측하는 **ESMfold**도 존재하는데, 이에 대해서는 추후 별도의 글을 통해 소개드려 보겠습니다.

![AlphaFold 모델 구조](/image/info/preview/rhofold_2.webp){center:880}[AlphaFold 모델 구조]

![RhoFold 모델 구조](/image/info/preview/rhofold_3.webp){center:880}[RhoFold 모델 구조]

### 언어 모델 (RNA-FM)

**RNA-FM**은 **MSA** 단독으로는 충분히 학습하기 어려운 RNA의 언어적 특징을 이해하기 위해 사용되는 RNA 전용 언어 모델입니다. 이 모델은 해석 가능한 RNA 연구를 목표로 홍콩대학교 Yu Li 연구팀에서 직접 개발했으며, 약 **80만 종의 RNA**에서 추출된 **2300만 개 이상의 서열을 학습**하여 염기 간의 문맥 정보를 self-attention 기반으로 파악했습니다.

학습에 사용된 데이터의 구성은 **structured RNA**(rRNA, tRNA, snRNA, riboswitch 등)가 약 **70%, non-structured RNA** (mRNA 등)가 **약 30%** 정도 사용된 것으로 보고되었습니다. 이러한 학습 과정을 통해 RNA-FM은 MSA만으로는 충분히 반영되지 않는 RNA 고유의 문맥적·통계적 규칙을 보완하고 있습니다.

예를 들어, 특정 서열 패턴인 GNRA가 loop 구조와 연관되어 있다는 식의 서열-구조 연관성을 학습함으로써, RhoFold가 RNA의 입체적 형태를 더 정확히 이해하도록 도와줍니다. 이렇게 RNA-FM에서 생성된 언어적 관계성은 MSA feature와 결합되어, 이후 RhoFold의 핵심 인코더인 Rhoformer로 통합됩니다.

### IPA

통합된 임베딩은 IPA(Invariant Point Attention)라는 알고리즘을 통해 공간적 위치 정보를 부여받습니다. 이 모듈은 AlphaFold에서도 동일하게 사용되었던 구성 요소로, 분자의 **절대 좌표**가 아니라 **상대 좌표**를 기반으로 학습을 진행합니다. 이를 통해 모델은 분자의 회전이나 이동과 관계없이 3차원 구조를 일관성 있게 학습하고 표현할 수 있습니다.

다만 이러한 상대 좌표를 표현하는 방식에는 단백질과 RNA 사이에 차이가 있습니다. 단백질의 경우 Cα 프레임과 **φ, ψ, ω 의 세 가지 torsion angle**로 상대 좌표를 표현하지만 RNA의 경우 C1'/C4'/N/P 원자와 **α, β, γ, δ, ε, ζ, χ의 일곱 가지 torsion angle**로 상대 좌표를 표현하고 있습니다.

## RhoFold의 RNA 구조 예측 프로세스는 다음과 같습니다.
- **RNA 서열이 입력되면 MSA를 수행하여 유사성이 높은 서열들을 찾고 비교합니다.**
- **동시에 RNA-FM을 이용하여 각 염기에 대한 contextual embedding을 생성합니다.**
- **RNA-FM 임베딩과 MSA feature를 결합하여 Rhoformer encoder를 구성합니다.**

![프로세스 다이어그램](/image/info/preview/rhofold_4.webp){center:400}

- **통합된 임베딩을 IPA 모듈에 전달하여 3D 좌표를 예측합니다.**
- **pLDDT 기반의 신뢰도 점수를 바탕으로 높은 신뢰도를 가진 구조를 최종적으로 예측합니다.**

![신뢰도 예측](/image/info/preview/rhofold_5.webp){center:500}

## RhoFold의 특징
- **성능** : RhoFold는 24종의 [RNA puzzles](https://www.rnapuzzles.org/)과 [CASP15 데이터셋](https://predictioncenter.org/casp15/)을 이용하여 전향적, 후향적으로 모델의 성능을 검증하였습니다. 전반적으로 기존 benchmark 모델 대비 훨씬 높은 정확도 (낮은 RMSD)를 보였습니다. 특히 붉은색으로 표시된 PZ34와 PZ38의 경우에는 다른 퍼즐과는 달리 정답 구조가 나중에 공개된 blind set이었음에도 불구하고 3차 구조를 꽤 정확하게 예측해내기도 하였습니다.

![성능 비교 차트](/image/info/preview/rhofold_6.webp){center:500}

- **속도** : 아주 짧은 런타임도 RhoFold의 주요한 장점입니다. RhoFold는 기존 방법들에 비하여 압도적으로 빠른 추론 속도를 보였습니다. 다만 MSA에 필요한 시간 (꽤 오래 걸립니다)은 여기 포함되지 않았고, MSA 의존성을 어떻게 벗어날 것인가에 대한 고민은 추후 필요해 보입니다.

![속도 비교](/image/info/preview/rhofold_7.webp){center:400}

- **언어 모델의 유용성** : 특정 템플레이트를 기반으로 구조를 예측하는 기존 방법론과의 성능을 비교해보면 RhoFold가 기존 템플레이트 기반 예측 방법에 준하는 정확도를 보여주는 것을 확인해볼 수 있습니다. template-free 분석은 짧은 런타임과, orphan 서열에 대한 예측 정확도에 많은 영향을 줍니다.

![템플레이트 비교](/image/info/preview/rhofold_8.webp){center:400}

- **실패 사례들** : 이미 완벽에 가까운 모델은 아닙니다. CASP15 일부 타겟 (R1156)에서는 미진한 정확도를 보이고, 추가적인 모델 개선이 필요한 것으로 보입니다.

![실패 사례](/image/info/preview/rhofold_9.webp){center:600}

## RhoFold : 앞으로의 숙제
- **여전히 남아 있는 MSA 의존성**
    - 아직까지는 RhoFold의 예측을 MSA에 의존하고 있습니다. 이러한 구조는 orphan RNA에 대한 예측에 취약할 뿐만 아니라 MSA 계산에 필요한 시간 때문에 대규모의 예측이 어렵다는 한계가 존재합니다.
    - MSA를 보완하는 RNA-FM이 **zero-shot 학습을 기반으로 더 정교화**되면 MSA-free RNA 예측이 가능할 것으로 기대됩니다.
    - co-evolution 정보를 self-distillation으로 학습시키는 implicit MSA encoding 기법도 좋은 해결방법이 될 수 있겠습니다.
- 복합체 예측을 도와줄 수 있는 **multi-chain IPA 확장형 아키텍쳐 개발**도 필요합니다. AlphaFold로부터 AlphaFold-multimer가 개발되었던 방향을 따라가면 많은 도움이 될 것으로 생각합니다.

RhoFold model을 통해 RNA 3차 구조를 편하고 빠르게 예측해보실 수 있도록 조만간 업데이트가 있을 예정이니 참고 부탁드립니다.
