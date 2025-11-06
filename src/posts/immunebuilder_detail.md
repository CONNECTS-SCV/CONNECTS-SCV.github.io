---
layout: post 
title: "Immunebuilder : 서열을 기반으로 예측된 항체의 구조와 결정구조의 비교"
description: "최신 항체 구조 예측 모델 ImmuneBuilder를 사용하여 Pembrolizumab 항체의 3차원 구조를 예측하고, 실제 PDB 결정 구조(5JXE)와 비교하여 그 정확도를 검증"
categories: [analysis] 
tags: [ImmuneBuilder, Antibody Modeling, Structural Biology, AlphaFold, Pembrolizumab, PDB, Bioinformatics, ANARCI] 
author: "author6" 
date: "2025-09-29" 
thumbnail: "/image/info/detail/immunebuilder_1.webp" 
comment_id: "immunebuilder_detail"
---

![image.png](/image/info/detail/immunebuilder_1.webp){center:800}

단백질 구조 예측의 세계는 AlphaFold 이후 눈부시게 발전하고 있습니다.

하지만 항체(Antibody)나 T세포 수용체(TCR)처럼 고도로 가변적인 면역 단백질은 여전히 예측이 쉽지 않지요. 이번 글에서는 Oxford Protein Informatics Group(Oxford-OPIG)에서 개발한 최신 오픈소스 도구 **ImmuneBuilder**를 소개합니다.

이 도구는 **서열(Sequence)** 정보만으로 항체의 **3차원 구조를 신속하게 예측**하며, 특히 **IgFold 기반 모델**을 통해 실제 **결정 구조(Crystal Structure)** 와 유사한 수준의 정확도를 보여줍니다.

이 튜토리얼에서는 ImmuneBuilder를 설치하고 예시 서열로부터 생성된 **예측 구조와 결정 구조를 직접 비교**해보며 항체 구조 예측의 전 과정을 따라가 보겠습니다.

# 1 사용된 도구

---

- **ImmuneBuilder** 항체/ TCR 구조 예측에 전문화된 alphafold 기반 모델
- **ANARCI** 항체의 Heavy chain과 Light chain 서열에서 CDR 구간을 찾아내고, 이를 일관된 표준 형식으로 정리해주는 도구
- **pdbfixer** PDBFixer는 단백질 구조 파일(PDB)을 전처리(preprocessing) 하는 데 사용되는 오픈소스 Python 도구

# 2 ImmuneBuilder 설치 튜토리얼

ImmuneBuilder는 **항체(Antibody)** 와 **T세포 수용체(TCR)** 의 구조를 **서열(Sequence)** 정보만으로 예측할 수 있는 딥러닝 기반 도구입니다. 다만, 모델 실행에는 여러 의존 패키지가 필요하므로 **순서대로 환경을 설정하는 것이 중요합니다.**

## 2.1 Conda 환경 생성

---

먼저 독립된 환경을 만들어 패키지 충돌을 방지합니다.

```bash
# 새로운 conda 환경 생성 (예: immune_env)
$ conda create -n immune_env python=3.10 -y
$ conda activate immune_env
```

## 2.2 PyTorch 설치

---

ImmuneBuilder는 **PyTorch** 기반으로 작동합니다. GPU를 사용할 경우 CUDA 버전에 맞게 설치하세요.

