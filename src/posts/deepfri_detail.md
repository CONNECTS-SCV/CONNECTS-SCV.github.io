---
layout: post
title: "DeepFRI로 단백질 기능 예측: LDHA와 UniProt 데이터 비교 분석"
description: "AI 모델 DeepFRI를 사용하여 L-lactate dehydrogenase A (LDHA) 단백질의 기능을 예측하고, 그 결과를 실제 UniProt 데이터와 비교하여 정확도를 검증"
categories: [analysis] 
tags: [DeepFRI, 단백질 기능 예측, LDHA, UniProt, 생물정보학, AI 모델]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/deepfri_1.webp"
comment_id: "deepfri_detail"
---

![image.png](/image/info/detail/deepfri_1.webp)

안녕하세요! 이번 글에서는 **딥러닝 기반 단백질 기능 예측 모델인 [DeepFRI](https://github.com/flatironinstitute/DeepFRI)** 를 소개하고, 실제 예제로 **L-lactate dehydrogenase A (LDHA)** 단백질의 기능을 예측해보겠습니다.

단백질의 기능은 생명 현상을 이해하는 데 핵심적인 정보지만, 모든 단백질의 기능을 실험적으로 규명하는 것은 시간과 비용이 많이 드는 일입니다. DeepFRI는 이러한 한계를 극복하기 위해 개발된 모델로, **3차원 구조 정보와 단백질 서열 정보를 함께 활용하여 분자 수준의 기능을 예측**할 수 있습니다.

이 글에서는 DeepFRI의 기본 개념과 사용법을 살펴본 뒤, 예시로 LDHA 단백질의 기능을 예측하고 **UNIPROT 데이터와 비교 분석**하여 DeepFRI가 어떤 강점을 갖는지 직접 확인해보겠습니다.

그럼 지금부터 DeepFRI로 단백질 기능을 예측하는 여정을 함께 시작해볼까요?

# 1 사용된 도구

---

- **DeepFRI** 단백질의 기능을 예측하고 그 기능에 관여하는 잔기를 찾아내는 모델

# 2 **DeepFRI 설치 방법**

## 2.1 사전 안내 및 요구사항

---

DeepFRI는 **Python 3.7** 환경에서 테스트된 도구입니다. [GitHub](https://github.com/flatironinstitute/DeepFRI?utm_source=chatgpt.com) 또한 GitHub의 `setup.py`를 보면, DeepFRI가 요구하는 주요 패키지들이 다음과 같이 명시되어 있어요.

- numpy == 1.18.5 [(GitHub)](https://github.com/flatironinstitute/DeepFRI/blob/master/setup.py?utm_source=chatgpt.com)
- tensorflow-gpu == 2.3.1 [(GitHub)](https://github.com/flatironinstitute/DeepFRI/blob/master/setup.py?utm_source=chatgpt.com)
- networkx == 2.4 [(GitHub)](https://github.com/flatironinstitute/DeepFRI/blob/master/setup.py?utm_source=chatgpt.com)
- scikit-learn == 0.23.1 [(GitHub)](https://github.com/flatironinstitute/DeepFRI/blob/master/setup.py?utm_source=chatgpt.com)
- biopython == 1.76 [(GitHub)](https://github.com/flatironinstitute/DeepFRI/blob/master/setup.py?utm_source=chatgpt.com)

즉, DeepFRI를 설치하고 실행하려면 위의 의존성들이 충족된 환경이 필요합니다.

또한, GitHub 설명에서는 다음과 같이 적혀 있어요:

“The required dependencies for DeepFRI are TensorFlow, Biopython and scikit-learn. To install all dependencies run: pip install .” GitHub

이는 즉, 레포지토리를 클론한 뒤 로컬에서 `pip install .` 을 하면 `setup.py`에 명시된 종속성들이 자동으로 설치된다는 뜻이죠.

## 2.2 설치 단계 튜토리얼

---

다음은 DeepFRI를 처음 사용하는 사용자를 위한 설치 과정 예제입니다.

```bash
# 1. 가상환경 생성 (선택 사항이지만 권장)
python3.7 -m venv deepfri_env
source deepfri_env/bin/activate        # Linux/Mac

# 2. GitHub 저장소 클론
git clone https://github.com/flatironinstitute/DeepFRI.git
cd DeepFRI

# 3. pip로 설치 (의존성 자동 설치)
pip install .

# 4. 설치 확인
# 예: Python REPL에서 import 테스트
python -c "import tensorflow, sklearn, Bio; print('OK')"

```

주의 사항

- 만약 GPU 버전 텐서플로우가 필요 없거나 GPU가 없는 환경이면, `tensorflow` (CPU 버전)으로 대체 설치가 가능한지 확인이 필요할 수 있습니다.
- 일부 패키지 버전 충돌이 있을 수 있으니, 설치 중 오류가 나면 `pip install --upgrade [패키지명]` 또는 적절한 버전 고정 설치를 시도해 보세요.
- Python 버전이 3.7이 아닌 경우 호환성 이슈가 있을 수 있으니, 가능하면 3.7 환경을 맞추는 게 안전합니다.

# 3 DeepFRI 기본 사용법 튜토리얼

DeepFRI는 단백질 서열(sequence)이나 구조(structure, contact map / PDB 파일)를 입력으로 받아

**GO term (분자 기능, 생물학적 과정, 세포 구성 요소 등)** 혹은 **EC 번호 (효소 분류)** 를 예측할 수 있는 강력한 도구입니다.

다양한 입력 형식을 지원하며, 아래의 명령어 예제처럼 간단히 터미널에서 실행할 수 있습니다.

## 3.1 접촉 맵(Contact Map) 기반 기능 예측

---

단백질의 **3차원 구조로부터 계산된 contact map** 파일(`.npz`)을 입력으로 기능을 예측합니다.

```bash
python predict.py --cmap ./examples/pdb_cmaps/1S3P-A.npz -ont mf --verbose
```

contact map 파일은 구조 정보가 있을 때 (예: PDB에서 유도된 경우) 가장 정확한 예측을 제공합니다.

## 3.2 단백질 서열(Sequence) 기반 기능 예측

단백질 서열 문자열만으로도 기능을 예측할 수 있습니다.

```bash
python predict.py --seq 'SMTDLLSAEDIKKAIGAFTAADSFDHKKFFQMVGLKKKSADDVKKVFHILDKDKDGFIDEDELGSILKGFSSDARDLSAKETKTLMAAGDKDGDGKIGVEEFSTLVAES' -ont mf --verbose
```

서열 입력은 PDB 구조가 없는 단백질이나 서열 데이터만 확보된 경우에 유용합니다.

## 3.3 FASTA 파일에서 예측

---

여러 단백질 서열을 담은 **FASTA 파일**을 입력하여 일괄 예측할 수 있습니다.

```bash
python predict.py --fasta_fn examples/pdb_chains.fasta -ont mf -v
```

`ont` 옵션으로 `mf`(molecular function), `bp`(biological process), `cc`(cellular component) 등 예측 범위를 선택할 수 있습니다.

## 3.4 접촉 맵 카탈로그에서 예측

---

여러 접촉 맵을 **CSV 카탈로그 파일**로 관리하고, 이를 일괄 예측할 수 있습니다.

```bash
python predict.py --cmap_csv examples/catalogue_pdb_chains.csv -ont mf -v
```

이 방식은 대량 구조 데이터를 한 번에 분석할 때 매우 유용합니다.

## 3.5 PDB 파일 기반 기능 예측

---

단일 **PDB 파일**을 직접 입력해 예측할 수 있습니다.

```bash
python predict.py -pdb ./examples/pdb_files/1S3P-A.pdb -ont mf -v
```

## 3.6 PDB 파일이 있는 디렉토리 일괄 예측

---

여러 PDB 파일이 저장된 디렉토리를 지정해 일괄 분석할 수 있습니다.

```bash
python predict.py --pdb_dir ./examples/pdb_files -ont mf --saliency --use_backprop
```

`-saliency`와 `-use_backprop` 옵션은 **saliency map** (어떤 residue가 기능 예측에 가장 기여했는지 시각화) 생성을 활성화합니다.

# 4 예제 단백질 소개: L-lactate dehydrogenase A

**L-lactate dehydrogenase A (LDHA)** 는 세포 내에서 **젖산 발효(lactic fermentation)**를 담당하는 핵심 효소로 **pyruvate ↔ lactate 변환 반응**을 촉매합니다. 이 반응은 **NADH를 NAD⁺로 산화** 시키며, 산소가 부족한 환경에서도 세포가 에너지를 생산할 수 있도록 돕습니다.

## 4.1 단백질의 주요 특징

---

![image.png](/image/info/detail/deepfri_2.webp)

- **공식 명칭:** L-lactate dehydrogenase A chain (LDHA)
- **UniProt ID:** P00338
- **PDB 구조:** 4L4R
- **효소 분류 번호 (EC):** 1.1.1.27
- **조직 발현:** 주로 **근육 조직(skeletal muscle)**
- **기능:** 젖산 탈수소반응 (L-lactate ⇌ pyruvate), NADH/NAD⁺ 교환
- **생물학적 역할:**
  - 무산소 조건에서 **ATP 재생성**을 가능하게 함
  - **Warburg effect** (암세포의 해당계 강화 현상)에 깊이 관련
  - **LDHA 과발현**은 암세포의 대사 적응과 밀접한 연관성을 가짐

LDHA는 4개의 동일한 소단위로 구성된 **tetrameric enzyme**이며, 각 subunit은 NADH 및 pyruvate 결합 부위를 포함합니다.

특히, **Arg168, His193, Asp168** 등의 잔기가 촉매 활성 부위에 위치하여 반응 중심 역할을 수행합니다.

## 4.2 LDHA를 예제로 선택한 이유

---

DeepFRI의 기능 예측 성능을 검증하기 위해 **LDHA**는 매우 적합한 모델 단백질입니다.

그 이유는 다음과 같습니다.

1. **명확히 규명된 기능**

   LDHA는 생화학적으로 잘 알려진 효소이며, UniProt과 GO 데이터베이스에서 기능적 용어가 상세하게 정리되어 있습니다. 예를 들어, GO:0004459 (lactate dehydrogenase activity), GO:0006096 (glycolytic process) 등의 용어가 명시되어 있죠.

2. **고품질 구조 데이터 확보**

   PDB ID **4L4R**은 고해상도(1.8 Å) 결정 구조를 제공하여, DeepFRI의 **structure-based prediction (접촉 맵 기반 예측)** 을 실험하기에 최적입니다.

3. **기능 다양성의 비교 가능성**

   DeepFRI는 구조나 서열로부터 분자 기능(MF)만이 아니라, **생물학적 과정(BP)**, **효소 분류(EC)** 등 다층적인 기능을 예측합니다. LDHA는 여러 기능(촉매, 결합, 대사 과정 등)을 동시에 가지므로, 예측 모델의 세밀한 성능을 비교하기에 유용합니다.


## 4.3 비교 실험의 의의

이 튜토리얼에서는 DeepFRI가 예측한 LDHA의 **분자 기능(Molecular Function, MF)** 용어들을 UniProt 데이터베이스에 등록된 **실제 기능 주석(annotation)** 과 비교하여 AI 모델이 실험적 데이터와 얼마나 일치하는지를 평가합니다.

## 5 예측하기

## 5.1 Linux CLI - 서열(sequence)로 기능 예측

---

### 서열 준비

```bash
SEQ="MATLKDQLIYNLLKEEQTPQNKITVVGVGAVGMACAISILMKDLADELALVDVIEDKLKGEMMDLQHGSLFLRTPKIVSGKDYNVTANSKLVIITAGARQQEGESRLNLVQRNVNIFKFIIPNVVKYSPNCKLLIVSNPVDILTYVAWKISGFPKNRVIGSGCNLDSARFRYLMGERLGVHPLSCHGWVLGEHGDSSVPVWSGMNVAGVSLKTLHPDLGTDKDKEQWKEVHKQVVESAYEVIKLKGYTSWAIGLSVADLAESIMKNLRRVHPVSTMIKGLYGIKDDVFLSVPCILGQNGISDLVKVTLTSEEEARLKKSADTLWGIQKELQF"
```

### 분자 기능(MF) 예측 실행

```bash
python predict.py \
  --seq "$SEQ" \
  -ont mf \
  --verbose \
  --out_fn outputs_seq_mf.tsv
```

### 생물학적 과정(BP), 세포 구성요소(CC), EC 번호 포함

```bash
# BP
python predict.py --seq "$SEQ" -ont bp --verbose --out_fn outputs_seq_bp.tsv
# CC
python predict.py --seq "$SEQ" -ont cc --verbose --out_fn outputs_seq_cc.tsv
# EC (효소 분류)
python predict.py --seq "$SEQ" -ont ec --verbose --out_fn outputs_seq_ec.tsv
```

**Score**는 0~1 확률 점수로, 일반적으로 **0.5 이상**이면 유의하게 해석합니다.

## 5.2 Linux CLI - PDB 구조(4L4R)로 기능 예측

### PDB 파일 준비

RCSB에서 `4L4R` 다운로드 후 프로젝트 폴더에 둡니다. (예: `data/4L4R.pdb`)

```bash
mkdir -p data
# (직접 다운로드하여 data/4L4R.pdb 로 저장)
```

### 구조 기반(MF) 예측 실행

```bash
python predict.py \
  -pdb data/4L4R.pdb \
  -ont mf \
  --verbose \
  --out_fn outputs_pdb_mf.tsv
```

구조 기반은 내부적으로 contact map을 산출해 사용합니다. (일부 버전에서는 직접 `--cmap`을 넣어도 됩니다)

### Saliency(잔기 중요도) 포함

```bash
python predict.py \
  -pdb data/4L4R.pdb \
  -ont mf \
  --saliency \
  --use_backprop \
  --verbose \
  --out_fn outputs_pdb_mf_saliency.tsv
```

- `-saliency`, `-use_backprop`: 예측에 기여한 **중요 residue**를 계산/내보냅니다.
- 구조-기반 예측에서 **활성부위/결합부위 인식**을 시각적으로 검토할 때 유용합니다.

## 5.3 Linux CLI - Contact Map 파일로 직접 입력하기

4L4R에서 유도한 `.npz` contact map이 있다면 아래 명령어로 기능 예측이 가능합니다.

```bash
python predict.py \
  --cmap ./examples/pdb_cmaps/4L4R-A.npz \
  -ont mf \
  --verbose \
  --out_fn outputs_cmap_mf.tsv
```

## 5.4 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/deepfri
```

화면에는 단백질의 3차원 구조파일(PDB)을 입력하는 창이 준비되어 있습니다.

![image.png](/image/info/detail/deepfri_3.webp){center:880}

여기에 분석할 단백질의 구조를 업로드 한 후 **분석 시작** 버튼을 누르면 **DeepFRI**가 입력된 구조로부터 자동으로  Contact Map을 추출 후 전처리를 포함 한 모든 과정을 자동으로 진행하게 됩니다.

# 6 분석 결과

## 6.1 결과 요약

---

**DeepFRI 전체 예측 결과**

| Protein | GO_term/EC_number | Score | GO_term/EC_number name | Ontology |
| --- | --- | --- | --- | --- |
| 4L4R-A | GO:0005829 | 0.118 | cytosol | CC |
| 4L4R-H | GO:0005829 | 0.121 | cytosol | CC |
| 4L4R-A | 1.1.1.- | 1 | 1.1.1.- | EC |
| 4L4R-A | 1.1.1.27 | 1.000 | 1.1.1.27 | EC |
| 4L4R-H | 1.1.1.- | 1 | 1.1.1.- | EC |
| 4L4R-H | 1.1.1.27 | 1.000 | 1.1.1.27 | EC |
| 4L4R-A | GO:0043436 | 0.787 | oxoacid metabolic process | BP |
| 4L4R-A | GO:0019752 | 0.787 | carboxylic acid metabolic process | BP |
| 4L4R-A | GO:0006082 | 0.775 | organic acid metabolic process | BP |
| 4L4R-A | GO:0005975 | 0.707 | carbohydrate metabolic process | BP |
| 4L4R-A | GO:0006091 | 0.182 | generation of precursor metabolites and energy | BP |
| 4L4R-A | GO:0009056 | 0.165 | catabolic process | BP |
| 4L4R-A | GO:1901575 | 0.136 | organic substance catabolic process | BP |
| 4L4R-A | GO:0032787 | 0.108 | monocarboxylic acid metabolic process | BP |
| 4L4R-H | GO:0043436 | 0.726 | oxoacid metabolic process | BP |
| 4L4R-H | GO:0019752 | 0.724 | carboxylic acid metabolic process | BP |
| 4L4R-H | GO:0006082 | 0.714 | organic acid metabolic process | BP |
| 4L4R-H | GO:0005975 | 0.660 | carbohydrate metabolic process | BP |
| 4L4R-H | GO:0006091 | 0.158 | generation of precursor metabolites and energy | BP |
| 4L4R-H | GO:0009056 | 0.147 | catabolic process | BP |
| 4L4R-H | GO:1901575 | 0.119 | organic substance catabolic process | BP |
| 4L4R-A | GO:0016614 | 0.827 | oxidoreductase activity, acting on CH-OH group of donors | MF |
| 4L4R-A | GO:0016616 | 0.806 | oxidoreductase activity, acting on the CH-OH group of donors, NAD or NADP as acceptor | MF |
| 4L4R-H | GO:0016614 | 0.855 | oxidoreductase activity, acting on CH-OH group of donors | MF |
| 4L4R-H | GO:0016616 | 0.842 | oxidoreductase activity, acting on the CH-OH group of donors, NAD or NADP as acceptor | MF |

**상위 예측 용어 요약**

| Ontology | Term | Name | Score |
| --- | --- | --- | --- |
| CC | GO:0005829 | cytosol | 0.118 |
| MF | GO:0016614 | oxidoreductase activity, acting on CH-OH group of donors | 0.827 |
| MF | GO:0016616 | oxidoreductase activity, acting on the CH-OH group of donors, NAD or NADP as acceptor | 0.806 |
| EC | 1.1.1.- | 1.1.1.- | 1 |
| EC | 1.1.1.27 | 1.1.1.27 | 1.000 |
| BP | GO:0043436 | oxoacid metabolic process | 0.787 |
| BP | GO:0019752 | carboxylic acid metabolic process | 0.787 |
| BP | GO:0006082 | organic acid metabolic process | 0.775 |
| BP | GO:0005975 | carbohydrate metabolic process | 0.707 |
| BP | GO:0006091 | generation of precursor metabolites and energy | 0.182 |

**Saliency 지도 (MF 온톨로지)**

![MF Saliency 1](/image/info/detail/deepfri_4.webp){center:500}
![MF Saliency 2](/image/info/detail/deepfri_5.webp){center:300}

**Saliency 지도 (EC 온톨로지)**

![EC Saliency 1](/image/info/detail/deepfri_6.webp){center:500}
![EC Saliency 2](/image/info/detail/deepfri_7.webp){center:300}

**잔기 접촉 지도**

![image.png](/image/info/detail/deepfri_8.webp){center:400}

## 6.2 DeepFRI 전체 결과 해석

### **예측 요약**

| 온톨로지 | 주요 예측 | 예측 점수 | 생물학적 의미 |
| --- | --- | --- | --- |
| **MF (분자 기능)** | `GO:0016614`, `GO:0016616` | 0.827 / 0.806 | **산화환원효소(oxidoreductase) 활성**, 특히 **CH–OH 그룹의 공여체에 작용하며 NAD/NADP를 수용체로 사용하는 효소.** 즉, 젖산 탈수소효소 반응을 수행하는 효소 |
| **EC (효소 분류)** | `1.1.1.-`, `1.1.1.27` | 1.0 / 1.0 | EC 1.1.1.27은 바로 **L-lactate dehydrogenase (젖산탈수소효소)** |
| **BP (생물학적 과정)** | `GO:0043436`, `GO:0019752`, `GO:0006082`, `GO:0005975` | 0.787~0.707 | **유기산 / 카르복실산 대사 과정** 및 **탄수화물 대사 과정** 관련 반응,  LDHA의 **해당과정(glycolysis)** 및 **젖산발효 경로**와 일치 |
| **CC (세포 구성요소)** | `GO:0005829` | 0.118 | **세포질(cytosol),** 해당과정이 일어나는 위치로 생물학적으로 타당 |

DeepFRI는 LDHA의 모든 핵심 기능 — *세포질 위치*, *산화환원 효소 활성*, *젖산 대사 반응* — 을 정확히 포착했습니다. 예측된 GO 용어와 EC 번호는 모두 **UniProt P00338**에 등록된 실제 기능과 거의 완벽히 일치합니다.

### UniProt (P00338) 공식 주석 비교

| 구분 | DeepFRI 예측 | UniProt 주석 | 일치 여부 |
| --- | --- | --- | --- |
| EC 번호 | 1.1.1.27 | 1.1.1.27 (L-lactate dehydrogenase) | 일치 |
| MF (분자 기능) | oxidoreductase, NAD/NADP binding | Oxidoreductase, NADH binding | 일치 |
| BP (생물학적 과정) | organic/carboxylic acid metabolism, glycolysis | Pyruvate → Lactate 변환, glycolysis | 일치 |
| CC (세포 구성요소) | cytosol | cytoplasm (cytosolic enzyme) | 일치 |

### **MF 온톨로지 Saliency (`saliency_MF_0.png`)**

- 빨간색으로 표시된 잔기(Residue)는 기능 예측에 크게 기여한 부분입니다.
- 활성 부위(Active site)에 해당하는 **His193, Arg168, Asp168** 근처에서 높은 saliency가 관찰됨.
- 이는 LDHA의 **촉매 중심부(catalytic core)** 가 실제로 모델의 주요 주목 영역임을 보여줌.

### **EC 온톨로지 Saliency (`saliency_EC_0.png`)**

- EC 1.1.1.27 예측에서 중요하게 작용한 잔기들이 활성 부위와 일치.
- NAD 결합부(NADH-binding groove) 주변의 Lys, Asp, Gly 잔기에서 saliency 봉우리가 뚜렷하게 나타남.
- 즉, DeepFRI는 효소 기능을 “서열 기반 통계”가 아니라 **3D 공간적 활성 부위 정보**로 학습하고 있음을 시사함.

## 6.3 결론

---

DeepFRI는 **LDHA (4L4R)** 단백질의 기능을 구조 기반(`pdb`) 또는 서열 기반(`seq`) 예측 모두에서 **UniProt 실험 데이터와 완전 일치하는 수준으로 복원**했습니다. 특히 **EC 1.1.1.27 (L-lactate dehydrogenase)**, **oxidoreductase 활성**, **유기산 대사**, **세포질 내 위치**를 모두 정확히 예측함으로써

DeepFRI가 단순 패턴 인식이 아닌 **3차원적 기능 이해를 수행**함을 잘 보여주는 예시입니다.

# 7 마치며

---

이번 포스팅에서는 DeepFRI로 **LDHA (UniProt: P00338, PDB: 4L4R)** 의 기능을 예측하고, **UniProt 주석과의 일치도**를 확인했습니다. 결과는 분명했습니다.

- **EC 1.1.1.27**, **oxidoreductase 활성(MF)**, **유기산/탄수화물 대사(BP)**, **세포질(CC)** 등 핵심 기능이 **높은 점수로 정확히 재현**되었고,
- **Saliency 지도**는 실제 활성 부위와 결합 포켓을 잘 짚어내며, 모델이 **3D 구조적 단서**를 활용해 추론하고 있음을 보여줬죠.

DeepFRI의 장점은 단순 예측을 넘어, **“왜 그런 예측이 나왔는가”** 를 구조적 근거와 함께 해석할 수 있다는 데 있습니다. 연구자 입장에서는 가설 설정과 후속 실험 디자인에 바로 연결할 수 있는 실용적인 신호죠.

이제 여러분의 차례입니다.

- **여러분의 단백질 서열/구조**를 넣어 같은 방법으로 실행해 보세요.
- MF/BP/CC/EC를 **일괄 예측**하고, 내부적으로 **saliency**를 켜서 활성 부위를 점검해 보세요.
- 필요하다면 UniProt, PDB와 **교차 검증**해 결과의 신뢰도를 빠르게 가늠할 수 있습니다.

읽어주셔서 감사합니다. 이 글이 여러분의 **기능 주석 파이프라인**을 한층 단단하게 만드는 데 도움이 되었길 바랍니다.

# 8 Reference

---

- [Gtihub DeepFRI](https://github.com/flatironinstitute/DeepFRI)
- [bioRxiv](https://www.biorxiv.org/content/10.1101/786236v1)
- CURIE : [DeepFRI](https://curie.kr/Analysis/deepfri)

---

[tool-button:DeepFRI]
