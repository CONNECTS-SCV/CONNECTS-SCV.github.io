---
layout: post
title: "DLKcat : Paraoxon에 대한 에스터 분해 반응에 대해 효소 기원에 따른(세균, 인간)효소 활성 비교"
description: "AI 기반 효소 활성 예측 모델 DLKcat을 사용하여, 동일 기질(Paraoxon)에 대한 세균 유래 효소와 인간 유래 효소의 촉매 효율(kcat) 차이를 비교 분석"
categories: [analysis]
tags: [DLKcat, kcat, 효소 활성 예측, Enzyme Kinetics, Paraoxon, Parathion hydrolase, PON1, AI 효소 설계]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/dlkcat_1.webp"
comment_id: "dlkcat_detail" 
---

![image.png](/image/info/detail/dlkcat_1.webp){center:400}

단백질이 특정 화합물을 얼마나 빠르게 분해하거나 변환할 수 있는지를 나타내는 지표가 바로 **kcat (turnover number)** 입니다. 하지만 이 값을 실험적으로 구하기란 쉽지 않습니다. 복잡한 정제, 반응계 구축, 시간 소모적인 측정 과정이 필요하지요. 이번 글에서는 이러한 한계를 극복하기 위해 개발된 **DLKcat (Deep Learning-based kcat predictor)** 을 소개합니다.

DLKcat은 **효소 서열 정보와 기질 구조(SMILES)** 를 입력으로 받아 해당 효소의 촉매 활성(kcat)을 예측하는 AI 모델입니다. 특히 본 포스트에서는 DLKcat을 이용해 **Paraoxon(파라옥손)** 의 **에스터 분해 반응(ester hydrolysis)** 을 예제로 다루며, 같은 반응이라도 **효소 기원(세균 vs 인간)** 에 따라 **예측 활성(kcat)** 이 어떻게 달라지는지를 비교해보겠습니다.

이 과정을 통해 DLKcat이 **서열 차이만으로 효소 반응성을 구분해내는 원리**를 이해하고 AI 기반 효소 설계의 새로운 가능성을 살펴보겠습니다.

# 1 사용된 도구

---

- **DLKcat** 효소 반응 속도 상수(kcat) 예측을 위한 딥러닝 기반 도구

# 2 **DLKcat 설치 방법**

**DLKcat (Deep Learning-based kcat predictor)**은 단백질 서열(Protein Sequence)과 화합물 구조(SMILES)를 입력받아 효소의 **촉매 전환율(kcat)** 을 예측하는 AI 기반 도구입니다.

DLKcat은 크게 두 구성 요소로 나뉩니다:

- **DeeplearningApproach** → 딥러닝 기반 kcat 예측 모델
- **BayesianApproach** → 예측된 kcat을 활용하여 enzyme-constrained 모델(ecGEMs)을 자동 구성

이번 튜토리얼에서는 **딥러닝 기반 kcat 예측(DeeplearningApproach)** 만 다룹니다.

## 2.1 시스템 요구사항

---

### Python 환경

- **Python 3.7.6** (Anaconda 환경 권장)
- GPU가 있다면 CUDA 기반 **PyTorch** 가속 가능

### 필수 라이브러리 버전

| 패키지 | 권장 버전 |
| --- | --- |
| PyTorch | 1.4.0 |
| scikit-learn | 0.23.2 |
| Biopython | 1.78 |
| RDKit | 2020.09.1 |
| seaborn | 0.11.0 |
| matplotlib | 3.3.2 |
| pandas | 1.1.3 |
| scipy | 1.5.2 |
| numpy | 1.20.2 |

## 2.2 설치 단계

---

### 저장소 다운로드

```bash
# DLKcat 저장소 클론
git clone https://github.com/SysBioChalmers/DLKcat.git
cd DLKcat
```

### 가상환경 생성 및 활성화

```bash
# Anaconda 환경 권장
conda create -n dlkcat python=3.7.6
conda activate dlkcat
```

### 필수 패키지 설치

```bash
# 주요 의존성 설치
pip install numpy requests torch torchvision rdkit-pypi scikit-learn
```

