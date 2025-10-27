---
layout: post
title: "AbDev : AbDev로 실험하는 mAb의 개발 가능성 평가"
description: "항체의 물리적 특성을 기반으로 개발 가능성을 예측하는 AI 모델"
categories: [analysis]
tags: [AbDev, 항체, 개발가능성, 물리화학적 특성, DeepSP]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/abdev_1.webp"
comment_id: "abdev_detail"
---
![PRODIGY 결과](/image/info/detail/abdev_1.webp){center:600}

항체 의약품 개발 과정에서는 수많은 후보들이 발굴되지만, 실제 임상 단계까지 도달하는 경우는 많지 않습니다. 그 과정에서 **불안정한 구조, 낮은 발현성, 높은 점도, 친수성·소수성의 불균형** 같은 문제들이 걸림돌이 되곤 하죠.

이런 리스크를 줄여 주는 데 도움이 되는 도구가 바로 [**AbDev**](https://github.com/Lailabcode/AbDev)입니다. AbDev는 항체의 **아미노산 서열만으로 안정성, 점도, 발현 가능성** 등 다양한 developability 지표를 계산해 줍니다. 덕분에 연구자는 복잡한 실험을 거치지 않고도 후보 물질의 적합성을 빠르게 파악할 수 있습니다.

이번 튜토리얼에서는 AbDev를 직접 활용해 보면서, 전문적인 계산 지식이 없어도 어떻게 항체 후보의 개발 가능성을 평가할 수 있는지 살펴보려 합니다.

# 1 사용된 도구

---

- **ANARCI**는 항체의 Heavy chain과 Light chain 서열에서 CDR 구간을 찾아내고, 이를 일관된 표준 형식으로 정리해주는 도구입니다.
- **DeepSP** 항체의 CDR 서열 정보를 입력받아, 별도의 단백질 구조 데이터 없이도 해당 항체의 공간적 특성을 예측할 수 있는 모델입니다. 총 30개의 공간적 특징을 생성하고, 이는 후속 모델의 입력으로 사용됩니다.
- **AbDev** 단일클론항체(mAb) 생물물리학적 특성에 대한 예측 모델 패키지입니다.

# 2 **설치 방법**

분석을 진행하기 앞서 **DeepSP**와 **AbDev**를 설치하는 방법을 단계별로 정리했습니다.

## 2.1 DeepSP 설치 (Anarci 종속성 포함)

---

### 저장소 클론 및 DeepSP 설치

```bash
git clone https://github.com/Lailabcode/DeepSP.git
cd DeepSP

# Python 3.9.13 환경 생성
conda create -n deepSP python=3.9.13  

# 환경 활성화
conda activate deepSP  

# ANARCI 설치
conda install -c bioconda anarci  

# 필수 라이브러리 설치
pip install keras==2.11.0 tensorflow-cpu==2.11.0 scikit-learn==1.0.2 pandas numpy==1.26.4
```

## 2.2 AbDev 설치

---

### 저장소 클론

```bash
git clone https://github.com/Lailabcode/AbDev.git
cd AbDev
```

저장소에 포함 된 [`train.py`](http://train.py) 를 이용하여 예측 결과를 직접 얻을 수 있습니다.

# 3 기본 사용 용법

## 3.1 DeepSP

---

DeepSP는 **`DeepSP_input.csv`** 형식의 파일을 입력으로 사용합니다. → 이 파일에는 분석할 항체 서열(CDR 영역)이 포함되어 있어야 합니다.

다음 명령어로 DeepSP를 실행합니다.

```bash
python deepsp_predictor.py -i INPUT_PATH -o OUTPUT_PATH
```

실행이 완료되면, 입력된 서열에 대한 **30가지 구조적 특성** 이 계산되어 **`DeepSP_descriptor.csv`** 파일로 저장됩니다.

## 3.2 AbDev

---

AbDev는 항체의 developability를 평가하는 모델입니다. 준비된 항체 서열을 바탕으로 아래 명령어를 실행하면 결과를 얻을 수 있습니다.

```bash
python train.py -i INPUT_PATH -o OUTPUT_PATH
```

실행이 완료되면, 입력된 서열의 **developability 지표**가 예측되어 결과 파일로 출력됩니다.

두 도구를 연계하면 **항체 서열 → 구조적 특성 → 개발 가능성 평가**라는 일련의 과정을 손쉽게 진행할 수 있습니다.

# 4 데이터 선정

---

이번 튜토리얼에서는 실제 항체 의약품으로 잘 알려진 3종의 항체 서열을 예시 데이터로 활용합니다.

- **Abituzumab, Abrilumab, Adalimumab**
  각 항체에 대해 **Heavy chain(VH)** 과 **Light chain(VL)** 서열을 함께 준비했으며, 이는 공개된 항체 의약품 데이터베이스에서 확인할 수 있습니다. 이후 AbDev의 입력 형식에 맞도록 FASTA 파일로 정리하여 활용합니다.

**Heavy chain (VH)**

```text
>abituzumab
QVQLQQSGGELAKPGASVKVSCKASGYTFSSFWMHWVRQAPGQGLEWIGYINPRSGYTEYNEIFRDKATMTTDTSTSTAYMELSSLRSEDTAVYYCASFLGRGAMDYWGQGTTVTVSS

>abrilumab
QVQLVQSGAEVKKPGASVKVSCKVSGYTLSDLSIHWVRQAPGKGLEWMGGFDPQDGETIYAQKFQGRVTMTEDTSTDTAYMELSSLKSEDTAVYYCATGSSSSWFDPWGQGTLVTVSS

>adalimumab
EVQLVESGGGLVQPGRSLRLSCAASGFTFDDYAMHWVRQAPGKGLEWVSAITWNSGHIDYADSVEGRFTISRDNAKNSLYLQMNSLRAEDTAVYYCAKVSYLSTASSLDYWGQGTLVTVSS
```

**Light chain (VL)**

```text
>abituzumab
DIQMTQSPSSLSASVGDRVTITCRASQDISNYLAWYQQKPGKAPKLLIYYTSKIHSGVPSRFSGSGSGTDYTFTISSLQPEDIATYYCQQGNTFPYTFGQGTKVEIK

>abrilumab
DIQMTQSPSSVSASVGDRVTITCRASQGISSWLAWYQQKPGKAPKLLIYGASNLESGVPSRFSGSGSGTDFTLTISSLQPEDFANYYCQQANSFPWTFGQGTKVEIK

>adalimumab
DIQMTQSPSSLSASVGDRVTITCRASQGIRNYLAWYQQKPGKAPKLLIYAASTLQSGVPSRFSGSGSGTDFTLTISSLQPEDVATYYCQRYNRAPYTFGQGTKVEIK
```

이러한 항체들은 실제 임상에서 사용되는 치료용 항체이기 때문에, **AbDev가 예측하는 개발 가능성 지표를 학습용/실습용 예시로 선정했습니다**. 또한 Heavy chain과 Light chain을 모두 포함시켜, 항체의 developability 평가 과정을 보다 실제적인 시나리오에 맞춰 체험할 수 있습니다.

# 5 예측하기

## 5.1 Linux CLI

---

AbDev 모듈을 활용하기 위해서는 먼저 항체 서열 데이터를 **DeepSP가 요구하는 입력 형식으로 전처리**해야 합니다.

**입력 데이터 준비**

```text
pair name,heavy chain seq,light chain seq
```

pair name, Heavy chain 서열, Light chain 서열 순서로 작성 해야합니다. 또한 각 항목은 콤마 `,`로 구분하여 `.csv`  파일로 저장하여 DeepSP의 입력으로 사용됩니다.

**DeepSP 실행**

DeepSP를 먼저 실행하여 항체 서열로부터 구조적 특성을 추출합니다.

```bash
python deepsp_predictor.py -i INPUT_PATH -o OUTPUT_PATH
```

- `INPUT_PATH`: 전처리된 CSV 파일 경로
- `OUTPUT_PATH`: 결과 파일을 저장할 경로

실행이 완료되면 **`DeepSP_descriptor.csv`** 파일이 생성됩니다. 이 파일에는 각 항체에 대해 계산된 **30가지 공간적 특성 값**이 포함되어 있습니다.

**AbDev 실행**

이제 DeepSP에서 생성한 `DeepSP_descriptor.csv`를 AbDev의 입력으로 사용합니다.

```bash
python train.py -i INPUT_PATH/DeepSP_descriptor.csv -o OUTPUT_PATH
```

- `INPUT_PATH`: `DeepSP_descriptor.csv` 파일 경로
- `OUTPUT_PATH`: AbDev 분석 결과가 저장될 경로

AbDev는 DeepSP에서 생성된 구조적 특성을 바탕으로, 항체의 **안정성, 점도, 발현성 등 개발 가능성 지표**를 예측합니다.

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI와 Python 라이브러리 실행 방법을 살펴봤다면, 이번에는 **웹페이지 GUI**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/abdev
```

항체 서열에 대한 정보를 입력하는 방식은 두 가지가 있으며,  두 방식 모두 위 형식에 맞추어 **자동으로 전처리**를 진행하도록 설계되어 있습니다.
### **PDB 파일 업로드**

![항체가 포함 된 PDB 구조 업로드 방식](/image/info/detail/abdev_2.webp){center:880}[항체가 포함 된 PDB 구조 업로드 방식]

항체의 3D 구조가 포함된 PDB 파일을 업로드하면, 프로그램이 자동으로 내부의 **CHAIN 정보 및 항체 서열을 식별**합니다.

### **서열 직접 입력**

![항체의 서열을 직접 입력하는 방식](/image/info/detail/abdev_3.webp){center:880}[항체의 서열을 직접 입력하는 방식]

FASTA 형식의 항체 서열을 직접 입력할 수도 있습니다. 이 경우, 입력된 서열이 순서대로 1:1로 Heavy chain와 Light chain에 매칭됩니다. 따라서, 아래 서열을 차례대로 입력만 하면 됩니다.

```text
>abituzumab. VH
QVQLQQSGGELAKPGASVKVSCKASGYTFSSFWMHWVRQAPGQGLEWIGYINPRSGYTEYNEIFRDKATMTTDTSTSTAYMELSSLRSEDTAVYYCASFLGRGAMDYWGQGTTVTVSS

>abituzumab. VL
DIQMTQSPSSLSASVGDRVTITCRASQDISNYLAWYQQKPGKAPKLLIYYTSKIHSGVPSRFSGSGSGTDYTFTISSLQPEDIATYYCQQGNTFPYTFGQGTKVEIK

>abrilumab. VH
QVQLVQSGAEVKKPGASVKVSCKVSGYTLSDLSIHWVRQAPGKGLEWMGGFDPQDGETIYAQKFQGRVTMTEDTSTDTAYMELSSLKSEDTAVYYCATGSSSSWFDPWGQGTLVTVSS

>abrilumab. VL
DIQMTQSPSSVSASVGDRVTITCRASQGISSWLAWYQQKPGKAPKLLIYGASNLESGVPSRFSGSGSGTDFTLTISSLQPEDFANYYCQQANSFPWTFGQGTKVEIK

>adalimumab. VH
EVQLVESGGGLVQPGRSLRLSCAASGFTFDDYAMHWVRQAPGKGLEWVSAITWNSGHIDYADSVEGRFTISRDNAKNSLYLQMNSLRAEDTAVYYCAKVSYLSTASSLDYWGQGTLVTVSS

>adalimumab. VL
DIQMTQSPSSLSASVGDRVTITCRASQGIRNYLAWYQQKPGKAPKLLIYAASTLQSGVPSRFSGSGSGTDFTLTISSLQPEDVATYYCQRYNRAPYTFGQGTKVEIK
```

### **분석 시작**

항체 서열만 넣어주면, 뒤에 일어나는 복잡한 일들은 걱정하지 않으셔도 됩니다. 자동으로 전처리가 이루어져 CSV로 바뀌고, **DeepSP**가 구조적 특성을 뽑아낸 뒤, 곧바로 **AbDev**가 받아서 안정성, 점도, 발현성 같은 개발 가능성 지표를 알아서 계산해 줍니다.

결국 사용자가 하는 일은 단순합니다. **입력 → 전처리 → DeepSP → AbDev → 결과 확인** 이렇게 한 번의 흐름으로 깔끔하게 끝! 마치 원스톱 항체 평가 서비스 같은 느낌으로 진행할 수 있죠.

# 6 분석 결과

## 6.1 DeepSP 분석

---

Abituzumab은 **결합 부위인 CDRH3에서 꽤 괜찮은 친화도**를 보여주었지만, 라이트체인 쪽에서 살짝 불안한 기색이 보였습니다. 즉, 붙는 힘은 나쁘지 않은데 안정성 관리가 필요할 수 있다는 뜻이죠. Abrilumab은 전반적으로 **결합력 자체는 그리 세지 않지만**, penalty 점수가 높게 나와서 구조적인 안정성 측면에서는 조금 부담이 있습니다. Adalimumab은 세 항체 중에서 가장 강하게 붙는 힘을 보여주었지만, 동시에 penalty도 크게 나와서 안정성 쪽에서는 신경을 써야 하는 후보였습니다.

| **Name** | **SAP_pos_CDRH1** | **SAP_pos_CDRH2** | **SAP_pos_CDRH3** | **SAP_pos_CDRL1** | **SAP_pos_CDRL2** |
| --- | --- | --- | --- | --- | --- |
| abituzumab | 3.859765 | 4.345275 | 8.718714 | 2.148603 | 4.696158 |
| abrilumab | 3.417133 | 1.079904 | 1.82865 | 2.087436 | 2.4022 |
| adalimumab | 2.134781 | 2.524246 | 14.44508 | 1.904735 | 3.589353 |

| **Name** | **SAP_pos_CDRL3** | **SAP_pos_CDR** | **SAP_pos_Hv** | **SAP_pos_Lv** | **SAP_pos_Fv** |
| --- | --- | --- | --- | --- | --- |
| abituzumab | 6.794337 | 30.68 | 45.52782 | 36.42514 | 82.6564 |
| abrilumab | 6.014893 | 17.92553 | 43.01152 | 31.2316 | 74.51298 |
| adalimumab | 3.172182 | 27.4968 | 58.41765 | 30.51766 | 89.32829 |

| **Name** | **SCM_neg_CDRH1** | **SCM_neg_CDRH2** | **SCM_neg_CDRH3** | **SCM_neg_CDRL1** | **SCM_neg_CDRL2** |
| --- | --- | --- | --- | --- | --- |
| abituzumab | 26.55882 | 6.041327 | 32.17058 | 122.0701 | 5.670298 |
| abrilumab | 182.0437 | 178.2813 | 119.2505 | 44.65598 | 37.7991 |
| adalimumab | 166.7982 | 62.51917 | 61.63194 | 18.17407 | 6.928162 |

| **Name** | **SCM_neg_CDRL3** | **SCM_neg_CDR** | **SCM_neg_Hv** | **SCM_neg_Lv** | **SCM_neg_Fv** |
| --- | --- | --- | --- | --- | --- |
| abituzumab | 113.7588 | 317.855 | 542.9095 | 520.8762 | 1062.814 |
| abrilumab | 101.4316 | 672.6177 | 1143.67 | 451.4783 | 1579.041 |
| adalimumab | 106.4237 | 430.5371 | 817.643 | 362.9145 | 1185.106 |

| **Name** | **SCM_pos_CDRH1** | **SCM_pos_CDRH2** | **SCM_pos_CDRH3** | **SCM_pos_CDRL1** | **SCM_pos_CDRL2** |
| --- | --- | --- | --- | --- | --- |
| abituzumab | 33.35616 | 50.21487 | 58.55172 | 37.3822 | 99.53086 |
| abrilumab | 3.424613 | -1.28163 | 7.433345 | 36.73027 | 8.360378 |
| adalimumab | 3.183172 | 19.58338 | 29.51347 | 116.7695 | 41.75935 |

| **Name** | **SCM_pos_CDRL3** | **SCM_pos_CDR** | **SCM_pos_Hv** | **SCM_pos_Lv** | **SCM_pos_Fv** |
| --- | --- | --- | --- | --- | --- |
| abituzumab | 19.1548 | 301.2656 | 877.3536 | 1176.29 | 2044.643 |
| abrilumab | 19.30849 | 67.65997 | 919.621 | 941.5042 | 1849.139 |
| adalimumab | 55.54828 | 263.8389 | 907.1132 | 1219.445 | 2109.089 |

## 6.2 ABDEV

---

Abituzumab은 전체적으로 무난했고, Abrilumab은 aggregation·발현성·열 안정성 모두 우수해 가장 안정적이었습니다. Adalimumab은 binding 성능이 뛰어나지만 발현성과 안정성에서 리스크가 존재했습니다.

| **Name** | **ACSINS** | **AS** | **BVP** | **CIC** | **CSI** | **ELISA** |
| --- | --- | --- | --- | --- | --- | --- |
| abituzumab | 0.145749 | 0.062029 | 2.241486 | -0.40037 | 0.770808 | 1.246774 |
| abrilumab | -1.67293 | 0.03154 | 1.514032 | -1.30121 | -0.57813 | 1.09852 |
| adalimumab | -0.07908 | 0.051246 | 1.92348 | 0.448578 | 0.009973 | 1.106229 |

| **Name** | **HIC** | **HEK** | **PSR** | **SGAC** | **SMAC** | **Tm** |
| --- | --- | --- | --- | --- | --- | --- |
| abituzumab | 9.607291 | 110.5475 | 0.22007 | 0.087205 | -0.60923 | 74.33333 |
| abrilumab | 9.177883 | 133.4755 | 0.094441 | 0.500755 | -0.76425 | 76.16667 |
| adalimumab | 9.397526 | 115.6309 | 0.077223 | 0.321487 | -0.46113 | 72.33333 |

## 6.3 상관관계 분석

---

일부 지표가 서로 강하게 연결된 패턴이 확인되었습니다. 예를 들어 HIC와 ELISA, PSR과 SGAC는 양의 상관을 보였고, aggregation 지표인 ACSINS와 열 안정성(Tm)은 음의 상관을 보였습니다. 이는 개발 과정에서 특정 특성들이 함께 변할 수 있음을 보여줍니다.

![Correlation map](/image/info/detail/abdev_4.webp){center:600}[Correlation map]

## 6.4 분포 분석

---

먼저, 세 항체가 **개발된 항체들의 전형적인 분포 속에서 어떤 위치**를 차지하는지 살펴봤습니다.

Abituzumab은 전반적으로 **평균에 가까운 값들**을 보여주었는데, 이는 특별히 위험한 지표도 없고 동시에 돋보이는 장점도 없는, 말 그대로 무난한 프로파일이라 할 수 있습니다. Abrilumab은 조금 달랐습니다. **aggregation 위험이 낮게 나오고 열 안정성(Tm) 값도 가장 높아**, 안정성 면에서는 세 후보 중 가장 두드러졌습니다. Adalimumab은 **binding 관련 지표에서 확실한 장점**이 있었지만, Tm 값이 낮아 안정성에서는 뒤처졌습니다. 즉, 결합력은 뛰어나지만 열 안정성 면에서는 보완이 필요한 모습이었습니다.

![Scatter plot](/image/info/detail/abdev_5.webp){center:600}[Scatter plot]

## 6.5 종합 평가

---

Abituzumab은 평균적인 후보로 볼 수 있고, Abrilumab은 가장 개발 성공 가능성이 높은 안정적 후보였습니다. Adalimumab은 binding 성능은 우수하지만 제조 및 안정성 최적화가 필요하다는 점이 드러났습니다.

# 7 마치며

---

이번 튜토리얼에서는 **AbDev**와 **DeepSP**를 활용해 항체 후보의 개발 가능성을 평가하는 전체 과정을 따라가 보았습니다.

복잡한 구조 모델링이나 대규모 실험을 거치지 않고도, 단순히 서열만 입력하면 **자동 전처리 → 구조적 특성 추출 → developability 예측**까지 이어지는 원스톱 분석을 체험할 수 있었죠.

세 가지 실제 항체 사례(Abituzumab, Abrilumab, Adalimumab)를 통해 살펴본 결과, 각 후보마다 다른 강점과 약점이 드러났습니다. 어떤 항체는 **안정성**에서, 또 어떤 항체는 **binding 성능**에서 두각을 보였지만, 동시에 보완해야 할 리스크도 함께 확인할 수 있었습니다.

이 경험이 보여주는 핵심은 단순합니다.

**하나의 지표만으로는 항체의 미래를 단정 지을 수 없으며, 여러 특성을 종합적으로 이해해야 한다**는 점입니다. AbDev는 바로 이 과정을 훨씬 쉽게 만들어 주는 도구로, 연구자가 빠르게 후보를 선별하고 효율적으로 다음 단계를 준비할 수 있게 도와줍니다.

앞으로 여러분이 새로운 항체 서열을 마주할 때, 이번 튜토리얼의 흐름을 그대로 적용해 보세요. 입력만 준비하면 나머지는 자동으로 흘러가며, 결과는 곧바로 눈앞에 나타납니다. **마치 항체 평가를 위한 개인 연구 어시스턴트를 곁에 두는 것처럼 말이죠.**

# 8 Reference

---

- [Github AbDev](https://github.com/Lailabcode/AbDev/tree/main)
- [Github DeepSP](https://github.com/Lailabcode/DeepSP)
- [Github ANARCI](https://github.com/oxpig/ANARCI)
- CURIE : [AbDev](https://curie.kr/Analysis/abdev), [Dilipred](https://curie.kr/Analysis/dilipred)

---

[tool-button:Abdev]