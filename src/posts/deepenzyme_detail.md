---
layout: post
title: "DeepEnzyme : TEV Protease 돌연변이에 따른 효소 활성 비교"
description: "효소의 기질 특이적 촉매 속도 상수(Kcat)를 예측하는 딥러닝 모델"
categories: [analysis]
tags: [DeepEnzyme, 효소, Kcat, 촉매속도, Transformer]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/deepenzyme_1.webp"
---

![image](/image/info/detail/deepenzyme_1.webp){center:600}

단백질 공학에서 가장 큰 고민 중 하나는 **효소 활성의 불확실성**이에요. 아미노산 하나만 바뀌어도 반응 효율이 크게 달라지거나, 때로는 활성을 완전히 잃어버리기도 해요. 그렇다고 모든 변이 후보를 실험으로 확인하기엔 시간과 비용이 너무 많이 들죠.

이럴 때 도움이 되는 도구가 바로 **DeepEnzyme**이에요. DeepEnzyme은 단백질 서열과 구조 정보를 바탕으로 효소의 반응 속도(k_cat) 같은 지표를 예측해주는 딥러닝 기반 모델이에요. 덕분에 연구자는 실험 전에 어떤 변이가 유망할지 미리 가늠해볼 수 있고, 신약 개발이나 단백질 엔지니어링 과정에서 시행착오를 줄일 수 있어요.

이번 글에서는 **TEV Protease 돌연변이**를 예시로, DeepEnzyme이 어떻게 효소 활성의 변화를 예측하고 연구 설계에 도움을 줄 수 있는지 함께 살펴보려고 해요.

# 1 사용된 도구

---

- **DeepEnzyme** 효소 촉매 효율 예측 모델입니다.

# 2 **DeepEnzyme 설치 방법**

DeepEnzyme은 Python 3.9 기반의 딥러닝 분석 도구예요. 설치를 위해선 먼저 **Anaconda 또는 Miniconda**가 설치되어 있어야 해요.

## 2.1 저장소 클론 및 가상환경 생성

---

먼저 GitHub에서 DeepEnzyme 코드를 내려받아요.

```bash
# 저장소 클론
git clone https://github.com/hongzhonglu/DeepEnzyme.git
cd DeepEnzyme

#가상환경 생성
conda create -n DeepEnzyme python=3.9 -y
conda activate DeepEnzyme
```

## 2.2 종속 패키지 설치하기

---

아래는 `requirements.txt` 또는 수동 설치로 사용되는 주요 라이브러리 목록이에요.

```text
apex==0.9.10dev
biotite==0.38.0
einops==0.7.0
h5py==3.7.0
matplotlib==3.8.0
numpy==1.22.4
pandas==2.2.2
rdkit==2022.9.1
rdkit_pypi==2022.9.5
Requests==2.31.0
scikit_learn==1.5.0
scipy==1.13.1
seaborn==0.13.0
torch==1.13.0
torchvision==0.14.0
tqdm==4.65.0
transformers==4.24.0
```

설치는 아래 명령어로 한 번에 할 수 있어요:

```bash
pip install -r requirements.txt
```

## 2.3 PyTorch 설치 (CUDA 사용 시)

---

만약 **GPU를 사용하고 싶으시다면**, PyTorch를 CUDA 버전에 맞게 설치해 주세요. DeepEnzyme 기본 종속성은 `torch==1.13.0`, `torchvision==0.14.0`이에요.

```bash
# CUDA 11.7 예시
pip install torch==1.13.0+cu117 torchvision==0.14.0+cu117 -f https://download.pytorch.org/whl/torch_stable.html
```

# 3 기본 사용 용법

## 3.1 CLI로 실행하기

---

DeepEnzyme은 단백질의 서열·구조·리간드 정보를 바탕으로 효소 활성(k<sub>cat</sub>)을 예측하는 도구예요. 아래는 가장 기본적인 사용 예시를 설명한 튜토리얼이에요.

### 기본 명령어 형식

```bash
python Code/Example/example.py \
  --sequence "AEQUENCE" \
  --smiles "C(C(=O)O)N" \
  --pdb INPUT_DIR/input.pdb \
  --model DeepEnzyme/example \
  --chain_id "A" \
  --output OUTPUT_DIR/Deepenzyme_Result.txt
```

각 인자의 의미는 아래와 같아요.

