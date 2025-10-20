---
layout: post
title: "StrucToxNet : 뱀독소와 라이소자임의 PDB 구조를 기반으로 한 독성 예측 비교"
description: "펩타이드의 3D 구조와 서열 정보를 결합하여 독성 여부를 이진 분류로 예측하는 모델로, 특히 짧은 펩타이드 예측에 강점을 가집니다."
categories: [분석 모델]
tags: [StrucToxNet, 펩타이드 독성, 3D 구조, 예측 모델, GNN]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/structoxnet_1.webp"
---

![image](/image/info/detail/structoxnet_1.webp){center:880}

단백질이나 펩타이드의 독성 여부는 신약 개발 과정에서 반드시 확인해야 하는 중요한 요소입니다. 하지만 실험적으로 독성을 검증하는 과정은 많은 시간과 비용이 들고, 구조적으로 복잡한 단백질일수록 더 어려워져요.

이럴 때 도움이 되는 도구가 바로 **StrucToxNet**입니다. StrucToxNet은 **순차 정보와 구조 정보를 모두 통합해 펩타이드 독성을 예측하도록 설계된 새로운 계산 프레임워크**예요. 구체적으로는 사전 학습된 단백질 언어 모델 **ProtT5**를 이용해 서열에서 풍부한 특징을 뽑아내고, **ESMFold**가 예측한 구조 데이터를 바탕으로 공간적 특징을 포착합니다. 이렇게 상호 보완적인 정보를 함께 학습하기 때문에 기존의 단순 서열 기반 방법보다 정확성과 일반화 성능이 크게 향상되었어요.

이번 글에서는 이 StrucToxNet을 활용해 뱀독소(snake venom toxin)와 라이소자임(lysozyme)의 PDB 구조를 입력으로 사용하고, 두 단백질 간의 독성 예측 결과를 비교해 보겠습니다. 이를 통해 StrucToxNet이 어떻게 독성을 판별하고, 연구자가 안전한 펩타이드 기반 치료제를 설계하는 데 어떤 도움을 줄 수 있는지 살펴보려고 해요.

# 1 사용된 도구

---

- **StrucToxNet** 펩타이드의 독성 여부를 단백질 3D 구조를 활용하여 예측하는 모

# 2 StrucToxNet **설치 방법**

## 2.1 저장소 클론

---

StrucToxNet은 Python과 딥러닝 프레임워크를 활용하는 분석 도구입니다. 설치는 비교적 간단하며, Conda 환경을 통해 쉽게 진행할 수 있습니다. 아래 단계별 가이드를 따라 해보세요.

```bash
# 저장소 클론
git clone https://github.com/jiaoshihu/StrucToxNet.git
cd StrucToxNet
```

## 2.2 Conda 환경 생성하기

---

StrucToxNet은 `environment.yml` 파일을 통해 필요한 의존성을 관리합니다. 다음 명령어로 Conda 환경을 생성해 주세요.

```text
conda env create -f environment.yml
conda activate StrucToxNet
```

# 3 기본 사용 용법

## 3.1 전처리 (Preprocessing)

---

먼저 `Preprocessing` 디렉토리로 이동합니다.

```bash
cd Preprocessing
```

### 입력 파일 준비

- **PDB 구조 파일은** `./inputs/pdb/` 디렉토리에 넣으세요.
- **FASTA 파일은** `./inputs/` 디렉토리에 넣으세요.

## 3.2 ProtT5 모델 다운로드

---

StrucToxNet은 ProtT5 임베딩을 활용하므로, 모델을 먼저 다운로드해야 합니다.

```bash
wget https://zenodo.org/record/4644188/files/prot_t5_xl_uniref50.zip
unzip prot_t5_xl_uniref50.zip
```

## 3.3 전처리 스크립트 실행

---

이제 전처리 파이프라인을 실행하여 데이터를 변환하고 특징을 추출합니다.

