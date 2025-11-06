---
layout: post 
title: "Plip : PocketGen 결과물의 시각화.(2p16 기본 구조와 PocketGen 이후 구조 비교)" 
description: "단백질-리간드 상호작용 분석 도구 PLIP을 사용하여, AI(PocketGen)로 생성된 단백질 결합 포켓과 실제 결정 구조(2P16)의 결합 패턴을 비교하고 그 생화학적 타당성을 검증" 
categories: [analysis]
tags: [PLIP, PocketGen, Drug Discovery, Structural Biology, Protein-Ligand Interaction, Apixaban, Bioinformatics, Molecular Modeling] 
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/plip_1.webp" 
comment_id: "plip_detail"
---

![image.png](/image/info/detail/plip_1.webp){center:400}

단백질과 리간드가 만나 만들어내는 결합은 단순한 구조 이상의 의미를 지닙니다.

그 결합이 얼마나 강한지, 어떤 잔기들이 상호작용하는지, 그리고 AI가 만들어낸 구조가 실제 생물학적 결합과 얼마나 유사한지를 이해하는 일은 **구조 생물학과 신약 설계의 핵심**이라 할 수 있습니다.

이번 포스트에서는 이러한 상호작용을 한눈에 분석할 수 있는 도구, **PLIP (Protein–Ligand Interaction Profiler)** 을 소개합니다. PLIP은 단백질–리간드 복합체를 입력받아 **수소결합, 소수성 결합, π–π stacking, 이온–쌍, 금속 결합 등 다양한 결합 특성을 자동으로 탐지하고 시각화**합니다.

특히 이번 예제에서는 앞서 **PocketGen으로 생성한 Coagulation Factor X – Apixaban 결합 구조**를 이용하여 **AI가 생성한 포켓 구조와 원본 결정 구조(2P16)** 사이의 결합 상호작용을 PLIP으로 비교·시각화하는 과정을 함께 살펴보겠습니다.

# 1 사용된 도구

---

- **Plip** 단백질과 리간드 사이의 결합의 종류와 위치를 탐색하는 모델

# 2 PLIP 설치

PLIP(**Protein–Ligand Interaction Profiler**)은 단백질–리간드 복합체의 결합 상호작용을 자동으로 분석하고 시각화하는 도구입니다.

단백질–리간드 복합체를 분석하여 **수소결합, 소수성 상호작용, π–π stacking, 이온 결합 등**을 정량적으로 보여줍니다.

PLIP은 크게 두 가지 방식으로 설치할 수 있습니다.

- **① 컨테이너 기반 설치 (권장)**
- **② 수동 설치 (소스/PyPI)**

## 2.1 컨테이너 기반 설치

---

PLIP는 Docker Hub 또는 Singularity 이미지를 통해 **아키텍처별로 미리 빌드된 컨테이너 환경**을 제공합니다.

별도의 종속성 문제 없이 바로 실행할 수 있어, 연구 환경에서 가장 권장되는 방법입니다.

### Docker를 사용하는 경우

```bash
# Docker 이미지 다운로드
docker pull pharmai/plip:latest

# 실행 예시 (현재 디렉토리의 2p16_complex.pdb 분석)
docker run --rm -v $(pwd):/data pharmai/plip:latest \
    plipcmd -f /data/2p16_complex.pdb -o /data/plip_out
```

-v $(pwd):/data 옵션은 현재 폴더를 컨테이너 내부 /data 경로에 마운트합니다. 분석이 완료되면 결과는 로컬의 `plip_out/` 폴더로 저장됩니다.

### Singularity(또는 Apptainer) 사용하는 경우

```bash
# Singularity 이미지 다운로드
singularity pull docker://pharmai/plip:latest

# 실행
singularity exec plip_latest.sif plipcmd -f 2p16_complex.pdb -o plip_out
```

HPC(고성능 클러스터) 환경이나 GPU 노드 환경에서도 손쉽게 재현 가능하며, **PocketGen → PLIP** 통합 파이프라인을 구성할 때 매우 안정적입니다.

## 2.2 종속성 기반 수동 설치 (로컬 환경)

---

컨테이너를 사용할 수 없는 경우, 다음 의존성을 직접 설치해야 합니다.

| 필수 구성 요소 | 최소 버전 | 설명 |
| --- | --- | --- |
| **Python** | ≥ 3.6.9 | PLIP 실행 환경 |
| **OpenBabel** | ≥ 3.0.0 | 분자 형식 변환 및 리간드 전처리 (Python 바인딩 포함) |
| **PyMOL (옵션)** | ≥ 2.3.0 | 결합 상호작용 시각화용 |
| **ImageMagick (옵션)** | ≥ 7.0 | 2D 이미지 변환용 |

