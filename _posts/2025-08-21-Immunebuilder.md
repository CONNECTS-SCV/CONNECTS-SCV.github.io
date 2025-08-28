---
layout: post
title: "Immunebuilder 항체 및 TCR 구조 예측 전용 모델"
description: >
    Immunebuilder는 항체(nanobody, antibody) 및 T 세포 수용체(TCR)의 서열을 기반으로 빠르고 정확하게 구조를 예측하는 딥러닝 모델입니다. CDR loop와 VH/VL pairing에 특화된 구조 예측을 지원합니다.
categories:
    - analysis
    - prediction
    - structure
tags: [Immunebuilder, 항체 구조 예측, TCR 예측, CDR loop, nanobody, antibody, immune modeling]
author: author
---

## 🔬 Immunebuilder란?

**Immunebuilder** 는 **항체(antibody, nanobody)** 와 **TCR(T cell receptor)** 구조를 예측하는 딥러닝 모델입니다.
기존 Alphafold2 아키텍처를 면역 단백질 서열에 맞추어 특화 학습시킨 **경량화 모델** 로, 특히 CDR loop의 구조 정확도와 추론 속도에서 뛰어난 성능을 보입니다.

> 참고: VH/VL, TCR αβ 등 체인 간 pairing 구조 예측도 지원합니다.

## 🧪 우리 플랫폼에서 어떻게 제공되나요?

우리 플랫폼에서는 **Immunebuilder를 직관적인 인터페이스로 제공합니다.**
FASTA 형식으로 입력된 항체 또는 TCR 서열을 기반으로 \*\*3D 구조(PDB)\*\*를 빠르게 예측할 수 있습니다.

구조 예측 옵션으로 **항체, nanobody, TCR 중 선택** 할 수 있으며, 각 영역의 특징에 맞춰 최적화된 모델이 사용됩니다.

## 📝 사용 방법 안내

### 1. 작업 이름 지정

* 예: `Immunebuilder_test1`

### 2. 입력 방식 선택

* 아미노산 서열 입력 (FASTA 형식, VH/VL 혹은 TCR α/β)

### 3. 파라미터 설정

| 옵션            | 설명                           |
| ------------- | ---------------------------- |
| Molecule type | Antibody, Nanobody, TCR 중 선택 |

### 4. 결과 확인

* 예측된 3D 구조 (PDB 포맷)

```plaintext
Job Name: Immunebuilder_test1
입력값 예시:
FASTA: >VH_chain\nEVQLVESGGGLV...
옵션: Molecule = Antibody
```

## 🧬 분석 결과 활용 예시

* **항체 설계 초기 단계**: CDR 변형 후보 구조 빠르게 확보
* **TCR 구조 모델링**: TCR 기반 면역 치료제 설계용 구조 예측
* **엔지니어링 전처리**: loop 구조 안정성 검토 후 downstream 분석 연계

## ⚠️ 주의사항

| 항목    | 내용                             |
| ----- | ------------------------------ |
| 입력 대상 | 항체(VH/VL), nanobody, TCR αβ 체인 |
| 예측 범위 | 단일체 구조 예측만 가능 (항원 포함 불가)       |
| 한계점   | 복합체 예측 불가. 항체-항원 도킹은 별도 수행 필요  |

## ✅ 마무리

**Immunebuilder는 항체 및 TCR 구조 예측을 빠르게 수행할 수 있는 면역 단백질 특화 모델**입니다.
Diffdock-PP, GROMACS, PRODIGY 등과 연계하여 **복합체 모델링과 결합력 평가**까지 확장 분석이 가능합니다.

> 지금 바로 <a href="#" onclick="window.open('https://curie.kr/Analysis/immunebuilder', '_blank'); return false;" rel="noopener noreferrer">Immunebuilder 분석 페이지</a>에서 직접 사용해보세요!