```bash
# PyTorch 설치 (CPU 전용)
$ pip install torch torchvision torchaudio

# GPU(CUDA) 사용 시 (예: CUDA 12.1)
$ pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

CUDA 버전은 `nvidia-smi` 명령으로 확인할 수 있습니다.

## 2.3 OpenMM & PDBFixer 설치

---

ImmuneBuilder는 예측된 구조를 정제(refinement)하기 위해 **OpenMM**(분자동역학 엔진)과 **PDBFixer**(전처리 도구)를 사용합니다.

```bash
# Conda-forge 채널에서 설치
$ conda install -c conda-forge openmm pdbfixer -y
```

PDBFixer는 누락된 원자나 잔기를 자동 보완해 주는 전처리 툴이며 `OpenMM`은 물리적 에너지 최소화를 통해 구조를 안정화시킵니다.

## 2.4 ANARCI 설치 (서열 정렬 및 번호 매기기)

---

ImmuneBuilder는 항체 서열을 정렬하고 IMGT 번호 체계로 매핑하기 위해 **ANARCI**를 사용합니다.

```bash
# Bioconda를 통해 ANARCI 설치
$ conda install -c bioconda anarci -y
```

ANARCI는 항체의 CDR 영역 등을 자동으로 구분하고 번호를 붙여줍니다.

## 2.5 ImmuneBuilder 설치

---

이제 모든 종속성이 준비되었습니다. 이제 PyPI를 통해 ImmuneBuilder를 설치합니다.

```bash
# ImmuneBuilder 설치
$ pip install ImmuneBuilder
```

설치가 완료되면, 다음 명령으로 정상 동작 여부를 확인할 수 있습니다.

```bash
$ python -m immunebuilder --help
```

이제 ImmuneBuilder를 사용할 준비가 끝났습니다. 다음 단계에서는 예시 항체 서열을 입력해

**예측된 구조(PDB)** 를 생성하고 **실제 결정 구조와 비교**해보겠습니다.

# 3 ImmuneBuilder 사용법 튜토리얼

ImmuneBuilder는 항체(Antibody), 나노바디(Nanobody), T세포 수용체(TCR)의 **서열(Sequence)** 만으로 고품질의 3차원 구조(PDB)를 예측할 수 있는 도구입니다. 파이썬 API를 통해 손쉽게 구조를 예측할 수 있으며, 명령줄에서도 바로 실행할 수 있습니다.

## 3.1 항체 구조 예측 (Antibody)

---

가장 대표적인 용례는 **항체의 중쇄(Heavy chain)** 와 **경쇄(Light chain)** 서열을 이용한 구조 예측입니다.

```python
from ImmuneBuilder import ABodyBuilder2

# 예측기 생성
predictor = ABodyBuilder2()

# 입력 서열 (H = Heavy chain, L = Light chain)
sequences = {
  'H': 'EVQLVESGGGVVQPGGSLRLSCAASGFTFNSYGMHWVRQAPGKGLEWVAFIRYDGGNKYYADSVKGRFTISRDNSKNTLYLQMKSLRAEDTAVYYCANLKDSRYSGSYYDYWGQGTLVTVS',
  'L': 'VIWMTQSPSSLSASVGDRVTITCQASQDIRFYLNWYQQKPGKAPKLLISDASNMETGVPSRFSGSGSGTDFTFTISSLQPEDIATYYCQQYDNLPFTFGPGTKVDFK'
}

# 구조 예측 수행
antibody = predictor.predict(sequences)

# 결과 저장
output_file = "my_antibody.pdb"
antibody.save(output_file)
```

예측이 완료되면 `my_antibody.pdb` 파일이 생성됩니다. 이 파일은 PyMOL, UCSF Chimera, VMD 등에서 시각화할 수 있습니다.

### 명령줄에서 실행하기

```bash
ABodyBuilder2 --fasta_file my_antibody.fasta -v
```

--help 옵션을 사용하면 세부 옵션을 확인할 수 있습니다.

```bash
ABodyBuilder2 --help
```

많은 구조를 한 번에 예측하려면 Python API를 사용하는 것이 효율적입니다. 모델이 한 번만 로드되므로 속도가 훨씬 빠릅니다.

## 3.2 나노바디 구조 예측 (Nanobody)

---

나노바디(VHH) 예측은 항체 예측과 거의 동일하며, **중쇄(H)** 서열만 입력하면 됩니다.

```python
from ImmuneBuilder import NanoBodyBuilder2

predictor = NanoBodyBuilder2()

sequence = {
  'H': 'QVQLVESGGGLVQPGESLRLSCAASGSIFGIYAVHWFRMAPGKEREFTAGFGSHGSTNYAASVKGRFTMSRDNAKNTTYLQMNSLKPADTAVYYCHALIKNELGFLDYWGPGTQVTVSS'
}

nanobody = predictor.predict(sequence)
nanobody.save("my_nanobody.pdb")
```

### 명령줄에서 실행하기

```bash
NanoBodyBuilder2 --fasta_file my_nanobody.fasta -v
```

### 3.3 TCR 구조 예측 (T-cell Receptor)

---

ImmuneBuilder는 **TCR (T-cell Receptor)** 구조도 지원합니다. 알파(A)와 베타(B) 사슬 서열을 각각 입력해야 합니다.

```python
from ImmuneBuilder import TCRBuilder2

predictor = TCRBuilder2()

sequences = {
  'A': 'AQSVTQLGSHVSVSEGALVLLRCNYSSSVPPYLFWYVQYPNQGLQLLLKYTSAATLVKGINGFEAEFKKSETSFHLTKPSAHMSDAAEYFCAVSEQDDKIIFGKGTRLHILP',
  'B': 'ADVTQTPRNRITKTGKRIMLECSQTKGHDRMYWYRQDPGLGLRLIYYSFDVKDINKGEISDGYSVSRQAQAKFSLSLESAIPNQTALYFCATSDESYGYTFGSGTRLTVV'
}