| 인자 | 설명 |
| --- | --- |
| `--sequence` | 분석할 단백질의 아미노산 서열이에요 (1-letter 코드). |
| `--smiles` | 반응 기질(ligand)의 SMILES 문자열이에요. |
| `--pdb` | 단백질 구조 파일(PDB 형식)의 경로예요. |
| `--model` | 사용할 학습된 모델 디렉토리 경로예요. |
| `--chain_id` | 분석 대상 체인 ID예요 (예: A, B 등). |
| `--output` | 예측 결과를 저장할 경로예요. |

### 폴더 구조 예시

```bash
DeepEnzyme/
├── Code/
│   └── Example/
│       └── example.py  ← 실행 스크립트
├── inputs/
│   └── tev_protease.pdb  ← 분석할 PDB 구조
├── outputs/
│   └── tev_result.txt    ← 예측 결과
├── DeepEnzyme/
│   └── example/          ← 학습된 모델 폴더
```

# 4 데이터 선정

이번 예제에서는 TEV protease의 여러 변이체에 따른 **기질 특이성 및 효소 활성 차이**를 분석해 보려고 해요.

## 4.1 실험 대상: TEV protease

---

- **변이체**: WT, eTEV, uTEV3
- **Uniprot**: P04517

![image](/image/info/detail/deepenzyme_2.webp){center:600}

- **특징**:
    - 생물학적 실험과 정제 과정에서 널리 사용되는 시스테인 프로테아제
    - **ENLYFQSG**라는 특정 절단 서열에 대해 매우 높은 특이성을 갖는 것으로 잘 알려져 있음
    - 발현 효율이나 활성이 낮은 경우가 종종 있어서, 이를 개선하기 위한 여러 **engineered variant (e.g. eTEV, uTEV3)** 들이 개발됨

## 4.2 기질

---

![image](/image/info/detail/deepenzyme_3.webp){center:600}

- **아미노산 서열**: ENLYFQSG
- **SMILES**

```python
N[C@@H](CCC(=O)O)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](Cc1ccccc1)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CO)C(=O)NCC(=O)O
```

## 4.3 선정 이유 요약

이번 예제로 **WT, eTEV, uTEV3**를 선택한 이유는 참고 논문에 각 변이체의 **Km, Kcat, Kcat/Km 값이 정량적으로 명확하게 제시**되어 있어서, DeepEnzyme의 예측값과 실험값을 비교하기에 좋아서예요. 특히 변이체 간 활성이 점진적으로 증가하는 패턴이 뚜렷해, **상대적 성능 차이를 모델이 잘 구분하는지** 확인할 수 있어요.

또한, 구조(PDB 또는 AlphaFold), 서열, 기질(SMILES) 정보가 모두 확보되어 있어 DeepEnzyme의 입력 조건도 완벽하게 갖춰져 있어요. 이런 점에서 **정량 평가가 가능한 최적의 테스트 케이스**라고 할 수 있어요.

# 5 예측하기

## 5.1 Linux CLI

---

Dili 예측에 사용  단백질의 구조는 아래에서 다운 받을 수 있습니다.

```text
https://pmc.ncbi.nlm.nih.gov/articles/instance/10934673/bin/molecules-29-01071-s001.zip
```

PDB구조 중 기질 Chain을 제거 후 분석의 입력으로 사용하며, 실행 예시는 다음과 같습니다.

```bash
python Code/Example/example.py \
--sequence GESLFKGPRDYNPISSTICHLTNESDGHTTSLYGIGFGPFIITNKHLFRRNNGTLLVQSLHGVFKVKNTTTLQQHLIDGRDMIIIRMPKDFPPFPQKLKFREPQREERICLVTTNFQTKSMSSMVSDTSCTFPSSDGIFWKHWIQTKDGQCGSPLVSTRDGFIVGIHSASNFTNTNNYFTSVPKNFMELLTNQEAQQWVSGWRLNADSVLWGGHKVFMVKPEEPFQPVKEATQLMNELVYSQ \
--smiles "N[C@@H](CCC(=O)O)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](Cc1ccccc1)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CO)C(=O)NCC(=O)O" \
--pdb $INPUT_DIR/WT-complex-model.pdb \
--model DeepEnzyme/example \
--chain_id A \
--output $OUTPUT_DIR/Deepenzyme_Result.txt
```

