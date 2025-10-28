---
layout: post 
title: "TemStaPro: 이 단백질, 열에 얼마나 강할까요?" 
description: "단백질 서열 기반 열 안정성 예측 도구 TemStaPro를 소개하고, 대표적인 내열성 단백질(Taq Polymerase)과 일반 단백질(LDHA)을 예제로 예측을 수행" 
categories: [analysis] 
tags: [TemStaPro, Thermostability, Protein Stability, Taq Polymerase, LDHA, Bioinformatics, Protein Engineering] 
author: "author6" 
date: "2025-09-29" 
thumbnail: "/image/info/detail/temstapro_1.webp" 
comment_id: "temstapro_detail"
---
![image.png](/image/info/detail/temstapro_1.webp){center:500}

단백질이 높은 온도에서도 안정적으로 유지되는지 여부는 백신 개발, 산업용 효소 설계, 바이오소재 연구 등 다양한 분야에서 매우 중요한 요소입니다. 하지만 실험적으로 열 안정성을 확인하는 데에는 시간과 비용이 많이 소요되지요.

이럴 때 유용하게 활용할 수 있는 도구가 바로 **TemStaPro**입니다.

TemStaPro는 단백질 서열 정보를 기반으로 **열 안정성(thermostability)** 을 예측하는 도구로, transformer 기반 언어 모델의 임베딩을 활용하여 모델을 학습했습니다. 사용자는 복잡한 구조 정보 없이도 FASTA 서열만으로 예측을 진행할 수 있어 매우 간편합니다.

이번 튜토리얼에서는 TemStaPro를 설치하고, 실제로 **내열성 단백질**과 **일반 단백질**의 예제를 비교 분석해 보겠습니다. 분석 과정을 단계별로 안내드릴 예정이니, 차근차근 따라오시면 누구나 쉽게 활용하실 수 있습니다.

지금부터 함께 시작해 볼까요?

# 1 사용된 도구

---

- **TemStaPro** 단백질 열 안정성 예측 도구

# 2 ToxinPred3 **설치 방법**

## 2.1 YML 파일을 이용한 빠른 설치

---

TemStaPro 저장소에는 미리 구성된 환경 설정 파일(`.yml`)이 들어 있어요.

필요한 패키지가 모두 포함돼 있어서 아래 명령만으로도 간편하게 설치할 수 있습니다.

### CPU 전용 환경 설치

```bash
conda env create -f environment_CPU.yml
conda activate temstapro_env_CPU
```

### GPU 환경이 설치

```bash
conda env create -f environment_GPU.yml
conda activate temstapro_env_GPU
```

## 2.2 처음부터 수동으로 설치하기

---

### GPU 환경 구성

```bash
conda create -n temstapro_env python=3.7
conda activate temstapro_env

# PyTorch + CUDA
conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia

# 추가 패키지
conda install -c conda-forge transformers sentencepiece matplotlib
```

CUDA가 정상적으로 작동하는지 확인하려면 아래를 실행해 보세요.

```python
import torch
torch.cuda.is_available()
```

출력이 `True`라면 성공입니다! 만약 `False`라면 아래 환경 변수를 설정한 후 다시 시도해 보세요.

```bash
export PATH=/usr/local/cuda-11.7/bin${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-11.7/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
```

### GPU가 없다면 (CPU 전용 설치)

```bash
conda create -n temstapro_env python=3.7
conda activate temstapro_env

# 패키지 설치
conda install -c conda-forge transformers sentencepiece matplotlib
conda install pytorch -c pytorch
```

### TemStaPro 프로그램 다운로드

아래 명령으로 GitHub에서 직접 클론하거나 ZIP 파일로 받을 수 있어요.

```bash
git clone https://github.com/ievapudz/TemStaPro.git
cd TemStaPro
```

# 3 기본 사용 용법

이제 TemStaPro 설치를 마쳤다면, 본격적으로 단백질의 **열 안정성(thermostability)** 을 예측해 볼 차례입니다. TemStaPro는 **FASTA 형식의 단백질 서열 파일**을 입력받아, **Transformer 기반의 임베딩(ProtTrans)** 을 활용해 예측을 수행하는 구조예요.

### 3.1 사용 가능한 옵션 확인하기

---

먼저 어떤 옵션이 있는지 궁금하시다면 아래 명령으로 전체 사용법을 확인할 수 있습니다.

```bash
./temstapro --help
```

### 3.2 기본 예측: 평균 임베딩 기반 열 안정성 예측