# 3 기본 사용 용법

## 3.1 데이터 준비

---

### 예측 데이터 준비

DLKcat의 입력은 **단백질 서열 + 기질(SMILES)** 입니다.

패키지 내부의 예제 입력 파일(`input.tsv`)을 기반으로 형식을 확인할 수 있습니다.

```bash
cd DeeplearningApproach
unzip Data/input.zip
cd Code/example
```

예제 입력(`input.tsv`)은 다음과 같습니다

| Protein_ID | Sequence | Substrate_Name | Substrate_SMILES |
| --- | --- | --- | --- |
| P12345 | MKTAYIAKQRQISFVKSHFSRQD... | Paraoxon | CCOP(=O)(OCC)Oc1ccc(cc1)N+[O-] |

Substrate_SMILES(기질 구조)는 SMILES 문자열로 입력하는 것이 권장됩니다. 찾기 어려운 경우 **Substrate_Name**만 입력하고 SMILES 열은 비워두어도 됩니다.

## 3.2 예측 실행

---

### 기본 예측 명령

```bash
# 학습된 딥러닝 모델을 이용한 예측
python prediction_for_input.py input.tsv
```

실행 후 결과는 같은 디렉토리에 **`output.tsv`** 로 저장됩니다.

# 4 데이터 선정

## 4.1 세균 유래 효소 — Parathion hydrolase

---

![image.png](/image/info/detail/dlkcat_2.webp){center:400}

- **이름**: Parathion hydrolase (phosphotriesterase 계열)
- **식별자**: UniProt **P0A434**
- **서열(요약)**: `MQTRRVVLKSAAAAGTLLGGLAGCASVAGSIGTGDRINTVRGPITISEAGFTLTHEHICGSSAGFLRAWPEFFGSRKALAEKAVRGLRRARAAGVRTIVDVSTFDIGRDVSLLAEVSRAADVHIVAATGLWFDPPLSMRLRSVEELTQFFLREIQYGIEDTGIRAGIIKVATTGKATPFQELVLKAAARASLATGVPVTTHTAASQRDGEQQAAIFESEGLSPSRVCIGHSDDTDDLSYLTALAARGYLIGLDHIPHSAIGLEDNASASALLGIRSWQTRALLIKALIDQGYMKQILVSNDWLFGFSSYVTNIMDVMDRVNPDGMAFIPLRVIPFLREKGVPQETLAGITVTNPARFLSPTLRAS`

**역할 및 특징**

이 효소는 **유기인계 살충제(파라티온, 파라옥손 등)** 의 인산트리에스터 결합을 가수분해하는 대표적인 세균 효소입니다.

토양이나 수계 환경에 서식하는 미생물에서 주로 발견되며, **오염물질 분해(비오리미디에이션)** 용도로 널리 연구되고 있습니다. 또한 촉매 효율이 높은 다양한 변이체가 보고되어 있어 산업적 활용 가능성도 높습니다.

## 4.2 인간 유래 효소 — Serum paraoxonase/arylesterase 1 (PON1)

---

![image.png](/image/info/detail/dlkcat_3.webp){center:400}

- **이름**: Serum paraoxonase/arylesterase 1 (PON1)
- **식별자**: UniProt **P27169**
- **서열(요약)**: `MAKLIALTLLGMGLALFRNHQSSYQTRLNALREVQPVELPNCNLVKGIETGSEDLEILPNGLAFISSGLKYPGIKSFNPNSPGKILLMDLNEEDPTVLELGITGSKFDVSSFNPHGISTFTDEDNAMYLLVVNHPDAKSTVELFKFQEEEKSLLHLKTIRHKLLPNLNDIVAVGPEHFYGTNDHYFLDPYLQSWEMYLGLAWSYVVYYSPSEVRVVAEGFDFANGINISPDGKYVYIAELLAHKIHVYEKHANWTLTPLKSLDFNTLVDNISVDPETGDLWVGCHPNGMKIFFYDSENPPASEVLRIQNILTEEPKVTQVYAENGTVLQGSTVASVYKGKLLIGTVFHKALYCEL`

