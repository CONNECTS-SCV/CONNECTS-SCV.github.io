---
layout: post
title: "DILI : 간독성 유발 가능성이 있는 물질과 안전한 물질의 특성 비교"
description: "신약 개발 초기 단계에서 화합물의 간 독성 리스크를 평가하는 이진 분류 예측 모델"
categories: [분석 모델]
tags: [DILI, Drug-Induced Liver Injury, 간독성, 예측모델, 신약개발]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/dilipred_1.webp"
---

![image](/image/info/detail/dilipred_1.webp){center:400}

신약 개발 과정에서 가장 큰 위험 요소 중 하나가 바로 **간 손상(DILI, Drug-Induced Liver Injury)** 입니다. 수많은 후보 물질이 임상에 도달하지 못하는 이유도 여기에 있죠.

이 도구는 화합물의 **화학구조, 약동학적 특성(Cmax 등), in vitro / in vivo 데이터**를 함께 분석해 간 손상 가능성을 예측합니다. 덕분에 복잡한 실험을 모두 거치지 않아도, 초기 단계에서 위험 후보를 빠르게 걸러낼 수 있습니다.

사용법도 어렵지 않습니다. SMILES 문자열을 입력하면 분자의 기본적인 정보를 파악하여, 모델이 해당 물질의 간 독성 유발 가능성을 계산해 줍니다. 이를 통해 연구자는 더 안전하고 가능성 높은 후보를 선별할 수 있죠.

# 1 사용된 도구

---

- **DILIPredictor** 약물에 의한 간 손상 가능성을 예측하는 도구입니다.

# 2 **DILIPredictor 설치 방법**

설치 방법은 크게 두 가지가 있습니다. **PyPI를 통한 간단 설치**와 **소스에서 직접 빌드**입니다.

## 2.1 PyPI에서 설치하기

---

가장 간단한 방법은 pip를 사용하는 것입니다.

```bash
pip install dilipred
```

- **Python 버전 주의**: 3.9 이상, 3.12 미만에서 지원됩니다.
- 설치가 완료되면 바로 `dilipred` 라이브러리를 import하여 사용할 수 있습니다.

## 2.2 소스에서 직접 빌드하기

---

PyPI 대신, 저장소를 직접 클론해서 빌드하는 방법도 있습니다. 이 경우 `python-poetry`를 사용합니다.

1. 저장소를 클론합니다.

    ```bash
    git clone https://github.com/Manas02/dili-pip.git
    ```

2. 프로젝트 디렉토리로 이동합니다.

    ```bash
    cd dili-pip/
    ```

3. 종속성을 설치합니다.

    ```bash
    poetry install
    ```

4. 가상환경을 활성화합니다.

    ```bash
    poetry shell
    ```

5. 프로젝트를 빌드합니다.

    ```bash
    poetry build
    ```


이 과정을 거치면 개발 환경에서 직접 DILI Predictor를 실행하거나 수정해볼 수 있습니다.

# 3 기본 사용 용법

## 3.1 Python 라이브러리로 실행하기

---

좀 더 유연하게 활용하고 싶다면, Python 코드 안에서 직접 DILI Predictor를 불러와 사용할 수 있습니다.

```python
from dilipred import DILIPRedictor

if __name__ == '__main__':
    dp = DILIPRedictor()
    smiles = "SMILES_STRING"
    result = dp.predict(smiles)
    print(result)
```

- `DILIPRedictor()` 객체를 생성하고
- `predict()` 메서드에 **SMILES 문자열**을 넣으면
- 예측 결과가 `result` 변수에 반환됩니다.

출력 결과는 해당 분자의 **DILI 가능성 점수**로, 연구자가 후보 물질을 평가할 때 참고할 수 있습니다.

## 3.2 CLI로 실행하기

설치를 마쳤다면 터미널에서 바로 `dilipred` 명령어를 사용할 수 있습니다.

```bash
dilipred -h
```

이 명령어를 입력하면 사용 가능한 옵션과 명령어 목록이 출력됩니다. 이를 통해 **SMILES 문자열을 입력**하고 바로 예측을 실행할 수 있습니다.

예를 들어:

```bash
dilipred --smiles "SMILES_STRING" --out OUTPUT_PATH
```

