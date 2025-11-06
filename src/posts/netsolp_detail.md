---
layout: post
title: "NetSolP: 야생형 단백질과 solubility tag가 추가된 단백질의 용해도 비교"
description: "AI 기반 단백질 용해도 예측 모델 NetSolP-1.0을 소개하고, 야생형 eGFP와 Solubility Tag가 부착된 eGFP를 예제로 예측을 수행"
categories: [analysis]
tags: [NetSolP, Protein Solubility, eGFP, Solubility Tag, Bioinformatics, AI Protein Design]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/netsolp_1.webp"
comment_id: "netsolp_detail"
---

![image.png](/image/info/detail/netsolp_1.webp){center:80}
![image.png](/image/info/detail/netsolp_2.webp){center:800}

단백질을 설계하거나 발현해본 연구자라면 한 번쯤 “이 단백질은 왜 이렇게 안 녹을까?”라는 고민을 해보셨을 겁니다.이번 글에서는 이런 고민을 덜어줄 수 있는 흥미로운 도구 **NetSolP-1.0**을 소개합니다.

NetSolP는 단백질의 **서열 정보만으로 용해도를 예측**하는 AI 기반 모델로, 실험 전에 발현 가능성을 미리 가늠할 수 있게 해줍니다. 글의 후반부에서는 실제로 **일반 단백질과 용해도가 개선된 단백질을 비교 분석**하는 예제를 함께 다뤄보며, NetSolP-1.0의 활용법을 단계별로 살펴보겠습니다.

# 1 사용된 도구

---

- **NetSolP-1.0** 단백질 용해도 및 활용도 예측 도구

# 2 **NetSolP-1.0 설치 방법**

## 2.1 사전 요구사항

---

- Python ≥ 3.8
- `torch`, `onnxruntime` (또는 `onnxruntime-gpu`)
- `numpy`, `pandas`, `transformers`
- CUDA 환경이 있다면 GPU 추론 가능

## 2.2 Python 및 라이브러리 의존성

---

```bash
# 저장소 클론
git clone https://github.com/teevee112/NetSolP-1.0.git
cd NetSolP-1.0

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate   # (Windows는 venv\Scripts\activate)

# 필수 패키지 설치
# CPU 환경
pip install -r requirements_cpu.txt

# GPU 환경 (CUDA 가속 사용 시)
pip install -r requirements_gpu.txt
```

GPU 환경에서는 onnxruntime-gpu 버전이 CUDA와 호환되어야 합니다.

## 2.3 모델 파일 구성

---

모든 예측 모델은 **`models/` 디렉터리** 안에 위치해야 합니다.

모델 파일명 규칙은 다음과 같습니다:

```text
{PREDICTION_TYPE}_{MODEL_TYPE}_{fold-number}_quantized.onnx
```

예시:

```text
S_Distilled_0_quantized.onnx     # Solubility (용해도) 모델
U_Distilled_0_quantized.onnx     # Usability (사용성) 모델
```

- `PREDICTION_TYPE`:
    - `S` → Solubility (용해도)
    - `U` → Usability (사용성)
    - `SU` → 두 가지를 동시에 예측
- `MODEL_TYPE`: `Distilled`, `ESM12`, `ESM1b` (또는 두 개 이상을 앙상블)

권장 설정: `MODEL_TYPE = Distilled`

→ NetSolP-D (빠르고 정확도 우수)

# 3 기본 사용 용법

## 3.1 기본 예시

---

```bash
cd PredictionServer/

python predict.py \
  --FASTA_PATH ./test_fasta.fasta \
  --OUTPUT_PATH ./test_preds.csv \
  --MODEL_TYPE Distilled \
  --PREDICTION_TYPE S
```

| 옵션 | 설명 |
| --- | --- |
| `--FASTA_PATH` | 입력 단백질 FASTA 파일 경로 |
| `--OUTPUT_PATH` | 결과 CSV 저장 경로 |
| `--MODEL_TYPE` | 사용 모델 종류 (`Distilled`, `ESM12`, `ESM1b`) |
| `--PREDICTION_TYPE` | 예측 유형 (`S`, `U`, 또는 `SU`) |

## 3.2 두 가지(S + U) 예측을 동시에 수행하려면

---

```bash
python predict.py \
  --FASTA_PATH ./sample.fasta \
  --OUTPUT_PATH ./sample_preds.csv \
  --MODEL_TYPE Distilled \
  --PREDICTION_TYPE SU
```

결과 예시 (`sample_preds.csv`):