---

TemStaPro의 가장 일반적인 사용 방법은, 단백질 FASTA 파일을 입력받아 **평균 임베딩(mean embedding)** 을 통해 해당 서열이 열에 안정한지 예측하는 것입니다.

```bash
./temstapro \
  -f ./tests/data/long_sequence.fasta \
  -d ./ProtTrans/ \
  -e tests/outputs/ \
  --mean-output ./long_sequence_predictions.tsv
```

### 주요 옵션 설명:

| 옵션 | 설명 |
| --- | --- |
| `-f` | 입력 FASTA 파일 경로입니다 |
| `-d` | ProtTrans 모델 폴더 경로입니다 |
| `-e` | 캐시 임베딩을 저장할 디렉토리입니다 (재사용 가능) |
| `--mean-output` | 평균 임베딩 기반의 예측 결과를 TSV 파일로 저장합니다. |

임베딩 생성은 속도에 영향을 많이 주는 작업입니다. 동일한 서열로 여러 번 예측할 예정이라면 -e 옵션을 꼭 활용해 주세요.

### 3.3 아미노산별 예측 (Per-residue mode)

---

각 아미노산 잔기에 대해 열 안정성을 예측하고 싶으신가요? `--per-res-output` 옵션을 사용하면 단백질 서열 내 **각 잔기(Residue)** 에 대한 예측값을 얻을 수 있습니다.

```bash
./temstapro \
  -f tests/data/long_sequence.fasta \
  -e './tests/outputs/' \
  -d ./ProtTrans/ \
  --per-res-output ./long_sequence_predictions_per_res.tsv \
  -p './'
```

### 추가 옵션:

| 옵션 | 설명 |
| --- | --- |
| `--per-res-output` | 각 아미노산에 대한 예측 값을 저장합니다 |
| `-p` | 예측 결과를 시각화한 플롯 이미지를 저장할 디렉토리입니다 |

---

### 3.4 세그먼트 단위 예측

---

단백질을 **윈도우 크기**로 나누어 구간별 열 안정성을 예측할 수도 있어요. 이 방식은 전체 서열 중 어느 부분이 더 안정한지 확인하는 데 유용합니다.

```bash
./temstapro \
  -f tests/data/long_sequence.fasta \
  -e './tests/outputs/' \
  -d ./ProtTrans/ \
  --per-segment-output ./long_sequence_predictions_k41.tsv \
  -p './' \
  --curve-smoothening
```

### 추가 옵션:

| 옵션 | 설명 |
| --- | --- |
| `--per-segment-output` | 아미노산 세그먼트 단위 예측 결과 |
| `--curve-smoothening` | 예측 그래프를 부드럽게 만듭니다 |
| `-p` | 예측 결과 플롯 저장 디렉토리 |

# 4 데이터 선정

TemStaPro의 열 안정성 예측 성능을 평가하기 위해, 아래 두 단백질을 실험 대상으로 선정하였습니다. 각각은 **생리적 조건에서 작용하는 일반 단백질**과 **고온 환경에서 기능하는 내열성 단백질**을 대표합니다.

## **4.1 Human Lactate Dehydrogenase A (LDHA)**

---

- **Uniprot ID:** P00338
- **종:** 인간 (Homo sapiens)
- **서열**

```bash
MATLKDQLIYNLLKEEQTPQNKITVVGVGAVGMACAISILMKDLADELALVDVIEDKLKGEMMDLQHGSLFLRTPKIVSGKDYNVTANSKLVIITAGARQQEGESRLNLVQRNVNIFKFIIPNVVKYSPNCKLLIVSNPVDILTYVAWKISGFPKNRVIGSGCNLDSARFRYLMGERLGVHPLSCHGWVLGEHGDSSVPVWSGMNVAGVSLKTLHPDLGTDKDKEQWKEVHKQVVESAYEVIKLKGYTSWAIGLSVADLAESIMKNLRRVHPVSTMIKGLYGIKDDVFLSVPCILGQNGISDLVKVTLTSEEEARLKKSADTLWGIQKELQF
```

- **기능:** LDHA는 **해당작용(glycolysis)** 에서 피루브산을 젖산으로 환원시키는 데 관여하는 **중요한 효소**입니다. 특히 무산소 조건에서 **NAD+ 재생**에 핵심적인 역할을 하며, 대부분의 포유류 조직에서 발견됩니다.
- **온도 특성: 정상 인체 온도(37°C)** 부근에서 최적 활성을 보이는 일반적인 단백질입니다. 고온에 노출되면 구조적으로 쉽게 변성되기 때문에, 열 안정성 예측 시 **'열 불안정한 단백질'의 기준**으로 삼을 수 있습니다.

