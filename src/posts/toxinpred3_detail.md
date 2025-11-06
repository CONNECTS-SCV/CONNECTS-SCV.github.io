---
layout: post 
title: "ToxinPred3 : 독성이 있다고 알려진 펩타이드와 안전한 펩타이드 비교"
description: "AI 기반 펩타이드 독성 예측 모델 ToxinPred3를 소개하고, 대표적인 비독성 링커((GGGGS)₃)와 독성 펩타이드(Mastoparan)를 예제로 예측을 수행" 
categories: [analysis] 
tags: [ToxinPred3, Peptide Toxicity, Bioinformatics, Mastoparan, GGGGS linker, AI Toxin Prediction, Drug Safety] 
author: "author6" 
date: "2025-09-29" 
thumbnail: "/image/info/detail/toxinpred3_1.webp"
comment_id: "toxinpred3_detail"
---

![image.png](/image/info/detail/toxinpred3_1.webp){center:400}

“이 펩타이드, 혹시 독성 있나요?”라는 질문은 연구자라면 한 번쯤 머릿속에 떠오르는 물음입니다. 신약 후보로 떠오른 펩타이드가 실은 독성을 지니고 있다면, 임상 시험이 시작되기도 전에 프로젝트가 좌초할 수 있죠. 실험실에서 일일이 독성 실험을 돌리는 건 너무 번거롭고 자원도 많이 듭니다.

그래서 등장한 게 **ToxinPred3**입니다. 이건 단순한 예측 모형이 아니라, 트랜스포머(transformer) 기반의 모델과 머신러닝 기법을 결합해 **펩타이드의 독성 여부**를 빠르고 정확하게 예측해 줍니다. 입력으로 펩타이드 서열을 주면, “독성 있음 / 없음”을 냉큼 돌려주는 똑똑한 친구죠. GitHub 저장소에도 예제와 설치법이 잘 정리되어 있어요.

이번 글에서는 ToxinPred3의 설치, 사용법, 예제 실행까지 전 과정을 다룹니다. 게다가, 이미 독성이 입증된 펩타이드와 매우 안전한 펩타이드 두 개를 골라 직접 예측 비교를 해볼 거예요. 마치 실전 강의처럼요.

# 1 사용된 도구

---

- **ToxinPred3** 펩타이드의 독성 여부를 빠르게 예측하는 transformer 기반 모델

# 2 ToxinPred3 **설치 방법**

## 2.1 pip로 간편 설치

---

```bash
pip install toxinpred3

```

만약 `toxinpred3` 명령어가 안 먹힌다면, `python -m toxinpred3 -h` 로 실행해도 됩니다.

## 2.2 독립 실행형 수동 설치

---

직접 소스를 내려받아 쓰는 방식도 제공됩니다. 이 방법은 **Python 스크립트를 직접 실행하거나 내부 코드를 수정하고 싶은 분들**께 유용하죠.

### 필요한 패키지 설치

```bash
pip install scikit-learn==1.0.2 pandas numpy
```

여기서 중요한 건 `scikit-learn` 버전입니다. ToxinPred3은 `1.0.2` 버전에서 가장 안정적으로 작동하므로 꼭 해당 버전으로 설치해주세요.

### GitHub 저장소 클론

```bash
git clone https://github.com/raghavagps/toxinpred3.git
cd toxinpred3
```

이제 `main.py` 또는 `tox_predict.py` 같은 파일들을 직접 실행하며 예측을 테스트할 수 있습니다.

### **중요 참고 사항**

- 모델 파일의 크기가 크기 때문에 모델을 압축했습니다.
- 코드나 모델을 사용하기 전에 파일의 압축을 푸는 것이 중요합니다. 코드가 제대로 작동하려면 압축 파일을 원래 형태로 풀어야 합니다.

# 3 기본 사용 용법

## 3.1 입력 파일 준비하기

---

ToxinPred3는 **두 가지 입력 형식**을 지원합니다:

### FASTA 형식

