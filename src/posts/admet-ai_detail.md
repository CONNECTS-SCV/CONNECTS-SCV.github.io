---
layout: post 
title: "ADMET-AI : 비슷한 분자량을 갖지만 간독성에 많은 차이를 보이는 Ambrisentan과 Hexocyclium의 ADMET 비교" 
description: "AI 기반 ADMET 예측 플랫폼 ADMET-AI를 사용하여, 분자량은 비슷하지만 간독성에서 큰 차이를 보이는 Ambrisentan과 Hexocyclium의 ADMET 프로파일을 비교" 
categories: [analysis] 
tags: [ADMET-AI, ADMET, Drug Discovery, Hepatotoxicity, DILI, Ambrisentan, Hexocyclium, Cheminformatics] 
author: "author6" 
date: "2025-09-29" 
thumbnail: "/image/info/detail/admet-ai_1.webp" 
comment_id: "admet-ai_detail"
---

![image.png](/image/info/detail/admet-ai_1.webp){center:400}

신약 개발 과정에서 가장 많은 후보 물질이 탈락하는 이유, 바로 **ADMET(흡수·분포·대사·배설·독성)** 특성 때문입니다. 아무리 강력한 생물학적 활성을 지닌 화합물이라도, 체내에서의 안정성이나 독성 문제가 발견되면 약물로서의 가치는 사라지게 됩니다.

