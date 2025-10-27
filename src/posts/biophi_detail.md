---
layout: post
title: "BioPhi : 항체 인간화, 유사도 평가, 서열 설계를 지원하는 통합 설계 플랫폼"
description: "대규모 항체 데이터를 이용한 항체 인간화 및 humanness 평가 모델"
categories: [analysis]
tags: [BioPhi, 항체, humanization, humanness, OAS, 딥러닝]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/biophi_1.webp"
comment_id: "biophi_detail"
---
![biophi](/image/info/detail/biophi_1.webp){center:600}

신약 개발에서 항체가 좌초되는 큰 이유 중 하나가 **면역원성**입니다. 그래서 설계 단계에서 얼마나 ‘사람처럼’ 보이는지(humanness)를 빠르게 점수화하고, 필요하면 인간화까지 해주는 도구가 중요하죠. **BioPhi**는 대규모 항체 레퍼토리를 바탕으로 humanness 스코어(OASis)를 계산하고, 제안 변이로 자동 인간화(Sapiens)를 도와줍니다.

이 튜토리얼에서는 Cetuximab(CTX)과 **Panitumumab**의 **humanness 스코어를 비교**한 뒤, BioPhi로 **CTX를 인간화**하고 VH 프레임워크(백본)가 Panitumumab과 얼마나 가까워지는지를 확인합니다.

바로 시작할게요.

# 1 사용된 도구

---

- **BioPhi** 자동 항체 인간화(Sapiens), 인간성 평가(OAsis) 방법, 그리고 컴퓨터 기반 항체 서열 설계를 위한 통합 도구

# 2 BioPhi 설치 튜토리얼 (빠른 시작)

BioPhi를 로컬에서 돌리려면 **OASis DB(압축 해제 후 약 22 GB)** 가 필요합니다. 아래 순서대로 진행하세요.

## 2.1 OASis DB 다운로드 & 압축 해제

---

```bash
# DB 파일 다운로드
wget https://zenodo.org/record/5164685/files/OASis_9mers_v1.db.gz

# 압축 해제 (≈22GB 필요)
gunzip OASis_9mers_v1.db.gz
```

- OASis DB 경로를 환경변수로 지정해 두면 편합니다.

```bash
export OASIS_DB_PATH=/absolute/path/to/OASis_9mers_v1.db
```

## 2.2 설치 방법 A — Conda (권장)

---

```bash
# 별도 환경 생성
conda create -n biophi python=3.9
conda activate biophi

# 설치 (bioconda + conda-forge 채널 사용)
conda install biophi -c bioconda -c conda-forge --override-channels

# 웹 서버 기동(로컬 확인용)
biophi web --host 0.0.0.0 --port 5000
# 브라우저에서 http://localhost:5000 접속
```

## 2.3 설치 방법 B — Docker (가장 간단)

---

```bash
docker run \
  -v /your/absolute/path/to/oasis/:/data -e OASIS_DB_PATH=/data/OASis_9mers_v1.db -p 5000:5000 quay.io/biocontainers/biophi:1.0.5--pyhdfd78af_0 biophi web --host 0.0.0.0
```

