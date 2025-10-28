---
layout: post
title: "NetsolP : A Model for Predicting Protein Solubility and Usability"
description: "A transformer-based model that predicts protein solubility and usability in E. coli from amino acid sequences, enabling large-scale screening of candidates."
categories: [analysis]
tags: [NetsolP, Protein Solubility, Transformer, ESM, Protein Expression]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
language: en
comment_id: "netsolp_main"
paired_post: "netsolp"
---

## Overview
---
NetsolP is a transformer-based model that predicts protein solubility and usability (expression and purification success) in E. coli using only amino acid sequences as input.

It enables large-scale, fast, and cost-effective screening of protein candidates prior to expression experiments.

## Mechanism
---
**ESM Embedding:**
  - Protein sequences are processed using **ESM**, a protein language model that treats amino acid sequences as contextual sentences to extract semantic features.

**Fine-Tuning:**
  - The model is fine-tuned on labeled datasets of E. coli expression and solubility, such as **PSI Biology** and **NESG**.

**Prediction Tasks:**
  - **Solubility:** Measures the extent to which expressed proteins remain soluble after expression.
  - **Usability:** Represents practical success likelihood, including expression level and purification feasibility.

To reduce bias, highly similar or identical sequences are partitioned to avoid redundancy during training.

## Input, Output, Options
---

**Input**:
- Amino acid sequence (FASTA format)

**Output**:
- **Solubility Prediction (0–1):** Closer to 1 indicates higher solubility.
- **Usability Prediction (0–1):** Closer to 1 indicates a higher chance of successful expression.
::note
These values represent prediction scores, not absolute quantitative measures.

For example, a score of 0.8 vs. 0.7 does not guarantee a proportionally higher solubility.

Thresholds should be chosen contextually by the researcher.
::/note

**Configuration Parameters**:
- **ESM1b:** Large model with highest accuracy.
- **ESM12:** Lightweight and faster; ideal for initial large-scale screening.
- **ESM1b-distilled:** Balanced between accuracy and speed.

## Applications & Key Features
---
- Primary filtering of protein libraries for candidates with high expression potential.
- High-throughput solubility screening for large sequence datasets.
- Predicts solubility directly from sequence embeddings without requiring MSA (Multiple Sequence Alignment).
- Fast inference and strong generalization performance.
- Does not provide residue-level hotspot mapping, which limits fine-grained solubility analysis.

## Comparable Models
---
- **CamSol:** Identifies residue-level solubility hotspots and aggregation-prone regions.
- **SoluProt:** Traditional solubility predictor for comparison with NetsolP’s transformer-based approach.

## Related Models
---
- **TemStaPro:** Can be used alongside NetsolP to explore the correlation between **thermal stability** and **solubility**.
- **Aggrescan3D:** Helps identify **aggregation hotspots** contributing to low solubility in protein structures.
---
[tool-button:NetSolP]
