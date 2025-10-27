---
layout: post
title: "BioPhi : Integrated Platform for Antibody Humanization, Similarity Evaluation, and Sequence Design"
description: "A deep learning platform that evaluates antibody humanness and automates sequence-level humanization using large-scale repertoire data from OAS."
categories: [analysis]
tags: [BioPhi, Antibody, Humanization, Deep Learning, OAS, Humanness Score]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
comment_id: "biophi_main"
paired_post: "biophi"
---

## Overview
---
BioPhi is a deep learning–based platform designed to evaluate and optimize antibody humanization using large-scale antibody repertoire data from OAS (Observed Antibody Space). It estimates the degree of humanness for antibody sequences and automates sequence-level humanization through data-driven learning.

## Mechanism
---
BioPhi integrates two complementary modules for antibody humanization and humanness scoring:

1.  **Sapiens**
    - A **language model–based humanization engine** trained on massive antibody datasets.
    - Detects non-human residues in input sequences and replaces them with **human-like residues** using **masking and infilling reconstruction techniques**.
    - Mimics human antibody sequence patterns learned from OAS to restore natural human antibody features.
2.  **OAsis**
    - Decomposes the antibody sequence into **9-mer peptides**.
    - For each peptide, computes its **frequency of occurrence** in the **OAS human antibody repertoire**.
    - The resulting **humanness score** quantifies how closely the antibody resembles natural human antibodies.
    - Higher scores correlate with **lower immunogenicity risk** in clinical settings.

## Input, Output, Options
---

**Input**:
- Antibody amino acid sequence (FASTA format)

**Output**:
- Humanized antibody sequence
- Residue-level **humanness scores**

**Configuration Parameters**:
- (To be updated in future versions)

## Applications & Key Features
---

**Applications**:
- Used during antibody discovery or post-immunization stages to humanize candidate antibodies.

**Key Features**:
- BioPhi provides **fast**, **automated**, and **data-driven humanization**, surpassing traditional structure-based manual workflows.
- Automates processes equivalent to **CDR grafting** and **back-mutation**, guided by deep learning trained on large-scale antibody datasets.
- Includes a built-in **humanness evaluation module**, enabling direct verification of the humanization quality.

#### Traditional Humanization Strategies (for Comparison)
| Method | Description |
| :--- | :--- |
| **Chimeric antibody** | Replaces constant regions of mouse antibodies with human ones (used in first-generation drugs like Cetuximab, Rituximab). |
| **CDR grafting** | Grafts mouse CDRs onto human frameworks; back-mutation may restore affinity loss. |
| **Resurfacing** | Substitutes surface residues with human residues while keeping internal regions unchanged. |
| **SDR grafting** | Retains only structural determinant residues (SDRs) responsible for antigen binding. |

BioPhi effectively automates **CDR grafting** and **back-mutation** through a **deep learning–based**, **data-driven approach**.

## Comparable Models
---
**Humatch**: An alignment-based humanization tool suitable for cross-validation against BioPhi’s deep learning predictions.

## Related Models
---
- **MHCflurry**: Can be used post-humanization to predict **MHC-I binding** and **immunogenicity** risk.
- **HADDOCK** / **GROMACS**: Useful for confirming whether humanized antibodies **retain binding affinity** to their target antigens, using docking or PMF (Potential of Mean Force) calculations.

---

[tool-button:BioPhi]