**역할 및 특징**

PON1은 **혈청 내 칼슘 의존성 아릴에스테라제/파라옥소나제**로 지질대사와 항산화 조절에 관여하는 효소입니다. **Paraoxon과 같은 유기인계 기질**에 대한 가수분해 활성이 잘 알려져 있으며, 인체 독성 해독 반응과 관련되어 생리학적 중요성이 높습니다. 이 효소는 DLKcat 모델을 통해 **생물 기원에 따른 반응성 차이**를 살펴보기에 적합한 비교군입니다.

## 4.3 기질 (공통) — Paraoxon

---

![image.png](/image/info/detail/dlkcat_4.webp){center:400}

- **반응 종류**: 에스터(포스포트리에스터) 가수분해 (Ester Hydrolysis)
- **SMILES**: `CCOP(=O)(OCC)Oc1ccc([N+](=O)[O-])cc1`

**설명**

Paraoxon은 살충제 **Parathion의 활성 대사산물**로 알려져 있으며, 효소 반응을 통해 **p-Nitrophenol**과 **Diethyl phosphate**로 분해됩니다. 화학적 반응성이 뚜렷하고 반응 산물이 쉽게 검출되기 때문에,

실험 및 모델링 모두에서 표준 기질로 자주 사용됩니다.

## 4.3 선정 이유 요약

이번 예제는 **동일한 기질(Paraoxon)** 에 대해 **효소의 기원만 다른 두 효소(세균 Parathion hydrolase, 인간 PON1)** 를 비교함으로써, 단백질 서열 차이가 예측된 **촉매 전환율(kcat)** 값에 어떤 영향을 미치는지를 명확히 살펴보기 위해 설계되었습니다.

세균 유래 Parathion hydrolase는 **환경 정화(비오리미디에이션)** 분야에서 인간 유래 PON1은 **생리적 해독 및 독성학적 반응** 연구에서 중요한 효소로 각각 폭넓게 활용되고 있습니다. 두 효소 모두 연구 축적이 풍부하고 실험적 근거가 명확하여 DLKcat의 예측 결과를 **생물학적 의미와 연계하여 해석하기에 적합한 모델 시스템**입니다.

또한 DLKcat은 **단백질 서열과 기질의 SMILES 문자열만으로 예측을 수행**하기 때문에 이번 두 효소 데이터는 별도의 전처리 과정 없이 즉시 활용 가능한 **이상적인 입력 데이터셋**입니다.

더불어 Paraoxon은 BRENDA, SABIO-RK 등 주요 생화학 데이터베이스에서 **표준 기질로 널리 사용되는 대표 물질**로 이후 다른 유기인계 화합물(예: Parathion, Diazinon 등)이나 종(세균, 포유류 등)으로 분석을 손쉽게 확장할 수 있다는 점에서도 높은 재현성과 활용성을 지닙니다.

# 5 예측하기

## 5.1 Linux CLI

---

### 예제 입력 파일 생성 (input.tsv)

DLKcat의 예측 스크립트(`prediction_for_input.py`)는 **탭 구분 TSV**를 입력으로 받습니다. 다음 내용을 **`DLKcat/DeeplearningApproach/Code/example/input.tsv`** 로 저장해 주세요.