- `v`에 **로컬 OASis DB 디렉터리의 절대경로**를 바인드
- 서버는 [**http://localhost:5000**](http://localhost:5000/) 에서 확인

# 3 기본 사용 용법

## 3.1 BioPhi CLI 기본 사용 튜토리얼 (대량 처리용)

---

아래 명령들만 따라 하면 **인간화(Sapiens)**, **humanness 평가(OASis)**, 그리고 **점수 추출**을 일괄 처리할 수 있어요.

### 준비물

**입력 FASTA(`mabs.fa`)**: 항체당 **두 체인(H/V 또는 HC/LC)**, 같은 ID를 공유해야 합니다.

```text
>CTX_VH
EVQLVESGGGLVQPGGSLRLSCAASGFT...
>CTX_VL
EIVLTQSPATLSLSPGERATLSCRASQSV...

>PANI_HC
EVQLVESGGGLVQPGGSLRLSCAASGFS...
>PANI_LC
EIVLTQSPATLSLSPGERATLSCRASQSV...
```

**OASis DB 경로** (humanness 평가/풀 파이프라인에 필요)

```bash
export OASIS_DB_PATH=/abs/path/OASis_9mers_v1.db
```

### Biophi 실행

```bash
# 인간화된 FASTA만 받기 (Sapiens) - 설계안만 빠르게 보고 싶을 때
biophi sapiens mabs.fa --fasta-only --output humanized.fa 

# 전체 파이프라인 - 인간화 결과와 humanness 점수를 한 번에
biophi sapiens mabs.fa --oasis-db $OASIS_DB_PATH --output humanized/

# 위치별 확률 행렬 (Sapiens scores) - 각 위치에서 어떤 아미노산이 선호되는지 확률
biophi sapiens mabs.fa --scores-only --output scores.csv

# 서열별 평균 Sapiens 점수 - 서열당 하나의 요약 점수(빠른 랭킹)
biophi sapiens mabs.fa --mean-score-only --output scores.csv

# OASis humanness 평가만 수행 - 인간화 없이 현재 서열의 ‘사람-유사성’만 점검
biophi oasis mabs.fa --oasis-db $OASIS_DB_PATH --output oasis.xls
```

- 출력 폴더 `humanized/`에 인간화 결과와 평가 리포트 생성

# 4 데이터 선정

이 튜토리얼의 목표는 Cetuximab(CTX)과 Panitumumab의 humanness(OASis) 스코어를 비교하고, 이어서 BioPhi(Sapiens)로 CTX를 인간화했을 때 VH 프레임워크(백본)가 Panitumumab과 얼마나 유사해지는지 정량적으로 확인하는 것입니다.

## 4.1 Cetuximab (CTX, Erbitux)

---

![image](/image/info/detail/biophi_2.webp){center:400}
![image](/image/info/detail/biophi_3.webp){center:200}

- **항체 백본**: IgG1, 키메라(mouse–human). 쥐 V영역에 사람 C영역을 결합한 형태. IgG1 Fc 특성상 ADCC 유도력이 상대적으로 큼.
- **표적 / 에피토프:** EGFR 세포외 도메인 III에 결합. 리간드 결합부 일부를 입체적으로 가림(steric occlusion)과 함께 수용체의 확장/이합체화(활성화) 상태 전환을 방해.
- **서열**

```bash
#HC
QVQLKQSGPGLVQPSQSLSITCTVSGFSLTNYGVHWVRQSPGKGLEWLGVIWSGGNTDYNTPFTSRLSINKDNSKSQVFFKMNSLQSNDTAIYYCARALTYYDYEFAYWGQGTLVTVSAASTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKRVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK

#LC
DILLTQSPVILSVSPGERVSFSCRASQSIGTNIHWYQQRTNGSPRLLIKYASESISGIPSRFSGSGSGTDFTLSINSVESEDIADYYCQQNNNWPTTFGAGTKLELKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC
```

- **특징:** 쥐 mAb 225 가변부를 기반으로 한 키메라 서열(가변부 murine, 상수부 human). humanness가 상대적으로 낮아 인간화 설계의 후보가 됨.

## 4.2 Panitumumab (Vectibix)

---

![image](/image/info/detail/biophi_4.webp){center:400}
![image](/image/info/detail/biophi_5.webp){center:200}

- **항체 백본:** IgG2, 완전 인간(fully human). 사람 유래 V/C 영역으로 구성되어 면역원성 위험이 낮은 편(일반적 기대). IgG2 Fc는 ADCC 효력은 약한 편.
- **표적 / 에피토프:** EGFR 도메인 III 결합. CTX와 거의 같은 에피토프를 인지하지만 결합 자세(orientation)와 결합면 기하가 약간 달라 Fab 중심부 캐비티로 특정 변이를 수용하는 특징 보고.
- **서열**

```bash
#HC
QVQLQESGPGLVKPSETLSLTCTVSGGSVSSGDYYWTWIRQSPGKGLEWIGHIYYSGNTNYNPSLKSRLTISIDTSKTQFSLKLSSVTAADTAIYYCVRDRVTGAFDIWGQGTMVTVSSASTKGPSVFPLAPCSRSTSESTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSNFGTQTYTCNVDHKPSNTKVDKTVERKCCVECPPCPAPPVAGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVQFNWYVDGVEVHNAKTKPREEQFNSTFRVVSVLTVVHQDWLNGKEYKCKVSNKGLPAPIEKTISKTKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPMLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK

#LC
DIQMTQSPSSLSASVGDRVTITCQASQDISNYLNWYQQKPGKAPKLLIYDASNLETGVPSRFSGSGSGTDFTFTISSLQPEDIATYFCQHFDHLPLAFGGGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC
```

- **특징:**  완전 인간 서열. 가변부도 인간 germline 기반이라 humanness가 높아 타깃으로 적합.

## 4.1 왜 이 두 항체인가?

---

두 항체는 **표적은 동일(EGFR)** 하지만 **출신이 다른 페어**입니다.

- **Cetuximab(CTX)**: 쥐 V영역 + 사람 C영역으로 이루어진 **키메라 항체**
- **Panitumumab**: **완전 인간 항체**

그래서 두 항체 사이에는 **humanness 스코어 차이**가 뚜렷하게 나타납니다. 이번 튜토리얼에서는 CTX를 인간화했을 때, 그 **사람-유사성이 어떤 방향으로 수렴하는지**―특히 VH 프레임워크가 **Panitumumab에 얼마나 가까워지는지** 살펴보기 좋습니다.

# 5 예측하기

## 5.1 Linux CLI

---

### BioPhi 입력 FASTA 생성

`hl_to_fa.py`는 **IgG의 서열**을 받아 **VH, VL만 추출**하여 BioPhi가 읽을 수 있는 **FASTA**로 만듭니다.

```python
python $MODEL_DIR/biophi/hl_to_fa.py --heavy "HC_SEQ" --light "LC_SEQ" --output $INPUT_DIR/BioPhi.fa
```

### BioPhi 실행

```bash
# Sapiens: 인간화 + humanness 평가
biophi sapiens $INPUT_DIR/BioPhi.fa --oasis-db $OASIS_DB --output $OUTPUT_DIR/

# Sapiens: 서열별 평균 점수(mean score)만 추출
biophi sapiens $INPUT_DIR/BioPhifa --mean-score-only --output $OUTPUT_DIR/mean_scores.csv

# Sapiens: 위치별 확률 매트릭스(position×residue)
biophi sapiens $INPUT_DIR/BioPhi.fa --scores-only --output $OUTPUT_DIR/scores.csv

# OASis: humanness 평가만 수행
biophi oasis $INPUT_DIR/BioPhi.fa --oasis-db $OASIS_DB --output $OUTPUT_DIR/oasis.xlsx
```

이 명령을 실행하면  DILI 예측 결과가 `result.csv` 파일로 저장됩니다.

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI와 Python 라이브러리 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/biophi
```

화면에는 **Heavy Chain과 Light Chain의 서열을** 입력하는 창이 준비되어 있습니다.

![input](/image/info/detail/biophi_6.webp){center:880}

여기에 분석할 항체의 아미노산 서열을 입력하면 됩니다.

```bash
# Cetuximab HC
QVQLKQSGPGLVQPSQSLSITCTVSGFSLTNYGVHWVRQSPGKGLEWLGVIWSGGNTDYNTPFTSRLSINKDNSKSQVFFKMNSLQSNDTAIYYCARALTYYDYEFAYWGQGTLVTVSAASTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKRVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK

# Cetuximab LC
DILLTQSPVILSVSPGERVSFSCRASQSIGTNIHWYQQRTNGSPRLLIKYASESISGIPSRFSGSGSGTDFTLSINSVESEDIADYYCQQNNNWPTTFGAGTKLELKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC

# Panitumumab HC
QVQLQESGPGLVKPSETLSLTCTVSGGSVSSGDYYWTWIRQSPGKGLEWIGHIYYSGNTNYNPSLKSRLTISIDTSKTQFSLKLSSVTAADTAIYYCVRDRVTGAFDIWGQGTMVTVSSASTKGPSVFPLAPCSRSTSESTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSNFGTQTYTCNVDHKPSNTKVDKTVERKCCVECPPCPAPPVAGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVQFNWYVDGVEVHNAKTKPREEQFNSTFRVVSVLTVVHQDWLNGKEYKCKVSNKGLPAPIEKTISKTKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPMLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK

# Panitumumab LC
DIQMTQSPSSLSASVGDRVTITCQASQDISNYLNWYQQKPGKAPKLLIYDASNLETGVPSRFSGSGSGTDFTFTISSLQPEDIATYFCQHFDHLPLAFGGGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC
```

이후 **분석 시작** 버튼을 누르면 BioPhi에 의한 분석이 시작되며 빠르게 결과를 확인할 수 있습니다.

# 6 분석 결과

## 6.1 **Cetuximab의 서열 Align**뭐가 바뀌었나

---

이 그림은 **원래 Cetuximab(CTX) 항체 서열**과, **BioPhi Sapiens가 제안한 인간화 서열**을 자리별로 정렬해 비교한 지도입니다. 한 장만 봐도 Sapiens가 **어디를 건드렸고, 어디를 그대로 뒀는지** 바로 확인할 수 있어요.

![result](/image/info/detail/biophi_7.webp){center:880}

![result](/image/info/detail/biophi_8.webp){center:880}

먼저 CDR부터 보겠습니다. 색이 칠해진 부분에 `+`가 없습니다. 즉, 항원과 직접 결합하는 이 핵심 부위는 그대로 보존됐다는 뜻이에요. CDR은 항체의 ‘정체성’ 같은 영역이라, 조금만 달라져도 결합력이나 특이성이 크게 흔들릴 수 있습니다. Sapiens가 기능 보존형 인간화를 지향한다는 점에서 아주 중요한 포인트죠.

다음은 프레임워크(FR)입니다. 특히 FR1과 FR3에서 `+`가 많이 보일 거예요. CTX가 본래 쥐 가변부를 가진 키메라 항체라서, 사람에게는 낯선 잔기들이 남아 있기 때문이죠. Sapiens는 이 부분을 사람 germline 기반 아미노산으로 바꾸도록 제안합니다. 상황에 따라 FR4에도 소규모 조정이 들어갈 수 있어요.

결과적으로, CTX의 구조적 뼈대가 완전 인간 항체 쪽에 더 가까워지도록 Sapiens가 부드럽게 정렬해 준 셈입니다.

## 6.2 Panitumumab**의 서열 Align**

---

![result](/image/info/detail/biophi_9.webp){center:880}

![result](/image/info/detail/biophi_10.webp){center:880}

먼저 **CDR**을 보겠습니다. 예상대로 **모든 CDR 위치에는 `+`가 없습니다.** Sapiens는 항원 결합에 핵심적인 부위는 **항상 보존**하는 보수적인 태도를 일관되게 보여줍니다. 이는 CTX에서도 확인됐던 부분이죠. 다시 말해, **기능은 절대 건드리지 않는다**는 Sapiens의 철학은 인간 항체에도 그대로 적용됩니다.

이제 프레임워크(FR)를 살펴보면, 놀랍게도 거의 변화를 제안하지 않았습니다. Panitumumab의 FR1, FR2, FR3, FR4 전 구간에서 `+` 표식이 **거의 보이지 않아요.** 있어도 드물게, 동일한 기능을 유지할 수 있는 **다른 human germline 대안** 정도만 제안할 뿐입니다.

즉, Sapiens의 판단은 명확합니다.

“이 항체는 이미 사람 것이다. 굳이 손댈 필요 없다.”

## 6.3 **OASis humanness** 인간화 없이 현재 서열의 사람 유사성을 점검

---

| **Antibody** | **OASis Percentile** | **OASis Identity** | **Germline Content** | **V Germline** | **J Germline** | **OASis Percentile** | **OASis Identity** | **Non-human peptides** | **H/L Germline Content** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |--------------------------|
| Cetuximab H | 0.012 | 0.45045 | 0.571429 | IGHV4-30-4*01 | IGHJ4*01 | 0.047541 | 0.45045 | (61,) | 0.571429                 |
| Cetuximab L | 0.041525 | 0.505051 | 0.672897 | IGKV6-21*02 | IGKJ2*01 | 0.03303 | 0.505051 | 49 | 0.672897                 |
| Panitumumab H | 0.868757 | 0.945946 | 0.87395 | IGHV4-61*01 | IGHJ3*02 | 0.941054 | 0.945946 | (6,) | 0.87395                  |
| Panitumumab L | 0.734586 | 0.89899 | 0.934579 | IGKV1-33*01 | IGKJ4*01 | 0.66999 | 0.89899 | 10 | 0.934579                 |

Cetuximab은 OASis 지표 기준으로 인간 유사성이 낮고 비-인간 잔기가 많아, 인간화 필요성이 큽니다. 반면 Panitumumab은 전체 유사도와 germline 포함 비율이 모두 높고, 비-인간 잔기도 거의 없어 인간화 제안이 최소화됩니다.

즉, BioPhi의 Sapiens는 항체의 인간성 수준에 따라 필요한 변이만 선별적으로 제안하고, 불필요한 변경은 피하는 보수적이고 신중한 설계 철학을 따르고 있음을 보여줍니다.

## 6.4 **Sapiens mean score 서열당 1개 값으로 빠르게 랭킹/비교**

---

| **Info** | **OASis Percentile** |  | **OASis Identity** |  | **Non-human Peptides** |  | **Settings** |
| --- | --- | --- | --- | --- |------------------------| --- | --- |
| **Antibody** | **Before** | **After** | **Before** | **After** | **Before**             | **After** | **Threshold** |
| Cetuximab H | 0.012 | 0.130423 | 0.45045 | 0.657658 | 61                     | 38 | relaxed |
| Panitumumab H | 0.868757 | 0.936117 | 0.945946 | 0.963964 | 6                      | 4 | relaxed |
| Cetuximab L | 0.041525 | 0.366697 | 0.505051 | 0.747475 | 49                     | 25 | relaxed |
| Panitumumab L | 0.734586 | 0.783273 | 0.89899 | 0.919192 | 10                     | 8 | relaxed |

이 데이터는 **Cetuximab은 인간화로 크게 개선**되고, **Panitumumab은 이미 완전 인간 항체라 변화가 거의 없는** 패턴을 보여줍니다. 즉, BioPhi Sapiens는 **필요한 경우에만 선택적으로 개입하고, 불필요한 수정은 하지 않는 보수적 설계 철학**을 수치로 입증합니다.

## 6.5 **Sapiens mean score 서열당 1개 값으로 빠르게 랭킹/비교**

---

| **id** | **chain** | **sapiens_score** |
| --- | --- | --- |
| Cetuximab | H | 0.697711 |
| Panitumumab | H | 0.844839 |
| Cetuximab | L | 0.745877 |
| Panitumumab | L | 0.874381 |

**Cetuximab**은 Sapiens score가 낮아 여전히 **비인간적 요소가 많이 남아 있는 키메라 항체**로, 인간화 여지가 큽니다. 반대로 **Panitumumab**은 점수가 높아 이미 **완전 인간 항체에 가까운 상태**이기 때문에 변이 제안이 거의 없습니다.

결국 **Sapiens**는 **인간화가 필요한 경우에만 선별적으로 개입**하고, 이미 완전 인간 항체인 경우에는 **불필요한 수정을 피하는 보수적 원칙**에 따라 작동합니다.

## 6.6 종합 평가

---

**Cetuximab**은 여전히 “사람 흉내를 낸 쥐”에 가까운 상태입니다. CDR 같은 핵심 기능 부위는 잘 보존되어 있지만, 프레임워크 곳곳에는 **비-인간적 흔적**이 남아 있어 인간화의 여지가 충분합니다.

반면 **Panitumumab**은 처음부터 **완전 인간 항체**로 설계된 만큼, 손볼 부분이 거의 없습니다. BioPhi 역시 이런 경우 불필요한 변이를 제안하지 않고, 마치 “이건 이미 괜찮아, 굳이 건들 필요 없어”라는 태도를 보여줍니다.

결국 **Sapiens**는 **필요한 곳만 정교하게 다듬고, 불필요한 곳은 그대로 두는** 균형 잡힌 인간화 도구임을 확인할 수 있습니다.

# 7 마치며

---

이번 튜토리얼에서는 BioPhi를 통해 **Cetuximab의 인간화 가능성**을 진단하고, 실제로 **Panitumumab과의 구조적 유사성**이 어떻게 변화하는지를 단계별로 살펴봤습니다. 결과는 분명합니다. BioPhi는 단순히 점수만 매기는 도구가 아니라, **CDR은 그대로 보존하면서 필요한 프레임워크만 선별적으로 다듬는 스마트한 설계 파트너**입니다.

특히 **Sapiens + OASis**를 함께 활용하면, **설계 방향성과 정량적 근거**를 동시에 확보할 수 있어 실험 전 단계에서 항체 후보의 ‘사람다움’을 빠르고 신뢰성 있게 평가할 수 있습니다.

따라서 신약 개발 과정에서 인간화 설계가 필요할 때, **BioPhi는 충분히 믿을 만한 출발점**이 되어줄 수 있습니다.

# 8 Reference

---

- [Github BioPhi](https://github.com/Merck/BioPhi?tab=readme-ov-file)
- [IMGT DB 7906](https://www.imgt.org/3Dstructure-DB/cgi/details.cgi?pdbcode=7906)
- [IMGT DB 8499](https://www.imgt.org/3Dstructure-DB/cgi/details.cgi?pdbcode=8499)
- CURIE : [BioPhi](https://curie.kr/Analysis/biophi), [Dilipred](https://curie.kr/Analysis/dilipred)

---

[tool-button:BioPhi]