```bash
# FASTA 파일 경로 지정
python 1_preprocess.py -i ./inputs/fasta_file -p ./input/pdb/input.pdb -o OUTPUT_PATH
python 2_get_features.py -i ./inputs/fasta_file -p ./input/pdb/input.pdb -o OUTPUT_PATH
python 3_get_plm.py -i ./inputs/fasta_file -o OUTPUT_PATH
python 4_feature_all.py -p ./input/pdb/input.pdb -o OUTPUT_PATH
```

이 과정을 통해 **서열 기반 특징 + 구조 기반 특징**이 모두 추출됩니다.

## 3.4 독성 예측 실행

---

전처리가 완료되면 프로젝트 메인 디렉토리로 돌아가세요.

```bash
cd ..
python main.py -i ./inputs/fasta_file -o OUTPUT_PATH
```

# 4 데이터 선정

## 4.1 Lysozyme

---

Lysozyme은 널리 알려진 항균 효소로, 세균의 세포벽을 분해하는 역할을 합니다. 인체에도 존재하며 일반적으로 **비독성 단백질**의 대표적인 예시로 간주돼요. 구조적으로는 안정된 단일 소수성 코어와 다수의 이황화 결합을 포함하고 있어, 비교적 잘 정의된 globular 단백질이에요.

![image](/image/info/detail/structoxnet_2.webp){center:600}

- **RCSB**: 1AKI
- **Protein:** Lysozyme C
- **Uniprot:** P00698
- **Length**: 147
- **M.W**: 16.239kDa
- **Sequence**

```python
MRSLLILVLCFLPLAALGKVFGRCELAAAMKRHGLDNYRGYSLGNWVCAAKFESNFNTQATNRNTDGSTDYGILQINSRWWCNDGRTPGSRNLCNIPCSALLSSDITASVNCAKKIVSDGNGMNAWVAWRNRCKGTDVQAWIRGCRL
```

### **선정 사유**

Lysozyme은 **안전하고 비독성인 단백질의 전형적인 대조군**으로 선택되었습니다. StrucToxNet은 단순한 서열 정보뿐 아니라 3차원 구조(PDB)와 **서열 기반 임베딩**을 함께 분석하므로, 이런 안정된 비독성 단백질을 넣었을 때 모델이 **안전 신호를 제대로 포착하는지** 확인할 수 있어요. 즉, baseline 성격을 띠는 샘플이에요.

## 4.2 Echis pyramidum leakeyi metalloproteinase

---

이 단백질은 아프리카 뱀 *Echis pyramidum leakeyi*의 metalloproteinase의 일부 서열로, 뱀독의 주요 구성 요소 중 하나입니다. 뱀독 단백질분해효소는 혈액 응고 방해, 조직 파괴, 출혈 유발 같은 강력한 **독성 효과**를 나타내요. 구조적으로는 **Zn²⁺-결합 활성 부위**, 다수의 시스테인 잔기에 의한 **이황화 결합 네트워크**, 그리고 기능적으로 중요한 protease domain을 포함하고 있어요.

![AF3를 통해 모델링 후 B-factor 기반으로 시각화](/image/info/detail/structoxnet_3.webp){center:600}[AF3를 통해 모델링 후 B-factor 기반으로 시각화]

- **Protein:** Metalloproteinase
- **Uniprot:** E9JGK0
- **Length**: 348
- **M.W:** 38.558kDa
- **Sequence**

```python
PDSEAHAVYKYEDGKKKDEAPKMCGVTQTNWESDEPIKKTSQLAATSEQQHFDPRHIQLIIVADHAMFVKYNSDSTAVTTWTHQIVNNMIVIYRDLNIHITLAALEIWSNGDLITVTSSAPTTLRSFGEWRERDLLNRATHDNAQLLTAVHLGSLIGYGYVGTMCDPKWSVGIIEDHSTDPIWVAATIAHEMGHNLGINHDGNQCNCGAAGCVMSARISQHPSYHFSDCSMNEYQNYLTNHNPQCIVNQRLRTDTVSTSVSGNELLQNSANPCYDAATCQAREGADCASGPCCRDCKFLKEGTICKRARGDNMDDYCNGKTCDCPRNPHKGEHDPMERPAPAKGSVLM
```