```text
Protein_ID	Sequence	Substrate_Name	Substrate_SMILES

Parathion_hydrolase_P0A434	MQTRRVVLKSAAAAGTLLGGLAGCASVAGSIGTGDRINTVRGPITISEAGFTLTHEHICGSSAGFLRAWPEFFGSRKALAEKAVRGLRRARAAGVRTIVDVSTFDIGRDVSLLAEVSRAADVHIVAATGLWFDPPLSMRLRSVEELTQFFLREIQYGIEDTGIRAGIIKVATTGKATPFQELVLKAAARASLATGVPVTTHTAASQRDGEQQAAIFESEGLSPSRVCIGHSDDTDDLSYLTALAARGYLIGLDHIPHSAIGLEDNASASALLGIRSWQTRALLIKALIDQGYMKQILVSNDWLFGFSSYVTNIMDVMDRVNPDGMAFIPLRVIPFLREKGVPQETLAGITVTNPARFLSPTLRAS	Paraoxon	CCOP(=O)(OCC)Oc1ccc([N+](=O)[O-])cc1

PON1_P27169	MAKLIALTLLGMGLALFRNHQSSYQTRLNALREVQPVELPNCNLVKGIETGSEDLEILPNGLAFISSGLKYPGIKSFNPNSPGKILLMDLNEEDPTVLELGITGSKFDVSSFNPHGISTFTDEDNAMYLLVVNHPDAKSTVELFKFQEEEKSLLHLKTIRHKLLPNLNDIVAVGPEHFYGTNDHYFLDPYLQSWEMYLGLAWSYVVYYSPSEVRVVAEGFDFANGINISPDGKYVYIAELLAHKIHVYEKHANWTLTPLKSLDFNTLVDNISVDPETGDLWVGCHPNGMKIFFYDSENPPASEVLRIQNILTEEPKVTQVYAENGTVLQGSTVASVYKGKLLIGTVFHKALYCEL	Paraoxon	CCOP(=O)(OCC)Oc1ccc([N+](=O)[O-])cc1
```

- 헤더는 `Protein_ID	Sequence	Substrate_Name	Substrate_SMILES` 순서로 유지합니다.
- 구분자는 **탭(tab)** 입니다. 공백이나 콤마를 사용하지 않아요.
- 서열은 줄바꿈 없이 한 줄로 입력합니다.

### 예측 실행

예측 스크립트는 **DeeplearningApproach/Code/example** 폴더에서 실행합니다.

```bash
cd DLKcat/DeeplearningApproach
unzip Data/input.zip   # 내부 예제/모델 경로가 필요한 경우

cd Code/example
python prediction_for_input.py input.tsv
```

정상 실행 시 **동일 폴더**에 `output.tsv` 파일이 생성됩니다.

### 출력 결과 확인 및 kcat 비교

생성된 `output.tsv`에는 각 입력 행에 대한 **예측 kcat** 이 포함되며 값이 클수록 해당 조건(서열, 기질)에서 **전환율(kcat)** 이 높음을 의미합니다.

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **웹페이지 GUI**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/dlkcat
```

화면에는 효소 단백질의 아미노산 서열과 효소와 반응하는 기질의 SMILES 문자열을 입력하는 창이 준비되어 있습니다.

![image.png](/image/info/detail/dlkcat_5.webp){center:880}

여기에 분석할 단백질의 서열을 입력 한 후 기질의 SMILES 문자열을 입력하면 됩니다.

```text
MQTRRVVLKSAAAAGTLLGGLAGCASVAGSIGTGDRINTVRGPITISEAGFTLTHEHICGSSAGFLRAWPEFFGSRKALAEKAVRGLRRARAAGVRTIVDVSTFDIGRDVSLLAEVSRAADVHIVAATGLWFDPPLSMRLRSVEELTQFFLREIQYGIEDTGIRAGIIKVATTGKATPFQELVLKAAARASLATGVPVTTHTAASQRDGEQQAAIFESEGLSPSRVCIGHSDDTDDLSYLTALAARGYLIGLDHIPHSAIGLEDNASASALLGIRSWQTRALLIKALIDQGYMKQILVSNDWLFGFSSYVTNIMDVMDRVNPDGMAFIPLRVIPFLREKGVPQETLAGITVTNPARFLSPTLRAS	