위 명령을 실행하면 `"SMILES_STRING"`라는 분자의 간손상 예측 결과가 Dilipred_Result.csv에 기록되어 저장됩니다. CLI 방식은 빠르게 테스트하거나 간단한 예측을 확인할 때 유용할 것 같습니다.

# 4 데이터 선정

## 4.1 Glucose (포도당)

---

- **화학식**: C₆H₁₂O₆
- **분자량**: 약 180.16 g/mol
- **SMILES**: `C(C1C(C(C(C(O1)O)O)O)O)O`

![image](/image/info/detail/dilipred_2.webp){center:300}

- **특징**:
  - 단순 당류(Monosaccharide)로, 인체의 주요 에너지원
  - 정상적인 농도에서는 간에 독성을 유발하지 않음
  - **비독성, 안전 물질**의 대표 사례

따라서 Glucose는 모델이 **간독성 없음**으로 올바르게 예측해야 하는 대조군으로 적합하다고 판단했습니다.

## 4.2 Acetaminophen (아세트아미노펜)

---

- **화학식**: C₈H₉NO₂
- **분자량**: 약 151.16 g/mol
- **SMILES**: `CC(=O)NC1=CC=C(C=C1)O`

![image](/image/info/detail/dilipred_3.webp){center:300}

- **특징**:
  - 해열·진통제로 널리 쓰이는 일반의약품
  - 저용량에서는 안전하지만, **고용량 복용 시 간손상(DILI)을 유발**
  - 간에서 독성 대사체(NAPQI)가 생성되어 간세포 손상을 일으킴
  - 실제로 **약물 유발 간손상의 대표적 사례**로 꼽힘

따라서 Acetaminophen은 모델이 **간독성 위험 있음**을 올바르게 예측해야 하는 대표 사례입니다.

## 4.3 선정 이유 요약

- **Glucose** → 안전하고 필수적인 대사 물질, **비독성** 예시
- **Acetaminophen** → 실제 임상에서도 보고되는 대표적인 간독성 유발 약물, **독성** 예시

이렇게 극명히 다른 두 물질을 비교하면, DILI Predictor의 예측 결과가 어떻게 달라지는지 직관적으로 확인할 수 있습니다. 즉, 모델의 활용 가치를 이해하기에 가장 좋은 조합으로 보여집니다.

# 5 예측하기

## 5.1 Linux CLI

---

Dili 예측에 사용  SMILES는 다음과 같습니다.

```text
C(C1C(C(C(C(O1)O)O)O)O)O # Glucose
CC(=O)NC1=CC=C(C=C1)O #Acetaminophen
```

실행 예시는 다음과 같습니다.

```bash
dilipred --smiles "C(C1C(C(C(C(O1)O)O)O)O)O" --out ./results/glucose_result.csv

dilipred --smiles "CC(=O)NC1=CC=C(C=C1)O" --out ./results/acetaminophen_result.csv
```