| Protein_ID | Solubility_Score | Usability_Score | Prediction_S | Prediction_U |
| --- | --- | --- | --- | --- |
| P12345 | 0.84 | 0.79 | Soluble | Useful |
| Q8WZ42 | 0.28 | 0.35 | Insoluble | Less_Useful |

# 4 데이터 선정

## 4.1 eGFP (Enhanced Green Fluorescent Protein)

---

- **서열 ID**: `P42212`
- **서열 요약**:

  `VSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTLTYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITLGMDELYK`

- **분류**: 형광 리포터 단백질 (Green Fluorescent Protein 계열)
- **특징**: 세포 내에서 녹색 형광을 발현하며, 구조 안정성이 높아 생명과학 전반에서 단백질 발현 지표로 널리 사용됨.
- **용도**: 발현 효율, 용해도, 폴딩 특성 등을 평가하는 표준 비교 단백질(control protein)로 활용됨.

### 4.2 N11-A8-eGFP (Solubility-tagged eGFP)

---

- **서열 ID**: `P42212` (기반 동일)
- **서열 요약**:

  `VSEPHDYAYEKVSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTLTYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITLGMDELYK`

- **추가 서열 (N-말단)**: `VSEPHDYAYEK` (N11-A8 Solubility Tag)
- **분류**: 용해도 개선형 재조합 단백질 (tag-fused GFP)
- **특징**: N-말단에 짧은 Solubility Tag(N11-A8)를 부착하여 **발현 시 응집체 형성 감소 및 가용성 단백질 비율 증가**를 유도함.
- **용도**: 용해도 향상 태그의 효과를 검증하기 위한 실험적/계산적 모델로 사용됨.

## 4.3 이 두 물질을 선정 한 이유?

---

이번 비교는 **eGFP**와 **N11-A8-eGFP** 두 단백질의 **용해도 차이**를 명확히 검증하기 위해 설계되었습니다.

두 서열의 유일한 차이는 **N-말단의 짧은 Solubility Tag 부착 여부**로, 태그가 예측 용해도에 미치는 영향을 직접적으로 확인할 수 있습니다.

또한 eGFP는 발현 효율과 안정성이 잘 알려진 **표준 모델 단백질**로, 실험적 현실성과 재현성이 높습니다. 이 비교는 NetSolP-1.0이 **단일 서열 변화에 따른 용해도 예측 차이**를 얼마나 정밀하게 반영하는지 확인할 수 있는 좋은 사례이며, 추후 **MBP, GST, SUMO 등 다른 태그 분석으로 확장**하기에도 적합한 기본 프레임입니다.

두 단백질은 단 하나의 차이(**N-말단의 Solubility Tag 부착 여부**)만으로 구성되어 있습니다. NetSolP-1.0 예측을 통해, 짧은 태그가 단백질의 **예측 용해도 점수(Solubility Score)** 를 얼마나 높이는지 확인해보겠습니다.

# 5 예측하기

## 5.1 Linux CLI

---

### 비교용 FASTA 만들기

프로젝트 루트(또는 `PredictionServer/`)에 `compare.fasta`를 생성합니다.

```text
>eGFP | UniProt:P42212 | WT
VSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTLTYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITLGMDELYK

>N11-A8-eGFP | UniProt:P42212 | N-term:VSEPHDYAYEK
VSEPHDYAYEKVSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTLTYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITLGMDELYK
```

### 단일 지표 예측 실행 (S 또는 U)

- **S**: 용해도(Solubility)
- **U**: 사용성/유용성(Usability)

```bash
cd PredictionServer

# 용해도 단일(S) - 권장 Distilled
python predict.py \
  --FASTA_PATH ./compare.fasta \
  --OUTPUT_PATH ./compare_S.csv \
  --MODEL_TYPE Distilled \
  --PREDICTION_TYPE S

# 사용성 단일(U)
python predict.py \
  --FASTA_PATH ./compare.fasta \
  --OUTPUT_PATH ./compare_U.csv \
  --MODEL_TYPE Distilled \
  --PREDICTION_TYPE U
```

### 두 지표 동시 예측 (SU)

