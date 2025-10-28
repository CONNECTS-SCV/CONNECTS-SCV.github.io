---
layout: post
title: "hERG: 항히스타민제 Terfenadine과 일반 화합물의 독성 비교"
description: "AI 기반 hERG 채널 차단 예측 모델을 소개하고, 대표적인 hERG 차단제(Terfenadine)와 비차단제(Propranolol)를 예제로 예측을 수행"
categories: [analysis]
tags: [hERG, Cardiotoxicity, Terfenadine, Propranolol, Drug Safety, Bioinformatics, AI Drug Discovery]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/herg_1.webp"
comment_id: "herg_detail"
---

![image.png](/image/info/detail/herg_1.webp){center:880}

신약 개발 과정에서는 효능뿐 아니라 **안전성 검증**이 매우 중요합니다. 특히 약물이 심근세포의 **hERG 채널**을 차단할 경우 부정맥을 유발할 수 있으며, 이는 임상 실패의 주요 원인 중 하나로 꼽힙니다. 이러한 위험을 조기에 예측하기 위해 등장한 것이 바로 **hERG 분석 도구**입니다.

이 도구는 화합물이 hERG 채널과 결합할 가능성을 전산적으로 평가하여, 연구자가 불필요한 후보를 미리 걸러내고 안전성을 확보할 수 있도록 돕습니다. 덕분에 연구 비용과 시간을 절약할 수 있으며, 새로운 화합물 설계 단계에서도 **독성 위험을 최소화한 최적화**가 가능해집니다.

이번 예시에서는 항히스타민제 **Terfenadine**을 분석 대상으로 삼았습니다. Terfenadine은 한때 널리 사용되었으나 hERG 차단으로 인한 부정맥 부작용 때문에 결국 시장에서 퇴출된 약물입니다. 따라서 이 화합물을 일반적인 비독성 화합물과 비교 분석하는 과정은, hERG 예측 도구가 실제 연구 현장에서 얼마나 중요한 역할을 하는지 보여주는 적절한 사례라 할 수 있습니다.

# 1 사용된 도구

---

- **hERG-prediction** hERG 차단제 독성 예측 모델

# 2 hERG-prediction **설치 방법**

본 문서는 **hERG 채널 차단 예측 도구**를 설치하고 실행하기 위한 환경 설정 방법을 설명합니다. 해당 도구는 전산생물학적 독성 평가 연구에서 널리 활용될 수 있으며, 분자 수준에서 약물의 안전성을 빠르게 점검할 수 있습니다.

## 2.1 운영체제 요구사항

---

- **CentOS Linux 7 (Core)** 환경에서 테스트되었습니다.
- 다른 리눅스 배포판에서도 동작할 수 있으나, 권장 환경은 CentOS 7입니다.

## 2.2 Python 및 라이브러리 의존성

---

아래 Python 버전 및 패키지가 필요합니다.

- Python ≥ 3.7
- setuptools ≥ 18.0
- pytorch ≥ 1.2
- rdkit = 2020.03
- biopandas = 0.2.7
- numpy = 1.17.4
- scikit-learn = 0.23.2
- scipy = 1.5.2
- pandas = 0.25.3
- cython = 0.29.17

필요 패키지는 다음과 같이 설치할 수 있습니다:

```bash
pip install setuptools>=18.0
pip install torch>=1.2
pip install rdkit-pypi==2020.03.1
pip install biopandas==0.2.7
pip install numpy==1.17.4
pip install scikit-learn==0.23.2
pip install scipy==1.5.2
pip install pandas==0.25.3
pip install cython==0.29.17
```

rdkit은 일반적으로 Conda 환경에서 설치하는 것이 안정적입니다.

`conda install -c conda-forge rdkit=2020.03`

## 2.3 리포지토리 다운로드

---

먼저 GitHub에서 소스를 다운로드합니다.

```bash
git clone https://github.com/WeilabMSU/hERG_prediction.git
cd hERG_prediction
```

## 2.4 사전학습된 모델 설치 (Feature Generation)

---

hERG 예측은 **사전학습된 분자 표현 모델**을 사용해 특성을 추출한 뒤, 분류 모델을 통해 차단 여부를 예측합니다.

사전학습 모델을 설치하려면 아래 명령어를 실행하세요:

```bash
bash install-transformer.sh
```

이 과정에서는 Transformer 기반 분자 임베딩 모델이 다운로드 및 설치됩니다.

## 2.5 학습된 분류 모델 다운로드

---

다음으로, hERG 차단 여부를 판별하는 **학습된 GBDT 기반 분류 모델**을 다운로드합니다.

```bash
wget https://weilab.math.msu.edu/Downloads/hERG_Models.zip
unzip hERG_Models.zip
```

압축을 해제하면 예측에 필요한 분류 모델 파일이 생성됩니다.

# 3 기본 사용 용법

설치를 완료했다면 이제 실제로 화합물의 SMILES 정보를 입력하여 **hERG 채널 차단 가능성**을 예측할 수 있습니다.

