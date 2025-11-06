---
layout: post
title: "Deepviscosity : 고점도로 인한 문제가 보고 된 항체와 그렇지 않은 항체의 결과 값 비교"
description: "AI 기반 항체 점도 예측 모델 DeepViscosity를 사용하여, 실제 점도 문제가 보고된 항체와 그렇지 않은 항체의 예측 결과를 비교 분석"
categories: [analysis]
tags: [DeepViscosity, 항체 점도, Antibody Viscosity, Trastuzumab, Omalizumab, Bevacizumab, 고농도 제형, AI 신약 개발]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/deepviscosity_1.webp" 
comment_id: "deepviscosity_detail"
---

![image.png](/image/info/detail/deepviscosity_1.webp){center:600}

항체 치료제 개발에서는 **고농도 제형에서의 점도 문제**가 중요한 과제로 꼽힙니다. 점도가 지나치게 높으면 주사 투여가 어렵고 안정성에도 영향을 주기 때문에, 초기 단계에서 이를 예측할 수 있는 전산 도구의 필요성이 큽니다.

**DeepViscosity**는 항체 서열로부터 파생된 특성과 앙상블 신경망 모델을 활용해, 고농축 용액에서의 점도 수준을 저점도(≤20 cP)와 고점도(>20 cP)로 분류해 예측하는 도구입니다.

이번 글에서는 DeepViscosity를 활용해, 점도 문제가 보고된 **Trastuzumab(1N8Z)** 과 그렇지 않은 **Omalizumab, Bevacizumab(2XA8, 4X7S, 1BJ1, 6BFT)** 의 결과를 비교해 보겠습니다. 이를 통해 모델이 실제 사례에서 얼마나 직관적으로 점도 리스크를 구분할 수 있는지 살펴보겠습니다.

# 1 사용된 도구

---

- **DeepViscosity** 항체의 점도를 예측하는 이진분류 모델
- **ANARCI** 항체의 Heavy chain과 Light chain 서열에서 CDR 구간을 찾아내고, 이를 일관된 표준 형식으로 정리해주는 도구

# 2 Deepviscosity **설치 방법**

DeepViscosity는 항체 서열 기반으로 **고농축 제형 점도(Viscosity) 리스크**를 예측하는 도구입니다. 아래 절차에 따라 Linux 환경에서 설치하고 실행할 수 있습니다.

## 2.1 **DeepViscosity** 저장소 다운로드

---

먼저 GitHub 저장소를 클론합니다.

```bash
git clone https://github.com/Lailabcode/DeepViscosity.git
cd DeepViscosity
```

## 2.2 Conda 환경 생성 및 활성화

---

DeepViscosity는 Python 3.9 버전에서 테스트되었습니다. 새 환경을 만들고 활성화합니다.

```bash
conda create -n deepViscosity python=3.9.13
source activate deepViscosity
```

## 2.3 필수 패키지 설치

---

```bash
# DeepViscosity 실행에 필요한 Python 패키지
pip install keras==2.11.0 tensorflow-cpu==2.11.0 scikit-learn==1.0.2 pandas numpy==1.26.4 joblib dill

# ANARCI 설치
conda install -c bioconda anarci  
```

# 3 기본 사용 용법

## 3.1 입력 파일 준비

---

먼저 분석할 항체 서열을 **`DeepViscosity_input.csv`** 형식으로 작성합니다. CSV 파일은 항체의 **ID, Heavy chain, Light chain** 정보를 포함해야 합니다.

```text 
ID,Heavy,Light
Trastuzumab,EVQLVESGGGLV...,DIQMTQSPSSLS...
Omalizumab,EVQLVQSGAEVL...,DIQMTQSPSSLS...
Bevacizumab,EVQLVESGGGLV...,DIVMTQSPLSLPV...
```

## 3.2 예측 실행

---

입력 파일이 준비되면, 제공된 파이썬 스크립트를 실행합니다.

```bash
python deepviscosity_predictor.py -i DeepViscosity_input.csv
```

# 4 데이터 선정

## 1. Trastuzumab

![image.png](/image/info/detail/deepviscosity_2.webp){center:400}

- **구조**: `1N8Z`
- **UniProt / Target**: HER2 수용체 (UniProt P04626)
- **분자량**: 일반적인 IgG1 항체 수준, 약 145kDa 정도
- **제형 안정성**: : 180mg/mL에서 8cP의 점도가 보고 됨

---

### 2. Omalizumab

![image.png](/image/info/detail/deepviscosity_3.webp){center:400}

- **구조**: `2XA8` , `4X7S`
- **Target**: IgE (면역글로불린 E)
- **분자량**: IgG1 수준, 약 150kDa 내외
- **제형 안정성**: 180mg/mL에서 176cP의 점도, 150mg/mL 농도에서 90cP의 점도가 보고 됨

---

### 3. Bevacizumab

![image.png](/image/info/detail/deepviscosity_4.webp){center:400}

- **구조**: `1BJ1` , `6BFT`
- **Target**: VEGF-A (UniProt P15692)
- **분자량**: 약 149kDa 수준
- **제형 안정성**: 150mg/mL에서 32cP의 점도, 200mg/mL 농도에서 99cP의 점도가 보고 됨

