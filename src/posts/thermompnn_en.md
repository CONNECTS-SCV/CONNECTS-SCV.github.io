---
layout: post
title: "ThermoMPNN : Designing Protein Sequences for Thermal Stability"
description: "An MPNN-based model that predicts the change in thermodynamic stability (ΔΔG) from protein mutations, enabling the design of more thermally stable proteins."
categories: [analysis]
tags: [ThermoMPNN, Protein Stability, MPNN, GNN, ΔΔG]
author: "author6"
date: "2025-10-14"
thumbnail: "/image/default.webp"
language: en
---

## Overview
**ThermoMPNN** predicts the change in thermodynamic stability (ΔΔG) caused by specific protein mutations. It enables rapid evaluation and design of mutations that improve protein thermal stability.

## Mechanism
ThermoMPNN uses a **Message Passing Neural Network (MPNN)** – based Graph Neural Network (GNN) architecture. A protein’s 3D structure is represented as a graph where residues are nodes and structural relationships are edges. Through message passing, each residue’s structural and physicochemical context is embedded into a latent representation. By comparing the wild-type and mutant graphs, the model performs **ΔΔG regression** to estimate the stability change. It has been **pretrained on large-scale stability datasets**, such as Mega-scale.

## Input, Output, Options

**Input** :
- Protein structure (PDB format)

**Output**:
Predicted ΔΔG for each mutation (unit: kcal/mol), Visualization of stability changes
  - **ΔΔG > 0:** Mutation destabilizes the protein
  - **ΔΔG < 0:** Mutation stabilizes the protein

**Configuration Parameters**:
- Specify the **chain** where the mutation occurs.

## Applications & Key Features
- Design of mutation libraries to improve protein stability.
- Cross-validation of computational predictions with **thermal shift assays**
- Higher accuracy than sequence-based stability models.
- Supports **automated saturation mutagenesis**, making it suitable for practical protein engineering workflows.

## Comparable Models
- **TemStaPro:** Evaluates temperature-dependent stability using sequence data (non-structural approach).
- **Rosetta ddG:** Calculates ΔΔG based on energy functions derived from physical modeling.

## Related Models
- ThermoMPNN can be integrated with:
    - **Boltz-2** or **Chai** for structural modeling before stability prediction.
    - **TemStaPro** for cross-validation of results.
    - **ZipperDB** to identify structural hotspots for further modification and optimization.

---

[tool-button:ThermoMPNN]