### PLIP 저장소 클론 후 설치

```bash
git clone https://github.com/pharmai/plip.git
cd plip
python setup.py install
```

설치 후 환경변수에 PLIP 경로를 등록해야 합니다.

```bash
export PYTHONPATH=$(pwd):$PYTHONPATH
```

### OpenBabel 설치 주의사항

PLIP는 Python 바인딩(`pybel`)을 사용하는데, OpenBabel 설치 시 종종 바인딩이 누락됩니다.

아래 명령으로 확인하세요.

```bash
python -c "import openbabel; print(openbabel.__version__)"
```

오류가 난다면 conda 기반으로 재설치하는 것을 권장합니다.

```bash
conda install -c conda-forge openbabel
```

## 2.3 PyPI로 간단 설치

---

별도의 GitHub 클론 없이, PyPI에서 바로 설치할 수도 있습니다.

```bash
pip install plip
```

단, 이 방법은 OpenBabel·PyMOL 등의 외부 종속성을 자동으로 설치하지 않기 때문에 **실행 전 반드시 관련 패키지가 PATH에 연결되어 있어야 합니다.**

# 3 ADMET-AI 사용법

## 3.1 명령줄(Command-Line) 실행

---

PLIP는 설치 후 `plipcmd` 명령을 통해 바로 실행할 수 있습니다.

CLI 버전은 가장 직관적이며, **PocketGen의 결과물(`*.pdb`)을 즉시 분석**할 수 있습니다.

### 2P16 – Apixaban 복합체 분석

PocketGen 실습에서 생성된 복합체 파일이 다음 경로에 있다고 가정합니다.

```text
generate/2p16/2p16_complex.pdb
```

이제 PLIP을 실행합니다.

```bash
# 기본 실행
plipcmd -f generate/2p16/2p16_complex.pdb -o generate/2p16/plip_out
```

-f : 분석할 단백질–리간드 복합체 파일(.pdb) 지정-o : 결과가 저장될 디렉토리 지정 (자동 생성) 분석이 완료되면 `plip_out/` 폴더가 생성되고, 그 안에 다음과 같은 결과 파일이 들어 있습니다.

| 파일명 | 설명 |
| --- | --- |
| `report.xml` | 모든 결합 상호작용 정보를 담은 XML 리포트 |
| `report.txt` | 간단한 텍스트 리포트 (요약본) |
| `2P16_APX_A_*.pse` | PyMOL 시각화 세션 파일 |
| `2P16_APX_A_*.png` | 자동 생성된 결합 구조 이미지 |

### PyMOL로 시각화

```bash
pymol generate/2p16/plip_out/2P16_APX_A_283.pse
```

PyMOL이 설치되어 있다면, 아래 결합들이 표시된 3D 구조를 시각적으로 확인할 수 있습니다.

- 수소결합(파란 점선)
- 소수성 상호작용(노란색)
- π–π stacking(보라색)
- 할로젠 결합(초록색)

### 다른 예시 (PLIP 기본 테스트)

PLIP는 기본적으로 RCSB에서 자동으로 구조를 다운로드해 실행할 수도 있습니다.

```bash
# 예시: PDB 1VSN (리간드 NFT)
mkdir /tmp/1vsn && cd /tmp/1vsn
plipcmd -i 1vsn -yv

```

-i : PDB ID를 직접 입력하면 RCSB에서 다운로드 후 분석

- `y` : 결과를 PyMOL 세션 파일로 생성
- `v` : verbose 모드 (진행 로그 출력)

## 3.2 Python 모듈로 실행

---

PLIP은 Python 환경에서 모듈 형태로도 불러와 사용할 수 있습니다. 이 방식은 **사용자 맞춤형 분석**이나 **특정 상호작용 유형만 추출**할 때 유용합니다.

### PDB 파일 로드 및 π–π stacking 분석

```python
from plip.structure.preparation import PDBComplex

# PLIP 객체 생성
my_mol = PDBComplex()

# 분석할 단백질–리간드 복합체 로드
my_mol.load_pdb('generate/2p16/2p16_complex.pdb')

# 결합 부위 및 상호작용 분석 수행
my_mol.analyze()

# 고유 결합 부위 ID 확인 (예: 리간드 HetID:Chain:Position)
print(my_mol)
my_bsid = 'APX:A:283'  # Apixaban (APX) 리간드의 바인딩 사이트

# 특정 상호작용 데이터 추출
my_interactions = my_mol.interaction_sets[my_bsid]

# π–π stacking 상호작용에 관여하는 잔기 번호 출력
print([pistack.resnr for pistack in my_interactions.pistacking])
```