```bash
python predict.py \
  --FASTA_PATH ./compare.fasta \
  --OUTPUT_PATH ./compare_SU.csv \
  --MODEL_TYPE Distilled \
  --PREDICTION_TYPE SU
```

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curieus.net/Analysis/netsolp
```

화면에는 단백질의 아미노산 서열을 입력하는 공간과 예측을 수핼 할 모델은 선택하는 공간이 준비되어 있습니다.

![image.png](/image/info/detail/netsolp_3.webp){center:880}

여기에 분석할 단백질에 대한 아미노산 서열을 입력 한 후 **분석 시작** 버튼을 누르면**NetSolP** 도구가 입력된 정보로부터 해당 단백질 서열의 용해도 와 발을 예측합니다.

# 6 분석 결과

## 6.1 NetSolP-1.0 원본 데이

---

| sid | solubility_0 | solubility_1 | solubility_2 | solubility_3 | solubility_4 | solubility | usability_0 | usability_1 | usability_2 | usability_3 | usability_4 | usability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| eGFP | 0.437 | 0.571 | 0.510 | 0.323 | 0.539 | 0.476 | 0.234 | 0.331 | 0.423 | 0.281 | 0.267 | 0.307 |
| N11-A8 | 0.479 | 0.647 | 0.543 | 0.498 | 0.593 | 0.552 | 0.281 | 0.426 | 0.449 | 0.323 | 0.437 | 0.383 |

## 6.2 NetSolP-1.0 결과 해석

---

| 구분 | eGFP | N11-A8-eGFP | 변화(Δ) |
| --- | --- | --- | --- |
| **평균 용해도(Solubility)** | 0.476 | 0.552 | **+0.076** |
| **평균 사용성(Usability)** | 0.307 | 0.383 | **+0.076** |
- **용해도(solubility)**

  eGFP의 평균 용해도 예측값은 약 **0.48**, N11-A8-eGFP는 약 **0.55**로 **0.08 정도 상승**했습니다.

  → 이는 **N-말단 Solubility Tag(N11-A8)** 가 단백질의 가용성(soluble fraction)을 향상시킬 가능성을 시사합니다.

- **사용성(usability)**

  eGFP의 평균 사용성은 **0.31**, 태그 부착 후에는 **0.38**로 역시 **0.07 정도 증가**했습니다.

  → NetSolP 모델 기준으로, **발현성과 전체 단백질 품질(aggregation risk 감소)** 도 일부 개선된 것으로 해석됩니다.


## 6.3 종합 평가

---

NetSolP-1.0 예측 결과, **N11-A8 태그 부착이 eGFP의 용해도와 사용성 모두를 향상시키는 경향**을 보였습니다.

평균적으로 약 **+0.07~0.08 수준의 점수 상승**은 태그가 단백질 발현 시 응집을 완화하고 가용성 비율을 높일 수 있음을 의미합니다.

이는 실제 생화학 실험에서 보고된 **N-말단 펩타이드 태그의 용해도 개선 효과**와 일치하는 결과로, NetSolP-1.0이 짧은 서열 변화에 의한 물리화학적 특성 변화를 **정량적으로 반영할 수 있음을 확인**한 사례입니다.

# 7 마치며

---

이번 튜토리얼에서는 **NetSolP-1.0**을 활용해 일반 단백질 **eGFP**와 **Solubility Tag(N11-A8)** 가 부착된 단백질의 **용해도 및 사용성**을 비교 분석해 보았습니다.

그 결과, 단 **10개의 아미노산 태그 부착만으로**도 NetSolP가 예측한 평균 용해도와 사용성 점수가 모두 약 **0.07~0.08** 상승하는 경향을 확인했습니다. 이는 태그가 실제 발현 환경에서 단백질의 응집을 줄이고 가용성(soluble fraction)을 높일 수 있음을 시사하는 의미 있는 결과입니다.

무엇보다 이번 분석은 **서열 기반 AI 모델**이 단백질의 미세한 서열 변화(예: N-말단 태그 부착)만으로도

용해도 예측값을 구체적으로 반영할 수 있음을 보여줍니다. 이는 실험 이전 단계에서 **단백질 엔지니어링 전략의 효율성을 높이는 강력한 방법론**이 될 수 있습니다.

앞으로는 이번 과정을 확장하여, 다양한 **Solubility Tag (예: MBP, GST, SUMO)** 를 적용하거나 다른 모델(예: DeepSol, ProteinMPNN 등)과의 **교차 검증(cross-validation)** 을 통해 AI 예측의 신뢰도를 정량적으로 비교하는 것도 흥미로운 시도가 될 것입니다.

# 8 Reference

---

- [Github NetSolP](https://github.com/teevee112/NetSolP-1.0)
- [BioMed Central](https://microbialcellfactories.biomedcentral.com/articles/10.1186/s12934-025-02738-5)
- [DTU Health Tech](https://services.healthtech.dtu.dk/services/NetSolP-1.0/)
- [OXFORD ACADEMIC](https://academic.oup.com/bioinformatics/article/38/4/941/6444984?login=false)
- Curieus : [NetSolP](https://curieus.net/Analysis/netsolp)

---

[tool-button:NetSolP]
