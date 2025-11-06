---
layout: post
title: "PIGNet2: B-RAF와 소라페닙(Sorafenib)의 결합 친화도 측정"
description: "물리 정보를 반영한 그래프 신경망(Physics-informed GNN) 모델인 PIGNet2를 소개하고, 실제 약물-표적 단백질 쌍인 소라페닙과 B-RAF의 결합 친화도를 예측"
categories: [analysis]
tags: [PIGNet2, Binding Affinity, GNN, B-RAF, Sorafenib, SBDD, Drug Discovery, AI Protein Design]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/pignet2_1.webp"
comment_id: "pignet2_detail"
---

![image.png](/image/info/detail/pignet2_1.webp){center:500}

신약 개발에서는 단백질–리간드 상호작용의 binding affinity를 정확히 예측하는 것이 매우 중요합니다. 전통적으로는 docking, MM/PB(GB)SA 또는 free energy methods 등이 사용되어 왔지만, 계산 비용이 높거나 정확성에 한계가 존재합니다.

그런 가운데 **PIGNet2**는 물리 정보를 반영한 그래프 신경망(Physics‑informed Graph Neural Network) 구조를 기반으로, 단백질–리간드 복합체의 구조로부터 **결합 친화도 점수**를 예측하는 모델입니다. 이 모델은 스코어링과 가상 스크리닝(virtual screening) 작업에서 모두 좋은 성능을 보여준다는 점이 주목받고 있습니다.

이번 글에서는 PIGNet2를 활용해, 특히 **B‑RAF 단백질과 소라페닙(Sorafenib)** 간의 결합 친화도를 예측하는 과정을 보여드릴 예정입니다. 이런 실제 약물–단백질 쌍을 예제로 삼은 것은, PIGNet2가 단순한 모형 테스트를 넘어 실무 응용 가능성을 가늠해 볼 수 있기 때문입니다.

# 1 사용된 도구

---

- **PIGNet2** 단백질-리간드 상호작용의 결합 친화도를 계산하는 모델

# 2 **PIGNet2 설치 방법**

PIGNet2는 단백질–리간드 결합 친화도 예측을 위한 **그래프 기반 딥러닝 모델**로, GitHub에서 오픈소스로 제공되고 있습니다. 이 섹션에서는 Linux 또는 macOS 환경에서 PIGNet2를 설치하는 방법을 소개합니다. Windows 사용자는 WSL 환경이나 Docker를 이용하는 것이 좋습니다.

### 2.1 GitHub 저장소 다운로드

---

먼저 공식 저장소를 클론합니다.

```bash
git clone https://github.com/mseok/PIGNet2.git
cd PIGNet2
```

### 2.2 Conda 환경 생성

---

PIGNet2는 Python 3.9 환경에서 테스트되었으며, `conda`나 `venv`를 사용해 가상 환경을 구성할 수 있습니다. 여기서는 `conda` 기반 환경을 예시로 설명합니다.

```bash
conda create -n pignet2 python=3.9
conda activate pignet2
```

### 2.3 필수 패키지 설치

---

PIGNet2는 **화학구조 처리 및 시각화**를 위해 `RDKit`, `OpenBabel`, `PyMOL` 등의 패키지를 필요로 합니다. 다음 명령어로 설치하세요:

```bash
conda install rdkit=2022.03.4 openbabel pymol-open-source -c conda-forge
```
::note
pymol-open-source는 시각화를 위해 선택적으로 사용할 수 있으며, 생략해도 작동에는 문제가 없습니다.
::/note

### 2.4 Python 종속성 설치

---

프로젝트의 나머지 Python 패키지는 `requirements.txt`를 통해 설치할 수 있습니다.

```bash
pip install -r requirements.txt
```

# 3 기본 사용 용법

**PIGNet2**는 단백질과 리간드의 구조 파일을 기반으로, 이들 사이의 결합 친화도를 계산하는 딥러닝 모델입니다. 특히 단일 단백질–리간드 쌍을 빠르게 평가할 수 있는 CLI 인터페이스를 제공하며, 다양한 리간드 conformation(형태)을 자동으로 처리합니다.

