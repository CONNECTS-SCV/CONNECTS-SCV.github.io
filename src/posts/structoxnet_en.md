---
layout: post
title: "StrucToxNet : Predicting Peptide Toxicity Using 3D Structural Information"
description: "A binary classification model that predicts peptide toxicity by integrating both sequence (ProtT5) and 3D structural (ESMFold/EGNN) features."
categories: [analysis]
tags: [StrucToxNet, Peptide Toxicity, 3D Structure, ProtT5, ESMFold, EGNN]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
**StrucToxNet** is a binary classification model that predicts peptide toxicity based on 3D structural information. By integrating both sequence and structural features, it determines whether a peptide is toxic or non-toxic. It demonstrates higher accuracy than 1D sequence-based models, especially for short peptides.

## Mechanism
For each input peptide sequence, **ProtT5** is used to extract sequence embeddings. The 3D structure predicted by **ESMFold** is converted into a graph representation and processed by a **Graph Neural Network (GNN)** to capture geometric relationships. Sequence and structure embeddings are then merged into a unified vector representation. The model is trained on public peptide datasets labeled for toxicity and non-toxicity.

## Input, Output, Options

**Input**:
- Peptide sequence (FASTA format)

**Output**:
- Comprehensive toxicity-related metrics
- Binary classification result (toxic / non-toxic)
- Model confidence score (%)

**Configuration Parameters**:
- None

## Applications & Key Features
- Large-scale toxicity screening in early peptide drug development
- Incorporates **3D spatial interactions** that 1D models cannot capture, resulting in higher prediction accuracy
- Especially effective for short peptides (>20 amino acids)
- Demonstrated improved performance on structures with **pLDDT > 60**

## Comparable Models
- **ToxinPred3.0:** A representative 1D sequence-based peptide toxicity predictor.
    - It offers faster inference but lower accuracy.
    - A practical workflow is to perform rapid screening with ToxinPred3.0 and follow up with StrucToxNet for more accurate validation.

## Related Models
- Can be combined with **Bolts-2** or other structure prediction models that yield higher pLDDT scores to improve prediction accuracy.
- Can also be integrated with sequence redesign modules to generate **less toxic peptide variants** based on predicted results.

---

[tool-button:StrucToxNet]
