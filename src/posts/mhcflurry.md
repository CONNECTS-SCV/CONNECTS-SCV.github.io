---
layout: post
title: "MHCflurry : MHC class I 분자와 펩타이드의 결합 친화도 (면역원성)를 예측하는 모델"
description: "MHC class I 분자와 펩타이드의 결합 친화도를 예측하여 암 신생항원 예측이나 면역원성 평가에 활용하는 딥러닝 모델입니다."
categories: [분석 모델]
tags: [MHCflurry, 면역원성 예측, 신생항원, MHC, 딥러닝]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
comment_id: "mhcflurry_main"
paired_post: "mhcflurry_en"
---
## 개요
---
MHCflurry는 MHC class I 분자와 펩타이드의 결합 친화도(binding affinity)를 기반으로 면역원성(immunogenicity)을 예측하는 딥러닝 모델입니다. 주로 암 신생항원 예측이나 면역원성 평가에 활용됩니다.

## 작동 원리
---
- 학습 데이터 : IEDB(Immune Epitope Database) 등 대규모 MHC–펩타이드 결합 실험 데이터
- 펩타이드 서열을 원-핫 인코딩을 통해 임베딩한 후 MLP 기반 회귀모델을 통해 학습을 진행합니다. 특히 MHC allele별로 별도의 파라미터를 적용할 수 있습니다.
- 위에서 학습된 가중치를 기반으로 새롭게 입력된 서열의 p-MHC 복합체 결합 친화도를 예측할 수 있습니다.

## 입력・출력・설정 옵션
---

**입력** :
- 펩타이드 서열 (FASTA 포맷)

**출력** : 결합 친화도 예측값 (IC50), Scores
- Affinity (IC50) : Peptide와 MHC의 Kd 값으로, 낮을수록 좋습니다.
- Best allele : 해당 펩타이드와 가장 잘 결합할 것으로 예측된 MHC allele
- Affinity percentile : 해당 펩타이드의 결합 예측도가 상위 몇 퍼센트 수준인지 (낮을수록 강한 binder)
- Processing score : 해당 펩타이드의 가공 (Degradation, TAP 수송 등) 확률 지표
- Presentation score : pMHC가 세포 표면에 제시될 가능성을 종합적으로 반영한 점수 (Affinity + processing score)
- Presentation percentile : 해당 펩타이드의 presentation score가 상위 몇% 수준인지 (낮을수록 강한 candidate)

**설정 옵션** :
- 중점적으로 보고 싶은 MHC allele type을 선정할 수 있습니다.

## 용도・차별 포인트
---

**용도** :
- MHCflurry는 백신 개발 과정에서 병원균의 항원 후보 펩타이드를 스크리닝 할 수 있는 도구입니다.
- 때로는 항암 백신 연구에서도 동일한 방식의 스크리닝이 진행될 수 있습니다.
- 반대로 항암 치료용 후보단백질이 몸 안에 들어가서 면역원성을 일으킬 가능성에 대해서도 예측할 수 있습니다.

**차별 포인트** :
- MHCflurry는 binding affinity 뿐만 아니라 최종적으로 presentation될 효율까지 평가할 수 있고, allele과의 최적의 조합을 찾아서 제공해준다는 특별함이 있습니다.

## 비교해 볼만한 모델
---
MHC II–펩타이드 결합 예측에 특화된 모델로 NetMHCIIpan을 사용해볼 수 있습니다. 다만 해당 분석 모듈은 학술적으로 이용할 경우에만 무료이고, 상업적으로 이용하려면 비용을 지불해야 합니다.

## 연계해 볼 만한 모델
---

- TCRmodel2를 사용하면 실제 pMHC의 복합체 구조를 예측해볼 수 있습니다.
- 이때 예측된 구조에 대하여 pMHC를 제약조건으로 TCR 결합부위를 엔지니어링하려면 RFdiffusion을 사용하면 됩니다.
- 디자인된 구조에 맞춰 TCR 서열을 최적화할 때에는 ProteinMPNN이 적절한 방법입니다.
- 마지막으로 Immunebuilder (TCR ver)를 사용하게 되면 최종적인 TCR 구조를 재구성할 수 있습니다.

---

[tool-button:MHCflurry]