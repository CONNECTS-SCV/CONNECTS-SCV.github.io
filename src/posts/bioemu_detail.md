---
layout: post
title: "Bioemu : 단백질 서열에서 동적 평형 구조를 탐구하다"
description: "Diffusion 기반으로 동적 평형 상태의 단백질 구조를 예측하는 생성 모델"
categories: [analysis]
tags: [Bioemu, 단백질구조, Diffusion, MD시뮬레이션, AlphaFold]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/bioemu_1.webp"
comment_id: "bioemu_detail"
---

![Bioemu](/image/info/detail/bioemu_1.webp){center:400}

신약 개발에서 단백질의 구조는 단순히 “정적인 형태”가 아닙니다.

특정한 변이가 일어나면, 단백질은 평형 상태에서 새로운 형태로 재배치되며 기능에 큰 차이를 만들어낼 수 있습니다. 이러한 **동적 평형의 변화**를 실험적으로 하나하나 추적하는 것은 시간과 비용 면에서 큰 도전이 됩니다.

이때 활용할 수 있는 최신 도구가 바로 [**BioEmu**](https://github.com/microsoft/bioemu)입니다.

BioEmu는 **아미노산 서열로부터 단백질의 평형 상태 분포를 직접 예측**하는 모델로, 기존의 단일 구조 예측(예: Alphafold)과 달리 구조적 다양성(dynamical ensemble)을 고려한다는 점이 큰 특징입니다.

# 1 사용된 도구

---

- **Bioemu** 아미노산 서열로부터 동적 평형 상태인 구조를 출력하는 모델
- HPacker Sidechain 재구성을 수행하고 짧은 MD 평형화 옵션을 제공

# 2 Bioemu **설치 방법**

BioEmu는 **Linux 전용 pip 패키지**로 제공되며, 구조 샘플링 및 사이드체인 재구성을 위한 추가 설정이 필요합니다. 아래 순서대로 따라 하면 설치 및 환경 구성이 가능합니다.

## 2.1 기본 설치

---

```bash
pip install bioemu
```

BioEmu는 conda 기반 패키지 관리자와 CUDA 12 호환 드라이버가 필요합니다. 설치 전 `conda`와 NVIDIA 드라이버가 준비되어 있는지 확인하세요.

---

## 2.2 ColabFold 환경 설정

BioEmu는 **MSA 및 임베딩 생성**을 위해 ColabFold 전용 환경을 사용합니다.

기본적으로 `~/.bioemu_colabfold` 디렉터리를 활용합니다. 다른 위치를 사용하고 싶다면, 첫 샘플링 전에 환경 변수를 설정합니다:

```bash
export BIOEMU_COLABFOLD_DIR=/path/to/custom_dir
```

---

## 2.3 사이드체인 재구성 (선택적)

BioEmu는 **백본 프레임 표현**을 출력합니다. 측쇄(side chain)는 별도로 재구성할 수 있으며, 이를 위해 `HPacker`와 연동합니다.

### 추가 모듈 설치

```bash
pip install bioemu[md]
```

이 모듈을 처음 실행하면, `HPacker`와 관련 의존성을 별도의 conda 환경에 자동 설치합니다. 만약 환경 이름을 변경하고 싶다면 실행 전 아래처럼 환경 변수를 지정하세요.

```bash
export HPACKER_ENV_NAME=my_hpacker_env
```

# 3 기본 사용 용법

BioEmu는 단백질 **아미노산 서열**로부터 동적 평형 상태의 구조를 샘플링하고, 필요 시 **사이드체인 재구성** 및 간단한 MD 평형화를 수행할 수 있습니다.

## 3.1 Python 라이브러리로 실행하기

---

기본 모델 매개변수와 노이즈 제거 설정을 사용하여 간단한 테스트를 실행하려면 다음을 수행합니다.

```python
from bioemu.sample import main as sample

sample(
    sequence='GYDPETGTWG',
    num_samples=10,
    output_dir='~/test_chignolin'
)
```

## 3.2 CLI로 실행하기

sample 모듈을 사용하여 주어진 단백질 서열의 구조를 샘플링할 수 있습니다.  기본 설정에서 모델 매개변수는 **HuggingFace**에서 자동 다운로드됩니다.

```bash
python -m bioemu.sample --sequence GYDPETGTWG --num_samples 10 --output_dir ~/test-chignolin
```

- `-sequence` : 입력 단백질 서열 (직접 문자열 또는 FASTA 파일 경로 가능)
- `-num_samples` : 샘플링 개수
- `-output_dir` : 출력 디렉터리

**비물리적 구조(충돌/불연속성)** 는 필터링되어, 출력 샘플 수가 요청 수보다 적을 수 있습니다. 필터링 없이 모두 저장하려면 아래 명령어를 추가하면 됩니다.

```bash
--filter_samples=False
```

## 3.3 사이드체인 재구성

---

샘플링 결과는 기본적으로 **백본 구조**만 포함합니다. 사이드체인을 복원하고 국소 에너지 최소화를 수행하려면 다음을 실행합니다.

```bash
python -m bioemu.sidechain_relax --pdb-path path/to/topology.pdb --xtc-path path/to/samples.xtc
```

- 입력:
  - `-pdb-path` : 위상(topology) PDB 파일
  - `-xtc-path` : 샘플링 결과 trajectory (`.xtc`)
- 출력:
  - `samples_sidechain_rec.{pdb,xtc}` → 사이드체인 재구성 결과
  - `samples_md_equil.{pdb,xtc}` → (옵션) MD 평형 결과

**추가 옵션**

```bash
# 사이드체인만 복원 (MD 없음)
--no-md-equil 

# 짧은 NVT 평형화 (0.1 ns)
--md-protocol nvt_equil 

# 전체 옵션 확인
python -m bioemu.sidechain_relax --help 
```

# 4 데이터 선정

이 튜토리얼에서는 **E. coli DHFR**를 대상으로, **G121V 변이**가 FG-loop/Met20-loop의 평형 분포에 미치는 영향을 BioEmu로 샘플링해 살펴봅니다. 기준 정보와 레퍼런스 구조는 아래와 같이 선정했습니다.

## 4.1 기본 단백질 정보

---

- **단백질**: Dihydrofolate reductase (DHFR), *E. coli* K-12
- **UniProt**: **P0ABQ4** (gene: *folA*) — 서열·주요 참고 메타데이터 출처.

## 4.2 DHFR WT

---

- **FASTA**: MISLIAALAVDRVIGMENAMPWNLPADLAWFKRNTLDKPVIMGRHTWESIGRPLPGRKNIILSSQPGTDDRVTWVKSVDEAIAACGDVPEIMVIGGGRVYEQFLPKAQKLYLTHIDAEVEGDTHFPDYEPDDWESVFSEFHDADAQNSHSYCFEILERR
- **RCSB**: 1RX2
- **TYPE**: WT

![RCSB: 1RX2](/image/info/detail/bioemu_2.webp){center:300}[RCSB: 1RX2]

## 4.3 DHFR G121V

---

- **FASTA**: MISLIAALAVDRVIGMENAMPWNLPADLAWFKRNTLDKPVIMGRHTWESIGRPLPGRKNIILSSQPGTDDRVTWVKSVDEAIAACGDVPEIMVIGGGRVYEQFLPKAQKLYLTHIDAEVEVDTHFPDYEPDDWESVFSEFHDADAQNSHSYCFEILERR
- **RCSB**: 1RX7
- **TYPE**: Gly 121 Val

![RCSB: 1RX7](/image/info/detail/bioemu_3.webp){center:300}[RCSB: 1RX7]

## 4.4 선정 이유

G121V는 **FG-loop와 Met20-loop의 ps–ns 및 μs–ms 시간척도 동역학을 변화**시키며, 루프 결합(coupling)과 촉매단계(수소화 전달)에도 영향이 보고되어 있습니다. 본 예제는 이 변이가 **평형 상태 분포**를 어떻게 이동시키는지를 구조 샘플링으로 가늠하는 것이 목적이기 때문에 해당 예제를 선정하였습니다.

# 5 예측하기

## 5.1 Linux CLI

---

Biomeu 예측에 사용될 단백질의 아미노산 서열 정보는 아래와 같습니다.

```text
# WT
MISLIAALAVDRVIGMENAMPWNLPADLAWFKRNTLDKPVIMGRHTWESIGRPLPGRKNIILSSQPGTDDRVTWVKSVDEAIAACGDVPEIMVIGGGRVYEQFLPKAQKLYLTHIDAEVEGDTHFPDYEPDDWESVFSEFHDADAQNSHSYCFEILERR

# G212V
MISLIAALAVDRVIGMENAMPWNLPADLAWFKRNTLDKPVIMGRHTWESIGRPLPGRKNIILSSQPGTDDRVTWVKSVDEAIAACGDVPEIMVIGGGRVYEQFLPKAQKLYLTHIDAEVEVDTHFPDYEPDDWESVFSEFHDADAQNSHSYCFEILERR
```

구조를 샘플링 하는 실행 예시는 다음과 같습니다.

```bash
python -m bioemu.sample --sequence MISLIAALAVDRVIGMENAMPWNLPADLAWFKRNTLDKPVIMGRHTWESIGRPLPGRKNIILSSQPGTDDRVTWVKSVDEAIAACGDVPEIMVIGGGRVYEQFLPKAQKLYLTHIDAEVEGDTHFPDYEPDDWESVFSEFHDADAQNSHSYCFEILERR --num_samples 100 --output_dir OUTPUT_PATH --bathc_size_100 20 --cache_embeds_dir EMBEDS_PATH
```

이 명령을 실행하면 해당 서열을 기반으로 단백질 Backbone 구조를 샘플링 후 PDB 파일로 저장됩니다.

이러한 백본 프레임 표현 방식으로 출력된 구조의 Sidechain 재구성을 진행합니다.

```bash
python -m bioemu.sidechain_relax --pdb-path path/to/topology.pdb --xtc-path path/to/samples.xtc --md-protocol nvt_equil
```

이 과정까지 완료되면 단백질 서열을 기반으로 샘플링된 총 100개의 구조를 얻을 수 있습니다.

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI와 Python 라이브러리 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/bioemu
```

화면에는 단백질의 아미노산 서열을 입력하는 창이 준비되어 있습니다. 또한 생성 할 구조의 수를 설정할 수 있으며 `--md-protocl nvt_equil` 옵션을 설정 할 수 있습니다.

![input](/image/info/detail/bioemu_4.webp){center:880}

여기에 분석할 단백질의 아미노산 서열을 입력하면 됩니다.

```text
# WT
MISLIAALAVDRVIGMENAMPWNLPADLAWFKRNTLDKPVIMGRHTWESIGRPLPGRKNIILSSQPGTDDRVTWVKSVDEAIAACGDVPEIMVIGGGRVYEQFLPKAQKLYLTHIDAEVEGDTHFPDYEPDDWESVFSEFHDADAQNSHSYCFEILERR

# G212V
MISLIAALAVDRVIGMENAMPWNLPADLAWFKRNTLDKPVIMGRHTWESIGRPLPGRKNIILSSQPGTDDRVTWVKSVDEAIAACGDVPEIMVIGGGRVYEQFLPKAQKLYLTHIDAEVEVDTHFPDYEPDDWESVFSEFHDADAQNSHSYCFEILERR
```

이후 **분석 시작** 버튼을 누르면 구조 샘플링이 시작되며 빠르게 결과를 확인할 수 있습니다.

# 6 분석 결과

## 6.1 AlphaFold 3 단일 구조 비교 (WT vs G121V)

---

먼저 AlphaFold 3로 예측한 WT(회색)와 G121V(핑크)를 겹쳐 보면, 단백질 코어와 루프 모두가 거의 같은 단일 상태로 수렴합니다. 이는 AF3가 ‘가장 그럴듯한’ 한 벌의 구조를 산출하는 성격 때문으로, 루프가 취할 수 있는 여러 평형 상태의 분포 자체는 보여주지 못합니다.

pLDDT나 PAE로 유연성을 암시할 수는 있지만, 루프가 1RX2(closed)와 1RX7(occluded) 사이에서 어떻게 점유율을 나누는지 같은 **분포 이동**은 포착하지 않습니다.

![WT(회색)와 G121V(핑크)](/image/info/detail/bioemu_5.webp){center:300}[WT(회색)와 G121V(핑크)]

## 6.2 BioEmu WT 백본 샘플

---

WT 서열을 100개 샘플링한 다수의 백본 프레임을 코어 기준으로 정렬해 겹치면, β-시트와 α-헬릭스 코어는 단단하게 겹치고, Met20-loop(약 9–24)와 **FG-loop(약 116–132)** 주변에서 궤적이 넓게 퍼집니다. 이는 WT DHFR에서 보고되는 전형적인 루프 유동성을 정성적으로 재현한 결과로 해석할 수 있습니다.

이 상태가 우리에게 **베이스라인**이 됩니다. 즉, 변이가 없을 때 루프가 어느 정도의 자유도를 갖는지, 코어는 어느 정도 안정적인지를 확인한 뒤, 같은 절차를 G121V에 적용해 분포가 어느 방향으로 이동하는지를 비교하게 됩니다.

![image](/image/info/detail/bioemu_6.webp){center:300}
![image](/image/info/detail/bioemu_7.webp){center:300}

동일한 WT 샘플을 라마찬드란 플롯으로 보면, 점들은 대부분 α-헬릭스와 β-시트 허용 영역에 밀집합니다. Mean RMSD가 약 0.138 nm(=1.38 Å)로 보고되어, 코어 정렬 하에서 프레임 간 변형이 크지 않음을 시사합니다. 요약하면, WT 샘플은 기하학적으로 타당하면서도, 구조적 다양성은 주로 루프 좌표 공간에서 나타난다는 점이 확인됩니다.

## 6.3 BioEmu G121V 백본 샘플

---

이제 동일한 샘플링·정렬 절차를 **G121V**에 적용하면, 코어는 WT와 마찬가지로 안정적으로 정렬되지만, FG-loop(116–132)의 궤적이 WT에 비해 **더 응집되거나 한쪽으로 편향**된 인상이 나타납니다.

Gly→Val 치환은 해당 위치의 φ/ψ 자유도를 제한해 루프의 가용 구성을 줄이는 경향이 있으므로, 분포가 하나의 상태 방향으로 수렴하는 그림은 생물물리적으로 설득력이 있습니다. 정성적으로는 루프가 **1RX7(occluded) 쪽 기하에 더 오래 머물 가능성**을 시사하며, 이는 변이로 인해 루프-루프 상호작용이 달라졌을 수 있음을 암시합니다.

![image](/image/info/detail/bioemu_8.webp){center:300}
![image](/image/info/detail/bioemu_9.webp){center:300}

G121V의 라마찬드란 플롯에서는 α/β 허용 영역 중심의 깔끔한 분포가 재현됩니다. Mean RMSD가 약 0.131 nm(=1.31 Å)로 WT보다 소폭 낮게 보고되어, 코어 중심의 평균적 변형은 오히려 더 타이트합니다.

즉, 변이가 전체 접힘을 불안정하게 만들었다기보다는, **특정 루프(특히 FG-loop)의 상태 분포를 더 집중시키는 방향**으로 작용했을 가능성이 큽니다

## 6.4 종합 평가

---

AF3의 단일 구조는 루프의 평형 분포를 보여주기에는 다소 어려움이 있는것 같습니다. 하지만 BioEmu WT는 코어 안정성 아래 폭넓은 루프 다양성을 재현하는 모습을 보여주었으며, G121V는 코어 안정성을 유지하면서 **FG-loop 분포가 더 집중·편향**되어, **1RX7(occluded) 방향**으로 움직이는 모습을 관찰할 수 있었습니다.

# 7 마치며

---

이번 예제의 핵심은 단순합니다. **단일 구조**만으로는 보이지 않던 DHFR의 **루프 평형 분포**가, BioEmu의 **샘플 앙상블**을 통해 눈앞에 나타났다는 것.

정리하면:

- **AF3 단일 구조**: 코어/루프가 한 상태로 수렴 → 유연성 “가능성”은 암시하지만 **분포 이동**은 보여주지 못함.
- **BioEmu(WT)**: 코어는 안정적으로 겹치고, **Met20/FG 루프의 폭넓은 다양성**이 재현됨(베이스라인).
- **BioEmu(G121V)**: 전체 접힘은 안정적이나, **FG-loop 분포가 더 응집·편향**되어 **1RX7(occluded) 계열**로 치우치는 정성적 신호가 확인됨(Mean RMSD가 WT보다 소폭 낮아 코어 안정성도 유지).

즉, **G121V는 루프의 선호 상태를 바꾸는 변이**로 보이며, BioEmu는 이 변화를 **분포(ensemble)** 관점에서 빠르게 가늠하게 해 줍니다. 실험/장기 MD로 확인하기 앞서 **초기 가설을 세우고 후보를 줄이는 용도**로 특히 유용합니다.

### 한계와 주의

- BioEmu는 **단량체** 기준 샘플링을 지원합니다(멀티머는 권장 X).
- **MSA/임베딩** 품질과 샘플 수(`num_samples`)에 결과가 민감할 수 있습니다.
- HPacker/짧은 MD 평형화는 **국소 기하 안정화용**이지, 장기역학을 대체하진 않습니다.

신약 개발 맥락에서 **루프의 미세한 평형 이동**은 결합 친화도, 반응 좌표, 저해제 작동 방식에 직결됩니다. BioEmu는 **서열만으로 빠르게 분포를 스케치** 하게 해 주는 실용적 도구입니다.

이번 DHFR G121V 사례에서 보았듯, 정적 한 장면이 아닌 분포의 모양을 보면 변이의 효과가 훨씬 또렷해집니다. 여러분의 표적 단백질에도 같은 절차를 적용해, 베이스라인(야생형)과 **변이/조건(리간드, pH, 이온 등)** 사이의 **분포 차이** 를 먼저 가볍게 살펴보세요.

그다음이야말로 비싼 실험과 장기 MD를 투입할지 말지 판단할 최적의 순간입니다.

# 8 Reference

---

- [Github Bioemu](https://github.com/microsoft/bioemu)
- CURIE : [Bioemu](https://curie.kr/Analysis/bioemu), [Dilipred](https://curie.kr/Analysis/dilipred)
- [PubMed Central(PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3838469/?utm_source=chatgpt.com)

---

[tool-button:Bioemu]