```text
>toxic_peptide_1
GIGAVLKVLTTGLPALISWIKRKRQQ
>safe_peptide_1
DSHAKRHHGYKRKFHEKHHSHRGYRSNYLYDN
```

### 단순 형식

```text
GIGAVLKVLTTGLPALISWIKRKRQQ
DSHAKRHHGYKRKFHEKHHSHRGYRSNYLYDN
```

**파일명 예시**: `peptide.fa`, `peptide.seq`

## 3.2 기본 명령어 형태

---

```bash
python toxinpred3.py -i peptide.fa

usage: toxinpred3.py [-h]
                     [-i INPUT]
                     [-o OUTPUT]
                     [-t THRESHOLD]
                     [-m {1,2}]
                     [-d {1,2}
```

이 명령어는 `peptide.fa` 파일 안에 있는 펩타이드들을 읽어 기본 설정으로 독성 예측을 수행하고, 결과를 `outfile.csv`에 저장합니다.

| 옵션 | 설명 | 기본값 |
| --- | --- | --- |
| `-i` | 입력 파일 (필수) | — |
| `-o` | 출력 파일명 지정 | `outfile.csv` |
| `-t` | 예측 임계값 (0~1 사이 값) | `0.38` |
| `-m` | 모델 선택: `1` (ML), `2` (Hybrid) | `2` |
| `-d` | 결과 표시: `1` (독성만), `2` (모두) | `1` |

---

## 3.3 다양한 실행 예시

---

```bash
# 기본 실행
python toxinpred3.py -i peptide.fa

# 결과 파일명을 지정하고 싶다면
python toxinpred3.py -i peptide.fa -o result.csv

# 더 엄격한 임계값으로 분석 (예: 0.5)
python toxinpred3.py -i peptide.fa -t 0.5

# 머신러닝 기반 모델만 사용 (Model 1)
python toxinpred3.py -i peptide.fa -m 1

# 독성/비독성 모두 출력
python toxinpred3.py -i peptide.fa -d 2
```

## 3.4 결과 해석하기

---

출력 파일은 `.csv` 형식이며 다음과 같은 구조를 가집니다:

```text
Name,Sequence,Score,Prediction
toxic_peptide_1,GIGAVLKVLTTGLPALISWIKRKRQQ,0.812,Toxic
safe_peptide_1,DSHAKRHHGYKRKFHEKHHSHRGYRSNYLYDN,0.134,Non-Toxic
```

- **Score**: 독성 가능성 확률 (0 ~ 1 사이 값)
- **Prediction**: `Toxic` 또는 `Non-Toxic` 으로 예측 결과
- 임계값(default=0.38)보다 높으면 Toxic으로 판단됩니다.

# 4 데이터 선정

## 4.1 **(GGGGS)₃ – 유연한 링커 서열**

---

![image.png](/image/info/detail/toxinpred3_2.webp){center:400}

- **서열**: `GGGGSGGGGSGGGGS`
- **구성 특징**:
  - Glycine(G)과 Serine(S)의 반복 패턴
  - 구조적으로 매우 유연하며, 단백질 도메인 사이의 **스페이서 역할**로 자주 사용됨
  - 물리화학적으로 **비독성**이고 **면역 반응을 유발하지 않음**
- **생물학적 역할**:
  - 인공 단백질 디자인에서 도메인 간 연결부로 자주 사용
  - 접힘에 영향을 주지 않으며 구조 간섭이 적음
- **선정 이유**: 이 링커는 생물학적으로 거의 항상 **안전한 서열**로 간주되기 때문에, **비독성 펩타이드의 대표 예시**로 적합합니다. ToxinPred3의 예측 결과와 비교하여 모델이 얼마나 잘 구분하는지 확인하는 데 좋은 기준점이 됩니다.

## **4.2 Mastoparan – 대표적인 독성 펩타이드**

---

![image.png](/image/info/detail/toxinpred3_3.webp){center:400}