## 3.1 입력 데이터 준비

---

예측 도구는 **`.smi` 파일**을 입력으로 받습니다.

- `.smi` 파일은 **SMILES 형식**의 분자 구조를 저장하는 텍스트 파일입니다.
- 한 줄에 하나의 분자를 입력하면 됩니다.

예시 (`example.smi`):

```text
CC(C)(C)CCOC(c1ccccc1)O
CCN(CC)CCOc1ccc(Cl)cc1
```

## 3.2 실행 명령어

---

준비한 `.smi` 파일을 입력으로 다음 명령어를 실행합니다.

```bash
cd hERG_prediction
python generation-prediction.py --path-to-smi example.smi

#또는 SMILES 직접 사용
python generation-prediction.py --sequence "CCN(CC)CCOc1ccc(Cl)cc1"
```

- `-path-to-smi` 옵션 뒤에 예측할 SMILES 파일 경로를 지정합니다.

## 3.3 해석 방법

---

- **차단제 여부 기준**은 **IC50 = 10 μM** 입니다.
- `blocker probability` 값이 높을수록 hERG 차단제일 가능성이 크며, `block type = 1`로 분류됩니다.
- 반대로 값이 낮으면 `block type = 0`으로, 비차단제로 간주됩니다.

# 4 데이터 선정

## 4.1 Propranolol

---

![image.png](/image/info/detail/herg_2.webp){center:400}

- **화학식**: C₁₆H₂₁NO₂
- **SMILES**: `CC(C)NCC(O)COc1cccc2c1CCCC2`
- **분류**: 비선택적 β-아드레날린 수용체 차단제 (β-blocker)
- **hERG 연관성**: Propranolol은 비교적 **낮은 hERG 차단 가능성**을 보이는 것으로 알려져 있어, 대조군(non-blocker)에 적합합니다.

## 4.2 Terfenadine

---

![image.png](/image/info/detail/herg_3.webp){center:500}

- **화학식**: C₃₂H₄₁NO₂
- **SMILES**: `CC(C)(C)C1=CC=C(C=C1)C(CCCN2CCC(CC2)C(C3=CC=CC=C3)(C4=CC=CC=C4)O)O`
- **분류**: 항히스타민제 (2세대, 알레르기 치료제)
- **hERG 연관성**: 강력한 **hERG 차단제**로 밝혀져, 심각한 부정맥(특히 Torsades de Pointes) 위험 때문에 시장에서 퇴출된 대표적 사례

## 4.3 이 두 물질을 선정 한 이유?

---

먼저, Propranolol과 Terfenadine은 **대조적인 특성**을 지니고 있습니다. Propranolol은 현재도 임상에서 안정적으로 사용되는 약물로, hERG 차단 활성이 비교적 낮아 안전성이 확보된 편입니다. 반면, Terfenadine은 강한 hERG 차단 작용으로 인해 심장 독성이 문제가 되어 결국 시장에서 퇴출된 약물입니다. 따라서 두 약물을 함께 비교하는 것은 hERG 예측 모델이 차단제와 비차단제를 얼마나 명확하게 구분할 수 있는지를 직관적으로 확인하는 데 적합합니다.

또한 이 두 약물은 **임상적 사례의 대표성**을 가지고 있습니다. Terfenadine은 신약 독성 평가 과정에서 늘 언급되는 대표적인 사례로, hERG 차단 위험성을 설명하는 데 있어 교과서적인 예시라 할 수 있습니다. 반대로 Propranolol은 여전히 널리 사용되는 약물로, 안전성이 뒷받침된 대조군으로 삼기에 이상적입니다. 이러한 조합은 hERG 예측 도구의 필요성과 타당성을 설득력 있게 보여줄 수 있습니다.

## 5 예측하기

## 5.1 입력 파일(.smi) 만들기

---

도구는 **SMILES가 들어있는 `.smi`** 파일을 입력으로 받습니다.

이름을 함께 두고 싶다면 보통 `SMILES <공백> NAME` 형태를 사용합니다(도구는 SMILES만 있어도 동작합니다).

```bash
cd hERG_prediction

# ① 이름 포함 버전(권장)
cat > example.smi <<'EOF'
CC(C)NCC(O)COc1cccc2c1CCCC2 Propranolol
CC(C)(C)C1=CC=C(C=C1)C(CCCN2CCC(CC2)C(C3=CC=CC=C3)(C4=CC=CC=C4)O)O Terfenadine
EOF

# ② 이름 없이 SMILES만(대체안)
# cat > example.smi <<'EOF'
# CC(C)NCC(O)COc1cccc2c1CCCC2
# CC(C)(C)CCOC(c1ccc(OCCc2ccc(C(C)(C)O)cc2)cc1)c1ccccc1
# EOF
```

- Propranolol: `CC(C)NCC(O)COc1cccc2c1CCCC2`
- Terfenadine: `C(C)(C)C1=CC=C(C=C1)C(CCCN2CCC(CC2)C(C3=CC=CC=C3)(C4=CC=CC=C4)O)O C(C)`