### **선정 사유**

이 단백질은 **강력한 독성 단백질의 대표적인 예시**로 선택되었습니다. StrucToxNet은 ProtT5로부터 추출한 **서열 기반 특징**과 ESMFold 구조로부터 얻은 **공간적 특징**을 결합하여 예측하므로, 뱀독과 같은 복잡한 구조적 특성이 많은 단백질에서 **위험 신호를 포착**할 수 있는지 테스트하기에 이상적이에요.

특히, protease active site와 금속 결합 부위 같은 구조적 특징이 독성 예측에 반영되는지를 살펴볼 수 있어 StrucToxNet의 강점을 잘 보여줄 수 있어요.

## 5 예측하기

## 5.1 단백질 구조 예측

---

StrucToxNet을 이용하여 독성 예측을 진행하기 앞서 단백질의 아미노산 서열로부터 3D 구조를 생성해야 합니다. 이번 단계에서는 Boltz를 활용하여 단백질의 3차원 구조 예측을 수행합니다.

예측 서열은 아래와 같습니다.

```python
# Lysozyme
MRSLLILVLCFLPLAALGKVFGRCELAAAMKRHGLDNYRGYSLGNWVCAAKFESNFNTQATNRNTDGSTDYGILQINSRWWCNDGRTPGSRNLCNIPCSALLSSDITASVNCAKKIVSDGNGMNAWVAWRNRCKGTDVQAWIRGCRL

# Metalloproteinase
PDSEAHAVYKYEDGKKKDEAPKMCGVTQTNWESDEPIKKTSQLAATSEQQHFDPRHIQLIIVADHAMFVKYNSDSTAVTTWTHQIVNNMIVIYRDLNIHITLAALEIWSNGDLITVTSSAPTTLRSFGEWRERDLLNRATHDNAQLLTAVHLGSLIGYGYVGTMCDPKWSVGIIEDHSTDPIWVAATIAHEMGHNLGINHDGNQCNCGAAGCVMSARISQHPSYHFSDCSMNEYQNYLTNHNPQCIVNQRLRTDTVSTSVSGNELLQNSANPCYDAATCQAREGADCASGPCCRDCKFLKEGTICKRARGDNMDDYCNGKTCDCPRNPHKGEHDPMERPAPAKGSVLM
```

해당 서열을 기반으로 boltz를 통해 단백질의 3차원 구조 예측을 수행합니다.

```bash
boltz predict example.fasta --use_msa_server --out_dir OUTPUT_PATH --output_format pdb --override --cache MODEL_PATH
```

이 명령을 실행하면  Boltz-2 예측 결과가 파일로 저장됩니다.

## 5.2 Linux CLI

---

### StrucToxNet 전처리

Boltz-2로 생성한 PDB 파일과 원래의 FASTA 파일을 사용합니다.

```bash
cd Preprocessing

# 1단계: 기본 전처리
python 1_preprocess.py -i ./inputs/lysozyme.fasta -p ./inputs/pdb/lysozyme_af3/result_model_1.pdb -o ./outputs/lysozyme

# 2단계: 서열 기반 특징 추출
python 2_get_features.py -i ./inputs/lysozyme.fasta -p ./inputs/pdb/lysozyme_af3/result_model_1.pdb -o ./outputs/lysozyme

# 3단계: PLM 임베딩 생성 (ProtT5)
python 3_get_plm.py -i ./inputs/lysozyme.fasta -o ./outputs/lysozyme

# 4단계: 최종 특징 결합
python 4_feature_all.py -p ./inputs/pdb/lysozyme_af3/result_model_1.pdb -o ./outputs/lysozyme
```

이 과정을 통해 **AF3 구조 기반 특징 + ProtT5 서열 기반 특징**이 모두 추출됩니다.