- **Uniprot ID**: P17238 (WASP mastoparan)
- **서열**: `MKDTILILFTAFIALLGFFGMSAEALADPLADPSAGPNAEADPEAINLKAIAALVKKVLG`
- **구성 특징**:
  - 여러 개의 **양전하 아미노산(K, R)** 과 **소수성 잔기(I, L, F, A)** 포함
  - **알파 나선 구조**로 세포막을 삽입 및 교란
- **생물학적 역할**:
  - 말벌 독소에서 유래한 **강한 용혈성 펩타이드**
  - 세포막을 파괴하여 세포 독성을 유발
  - 다양한 독성 모델의 양성 대조군으로 자주 사용됨
- **선정 이유**: Mastoparan은 독성이 뚜렷하게 확인된 펩타이드로, ToxinPred3가 이 서열을 명확히 **독성으로 분류하는지 확인**할 수 있습니다. (GGGGS)₃와 함께 사용하면 모델의 예측 정확도를 **양극단 예시로 평가**하는 데 효과적입니다.

## 5 예측하기

## 5.1 FASTA 파일 작성

---

우선 분석에 사용할 펩타이드 서열을 **FASTA 형식**으로 저장합니다. 예를 들어 `peptides.fa`라는 이름의 파일로 작성하세요:

```text
>GGGGS_linker
GGGGSGGGGSGGGGS
>Mastoparan
MKDTILILFTAFIALLGFFGMSAEALADPLADPSAGPNAEADPEAINLKAIAALVKKVLG
```

## 5.2 Linux CLI

---

이제 터미널에서 아래 명령어를 입력하여 모델을 실행합니다:

```bash
toxinpred3.py -i peptides.fa -o result.csv -m 2 -d 2
```

- `i peptides.fa`: 입력 서열 파일 (FASTA 형식)
- `o result.csv`: 결과가 저장될 CSV 파일 이름
- `m 2`: Hybrid model (ExtraTree + MERCI 앙상블)
- `d 2`: 모든 서열에 대한 예측 결과 출력 (1이면 독성만 출력됨)