tcr = predictor.predict(sequences)
tcr.save("my_tcr.pdb")
```

### 주의

- 기본적으로 **TCRBuilder2+** 가중치를 사용합니다.
- 원래 가중치를 사용하려면 다음과 같이 지정할 수 있습니다:

```bash
TCRBuilder2 --fasta_file my_tcr.fasta --original_weights -v
```

## 3.4 FASTA 포맷 규칙

---

ImmuneBuilder는 FASTA 파일로도 입력을 받을 수 있습니다. 형식은 아래와 같습니다 👇

### 항체 예시

```text
>H
YOUR_HEAVY_CHAIN_SEQUENCE
>L
YOUR_LIGHT_CHAIN_SEQUENCE
```

### TCR 예시

```text
>A
YOUR_ALPHA_CHAIN_SEQUENCE
>B
YOUR_BETA_CHAIN_SEQUENCE
```

### 나노바디 예시

```text
>H
YOUR_SINGLE_HEAVY_CHAIN_SEQUENCE
```

# 4 데이터 선정

## 4.1 **Pembrolizumab (항체, Anti-PD1)**

---

![image.png](/image/info/detail/immunebuilder_2.webp){center:400}

- **유형:** 인간화 IgG4 단클론항체
- **목적:** PD-1 수용체를 표적으로 하여 T세포 활성 억제를 해제 (면역관문 차단 기전)
- **입력 데이터:**
  - **Light Chain (LC)**

      ```text
      EIVLTQSPATLSLSPGERATLSCRASKGVSTSGYSYLHWYQQKPGQAPRLLIYLASYLESGVPARFSGSGSGTDFTLTISSLEPEDFAVYYCQHSRDLPLTFGGGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC
      ```

  - **Heavy Chain (HC)**

      ```text
      QVQLVQSGVEVKKPGASVKVSCKASGYTFTNYYMYWVRQAPGQGLEWMGGINPSNGGTNFNEKFKNRVTLTTDSSTTTAYMELKSLQFDDTAVYYCARRDYRFDMGFDYWGQGTTVTVSSASTKGPSVFPLAPCSRSTSESTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTKTYTCNVDHKPSNTKVDKRV
      ```

- **특징:**
  - ImmuneBuilder의 **ABodyBuilder2**로 입력할 수 있는 전형적인 H/L 쌍 구조.
  - 결정 구조(5JXE)와 비교 시 **CDR-H3 루프 형상**, **VH–VL 인터페이스 정확도** 등을 평가 가능.
  - 실제 PDB 구조에서는 **PD-1 단백질과 복합체로 존재**.

## **4.2 PD-1 (Programmed Cell Death Protein 1)**

---

![image.png](/image/info/detail/immunebuilder_3.webp){center:400}

- **유형:** 면역관문 단백질 (T세포 표면 수용체)
- **서열:**

    ```text
    NPPTFSPALLVVTEGDNATFTCSFSNTSESFVLNWYRMSPSNQTDKLAAFPEDRSQPGQDSRFRVTQLPNGRDFHMSVVRARRNDSGTYLCGAISLAPKAQIKESLRAELRVTE
    ```

- **특징:**
  - Pembrolizumab의 표적 단백질로, 항체 예측 구조와의 **결합면(superposition)** 비교 시

    예측된 항체 구조가 실제 결합면의 orientation과 얼마나 일치하는지를 확인할 수 있음.

  - 결정 구조 5JXE에 포함된 **chain A** 또는 **chain E**로 매핑 가능.

## **4.3 PDB 5JXE (결정 구조)**

---

![image.png](/image/info/detail/immunebuilder_4.webp){center:500}

- **이름:** *Structure of human PD-1 bound to pembrolizumab*
- **분해능:** 2.9 Å
- **체인 구성:**
  - **PD-1:** Chain A
  - **Pembrolizumab Heavy Chain:** Chain B
  - **Pembrolizumab Light Chain:** Chain C
- **의의:**
  - Pembrolizumab-PD-1 복합체의 대표 구조로 AI 기반 예측 모델(ImmuneBuilder, IgFold 등)의 정확도 검증에 널리 사용됨.
  - ImmuneBuilder로 예측된 구조와의 **RMSD 비교, interface contact map 일치도**, **loop conformational fidelity** 등을 정량적으로 분석 가능.

## 4.4 데이터 선정 이유

---

- **임상적 중요성**: Pembrolizumab은 대표적인 항-PD-1 항체 치료제로, PD-1과의 상호작용이 고해상도 결정 구조(5JXE)로 밝혀져 있어 예측 모델 검증에 이상적입니다.
- **모델 검증 적합성**: ImmuneBuilder가 예측한 항체 구조를 5JXE와 비교해 RMSD, CDR-loop 정밀도, 결합면 일치도 등을 평가할 수 있습니다.
- **구조적 다양성 반영**: 중쇄·경쇄로 구성된 IgG4 항체와 단일 수용체인 PD-1의 복합체는, 항체 예측 모델의 결합 인터페이스 인식 성능을 검증하기에 적합한 시스템입니다.

# 5 예측하기

## 5.1 Linux CLI 이용

---

### 원본 서열 준비

`pembrolizumab_raw.fasta` 파일을 만들고 다음 내용을 저장하세요.

```text
>H
QVQLVQSGVEVKKPGASVKVSCKASGYTFTNYYMYWVRQAPGQGLEWMGGINPSNGGTNFNEKFKNRVTLTTDSSTTTAYMELKSLQFDDTAVYYCARRDYRFDMGFDYWGQGTTVTVSSASTKGPSVFPLAPCSRSTSESTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTKTYTCNVDHKPSNTKVDKRV
>L
EIVLTQSPATLSLSPGERATLSCRASKGVSTSGYSYLHWYQQKPGQAPRLLIYLASYLESGVPARFSGSGSGTDFTLTISSLEPEDFAVYYCQHSRDLPLTFGGGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC
```

이 FASTA는 전체 IgG4 서열(상수영역 포함)이므로, 바로 예측하지 않고 ANARCI로 VH/VL 트리밍을 먼저 수행합니다.

### ANARCI로 VH/VL 추출 (Python 스크립트)

`trim_with_anarci.py` 파일을 작성합니다.

```python
from anarci import run_anarci

