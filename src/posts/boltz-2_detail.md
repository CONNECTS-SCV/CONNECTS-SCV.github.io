---
layout: post
title: "Boltz-2 : 단백질–리간드 복합체 모델링과 단백질 구조 예측"
description: "단백질 구조 예측과 도킹을 동시에 지원하는 Diffusion 기반 AI 모델"
categories: [analysis]
tags: [Boltz-2, 단백질구조, 도킹, Diffusion, 리간드결합]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/info/detail/boltz-2_1.webp"
---

![image](/image/info/detail/boltz-2_1.webp){center:600}

신약 개발 과정에서 빼놓을 수 없는 과제 중 하나가 바로 **단백질–리간드 결합 예측**입니다. 후보 물질이 표적 단백질에 얼마나 잘 결합하는지 알 수 있다면, 가능성이 낮은 후보는 일찍 걸러내고 유망한 물질에 집중할 수 있죠. 문제는 기존에 많이 쓰이는 **MD 시뮬레이션**이나 **FEP** 같은 물리 기반 방법이 정확하긴 해도 계산 비용이 크고 시간이 오래 걸린다는 점입니다.

이런 한계를 보완하기 위해 나온 도구가 바로 [**Boltz-2**](https://github.com/jwohlwend/boltz) 입니다. Boltz-2는 대규모 학습 데이터를 기반으로 단백질–리간드의 **결합 구조와 친화도**를 동시에 예측할 수 있으며, 기존 방식보다 훨씬 빠르게 결과를 확인할 수 있습니다. 이번 튜토리얼에서는 Boltz-2를 활용해 복잡한 계산 없이도 후보 물질의 결합 가능성을 손쉽게 평가하는 방법을 소개하려고 합니다.

# 1 사용된 도구

---

- **Boltz-2** 단백질을 포함한 생체분자의 상호작용을 예측하기 위한 모델

# 2 **Boltz-2 설치 방법**

설치 방법은 크게 두 가지가 있습니다. **PyPI**를 통해 간단하게 설치하거나 **소스에서 직접 빌드**할 수 있습니다**.**

## 2.1 PyPI에서 설치하기

---

가장 간단한 방법은 pip를 사용하는 것입니다.

```bash
pip install boltz[cuda] -U
```

## 2.2 소스에서 직접 빌드하기

---

PyPI 대신, 저장소를 직접 클론해서 빌드하는 방법도 있습니다.

```bash
git clone https://github.com/jwohlwend/boltz.git #저장소 복제
cd boltz; pip install -e .[cuda] #프로젝트 빌드
```

만약 CUDA 기반 GPU가 없는 경우, 설치 시 `[cuda]`를 제거하고 CPU 전용으로 설치할 수 있습니다. 다만 CPU로 실행할 때는 GPU 대비 속도가 현저히 느려질 수 있습니다.

# 3 기본 사용 용법

## 3.1 Boltz로 추론 실행하기

---

Boltz를 설치한 뒤에는 `predict` 명령어를 사용해 단백질 또는 단백질–리간드 복합체의 구조와 결합 친화도를 예측할 수 있습니다.

### 입력 파일 준비

Boltz는 **FASTA 유사 형식의 입력 파일**을 사용합니다. 각 항목은 `>식별자|타입|경로/데이터` 의 형태를 가집니다.

```text
>A|protein|./examples/msa/seq1.a3m
MVTPEGNVSLVDESLLVGV...

>B|ccd
SAH

>C|smiles
N[C@@H](Cc1ccc(O)cc1)C(=O)O
```

### 추론 실행 명령어

```bash
boltz predict input_path --use_msa_server
```

- **`input_path`**: 예측에 사용할 서열 및 정보가 담긴 .fasta 입력파일의 위치를 지정합니다.
- **`-use_msa_server`**: 다중 서열 정렬(MSA) 서버를 사용하여 입력을 처리할 수 있도록 합니다.

사용 가능한 전체 옵션은 다음을 통해 확인할 수 있습니다.

```bash
boltz predict --help
```

### 결합 친화도 출력

Boltz를 친화도 예측 결과에는 두 가지 주요 필드가 포함됩니다.

- **`affinity_probability_binary`**
    - 0 ~ 1 범위의 값을 가집니다.
    - 리간드가 결합제일 확률을 나타내며, **히트 발견(early hit discovery)** 단계에서 주로 활용합니다.
- **`affinity_pred_value`**
    - log10(IC50 [µM]) 값에서 파생된 친화도 예측치입니다.
    - 리간드 구조의 작은 변화가 결합 친화도에 어떤 영향을 미치는지 확인할 수 있으며, **리드 최적화(lead optimization)** 단계에서 유용합니다.

# 4 데이터 선정

이번 튜토리얼에서는 **Boltz**의 기본 사용법을 살펴보기 위해 단백질 단독 구조 예측과 단백질–리간드 상호작용 예측 두 가지 사례를 준비했습니다.

## 4.1 **Acetylcholinesterase (아세틸콜린에스터레이스)**

---

- **PDB ID**: 7E3H

![RCSB : 7E3H](/image/info/detail/boltz-2_2.webp){center:400}[RCSB : 7E3H]

- **UniProt ID**: P22303
- **서열 정보**

    ```text
    EDAELLVTVRGGRLRGIRLKTPGGPVSAFLGIPFAEPPMGPRRFLPPEPKQPWSGVVDATTFQSVCYQYVDTLYPGFEGTEMWNPNRELSEDCLYLNVWTPYPRPTSPTPVLVWIYGGGFYSGASSLDVYDGRFLVQAERTVLVSMNYRVGAFGFLALPGSREAPGNVGLLDQRLALQWVQENVAAFGGDPTSVTLFGESAGAASVGMHLLSPPSRGLFHRAVLQSGAPNGPWATVGMGEARRRATQLAHLVGCPPGGTGGNDTELVACLRTRPAQVLVNHEWHVLPQESVFRFSFVPVVDGDFLSDTPEALINAGDFHGLQVLVGVVKDEGSYFLVYGAPGFSKDNESLISRAEFLAGVRVGVPQVSDLAAEAVVLHYTDWLHPEDPARLREALSDVVGDHNVVCPVAQLAGRLAAQGARVYAYVFEHRASTLSWPLWMGVPHGYEIEFIFGIPLDPSRNYTAEEKIFAQRLMRYWANFARTGDPNEPRDPKAPQWPPYTAGAQQYVSLDLRPLEVRRGLRAQACAFWNRFLPKLLSAT
    ```


## 4.2 Donepezil(E20)

두 번째 예시는 아세틸콜린에스터레이스의 저해제로 알려진 **Donepezil (E20)** 입니다.

- **리간드명**: Donepezil (E20)
- **화학식**: C₂₄H₂₉NO₃

![Donepezil](/image/info/detail/boltz-2_3.webp){center:300}[Donepezil]

- **IUPAC명**: 1-Benzyl-4-[(5,6-dimethoxy-1-indanone-2-yl)methyl]piperidine
- **SMILES**: CN1CCN(CC1)C2CC3=CC=CC=C3C(=C2)OC4=CC=CC5=C4C=CC(=C5)C

## 4.3 선정 이유

Acetylcholinesterase는 아세틸콜린을 분해하는 중요한 효소로, 알츠하이머병 치료제 연구에서 자주 다뤄지는 대표적인 표적 단백질입니다. 그래서 단백질 단독 구조 예측을 보여주기 위한 사례로 활용하기에 적합합니다.

여기에 더해, Acetylcholinesterase의 저해제인 **E20**을 함께 사용하면 이야기가 더 흥미로워집니다. E20은 효소의 활성 부위에 결합해 작용하는 물질로, 단백질과의 **결합 친화도와 구조적 상호작용**을 평가하기 좋은 예시입니다. 따라서 이번 튜토리얼에서는 E20을 포함한 단백질–리간드 복합체 예측 사례로도 활용할 수 있습니다.

# 5 예측하기

## 5.1 Linux CLI

---

Boltz-2 예측을 위해 `example.fasta` 형식의 입력 파일을 준비합니다.

```text
>A|protein
EDAELLVTVRGGRLRGIRLKTPGGPVSAFLGIPFAEPPMGPRRFLPPEPKQPWSGVVDATTFQSVCYQYVDTLYPGFEGTEMWNPNRELSEDCLYLNVWTPYPRPTSPTPVLVWIYGGGFYSGASSLDVYDGRFLVQAERTVLVSMNYRVGAFGFLALPGSREAPGNVGLLDQRLALQWVQENVAAFGGDPTSVTLFGESAGAASVGMHLLSPPSRGLFHRAVLQSGAPNGPWATVGMGEARRRATQLAHLVGCPPGGTGGNDTELVACLRTRPAQVLVNHEWHVLPQESVFRFSFVPVVDGDFLSDTPEALINAGDFHGLQVLVGVVKDEGSYFLVYGAPGFSKDNESLISRAEFLAGVRVGVPQVSDLAAEAVVLHYTDWLHPEDPARLREALSDVVGDHNVVCPVAQLAGRLAAQGARVYAYVFEHRASTLSWPLWMGVPHGYEIEFIFGIPLDPSRNYTAEEKIFAQRLMRYWANFARTGDPNEPRDPKAPQWPPYTAGAQQYVSLDLRPLEVRRGLRAQACAFWNRFLPKLLSAT

>B|CCD #리간드 결합 예측 시
E20
```

실행 예시는 다음과 같습니다.

```bash
boltz predict example.fasta --use_msa_server --out_dir OUTPUT_PATH --output_format pdb --override --cache MODEL_PATH
```

이 명령을 실행하면  Boltz-2 예측 결과가 파일로 저장됩니다.

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 boltz 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개합니다.

먼저 해당 주소로 접속합니다.

```text
https://curie.kr/Analysis/boltz
```

화면에는 아미노산 서열과 화합물에 대한 열보를 입력하는 창이 준비되어 있습니다.

![input](/image/info/detail/boltz-2_4.webp){center:880}

여기에 구조를 예측 할 단백질의 아미노산 서열과 화합물의 CCD를 입력하면 됩니다.

```text
# Glucose
EDAELLVTVRGGRLRGIRLKTPGGPVSAFLGIPFAEPPMGPRRFLPPEPKQPWSGVVDATTFQSVCYQYVDTLYPGFEGTEMWNPNRELSEDCLYLNVWTPYPRPTSPTPVLVWIYGGGFYSGASSLDVYDGRFLVQAERTVLVSMNYRVGAFGFLALPGSREAPGNVGLLDQRLALQWVQENVAAFGGDPTSVTLFGESAGAASVGMHLLSPPSRGLFHRAVLQSGAPNGPWATVGMGEARRRATQLAHLVGCPPGGTGGNDTELVACLRTRPAQVLVNHEWHVLPQESVFRFSFVPVVDGDFLSDTPEALINAGDFHGLQVLVGVVKDEGSYFLVYGAPGFSKDNESLISRAEFLAGVRVGVPQVSDLAAEAVVLHYTDWLHPEDPARLREALSDVVGDHNVVCPVAQLAGRLAAQGARVYAYVFEHRASTLSWPLWMGVPHGYEIEFIFGIPLDPSRNYTAEEKIFAQRLMRYWANFARTGDPNEPRDPKAPQWPPYTAGAQQYVSLDLRPLEVRRGLRAQACAFWNRFLPKLLSAT 

#리간드 결합 예측 시
E20
```

이후 **분석 시작** 버튼을 누르면 Boltz-2를 이용한 구조 및 결합 친화도 예측이 시작되며 빠르게 결과를 확인할 수 있습니다.

# 6 분석 결과

## 6.1 예측 결과 확인

---

아래 그림은 Boltz가 예측한 아세틸콜린에스터레이스의 3차원 구조에 pDDT를 시각화 한 모습입니다. 전형적인 α-helix와 β-sheet 패턴이 잘 형성되어 있음을 확인할 수 있습니다.

![pLDDT의 시각화](/image/info/detail/boltz-2_5.webp){center:600}[pLDDT의 시각화]

## 6.2 pLDDT 점수 분포

---

모델 신뢰도를 나타내는 pLDDT 점수는 대부분 0.9 이상에 분포했습니다. 이는 전반적으로 높은 신뢰도의 구조 예측이 이루어졌음을 보여줍니다.

![pLDDT_Histogram](/image/info/detail/boltz-2_6.webp){center:600}[pLDDT_Histogram]

## 6.3 잔기별 pLDDT 분석

---

잔기 단위로 살펴본 결과, 거의 모든 구간에서 **High confidence(≥90)** 기준선을 상회했으며, 일부 loop 영역에서만 국소적으로 confidence가 낮게 나타났습니다. 이는 단백질 구조의 핵심 부분이 안정적으로 예측되었음을 의미합니다.

![pLDDT_per_residues](/image/info/detail/boltz-2_7.webp){center:600}[pLDDT_per_residues]

## 6.4 실험 구조와의 비교

---

예측 구조(초록색)와 결정 구조 7E3H(회색)를 중첩 비교한 결과, 두 구조가 거의 일치하는 것을 확인할 수 있습니다. RMSD 0.318 Å는 실험적 불확실성을 고려했을 때도 매우 우수한 수준입니다.

![RMSD = 0.318 (472 to 472 atoms)](/image/info/detail/boltz-2_8.webp){center:600}[RMSD = 0.318 (472 to 472 atoms)]

## 6.5 실험 구조와의 비교

---

E20 리간드(주황색)는 아세틸콜린에스터레이스의 활성 부위에 안정적으로 결합했습니다. 이는 기존 실험 구조(회색)와의 중첩에서도 잘 일치하며, Boltz가 단백질–리간드 상호작용까지 충실히 재현했음을 보여줍니다.

![Ligand align](/image/info/detail/boltz-2_9.webp){center:600}[Ligand align]

## 6.6 종합 평가

Boltz는 단백질 단독 구조와 단백질–리간드 복합체 모두에서 신뢰성 있는 결과를 제공하며, **신약 후보 발굴 초기 단계에서 활용할 수 있는 실용적 도구**임을 확인할 수 있었습니다.

# 7 마치며

---

Boltz는 단백질 단독 구조뿐 아니라 단백질–리간드 복합체까지 안정적으로 예측해 주는 꽤 믿음직한 모델이었습니다. pLDDT나 RMSD 같은 지표로 검증해 보니, 실제 실험 구조와도 잘 맞아떨어져서 신약 후보 발굴 같은 연구 과정에서 충분히 써볼 만한 도구라는 확신이 들었습니다.

또 하나 편리했던 점은, Boltz가 단순히 명령줄(CLI)에서만 쓸 수 있는 게 아니라는 거예요. CURIE에서 제공하는 **웹페이지 인터페이스**를 활용하면 별도 설치 없이 바로 실행할 수 있어서 훨씬 직관적이고 간단했습니다. 덕분에 연구 경험이 많지 않아도 누구나 쉽게 접근할 수 있고, 결과도 금방 확인할 수 있었어요. 실제 연구 워크플로우에 부담 없이 녹여 쓸 수 있다는 게 큰 장점이었습니다.

# 8 Reference

---

- [Github Boltz](https://github.com/jwohlwend/boltz)
- CURIE : [Boltz](https://curie.kr/Analysis/boltz), [Dilipred](https://curie.kr/Analysis/dilipred)

---

[tool-button:Boltz-2]