## **4.2 Taq DNA Polymerase**

---

- **Uniprot ID:** P19821
- **종:** Thermus aquaticus (호열균)
- **서열**

```bash
MRGMLPLFEPKGRVLLVDGHHLAYRTFHALKGLTTSRGEPVQAVYGFAKSLLKALKEDGDAVIVVFDAKAPSFRHEAYGGYKAGRAPTPEDFPRQLALIKELVDLLGLARLEVPGYEADDVLASLAKKAEKEGYEVRILTADKDLYQLLSDRIHVLHPEGYLITPAWLWEKYGLRPDQWADYRALTGDESDNLPGVKGIGEKTARKLLEEWGSLEALLKNLDRLKPAIREKILAHMDDLKLSWDLAKVRTDLPLEVDFAKRREPDRERLRAFLERLEFGSLLHEFGLLESPKALEEAPWPPPEGAFVGFVLSRKEPMWADLLALAAARGGRVHRAPEPYKALRDLKEARGLLAKDLSVLALREGLGLPPGDDPMLLAYLLDPSNTTPEGVARRYGGEWTEEAGERAALSERLFANLWGRLEGEERLLWLYREVERPLSAVLAHMEATGVRLDVAYLRALSLEVAEEIARLEAEVFRLAGHPFNLNSRDQLERVLFDELGLPAIGKTEKTGKRSTSAAVLEALREAHPIVEKILQYRELTKLKSTYIDPLPDLIHPRTGRLHTRFNQTATATGRLSSSDPNLQNIPVRTPLGQRIRRAFIAEEGWLLVALDYSQIELRVLAHLSGDENLIRVFQEGRDIHTETASWMFGVPREAVDPLMRRAAKTINFGVLYGMSAHRLSQELAIPYEEAQAFIERYFQSFPKVRAWIEKTLEEGRRRGYVETLFGRRRYVPDLEARVKSVREAAERMAFNMPVQGTAADLMKLAMVKLFPRLEEMGARMLLQVHDELVLEAPKERAEAVARLAKEVMEGVYPLAVPLEVEVGIGEDWLSAKE
```

- **기능:** Taq DNA polymerase는 **PCR(중합효소 연쇄반응)** 에서 널리 사용되는 **DNA 합성 효소**입니다.

  고온에서도 활성을 유지하며, 특히 DNA 복제 과정에서 **94–98°C 고온 변성 단계 후에도 작동 가능**한 것으로 유명합니다.

- **온도 특성:** 극한 환경에서 생존하는 세균에서 유래되었기 때문에 **높은 열 안정성**을 가지고 있습니다. 따라서 TemStaPro가 **고온 안정성 단백질을 얼마나 정확히 예측하는지** 확인할 수 있는 이상적인 모델입니다.

## 4.3 종합 선정 사유

---

이번 예제에서는 **열 안정성이 뚜렷하게 다른 두 단백질**, LDHA와 Taq DNA polymerase를 비교 대상으로 선정하였습니다.

LDHA는 **사람의 대사 효소**로 체온 수준에서만 안정적으로 작동하는 **중온성 단백질**이며, Taq DNA polymerase는 **고온 환경에서 살아가는 세균에서 유래된 내열성 효소**로, **95°C 이상의 조건에서도 활성을 유지**합니다.

이처럼 열 안정성에서 극명한 차이를 보이는 두 단백질을 활용하면, TemStaPro가 열 안정성을 얼마나 잘 예측하고 구별하는지를 **효과적으로 검증**할 수 있습니다.

## 5 예측하기

## 5.1 FASTA 파일 작성

---

먼저 분석할 두 단백질의 서열을 FASTA 형식으로 저장합니다.

예를 들어 `proteins.fasta`라는 이름으로 다음과 같이 작성합니다.