## 5.3 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curieus.net/Analysis/toxinpred3
```

화면에는 독성 예측에 사용 할 단백질의 아미노산 서열을 입력하는 창이 준비되 있습니다.

![image.png](/image/info/detail/toxinpred3_4.webp){center:880}

여기에 분석할 단백질의 아미노산 서열을 입력 후, 예측모델을 선택합니다. 아미노산을 더 작은 단위로 나누어 국소적인 독성을 평가하고자 하는 경우 해당 옵션을 활성화 합니다. 이후 분석 시작 버튼을 통해 해당 단백질의 독성에 대한 평가를 진행할 수 있습니다.

# 6 분석 결과

## 6.1 결과 요약

---

| Subject | Sequence | ML Score | MERCI Score Pos | MERCI Score Neg | Hybrid Score | Prediction | PPV |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A_1 | GGGGSGGG | 0.125 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| A_2 | GGGSGGGG | 0.125 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| A_3 | GGSGGGGS | 0.115 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| A_4 | GSGGGGSG | 0.130 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| A_5 | SGGGGSGG | 0.130 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| A_6 | GGGGSGGG | 0.125 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| A_7 | GGGSGGGG | 0.125 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| A_8 | GGSGGGGS | 0.115 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_1 | MKDTILIL | 0.380 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_2 | KDTILILF | 0.440 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_3 | DTILILFT | 0.325 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_4 | TILILFTA | 0.225 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_5 | ILILFTAF | 0.255 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_6 | LILFTAFI | 0.285 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_7 | ILFTAFIA | 0.265 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_8 | LFTAFIAL | 0.200 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_9 | FTAFIALL | 0.240 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_10 | TAFIALLG | 0.270 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_11 | AFIALLGF | 0.360 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_12 | FIALLGFF | 0.470 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_13 | IALLGFFG | 0.460 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_14 | ALLGFFGM | 0.390 | 0 | 0 | 0.390 | Toxin | 0.353 |
| B_15 | LLGFFGMS | 0.400 | 0 | 0 | 0.400 | Toxin | 0.366 |
| B_16 | LGFFGMSA | 0.300 | 0 | 0 | 0.300 | Non-Toxin | 0.235 |
| B_17 | GFFGMSAE | 0.185 | 0 | 0 | 0.185 | Non-Toxin | 0.085 |
| B_18 | FFGMSAEA | 0.160 | 0 | 0 | 0.160 | Non-Toxin | 0.053 |
| B_19 | FGMSAEAL | 0.165 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_20 | GMSAEALA | 0.165 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_21 | MSAEALAD | 0.095 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_22 | SAEALADP | 0.075 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_23 | AEALADPL | 0.115 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_24 | EALADPLA | 0.145 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_25 | ALADPLAD | 0.205 | 0 | 0 | 0.205 | Non-Toxin | 0.111 |
| B_26 | LADPLADP | 0.205 | 0 | 0 | 0.205 | Non-Toxin | 0.111 |
| B_27 | ADPLADPS | 0.195 | 0 | 0 | 0.195 | Non-Toxin | 0.098 |
| B_28 | DPLADPSA | 0.195 | 0 | 0 | 0.195 | Non-Toxin | 0.098 |
| B_29 | PLADPSAG | 0.225 | 0 | 0 | 0.225 | Non-Toxin | 0.137 |
| B_30 | LADPSAGP | 0.150 | 0 | 0 | 0.150 | Non-Toxin | 0.039 |
| B_31 | ADPSAGPN | 0.110 | 0 | 0 | 0.110 | Non-Toxin | 0 |
| B_32 | DPSAGPNA | 0.210 | 0 | 0 | 0.210 | Non-Toxin | 0.118 |
| B_33 | PSAGPNAE | 0.275 | 0 | 0 | 0.275 | Non-Toxin | 0.203 |
| B_34 | SAGPNAEA | 0.210 | 0 | 0 | 0.210 | Non-Toxin | 0.118 |
| B_35 | AGPNAEAD | 0.175 | 0 | 0 | 0.175 | Non-Toxin | 0.072 |
| B_36 | GPNAEADP | 0.170 | 0 | 0 | 0.170 | Non-Toxin | 0.066 |
| B_37 | PNAEADPE | 0.160 | 0 | 0 | 0.160 | Non-Toxin | 0.053 |
| B_38 | NAEADPEA | 0.140 | 0 | 0 | 0.140 | Non-Toxin | 0.026 |
| B_39 | AEADPEAI | 0.090 | 0 | 0 | 0.090 | Non-Toxin | 0 |
| B_40 | EADPEAIN | 0.145 | 0 | 0 | 0.145 | Non-Toxin | 0.033 |
| B_41 | ADPEAINL | 0.175 | 0 | 0 | 0.175 | Non-Toxin | 0.072 |
| B_42 | DPEAINLK | 0.280 | 0 | 0 | 0.280 | Non-Toxin | 0.209 |
| B_43 | PEAINLKA | 0.360 | 0 | 0 | 0.360 | Non-Toxin | 0.314 |
| B_44 | EAINLKAI | 0.420 | 0 | 0 | 0.420 | Toxin | 0.392 |
| B_45 | AINLKAIA | 0.690 | 0 | 0 | 0.690 | Toxin | 0.745 |
| B_46 | INLKAIAA | 0.695 | 0 | 0 | 0.695 | Toxin | 0.752 |
| B_47 | NLKAIAAL | 0.675 | 0 | 0 | 0.675 | Toxin | 0.726 |
| B_48 | LKAIAALV | 0.605 | 0 | -0.500 | 0.105 | Non-Toxin | 0 |
| B_49 | KAIAALVK | 0.470 | 0 | -0.500 | 0 | Non-Toxin | 0 |
| B_50 | AIAALVKK | 0.510 | 0 | -0.500 | 0.010 | Non-Toxin | 0 |
| B_51 | IAALVKKV | 0.565 | 0 | -0.500 | 0.065 | Non-Toxin | 0 |
| B_52 | AALVKKVL | 0.600 | 0 | -0.500 | 0.100 | Non-Toxin | 0 |
| B_53 | ALVKKVLG | 0.610 | 0 | -0.500 | 0.110 | Non-Toxin | 0 |

### A : GGGGS 링커 서열 (A_1 ~ A_8)

- **전체 8개 서열 모두 Non-Toxic**으로 예측 되었으며, **Hybrid Score**는 모두 **0.0**으로, 독성 가능성이 전혀 없다는 의미로 해석 가능
- **ML Score도 0.125 이하로 매우 낮게 나타남**
- (GGGGS)₃는 예측상 완전히 안전한 비독성 펩타이드로 확인됩니다. 실제 유전자 조작 등에서 자주 사용되는 링커답게 생체 내 안정성이 높은 서열임이 반영된 결과입니다.

---

### B : Mastoparan 펩타이드 (B_1 ~ B_53)

- **총 53개 중 6개 서열에서 'Toxin'으로 예측**
  - B_14: ALLGFFGM → 0.390 (Toxin)
  - B_15: LLGFFGMS → 0.400 (Toxin)
  - B_44: EAINLKAI → 0.420 (Toxin)
  - B_45: AINLKAIA → 0.690 (Toxin)
  - B_46: INLKAIAA → 0.695 (Toxin)
  - B_47: NLKAIAAL → 0.675 (Toxin)
- 나머지 서열은 대부분 **Hybrid Score < 0.5**, **Non-Toxic**으로 예측
- Mastoparan 전체가 길게 이어진 펩타이드일 때는 독성이 분명하지만, 그 중에서도 특히 중앙부의 특정 서열 영역 (LKAIAALV 전후) 에서 강한 독성 신호를 가진 것으로 나타났습니다.

## 6.3 종합 평가

---

- **ToxinPred3는 펩타이드의 독성 여부를 빠르고 정확하게 예측하는 실용적인 도구**입니다. 이번 실험에서 비독성 링커 서열은 모두 안정적으로 Non-Toxin으로 판별되었고, Mastoparan처럼 알려진 독성 펩타이드는 부분적으로 강한 독성 구간을 정확히 탐지했습니다.

# 7 마무리하며 – “이 펩타이드, 안심하고 써도 될까?”

---

펩타이드의 독성 여부는 신약 개발, 단백질 공학, 백신 디자인 등 다양한 생명과학 분야에서 필수적으로 고려해야 할 요소입니다. 실험으로 독성을 확인하려면 많은 시간과 자원이 들기 마련인데요, **ToxinPred3**는 이런 번거로움을 똑똑하게 덜어주는 도구입니다.

이번 튜토리얼에서 우리는 비독성의 대표 주자 **(GGGGS)₃ 링커 서열**과, 독성이 뚜렷한 **Mastoparan 펩타이드**를 비교 분석해보았습니다.

**(GGGGS)₃**는 모든 슬라이딩 윈도우에서 안정적으로 Non-Toxin으로 예측되며, 실제 사용에서도 안전한 서열임을 재확인할 수 있었고, **Mastoparan**은 전체 서열 중 특정 부위에서 높은 독성 점수를 받아, **부분적인 독성 hotspot**을 잘 잡아내는 모델의 민감도가 인상적이었습니다.

PIP 설치부터 CLI 실행, 그리고 슬라이딩 윈도우 기반 해석까지  **실제 실험을 대체하거나 보완할 수 있는 수준의 분석 도구**라는 걸 실감할 수 있었죠.

앞으로 새롭게 디자인한 펩타이드 서열이 있다면, 본격적인 합성이나 실험에 앞서 ToxinPred3로 먼저 예측해보는 건 어떨까요?

# 8 Reference

---

- [Github ToxinPred3](https://github.com/raghavagps/toxinpred3)
- [bioRxiv](https://www.biorxiv.org/content/10.1101/2023.08.11.552911v1)
- Curieus : [ToxinPred3]https://curieus.net/Analysis/toxinpred3

---

[tool-button:ToxinPred3]
