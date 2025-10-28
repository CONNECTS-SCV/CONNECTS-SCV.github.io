---
layout: post
title: "HemoPI2: 침샘 단백질 펩타이드와 벌독소 펩타이드의 독성 비교"
description: "AI 기반 용혈 독성 예측 모델 HemoPI2를 소개하고, 대표적인 비용혈성 펩타이드(Histatin-3)와 용혈성 펩타이드(Melittin)를 예제로 예측을 수행하여 그 성능을 확인"
categories: [analysis]
tags: [HemoPI2, Hemolytic Toxicity, Peptide, Histatin-3, Melittin, Bioinformatics, Drug Discovery, AI Toxin Prediction]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/hemopi2_1.webp"
comment_id: "hemopi2_detail"
---

![image.png](/image/info/detail/hemopi2_1.webp){center:500}

신약 개발 과정에서 펩타이드의 용혈 독성(hemolytic toxicity)은 반드시 고려해야 하는 중요한 요소입니다. 적혈구를 파괴하는 용혈성 펩타이드는 체내에서 심각한 부작용을 일으킬 수 있기 때문에, 초기 단계에서 이를 효과적으로 예측하고 선별하는 것이 필요합니다. 하지만 전통적인 실험 방법은 비용과 시간이 많이 소요되며, 다양한 서열을 빠르게 평가하기에는 한계가 있습니다.

HemoPI2는 대규모 데이터와 기계학습 기법을 활용하여 펩타이드 서열로부터 **용혈 독성 여부를 예측**할 수 있도록 설계되었습니다. 특히 최신 연구에서는 단순히 독성 여부를 판별하는 것에 그치지 않고, 펩타이드의 물리화학적 특성과 구조적 특징을 함께 고려하여 더욱 정밀한 분류가 가능함을 보여주고 있습니다.

이번 글에서는 HemoPI2 모델의 실제 적용 예시로, **침샘 단백질 펩타이드**와 **벌독소 펩타이드**를 비교해 보겠습니다. 이 두 사례를 함께 분석하면 HemoPI2 모델이 어떻게 **안전한 펩타이드와 독성 펩타이드를 구분**하는지를 직관적으로 확인할 수 있을 것입니다.

# 1 사용된 도구

---

- **HemoPI2** 펩타이드 용혈 독성 예측 모델
- **ESM** 단백질 서열 모델링을 위한 라이브러리

# 2 HemoPI2 **설치 방법**

## 2.1 PIP 설치

---

HemoPI2는 간편하게 `pip` 명령어를 통해 설치할 수 있습니다.

```bash
pip install hemopi2
```

설치가 완료되면, 제공되는 스크립트를 통해 바로 예측 모델을 실행할 수 있습니다.

사용 가능한 옵션을 확인하려면 다음 명령어를 입력하세요.

```bash
# 연속적인 독성 점수 예측
hemopi2_regression.py -h

# 차단 여부를 분류 (독성/비독성)
hemopi2_classification.py -h
```

## 2.2 독립 실행형 버전 설치

---

좀 더 세부적으로 환경을 구성하고 싶은 경우, 독립 실행형 버전을 설치할 수 있습니다. 이 버전은 **Python 3** 환경에서 동작하며, 다음 라이브러리가 필요합니다.

### 필수 라이브러리 설치

```bash
# 머신러닝 학습 및 예측 기능
pip install scikit-learn==1.3.1

# 데이터 처리
pip install pandas
pip install numpy

# 딥러닝 기반 모델 학습 및 추론
pip install torch

# 단백질 서열 모델링(ESM 포함) 지원
pip install transformers

# Facebook AI Research의 단백질 언어모델 라이브러리
pip install git+https://github.com/facebookresearch/esm.git
```

## 2.3 모델 파일 다운로드

HemoPI2 모델은 크기가 크기 때문에 따로 제공됩니다. 아래 링크에서 다운로드하세요.