## 4.3 이 두 물질을 선정 한 이유?

---

이번 예제에서는 **Trastuzumab**, **Omalizumab**, **Bevacizumab** 세 항체를 선정했습니다. Trastuzumab은 낮은 점도(8cP)로, Omalizumab은 매우 높은 점도(최대 176cP)로, Bevacizumab은 중간 점도(32–99cP)로 알려져 있어 점도 수준별 대표 사례로 적합하다고 보여집니다.

이들을 통해 DeepViscosity 모델의 저점도·고점도 판별 능력을 균형 있게 평가해보려 합니다.

## 5 예측하기

## 5.1 Linux CLI 이용

---

### 입력 파일 준비

```text
ID,Heavy,Light
Trastuzumab,EVQLVESGGGLV...,DIQMTQSPSSLS...
Omalizumab,EVQLVQSGAEVL...,DIQMTQSPSSLS...
Bevacizumab,EVQLVESGGGLV...,DIVMTQSPLSLPV...
```

### 예측 실행

입력 파일이 준비되면, 제공된 파이썬 스크립트를 실행합니다.

```bash
python deepviscosity_predictor.py -i DeepViscosity_input.csv
```

## 5.3 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curieus.net/Analysis/deepviscosity
```

화면에는 점도를 분석 할 항체의 정보를 입력 할 다양한 방식이 준비되어있습니다. PDB 파일 업로드 또는 RCSB ID를 입력하면, 구조로부터 자동으로 항체의 서열을 추출하여 입력파일을 생성합니다. 또한 항체의 서열을 직접 입력할 수 있습니다.

![image.png](/image/info/detail/deepviscosity_5.webp){center:880}

여기에 분석할 항체에 대한 정보를 입력 한 후 **분석 시작** 버튼을 누르면 **DeepViscosity** 도구가 입력된 정보로부터 항체의 점도를 예측합니다.

# 6 분석 결과

## 6.1 **DeepViscosity** 예측 결과 요약

---

| Name | RCSB | Prob_Mean | Prob_Std | DeepViscosity_classes |
| --- | --- | --- | --- | --- |
| Trastuzumab | 1N8Z | 0.361 | 0.106 | 0 |
| Omalizumab | 2XA8 | 0.514 | 0.108 | 1 |
| Omalizumab | 4X7S | 0.514 | 0.108 | 1 |
| Bevacizumab | 1BJ1 | 0.547 | 0.098 | 1 |
| Bevacizumab | 6BFT | 0.671 | 0.095 | 1 |

### Trastuzumab

- 예측 평균 점수: **0.361**
- 클래스: **0 (저점도)**
- 실제 보고된 점도도 낮음 (8cP @180 mg/mL)

### Omalizumab

- 예측 평균 점수: **0.514** (두 구조 동일)
- 클래스: **1 (고점도)**
- 실제 보고된 점도: **176cP @180 mg/mL**, **90cP @150 mg/mL**

### Bevacizumab

- 예측 평균 점수: **0.547 (1BJ1)** / **0.671 (6BFT)**
- 클래스: **1 (고점도)**
- 실제 보고된 점도: **32cP @150 mg/mL**, **99cP @200 mg/mL**

## 6.3 종합 평가

---

- DeepViscosity 모델은 **실제 점도 수준과 일관된 예측 결과**를 보여주며, 고점도 항체(Omalizumab, Bevacizumab)와 저점도 항체(Trastuzumab)를 잘 구분해냄.
- 특히 **Prob_Mean**이 높을수록 고점도 경향이 뚜렷하게 나타나, 모델의 점도 민감도가 신뢰할 만함을 시사함.

# 7 마치며

---

고농축 제형 항체의 점도 문제는 실제 제형 개발 단계에서 약물 전달 효율성과 환자 순응도에 큰 영향을 미치는 핵심 이슈입니다. 하지만 실험적으로 모든 후보를 확인하는 것은 비용과 시간이 많이 들기 때문에, **DeepViscosity와 같은 전산 기반 도구의 활용**은 초기 스크리닝 단계에서 매우 유용합니다.

이번 분석에서는 **Trastuzumab(저점도)**, **Omalizumab(고점도)**, **Bevacizumab(중간~고점도)** 사례를 비교함으로써, DeepViscosity가 실제 데이터를 기반으로 **직관적이고 타당한 예측 결과를 제공**함을 확인할 수 있었습니다.

앞으로도 항체 기반 치료제의 물성 예측에 있어 이러한 AI 기반 도구가 **개발 리스크를 줄이고, 최적 후보 선정을 가속화하는 데 큰 역할**을 하게 될 것입니다.

더 나아가 CURIE 플랫폼에서는 별도의 환경 설정 없이도 웹 기반 DeepViscosity 분석이 가능하므로, 초기 항체 설계 단계에서 간편하게 점도 리스크를 평가해볼 수 있습니다.

# 8 Reference

---

- [Github DeepViscosity](https://github.com/Lailabcode/DeepViscosity)
- [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1389172321002437)
- [PubMed Central(PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11262234/)
- [Qprotyn](https://www.qprotyn.com/post/qprotyn-bevacizumab)
- Curieus : [DeepViscosity](https://curieus.net/Analysis/deepviscosity)

---

[tool-button:DeepViscosity]
