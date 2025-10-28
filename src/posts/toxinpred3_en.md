---
layout: post
title: "ToxinPred3.0 : A Transformer-Based Model for Rapid Prediction of Peptide Toxicity"
description: "A supervised AI model that predicts the potential toxicity of proteins and peptides based on their sequences, enabling quick identification of toxic candidates."
categories: [analysis]
tags: [ToxinPred3.0, Peptide Toxicity, Transformer, AI]
author: "author6"
date: "2025-09-29"
thumbnail: "/image/default.webp"
language: en
comment_id: "toxinpred3_main"
paired_post: "toxinpred3"
---

## Overview
---
ToxinPred3.0 is a supervised AI model that predicts the potential toxicity of proteins and peptides based on their sequences. It enables quick identification of toxic and non-toxic peptides.

## Mechanism
---
The model is trained on datasets of toxic and non-toxic peptides. It extracts global features (amino acid composition, physicochemical properties) and local features (toxic motifs) from each sequence.

Three prediction modes are available:
- **ML mode:** Uses global sequence patterns.
- **MERCI mode:** Focuses on local motif patterns.
- **Hybrid mode:** Combines both for higher accuracy.

Each sequence receives a **toxicity probability score** and a **final classification**.

## Input, Output, Options
---

**Input** :
- Peptide sequence (FASTA format)

**Output**:
Comprehensive toxicity-related metrics
- **ML score:** Probability of being toxic (closer to 1 = more likely toxic)
- **MERCI pos/neg scores:** Similarity to toxic and non-toxic motifs
- **Hybrid score:** Combined ML and MERCI result
- **Prediction:** Final classification (≥0.5 = toxic)
- **PPV:** Probability that a positive result is truly toxic
- A higher score indicates a higher likelihood of toxicity, not a stronger toxicity level.

**Configuration Parameters**:
- **ML:** Fast, global pattern–based, less precise
- **MERCI:** Local motif–based
- **Hybrid:** Global + local patterns, most accurate but slower
- **Region Importance:** Highlights toxic regions in the sequence

## Applications & Key Features
---
- Toxicity assessment of peptide vaccines and therapeutic peptides.
- Also applicable to protein-based foods and nano-biomaterial safety evaluation.

## Comparable Models
---
- **StrucToxNet:** Uses 3D structural data for higher accuracy
- **tAMPER, HEMOPI2:** Provide quantitative toxicity scores rather than simple classification. HEMOPI2 focuses on hemotoxicity prediction

## Related Models
---
ToxinPred3.0 can be combined with:
- **ThermoMPNN** for designing stable, low-toxicity peptide variants
- **Other toxicity modules:**
  - DILI (liver toxicity)
  - hERG-prediction (cardiac toxicity)
  - NeuTox (neurotoxicity)
  - Amesformer (genotoxicity)
  - mhcflurry / DeepNeo (immunotoxicity)

---

[tool-button:ToxinPred3]