이 명령을 실행하면  DILI 예측 결과가 `result.csv` 파일로 저장됩니다.

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI와 Python 라이브러리 실행 방법을 살펴봤다면, 이번에는 **웹페이지 GUI**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/dilipred
```

화면에는 SMILES 문자열을 입력하는 창이 준비되어 있습니다.

![CURIE의 DILI 입력창](/image/info/detail/dilipred_4.webp){center:880}[CURIE의 DILI 입력창]

여기에 분석할 분자의 SMILES를 입력하면 됩니다.

```text
C(C1C(C(C(C(O1)O)O)O)O)O # Glucose
CC(=O)NC1=CC=C(C=C1)O #Acetaminophen
```

이후 **분석 시작** 버튼을 누르면 DILI 예측이 시작되며 빠르게 결과를 확인할 수 있습니다.

# 6 분석 결과

## 6.1 예측 결과 확인

---

`DILIst_FDA`을 기반으로 분석한 화합물의 **DILI 예측 결과**가 표시됩니다.

- **아세트아미노펜 (Acetaminophen)**
  - `DILIst_FDA` 값: **0.73** → **DILI 양성(Positive)**
  - 즉, 간독성 위험이 있는 물질로 예측됨.
- **포도당 (Glucose)**
  - `DILIst_FDA` 값: **0.35** → **DILI 음성(Negative)**
  - 즉, 안전성이 높은 물질로 예측됨.

## 6.2 Cmax 값 확인

---

분석이 마무리 되면 **Cmax (최고 혈중 농도)** 값이 표시됩니다.

**비결합 Cmax는** 약물이 단백질에 결합하지 않은 상태에서의 농도를 나타내며, **총 Cmax는** 전체 혈중 농도를 나타냅니다. 이 값은 약물이 체내에 도달하는 수준을 의미하며, 독성 여부를 해석할 때 중요한 참고 지표로 활용됩니다.

- **포도당**
  - Unbound Cmax: **10.06 µM**
  - Total Cmax: **20.48 µM**
- **아세트아미노펜**
  - Unbound Cmax: **10.72 µM**
  - Total Cmax: **19.16 µM**

두 물질의 Cmax는 유사한 수준으로, **체내 노출량 자체만 보면 큰 차이가 없습니다.** 즉, 단순히 Cmax 크기만으로 DILI 여부가 결정되지 않는다는 점을 확인할 수 있습니다.

## 6.3 SHAP 기반 기여 요인 분석

---

추가적으로 SHAP 그래프가 표시됩니다. 이 단계에서는 **어떤 실험적 지표나 데이터**가 해당 물질의 **DILI 예측에 가장 크게 작용했는지**를 해석할 수 있습니다.

**SHAP Graph #1**

![Glucose에 대한 SHAP 그래프(CURIE)](/image/info/detail/dilipred_5.webp){center:600}[Glucose에 대한 SHAP 그래프(CURIE)]

**SHAP Graph #2**
![Acetaminopen에 대한 SHAP 그래프(CURIE)](/image/info/detail/dilipred_5.webp){center:600}[Acetaminopen에 대한 SHAP 그래프(CURIE)]


두 물질 모두 BSEP 억제, 미토콘드리아 독성, 반응성 대사체 생성 같은 **기전 기반 독성 지표**에서는 낮은 값을 보였습니다.  또한 **아세트아미노펜**은 **Animal hepatotoxicity B**와 **Preclinical hepatotoxicity**에서 양성 판정을 받으며 위험 신호가 강하게 나타냈습니다. 하지만 **포도당**은 대부분의 지표에서 음성으로 나왔으며, Preclinical 지표에서만 약한 양성이 보였을 뿐 전반적으로 안전성이 우세한 모습을 보였습니다.

## 6.4 종합 평가

---

**아세트아미노펜**은 Cmax 수치가 포도당과 크게 다르지 않았지만, 동물실험과 전임상 지표에서 강한 독성 신호가 확인되어 최종적으로 **DILI 양성** 판정을 받았습니다. 이는 실제 임상에서 아세트아미노펜이 고용량 복용 시 간손상의 대표적 원인으로 알려진 사실과도 일치하는 것 같습니다.

이처럼 DILI Predictor는 단순히 Cmax만을 기준으로 하지 않고, 다양한 독성 지표와 구조적 특징을 종합적으로 고려해 결과를 제시한다는 점에서 의미가 있습니다.

# 7 마치며

---

DILI Predictor는 두 가지 방식으로 활용할 수 있습니다.

**CLI**는 여러 분자를 한꺼번에 처리하거나 결과를 파일로 저장해 후속 분석에 연결할 수 있다는 점에서 강력합니다. 다만, 환경 설정과 명령어 사용에 익숙해야 한다는 점에서 분명한 진입 장벽이 존재합니다.

반대로 **CURIE 웹페이지**는 설치 과정 없이 단순히 접속 후 SMILES를 입력하고 버튼을 클릭하기만 하면 됩니다. 몇 초 안에 예측 결과를 확인할 수 있어 훨씬 직관적이고 간단하며, 특히 연구 경험이 많지 않은 사용자도 부담 없이 활용할 수 있다는 점이 가장 큰 장점이 될 수 있습니다.

상황에 맞게 두 방식을 선택해 사용한다면, DILI Predictor는 연구 현장에서 더욱 유용한 도구가 될 것입니다.

# 8 Reference

---

- [Github DILI](https://github.com/srijitseal/DILI/tree/main)
- CURIE : [Dilipred](https://curie.kr/Analysis/dilipred)

---

[tool-button:DILIPred]