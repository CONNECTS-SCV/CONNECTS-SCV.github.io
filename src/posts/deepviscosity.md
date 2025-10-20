---
layout: post
title: "DeepViscosity : 항체의 점도를 예측하는 이진분류 모델"
description: "단일클론 항체의 고농도 제형에서 점도를 예측하는 AI 모델"
categories: [analysis]
tags: [DeepViscosity, 항체, 점도, mAb, 제형개발]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---

## 개요
---

Deepviscosity는 단일클론 항체 (mAb)의 고농도 제형에서 점도 (viscosity)가 높을지 낮을지 서열 기반으로 예측(binary)할 수 있는 인공지능 모델입니다.

## 작동 원리
---

Deepviscosity 역시 DeepSP 알고리즘을 이용하여 항체 서열로부터 다음 세 가지 특징을 먼저 얻어야 합니다.

::list-callout
- SAP(Spatial Aggregation Propensity) :
Val, Ile, Leu, Phe, Trp, Tyr, Met과 같은 소수성 아미노산에 영향을 받는 수치로, 항체의 aggregation risk를 증가시킵니다.
- SCM(Surface Charge Map)_pos :
Lys, Arg, His와 같은 양전하 아미노산에 영향을 받는 수치로, 항체의 비특이적인 결합을 유도하고 aggregation이나 viscosity를 높이는 안 좋은 지표입니다.
- SCM(Surface Charge Map)_neg :
Asp, Glu와 같은 음전하 아미노산에 영향을 받는 수치로, 비특이적인 결합이나, 점도 등의 위험성을 오히려 완화해주는 좋은 지표입니다.
::/list-callout
위 값을 정규화하여 스케일링한 후 앙상블 ANN을 이용하여 평균과 표준편차를 산출합니다. 이때 평균확률이 0.5를 넘어가게 되면 20cP 이상의 점도를 갖는 고점도 항체로 분류되고, 0.5미만일 경우에는 20cP 이하의 점도를 가지는 저점도 항체로 분류됩니다. 본 모델은 229개 항체의 점도 데이터 실험값을 기반으로 학습되었습니다.

## 입력・출력・설정 옵션
---

**입력** : 항체 서열 (중쇄, 경쇄)

**출력** : 평균 확률 (0.5 이상일 경우 고점도로 분류)

**설정 옵션** : 사용자 설정 옵션 없음

## 용도・차별 포인트
---

**용도** :
- 후보 항체의 초기 스크리닝에 사용됩니다. 본격적인 시험 전에 점도 문제가 있을만한 후보를 걸러내고 제형을 최적화하는 과정에서 생길 수 있는 잠재적인 위험을 제거할 수 있습니다.

**차별 포인트** :
- Deepviscosity는 구조 정보 없이 서열만으로 점도를 예측할 수 있는 좋은 모델입니다. 앙상블 예측을 사용하기 때문에 더 높은 신뢰도를 가져갈 수 있습니다.

## 비교해 볼만한 모델
---

- NetSolP와 같은 단백질 용해도 예측 모델과 비교해볼 수 있습니다. 다만 NetsolP는 E coli 발현 용해도를 예측하는 모델이기 때문에 주로 포유류 세포에서 발현되는 항체의 용해도와는 괴리가 있을 수 있습니다.
- Protein-Sol과 같이 단백질의 intrinsic stability를 측정하는 모델과도 비교해볼 수 있습니다. 제형 조건에 따라 용해도가 개선될 여지가 있을지, 아니면 단백질이 근본적으로 불용성인지 가늠해볼 수 있는 모델입니다.
- AbDev에서 제공하는 viscosity 관련 수치들과 함께 비교해볼 수도 있습니다.

## 연계해 볼 만한 모델
---

- Aggrescan3D와 같이 항체의 응집 경향성을 확인하고, 응집에 관여하는 서열 위치를 찾아주는 모델과 연계하여 사용하면 점도 문제를 해결할 수 있을지도 모릅니다.
- RFantibody를 통해서 설계하고 최적화한 항체에 대하여 Deepviscosity를 이용하여 점도를 확인해보는 것도 좋은 방법이 될 수 있습니다.

---

[tool-button:DeepViscosity]