출력 예시:

```text
[99, 174]
```

위 결과는 Tyr99, Phe174 잔기가 π–π stacking에 관여하고 있음을 의미합니다. 이는 2P16 결정 구조에서 보고된 **Apixaban–Factor Xa 결합의 핵심 상호작용**과 일치합니다.

# 4 데이터 선정

## 4.1  PocketGen 결과물을 사용하는 이유

---

PLIP(Protein–Ligand Interaction Profiler)는 단백질–리간드 복합체 내에서 **결합 상호작용(수소결합, 소수성, π–π stacking, 이온 결합 등)을 정량적·시각적으로 탐지하는 도구**입니다.

즉, PLIP의 역할은 단백질 모델이 “얼마나 올바른 결합 패턴을 재현하고 있는가”를 객관적으로 검증하는 것입니다. 그렇다면, **PocketGen으로 생성된 결과물을 PLIP 분석의 입력 데이터로 사용하는 것이 과연 타당할까요?**

### PocketGen 결과는 “구조적 생성 모델”의 검증에 최적

PocketGen은 단백질의 결합 부위를 AI가 직접 **리모델링(Remodeling)** 한 구조를 생성합니다.이 과정에서 단백질의 **로타머(잔기 방향)**, **사이드체인 배치**, **포켓 부피**가 미세하게 조정됩니다.

따라서, PLIP으로 분석하면 AI가 재배치한 포켓이 실제 결합 상호작용을 유지하고 있는지 혹은 **새로운 상호작용(예: 추가 수소결합, 강화된 소수성 결합)** 을 형성했는지를 객관적으로 검증할 수 있습니다.

즉, PocketGen은 “결합 부위를 생성하는 모델”, PLIP은 “그 결과의 생화학적 타당성을 검증하는 모델”로 **상호 보완적 관계**를 가집니다.

### PLIP은 AI 구조 생성 결과의 *생화학적 타당성*을 검증할 수 있는 도구

대부분의 포켓 생성 모델은 구조적 RMSD나 전역 품질(Q-score)만을 지표로 사용하지만 그것만으로는 **“결합이 실제로 유지되는가?”** 를 설명할 수 없습니다.

PLIP은 각 잔기 단위로 상호작용을 분류하고 거리·각도를 기반으로 평가하기 때문에 PocketGen의 결과를 단순히 “좌표상의 유사성”이 아니라 **“결합 유지력과 기능적 정확성”으로 검증**할 수 있습니다.

예를 들어,

- PocketGen이 Asp189–Apixaban 사이의 수소결합을 그대로 유지했는가?
- π–π stacking을 형성하는 Tyr99, Phe174의 각도가 더 평면적으로 재배치되었는가?

  이러한 분석은 PLIP 없이는 정량적으로 수행하기 어렵습니다.


# 5 예측하기

## 5.1 Linux CLI 이용

---

### 폴더 구조 예시

```text
generate/
└── 2p16/
    ├── 2P16_RCSB.pdb         # 실험 기반 결정 구조
    ├── 2P16_pocketgen.pdb    # PocketGen 결과물 (AI 리모델링 구조)
    ├── plip_out_rcsb/        # PLIP 분석 결과 폴더 (원본)
    └── plip_out_pg/          # PLIP 분석 결과 폴더 (PocketGen)
```

### RCSB 원본 구조 분석

```bash
plipcmd -f generate/2p16/2P16_RCSB.pdb -o generate/2p16/plip_out_rcsb
```

- RCSB 구조를 기반으로 Apixaban–Factor Xa 결합 상호작용을 추출
- 출력 폴더: `plip_out_rcsb/`
- 주요 출력:
    - `report.xml` : 모든 상호작용 데이터
    - `report.txt` : 간단한 요약
    - `2P16_APX_A_283.pse` : PyMOL 시각화 파일

### PocketGen 생성 구조 분석

```bash
plipcmd -f generate/2p16/2P16_pocketgen.pdb -o generate/2p16/plip_out_pg
```

- PocketGen이 리모델링한 포켓에서 Apixaban 결합 패턴을 분석
- 출력 폴더: `plip_out_pg/`
- 주요 출력: 동일하게 `report.xml`, `report.txt`, `.pse` 파일 생성

### PyMOL 시각화 비교

