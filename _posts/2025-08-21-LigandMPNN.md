---
layout: post
title: "LigandMPNN 단백질-리간드 결합 최적화 도구"
description: >
    LigandMPNN은 단백질이 특정 리간드에 더 잘 결합할 수 있도록 결합 부위의 서열을 최적화하는 MPNN 기반 모델입니다. 단백질과 리간드를 그래프로 변환하여 상호작용을 고려한 서열 설계를 수행합니다.
categories:
    - analysis
    - structure
    - prediction
tags: [LigandMPNN, 단백질 설계, 리간드 최적화, 단백질-리간드, MPNN, 단백질 구조 예측, 단백질 공학, 약물 디자인]
author: author
---

## 🔬 LigandMPNN이란?

**LigandMPNN**은 단백질이 특정 **리간드**(소분자, 금속 이온 등)에 더 잘 결합할 수 있도록, 결합 부위의 **아미노산 서열을 최적화**해주는 머신러닝 기반 도구입니다.
**MPNN(Message Passing Neural Network)** 구조를 기반으로 하며, 단백질–리간드 복합체의 상호작용을 그래프 구조로 학습합니다.

> 참고: LigandMPNN은 **ProteinMPNN**을 기반으로 확장된 모델로, 리간드와의 결합력을 고려한 설계를 수행합니다.

## 🧪 우리 플랫폼에서 어떻게 제공되나요?

우리 플랫폼에서는 **LigandMPNN을 직관적인 UI로 제공합니다.**
복잡한 파라미터 설정 없이, \*\*복합체 구조 파일(PDB)\*\*만으로 손쉽게 **결합 부위 최적화 서열**을 얻을 수 있습니다.

* Boltz나 Chai를 활용해 복합체 구조 생성 가능
* 파라미터 설정 없이도 기본 최적화 수행 가능

## 📝 사용 방법 안내

### 1. 작업 이름 지정

분석 작업의 이름을 자유롭게 지정합니다.

```plaintext
Job Name: LigandMPNN_analysis1
```

### 2. 입력 방식 선택

복합체 구조 파일(PDB 형식)을 업로드합니다.
단백질과 리간드를 Boltz 또는 Chai를 통해 결합시켜 복합체 구조를 생성하세요.

### 3. 파라미터 설정

| 옵션                         | 설명                       |
| -------------------------- | ------------------------ |
| Pack side chains 재설정 강도    | 1–10 범위, 값이 클수록 광범위한 재설정 |
| Number of Packs per Design | 생성할 후보 서열 수 설정           |
| Fixed residues             | 고정할 잔기를 직접 지정            |

```plaintext
입력값 예시:
pack_strength:5
designs:10
fixed_residues: A45,A78,B12
```

### 4. 결과 확인

* 최적화된 후보 단백질 서열
* 각 서열에 대한 결합 점수 (score)

## 🧬 분석 결과 활용 예시

LigandMPNN은 다음과 같은 다양한 생명과학 및 약물개발 분야에 활용됩니다:

* **효소 공학**: 효소–cofactor 결합 친화도 최적화
* **약물 개발**: 약물 후보와 결합하는 단백질 서열 설계
* **리간드 특이적 단백질 디자인**: ATP, NADH, 금속 이온 등과의 상호작용 최적화

## ⚠️ 주의사항

* **입력 파일은 단백질–리간드 복합체 구조여야 합니다.** (단일 단백질 구조 불가)
* 고정 잔기를 지정하려면 **구조 내 체인과 잔기 번호**를 명확히 알아야 합니다.
* 분석 결과는 **Alphafold2 등의 구조 예측 도구로 검증**하는 것이 좋습니다.

## 🔗 관련 도구 및 연계 분석

| 연계 도구       | 설명                           |
| ----------- | ---------------------------- |
| Boltz/Chai  | 단백질+리간드로 복합체 생성              |
| RFdiffusion | rough 설계 후 LigandMPNN으로 미세조정 |
| Alphafold2  | 최적화된 서열로 구조 예측               |
| Diffdock    | 리간드 pose 탐색 후 서열 최적화         |
| Autodock    | 서열 변경 전후 docking score 비교    |

## 🔄 관련 모델과 비교

* **ADFLIP**: 고정된 서열에서 conformation을 최적화
* **Diffdock**: 단백질 고정, 리간드 위치(docking pose) 최적화
* **Antifold**: 항체–리간드 상호작용 특화 모델

> LigandMPNN은 **서열 자체를 설계**한다는 점에서 다른 모델들과 차별화됩니다.

## ✅ 마무리

LigandMPNN은 단백질–리간드 상호작용을 최적화하는 강력한 도구입니다.
단백질 공학, 약물 개발, 기능성 단백질 설계 등 다양한 분야에 활용 가능합니다.

> 지금 바로 <a href="#" onclick="window.open('https://scv.bio/Analysis/LigandMPNN', '_blank'); return false;" rel="noopener noreferrer">LigandMPNN 분석 페이지</a>에서 직접 사용해보세요!
