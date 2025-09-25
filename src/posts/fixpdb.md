---
title: "FixPDB: 단백질 구조 정리 자동화 도구"
author: author1
date: 2024-12-20
categories: [analysis, structure, preprocessing]
tags: [FixPDB, 구조정리, PDB정제, side-chain수정, 분자시뮬레이션전처리, clash제거]
description: "FixPDB는 단백질 구조(PDB 파일)를 자동으로 정리하고 안정화하는 구조 정제 도구입니다."
slug: fixpdb-structure-cleaning-tool
---

## 목적

실험 구조나 예측 모델의 PDB 파일을 후속 계산/시뮬레이션에 적합한 형태로 자동 정제

## 작동 원리

- Clash 제거 및 기하학 오류 교정
- 누락된 수소 원자 자동 추가
- Side-chain 회전 및 거리/각도 보정
- 경미한 에너지 최소화 수행

## 용도

- **ΔΔG 계산 준비**: FoldX, DeepDDG 등으로 안정성 예측
- **Docking/MD 전처리**: AutoDock, GROMACS에 안정화 구조 제공
- **AlphaFold 구조 보정**: Predicted 구조의 clash 제거 및 geometry 정비
- **대규모 구조 정리**: 단백질 데이터셋 정합성 확보용 batch 처리

## 차별 포인트

- 단일 업로드만으로 자동 실행
- 복합체, 단백질-리간드, DNA/RNA 포함 구조에도 범용 적용
- Downstream 분석 도구와 바로 연계 가능

## 비교해 볼 만한 모델

- **PDBFixer**: OpenMM 기반 구조 정제
- **MolProbity**: 구조 검증 도구
- **Modeller**: 구조 보정 및 loop modeling

## 연계해 볼 만한 모델

- **FoldX**: 정제된 구조로 안정성 예측
- **GROMACS**: MD 시뮬레이션 직접 연계
- **Boltz-2**: 정제된 구조로 도킹 수행
- **PLIP**: 상호작용 분석

## 사용 방법

### 입력
* **원본 구조** (PDB 형식)

### 출력
* 정제된 PDB 파일 (*_fixed.pdb)

### 설정 옵션
* 별도 설정 없음 (자동 최적화)

### 수정 내용
* 수소 추가
* Side-chain 회전 보정
* 거리/각도 최적화
* 경미한 에너지 최소화

### 사용 링크
* <a href="#" onclick="window.open('https://curie.kr:444/Analysis/fixpdb?from=blog', '_blank'); return false;">FixPDB 사용하러 가기</a>