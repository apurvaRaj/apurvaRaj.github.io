---
title: Blockchain-based Electronic Health Records
short: Blockchain health records
summary: Academic work at IIT Patna on blockchain health records with Ethereum and IPFS, alongside a capstone on drug supply-chain traceability with Hyperledger Fabric.
org: IIT Patna — Executive MTech, Blockchain & Big Data
period: 2023 – 2025
role: Designer and developer
order: 3
domain: Digital health & Web3
status: academic
stack: [Ethereum, Solidity, IPFS, Hyperledger Fabric]
keywords: [blockchain developer, Hyperledger Fabric developer, Ethereum, IPFS, healthcare blockchain]
diagram:
  caption: Records live off-chain; the chain keeps the trail of who added and who may read them.
  nodes:
    - { id: pat, label: "Patient", x: 110, y: 150, kind: actor }
    - { id: doc, label: "Clinician", x: 110, y: 370, kind: actor }
    - { id: app, label: "Records app", x: 340, y: 260, kind: surface }
    - { id: sc, label: "Smart contracts (Ethereum)", x: 600, y: 160, kind: ledger }
    - { id: ipfs, label: "Record files (IPFS)", x: 600, y: 370, kind: store }
  edges:
    - [pat, app]
    - [doc, app]
    - [app, sc, "record references"]
    - [app, ipfs, "files"]
---

## Overview

Two pieces of work from my Executive MTech in Blockchain & Big Data at IIT Patna (2023–2025):

- **Blockchain health records**, built with Ethereum and IPFS.
- **Capstone: drug supply-chain traceability**, built with Hyperledger Fabric.

## The problem

Health records are scattered across providers, and patients have little visibility into who holds or reads their data. In pharmaceutical supply chains, the path a drug takes from manufacturer to patient is hard to verify.

## Architecture and solution

- **Health records:** record files are stored on **IPFS**, and **Ethereum** smart contracts keep the references and the trail around them, so the record is tamper-evident without putting medical files on-chain.
- **Supply-chain traceability:** a permissioned **Hyperledger Fabric** network records each hand-off of a drug between participants.

## My role

Designed and built both as part of the programme.

## Why it matters to my work

Both projects apply the same idea as the insurance platform I worked on at ChainThat: many parties, one record that none of them can quietly change.