CCOP(=O)(OCC)Oc1ccc([N+](=O)[O-])cc1
```

모든 값을 입력 후 **분석 시작** 버튼을 누르면 **DLKcat**의 효소 활성 예측 결과를 확인할 수 있습니다.

# 6 분석 결과

## 6.1  **DLKcat** 예측 결과

---

| 효소명 | 기질 | 효소 기원 | 예측된 kcat (1/s) |
| --- | --- | --- | --- |
| Parathion hydrolase | CCOP(=O)(OCC)Oc1ccc([N+](=O)[O-])cc1 | 세균 (Bacterial) | **453.241** |
| Serum paraoxonase 1 (PON1) | CCOP(=O)(OCC)Oc1ccc([N+](=O)[O-])cc1 | 인간 (Human) | **11.904** |

## 효소 활성 비교

DLKcat 예측에 따르면 세균 유래 **Parathion hydrolase**의 예측 **kcat 값(≈453.2 1/s)** 이 인간 유래 **PON1(≈11.9 1/s)** 보다 **약 38배 이상 높게** 나타났습니다. 이는 **같은 기질(Paraoxon)** 에 대해서도 효소의 기원과 서열 차이에 따라 **촉매 전환 효율(catalytic turnover rate)** 이 크게 달라질 수 있음을 보여줍니다.

### 생물학적 의미

**Parathion hydrolase**는 환경 내 오염물(유기인계 살충제)을 빠르게 분해하는 역할을 하며 실제로 세균계 효소 중에서도 **유기인계 화합물 분해 효율이 매우 높은 효소**로 알려져 있습니다. DLKcat의 높은 예측 kcat 값은 이러한 **환경 분해 효소 특성**과 잘 일치합니다.

반면 **인간 PON1**은 주로 **혈청 내 항산화 및 해독 반응**에 관여하지만 유기인계 기질에 대해서는 **상대적으로 낮은 촉매 활성**을 보입니다. DLKcat 예측 결과 역시 이러한 **생리적 제한된 활성 범위**를 반영하고 있습니다.

## 6.2 종합 평가

---

![image.png](/image/info/detail/dlkcat_6.webp){center:400}

DLKcat 예측 결과, Paraoxon에 대한 **에스터 가수분해 반응 속도(kcat)** 는 세균 유래 **Parathion hydrolase (≈453 1/s)** 가 인간 유래 **PON1 (≈12 1/s)** 보다 **약 38배 빠른 반응성**을 보였습니다.

이러한 결과는 DLKcat이 효소의 서열적 차이에 따라 반응 특성을 정량적으로 구분할 수 있음을 보여주며 **환경 효소 vs 생리 효소의 기능적 특성 차이**를 AI 기반으로 명확히 반영한 사례라 할 수 있습니다.

# 7 마치며

---

이번 실습에서는 **DLKcat**을 이용해 동일한 기질(Paraoxon)에 대해 **세균(Parathion hydrolase)** 과 **인간(PON1)** 의 효소 활성을 비교해 보았습니다.

DLKcat은 단백질 서열과 기질 구조(SMILES)만으로 예측을 수행함에도 불구하고 두 효소 간의 **기원적·기능적 차이**를 매우 명확하게 반영해 주었습니다. 그 결과, **세균 유래 효소가 인간 효소보다 약 38배 빠른 촉매 전환 속도(kcat)** 를 보이며 환경 내 오염물질을 빠르게 분해하도록 진화한 세균 효소의 특징을 잘 보여주었습니다.

이 실험을 통해 DLKcat은 단순히 수치를 예측하는 모델을 넘어 **효소 서열과 기질 구조의 상관성을 학습하여 생물학적 맥락까지 포착하는 강력한 AI 도구**임을 확인할 수 있었습니다.

또한 이번 비교 분석은 DLKcat을 활용해 **서열 기반 효소 설계 종 간 반응성 비교**, **환경 및 생리적 효소 최적화 연구**로도 확장할 수 있는 가능성을 보여줍니다.

앞으로는 이러한 AI 기반 모델들이 실험적 효소공학과 결합되어 “**더 빠르고, 더 정확하게, 그리고 더 저비용으로**” 새로운 효소를 설계하는 시대가 열릴 것으로 기대됩니다.

# 8 Reference

---

- [Github DLKcat](https://github.com/SysBioChalmers/DLKcat)
- [Nature Catalysis](https://www.nature.com/articles/s41929-022-00798-z)
- CURIE : [DLKcat](https://curie.kr/Analysis/dlkcat)

---

[tool-button:DLKcat]
