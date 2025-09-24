---
layout: post
title: "Boltz-2 확률 기반 단백질 구조 생성 및 도킹 예측"
description: >
  Boltz-2는 단백질 서열로부터 3D 구조를 생성하고, 리간드 및 글라이칸과의 결합을 예측하는 확률 기반 도킹 모델입니다.
  구조 생성부터 결합 포즈, 친화도 예측까지 원스톱 분석을 지원합니다.
categories:
  - analysis
  - structure
  - docking
  - prediction
tags: [Boltz-2, diffusion, 단백질 도킹, 구조 생성, binding affinity, 단백질-리간드, 글라이칸]
author: author1
date: 2024-03-20
---

## 🔬 Boltz-2란?

**Boltz-2** 는 **단백질 서열을 기반으로 3D 구조를 생성** 하고, 해당 구조에 대해 **리간드 또는 글라이칸과의 결합 포즈 및 친화도까지 예측** 할 수 있는 **확률 기반 도킹 및 생성 모델** 입니다.  
AutoDock, Glide 같은 전통적인 스코어링 기반 도킹 방식과 달리, **확률 분포 기반의 샘플링 접근법** 을 사용합니다.

> Diffusion 기반의 generative 모델이 구조를 생성하고, 이를 기반으로 다양한 결합 후보와 친화도를 동시에 예측합니다.

---

## 🧪 우리 플랫폼에서 어떻게 제공되나요?

우리 플랫폼에서는 **Boltz-2를 통해 단백질-리간드 또는 단백질-글라이칸 복합체 예측을 간편하게 수행** 할 수 있습니다.  
입력 서열만으로 구조 생성, 도킹, 친화도 예측까지 한번에 완료됩니다.

| 옵션 | 설명 |
| --- | --- |
| Number of Samples | 생성할 복합체 수 (샘플링 수) |
| Sampling Steps | 정밀도 조절 (Diffusion step 수, 높을수록 정밀하나 느림) |

---

## 📝 사용 방법 안내

### 1. 작업 이름 지정
- 예시: `Boltz2_Generation_1`

### 2. 입력 방식 선택
- **단백질 서열**: `FASTA` 형식
- **리간드 또는 글라이칸**: `SMILES` 형식

### 3. 파라미터 설정
- 샘플 수 (`Number of Samples`)
- 디퓨전 단계 수 (`Sampling Steps`)

```plaintext
Job Name: Boltz2_Generation_1
입력값 예시:
  Protein: >sp|P12345|SAMPLE_PROTEIN
           MSEQNNTEMTFQIQRIYTKDISFEAPNAPHVFQ
  Ligand: C1=CC=CC=C1 (benzene)
  Number of Samples: 50
  Sampling Steps: 30
```

### 4. 결과 확인

* **3D 구조 (PDB)**
* **결합 후보 포즈들**
* **예측 점수**:
    * Binding affinity
    * Confidence score
    * Ranking 정보

---

## 🧬 분석 결과 활용 예시

Boltz-2는 다음과 같은 다양한 응용 분야에 활용됩니다:

* **표적 단백질–리간드 스크리닝**: 후보물질 다수 동시 탐색 가능
* **단백질–글라이칸 상호작용 분석**
* **가상 스크리닝 (virtual screening)**: 수천 후보물질 필터링
* **단백질 엔지니어링**: de novo 단백질–소분자 결합 설계
* **분자 동역학 기반 후속 분석**: 구조 안정성 및 결합 유지 여부 평가

---

## ⚠️ 주의사항

* 단백질 서열은 반드시 **FASTA 형식**, 리간드는 **SMILES 형식** 으로 입력해주세요.
* `Sampling Steps`가 많을수록 정밀한 예측이 가능하지만 **계산 시간이 늘어납니다.**
* 생성된 구조의 생물학적 의미는 **후속 검증(MD, PLIP 등)을 통해 확인** 해야 합니다.
* 복수 후보 구조가 생성되므로, **Ranking 및 confidence score를 참고** 하여 우선순위 선정이 필요합니다.

---

## 🔗 다른 도구와의 연계 분석

Boltz-2는 다양한 도구와 연계하여 다음과 같은 분석 파이프라인 구성이 가능합니다:

| 조합                       | 설명                        |
| ------------------------ | ------------------------- |
| ProteinMPNN → Boltz-2    | 제약 조건 기반 서열 생성 후 구조/도킹 예측 |
| RFdiffusion → Boltz-2    | 구조 생성 후 리간드 친화도 예측        |
| Boltz-2 → GROMACS        | 구조 안정성 확인을 위한 MD 시뮬레이션    |
| Boltz-2 → PLIP / PRODIGY | 상호작용 및 친화도 분석, 교차 검증      |

---

## ✅ 마무리

**Boltz-2는 단백질 구조 생성과 결합 예측을 동시에 수행할 수 있는 차세대 도킹 플랫폼** 입니다.
빠르고 유연하며, 다양한 생물학적 상호작용을 해석할 수 있는 **확률 기반 generative 모델의 장점을 극대화** 합니다.

> 지금 바로 [Boltz-2 분석 페이지](https://curie.kr:444/Analysis/boltz)에서 직접 사용해보세요!
