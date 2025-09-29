---
layout: post
title: "Chai-1 : Fc Dimer와 Glycan 포함 단백질의 구조 예측 가이드"
description: "단백질 구조 예측과 도킹을 지원하는 Transformer 기반 AI 모델"
categories: [analysis]
tags: [Chai-1, 단백질구조, 도킹, Transformer, 리간드결합, Glycan]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/chai-1_1.webp"
---

![image](/image/info/detail/chai-1_1.webp){center:800}

신약 개발을 하다 보면 수많은 단백질과 화합물 조합을 검토해야 합니다. 이때 가장 중요한 건 단순히 “결합한다/안 한다”를 넘어서, **결합이 어떤 방식으로 일어나고 구조적으로 어떤 특징을 보이는지**를 파악하는 것이죠. 이런 과정이 잘 되면 후보 물질의 가능성을 훨씬 빨리 가늠할 수 있습니다.

[**Chai-1**](https://github.com/chaidiscovery/chai-lab)은 바로 이런 부분을 도와주는 최신 도구입니다. 단백질과 리간드의 정보를 입력하면, 딥러닝 기반 모델이 **원자 단위 상호작용과 결합 구조**를 예측해 줍니다. 복잡한 전처리 과정이나 거대한 계산 자원이 없어도 간단히 활용할 수 있다는 게 큰 장점이에요.

이번 튜토리얼에서는 Chai-1을 이용해 단백질–리간드 상호작용을 직접 예측해 보고, 그 결과를 어떻게 신약 후보 평가에 활용할 수 있는지 함께 살펴보겠습니다.

# 1 사용된 도구

---

- **Chai-1** 단백질을 포함한 저분자, DNA, RNA, 당화 등에 대한 상호작용을 예측하기 위한 모델

# 2 Chai-1 **설치 방법**

Chai-1은 Python 패키지로 제공되기 때문에 간단히 `pip`으로 설치할 수 있습니다. 두 가지 방법이 있는데, 안정적인 버전을 원한다면 PyPI에 올라온 릴리즈를 쓰면 되고, 최신 기능을 바로 써보고 싶다면 GitHub에서 직접 받아 설치할 수도 있습니다.

## 2.1 안정 버전 (PyPI)

---

```bash
pip install chai_lab==0.6.1
```

## 2.2 최신 개발 버전 (GitHub, 매일 업데이트)

---

```bash
pip install git+https://github.com/chaidiscovery/chai-lab.git
```

Chai-1을 제대로 활용하려면 **Linux + Python 3.10 이상**이 필요합니다. 또 하나 중요한 점은 GPU 지원인데요, 특히 **CUDA**와 **bfloat16**을 지원하는 GPU여야 합니다.

- 권장 사양: A100 80GB, H100 80GB, L40S 48GB
- 중간급 환경: A10, A30
- 실험적으로는 **RTX 4090** 같은 소비자용 GPU에서도 꽤 좋은 성능을 보였다는 내용이 있습니다.

즉, 대규모 실험부터 개인 연구까지 다양한 환경에서 Chai-1을 활용할 수 있다는 점이 큰 장점인거 같습니다.

# 3 기본 사용 용법

## 3.1 Boltz로 추론 실행하기

---

Chai-1은 명령줄(CLI)과 Python API 두 가지 방식으로 사용할 수 있어요.

### 입력 파일 준비

Boltz는 **FASTA 유사 형식의 입력 파일**을 사용합니다. 각 항목은 `>타입|식별자|경로/데이터` 의 형태를 가집니다.

```text
>protein|IgG1 hu3S193 Fc
MVTPEGNVSLVDESLLVGV...

>ligandg|8cyo-ligand
c1cc(c(cc1OCC(=O)NCCS)Cl)Cl

>glycan|two-sugar
NAG(4-1 NAG)
```

### 추론 실행 명령어

가장 간단한 방법은 **FASTA 파일**을 입력으로 주고 모델을 실행하는 것입니다. FASTA에는 관심 있는 복합체의 모든 시퀀스를 넣을 수 있고, 수정된 잔기나 뉴클레오타이드, 리간드의 경우 **SMILES 문자열**도 함께 포함할 수 있습니다.

```bash
chai-lab fold input.fasta output_folder # 기본 실행 (5개의 샘플 구조 생성)
```

기본 설정은 **MSA와 템플릿 없이** 임베딩만 사용하지만, 더 나은 성능을 원한다면 `--use-msa-server`와 `--use-templates-server` 옵션을 추가하는 것을 권장합니다.

```bash
chai-lab fold --use-msa-server --use-templates-server input.fasta output_folder 
# MSA + 템플릿 사용 (권장)
```

만약 직접 ColabFold 서버를 운영하고 있다면, 서버 주소를 직접 지정할 수도 있습니다. 시도해보지는 않았어요.

```bash
chai-lab fold --use-msa-server --msa-server-url "https://api.internalcolabserver.com" input.fasta output_folder
```

추가적인 유틸리티 기능(예: MSA 파일 변환 등)은 `chai --help`로 보다 자세하게 확인할 수 있습니다.

### Python API 추론

코드에서 직접 Chai-1을 호출해 사용할 수도 있습니다. 진입점은 `chai_lab.chai1.run_inference` 함수이며, 예제 스크립트가 제공됩니다.

```bash
# 기본 추론 실행
python examples/predict_structure.py

# MSA를 활용한 추론 실행 (권장)
python examples/msas/predict_with_msas.py
```

이 방식은 모델 결과를 후속 분석 코드와 쉽게 연결할 수 있고, 예측된 구조는 PDB 파일 목록으로 저장됩니다.

# 4 데이터 선정

이번 튜토리얼에서는 Chai의 기본 사용법을 살펴보기 위해  IgG1 hu3S193 Fc 단독 구조 예측과 Fc의 Glycosylation 예측 두 가지 사례를 준비했습니다.

## 4.1 **Human IgG1 : hu3S193**

---

- **PDB ID**: 6BZ4

![RCSB : 6BZ4](/image/info/detail/chai-1_2.webp){center:400}[RCSB : 6BZ4]

- **UniProt ID**: PODOX5
- **서열 정보**

    ```text
    GPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCAVSNKALPAPIEKTISKAKGQPREPQVYTLPPSRDELTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLS
    ```


## 4.2 Glycan

- **GlyTouCan ID**: G45889JQ
- **M.W:** 1,259.47 Da

![Feature View](/image/info/detail/chai-1_3.webp){center:400}[Feature View]
![3D View](/image/info/detail/chai-1_4.webp){center:200}[3D View]

- **IUPAC명**: 2-acetamido-2-deoxy-beta-D-glucopyranose-(1-2)-alpha-D-mannopyranose-(1-6)-[alpha-D-mannopyranose-(1-3)]beta-D-mannopyranose-(1-4)-2-acetamido-2-deoxy-beta-D-glucopyranose-(1-4)-[alpha-L-fucopyranose-(1-6)]2-acetamido-2-deoxy-beta-D-glucopyranose
- **CCD**: GLC(4-1 GLC(4-1 MAN(3-1 MAN)(6-1 MAN(2-1 GLC))))(6-1 FUC)
- **SMILES**:

```text
C1[C@H](NC(=O)C)[C@@H](O)[C@H](O[C@H]2[C@H](NC(=O)C)[C@@H](O)[C@H](O[C@H]3[C@@H](O)[C@@H](O[C@@H]4[C@@H](O)[C@@H](O)[C@H](O)[C@H](O4)CO)[C@H](O)[C@H](O3)CO[C@@H]3[C@@H](O[C@H]4[C@H](NC(=O)C)[C@@H](O)[C@H](O)[C@H](O4)CO)[C@@H](O)[C@H](O)[C@H](O3)CO)[C@H](O2)CO)[C@H](O1)CO
```

## 4.3 선정 이유

hIgG1 **Fc**는 항체 의약품에서 가장 널리 쓰이는 백본으로, 안정성·단백질 간 상호작용·효능에 직결되는 핵심 도메인입니다.  예측 품질을 pLDDT나 RMSD 같은 지표로 확인하기도 쉽고, 해석 포인트도 분명합니다. 여기에 Fc dimer 사이의 glycan을 함께 넣어 보면 이야기가 더 흥미로워집니다. 이 당쇄는 **결합 양상과 구조적 재배치**를 관찰하기에 적합한 소재죠.

이번 튜토리얼에서는 Chai-1으로 **Fc 단독**과 **glycan 포함 복합체**를 모두 예측해, Chai의 상호작용 예측 성능을 확인해볼 겁니다.

# 5 예측하기

## 5.1 Linux CLI

---

Boltz-2 예측을 위해 `example.fasta` 형식의 입력 파일을 준비합니다.

```text
>protein|A
GPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCAVSNKALPAPIEKTISKAKGQPREPQVYTLPPSRDELTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLS

>glycan|CCD #리간드 결합 예측 시
GLC(4-1 GLC(4-1 MAN(3-1 MAN)(6-1 MAN(2-1 GLC))))(6-1 FUC)
```

실행 예시는 다음과 같습니다.

```bash
chai lab fold --use-msa-server --use-template-server INPUT_PATH/input.fasta OUTPUT_PATH
```

이 명령을 실행하면  chai -1 예측 결과가 파일로 저장됩니다.

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 Chai-1 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개합니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/chai
```

화면에는 아미노산 서열과 화합물에 대한 열보를 입력하는 창이 준비되어 있습니다.

![input](/image/info/detail/chai-1_5.webp){center:880}

여기에 구조를 예측 할 단백질의 아미노산 서열과 화합물의 CCD를 입력하면 됩니다.

```text
>protein|A
GPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCAVSNKALPAPIEKTISKAKGQPREPQVYTLPPSRDELTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLS

>glycan|CCD #리간드 결합 예측 시
GLC(4-1 GLC(4-1 MAN(3-1 MAN)(6-1 MAN(2-1 GLC))))(6-1 FUC)
```

이후 **분석 시작** 버튼을 누르면 Chai-1을 이용한 단백질 및 Glycan에 대한 예측이 시작되며 빠르게 결과를 확인할 수 있습니다.

# 6 분석 결과

## 6.1 Fc 단백질 단독: 예측 vs 레퍼런스 중첩

---

예측(분홍)과 레퍼런스(회색)가 CH2/CH3 **β-sandwich**와 **CH3–CH3 인터페이스**에서 잘 겹칩니다. 차이는 주로 **loop·힌지·말단**의 유동성이 높은 구간에 국한됩니다. 이 모델을 **베이스라인**으로 삼아 이후 glycan 포함 결과와 비교하면 됩니다.

![image](/image/info/detail/chai-1_6.webp){center:400}

## 6.2 MSA 커버리지 히트맵

---

CH2/CH3 코어 구간 커버리지가 높아 예측 결과는 **높은 신뢰도**를 같습니다. 하지만 힌지·말단은 낮아 편차가 날 수 있습니다. 성능 보강이 필요하면 `--use-msa-server`, `--use-templates-server`와 **간단한 제약(restraints)** 추가를 권장합니다.

![image](/image/info/detail/chai-1_7.webp){center:400}

## 6.3 Fc + Glycan(Asn297) 포함 예측

---

glycan이 **N297 포켓 방향**에 자연스럽게 자리하고, **RMSD 0.665 Å(347 atoms)** 로 레퍼런스와 잘 맞습니다. 다만 **Asn–GlcNAc 앵커**가 현재 파이프라인에 고정되지 않아 **말단 당의 배향**이 조금 달라 보일 수 있습니다. 추후 입력에 수정잔기(ASN–NAG 연결) 또는 템플릿/제약을 추가하면 실제 구조에 더욱 근접한 결과물을 얻을 수 있을것입니다.


![image](/image/info/detail/chai-1_8.webp){center:400}

## 6.6 종합 평가

이번 예측 모델은 Aggregate 0.845, pTM 0.900, ipTM 0.832로 **체인 접힘과 인터페이스 모두 신뢰도 높음**을 보여줍니다. 체인별 pTM(≈0.888)이 고르고 **clash=0**이라 기하학적으로도 깔끔해 베이스라인 모델로 쓰기 충분한것 같습니다. 다음 단계에서는 glycan 비교를 진행하고, 필요하면 **Asn297 앵커 제약**과 다중 샘플링으로 세부 결합 기하만 다듬으면 됩니다.

# 7 마치며

---

이번 튜토리얼에서는 Chai-1으로 **hIgG1 Fc 단독 구조**를 접고, 이어서 **Asn297 N-glycan을 포함한 복합체**까지 예측해 보며 결과를 읽는 법(pTM/ipTM, RMSD, MSA 커버리지)도 한 번에 정리했어요. 해보니, Fc의 전역 접힘은 안정적으로 재현되고 glycan 위치도 포켓에 자연스럽게 잡히는 걸 확인했죠.

이제 여러분 차례입니다!

- `-use-msa-server`, `-use-templates-server`로 **신뢰도 업그레이드**, 필요하면 **Asn–GlcNAc 앵커 제약**도 추가해 보세요.
- 동일한 프로토콜로 **소분자 리간드**까지 넣어보면, 후보 비교에도 바로 쓸 수 있습니다.

읽다가 막히는 부분이 있거나 “이건 이런 식으로도 해보면 좋겠다” 싶은 아이디어가 떠오르면 댓글/피드백으로 꼭 남겨주세요. 여러분의 예제가 다음 포스팅의 주제가 될 수도 있어요.

그럼, 행복한 접힘(folding)과 즐거운 모델링 되세요!

# 8 Reference

---

- [Github Chai-lab](https://github.com/chaidiscovery/chai-lab)
- [RSCB 6BZ4](https://www.rcsb.org/structure/6BZ4)
- [bioRxiv](https://www.biorxiv.org/content/10.1101/2024.10.10.615955v1)
- CURIE : [Chai](https://curie.kr/Analysis/chai), [Dilipred](https://curie.kr/Analysis/dilipred)

---

[tool-button:Chai]