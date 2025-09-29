---
layout: post
title: "RDKit : 화합물을 다루기 위한 통합 라이브러리"
description: "화합물 데이터 처리, SMARTS 패턴 탐색, descriptor 계산, 3D 구조 생성 등 소분자(small molecule)를 다루기 위한 오픈소스 라이브러리입니다."
categories: [분석 모델]
tags: [RDKit, 화학 정보학, Cheminformatics, SMILES, 분자 모델링]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
---
## 개요
RDKit은 소분자(small molecule) 를 다루기 위한 라이브러리 입니다. 화합물 데이터의 읽기/쓰기/변환, SMARTS 패턴 탐색, descriptor 계산, 3D 좌표 생성 등 화합물에 대한 모든 기능을 지원합니다. 도킹 전처리나 QSAR/QSPR에도 활용할 수 있습니다.

## 작동 원리
- 분자 안에 있는 특정 패턴 (SMARTS)을 탐색할 수 있습니다.
- UFF, MMFF 같은 forcefield를 사용하여 화합물의 3D 좌표를 생성하고 에너지를 최소화할 수 있습니다.
- Morgan fingerprint : 분자를 벡터로 압축하여 유사도 계산, ML 입력으로 사용할 준비를 할 수 있습니다.
- LogP, MW, TPSA, HBA/HBD 등 화합물 구조에 대한 다양한 descriptor를 정리하여 제공합니다.

## 입력・출력・설정 옵션

**입력** :
- 화합물 정보 (SMILES, SDF, Mil2, PDB 포맷)

**출력** :
- 화합물 2D/3D구조 (이미지, 좌표)
- 분자 유사도 점수, SMARTS 패턴
- descriptor 값

**설정 옵션** :
- 탐색하고자 하는 SMARTS 패턴 서열
- SMARTS를 포함한 코어 골격 정의
- R-그룹 조각 지정

## 용도・차별 포인트

**용도** :
- 화합물 포맷 변환 (SMILES/SDF/PDB)에 사용할 수 있습니다.
- 대규모 화합물 라이브러리를 관리하고, 스크리닝할 때 활용 가능합니다.
- 유사 화합물을 찾는 가상 스크리닝에 활용할 수 있습니다.
- QSAR/ASPR, LogP 같은 descriptor를 계산하여 제공하기 때문에 인공지능 학습에 활용하기 좋습니다.
- 2D 화합물에 대하여 3D 좌표를 찍어주기 때문에 도킹을 포함한 분자 동역학 시험에 활용하기 좋습니다.

**차별 포인트** :
- RDKit은 패턴 탐색이나, 유사도 계산, 분자 표현 생성, 시각화까지 제공하는 풀 스택 화합물 툴킷입니다.

## 비교해 볼만한 모델
- 만약 화합물 포맷 변환에 부족한 부분이 있다면 Openbabel이라는 오픈소스를 활용해볼만 합니다.
- CDK와 같은 Java 기반의 화합물 라이브러리도 존재합니다.

## 연계해 볼 만한 모델

- RDkit에서 얻은 descriptor 정보를 바탕으로 solubility, binding affinity, toxicity등을 예측할 수 있는 모듈을 만들어 볼 수 있습니다.
- RDkit을 통해 얻은 3D 좌표는 Chai나 Diffdock과 같이 3D를 기반으로 분자 도킹을 지원하는 모델에 유용합니다.

---

[tool-button:RDKit]