이번 튜토리얼에서는 **단일 예측 실행 방법**을 중심으로 사용법을 소개하겠습니다.

## 3.1 입력 파일 준비

---

PIGNet2는 다음 두 가지 입력이 필요합니다:

- **단백질 구조 파일 (`.pdb`), 리간드 구조 파일 (`.sdf`)**

리간드는 가능한 경우 SMINA 등으로 구조 최적화된 conformation을 사용하는 것이 예측 정확도에 도움이 됩니다.

## 3.2 예측 명령어 기본형

---

```bash
python src/exe/predict.py ./src/ckpt/pda_0.pt \
    -p <protein_file.pdb> \
    -l <ligand_file.sdf> \
    -o <output_path.txt>
```

- `./src/ckpt/pda_0.pt`는 사전 학습된 모델 가중치입니다.
- `p`: 단백질 구조 파일
- `l`: 리간드 구조 파일 (단일 또는 다중 conformation 포함 가능)
- `o`: 출력 결과 저장 위치

## 3.3 결과 파일 형식

---

결과는 탭(`\t`)으로 구분된 텍스트 파일로 출력되며, 다음과 같은 열로 구성됩니다:

| 항목 | 설명 |
| --- | --- |
| ID | 구조 이름 (예: `braf_sorafenib_0`) |
| GT | Ground Truth (추론시엔 `0.000`) |
| **Total Score** | 총 예측 결합 친화도 |
| vdw | 반데르발스 에너지 |
| hbond | 수소 결합 에너지 |
| metal | 금속-리간드 결합 에너지 |
| hydrophobic | 소수성 상호작용 에너지 |
| dummy | 무시해도 되는 보조 열 |

```text
braf_sorafenib_0    0.000   -3.990  -2.074  -1.021  0.000   -0.894  0.000
```

---

## 3.4 고정밀 예측을 위한 팁

- **SMINA로 최적화된 리간드 구조 사용**
- **4개 모델 앙상블 실행** (`pda_0.pt`부터 `pda_3.pt`까지 순차 실행 후 평균)

```bash
for i in 0 1 2 3; do
  python src/exe/predict.py ./src/ckpt/pda_${i}.pt \
      -p examples/braf.pdb \
      -l examples/sorafenib.sdf \
      -o output/pred_${i}.txt
done

```

# 4 데이터 선정

## 4.1 1UWH – B-RAF–Sorafenib 복합체 구조 소개

---

![image.png](/image/info/detail/pignet2_2.webp){center:400}

- **단백질 이름**: B-RAF kinase domain
- **PDB ID**: 1UWH
- **리간드**: Sorafenib
- **해상도**: 2.60 Å
- **Organism**: *Homo sapiens (Human)*
- **실험 기법**: X-ray diffraction

## 4.3 왜 이 예제를 선택했나요?

---

본 튜토리얼에서는 **단백질–리간드 결합 친화도 예측의 유효성 검증**을 위해, 실제 결정 구조에서 Sorafenib이 정확한 결합 포켓에 위치한 복합체 구조인 B-RAF–Sorafenib 복합체 (PDB ID: 1UWH)를 예제로 선택했습니다.

**결합 정확성이 보장된 구조**

- 1UWH는 실험적으로 확인된 고해상도 결정 구조로, Sorafenib이 **정확한 결합 포켓**에 위치한 상태입니다.
- 따라서, 이 구조를 기반으로 PIGNet2를 실행하면 **높은 결합 친화도 스코어**가 나올 것이 자연스럽습니다.

**비결합 상태 시뮬레이션이 용이함**

- 동일한 단백질 구조를 유지한 채, Sorafenib의 위치만 임의로 변경하여 단백질 표면 주변에 배치하면, 실제 결합 부위가 아닌 상태를 인위적으로 구성할 수 있습니다.
- 이때 PIGNet2는 낮은 결합 친화도를 예측할 것으로 기대되며, **모델의 민감도와 정밀도를 테스트하는 데 적합**합니다.