```text
>Human_LDHA
MATLKDQLIYNLLKEEQTPQNKITVVGVGAVGMACAISILMKDLADELALVDVIEDKLKGEMMDLQHGSLFLRTPKIVSGKDYNVTANSKLVIITAGARQQEGESRLNLVQRNVNIFKFIIPNVVKYSPNCKLLIVSNPVDILTYVAWKISGFPKNRVIGSGCNLDSARFRYLMGERLGVHPLSCHGWVLGEHGDSSVPVWSGMNVAGVSLKTLHPDLGTDKDKEQWKEVHKQVVESAYEVIKLKGYTSWAIGLSVADLAESIMKNLRRVHPVSTMIKGLYGIKDDVFLSVPCILGQNGISDLVKVTLTSEEEARLKKSADTLWGIQKELQF
>Taq_DNA_Polymerase
MRGMLPLFEPKGRVLLVDGHHLAYRTFHALKGLTTSRGEPVQAVYGFAKSLLKALKEDGDAVIVVFDAKAPSFRHEAYGGYKAGRAPTPEDFPRQLALIKELVDLLGLARLEVPGYEADDVLASLAKKAEKEGYEVRILTADKDLYQLLSDRIHVLHPEGYLITPAWLWEKYGLRPDQWADYRALTGDESDNLPGVKGIGEKTARKLLEEWGSLEALLKNLDRLKPAIREKILAHMDDLKLSWDLAKVRTDLPLEVDFAKRREPDRERLRAFLERLEFGSLLHEFGLLESPKALEEAPWPPPEGAFVGFVLSRKEPMWADLLALAAARGGRVHRAPEPYKALRDLKEARGLLAKDLSVLALREGLGLPPGDDPMLLAYLLDPSNTTPEGVARRYGGEWTEEAGERAALSERLFANLWGRLEGEERLLWLYREVERPLSAVLAHMEATGVRLDVAYLRALSLEVAEEIARLEAEVFRLAGHPFNLNSRDQLERVLFDELGLPAIGKTEKTGKRSTSAAVLEALREAHPIVEKILQYRELTKLKSTYIDPLPDLIHPRTGRLHTRFNQTATATGRLSSSDPNLQNIPVRTPLGQRIRRAFIAEEGWLLVALDYSQIELRVLAHLSGDENLIRVFQEGRDIHTETASWMFGVPREAVDPLMRRAAKTINFGVLYGMSAHRLSQELAIPYEEAQAFIERYFQSFPKVRAWIEKTLEEGRRRGYVETLFGRRRYVPDLEARVKSVREAAERMAFNMPVQGTAADLMKLAMVKLFPRLEEMGARMLLQVHDELVLEAPKERAEAVARLAKEVMEGVYPLAVPLEVEVGIGEDWLSAKE
```

## 5.2 Linux CLI

---

TemStaPro는 FASTA 파일을 입력으로 받아 평균 ProtTrans 임베딩을 생성하고, 이를 기반으로 단백질의 열 안정성을 예측합니다.

```bash
./temstapro -f proteins.fasta -d ./ProtTrans/ \
    -e ./outputs/ \
    --mean-output proteins_predictions.tsv
    
# 잔기별 예측(옵션)
./temstapro -f proteins.fasta -d ./ProtTrans/ \
    -e ./outputs/ -p ./ \
    --per-res-output proteins_per_res_predictions.tsv
    
# 세그먼트(윈도우) 기반 예측(옵션)
./temstapro -f proteins.fasta -d ./ProtTrans/ \
    -e ./outputs/ -p ./ \
    --curve-smoothening \
    --per-segment-output proteins_per_segment_predictions.tsv
```

