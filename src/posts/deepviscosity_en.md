---
layout: post
title: "DeepViscosity : A Sequence-Based Binary Classifier for Antibody Viscosity Prediction"
description: "An AI model that predicts high or low viscosity of monoclonal antibody formulations from amino acid sequences, enabling early-stage formulation risk assessment."
categories: [analysis]
tags: [DeepViscosity, Antibody, Viscosity, DeepSP, ANN]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
DeepViscosity is an AI model that predicts whether a monoclonal antibody (mAb) formulation at high concentration will exhibit high or low viscosity, based solely on its amino acid sequence. It enables in silico screening of antibody candidates to assess formulation risks early in the development pipeline.

## Mechanism
DeepViscosity leverages the **DeepSP algorithm** to extract three key sequence-derived physicochemical features before classification:

1. **SAP (Spatial Aggregation Propensity):**
    - Influenced by hydrophobic residues such as Val, Ile, Leu, Phe, Trp, Tyr, and Met;
    - a higher SAP value indicates a higher **aggregation tendency**.
2. **SCM (Surface Charge Map)_pos:**
    - Affected by positively charged residues (Lys, Arg, His);
    - promotes **non-specific interactions** that can increase **aggregation** and **viscosity**.
3. **SCM (Surface Charge Map)_neg:**
    - Determined by negatively charged residues (Asp, Glu);
    - tends to **reduce** non-specific binding and lower viscosity risks.

These normalized values are combined into an **ensemble artificial neural network (ANN)**, which outputs the **mean and standard deviation** of predicted probabilities.
If the mean probability exceeds 0.5, the antibody is classified as **high-viscosity (>20 cP)**, if below **0.5**, it is classified as **low-viscosity (≤20 cP)**. The model was trained on experimentally measured viscosity data from **229 monoclonal antibodies**.

## Input, Output, Options

**Input**:
- Antibody sequences (heavy and light chains)

**Output**:
- Mean viscosity probability (classified as high-viscosity if >0.5)

**Configuration Parameters**:
- No user-defined parameters required

## Applications & Key Features
- Early-stage **screening of antibody candidates** to identify viscosity risks before formulation development
- Eliminate high-risk candidates prior to costly experimental optimization
- Predicts viscosity **without requiring 3D structural data**
- Uses **ensemble predictions** to improve confidence and robustness

## Comparable Models
- **NetSolP**: Predicts **protein solubility** in E. coli expression systems; useful for comparison, though less relevant for mammalian-expressed antibodies.
- **Protein-Sol**: Estimates **intrinsic protein stability**, helping assess whether solubility issues are **structural or formulation-dependent**.
- **AbDev**: Provides various **viscosity-related metrics** that can be used alongside DeepViscosity for validation.

## Related Models
- **Aggrescan3D**: Can be used in combination to analyze **aggregation-prone regions** contributing to high viscosity.
- **RFantibody**: After antibody sequence optimization or redesign, DeepViscosity can be applied to assess viscosity impact of the engineered variant.

---

[tool-button:DeepViscosity]