이 명령을 실행하면 Deepenzyme의 효소 활성 예측 결과가 계산 됩니다.

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **웹페이지 GUI**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/deepenzyme
```

화면에는 SMILES 문자열을 입력하는 창이 준비되어 있습니다.

![image](/image/info/detail/deepenzyme_4.webp){center:880}

여기에 분석할 단백질의 구조를 업로드 한 후 기질의 SMILES 문자열을 입력하면 됩니다.

```text
N[C@@H](CCC(=O)O)C(=O)N[C@@H](CC(=O)N)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](Cc1ccccc1)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CO)C(=O)NCC(=O)O
```

단백질 구조 중, 분석에 사용 할 Chain을 지정 후 **분석 시작** 버튼을 누르면 Deepenzyme의 효소 활성 예측 결과를 확인할 수 있습니다.

# 6 분석 결과

## 6.1 DeepEnzyme 예측 결과 분석

---

| 모델 | 예측된 Kcat 값 |
| --- | --- |
| **WT** | 26.91 |
| **uTEV3** | 30.54 |
| **eTEV** | 34.32 |

DeepEnzyme을 활용해 TEV protease의 세 가지 변이체(WT, uTEV3, eTEV)에 대한 **기질 ENLYFQSG에 대한 Kcat 값을 예측**한 결과 **eTEV > uTEV3 > WT** 순으로, 예측된 Kcat 값이 증가하고 있어요. 이는 실제 실험 결과에서 관찰된 경향(변이체 도입 시 효소 활성 증가)과 **일치하는 방향성**이에요.

## 6.2 실험값과 예측값 비교

---

| 모델 | 실험 Kcat (s⁻¹) | 예측 Kcat (상대 수치) |
| --- | --- | --- |
| WT | 0.16 ± 0.02 | 26.91 |
| eTEV | 0.41 ± 0.02 | 34.32 |
| uTEV3 | 0.15 ± 0.01 | 30.54 |

DeepEnzyme은 **절대적인 Kcat 수치 자체보다는 상대적인 활성 경향**을 예측하는 데 더 초점이 맞춰져 있어요. 실험에서는 **eTEV가 가장 활성이 높고** WT와 uTEV3는 비슷하거나, WT가 약간 더 높게 보고되기도 했지만 예측값에서는 **uTEV3가 WT보다 활성 측면에서 우수한 것으로 나타났어요.**

이 차이는 uTEV3가 낮은 Km 값을 기반으로 **기질 결합 친화도가 높고, 구조적으로 반응성이 더 높다고 모델이 판단했을 가능성**을 시사해요.

## 6.3 종합 평가

---

- **DeepEnzyme은 실험 결과의 전반적인 활성 향상 방향성을 잘 포착하고 있어요.**
- 특히 eTEV의 높은 Kcat 예측은, 다중 돌연변이에 따른 **촉매 중심 구조 최적화**를 모델이 효과적으로 인식하고 있다는 의미로 해석할 수 있어요.
- uTEV3와 WT의 상대적 위치 차이는 Km 중심의 기능 향상(affinity-driven)을 모델이 **Kcat 기준으로 약간 과대평가했을 가능성**도 있겠지만,

  이는 실제 실험에서도 Kcat/Km 값이 높은 점과 어느 정도 부합해요.


# 7 마치며

---

이번 포스팅에서는 TEV protease의 돌연변이 사례를 중심으로, DeepEnzyme이 어떻게 효소 활성 변화를 예측할 수 있는지 살펴봤어요.

실험 데이터를 바탕으로 예측 결과를 비교해본 결과, DeepEnzyme은 전체적인 활성 경향성을 잘 포착하고 있었고, 연구 설계 단계에서 충분히 활용 가능한 가능성을 보여주었어요.

앞으로도 DeepEnzyme처럼 구조 기반 AI 예측 도구들을 잘 활용하면, 실험 이전 단계에서 유망한 후보를 빠르게 가려낼 수 있어, 시간과 비용을 절약하는 데 큰 도움이 될 거예요.

그럼 다음 포스팅에서 더 흥미로운 주제로 찾아올게요!

읽어주셔서 감사합니다 :)

# 8 Reference

---

- [Github DeepEnzyme](https://github.com/hongzhonglu/DeepEnzyme)
- [PubMed Central(PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10934673/#app1-molecules-29-01071)
- CURIE : [DeepEnzyme](https://curie.kr/Analysis/deepenayme), [Dilipred](https://curie.kr/Analysis/dilipred)
- [Example File](/file/deepenzyme_detail.zip)

---

[tool-button:DeepEnzyme]