## 5.3 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/temstapro
```

화면에는 열 안정성 예측에 사용 할 단백질의 아미노산 서열을 입력하는 창이 준비되 있습니다.

![image.png](/image/info/detail/temstapro_2.webp){center:880}

여기에 분석 할 단백질의 아미노산 서열을 입력 후, 아미노산 조각의 크기를 설정합니다. 기본적으로 예측은 40℃부터 65℃까지 범위를 다룹니다. 화장 옵션을 활성화하면 40℃에서 80℃까지 확장하여 더 넓은 안정성 프로파일을 제공합니다. 이후 분석 시작 버튼을 통해 해당 단백질의 독성에 대한 평가를 진행할 수 있습니다.

# 6 분석 결과

## 6.1 결과 요약

---

| protein | length | t40 binary | t40 raw | t45 binary | t45 raw | t50 binary | t50 raw | t55 binary | t55 raw | t60 binary | t60 raw | t65 binary | t65 raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |---------|
| LDHA | 332 | 1 | 0.631 | 1 | 0.649 | 1 | 0.652 | 1 | 0.692 | 0 | 0.444 | 0 | 0.230   |
| Taq | 832 | 1 | 1.000 | 1 | 1.000 | 1 | 1.000 | 1 | 0.998 | 1 | 0.997 | 1 | 0.994   |
- **Taq**의 평균 raw score는 모든 threshold에서 **0.994 이상**, 거의 포화 수준으로 **매우 높은 내열성**을 보입니다. **LDHA**는 비교적 낮은 점수 분포를 보이며, 특히 높은 threshold(t60, t65)에서는 급격히 점수가 하락합니다.
- 이진(binary) 분류 결과에도 **Taq DNA polymerase**는 모든 threshold에서 **binary prediction = 1** → 모든 임계값에서 내열성(highly thermostable)으로 예측됨. 반면 **LDHA**는 **t60, t65**에서 0 (비내열성)으로 분류 → 일반 단백질로서의 특성이 드러남.

<div style="display:flex; justify-content:space-between; width:100%;">
<div style="width:48%; text-align:center;">
<h3>LDHA</h3>
<img src="/image/info/detail/temstapro_3.webp" style="width:100%; max-width:440px; margin-bottom:20px;">
<img src="/image/info/detail/temstapro_5.webp" style="width:100%; max-width:440px; margin-bottom:20px;">
<img src="/image/info/detail/temstapro_7.webp" style="width:100%; max-width:440px;">
</div>
<div style="width:48%; text-align:center;">
<h3>Taq</h3>
<img src="/image/info/detail/temstapro_4.webp" style="width:100%; max-width:440px; margin-bottom:20px;">
<img src="/image/info/detail/temstapro_6.webp" style="width:100%; max-width:440px; margin-bottom:20px;">
<img src="/image/info/detail/temstapro_8.webp" style="width:100%; max-width:440px;">
</div>
</div>

### LDHA (왼쪽 열)

- **전반적인 열 안정성 곡선이 고르지 않고** threshold가 높아질수록 예측 score가 크게 하락합니다.
- 특히 **중앙부 (100~200 segment)** 영역에서는 지속적으로 낮은 안정성을 보여줍니다.
- 이러한 분절적 불안정성은 **고온 환경에서 구조 붕괴 가능성**을 시사합니다.

### Taq DNA Polymerase (오른쪽 열)

- 예측 곡선이 **전반적으로 평탄하고 높음(>0.9)**, 일부 구간의 낮은 peak 제외 시 거의 **전체가 안정적**입니다.
- 모든 threshold에서 **0.9 이상 유지되는 넓은 plateau**가 존재하며, 고온 조건에서도 구조가 **일관되게 유지될 가능성**이 높습니다.

## 6.3 종합 평가

---

- **TemStaPro 결과는 실제 생물학적 특성과 잘 부합합니다.**
- Taq DNA polymerase는 고온(≥72°C)에서 작동하는 효소로 알려져 있으며, 모델은 이를 높은 score와 안정적인 플롯으로 정확히 포착했습니다.
- LDHA는 체온(37°C) 근처에서 작동하는 **중온성 효소**로, threshold가 높아질수록 낮은 점수와 불안정한 예측 곡선을 보이며 **내열성이 제한됨**을 나타냅니다.
- **모델 신뢰도는 매우 우수**하며, 실험적 특성 구분에 활용될 수 있는 수준의 해상도와 정밀도를 보여줍니다.

# 7 마무리하며 – “이 펩타이드, 안심하고 써도 될까?”

---

이번 튜토리얼에서는 TemStaPro를 활용해 내열성 단백질과 일반 단백질의 열 안정성을 예측하고 비교해 보았습니다. 단순한 FASTA 서열만으로도 고온에서 안정한 구조를 갖는지를 파악할 수 있다는 점에서, TemStaPro는 연구자들에게 매우 유용한 도구임을 확인할 수 있었습니다.

예측 결과는 실험적으로 알려진 생물학적 특성과도 잘 부합하여, **신규 단백질 디자인, 백신 개발, 산업용 효소 최적화** 등의 분야에서 충분한 활용 가능성을 보여줍니다.

TemStaPro로 여러분의 단백질, 한번 예측해보는건 어떨까요.

다음 실험 설계를 더 똑똑하게 만드는 데 도움될지도 모르겠네요.!

# 8 Reference

---

- [Github TemStaPro](https://github.com/ievapudz/TemStaPro)
- [OXFORD ACADEMIC](https://academic.oup.com/bioinformatics/article/40/4/btae157/7632735?login=false)
- CURIE : [TemStaPro](https://curie.kr/Analysis/temstapro)

---

[tool-button:TemStaPro]