**단백질–리간드 복합체 기반 비교 실험 가능**

- 동일한 리간드(Sorafenib), 동일한 단백질(B-RAF)을 사용하면서도 **리간드 위치에 따라 결합 스코어가 어떻게 달라지는지**를 직관적으로 확인할 수 있습니다.

## 5 예측하기

## 5.1 Linux CLI 이용

---

### PyMOL로 1UWH 구조 로드 및 분리

```text
# 1UWH 구조 로딩
fetch 1UWH, async=0

# 단백질만 추출
select protein_only, polymer.protein
save braf_protein.pdb, protein_only

# 리간드(Sorafenib)만 추출 (리간드 ID: BAX)
select sorafenib_bound, resn BAX
save sorafenib_bound.sdf, sorafenib_bound
```

이제 두 개의 파일이 생성됩니다:

- `braf_protein.pdb`: B-RAF 단백질 구조
- `sorafenib_bound.sdf`: 결합 포켓 내 Sorafenib 구조 (정상 결합 위치)

### 리간드 임의 위치로 이동 (PyMOL에서)

```text
# 소라페닙 복사본 생성
create sorafenib_shifted, sorafenib_bound

# 공간적으로 단백질 외부로 이동 (예: X축으로 20Å 이동)
translate [20, 0, 0], sorafenib_shifted

# 새로운 위치로 저장
save sorafenib_shifted.sdf, sorafenib_shifted
```

이제 총 **2개의 리간드 구조 파일**이 준비되었습니다:

![`sorafenib_bound.sdf`: 정상 위치](/image/info/detail/pignet2_3.webp){center:400}[sorafenib_bound.sdf: 정상 위치]
![`sorafenib_shifted.sdf`: 비정상 위치 (포켓 바깥)](/image/info/detail/pignet2_4.webp){center:400}[sorafenib_shifted.sdf: 비정상 위치 (포켓 바깥)]

### 예측 실행