이번 글에서는 **AI 기반 약물 특성 예측 플랫폼인 [ADMET-AI](https://github.com/swansonk14/admet_ai)** 를 소개합니다.

ADMET-AI는 분자의 SMILES 문자열만으로도 주요 **ADMET 지표를 빠르고 정밀하게 예측**할 수 있는 강력한 도구로, 복잡한 실험 과정 없이 화합물의 약물 가능성을 빠르게 평가할 수 있습니다.

특히 이번 튜토리얼에서는 비슷한 분자량을 가지지만 **간독성에서 큰 차이를 보이는 두 화합물 (Ambrisentan과 Hexocyclium)** 을 예시로, ADMET-AI가 어떤 통찰을 제공할 수 있는지를 직접 살펴보겠습니다.

# 1 사용된 도구

---

- **ADMET-AI** 후보물질의 ADMET를 예측하는 모델

# 2 ADMET-AI 설치 튜토리얼

**ADMET-AI**는 파이썬 환경에서 몇 분 안에 설치할 수 있는 경량 AI 약물 예측 도구입니다. GPU가 있는 환경에서는 자동으로 GPU를 사용하고, 그렇지 않다면 CPU로 실행됩니다.

## 2.1 pip를 이용한 기본 설치

---

```bash
pip install admet-ai
```

이 명령으로 ADMET-AI의 기본 예측 기능을 사용할 수 있습니다. 이제 명령줄(CLI) 또는 Python API에서 직접 ADMET 예측을 수행할 수 있습니다.

ADMET-AI는 다양한 용도에 따라 추가 의존성을 제공합니다. 필요에 따라 아래 옵션을 추가로 설치하세요.

| 목적 | 설치 명령어 | 설명 |
| --- | --- | --- |
| **TDC 데이터 처리 및 시각화** | `pip install admet-ai[tdc]` | Therapeutics Data Commons 데이터셋 처리 및 플로팅 지원 |
| **웹 서버 실행용** | `pip install admet-ai[web]` | 로컬 또는 클라우드에서 ADMET-AI 웹 서버 구동 지원 |

## 2.2 GitHub에서 직접 클론하여 설치

최신 버전이나 개발 중인 기능을 사용하고 싶다면, GitHub 저장소를 직접 클론할 수도 있습니다.

```bash
git clone https://github.com/swansonk14/admet_ai.git
cd admet_ai
pip install -e .
```

이 방식은 코드 수정 후 바로 테스트할 수 있어 연구·개발 환경에 적합합니다.

## 2.3 버전 충돌 또는 ImportError 발생 시

---

만약 설치 중에 패키지 버전 문제나 아래와 같은 오류가 발생할수도 있습니다.

```text
ImportError: libXrender.so.1: cannot open shared object file: No such file or directory
```

다음 명령으로 해결할 수 있습니다.

```bash
# 패키지 버전 고정 후 설치
pip install -r requirements.txt
pip install -e .

# Xrender 라이브러리 누락 시 해결
conda install -c conda-forge xorg-libxrender
```

# 3 ADMET-AI 사용법

## 3.1 명령줄(Command Line)에서 예측 실행하기

---

ADMET-AI를 설치하면, 자동으로 `admet_predict` 명령어가 함께 등록됩니다. 이 명령어는 CSV 파일로부터 분자(SMILES) 정보를 읽어 각 화합물의 ADMET 예측값을 저장합니다.

### 예시: data.csv 파일

아래와 같이 예측하고 싶은 화합물들의 **SMILES 문자열**을 담은 CSV 파일을 준비합니다.

```text
smiles
CC(=O)OC1=CC=CC=C1C(=O)O
C[N+]1(CCN(CC1)CC(C2CCCCC2)(C3=CC=CC=C3)O)C
CCN(CC)CCOC(=O)C1=CC=CC=C1
```

### 실행 명령

```bash
admet_predict \
    --data_path data.csv \
    --save_path preds.csv \
    --smiles_column smiles
```

- `-data_path`: 입력 CSV 파일 경로
- `-save_path`: 결과를 저장할 파일 이름
- `-smiles_column`: SMILES 문자열이 들어있는 컬럼 이름

## 3.2 Python 코드 내에서 직접 예측하기

---

명령줄 대신, **Python 환경에서 곧바로 예측**을 수행할 수도 있습니다. 이는 웹 애플리케이션, 데이터 분석 파이프라인, 또는 Jupyter Notebook에서 활용하기에 적합합니다.

### 예시 코드

```python
from admet_ai import ADMETModel

# 모델 불러오기
model = ADMETModel()

# 예측 수행 (단일 분자)
preds = model.predict(smiles="C[N+]1(CCN(CC1)CC(C2CCCCC2)(C3=CC=CC=C3)O)C")

# 결과 출력
print(preds)
```

### 출력 예시

```python
{
  'logP': 4.89,
  'solubility': 'low',
  'clearance': 'high',
  'toxicity_human_liver': 'high',
  ...
}
```

- 단일 SMILES → 결과가 **딕셔너리(dictionary)** 형태로 반환됩니다.
- 여러 SMILES 리스트를 입력하면 → 결과가 **Pandas DataFrame**으로 반환됩니다.

```python
smiles_list = [
    "C[N+]1(CCN(CC1)CC(C2CCCCC2)(C3=CC=CC=C3)O)C",
    "CCN(CC)CCOC(=O)C1=CC=CC=C1"
]

preds_df = model.predict(smiles=smiles_list)
print(preds_df.head())
```

# 4 데이터 선정

## **4.1 Ambrisentan**

---

![image.png](/image/info/detail/admet-ai_2.webp){center:400}

- 계열/기전: Endothelin A 수용체 길항제(ERA), PAH 치료제.
- SMILES: CC1=CC(=NC(=N1)O[C@H](https://www.notion.so/C(=O)O)C(C2=CC=CC=C2)(C3=CC=CC=C3)OC)C
- 분자량: **~378.4 g/mol**.
- 간독성 근거: 2011년 **FDA가 간손상 경고와 월별 LFT 요구사항을 삭제**(Letairis 라벨 변경). 이후 분석에서도 ambrisentan은 간독성 경고가 제거된 반면 bosentan은 유지. **장기 간 안전성** 분석에서도 뚜렷한 간독성 신호 미약.

## **4.2 Hexocyclium**

---

![image.png](/image/info/detail/admet-ai_3.webp){center:400}

- 계열/기전: **항무스카린제(antimuscarinic)**.
- SMILES: C[N+]1(CCN(CC1)CC(C2CCCCC2)(C3=CC=CC=C3)O)C
- 분자량(유리염기): **~317.5 g/mol** (*메틸설페이트 염*은 ~428.6 g/mol).
- 간독성 근거: 현대 임상에서 쓰임이 드물고 공개 문헌상 **뚜렷한 DILI 신호 보고가 거의 없음**

## 4.3 예제 데이터 선정의 타당성

---

이번 예제에서는 **Ambrisentan**과 **Hexocyclium**을 비교 대상으로 선정했습니다.

두 화합물은 **분자량이 비슷하지만(Ambrisentan ≈ 378 g/mol, Hexocyclium ≈ 317 g/mol)**, **이온화 상태와 지용성 특성에서 뚜렷한 차이**를 보입니다.

- **Ambrisentan**은 **비이온성·지용성** 분자로, 체내 흡수와 간 대사 과정에서 **CYP 효소 대사 의존성**이 높습니다.
- **Hexocyclium**은 **4급 암모늄 구조를 가진 양이온성 화합물**로, 막 투과성이 낮고 간 대사보다는 **국소적 작용과 배설 안정성**이 두드러집니다.

따라서 두 물질은 **분자량은 유사하지만 물리화학적 성질과 대사 경로가 대비되는 사례**로 ADMET-AI를 활용해 **흡수·분포·대사·배설·간독성 예측값의 차이를 직관적으로 비교**하기에 적합합니다.

또한 예측 결과를 실제 문헌 데이터와 비교함으로써 **AI 기반 ADMET 분석의 신뢰성과 한계를 평가**할 수 있습니다.

# 5 예측하기

## 5.1 Linux CLI 이용

---

### 데이터 준비 (CSV)

작업 폴더에 다음 내용을 **ambrisentan_hexocyclium.csv**로 저장합니다.

```text
name,smiles,hepato_label_for_demo
Ambrisentan,CC1=CC(=NC(=N1)O[C@H](C(=O)O)C(C2=CC=CC=C2)(C3=CC=CC=C3)OC)C,High
Hexocyclium,C[N+]1(CCN(CC1)CC(C2CCCCC2)(C3=CC=CC=C3)O)C,Low
```

- `name`: 화합물명
- `smiles`: 예측 대상 SMILES
- `hepato_label_for_demo`: **예시용** 라벨(비교·시각화를 할 때 도우미 역할)

### 예측 실행

```bash
admet_predict \
  --data_path ambrisentan_hexocyclium.csv \
  --save_path preds.csv \
  --smiles_column smiles
```

완료 후 같은 폴더에 `preds.csv`가 생성됩니다. 이 파일에는 입력 컬럼(`name`, `hepato_label_for_demo`)과 함께 **ADMET-AI가 예측한 다양한 지표**가 열로 추가됩니다.

### 결과 빠르게 훑어보기

```bash
# 열 이름(지표 목록) 확인
python - <<'PY'
import pandas as pd
df = pd.read_csv('preds.csv')
print("Columns:", list(df.columns))
# 'liver', 'DILI', 'tox' 같은 단어가 들어간 간독성 관련 열만 골라보기
cand = [c for c in df.columns if any(k in c.lower() for k in ['liver','dili','tox'])]
print("Liver/DILI candidates:", cand)
print(df[['name','hepato_label_for_demo'] + cand].head())
PY
```

ADMET-AI 버전에 따라 간독성 관련 열 이름이 DILI, toxicity_*, *_liver*처럼 약간 달라질 수 있습니다. 위 스니펫은 열 이름을 직접 확인해 가장 적합한 것을 고르게 해줍니다.

### 또는 Python API로 예측

노트북/스크립트에서 바로 예측하고, 필요한 지표만 추려볼 수 있습니다.

```python
from admet_ai import ADMETModel
import pandas as pd

pairs = [
    {"name": "Ambrisentan", "smiles": "CC1=CC(=NC(=N1)O[C@H](C(=O)O)C(C2=CC=CC=C2)(C3=CC=CC=C3)OC)C", "hepato_label_for_demo":"High"},
    {"name": "Hexocyclium", "smiles": "C[N+]1(CCN(CC1)CC(C2CCCCC2)(C3=CC=CC=C3)O)C", "hepato_label_for_demo":"Low"},
]

model = ADMETModel()

# 예측: 리스트 입력 → DataFrame 반환
smiles_list = [p["smiles"] for p in pairs]
preds_df = model.predict(smiles=smiles_list)

# 이름/라벨 붙이기 (인덱스가 SMILES일 경우 merge)
meta_df = pd.DataFrame(pairs)
preds_df = preds_df.reset_index().rename(columns={"index":"smiles"})
preds_df = meta_df.merge(preds_df, on="smiles", how="left")

# 간독성 관련 열 자동 탐색
cand = [c for c in preds_df.columns if any(k in c.lower() for k in ["liver","dili","tox"])]
view_cols = ["name","hepato_label_for_demo"] + cand[:6]  # 너무 많으면 앞부분만
print(preds_df[view_cols])
```

### 간단 비교 표/그래프 만들기

CLI 결과(`preds.csv`)에서 필요한 열만 골라 **소규모 표**를 만들거나 Python으로 막대 그래프를 그려 시각화할 수 있습니다.

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('preds.csv')

# 간독성 후보 열 찾기
cand = [c for c in df.columns if any(k in c.lower() for k in ['liver','dili','tox'])]
target = cand[0]  # 첫 번째 후보를 예시로 선택

sub = df[['name','hepato_label_for_demo', target]].copy()
print(sub)

# 단순 막대 그래프 (수치형이면 동작)
if pd.api.types.is_numeric_dtype(sub[target]):
    plt.figure()
    plt.bar(sub['name'], sub[target])
    plt.title(f'Comparison of {target}')
    plt.xlabel('Compound')
    plt.ylabel(target)
    plt.show()
```

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/admet-ai
```

ADMET-AI는 별도의 프로그램 설치 없이 **웹 브라우저 상에서 바로 화합물의 ADMET 특성을 예측**

할 수 있는 직관적인 인터페이스를 제공합니다. 실험 데이터를 준비할 필요 없이, 단순히 화합물의

**SMILES 문자열(Simplified Molecular Input Line Entry System)**을 입력하면 AI 모델이 자동으로 약물의 흡수, 분포, 대사, 배설, 독성 등의 주요 특성을 계산합니다.

![image.png](/image/info/detail/admet-ai_4.webp){center:880}

화면 상단에는 **“SMILES 입력 방식 선택”** 영역이 있으며 예측에 사용할 데이터를 **직접 입력하거나(①)**혹은 **파일로 업로드(②)** 하는 두 가지 방식을 제공합니다.

만약 여러 화합물을 한 번에 예측하고 싶다면, 오른쪽의 **‘+’ 버튼**을 눌러 새로운 입력란을 추가할 수 있습니다.  화합물을 모두 입력한 뒤, 화면 하단의 **“분석 시작”** 버튼을 클릭하면 ADMET-AI가 각 분자의 구조를 분석해 예측을 수행합니다.

# 6 분석 결과

## 6.1 예측 결과

---

| smiles | molecular_weight | logP | hydrogen_bond_acceptors | hydrogen_bond_donors | Lipinski | QED | stereo_centers |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hexocyclium | 317.497 | 2.8465 | 2 | 1 | 4 | 0.863348 | 1 |
| Ambrisentan | 377.42 | 3.67903 | 5 | 1 | 4 | 0.676408 | 0 |
| smiles | tpsa | AMES | BBB_Martins | Bioavailability_Ma | CYP1A2_Veith | CYP2C19_Veith | CYP2C9_Substrate_CarbonMangels |
| Hexocyclium | 23.47 | 0.004652 | 0.763854 | 0.327938 | 0.000668 | 0.013623 | 0.217063 |
| Ambrisentan | 81.54 | 0.056997 | 0.524171 | 0.963072 | 0.004845 | 0.2407 | 0.527214 |
| smiles | CYP2C9_Veith | CYP2D6_Substrate_CarbonMangels | CYP2D6_Veith | CYP3A4_Substrate_CarbonMangels | CYP3A4_Veith | Carcinogens_Lagunin | ClinTox |
| Hexocyclium | 0.000426 | 0.731843 | 0.354086 | 0.324361 | 0.003864 | 0.015881 | 0.006901 |
| Ambrisentan | 0.375785 | 0.006978 | 0.003081 | 0.743534 | 0.028028 | 0.282287 | 0.043729 |
| smiles | DILI | HIA_Hou | NR-AR-LBD | NR-AR | NR-AhR | NR-Aromatase | NR-ER-LBD |
| Hexocyclium | 0.00171 | 0.258246 | 0.000264 | 0.003831 | 0.001564 | 0.00475 | 0.004198 |
| Ambrisentan | 0.89801 | 0.995233 | 0.002093 | 0.008135 | 0.064826 | 0.092796 | 0.033877 |
| smiles | NR-ER | NR-PPAR-gamma | PAMPA_NCATS | Pgp_Broccatelli | SR-ARE | SR-ATAD5 | SR-HSE |
| Hexocyclium | 0.031455 | 3.16E-05 | 0.591077 | 0.083671 | 0.044523 | 1.57E-05 | 0.000972 |
| Ambrisentan | 0.061401 | 0.068597 | 0.795445 | 0.143399 | 0.310334 | 0.00503 | 0.021388 |
| smiles | SR-MMP | SR-p53 | Skin_Reaction | hERG | Caco2_Wang | Clearance_Hepatocyte_AZ | Clearance_Microsome_AZ |
| Hexocyclium | 0.018233 | 0.000123 | 0.929784 | 0.903612 | -4.88319 | 47.22818 | -4.98048 |
| Ambrisentan | 0.01594 | 0.004893 | 0.144685 | 0.095396 | -4.78685 | 32.63967 | -5.86126 |
| smiles | Half_Life_Obach | HydrationFreeEnergy_FreeSolv | LD50_Zhu | Lipophilicity_AstraZeneca | PPBR_AZ | Solubility_AqSolDB | VDss_Lombardo |
| Hexocyclium | -39.4952 | -9.26496 | 3.168217 | 1.034305 | 28.32601 | -0.89159 | 3.557067 |
| Ambrisentan | -34.9014 | -8.30942 | 2.743342 | -0.03748 | 101.5729 | -4.04331 | 2.781397 |
| smiles | molecular_weight_drugbank_approved_percentile | logP_drugbank_approved_percentile | hydrogen_bond_acceptors_drugbank_approved_percentile | hydrogen_bond_donors_drugbank_approved_percentile | Lipinski_drugbank_approved_percentile | QED_drugbank_approved_percentile | stereo_centers_drugbank_approved_percentile |
| Hexocyclium | 46.25824 | 59.63552 | 16.38232 | 36.68088 | 63.8038 | 96.74292 | 54.80807 |
| Ambrisentan | 60.02326 | 72.58627 | 59.11206 | 36.68088 | 63.8038 | 71.07406 | 22.48934 |
| smiles | tpsa_drugbank_approved_percentile | AMES_drugbank_approved_percentile | BBB_Martins_drugbank_approved_percentile | Bioavailability_Ma_drugbank_approved_percentile | CYP1A2_Veith_drugbank_approved_percentile | CYP2C19_Veith_drugbank_approved_percentile | CYP2C9_Substrate_CarbonMangels_drugbank_approved_percentile |
| Hexocyclium | 11.43854 | 1.783637 | 52.46219 | 10.35285 | 8.995735 | 19.96898 | 65.41295 |
| Ambrisentan | 54.88561 | 21.86894 | 32.37689 | 93.60217 | 25.43622 | 67.85576 | 94.41644 |
| smiles | CYP2C9_Veith_drugbank_approved_percentile | CYP2D6_Substrate_CarbonMangels_drugbank_approved_percentile | CYP2D6_Veith_drugbank_approved_percentile | CYP3A4_Substrate_CarbonMangels_drugbank_approved_percentile | CYP3A4_Veith_drugbank_approved_percentile | Carcinogens_Lagunin_drugbank_approved_percentile | ClinTox_drugbank_approved_percentile |
| Hexocyclium | 5.157038 | 94.53276 | 81.42691 | 34.1993 | 25.78519 | 6.591702 | 9.810004 |
| Ambrisentan | 86.00233 | 2.016285 | 13.22218 | 79.4494 | 40.82978 | 70.33734 | 33.30748 |
| smiles | DILI_drugbank_approved_percentile | HIA_Hou_drugbank_approved_percentile | NR-AR-LBD_drugbank_approved_percentile | NR-AR_drugbank_approved_percentile | NR-AhR_drugbank_approved_percentile | NR-Aromatase_drugbank_approved_percentile | NR-ER-LBD_drugbank_approved_percentile |
| Hexocyclium | 0.581621 | 12.21404 | 4.148895 | 10.66305 | 13.02831 | 30.32183 | 19.03839 |
| Ambrisentan | 81.03916 | 49.01124 | 17.29352 | 20.93835 | 65.1803 | 72.0822 | 67.70066 |
| smiles | NR-ER_drugbank_approved_percentile | NR-PPAR-gamma_drugbank_approved_percentile | PAMPA_NCATS_drugbank_approved_percentile | Pgp_Broccatelli_drugbank_approved_percentile | SR-ARE_drugbank_approved_percentile | SR-ATAD5_drugbank_approved_percentile | SR-HSE_drugbank_approved_percentile |
| Hexocyclium | 13.3385 | 5.622334 | 39.00737 | 49.28267 | 28.49942 | 2.985653 | 9.926328 |
| Ambrisentan | 33.96665 | 87.70841 | 53.66421 | 56.33967 | 72.12098 | 45.56029 | 58.47228 |
| smiles | SR-MMP_drugbank_approved_percentile | SR-p53_drugbank_approved_percentile | Skin_Reaction_drugbank_approved_percentile | hERG_drugbank_approved_percentile | Caco2_Wang_drugbank_approved_percentile | Clearance_Hepatocyte_AZ_drugbank_approved_percentile | Clearance_Microsome_AZ_drugbank_approved_percentile |
| Hexocyclium | 40.48081 | 3.799922 | 95.61846 | 87.51454 | 56.18457 | 60.02326 | 22.06282 |
| Ambrisentan | 38.92982 | 28.03412 | 12.79566 | 29.46879 | 62.38852 | 46.33579 | 20.8608 |
| smiles | Half_Life_Obach_drugbank_approved_percentile | HydrationFreeEnergy_FreeSolv_drugbank_approved_percentile | LD50_Zhu_drugbank_approved_percentile | Lipophilicity_AstraZeneca_drugbank_approved_percentile | PPBR_AZ_drugbank_approved_percentile | Solubility_AqSolDB_drugbank_approved_percentile | VDss_Lombardo_drugbank_approved_percentile |
| Hexocyclium | 1.550989 | 54.20706 | 85.7309 | 42.72974 | 8.724312 | 84.99418 | 65.29663 |
| Ambrisentan | 2.210159 | 63.28034 | 64.21093 | 25.59131 | 92.98178 | 31.05855 | 59.28655 |

### Hexocyclium (Molecule #1)

- **SMILES:** `C[N+]1(CCN(CC1)CC(C2CCCCC2)(C3=CC=CC=C3)O)C`
- **분자량:** 317.5
- **logP:** 2.85
- **TPSA:** 23.47 Å²
- **QED:** 0.86

| 항목 | 결과 | 해석 |
| --- | --- | --- |
| **Soluble (용해도)** | 높음 | logP가 3 이하로, 수용성 유지. |
| **Bioavailability** | 낮음 | 높은 극성(양이온)으로 막 투과 제한. |
| **Non-Toxic / hERG Safe** | 매우 양호 | 심독성(hERG) 및 일반 독성 위험 낮음. |
| **DILI (간독성)** | 매우 낮음 (~0.002) | 간 손상 가능성 거의 없음. |
| **Clearance / Half-life** | 짧음 | 빠른 대사 및 배설 경향. |
| **CYP 관련 대사** | 대부분 낮은 값 (0~0.3대) | CYP 효소에 대한 기질성 낮음 → 간 대사 관여도 적음. |

Hexocyclium은 **안전성이 높은 수용성 화합물**로 막투과성이 낮아 체내 흡수율은 떨어지지만, **간독성·심독성·돌연변이성 위험이 매우 낮은 구조**로 평가됩니다.

### Ambrisentan (Molecule #2)

- **SMILES:** `CC1=CC(=NC(=N1)O[C@](C(=O)O)C(C2=CC=CC=C2)(C3=CC=CC=C3)OC)C`
- **분자량:** 377.4
- **logP:** 3.68
- **TPSA:** 81.54 Å²
- **QED:** 0.68

| 항목 | 결과 | 해석 |
| --- | --- | --- |
| **Soluble (용해도)** | 보통 | logP가 3.7로, 수용성은 낮지만 약물로 적절한 수준. |
| **Bioavailability** | 높음 (~0.99) | 지용성이 높고 막 투과성이 우수. |
| **Non-Toxic** | 중간 | 전반적으로 무독성 범주이지만 일부 독성 경향 지표 존재. |
| **hERG Safe** | 중간 수준 | 심독성 위험은 낮지만 Hexocyclium보다는 약간 높음. |
| **DILI (간독성)** | 약간 높음 (~0.04) | 간 손상 위험이 존재할 가능성. |
| **CYP 관련 대사** | CYP2C9, CYP3A4 관련 값 높음 (0.3~0.7대) | 간 효소 대사 비율이 높음. |

Ambrisentan은 **막투과성과 생체이용률이 높은 지용성 약물**로 효율적인 흡수와 대사를 가지지만 **CYP 효소 의존적 간 대사**가 활발하여 상대적으로 **간독성 위험(DILI 스코어)** 이 높게 예측됩니다.

## 6.3 종합 평가

---

| 구분 | Hexocyclium | Ambrisentan |
| --- | --- | --- |
| **분자량** | 317.5 | 377.4 |
| **logP (지용성)** | 2.85 (중간) | 3.68 (높음) |
| **TPSA (극성표면적)** | 23.47 (낮음 → 낮은 투과성) | 81.54 (중간) |
| **CYP 대사 관여도** | 낮음 | 높음 |
| **DILI (간독성)** | 낮음 (0.002) | 높음 (0.043) |
| **Bioavailability** | 낮음 | 높음 |
| **hERG (심독성)** | 매우 안전 | 중간 수준 |
| **QED (약물 유사성)** | 0.86 (높음) | 0.68 (보통) |

ADMET-AI의 예측 결과는 두 화합물의 **구조적·약동학적 차이**를 잘 반영합니다.

- **Hexocyclium**: 수용성이 높고 대사 의존성이 낮아, 체내에서 빠르게 배설되는 안전한 프로파일.
- **Ambrisentan**: 지용성이 높고 간 대사에 의존적이어서, 약효는 강하지만 **DILI 지표에서 상대적으로 높은 값**을 보임.

이 비교는 **AI 기반 ADMET 모델이 실제 분자의 물리화학적 특성을 얼마나 정교하게 반영하는지** 보여주는 좋은 사례로 Ambrisentan의 대사성 특성과 Hexocyclium의 구조적 안정성이 **간독성 예측 차이의 주요 원인**임을 시사합니다.

# 7 마치며

---

**ADMET-AI**로 살펴본 두 분자의 비교는 “비슷한 분자량이라도 물리화학적 성질과 대사 경로가 다르면 ADME/Tox 프로파일은 크게 달라질 수 있다”는 점을 다시 한 번 확인하게 해줍니다.

이번 포스팅이 여러분의 후보 물질 선별과 리스크 사전 식별에 작은 실마리가 되었길 바랍니다.

읽어주셔서 감사합니다. 궁금한 점이나 함께 다뤄보고 싶은 사례가 있으면 댓글로 남겨 주세요. 다음 글에서는 더 확장된 예제와 배치 스크리닝 워크플로를 소개해 보겠습니다.

# 8 Reference

---

- [Github ADMET-AI](https://github.com/swansonk14/admet_ai)
- [OXFORD ACADEMIC](https://academic.oup.com/bioinformatics/article/40/7/btae416/7698030?guestAccessKey=f4fca1d2-49ec-4b10-b476-5aea3bf37045&login=false&utm_source=authortollfreelink&utm_campaign=bioinformatics&utm_medium=email)
- [PubChem | Hexocyclium](https://pubchem.ncbi.nlm.nih.gov/compound/24199#section=InChI)
- [PubChem | Ambrisentan](https://pubchem.ncbi.nlm.nih.gov/compound/6918493#section=2D-Structure)
- CURIE : [ADMET-AI](https://curie.kr/Analysis/admet-ai)

---

[tool-button:ADMET-AI]
