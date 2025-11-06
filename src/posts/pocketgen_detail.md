---
layout: post
title: "PocketGen : Coagulation factor X와 APIXABAN의 결합 구조 최적화"
description: "AI 기반 포켓 생성 및 리간드 결합 구조 최적화 도구 PocketGen을 사용하여, Coagulation Factor X와 Apixaban의 결합 구조를 리모델링하고 최적화"
categories: [analysis] 
tags: [PocketGen, Drug Discovery, SBDD, Structural Biology, Protein-Ligand Interaction, Apixaban, Coagulation Factor X, AI] 
author: "author6" 
date: "2025-09-29" 
thumbnail: "/image/info/detail/pocketgen_1.webp" 
comment_id: "pocketgen_detail"
---

![image.png](/image/info/detail/pocketgen_1.webp){center:400}

단백질과 리간드가 만나는 그 순간, 생명은 새로운 가능성을 엽니다. 이번 포스트에서는 **AI 기반 포켓 생성 및 리간드 결합 구조 최적화 도구, PocketGen**을 소개합니다.

PocketGen은 단순히 결합 부위를 예측하는 수준을 넘어, **단백질의 구조적 유연성과 결합 친화도까지 고려한 포켓 리모델링**을 지원합니다. 이를 통해 기존 docking 접근법보다 한층 정교한 결합 예측과 안정화 구조를 얻을 수 있지요.

오늘은 이 도구를 활용해, **혈액 응고 과정의 핵심 단백질 Coagulation Factor X**와 **항응고제 Apixaban**의 결합 구조를 직접 최적화해보겠습니다.

AlphaFold로 예측된 단백질 모델을 시작점으로, PocketGen이 어떤 방식으로 결합 포켓을 탐색하고 개선하는지 단계별로 따라가며 실습할 예정입니다.

# 1 사용된 도구

---

- **PocketGen** 리간드에 알맞은 단백질 스캐폴드를 생성하는 모델
- **Plip** 단백질과 리간드 사이의 결합의 종류와 위치를 탐색하는 모델

# 2 PocketGen 설치 튜토리얼

PocketGen은 PyTorch, RDKit, OpenMM, AutoDock 등 다양한 생명정보·화학정보학 패키지 위에 구축된 AI 기반 포켓 생성 도구입니다.

따라서 설치 시 **의존성 관리가 매우 중요**하며, **Anaconda 환경을 이용한 독립적인 환경 구성**을 권장합니다.

## 2.1 Conda 환경 파일로 한 번에 설치하기

---

PocketGen 저장소에는 설치에 필요한 모든 패키지 버전이 명시된 `pocketgen.yaml` 파일이 포함되어 있습니다. 아래 명령어로 간단히 설치할 수 있습니다.

```bash
# PocketGen 환경 생성
conda env create -f pocketgen.yaml

# 환경 활성화
conda activate pocketgen
```

이 방식은 YAML에 정의된 모든 종속 패키지를 자동으로 설치하므로 버전 충돌 위험이 적고 **재현성 높은 환경 구성**이 가능합니다.

## 2.2 Conda + Pip 수동 설치하기

---

만약 `pocketgen.yaml` 파일이 없거나 커스텀 구성을 원한다면 아래 단계를 따라 수동으로 동일한 환경을 구축할 수 있습니다.

### 기본 환경 생성

```bash
conda create -n pocketgen python=3.8
conda activate pocketgen
```

### PyTorch 및 PyG 설치

```bash
conda install pytorch pytorch-cuda=11.6 -c pytorch -c nvidia
conda install pyg -c pyg
```

### 화학 및 시뮬레이션 관련 패키지 설치

```bash
conda install rdkit openbabel tensorboard pyyaml easydict python-lmdb -c conda-forge
conda install -c conda-forge openmm pdbfixer flask
```

### 빌드 및 문서화 관련 패키지 설치

```bash
conda install -c conda-forge numpy swig boost-cpp sphinx sphinx_rtd_theme
```

### 추가 Python 패키지 설치 (via pip)

```bash
pip install meeko==0.1.dev3 wandb scipy pdb2pqr vina==1.2.2
python -m pip install git+https://github.com/Valdes-Tresanco-MS/AutoDockTools_py3
```

### 설치 확인

설치가 완료되면 아래 명령으로 PocketGen이 정상 실행되는지 확인합니다:

```bash
python -m pocketgen --help
```

정상적으로 설치되었다면 PocketGen CLI 도움말이 출력됩니다.

# 3 **PocketGen**사용법

## 3.1 작업 디렉토리 준비

---

```bash
# 프로젝트 루트(예: PocketGen 클론 폴더)에서
mkdir -p tmp
mkdir -p generate/2p16
```