```bash
pymol generate/2p16/plip_out_rcsb/2P16_APX_A_283.pse
pymol generate/2p16/plip_out_pg/2P16_APX_A_283.pse
```

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curieus.net/Analysis/plip
```

PLIP(Protein–Ligand Interaction Profiler)은 복잡한 설치 과정 없이도 **웹 브라우저에서 바로 단백질–리간드 결합 상호작용을 시각화하고 분석할 수 있는** 편리한 도구를 제공합니다.

AI나 시뮬레이션 결과로부터 얻은 **3D 단백질 구조(PDB)** 파일만 준비되어 있다면 별도의 소프트웨어 설치 없이 결합 네트워크를 확인할 수 있습니다.

화면 상단에는 **“단백질 입력 방법 선택”** 영역이 있으며, 예측에 사용할 단백질 구조를 불러오는 두 가지 방식 중 하나를 선택할 수 있습니다.

**[PDB 파일 업로드]**

- 로컬에서 직접 `.pdb` 파일을 업로드합니다.
- 예를 들어, `2P16_RCSB.pdb`나 `2P16_pocketgen.pdb` 파일을 업로드할 수 있습니다.
- PocketGen으로 생성된 모델을 업로드하면, AI가 생성한 포켓 구조의 상호작용을 즉시 확인할 수 있습니다.

![image.png](/image/info/detail/plip_2.webp){center:880}

모든 입력을 완료했다면 화면 하단의 **“분석 시작”** 버튼을 클릭합니다. PLIP 서버가 자동으로 다음 과정을 수행합니다.

- 단백질 내 리간드 결합 부위 인식
- 수소결합, 소수성, π–π, 이온 결합 등 상호작용 자동 탐지
- 각 결합의 거리·각도 계산
- 2D/3D 시각화 결과 및 리포트 생성.

PocketGen 모델이 새롭게 형성한 수소결합이나 리간드 주변 소수성 포켓 확장 여부를 시각적으로 검증하기에 매우 유용합니다.

# 6 분석 결과

## 6.1 예측 결과 - 2P16_RCSB

---

### **수소 결합**

| INDEX | RESIDUE | AA | DISTANCE H-A | DISTANCE D-A | DONOR ANGLE | PROTEIN DONOR? | SIDE CHAIN | DONOR ATOM | ACCEPTOR ATOM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 143A | ARG | 3.350 | 3.860 | 113.950 | True | True | 1042 [Ng+] | 1856 [O2] |
| 2 | 146A | GLU | 2.140 | 3.060 | 153.730 | False | False | 1861 [Nam] | 1064 [O2] |
| 3 | 192A | GLN | 2.590 | 3.200 | 119.870 | True | False | 1434 [Nam] | 1868 [Nar] |
| 4 | 216A | GLY | 2.030 | 2.920 | 149.770 | True | False | 1622 [Nam] | 1862 [O2] |

### **소수성 상호작용**

| INDEX | RESIDUE | AA | DISTANCE | LIGAND ATOM | PROTEIN ATOM |
| --- | --- | --- | --- | --- | --- |
| 1 | 174A | PHE | 3.490 | 1884 | 1284 |
| 2 | 174A | PHE | 3.690 | 1882 | 1282 |
| 3 | 213A | VAL | 3.720 | 1857 | 1600 |
| 4 | 215A | TRP | 3.730 | 1879 | 1617 |
| 5 | 215A | TRP | 3.920 | 1887 | 1612 |

### 결합 시각화

![image.png](/image/info/detail/plip_3.webp){center:700}

## 6.2 예측 결과 - 2P16_pocketgen

---

### **수소 결합**

| INDEX | RESIDUE | AA | DISTANCE H-A | DISTANCE D-A | DONOR ANGLE | PROTEIN DONOR? | SIDE CHAIN | DONOR ATOM | ACCEPTOR ATOM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 192A | GLN | 2.450 | 2.940 | 109.830 | True | True | 1438 [Nam] | 1867 [O3] |

### **소수성 상호작용**

| INDEX | RESIDUE | AA | DISTANCE | LIGAND ATOM | PROTEIN ATOM |
| --- | --- | --- | --- | --- | --- |
| 1 | 97A | GLU | 3.580 | 1883 | 653 |
| 2 | 99A | TYR | 3.610 | 1876 | 671 |
| 3 | 174A | VAL | 2.420 | 1884 | 1282 |
| 4 | 215A | TRP | 3.520 | 1857 | 1616 |
| 5 | 215A | TRP | 2.570 | 1865 | 1618 |
| 6 | 215A | TRP | 3.230 | 1863 | 1617 |

### 결합 시각화

![image.png](/image/info/detail/plip_4.webp){center:700}

## 6.3 종합 평가

---

### 수소결합(Hydrogen Bonds) 비교

| 구분 | 수소결합 개수 | 주요 결합 잔기 | 거리(D–A, Å) | 변화 요약 |
| --- | --- | --- | --- | --- |
| **2P16_RCSB** | 4 | Arg143, Glu146, Gln192, Gly216 | 2.9–3.9 | 다수의 약한 결합 존재 |
| **2P16_PocketGen** | 1 | Gln192 | 2.9 | 단일 강한 결합 중심 구조 |
- RCSB 구조에서는 **4개의 수소결합**이 관찰되며, 결합 거리가 3Å 내외로 중간 강도의 상호작용을 형성합니다. 이 중 Gln192와 Gly216은 활성 부위 근처에서 리간드 안정화에 기여합니다.
- PocketGen 구조에서는 대부분의 약한 수소결합이 사라지고 **Gln192–리간드 산소 간 결합(2.94Å)** 만 유지되었습니다. 이는 AI 모델이 **핵심 결합만 남기고 주변부의 불필요한 상호작용을 제거**했음을 시사합니다.

### 소수성 상호작용(Hydrophobic Contacts) 비교

| 구분 | 소수성 상호작용 개수 | 주요 잔기 | 거리(Å) | 특징 |
| --- | --- | --- | --- | --- |
| **2P16_RCSB** | 5 | Phe174, Val213, Trp215 | 3.4–3.9 | 전형적인 방향족–방향족 상호작용 |
| **2P16_PocketGen** | 6 | Glu97, Tyr99, Val174, Trp215 | 2.4–3.6 | 포켓 내부에 추가된 근접 상호작용 |
- RCSB 구조의 소수성 네트워크는 주로 **S4 포켓(Tyr99–Phe174–Trp215)** 영역 중심으로 구성되어 있으며 Apixaban의 방향족 고리와 안정적인 π–π stacking을 형성합니다.
- PocketGen 결과에서는 **추가 소수성 상호작용 1개가 형성(총 6개)** 되었으며 Glu97A와 Tyr99A의 위치가 리간드 방향으로 이동해 포켓 입구를 좁히는 형태를 띱니다.
- 특히 **Val174–리간드 결합 거리(2.42Å)** 는 RCSB 구조 대비 약 1Å 감소하여**리간드가 포켓 내부로 더 깊숙이 삽입된 형태**로 해석됩니다.

### 결론

**RCSB 구조**는 실험적으로 관찰된 안정적 결합 형태를 제공하지만 주변부의 약한 상호작용이 다수 존재합니다. **PocketGen 구조**는 AI가 리간드 중심 포켓을 재설계하여 **결합 효율을 높이고 구조적 간결성을 확보**했습니다.

결과적으로, PLIP 분석은 PocketGen의 생성 결과가 단순히 “좌표를 복원하는 것”을 넘어 **결합 상호작용의 품질을 향상시키는 구조적 리모델링**임을 보여줍니다.

# 7 마치며

---

AI가 단백질–리간드 결합 구조를 “예측”하는 시대에서 이제는 그 구조를 **“이해하고 검증하는 시대”** 로 나아가고 있습니다.

이번 실습에서 살펴본 **PocketGen + PLIP 파이프라인**은 그 대표적인 예라 할 수 있습니다. PocketGen이 만들어낸 Coagulation Factor X – Apixaban 복합체는 단순한 구조 복원이 아닌, **결합 부위의 세밀한 리모델링(remodeling)** 을 통해 리간드와의 상호작용 품질을 한층 개선했습니다.

PLIP을 통해 이 결과를 정량적으로 분석해보면 AI 모델이 생성한 구조가 단지 “비슷하게 생긴” 단백질이 아니라 **결합 친화도와 상호작용의 효율성까지 최적화된 형태**임을 확인할 수 있습니다.

이는 향후 AI 기반 신약 설계나 단백질 엔지니어링에서 단순한 예측을 넘어 **실험적 재현성과 기능적 신뢰성까지 평가할 수 있는 중요한 지표**로 작용할 것입니다.

AI 모델의 결과를 “그럴듯하다” 수준에서 멈추지 않고 **결합의 진짜 품질(Interaction Quality)**을 이해하는 단계로 나아가고자 한다면 이번 포스트에서 다룬 **PLIP 시각화 분석**이 그 첫걸음이 될 것입니다.

# 8 Reference

---

- [Github PLIP](https://github.com/pharmai/plip)
- [OXFORD ACADEMIC](https://academic.oup.com/nar/article/49/W1/W530/6266421)
- Curieus : [PLIP](https://curieus.net/Analysis/plip)

---

[tool-button:PLIP]