[모델 파일 다운로드](https://webs.iiitd.edu.in/raghava/hemopi2/download.html)

다운로드한 zip 파일은 반드시 **압축을 해제**해야 정상적으로 동작합니다.

```bash
unzip HemoPI2_model.zip -d hemopi2_models/
```

# 3 기본 사용 용법

HemoPI2는 펩타이드의 **용혈 독성 여부 및 강도**를 예측하는 모델로, 크게 두 가지 모드를 지원합니다.

1. **회귀(Regression)** : HC50/EC50 값을 μM 단위로 예측 (RBC 50% 용해 농도)
2. **분류(Classification)** : 입력 서열이 용혈성인지, 비용혈성인지 판별

## 3.1 회귀 (Regression)

---

### 목적

- **HC50 또는 EC50 값**을 μM 단위로 예측하며, 값이 낮을수록 강한 용혈 활성을 의미합니다.
- 모델은 **랜덤 포레스트 회귀(Random Forest Regression, RFR)** 알고리즘 기반입니다.

### 기본 실행

```bash
hemopi2_regression.py -i peptide.fa
```

- `i` : 입력 파일 (FASTA 형식 또는 단순 서열 파일)
- 출력은 기본적으로 `outfile.csv`에 저장됩니다.

### 주요 옵션

```bash
usage: hemopi2_regression.py [-h] [-i INPUT] [-o OUTPUT] [-j {1,2,3,4}]
                             [-p POSITION] [-r RESIDUES]
                             [-w {8,...,20}] [-d {1,2}]
                             [-wd WORKING]
```

- `i` : 입력 (FASTA 또는 단순 서열 파일)
- `o` : 출력 파일명 (기본: `outfile.csv`)
- `j` : 작업 종류
    ```text
      1: 예측     2: 단백질 스캐닝     3: 설계 (특정 위치 변이 생성)     4: 가능한 모든 돌연변이체 설계
    ```
- `p` / `r` : 돌연변이 위치와 아미노산 지정 (설계 모듈에서 사용)
- `w` : 윈도우 길이 (8–20, 스캔 모듈 전용)
- `d` : 결과 표시 모드 (1: 용혈성만, 2: 전체)
- `wd` : 결과 저장할 작업 디렉토리 지정

### 입력 파일 형식

1. **FASTA 형식** (권장)

    ```text
    >peptide1
    AKLVFFV
    ```

2. **단순 형식** (한 줄에 하나씩 서열)

    ```text
    AKLVFFV
    GLSDGEWQQ
    ```


## 3.2 분류 (Classification)

---

### 목적

- 입력된 펩타이드가 **용혈성인지 비용혈성인지 판별**합니다.
- 내부적으로 **머신러닝(Random Forest)**, **단백질 언어 모델(ESM2-t6)**, **MERCI 기반 motif 분석**을 사용합니다.
- 기본 모델은 **Hybrid1(ESM2-t6 + MERCI)** 으로, 정확도와 속도의 균형이 가장 우수합니다.

### 기본 실행

```bash
hemopi2_classification -i peptide.fa
```

- `i` : 입력 파일 (FASTA 형식 또는 단순 서열 파일)
- 출력은 기본적으로 `outfile.csv`에 저장됩니다.

### 주요 옵션

```bash
usage: hemopi2_classification [-h] [-i INPUT] [-o OUTPUT]
                                 [-j {1,2,3,4,5}] [-m {1,2,3,4}]
                                 [-t THRESHOLD] [-p POSITION] [-r RESIDUES]
                                 [-w {8,...,20}] [-d {1,2}]
                                 [-wd WORKING]
```

- `i` : 입력 (FASTA 또는 단순 서열 파일)
- `o` : 출력 파일명 (기본: `outfile.csv`)
- `j` : 작업 종류
    
    ```text
      1: 예측 (기본값)      2: 단백질 스캐닝     3: 설계     4: 모든 돌연변이체 설계     5: 모티프 스캐닝
    ```
- `m` : 모델 선택
    ```text
      1: Random Forest     2: Hybrid1 (RF + MERCI)     3: ESM2-t6     4: Hybrid2 (ESM + MERCI)
    ```

- `t` : 임계값 (0–1 사이 값, 기본: 0.46 또는 0.55)
- `p`, `r` : 변이 설계 옵션
- `w` : 윈도우 길이 (스캔 모듈 전용)
- `d` : 결과 표시 모드 (1: 용혈성만, 2: 전체)
- `wd` : 결과 저장할 작업 디렉토리

## 3.3 출력 결과

---

- **회귀 모드**: HC50/EC50 예측값 (μM) 포함
- **분류 모드**: “Hemolytic / Non-hemolytic” 예측 결과와 점수 포함

# 4 데이터 선정

## 4.1 Histatin-3

---

![image.png](/image/info/detail/hemopi2_2.webp){center:600}

- **UniProt ID**: P15516
- **서열**: `DSHAKRHHGYKRKFHEKHHSHRGYRSNYLYDN`
- **출처**: 사람(Homo sapiens) 침샘에서 분비되는 **히스타틴(histatin) 계열 단백질**
- **독성 관련성**:
    - 적혈구에 대한 용혈 활성은 낮아 **비용혈성 펩타이드**로 분류되는 대표적인 사례
    - 임상적으로 독성보다는 생리적 방어 기능이 강조됨

## 4.2 Melittin

---

![image.png](/image/info/detail/hemopi2_3.webp){center:500}

- **UniProt ID**: P01501
- **서열**: `GIGAVLKVLTTGLPALISWIKRKRQQ`
- **출처**: 꿀벌(Apis mellifera) 독(벌독)에서 발견되는 주요 독성 펩타이드
- **독성 관련성**:
    - 강한 세포막 파괴 효과
    - 항균·항암 효과 보고 있으나, **적혈구 용혈 독성**이 매우 강함

## 4.3 선정 이유 및 타당성

---

Histatin-3와 Melittin을 선택한 이유는 두 펩타이드가 **뚜렷하게 대비되는 용혈 특성**을 가지고 있기 때문입니다. Histatin-3는 **인체에서 자연적으로 분비되며 독성이 낮은 비용혈성 펩타이드**로, 안전한 펩타이드의 대표 사례입니다. Melittin은 **벌독에서 유래한 강력한 용혈성 펩타이드**로, 독성 펩타이드의 대표적인 사례입니다.

따라서 두 펩타이드를 함께 비교하면, **HemoPI2 모델이 용혈성 vs 비용혈성 펩타이드의 차이를 정확히 예측할 수 있는지 직관적으로 검증**할 수 있습니다. 연구자 입장에서 교육적·실험적 설명력이 뛰어난 조합이라 할 수 있습니다.

## 5 예측하기

## 5.1 Linux CLI 사용하기

---

### 입력 파일 준비 (`peptides.fa`)

먼저 두 펩타이드 서열을 FASTA 형식으로 저장합니다.

```bash
cat > peptides.fa <<'EOF'
>Histatin-3|P15516
DSHAKRHHGYKRKFHEKHHSHRGYRSNYLYDN
>Melittin|P01501
GIGAVLKVLTTGLPALISWIKRKRQQ
EOF
```

### 회귀(Regression) 실행

HC50/EC50 (μM 단위) 값을 예측하여 **독성 강도**를 확인합니다.

```bash
hemopi2_regression -i peptides.fa -o regression_results.csv
```

### 분류(Classification) 실행

용혈성(Hemolytic)인지 비용혈성(Non-hemolytic)인지 판별합니다.

```bash
hemopi2_classification -i peptides.fa -o classification_results.csv -m 4
```

## 5.3 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/hemopi
```

화면에는 펩타이드의 아미노산 서열을  입력하는 창이 준비되어 있습니다. 또한 분석의 종류와 분석에 사용 할 펩타이드 단위 길이를 설정할 수 있습니다.

![image.png](/image/info/detail/hemopi2_4.webp){center:880}

여기에 분석에 필요한 모든 정보를 입력 한 후 **분석 시작** 버튼을 누르면 **HemoPI2** 도구가 입력된 정보로부터 펩타이드의 용혈 독성을 예측합니다.

# 6 분석 결과

## 6.1 Regression 분석 결과

---

### 전체 서열 (Job 1)

| SeqID | Sequence | HC50(μM) | Prediction |
| --- | --- | --- | --- |
| A | DSHAKRHHGYKRKFHEKHHSHRGYRSNYLYDN | 130.540 | Non-Hemolytic |
| B | GIGAVLKVLTTGLPALISWIKRKRQQ | 1.312 | Hemolytic |
- **Histatin-3**
    - HC50 ≈ **130.54 μM** → 값이 크다는 것은 **독성이 낮음**을 의미
    - 모델 결과: **Non-Hemolytic**
- **Melittin**
    - HC50 ≈ **1.31 μM** → 값이 매우 작아 **강력한 용혈 활성**을 가짐
    - 모델 결과: **Hemolytic**

전반적으로 **Histatin-3는 용혈력이 약하고, Melittin은 매우 강한 독성을 지닌다**는 실제 생물학적 사실과 일치합니다.

### 부분 패턴 분석 (Job 2)

| SeqID | Pattern ID | Start | End | Sequence | HC50(μM) | Prediction |
| --- | --- | --- | --- | --- | --- | --- |
| A | Pattern_1 | 1 | 20 | DSHAKRHHGYKRKFHEKHHS | 180.293 | Non-Hemolytic |
| A | Pattern_2 | 2 | 21 | SHAKRHHGYKRKFHEKHHSH | 177.608 | Non-Hemolytic |
| A | Pattern_3 | 3 | 22 | HAKRHHGYKRKFHEKHHSHR | 174.434 | Non-Hemolytic |
| A | Pattern_4 | 4 | 23 | AKRHHGYKRKFHEKHHSHRG | 183.150 | Non-Hemolytic |
| A | Pattern_5 | 5 | 24 | KRHHGYKRKFHEKHHSHRGY | 191.303 | Non-Hemolytic |
| A | Pattern_6 | 6 | 25 | RHHGYKRKFHEKHHSHRGYR | 183.018 | Non-Hemolytic |
| A | Pattern_7 | 7 | 26 | HHGYKRKFHEKHHSHRGYRS | 185.043 | Non-Hemolytic |
| A | Pattern_8 | 8 | 27 | HGYKRKFHEKHHSHRGYRSN | 188.040 | Non-Hemolytic |
| A | Pattern_9 | 9 | 28 | GYKRKFHEKHHSHRGYRSNY | 192.692 | Non-Hemolytic |
| A | Pattern_10 | 10 | 29 | YKRKFHEKHHSHRGYRSNYL | 183.107 | Non-Hemolytic |
| A | Pattern_11 | 11 | 30 | KRKFHEKHHSHRGYRSNYLY | 185.663 | Non-Hemolytic |
| A | Pattern_12 | 12 | 31 | RKFHEKHHSHRGYRSNYLYD | 177.932 | Non-Hemolytic |
| A | Pattern_13 | 13 | 32 | KFHEKHHSHRGYRSNYLYDN | 173.557 | Non-Hemolytic |
| B | Pattern_1 | 1 | 20 | GIGAVLKVLTTGLPALISWI | 27.230 | Hemolytic |
| B | Pattern_2 | 2 | 21 | IGAVLKVLTTGLPALISWIK | 24.059 | Hemolytic |
| B | Pattern_3 | 3 | 22 | GAVLKVLTTGLPALISWIKR | 21.630 | Hemolytic |
| B | Pattern_4 | 4 | 23 | AVLKVLTTGLPALISWIKRK | 19.152 | Hemolytic |
| B | Pattern_5 | 5 | 24 | VLKVLTTGLPALISWIKRKR | 28.848 | Hemolytic |
| B | Pattern_6 | 6 | 25 | LKVLTTGLPALISWIKRKRQ | 39.435 | Hemolytic |
| B | Pattern_7 | 7 | 26 | KVLTTGLPALISWIKRKRQQ | 99.796 | Hemolytic |
- Histatin-3 (길이 20 아미노산 윈도우 슬라이딩)
    - 모든 패턴에서 HC50 값이 **170–190 μM** 수준 → 안정적으로 비용혈성 패턴 유지
- Melittin (길이 20 윈도우)
    - 대부분 패턴에서 HC50 값이 **20–40 μM**, 일부 구간(패턴 7)에서 99 μM까지 증가
    - 전반적으로 **전체 서열 대비 부분 서열에서도 용혈성이 유지**

Histatin-3는 부분적으로 잘라 보아도 독성이 거의 나타나지 않음. 반면, Melittin은 대부분 구간에서 **강한 용혈 특성이 내재**되어 있음.

## 6.2 Classification 분석 결과

---

### 전체 서열 (Job 1)

| SeqID | Sequence | ML Score | Prediction |
| --- | --- | --- | --- |
| A | DSHAKRHHGYKRKFHEKHHSHRGYRSNYLYDN | 0.360 | Non-Hemolytic |
| B | GIGAVLKVLTTGLPALISWIKRKRQQ | 0.965 | Hemolytic |
- **Histatin-3**: ML Score 0.360 → **Non-Hemolytic**
- **Melittin**: ML Score 0.965 → **Hemolytic**

분류 모델 역시 두 펩타이드를 명확히 구분하는것으로 보여집니다.

### 부분 패턴 분석 (Job 2)

| SeqID | Pattern ID | Start | End | Sequence | ML Score | Prediction |
| --- | --- | --- | --- | --- | --- | --- |
| A | Pattern_1 | 1 | 20 | DSHAKRHHGYKRKFHEKHHS | 0.220 | Non-Hemolytic |
| A | Pattern_2 | 2 | 21 | SHAKRHHGYKRKFHEKHHSH | 0.150 | Non-Hemolytic |
| A | Pattern_3 | 3 | 22 | HAKRHHGYKRKFHEKHHSHR | 0.160 | Non-Hemolytic |
| A | Pattern_4 | 4 | 23 | AKRHHGYKRKFHEKHHSHRG | 0.135 | Non-Hemolytic |
| A | Pattern_5 | 5 | 24 | KRHHGYKRKFHEKHHSHRGY | 0.140 | Non-Hemolytic |
| A | Pattern_6 | 6 | 25 | RHHGYKRKFHEKHHSHRGYR | 0.175 | Non-Hemolytic |
| A | Pattern_7 | 7 | 26 | HHGYKRKFHEKHHSHRGYRS | 0.210 | Non-Hemolytic |
| A | Pattern_8 | 8 | 27 | HGYKRKFHEKHHSHRGYRSN | 0.235 | Non-Hemolytic |
| A | Pattern_9 | 9 | 28 | GYKRKFHEKHHSHRGYRSNY | 0.250 | Non-Hemolytic |
| A | Pattern_10 | 10 | 29 | YKRKFHEKHHSHRGYRSNYL | 0.235 | Non-Hemolytic |
| A | Pattern_11 | 11 | 30 | KRKFHEKHHSHRGYRSNYLY | 0.230 | Non-Hemolytic |
| A | Pattern_12 | 12 | 31 | RKFHEKHHSHRGYRSNYLYD | 0.275 | Non-Hemolytic |
| A | Pattern_13 | 13 | 32 | KFHEKHHSHRGYRSNYLYDN | 0.320 | Non-Hemolytic |
| B | Pattern_1 | 1 | 20 | GIGAVLKVLTTGLPALISWI | 0.735 | Hemolytic |
| B | Pattern_2 | 2 | 21 | IGAVLKVLTTGLPALISWIK | 0.805 | Hemolytic |
| B | Pattern_3 | 3 | 22 | GAVLKVLTTGLPALISWIKR | 0.780 | Hemolytic |
| B | Pattern_4 | 4 | 23 | AVLKVLTTGLPALISWIKRK | 0.765 | Hemolytic |
| B | Pattern_5 | 5 | 24 | VLKVLTTGLPALISWIKRKR | 0.755 | Hemolytic |
| B | Pattern_6 | 6 | 25 | LKVLTTGLPALISWIKRKRQ | 0.645 | Hemolytic |
| B | Pattern_7 | 7 | 26 | KVLTTGLPALISWIKRKRQQ | 0.405 | Non-Hemolytic |
- Histatin-3
    - 모든 패턴의 ML Score가 **0.13–0.32** 수준
    - 안정적으로 Non-Hemolytic 예측 → 전체적으로 **안전한 펩타이드**임을 뒷받침
- Melittin
    - 대부분 패턴이 **0.64–0.80** → Hemolytic으로 분류
    - 단, 패턴 7(KVLTTGLPALISWIKRKRQQ)은 0.405로 Non-Hemolytic에 가까움
    - → Melittin 내부에서도 일부 부분 서열은 상대적으로 독성이 낮을 수 있음을 시사

## 6.3 종합 평가

---

- **Histatin-3**: 침샘 단백질 펩타이드로, 회귀/분류/부분 패턴 모두에서 **비용혈성**으로 안정적으로 예측됨. 생리적 환경에서 안전성을 가지는 펩타이드임을 잘 보여줌.
- **Melittin**: 벌독 펩타이드로, 전체 서열은 강력한 **용혈성**으로 예측됨. 부분 서열 분석에서도 대체로 용혈성을 유지하나, 특정 구간(패턴 7)은 예외적으로 낮은 독성을 보일 수 있음.

두 펩타이드는 전형적인 **비용혈성 vs 용혈성 펩타이드의 대비 사례**로, HemoPI2 모델이 실제 생물학적 특성을 잘 반영하고 있음을 확인할 수 있습니다.

# 7 마치며

---

이번 분석을 통해 HemoPI2 모델이 펩타이드의 용혈 독성을 효과적으로 예측할 수 있음을 확인했습니다. **Histatin-3**는 비용혈성으로, **Melittin**은 강력한 용혈성으로 일관되게 분류되었으며, 이는 실제 생물학적 특성과도 잘 맞아떨어집니다.

이처럼 HemoPI2는 전통적인 실험보다 빠르고 효율적으로 독성 여부를 평가할 수 있어, 신약 개발 과정에서 후보 펩타이드를 선별하는 데 큰 도움을 줄 수 있습니다. 앞으로 다양한 펩타이드 서열을 분석하는 과정에서도 **안전성과 독성의 균형을 검증하는 핵심 도구**로 활용될 수 있을 것입니다.

# 8 Reference

---

- [Github HemoPI2](https://github.com/raghavagps/HemoPI2)
- [HemoPI2: Prediction of hemolytic potential of peptides](https://webs.iiitd.edu.in/raghava/hemopi2/index.html)
- [Nature](https://www.nature.com/articles/s42003-025-07615-w)
- CURIE : [HemoPI2](https://curie.kr/Analysis/hemopi)

---

[tool-button:HEMOPI2]
