---
layout: post
title: "MHCflurry : Predicting MHC Class I–Peptide Binding and Immunogenicity"
description: "A deep learning model that predicts binding affinity and immunogenicity between MHC class I molecules and peptides for use in immunotherapy and vaccine development."
categories: [analysis]
tags: [MHCflurry, MHC, Immunogenicity, Deep Learning, Neoantigen]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
MHCflurry is a deep learning model that predicts binding affinity and immunogenicity between MHC class I molecules and peptides.

It is primarily used for neoantigen prediction in cancer immunotherapy and vaccine candidate evaluation based on peptide–MHC interactions.

## Mechanism
**Training Data:**
  - MHCflurry is trained on large-scale experimental datasets such as the **Immune Epitope Database (IEDB)**, which contain MHC–peptide binding measurements.

**Model Architecture:**
  - Peptide sequences are one-hot encoded and processed through a **multi-layer perceptron (MLP)** regression network.
  - Distinct parameter sets can be applied for each **MHC allele type**, allowing allele-specific prediction.

**Prediction:**
  - Using the trained weights, MHCflurry estimates the **binding affinity (IC50)** and presentation probability of newly input peptide sequences.

## Input, Output, Options

**Input**:
- Peptide sequence (FASTA format)

**Output**:
- **Affinity (IC50):** Predicted dissociation constant, lower values indicate stronger binding.
- **Best allele:** The MHC allele predicted to bind most strongly.
- **Affinity percentile:** Ranking of predicted binding strength (lower = stronger binder).
- **Processing score:** Likelihood of peptide processing (degradation, TAP transport, etc.).
- **Presentation score:** Combined probability of surface presentation (binding + processing).
- **Presentation percentile:** Ranking of presentation likelihood (lower = stronger candidate).

**Configuration Parameters**:
- Specify MHC allele types of interest for focused prediction.

## Applications & Key Features
- Screening **vaccine candidate peptides** from pathogens or tumor-derived neoantigens.
- Predicting potential **immunogenicity** risks of therapeutic proteins.
- Supporting **personalized cancer immunotherapy** and **vaccine development**.
- Integrates both **binding affinity** and **presentation efficiency** to provide a holistic immunogenicity prediction.
- Supports **allele-specific analysis** for precise peptide–MHC matching.

## Comparable Models
- **NetMHCIIpan:** Specializes in **MHC class II–peptide binding prediction**.
- Free for academic use but requires a license for commercial applications.

## Related Models
- **TCRmodel2:** Predicts **pMHC–TCR complex structures** for deeper structural analysis.
- **RFdiffusion:** Enables structural design of TCR-binding interfaces constrained by predicted pMHC complexes.
- **ProteinMPNN:** Optimizes **TCR sequences** to match designed structures.
- **ImmuneBuilder (TCR version):** Reconstructs final **TCR 3D structures** from optimized sequences.

---

[tool-button:MHCflurry]
