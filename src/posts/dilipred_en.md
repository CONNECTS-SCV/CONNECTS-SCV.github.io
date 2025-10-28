---
layout: post
title: "DILI : A Predictive Model for Early Detection of Drug-Induced Liver Injury"
description: "A predictive model to identify potential hepatotoxicity in drug candidates during the early stages of drug discovery, filtering high-risk compounds."
categories: [analysis]
tags: [DILI, Hepatotoxicity, Drug Discovery, Toxicity, AI]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
language: en
comment_id: "dilipred_main"
paired_post: "dilipred"
---

## Overview
---
DILI (Drug-Induced Liver Injury) Pred is a predictive model designed to identify potential hepatotoxicity caused by drug candidates. It is mainly used in the early stages of drug discovery to assess liver toxicity risk and filter out high-risk compounds before preclinical testing.

## Mechanism
---
This model transforms each compound (SMILES) into a **graph representation** and integrates various molecular and biological descriptors into a unified feature vector.
These features are trained via **supervised binary classification** to distinguish between **toxic and non-toxic compounds**.

**Feature types include**:
- **Physicochemical properties**
- **Molecular fingerprints**
- **In vitro / in vivo DILI-related indicators (9 types)**
- **Pharmacokinetic (PK) descriptors**

When a new compound is input, the trained model outputs **toxicity predictions** across multiple mechanisms and aggregates them into a final toxicity classification.

## Input, Output, Options
---

**Input**:
- Compound structure (SMILES format)

**Output**:
- Toxicity prediction results based on multiple biological assays
- Mechanistic explanation of contributing features

| Output Field | Description |
| :--- | :--- |
| **Source / Assay Type / Description** | Reference database or biological mechanism (e.g., Mitotox, Human Hepatox, Preclinical Hepatox) |
| **Value** | Probability of toxicity in the corresponding assay (higher = more toxic) |
| **Pred** | Binary toxicity classification (True = toxic, False = non-toxic) |
| **SHAP** | Contribution weights showing how each feature influenced toxicity prediction |

**Configuration Parameters**:
- No user-defined parameters required

## Applications & Key Features
---
- Early-stage **hepatotoxicity screening** for drug discovery pipelines
- Interpretable analysis to understand **structural causes of toxicity**
- Provides **explainable toxicity assessment**, not just a binary result
- Offers **assay-specific insights** that help interpret the biological mechanism behind toxicity

## Comparable Models
---
- **hERGAI**: Predicts **cardiotoxicity** related to hERG channel blocking
- **HemoPI2**: Predicts **hemolytic toxicity** (blood-related toxicity)
- **ADMET-AI**: Performs comprehensive **ADMET profiling** for small molecules

## Related Models
---
Combine **REINVENT4** with DILI to **optimize compounds** by reducing hepatotoxicity risk.
After molecular optimization, validate improvements using **DILI-Pred** to confirm decreased liver toxicity.

---

[tool-button:DiliPred]
