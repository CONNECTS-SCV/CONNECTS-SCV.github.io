---
layout: post
title: "HemoPI2 : A Model for Predicting Peptide Hemolytic Toxicity"
description: "A computational model that predicts the hemolytic activity (RBC toxicity) of peptides from their sequences for early-stage drug safety evaluation."
categories: [analysis]
tags: [HemoPI2, Hemolytic Toxicity, Peptide, ESM2, Drug Discovery]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
HemoPI2 is a computational model that predicts the hemolytic activity (RBC toxicity) of peptides or proteins directly from their sequences. It performs both binary classification (hemolytic vs. non-hemolytic) and regression analysis to estimate the hemolytic concentration (HC₅₀, μM).
By identifying potential blood toxicity risks early, HemoPI2 is used in peptide drug discovery and safety evaluation pipelines.

---

## Mechanism
HemoPI2 integrates **sequence-based features**—including amino acid composition, motif patterns, and physicochemical properties—with **ESM2-t6 embeddings** (protein language model).
Motif detection is performed using **MERCI**, which identifies experimentally validated hemolytic motifs.

**Regression Task:**
  - Uses a **Random Forest Regressor (RFR)** to predict **HC₅₀ values**.
  - 
**Classification Task:**
  - Combines multiple classifiers to determine hemolytic probability:
    - **RF (Random Forest):** Traditional binary classifier using HC₅₀ > 100 μM as non-hemolytic.
    - **ESM2-t6:** Sequence embeddings processed through two hidden layers and a Sigmoid activation for probability output (best for long peptides).
    - **Hyb1 (RF + MERCI):** Balanced hybrid combining RF and motif-based scoring.
    - **Hyb2 (ESM2 + MERCI):** Best-performing hybrid model combining deep embeddings and motif scores.

The model was trained on ~1,900 experimentally validated mammalian RBC datasets, achieving an **AUROC of 0.921** using the hybrid (RF + MERCI) approach.

---

## Input, Output, Options

**Input**:
- Peptide sequence (FASTA format)

**Output**:
- **Hemolytic vs. Non-hemolytic classification**
- **HC₅₀ (μM)**: Predicted hemolytic concentration (lower = higher toxicity)

**Options**:
- **Task type:** Regression or Classification
- **Classifier selection:** RF, Hyb1 (RF+MERCI), Hyb2 (ESM+MERCI), ESM-t6
- **Protein scanning size:** Segment proteins into 8–20 fragments to scan local hemolytic risk regions

---

## Applications & Key Features
- Early-stage **toxicity screening** for peptide drug candidates.
- Identification of **high-risk motifs or regions** for sequence redesign or mutation.
- Provides **quantitative hemolysis metrics (HC₅₀)** in addition to binary classification.
- Combines **machine learning** with **motif-based biological insight** for higher interpretability.
- Enables region-specific toxicity analysis through **sliding-window scanning**.

---

## Comparable Models
- **ToxinPred3.0:** Offers broader peptide toxicity profiling, including hemolytic and non-hemolytic peptide screening—suitable for cross-validation with HemoPI2.

---

## Related Models
- Integrate **DILIpred** or **hERGAI** for multi-dimensional toxicity evaluation (hepatic and cardiac).
- Use **ADMET-AI** for full-spectrum safety profiling, combining in-silico predictions with experimental **RBC lysis assay** data for cross-validation.

---

[tool-button:HEMOPI2]
