---
layout: post
title: "Dscript : 실제 상호작용이 밝혀진 CD137/CD137L의 결과 값 예측" 
description: "AI 기반 단백질 상호작용(PPI) 예측 모델 D-SCRIPT를 소개하고, 실제 상호작용이 검증된 CD137과 CD137L 쌍을 예제로 예측을 수행하여 그 성능을 확인" 
categories: [analysis]
tags: [D-SCRIPT, PPI, Protein-Protein Interaction, CD137, CD137L, Bioinformatics, AI Protein Design] 
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/dscript_1.webp"
comment_id: "dscript_cd137_detail"
---

![image.png](/image/info/detail/dscript_1.webp)

안녕하세요! 이번 글에서는 **단백질–단백질 상호작용(Protein–Protein Interaction, PPI)** 을 예측하는 AI 기반 모델 [D-SCRIPT](https://github.com/samsledje/D-SCRIPT) 를 소개하고 실제 생리학적으로 상호작용이 잘 알려진 **CD137 (4-1BB)** 과 **CD137L (4-1BB Ligand)** 쌍을 예제로 예측 실습을 진행해보겠습니다.

단백질 간의 결합 여부를 밝히는 것은 생명과학 연구와 신약개발에서 매우 중요한 과제입니다.

하지만 모든 PPI를 실험적으로 확인하기에는 막대한 비용과 시간이 소요되지요. **D-SCRIPT**는 이러한 한계를 극복하기 위해 고안된 **딥러닝 기반 PPI 예측 모델**로 단백질의 **서열(sequence)** 정보만으로 **결합 여부와 상호작용 영역(contact map)** 을 추론할 수 있습니다.

즉, 복잡한 구조 데이터 없이도 **“이 두 단백질이 실제로 결합할 가능성이 있는가?”** 를 예측할 수 있는 도구입니다.

이번 글에서는 D-SCRIPT의 기본 개념과 설치 방법을 살펴본 뒤 면역 반응 조절의 핵심 축을 이루는 **CD137–CD137L 복합체**를 대상으로 AI가 얼마나 정확하게 상호작용을 재현할 수 있는지 직접 확인해보겠습니다.

그럼 지금부터, **D-SCRIPT로 단백질 간 상호작용을 예측하는 여정**을 함께 시작해볼까요?

# 1 사용된 도구

---

- **D-SCRIPT** 단백질의 상호작용 여부를 예측하는 CNN 기반 모듈

# 2 DiffDock 설치 튜토리얼

D-SCRIPT는 단백질 서열만으로 단백질-단백질 상호작용(Protein–Protein Interaction, **PPI**)을 예측하는 **딥러닝 기반 모델**입니다.

PyPI(Python Package Index)에 배포되어 있어, 단 한 줄 명령어로 손쉽게 설치할 수 있습니다.

## 2.1 Python 환경 준비

---

먼저 Python 3.8 이상이 설치되어 있는지 확인하세요. 가상 환경(venv 또는 conda)을 권장합니다.

```bash
# (선택 사항) 새 환경 생성
conda create -n dscript python=3.9
conda activate dscript
```

## 2.2 D-SCRIPT 설치

---

PyPI를 통해 바로 설치할 수 있습니다.

```bash
pip install dscript
```

이 명령은 D-SCRIPT의 핵심 패키지와 함께 필요한 의존성(PyTorch, NumPy, Biopython 등)을 자동으로 설치합니다.

## 2.3 설치 확인

---

정상적으로 설치되었는지 아래 명령으로 테스트해보세요.

```bash
python -c "import dscript; print('D-SCRIPT successfully installed!')"
```

출력:

```text
D-SCRIPT successfully installed!
```

이 메시지가 나오면 설치가 완료된 것입니다.

## 2.4 GPU 사용 (선택 사항)

---

D-SCRIPT는 PyTorch 기반으로 구현되어 있어 GPU를 활용할 수 있습니다.

GPU가 있는 환경에서는 실행 속도가 약 **10~30배** 빨라집니다.

```bash
python -c "import torch; print(torch.cuda.is_available())"
```

출력이 `True`이면 GPU 사용이 가능합니다.

# 3 기본 사용 용법

D-SCRIPT는 단백질 서열만으로 두 단백질이 실제로 결합할지(Physical Interaction)를 예측하는 도구입니다.

예측 과정은 크게 두 단계로 이루어집니다.

1. **단백질 서열 임베딩(Embedding)** — Bepler & Berger 단백질 언어모델로 각 단백질을 벡터화
2. **상호작용 예측(Prediction)** — 임베딩된 단백질 쌍 간의 결합 확률 계산

## 3.1 단백질 서열 임베딩 (Embedding)

---

D-SCRIPT는 내부적으로 **Bepler+Berger protein language model** 을 사용해 각 단백질의 아미노산 서열을 수치 벡터로 변환합니다.

입력 파일은 **FASTA 형식 (.fasta)** 이어야 합니다.

### 입력 형식

- FASTA 파일에서 **첫 번째 공백 전까지의 식별자(>header)** 가 key로 사용됩니다.

```text
>PROTEIN
MKITISLIIALCFLSPVSGDKVTTPGGAAV...
>PROTEINl
MGNSVTVAPLLVLLLLSSGGTQGHSWESLSA...
```

### 명령어 예시

```bash
dscript embed --seqs data/seqs/PROTEIN_PROTEINl.fasta --outfile embeddings_PROTEIN_PROTEINl.h5
```

| 옵션 | 설명 |
| --- | --- |
| `--seqs` | FASTA 서열 파일 경로 |
| `--outfile` | 출력 임베딩 파일 이름 (.h5 형식) |

이 명령이 완료되면 `embeddings_cd137_cd137l.h5` 파일이 생성됩니다. 이 파일에는 각 단백질의 서열이 고차원 벡터 형태로 저장되어 있습니다.

## 3.2 상호작용 예측 (Prediction)

---

임베딩이 완료되면, 두 단백질 간 상호작용 여부를 예측합니다. 이때 입력으로 **단백질 쌍 목록 (.tsv)** 파일을 사용합니다.

### 입력 형식 (.tsv)

| protein_1 | protein_2 | label(optional) |
| --- | --- | --- |
| PROTEIN | PROTEINl | 1 |

label 값은 선택 항목입니다. (1=positive, 0=negative) 단, D-SCRIPT는 예측 시 label을 사용하지 않습니다.

### 명령어 예시

```bash
dscript predict \
  --pairs data/pairs/PROTEIN_PROTEINl.tsv \
  --embeddings embeddings_PROTEIN_PROTEINl.h5 \
  --model samsl/topsy_turvy_human_v1 \
  --outfile PROTEIN_PROTEINl_prediction
```

| 옵션 | 설명 |
| --- | --- |
| `--pairs` | 단백질 쌍 정보가 담긴 TSV 파일 |
| `--embeddings` | 앞 단계에서 생성된 임베딩 파일 (.h5) |
| `--model` | 사용할 사전학습 모델 이름 (HuggingFace에서 자동 다운로드) |
| `--outfile` | 예측 결과 파일명 |

## 3.3 지원되는 사전학습 모델 (Pretrained Models)

---

| 모델명 | 설명 |
| --- | --- |
| `samsl/dscript_human_v1` | 인간 단백질 데이터 기반 기본 모델 |
| `samsl/topsy_turvy_human_v1` | **추천 모델** – 최신 human dataset 기반, 성능 향상 |
| `samsl/tt3d_human_v1` | 3D 구조적 제약이 추가된 버전 |

모델명을 직접 입력하면 HuggingFace에서 자동 다운로드됩니다.

## 3.4 GPU 활용 및 메모리 최적화

---

D-SCRIPT는 기본적으로 CPU를 사용하지만, `-d` 옵션으로 GPU를 지정할 수 있습니다. 또한, 대규모 단백질 세트를 임베딩할 때는 `--blocks` 옵션으로 메모리를 분할하여 효율적으로 처리할 수 있습니다.

### 예시

```bash
dscript predict \
  --pairs data/pairs/PROTEIN_PROTEINl.tsv \
  --embeddings embeddings_PROTEIN_PROTEINl.h5 \
  --outfile PROTEIN_PROTEINl_predict_gpu \
  --blocks 16 -d 0
```

| 옵션 | 설명 |
| --- | --- |
| `--blocks` | 메모리 분할 개수 (block 수를 늘리면 메모리 사용량 ↓) |
| `-d 0` | 0번 GPU 사용 (또는 `-d all`로 전체 GPU 사용 가능) |

## 3.5 결과 파일 해석

---

예측이 완료되면 다음과 같은 출력 파일이 생성됩니다.

```text
PROTEIN_PROTEINl_prediction/
├── predictions.tsv
└── contact_map.npy
```

| 파일명 | 설명 |
| --- | --- |
| `predictions.tsv` | 각 단백질 쌍의 상호작용 확률(score) |
| `contact_map.npy` | 상호작용이 예상되는 residue 간의 contact map (2D 배열 형태) |

예시 결과 (`predictions.tsv`):

```text
protein_1	protein_2	score
PROTEIN	  PROTEIN-L 0.982
```

`score`가 1에 가까울수록 결합 가능성이 높음을 의미합니다.

# 4 예제 선정 : CD137–CD137L

![image.png](/image/info/detail/dscript_2.webp){center:400}

이번 실습에서는 실제 생체 내 상호작용이 명확히 밝혀진 **CD137 (4-1BB, TNFRSF9)** 과 **CD137L (4-1BB Ligand, TNFSF9)** 단백질 쌍을 이용해 D-SCRIPT 모델이 어떻게 두 단백질 간의 결합 가능성을 예측하는지 살펴보겠습니다.

## 4.1 CD137 (4-1BB, TNFRSF9)

---

![image.png](/image/info/detail/dscript_3.webp){center:300}

| 항목 | 내용 |
| --- | --- |
| **공식 명칭** | Tumor necrosis factor receptor superfamily member 9 (CD137 / 4-1BB / TNFRSF9) |
| **UniProt ID** | P41273 |
| **PDB 구조** | 6A3V (CD137–CD137L 복합체) |
| **단백질 길이** | 약 255 aa |
| **주요 구조 특징** | 세포막 관통형 단백질로, 세포 외부에는 TNF receptor 도메인 4개가 반복되어 존재 |
| **기능 요약** | T세포 활성화 시 발현되어 CD137L과 결합함으로써 공동자극(co-stimulation)을 유도 |
| **생물학적 의의** | 면역 반응 증폭, 종양 면역치료(anti-4-1BB antibody) 타깃으로 활발히 연구 중 |

CD137은 T세포 표면에 존재하며, 리간드(CD137L)와 결합하면 세포 내 신호 전달 경로를 활성화시켜 **세포 증식, 생존, 사이토카인 분비**를 유도합니다. 즉, 단백질–단백질 결합이 생리적 기능 발현의 핵심 열쇠이기 때문에 PPI 예측 도구(D-SCRIPT)의 실효성을 확인하기에 이상적입니다.

## 4.2 CD137 Ligand (4-1BBL, TNFSF9)

---

![image.png](/image/info/detail/dscript_4.webp){center:200}

| 항목 | 내용 |
| --- | --- |
| **공식 명칭** | Tumor necrosis factor ligand superfamily member 9 (CD137L / 4-1BBL / TNFSF9) |
| **PDB 구조** | 6A3V (CD137과 복합체) |
| **단백질 길이** | 약 254 aa |
| **주요 구조 특징** | TNF ligand superfamily 공통의 β-sandwich 구조 |
| **기능 요약** | 항원제시세포(APC) 표면에 존재하며 CD137 수용체와 결합 |
| **생물학적 의의** | 면역 시냅스 형성 및 T세포 활성화 조절, 역방향 신호(reverse signaling) 기능도 있음 |

CD137L은 주로 **수지상세포, 대식세포** 등 항원제시세포 표면에서 발현됩니다. CD137과의 결합을 통해 **쌍방향 신호(bidirectional signaling)** 를 일으켜 면역 반응을 정밀하게 조절하는 역할을 합니다.

## 4.3 예제 선정 이유

---

CD137–CD137L 복합체는 **실제 물리적 결합이 구조 수준에서 검증된 대표적 PPI 쌍**으로 D-SCRIPT 모델이 서열 정보만으로 상호작용을 얼마나 잘 복원할 수 있는지를 확인하기에 이상적입니다.

| 선정 근거 | 설명 |
| --- | --- |
| **실제 결정 구조 보유 (PDB: 6A3V)** | D-SCRIPT의 예측 결과를 실험적 구조와 직접 비교 가능 |
| **명확한 리간드–수용체 관계** | 상호작용 방향성과 결합 영역이 뚜렷하여 예측 해석이 용이 |
| **면역학적 중요성** | T세포 활성화 경로의 핵심 축으로 실제 임상 타깃 (면역항암제 개발 중) |
| **보존된 결합 모티프 존재** | TNFR/TNF 패밀리에서 공통 결합 패턴 → 모델의 일반화 성능 평가에 적합 |
| **구조 없이도 예측 가능한 강결합형 PPI** | 구조 입력 없이 서열만으로도 결합을 예측할 수 있는 테스트 케이스 |

# 5 예측하기

## 5.1 Linux CLI 이용

---

### 예시 입력 요약

**FASTA 파일 (`data/seqs/cd137_cd137l.fasta`)**

```text
>CD137
ARASPGSAASPRLREGPELSPDDPAGLLDLRQGMFAQLVAQNVLLIDGPLSWYSDPGLAGVSLTGGLSYKEDTKELVVAKAGVYYVFFQLELRRVVAGEGSGSVSLALHLQPLRSAAGAAALALTVDLPPASSEARNSAFGFQGRLLHLSAGQRLGVHLHTEARARHAWQLTQGATVLGLFRVTPEIPAGLPSPRSE
>CD137L
LQDPCSNCPAGTFCDNNRNQICSPCPPNSFSSAGGQRTCDICRQCKGVFRTRKECSSTSNAECDCTPGFHCLGAGCSMCEQDCKQGQELTKKGCKDCCFGTFNDQKRGICRPWTNCSLDGKSVLVNGTKERDVVCGPSPADLSPGASSVTPPAPARE
```

**예측 실행 명령**

```bash
dscript embed --seqs data/seqs/cd137_cd137l.fasta --outfile embeddings_cd137_cd137l.h5

echo -e "CD137\tCD137L" > data/pairs/cd137_cd137l.tsv

dscript predict \
  --pairs data/pairs/cd137_cd137l.tsv \
  --embeddings embeddings_cd137_cd137l.h5 \
  --model samsl/topsy_turvy_human_v1 \
  --outfile results/cd137_cd137l_predict
```

## 5.3 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curieus.net/Analysis/dscript
```

화면에서는 단백질 서열 입력을 위한 두 가지 방식을 제공합니다.

사용자는 **파일 첨부** 또는 **직접 입력** 중 하나를 선택하여 단백질 데이터를 제공할 수 있습니다. 상호작용을 예측할 단백질의 아미노산 서열은 FASTA 헤더 없이 순수 서열만 입력합니다. 입력창 우측의 `＋` 버튼을 이용하면 새로운 단백질 서열 입력란을 추가할 수 있으며, `－` 버튼을 통해 불필요한 항목을 제거할 수도 있습니다.

예측 모델은 **Human**, **topsy_turvy_v1**, **tt3d_v1** 중에서 선택할 수 있습니다. 각 모델은 학습 데이터와 구조적 제약 수준이 다르며, Human 모델은 일반적인 인간 단백질 상호작용 예측에 적합합니다.

![image.png](/image/info/detail/dscript_5.webp){center:880}

모든 설정이 완료되면 하단의 **분석 시작** 버튼을 눌러 예측을 수행합니다. D-SCRIPT 모델이 입력된 단백질 서열을 기반으로 상호작용 가능성을 계산하고 결과 화면에서 예측 점수와 contact map을 확인할 수 있습니다.

# 6 분석 결과

## 6.1 **DiffDock** 예측 결과 요약

---

### **Dscript 상호작용 결과**

| ID1 | ID2 | Score |
| --- | --- | --- |
| A1 | A2 | 0.596 |

결과 표에서는 두 단백질 ID(`A1`, `A2`) 간의 상호작용 예측 점수가 **0.596**으로 나타났습니다. 이 값은 **0~1 범위의 확률적 점수**로, 두 단백질이 물리적으로 결합할 가능성을 의미합니다.

- **0.5 이상**은 **유의미한 상호작용 가능성**을 가리키며,
- **0.7 이상**은 **높은 신뢰도의 결합 예측**으로 간주할 수 있습니다.

따라서 이번 결과(0.596)는 “중간 이상의 결합 가능성이 존재하며, 구조적 상호작용이 일어날 가능성이 높은 수준”으로 해석할 수 있습니다. 이 값은 D-SCRIPT의 서열 기반 예측 특성상, **명확한 구조 정보 없이도 상호작용 징후를 포착**했음을 보여줍니다.

### **Dscript 양성 상호작용 결과**

| ID1 | ID2 | Score |
| --- | --- | --- |
| A1 | A2 | 0.596 |

상호작용 점수가 높은 쌍만을 선택한 결과, 예측 확률이 일반적으로 0.6 이상이며, 실험적 상호작용 가능성이 높은 후보로 사용할 수 있습니다.

### **Simulation Heatmap**

![image.png](/image/info/detail/dscript_6.webp){center:800}

아래의 **Contact Map**은 D-SCRIPT가 추정한 **상호작용 부위(contact residue pairs)** 를 시각화한 결과입니다.

- X축과 Y축은 각각 단백질 A1과 A2의 아미노산 잔기 순서를 나타냅니다.
- 색의 농도는 **접촉 확률(Contact Score)** 을 의미하며 검은색에 가까울수록 두 잔기가 상호작용할 가능성이 높음을 뜻합니다.

히트맵에서 일부 구간이 **0.6 이상(진한 영역)** 으로 표시된 것은 특정 잔기 군(cluster)이 서로 근접하여 **결합 인터페이스(interface region)** 를 형성할 가능성을 보여줍니다.

이 영역은 실제 결합 부위 탐색 또는 구조 예측 시 후속 분석의 단서로 활용될 수 있습니다.

## 6.3 종합 평가

---

이번 결과에서 예측 점수: **0.596 (중간 이상 신뢰도),** 히트맵: **국소적 결합 영역 존재라는** 두 가지 근거를 종합하면 D-SCRIPT는 **A1과 A2 단백질 간에 구조적 상호작용 가능성이 높다**는 결론을 제시한 것으로 볼 수 있습니다.

이는 실제 생물학적 PPI 데이터(예: CD137–CD137L, TNFR–TNFL 계열 단백질 등)와 유사한 수준의 패턴을 보이며 **서열 기반 AI 모델이 구조 정보 없이도 물리적 상호작용 경향을 추정할 수 있음을 시각적으로 확인한 결과**라 할 수 있습니다.

# 7 마치며

---

이번 CD137–CD137L 예제는 D-SCRIPT의 해석 가능성과 생물학적 타당성을 동시에 보여준 사례입니다.

다음 단계에서는 이러한 AI 예측 결과를 **실제 구조 모델링(DiffDock, AlphaFold-Multimer 등)** 과 결합해 더 깊은 수준의 분자 상호작용 이해로 확장해볼 수 있겠죠. 이제 여러분도, **자신의 연구 대상 단백질 쌍이 실제로 상호작용할 가능성이 있는지 D-SCRIPT로 직접 탐색**해보세요.

데이터만 있다면, 단백질 간 보이지 않던 연결고리를 AI가 밝혀줄 것입니다.

# 8 Reference

---

- [Github D-SCRIPT](https://github.com/samsledje/D-SCRIPT)
- [bioRxiv](https://www.biorxiv.org/content/10.1101/2021.01.22.427866v1)
- Curieus : [D-SCRIPT](https://curieus.net/Analysis/dscript)

---

[tool-button:Dscript]