---

## 2) 예측 실행

`generation-prediction.py`는 **특성 생성 → 예측**을 한 번에 수행합니다.

```bash
python generation-prediction.py --path-to-smi example.smi
```

또는 `SMILES`를 직접 입력하여 예측이 가능합니다.

```bash
python generation-prediction.py --sequence CC(C)NCC(O)COc1cccc2c1CCCC2
python generation-prediction.py --sequence CC(C)(C)C1=CC=C(C=C1)C(CCCN2CCC(CC2)C(C3=CC=CC=C3)(C4=CC=CC=C4)O)O
```

- 분자 임베딩 **features/** 폴더에 저장
- 예측 결과 **results/** 폴더에 저장

> 결과 파일은 보통 CSV 형식이며, 최소 block type(0=비차단제, 1=차단제),
>
>
> `blocker probability`(차단제일 확률 0~1)가 포함됩니다.
>

## 5.3 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/herg
```

화면에는 화합물의 정보를 입력하는 방식 선택과 SMILES 문자열을 입력하는 창이 준비되어 있습니다.

![image.png](/image/info/detail/herg_4.webp){center:880}

여기에 분석할 화합물에 대한 정보를 입력 한 후 **분석 시작** 버튼을 누르면 hERG-Prediction 도구가 입력된 정보로부터 hERG 칼륨 채널 내 작용 기전을 예측합니다.

# 6 분석 결과

## 6.1 hERG 차단제 예측 결과 요약

---

| name | smiles | block_type | probability |
| --- | --- | --- | --- |
| Terfenadine | CC(C)(C)C1=CC=C(C=C1)C(CCCN2CCC(CC2)C(C3=CC=CC=C3)(C4=CC=CC=C4)O)O | 1 | 1.000 |
| Propranolol | CC(C)NCC(O)COc1cccc2c1CCCC2 | 0 | 0.000 |

## **Terfenadine**

- **예측 결과 (block_type)**: 1 → **차단제**로 분류됨
- **차단 확률 (blocker_probability)**: 1.000 (100%)
- 해석: Terfenadine은 hERG 채널 차단 가능성이 매우 높으며, 심장 독성 위험이 강하게 시사됩니다. 실제 임상에서 퇴출된 사례와도 일치하는 결과입니다.

## **Propranolol**

- **예측 결과 (block_type)**: 0 → **비차단제**로 분류됨
- **차단 확률 (blocker_probability)**: 0.000 (0%)
- 해석: Propranolol은 hERG 채널 차단 가능성이 매우 낮으며, 심장 독성과의 연관성이 거의 없음을 보여줍니다. 임상에서 여전히 안전하게 사용되는 대조군 약물의 특성과 잘 부합합니다.

## 6.3 종합 평가

---

- 예측 신뢰도가 90% 이상으로 높게 나타난 것은, StrucToxNet이 학습 과정에서 Lysozyme과 뱀독 단백질처럼 전형적인 대조군 사례를 충분히 학습했음을 보여줍니다.
- 또한 이 모델은 단순히 서열 정보에만 의존하지 않고, 구조적 활성 부위까지 함께 고려하기 때문에 효소 활성, 금속 결합, 도메인 구조와 같은 독성 기작을 기능적 맥락 속에서 반영할 수 있다는 강점을 지니고 있습니다.
- 이러한 특성 덕분에 StrucToxNet은 신약 개발 과정에서 안전한 후보군을 신속하게 걸러내고, 잠재적으로 독성이 우려되는 단백질을 사전에 제거하는 데 매우 유용하게 활용될 수 있습니다.

# 7 마치며

---

이번 분석을 통해 hERG 예측 모델이 약물의 심장 독성 가능성을 신속하고 정확하게 평가할 수 있음을 확인했습니다. 예시로 사용한 두 물질 가운데 **Terfenadine은 차단제(100%)**, Propranolol은 비차단제(0%)로 분류되었으며, 이는 실제 임상 결과와 일치합니다.

이러한 결과는 모델이 **차단제와 비차단제를 명확하게 구분할 수 있음을 보여주는 대표적 사례**입니다. 따라서 연구자는 hERG 예측 도구를 활용하여 독성 위험을 조기에 식별하고, 안전성이 높은 후보 물질을 선별하는 데 큰 도움을 받을 수 있습니다. 이는 신약 개발 과정에서 **효율성과 안전성을 동시에 확보할 수 있는 중요한 전략**이 될 것입니다.

# 8 Reference

---

- [Github hERG](https://github.com/WeilabMSU/hERG-prediction)
- [RayBiotech](https://www.raybiotech.com/terfenadine-331-11916)
- [WIKIPEDIA](https://en.wikipedia.org/wiki/Terfenadine?utm_source=chatgpt.com)
- CURIE : [hERG](https://curie.kr/Analysis/herg)

---

[tool-button:hERG]