```bash
# 정상 결합 구조 예측
python src/exe/predict.py $CKPT \
  -p braf_protein.pdb \
  -l sorafenib_bound.sdf \
  -o result_bound.txt

#임의 배치 구조 예측
python src/exe/predict.py $CKPT \
  -p braf_protein.pdb \
  -l sorafenib_shifted.sdf \
  -o result_shifted.txt
```

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curieus.net/Analysis/pignet2
```

화면에는 단백질의 PDB 구조 파일과 리간드 분자파일 SDF를 업로드 하는 공간이 준비되어 있습니다.

![image.png](/image/info/detail/pignet2_5.webp){center:880}

여기에 분석할 단백질과 리간드에 대한 구조를 업로드 한 후 **분석 시작** 버튼을 누르면 **PIGNet2** 도구가 입력된 정보로부터 단백질–리간드 상호작용을 예측합니다.

# 6 분석 결과

## 6.1 단백질–리간드 상호작용 예측 결과 요약

---

| Complex_ID | true_label | E_total | E_vdw | E_hbond | E_metal | E_hydrophobic |
| --- | --- | --- | --- | --- | --- | --- |
| shifted | True | 109.159 | 112.671 | -2.539 | 0 | -0.973 |
| bound | True | -6.633 | -4.458 | -0.971 | 0 | -1.204 |

### **총 결합 에너지 (`E_total`) 차이**

- **bound 구조**: `–6.633 kcal/mol` → **결합 친화도가 높음** (음수일수록 강한 결합)
- **shifted 구조**: `+109.159 kcal/mol` → **결합 부재 혹은 강한 반발** (양수는 결합이 불안정하거나 비결합 상태)

→ **예상대로**, 결정 구조 기반의 `bound` 모델에서 강한 결합이 예측됨. 반대로, `shifted`는 결합 포켓이 아닌 위치라 **결합이 전혀 성립되지 않음**을 보여줍니다.

### **Van der Waals (vdW) 에너지**

- `bound`: –4.458 → 정상적인 포켓 내에서 적절한 vdW 접촉 발생
- `shifted`: +112.671 → 비정상적인 리간드 위치로 인해 **공간 충돌(repulsion)**이 발생한 것으로 보임

→ **공간적으로 포개짐이 발생**, 결합보다는 **심한 반발력이 생긴 것**을 나타냄.

### **수소 결합 (`E_hbond`)**

- `bound`: –0.971 → **약하지만 의미 있는 H-bond 형성**
- `shifted`: –2.539 → 의외로 더 음수이나, 이는 **의미 없는 표면 수소 결합일 가능성**이 있음

→ 에너지만으로 H-bond의 유효성을 판단하긴 어렵지만, **전체 에너지 관점에서는 `bound` 구조가 안정**됨.

### **Hydrophobic 상호작용**

- `bound`: –1.204
- `shifted`: –0.973

→ `bound`가 약간 더 안정적인 소수성 결합을 하고 있는 것으로 해석할 수 있음

## 6.3 종합 평가

---

- 이번 튜토리얼에서는 PIGNet2를 이용해 B-RAF 단백질과 소라페닙의 결합 구조(1UWH)를 예제로 삼아 결합 친화도 예측을 수행해보았습니다. 결합 포켓에 위치한 소라페닙 구조와, 동일 리간드를 인위적으로 위치를 변경한 구조를 비교함으로써, **PIGNet2가 실제 결합 여부를 얼마나 정밀하게 예측할 수 있는지** 확인할 수 있었습니다.
- 결론적으로, PIGNet2는 단백질–리간드 간 결합 친화도 예측에서 위치 민감도, 해석 가능성, 예측 정확도 모두에서 우수한 성능을 보이며, 실제 구조 기반 SBDD(Structure-Based Drug Design)에서 신뢰성 있는 필터링 도구로 활용될 수 있습니다.

# 7 마치며

---

이번 튜토리얼에서는 **PIGNet2**라는 물리 기반 그래프 신경망 도구를 활용해, 실제 의약품 후보 물질인 Sorafenib과 **B‑RAF 단백질**의 결합 친화도를 예측하는 전 과정을 따라가 보았습니다. 단백질–리간드 복합체의 구조 정보를 바탕으로 결합 안정성을 정량적으로 예측할 수 있다는 점은, 기존 docking이나 물리 시뮬레이션 기반 접근보다 훨씬 직관적이면서도 빠른 분석이 가능하다는 강점을 보여주었습니다.

특히 이번 실험에서는 **결정 구조 기반의 결합 포즈**와 **임의로 위치를 변경한 리간드 포즈**를 비교 분석함으로써, PIGNet2가 실제 결합 위치 여부에 따라 **에너지 예측값을 명확히 구분**할 수 있음을 확인했습니다. 이는 단순히 점수 예측을 넘어, 실제 약물 설계 및 가상 스크리닝에 있어 **신뢰성 있는 필터링 도구로서의 가능성**을 보여주는 대목입니다.

앞으로도 구조 기반 약물 설계(SBDD) 과정에서 수많은 후보군을 빠르게 평가하고, **실험적 결합 구조에 가까운 포즈를 우선적으로 선별**해야 할 필요성이 계속 증가할 것입니다. 그런 점에서 **PIGNet2는 정확성과 속도, 그리고 해석 가능성이라는 세 가지 핵심 요소를 두루 갖춘 분석 도구**로, 실무 현장에서도 충분히 활용될 수 있는 잠재력을 지닌 모델입니다.

# 8 Reference

---

- [Github PIGNet2](https://github.com/mseok/PIGNet2)
- [Royal Society of CHEMISTRY](https://pubs.rsc.org/en/content/articlelanding/2024/dd/d3dd00149k)
- Curieus : [PIGNet2](https://curieus.net/Analysis/pignet2)

---

[tool-button:PIGNET2]