def trim_variable_region(seq, scheme="imgt", organism="human"):
    res, mapping, _ = run_anarci(
        sequences=[("seq", seq)],
        scheme=scheme,
        assign_germline=True,
        restrict_species=organism
    )
    numbered = res[0][1][0][1]
    trimmed = "".join([aa for (_, (aa, _)) in numbered if aa != "-"])
    return trimmed

if __name__ == "__main__":
    # 원본 FASTA 읽기
    with open("pembrolizumab_raw.fasta") as f:
        lines = [l.strip() for l in f if l.strip()]
    H, L = "", ""
    current = None
    for l in lines:
        if l.startswith(">H"): current = "H"
        elif l.startswith(">L"): current = "L"
        else:
            if current == "H": H += l
            elif current == "L": L += l

    vh = trim_variable_region(H)
    vl = trim_variable_region(L)

    # 트리밍된 FASTA 저장
    with open("pembrolizumab_fv.fasta", "w") as f:
        f.write(">H\n" + vh + "\n>L\n" + vl + "\n")

    print("[OK] VH/VL 트리밍 완료 → pembrolizumab_fv.fasta 생성")
```

실행:

```bash
python trim_with_anarci.py
```

출력 예시:

```text
[OK] VH/VL 트리밍 완료 → pembrolizumab_fv.fasta 생성
```

### ImmuneBuilder로 예측 실행

```bash
ABodyBuilder2 --fasta_file pembrolizumab_fv.fasta -v
```

- `-fasta_file`: 입력 FASTA 파일 지정
- `v`: verbose 모드 (진행 로그 표시)

예측이 완료되면 같은 폴더에 `pembrolizumab_fv.pdb` 파일이 생성됩니다.

### 결과 확인

```bash
# PyMOL 실행
pymol pembrolizumab_fv.pdb
```

구조가 완전하지 않거나 루프가 꼬인 경우, PDBFixer로 한 번 정제하면 좋습니다:

```bash
python -m pdbfixer pembrolizumab_fv.pdb --add-atoms=heavy --output=pembrolizumab_fixed.pdb
```

## 5.2 CURIE 플랫폼 사용

---

앞서 CLI를 통한 실행 방법을 살펴봤다면, 이번에는 **CURIE**를 통해 더 쉽게 분석을 진행하는 방법을 소개하겠습니다.

먼저 해당 주소로 접속합니다.

```text
https://curieus.net/Analysis/immunebuilder
```

화면에는 **항체(Antibody)**, **나노바디(Nanobody)**, **T 세포 수용체(TCR)** 중 구조를 예측할 대상을 선택할 수 있는 메뉴가 준비되어 있습니다.

Antibody 탭에서는 두 개의 입력란이 제공됩니다:

- **Heavy Chain 서열 입력**: 항체의 중쇄(VH) 서열을 입력합니다.
- **Light Chain 서열 입력**: 항체의 경쇄(VL) 서열을 입력합니다.

입력란에는 직접 서열을 붙여넣을 수도 있고, 사전에 ANARCI로 트리밍된 VH/VL 서열을 입력하는 것을 권장합니다.

![image.png](/image/info/detail/immunebuilder_5.webp){center:880}

모든 서열을 입력한 뒤 하단의 **“분석 시작”** 버튼을 누르면, ImmuneBuilder가 입력된 서열로부터 항체의 **3차원 구조를 자동으로 예측** 니다.

예측이 완료되면 브라우저에서 결과를 다운로드하거나 시각화 도구(PyMOL, Chimera 등)에서 확인할 수 있는 **PDB 파일**이 생성됩니다.

# 6 분석 결과

## 6.1 ImmuneBuilder 예측 구조

---

![image.png](/image/info/detail/immunebuilder_6.webp){center:400}

## 6.2 Align

---

![image.png](/image/info/detail/immunebuilder_7.webp){center:500}

- **최종 RMSD = 0.279 Å (112 residues)**

  → 이는 매우 낮은 값으로, **ImmuneBuilder 예측 구조가 결정 구조와 거의 동일한 수준으로 일치함**을 의미합니다.

  (일반적으로 항체의 가변영역 예측에서 RMSD ≤ 1.0 Å 이면 “고정밀(high-accuracy)”로 평가)

- **Outlier 6 → 1개**

  → 초기에는 일부 루프나 말단에서 약간의 어긋남이 있었지만, 자동 보정 후 대부분 잘 맞았습니다.

  특히 **CDR-H3 루프**에서의 미세한 차이만 존재할 가능성이 높습니다.

- **시각적으로**
  - 회색/녹: 5JXE 결정 구조
  - 녹색/하늘색: ImmuneBuilder 예측 구조

    → 전체 β-시트 스캐폴드는 완전히 중첩되어 있으며, 루프 영역 일부만 미세하게 변위됨을 확인할 수 있습니다.


## 6.3 종합 평가

---

ImmuneBuilder가 예측한 Pembrolizumab 항체의 가변영역 구조는 실제 결정 구조(5JXE)와 **RMSD 0.28 Å 수준의 매우 높은 일치도**를 보였습니다. 이는 예측 모델이 CDR 루프의 방향성 및 프레임워크 정렬을 정확히 재현했음을 의미하며 실험적 결정 구조에 근접한 수준의 신뢰도를 가집니다.

# 7 마치며

---

단백질 구조 예측 기술은 AlphaFold 이후 눈부시게 발전했지만 항체(Antibody)나 TCR처럼 **서열 다양성과 루프 변동성이 큰 면역 단백질**은 여전히 예측이 쉽지 않은 영역이었습니다.

이번 실습에서는 Oxford Protein Informatics Group이 개발한 **ImmuneBuilder**를 활용해 이러한 한계를 어떻게 극복할 수 있는지를 직접 체험해 보았습니다. ImmuneBuilder는 단순히 구조를 빠르게 예측하는 데 그치지 않고 **항체의 가변영역(VH/VL)** 을 정교하게 복원하며 **결정 구조와 거의 동일한 수준의 정확도**를 보여줍니다.

특히 이번 예제에서 사용한 Pembrolizumab 항체는 결정 구조(5JXE)와의 비교 결과 **RMSD 0.28 Å** 로 정렬되어, 실험적으로 측정된 구조와 사실상 차이가 없는 수준임을 확인했습니다.

이를 통해 확인할 수 있듯이, ImmuneBuilder는 연구자가 **서열만으로도 신뢰도 높은 구조 모델링을 수행**할 수 있게 해주는 매우 강력한 오픈소스 도구입니다.

또한 **ANARCI**, **PDBFixer**, **OpenMM** 등과 함께 사용하면 서열 정제 → 구조 예측 → 에너지 최소화 → 실험 구조 검증까지 하나의 완전한 “항체 구조 분석 파이프라인”을 구축할 수 있습니다.

# 8 Reference

---

- [Github ImmuneBuilder](https://github.com/oxpig/ImmuneBuilder)
- [Nature](https://www.nature.com/articles/s42003-023-04927-7)
- [RCSB : 5JXE](https://www.rcsb.org/structure/5JXE)
- Curieus : [ImmuneBuilder](https://curieus.net/Analysis/immunebuilder)

---

[tool-button:Immunebuilder]