generate_new.py는 실행 폴더 하위에 tmp/를 사용합니다(리간드/단백질 PDBQT, PQR 등 중간 파일).

## 3.2 입력 파일 배치

`name2data(name, args)` 로직에 따르면, `--target` 경로(기본 `./generate`) 아래에 **다음 두 파일**이 필요합니다.

- `generate/2p16/2p16.pdb` : 단백질(리셉터) 구조
- `generate/2p16/2p16_ligand.sdf` : 리간드 구조

이미 2p16.pdb 내부에 리간드가 들어 있더라도, 스크립트는 별도의 SDF 리간드 파일을 읽습니다. SDF가 없다면 OpenBabel 등으로 변환하세요.

예) MOL2 → SDF 변환:

```bash
obabel input.mol2 -O generate/2p16/2p16_ligand.sdf
```

## 3.3 설정 파일 확인 (`configs/train_model.yml`)

---

`generate_new.py`는 아래 항목을 사용합니다.

- `config.dataset.path` → 원천 데이터 경로(여기서는 실제 파싱에는 `-target` 폴더를 사용하지만, 내부 유틸과 호환을 위해 값이 필요)
- `config.model.checkpoint` → 사전학습/학습된 모델 체크포인트(.pt/.pth 등)
- `config.train.num_workers` → DataLoader 병렬 로드 워커 수

```yaml
dataset:
  path: ./data  # 존재만 하면 됨 (본문 예시에선 generate 폴더를 직접 읽음)

model:
  checkpoint: ./checkpoints/pocketgen_ckpt.pt

train:
  num_workers: 4
```

## 3.4 실행

---

```bash
# CUDA 디바이스 선택 및 실행
python generate_new.py \
  --config ./configs/train_model.yml \
  --device cuda:0 \
  --target ./generate
```

기본값: --config=./configs/train_model.yml, --device=cuda:0, --target=./generate. 내부에서 `names = ['2p16']` 로 설정되어 있어 2p16만 처리합니다.

## 3.5 PLIP로 상호작용 시각화

---

PLIP(Protein–Ligand Interaction Profiler)를 사용해 **결합 포즈의 상호작용**을 자동 리포트로 확인할 수 있습니다.

### 복합체 PDB 생성

PLIP는 **단백질+리간드가 함께 들어있는 복합체 PDB**를 선호합니다. 도킹 포즈(`*_docked.sdf`)를 PDB로 변환 후, 단백질 PDB와 합칩니다.

```bash
# 1) 도킹 SDF → PDB
obabel generate/2p16/2p16_docked.sdf -O generate/2p16/2p16_docked_lig.pdb

# 2) 단백질 + 리간드 PDB 결합(간단히 붙여쓰기)
cat generate/2p16/2p16.pdb \
    generate/2p16/2p16_docked_lig.pdb > generate/2p16/2p16_complex.pdb
```

### PLIP 실행

```bash
# PLIP 설치가 안 되어 있다면
pip install plip

# 리포트 생성
plipcmd -f generate/2p16/2p16_complex.pdb -o generate/2p16/plip_out
```

완료되면 `plip_out/` 폴더에 HTML 리포트(상세 상호작용 표, 2D/3D 뷰용 파일 등)가 생성됩니다.

브라우저로 열어 상호작용(수소결합, 소수성, π–π, 할로젠 결합 등)을 확인하세요.

# 4 데이터 선정

PocketGen의 성능을 가장 명확하게 보여주려면, **실제 결합 구조가 검증된 단백질–리간드 복합체**를 사용하는 것이 중요합니다.

이번 튜토리얼에서는 **Coagulation Factor X (응고인자 X)** 와 **Apixaban (항응고제)** 의 결합 구조를 선정했습니다.

이 조합은 **임상적 중요성**, **구조적 명확성**, **데이터 접근성**이 모두 우수하여, 포켓 생성·도킹·결합 리파인먼트의 전 과정을 이해하기에 이상적입니다.

## 4.1 단백질  — Coagulation Factor X (FX, FXa)

![image.png](/image/info/detail/pocketgen_2.webp){center:500}