### StrucToxNet 독성 예측 실행

전처리가 완료되면 프로젝트 루트로 돌아가 독성 예측을 수행합니다.

```bash
cd ..
python main.py -i ./inputs/lysozyme.fasta -o ./outputs/lysozyme
```

예측 결과는 `./outputs/lysozyme/result/` 디렉토리에 저장됩니다.

## 5.3 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/structoxnet
```

화면에는 단백질의 3차원 구조파일(PDB)을 입력하는 창이 준비되어 있습니다.

![image](/image/info/detail/structoxnet_4.webp){center:880}

여기에 분석할 단백질의 구조를 업로드 한 후 **분석 시작** 버튼을 누르면 **StrucToxNet**가 입력된 구조로부터 자동으로 FASTA를 추출 후 전처리를 포함 한 모든 과정을 자동으로 진행하게 됩니다.

# 6 분석 결과

## 6.1 결과 요약

---

| 단백질 | 예측 결과 | Confidence |
| --- | --- | --- |
| **Lysozyme** | Non-toxic peptide | **94.12%** |
| **Echis pyramidum metalloproteinase** | Toxic peptide | **93.94%** |

모델은 **Lysozyme**을 비독성으로, **뱀독 단백질 분해효소**를 독성으로 높은 신뢰도로 분류했습니다. 두 케이스 모두 **90% 이상**의 confidence를 보여, 모델이 확실하게 구분했다고 볼 수 있어요.

## 6.3 종합 평가

---

- 예측 신뢰도가 90% 이상으로 높게 나타난 것은, StrucToxNet이 학습 과정에서 Lysozyme과 뱀독 단백질처럼 전형적인 대조군 사례를 충분히 학습했음을 보여줍니다.
- 또한 이 모델은 단순히 서열 정보에만 의존하지 않고, 구조적 활성 부위까지 함께 고려하기 때문에 효소 활성, 금속 결합, 도메인 구조와 같은 독성 기작을 기능적 맥락 속에서 반영할 수 있다는 강점을 지니고 있습니다.
- 이러한 특성 덕분에 StrucToxNet은 신약 개발 과정에서 안전한 후보군을 신속하게 걸러내고, 잠재적으로 독성이 우려되는 단백질을 사전에 제거하는 데 매우 유용하게 활용될 수 있습니다.

# 7 마치며

---

이번 튜토리얼에서는 **Lysozyme과 뱀독소 metalloproteinase**를 예시로, StrucToxNet이 어떻게 단백질의 서열과 구조를 동시에 활용해 독성을 판별하는지 살펴보았습니다. 결과적으로 모델은 두 단백질을 뚜렷하게 구분해내며, “안전한 효소 vs 위험한 독소”라는 극명한 대조군을 성공적으로 분류했어요.

물론 여기서 멈출 필요는 없습니다. 지금은 단 두 개의 단백질만 다뤘지만, 여러분의 데이터셋에는 훨씬 더 다양한 단백질이 기다리고 있을 거예요. 앞으로는 더 복잡한 펩타이드 라이브러리, 혹은 실제 신약 후보군에 적용해보면서 StrucToxNet의 잠재력을 체감해보시는 것도 재미있을 겁니다.

궁극적으로 중요한 건, “모든 단백질이 안전할 수는 없다”는 사실을 더 빨리, 더 정확히 확인하는 거겠죠. StrucToxNet은 그 길을 조금 더 단축시켜 줄 도구입니다. 이제 여러분 차례예요—여러분의 단백질을 StrucToxNet에 던져 넣고, 어떤 이야기를 들려줄지 직접 확인해 보세요.

# 8 Reference

---

- [Github StrucToxNet](https://github.com/jiaoshihu/StrucToxNet)
- [Zenodo](https://zenodo.org/records/15599677)
- CURIE : [StrucToxNet](https://curie.kr/Analysis/structoxnet)

---

[tool-button:StrucToxNet]