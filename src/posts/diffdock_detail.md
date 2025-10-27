---
layout: post
title: "Diffdock : B-RAF에 소라페닙이 결합 한 구조 (1uwh)를 기반으로 B-RAF만 존재하는 구조에 소라페닙 SMLIES로 도킹 결과 예측"
description: "최신 AI 분자 도킹 모델 DiffDock을 사용하여, B-RAF 단백질과 항암제 소라페닙(Sorafenib)의 결합 구조를 예측하고 실제 PDB 데이터(1UWH)와 비교 분석"
categories: [analysis]
tags: [DiffDock, 분자 도킹, Protein-Ligand Docking, B-RAF, 소라페닙, Sorafenib, AI 신약 개발, 확산 모델, 1UWH]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/diffdock_1.webp"
comment_id: "diffdock_detail"
---

![image.png](/image/info/detail/diffdock_1.webp){center:880}

이번 글에서는 **AI 기반 단백질–리간드 도킹 모델인 [DiffDock](https://github.com/gcorso/DiffDock)** 을 소개하고, 실제 예제로 **B-RAF 단백질과 소라페닙(Sorafenib)** 간의 결합을 예측해보겠습니다.

단백질과 리간드의 결합 구조를 정확히 예측하는 일은 신약 개발 과정의 핵심 단계이지만, 전통적인 도킹 알고리즘은 복잡한 탐색 공간과 높은 계산 비용 때문에 시간이 오래 걸립니다.

**DiffDock은 이러한 한계를 극복하기 위해 등장한 최신 딥러닝 모델로**, 확산 확률 모델(Diffusion Model) 기반의 접근법을 통해 **리간드의 결합 위치와 자세(binding pose)를 확률적으로 생성·예측**합니다.

이번 글에서는 DiffDock의 기본 개념과 설치 방법, 사용법을 차근차근 살펴본 뒤 PDB 구조 **1UWH** (소라페닙이 결합된 B-RAF 복합체)를 참고하여 **소라페닙의 SMILES 문자열을 이용해 B-RAF 단독 구조에 대한 도킹 결과를 재현 및 예측**하는 실습 예제를 함께 진행해보겠습니다.

# 1 사용된 도구

---

- **Diffdock** 단백질과 리간드의 결합구조를 예측하는 모델

# 2 DiffDock 설치 튜토리얼

DiffDock은 **확산 모델(Diffusion Model)** 기반의 단백질–리간드 도킹 예측 도구로, GPU 환경에서 PyTorch를 사용해 학습 및 추론을 수행합니다.

설치는 두 가지 방식 중 하나를 선택할 수 있습니다.

- **Anaconda 환경 설정 (로컬 설치)**
- **Docker 컨테이너 사용 (격리된 환경, 재현성 높음)**

## 2.1 Anaconda 환경 설정
---


DiffDock은 **Anaconda** 또는 **Miniconda** 환경에서 손쉽게 설정할 수 있습니다. 아래 명령어를 순서대로 실행하세요.

### 저장소 복제

```bash
git clone https://github.com/gcorso/DiffDock.git
cd DiffDock
```

### Conda 환경 생성 및 활성화

```bash
conda env create --file environment.yml
conda activate diffdock
```

environment.yml 파일에는 PyTorch, RDKit, PyTorch Geometric 등 DiffDock 실행에 필요한 모든 패키지와 버전이 정의되어 있습니다.

### 설치 확인

환경이 제대로 설정되었는지 아래 명령으로 확인합니다.

```bash
python -c "import torch; import rdkit; print('DiffDock environment ready!')"
```

GPU를 사용하는 경우, PyTorch가 CUDA를 인식하는지 확인하세요.

```bash
python -c "import torch; print(torch.cuda.is_available())"
```

`True`가 출력되면 GPU 사용이 가능합니다.

## 2.2 Docker 컨테이너 사용

---

DiffDock 저장소에는 **Dockerfile**이 포함되어 있어, 완전히 격리된 환경에서 실행할 수 있습니다.

이 방법은 환경 충돌이 적고, 재현성 높은 실험에 적합합니다.

### Docker 이미지 빌드

```bash
docker build . -f Dockerfile -t diffdock
```

로컬에서 직접 컨테이너를 빌드하면 최신 코드를 기반으로 이미지를 생성할 수 있습니다.

### Docker Hub에서 미리 빌드된 이미지 다운로드

공식 팀이 배포한 이미지를 바로 사용할 수도 있습니다.

```bash
docker pull rbgcsail/diffdock
```

### GPU 사용 여부 확인

DiffDock은 **GPU 사용 시 성능이 약 10배 이상 향상**됩니다. 다음 명령으로 GPU를 Docker에서 사용할 수 있는지 확인하세요.

```bash
docker run --rm --gpus all nvidia/cuda:11.7.1-devel-ubuntu22.04 nvidia-smi
```

GPU가 인식되지 않는다면, NVIDIA Docker toolkit이 제대로 설치되었는지 확인하세요.

설치 안내: NVIDIA Container Toolkit Guide

### 컨테이너 실행

```bash
# GPU 환경에서 실행
docker run -it --gpus all --entrypoint /bin/bash rbgcsail/diffdock

# CPU 환경에서 실행 (GPU가 없는 경우)
docker run -it --entrypoint /bin/bash rbgcsail/diffdock
```

### 컨테이너 내부 환경 활성화

컨테이너 내부에서 아래 명령어로 DiffDock 환경을 활성화합니다.

```bash
micromamba activate diffdock
```

이제 컨테이너 안에서 DiffDock 예측 코드를 실행할 수 있습니다.

# 3 기본 사용 용법

## 3.1 단일 복합체 예측 (Single Complex Prediction)

---

가장 기본적인 사용법은 **하나의 단백질–리간드 복합체**를 예측하는 방식입니다.

DiffDock은 단백질과 리간드 입력을 다음과 같이 받을 수 있습니다.

### 입력 형식

| 항목 | 설명 | 예시 |
| --- | --- | --- |
| 단백질 입력 | 단백질의 구조 파일(.pdb) 또는 아미노산 서열 | `--protein_path protein.pdb`또는
`--protein_sequence GIQSYCTPPYSVLQDPPQPVV` |
| 리간드 입력 | 리간드의 SMILES 문자열 또는 화학 구조 파일(.sdf, .mol2 등) | `--ligand ligand.sdf`또는
`--ligand "COc(cc1)ccc1C#N"` |

### 단일 복합체 예측 명령어

```bash
python -m inference \
  --config default_inference_args.yaml \
  --protein_path examples/proteins/sample_protein.pdb \
  --ligand "COc(cc1)ccc1C#N" \
  --out_dir results/single_complex
```

## 3.2 여러 복합체 동시 예측 (Batch Prediction)

---

여러 단백질과 리간드 조합을 **한 번에 도킹**하고 싶다면 입력 정보를 **CSV 파일** 형태로 만들어서 지정할 수 있습니다.

### CSV 입력 파일 형식

| 컬럼명 | 설명 | 예시 |
| --- | --- | --- |
| `complex_name` | 복합체 이름 (결과 저장 시 폴더명으로 사용) | `braf_sorafenib` |
| `protein_path` | 단백질 PDB 파일 경로 (비워두면 서열 입력 사용) | `data/protein/braf.pdb` |
| `protein_sequence` | 단백질 서열 (PDB 없을 때만 사용) | `MTEYKLVVVGAGGVGKSALTIQLIQNHFV...` |
| `ligand_description` | 리간드 SMILES 또는 구조 파일 경로 | `CCC(CC1=CC=CC=C1)NC(=O)...` |

**예시 CSV (`data/protein_ligand_example.csv`)**

```text
complex_name,protein_path,protein_sequence,ligand_description
braf_sorafenib,data/braf.pdb,,CCOC1=C(C=CC=C1NC(=O)C2=CC=NC3=C2C=CC(=C3)NC4=CC=CC=C4)C(=O)NC5=CC=CC=C5
```

### 여러 복합체 예측 명령어

```bash
python -m inference \
  --config default_inference_args.yaml \
  --protein_ligand_csv data/protein_ligand_example.csv \
  --out_dir results/multiple_predictions
```

## 3.3 모델 초기 실행 시 주의사항

---

DiffDock을 처음 실행하면 내부적으로 **SO(2)** 및 **SO(3)** 회전군 분포에 대한 **캐시 테이블**을 생성합니다.

이 작업은 단 한 번만 수행되며, 약 **2~5분 정도 소요**됩니다. 이후부터는 빠르게 실행됩니다.

```text
[Info] Precomputing SO(2), SO(3) lookup tables...
[Info] Cached in ~/.cache/diffdock/
```

# 4 B-RAF – Sorafenib (PDB: 1UWH)

이번 실습에서는 **단백질–리간드 도킹 예측의 대표 사례**로 **B-RAF 단백질**과 항암제 **Sorafenib (소라페닙)** 을 선정했습니다. 이 조합은 실제 결정 구조가 밝혀져 있으며, DiffDock의 특성을 가장 잘 보여줄 수 있는 실험적 모델입니다.

## 4.1 단백질: B-RAF (Rapidly Accelerated Fibrosarcoma Kinase)

---

![image.png](/image/info/detail/diffdock_2.webp)

| 항목 | 내용 |
| --- | --- |
| **공식 명칭** | B-RAF Serine/Threonine-protein kinase B-RAF |
| **UniProt ID** | P15056 |
| **PDB ID** | 1UWH |
| **단백질 분류** | Protein kinase / Signal transduction enzyme |
| **주요 기능** | MAPK 신호전달 경로의 상위 단계에서 세포 성장·분화 조절 |
| **활성 부위** | ATP 결합 포켓 및 activation loop (Val471, Lys483 등) |
| **생물학적 의의** | B-RAF의 V600E 돌연변이는 흑색종·갑상선암 등 다양한 암의 주요 발암 요인으로 작용 |

B-RAF는 세포 내에서 **MAPK 경로를 조절하는 핵심 키나아제**로 ATP 결합부위의 입체 배열이 작은 리간드에 의해 쉽게 억제될 수 있다는 특징을 가집니다. 따라서 DiffDock 처럼 **리간드 결합 포켓의 정확한 공간적 위치 예측이 중요한 모델**을 검증하기에 이상적입니다.

## 4.2 리간드: Sorafenib (소라페닙)

---

![image.png](/image/info/detail/diffdock_3.webp)

| 항목 | 내용 |
| --- | --- |
| **화학식** | C₂₁H₁₆ClF₃N₄O₃ |
| **SMILES** | `c1c(ccc(c1C(F)(F)F)*)NC(=O)Nc1ccc(cc1)Oc1ccnc(c1)C(=O)NC` |
| **분자 질량** | 약 464.8 Da |
| **분류** | 다중 kinase 억제제 (Multi-target Tyrosine Kinase Inhibitor) |
| **작용 기전** | RAF kinase 를 포함한 MAPK 경로 억제 → 세포 증식 차단 |
| **결합 특징** | ATP 결합 부위의 hinge region과 수소 결합을 형성하며, 疎수성 상호작용으로 포켓 내에 안정화 |
| **임상 활용** | 간세포암, 신장암, 갑상선암 등 다양한 암종에서 허가된 표적 항암제 |

Sorafenib은 B-RAF의 ATP 결합 포켓을 특이적으로 공략하는 **대표적 저분자 억제제**입니다. 이는 DiffDock이 리간드의 3D 결합 자세를 정확히 예측할 수 있는지 평가하기 좋은 테스트 케이스가 됩니다.

## 4.3 선정 이유

---

DiffDock은 기존의 rigid docking 알고리즘과 달리 **확산 확률 모델(Diffusion Model)** 을 이용해 **리간드의 공간적 pose 분포를 생성**합니다. 즉, 단백질 포켓의 미세한 형상 변화나 리간드의 유연성까지 통계적으로 포착할 수 있습니다.

B-RAF – Sorafenib 은 이러한 특징을 검증하기에 이유 있는 선택입니다.

- **실제 결정 구조 존재 → Ground Truth 비교 가능**
- **강력한 결합 친화성 → 명확한 결합 포켓 형태**
- **구조 vs 서열 입력 두 방식 모두 활용 가능**
- **DiffDock의 3D 확산 모델 특성 검증**

따라서 이번 실습에서는 “결합 구조가 실험적으로 밝혀진 B-RAF (1UWH) 복합체를 참고해 B-RAF 단백질에 소라페닙 SMILES 입력으로 도킹을 예측하는 DiffDock 실습” 을 진행합니다.

이 예제는 **DiffDock의 확률적 3D 도킹 모델이 어떻게 실제 결합 자세를 복원하는지** 를 직관적으로 보여주는 대표 사례가 될 것입니다.

## 5 예측하기

## 5.1 Linux CLI 이용 - “서열만”으로 도킹 (ESMFold → DiffDock)

---

### 단백질 서열 저장 (질문에 주신 B-RAF kinase 도메인)

```bash
cat > data/braf_kinase.fasta << 'EOF'
>BRaf_kinase_domain
DDWEIPDGQITVGQRIGSGSFGTVYKGKWHGDVAVKMLNVTAPTPQQLQAFKNEVGVLRKTRHVNILLFMGYSTAPQLAIVTQWCEGSSLYHHLHIIETKFEMIKLIDIARQTAQGMDYLHAKSIIHRDLKSNNIFLHEDLTVKIGDFGLATVKSRWSGSHQFEQLSGSILWMAPEVIRMQDKNPYSFQSDVYAFGIVLYELMTGQLPYSNINNRDQIIFMVGRGYLSPDLSKVRSNCPKAMKRLMAECLKKKRDERPLFPQILASIELLARSLPK
EOF
```

### ESMFold로 구조 생성

DiffDock는 PDB 입력이 가장 확실합니다. 로컬 ESMFold/서버를 이용해 **PDB로 만들어** 주세요.

### 소라페닙 SMILES 저장

```bash
mkdir -p data/ligands
# 소라페닙 SMILES 한 줄 저장 (사용하시는 표준 SMILES 문자열을 넣으세요)
echo 'CCOC1=CC(=CC(=C1)NC(=O)NC2=CC=C(C=C2)OC3=NC=CC(=C3)C(=O)NC)C(F)(F)F' > data/ligands/sorafenib.smi
```

### 도킹 실행 (서열→PDB 생성 후)

```bash
python -m inference \
  --config default_inference_args.yaml \
  --protein_path data/braf_from_seq.pdb \
  --ligand data/ligands/sorafenib.smi \
  --samples_per_complex 20 \
  --out_dir results/braf_seq_sorafenib
```

## 5.2 Linux CLI 이용 -  “PDB 구조”로 도킹 (1UWH 단백질만 분리)

### UWH에서 단백질만 추출

1UWH는 B-RAF–소라페닙 **복합체**이므로, 리간드 및 물/이온을 제거한 **단백질만의 PDB**를 준비합니다. (예: PyMOL에서 `remove not polymer.protein` 후 `save data/braf_only_1UWH.pdb`)

### 소라페닙 SMILES 준비

```bash
echo 'CCOC1=CC(=CC(=C1)NC(=O)NC2=CC=C(C=C2)OC3=NC=CC(=C3)C(=O)NC)C(F)(F)F' > data/ligands/sorafenib.smi
```

### 도킹 실행 (PDB 직접 입력)

```bash
python -m inference \
  --config default_inference_args.yaml \
  --protein_path data/braf_only_1UWH.pdb \
  --ligand data/ligands/sorafenib.smi \
  --samples_per_complex 20 \
  --out_dir results/braf_pdb_sorafenib
```

## 5.3 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/diffdock
```

화면에서는 단백질의 구조를 입력할 수 있는 두가지 방식이 준비되어 있습니다. Curie에서는 현재 PDB 형태의 입력 방식을 지원합니다.

또한 리간드의 구조를 SMILES 문자열을 통해 입력받을 수 있으며, 부가적으로 도킹 결과물의 수와 추론 단계 설정을 진행할 수 있습니다.

![image.png](/image/info/detail/diffdock_4.webp)

여기에 분석 할 단백질의 구조를 업로드 하고 리간드의 SMILES 문자열을 임력 후 분석 시작 버튼을 누르면 **DiffDock** 도구에 의해 단백질과 리간드의 복합체 구조를 자동으로 예측합니다.

# 6 분석 결과

## 6.1 **DiffDock** 예측 결과 요약

해당 폴더(`diffdock_DiffDock_1015154747`)는 단일 도킹 실험 결과를 저장하는 기본 결과 폴더입니다.

---

```text
diffdock_DiffDock_1015154747/
├── rank1.sdf
├── rank1_confidence0.33.sdf
├── rank1_reverseprocess.pdb
├── rank2_confidence0.30.sdf
├── rank2_reverseprocess.pdb
├── rank3_confidence0.26.sdf
├── rank3_reverseprocess.pdb
├── rank4_reverseprocess.pdb
├── rank5_confidence0.24.sdf
└── rank5_reverseprocess.pdb
```

### 도킹 결과

![image.png](/image/info/detail/diffdock_5.webp)

### 리간드 Align

![image.png](/image/info/detail/diffdock_6.webp)

## 6.3 종합 평가

---

DiffDock이 예측한 소라페닙의 결합 위치는 **B-RAF의 ATP 결합 포켓(kinase hinge region)** 중심에 정확히 자리하고 있습니다.

이는 실제 결정 구조(PDB: 1UWH)에서 관찰되는 소라페닙의 결합 부위와 일치하며 모델이 단백질의 전역 형태를 고려해 올바른 **binding site localization** 을 수행했음을 보여줍니다.

주요 관찰점

- 소라페닙 분자는 **β-sheet와 α-helix 사이의 좁은 포켓** 내부에 배치되어 있음.
- 이 영역은 ATP와 경쟁적으로 결합하는 **키나아제의 catalytic cleft** 로 실제 억제제가 작용하는 위치와 정확히 일치합니다.

# 7 마치며

---

이번 실습에서는 **DiffDock**을 활용해 실제 구조가 알려진 **B-RAF–소라페닙 복합체(1UWH)** 를 기반으로 단백질 구조(`B-RAF`)와 리간드의 화학식(`SMILES`)만으로 결합 자세를 예측해보았습니다.

그 결과, DiffDock은 **실제 결정 구조와 거의 동일한 결합 위치와 방향성을 복원**했으며 ATP 결합 포켓 중심에서의 수소 결합과疎수성 상호작용까지 올바르게 재현했습니다.

이는 DiffDock이 단순한 도킹 스코어 기반 탐색을 넘어, **3차원 공간에서의 화학적 상호작용 패턴을 확률적으로 학습**하고 있음을 잘 보여줍니다. 이처럼 DiffDock은 구조 정보가 제한된 상황에서도, AI가 화합물의 결합 양상을 합리적으로 추론할 수 있다는 가능성을 실증하는 대표적인 도구입니다.

앞으로는 이러한 확산 기반 도킹 모델들이 전통적인 물리 기반 시뮬레이션과 결합되어 **신약 후보 발굴(Drug Screening)** 및 **단백질–리간드 상호작용 해석**에 새로운 표준으로 자리 잡을 것으로 기대됩니다.

# 8 Reference

---

- [Github DiffDock](https://github.com/gcorso/DiffDock)
- [arXiv](https://arxiv.org/abs/2210.01776)
- [arXiv](https://arxiv.org/abs/2402.18396)
- CURIE : [DiffDock](https://curie.kr/Analysis/diffdock)

---

[tool-button:Diffdock]