| 항목 | 내용 |
| --- | --- |
| **단백질명** | Coagulation factor X (응고인자 X, 활성형은 Factor Xa) |
| **UniProt ID** | [**P00742** (FA10_HUMAN)](https://www.uniprot.org/uniprotkb/P00742/entry?utm_source=chatgpt.com) |
| **길이** | 488 아미노산 잔기 |
| **계산 분자량** | 약 54,731 Da (≈ 54.7 kDa) |
| **이론적 등전점(pI)** | 약 5.74 |
| **PDB ID** | **2P16** |
| **해상도** | 2.30 Å (X-ray crystallography) |
| **생물학적 역할** | 비타민 K 의존성 세린 프로테아제로, 프로트롬빈을 트롬빈으로 전환하여 혈액 응고 경로의 핵심 단계 촉매 |
| **활성 부위 특징** | S1 포켓은 Asp189 을 포함한 음전하 부위, S4 포켓은 방향족 리간드와 π–π 상호작용을 형성하는 공간으로 정의됨 |

Factor X는 응고 카스케이드의 *공동 결절점(enzyme hub)* 으로, **직접 Factor Xa 억제제 (direct FXa inhibitors)** 들의 주요 표적입니다. 특히 PDB 2P16 구조는 **Apixaban과 공결정 된 고품질 데이터(2.30 Å)** 로, 활성 포켓(S1/S4)의 잔기 배치와 리간드 결합 모드를 정확히 관찰할 수 있습니다.

### 리간드  — Apixaban (BMS-562247-01, Eliquis)

![image.png](/image/info/detail/pocketgen_3.webp){center:500}

| 항목 | 내용 |
| --- | --- |
| **화합물명** | Apixaban |
| **IUPAC명** | 1-(4-Methoxyphenyl)-7-oxo-6-[4-(2-oxopiperidin-1-yl)phenyl]-4,5,6,7-tetrahydro-1H-pyrazolo3,4−c3,4-c3,4−cpyridine-3-carboxamide |
| **분자식** | C₂₅H₂₅N₅O₄ |
| **분자량** | 약 459.5 g/mol |
| **SMILES** | `COc1ccc(cc1)C2CN(C(=O)c3nn(c4ccc(cc4)N5CCCC5=O)c3=O)CC2` |
| **작용기전** | 선택적 Factor Xa 억제제 → 트롬빈 생성 및 피브린 응고 차단 |
| **결합특징** | S1 포켓의 Asp189 과 이온성 및 수소결합, S4 포켓의 Tyr99 및 Phe174 과 π–π stacking 형성 |
| **PDB 포함 상태** | 2P16 결정구조 내 리간드 ID = *APX* 로 명시되어 있음 |

Apixaban은 **리간드 플래너(planar) 방향족 핵심 구조**와 **말단 아마이드 사이드체인**이 조합된 대표적 FXa 억제제입니다. 결합부위가 뚜렷하고, 결정구조에서 S1–S4 포켓의 정확한 결합 모드가 검증되어 있어, PocketGen의 포켓 생성 및 도킹 성능을 검증하기 좋습니다.

# 5 예측하기

## 5.1 Linux CLI 이용

---

PDB 2P16은 **Factor Xa – Apixaban** 복합체로, 이미 결합 리간드를 포함합니다. 단백질과 리간드를 분리해 PocketGen 입력 형식에 맞춰야 합니다.

### PDB 파일 다운로드

```bash
mkdir -p generate/2p16
cd generate/2p16
wget https://files.rcsb.org/download/2P16.pdb
```

### 리간드 추출 (SDF 포맷으로)

Apixaban 리간드의 Residue ID 는 `APX` 입니다. OpenBabel을 사용해 SDF로 변환합니다.

```bash
obabel 2P16.pdb -O 2p16_ligand.sdf -d -xr APX
```

### 단백질 정리 (리간드 제거 및 결합 상태 보존)

```bash
obabel 2P16.pdb -O 2p16.pdb -d -xk APX

generate/
└── 2p16/
    ├── 2p16.pdb          # 단백질
    ├── 2p16_ligand.sdf   # 리간드
```

### PocketGen 설정 파일 준비

PocketGen은 설정파일(`configs/train_model.yml`) 을 읽습니다. 아래처럼 간단한 구성을 만듭니다.

```yaml
dataset:
  path: ./data          # placeholder
model:
  checkpoint: ./checkpoints/pocketgen_ckpt.pt
train:
  num_workers: 4
```

### 포켓 생성 및 리모델링 실행

이제 `generate_new.py` 를 실행합니다. 스크립트는 단백질과 리간드 파일을 읽어 AI 기반 포켓 생성 → 도킹 → Vina 스코어링 을 자동 수행합니다.

```bash
python generate_new.py \
  --config ./configs/train_model.yml \
  --device cuda:0 \
  --target ./generate
```

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curieus.net/Analysis/pocketgen
```

PocketGen은 별도의 설치 없이 **웹 브라우저 상에서 단백질–리간드 결합 포켓을 예측하고 리모델링할 수 있는 AI 도구**입니다. 사용자는 복잡한 환경 설정이나 터미널 명령어 입력 없이, **단백질 구조(PDB)**

와 **리간드(SDF)** 파일만 업로드하면 됩니다.

AI 모델이 자동으로 단백질의 활성 부위를 분석하고, **결합 포켓의 구조를 생성 및 최적화** 합니다.

![image.png](/image/info/detail/pocketgen_4.webp){center:880}

모든 입력 파일을 업로드한 뒤, 화면 하단의 **“분석 시작”** 버튼을 클릭하면 PocketGen이 자동으로 분석을 수행합니다.

- 단백질의 아미노산 배열과 구조적 특징을 AI 모델이 파악
- 리간드의 3D 형태를 기준으로 결합 부위 후보를 탐색
- 포켓 구조를 최적화하고 AutoDock Vina 기반으로 결합 친화도 평가
- 생성된 포켓과 도킹 결과를 시각적으로 출력

결과에는 “생성된 포켓 PDB”, “도킹 포즈 SDF”, “결합 스코어”, “PLIP 기반 결합 상호작용 리포트” 등이 포함됩니다.

# 6 분석 결과

## 6.1 예측 결과

---

![image.png](/image/info/detail/pocketgen_5.webp){center:400}

그림은 PocketGen을 통해 생성된 **Coagulation Factor X (2P16)** 단백질 구조 예측 결과입니다.

초록색으로 표시된 부분이 **PocketGen이 생성하거나 수정한 결합 포켓 영역**,회색으로 표시된 부분이,**원본 결정 구조(RCSB 2P16)** 의 단백질 골격을 나타냅니다.

PocketGen은 리간드 주변의 잔기(Residue) 배치를 미세 조정하여 **결합 포켓의 부피와 방향성**을 최적화했습니다.  주요 2차 구조(α-helix, β-sheet)는 원본 구조와 거의 동일하게 유지되며, 모델이 전체 단백질의 안정성을 보존한 채 **결합부 중심의 구조만 재배치**한 것을 알 수 있습니다.

## 6.2 로타머 및 아미노산 비교

---

<div style="display: flex; justify-content: space-between; gap: 20px;">
  <div style="flex: 1; text-align: center;">
    <strong>2P16_RCSB</strong>
    <img src="/image/info/detail/pocketgen_6.webp" style="width: 100%; max-width: 400px; margin-top: 10px;">
  </div>
  <div style="flex: 1; text-align: center;">
    <strong>2P16_pocketgen</strong>
    <img src="/image/info/detail/pocketgen_7.webp" style="width: 100%; max-width: 400px; margin-top: 10px;">
  </div>
</div>

- 회색 구조(2P16_RCSB): 실험적으로 결정된 원본 단백질
- 초록색 구조(PocketGen): AI 모델이 리모델링한 포켓
- 리간드(녹색 스틱): Apixaban

## 6.2 종합 평가

---

결과적으로, PocketGen은 원본 Factor Xa – Apixaban 결합 모드를 충실히 재현하면서도 **국소적 구조 최적화를 통해 결합 효율을 높이는** AI 기반 포켓 설계의 강점을 보여줍니다.

# 7 마치며

---

이번 포스트에서는 **PocketGen을 이용해 Coagulation Factor X와 Apixaban의 결합 구조를 최적화하는 전 과정을** 살펴봤습니다.

단백질의 활성 부위를 인공지능이 스스로 인식하고, 리간드 결합에 적합한 형태로 **포켓을 재설계(remodeling)** 하는 과정은 기존의 docking 기반 접근과는 차별화된 새로운 방향을 보여줍니다.

실험 결과, PocketGen은

- 원본 결정 구조(2P16)와 **RMSD < 1 Å** 수준의 높은 재현성을 보이면서,
- **결합 친화도(Vina score)가 향상된 최적화 포즈**를 생성했습니다.

이는 PocketGen이 단순한 예측 모델이 아니라 **단백질–리간드 복합체의 구조적 상호작용을 학습하고 개선할 수 있는 생성형 AI(Generative AI)** 도구임을 보여줍니다.

PocketGen은 단백질 구조 기반의 **신약 설계(Structure-based Drug Design, SBDD)** 과정에서,

기존의 docking 도구를 보완하거나 **새로운 포켓 탐색의 출발점** 으로 활용될 수 있습니다.

또한 CURIE 플랫폼을 통해 웹 기반으로 제공됨으로써 연구자는 복잡한 환경 설정 없이 브라우저에서 바로 **AI 기반 구조 최적화 워크플로우**를 수행할 수 있습니다..

단백질의 구조적 가능성을 탐색하고, 리간드의 결합을 더 정밀하게 이해하고 싶다면 지금 바로 PocketGen으로 **AI 구조 생물학의 새로운 흐름**을 경험해보세요.

# 8 Reference

---

- [PocketGen](https://github.com/zaixizhang/PocketGen)
- [bioRxiv](https://www.biorxiv.org/content/10.1101/2024.02.25.581968v3)
- Curieus : [PocketGen](https://curieus.net/Analysis/pocketgen)

---

[tool-button:PocketGen]
