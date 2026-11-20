---
title: BMNP — Blockchain Insurance Platform for Berkshire Hathaway
short: Blockchain insurance (BMNP)
summary: A blockchain insurance platform on R3 Corda that gives insurers one shared record for multinational programmes in more than 130 countries.
org: ChainThat Limited
period: 2021 – 2025
role: Senior Developer, Blockchain → Product Technical Lead
order: 2
domain: Insurance & enterprise blockchain
status: delivered
stack: [R3 Corda, Java, Microservices, REST APIs, React, Access control]
facts:
  - { value: "130+", label: "countries covered by the shared programme record" }
keywords: [enterprise blockchain developer, R3 Corda, insurance technology, blockchain architect]
diagram:
  caption: Insurers in each country work from one shared, permissioned record instead of copies.
  nodes:
    - { id: lead, label: "Lead insurer", x: 110, y: 140, kind: actor }
    - { id: local, label: "Local insurers, 130+ countries", x: 110, y: 380, kind: actor }
    - { id: ui, label: "React interfaces", x: 300, y: 260, kind: surface }
    - { id: api, label: "Secure APIs & access control", x: 535, y: 260, kind: process }
    - { id: ledger, label: "Shared programme record (Corda)", x: 855, y: 260, kind: ledger }
  edges:
    - [lead, ui]
    - [local, ui]
    - [ui, api]
    - [api, ledger, "permissioned writes"]
---

## Overview

BMNP is a blockchain insurance platform built on R3 Corda for Berkshire Hathaway. It gives insurers one shared record for multinational insurance programmes in more than 130 countries.

## The problem

A multinational programme involves a lead insurer and local insurers in many countries. Each kept its own copy of the programme, and at every renewal the same data was keyed in again. Copies drifted, and reconciling them took time.

## The technical challenge

- Many independent companies need to share one record without any one of them owning it.
- Each participant should see and change only what it is entitled to.
- The platform had to fit different cloud environments across participants.

## Architecture and solution

- A permissioned ledger on **R3 Corda** holds the programme record that all participants share.
- **Secure APIs and access control** sit in front of the ledger, on a **cloud-agnostic microservices** architecture.
- **React interfaces** give insurers a working view of their programmes.
- Because the record is shared, renewal no longer needs manual re-entry of data.

## My role

I joined as Senior Developer, Blockchain in 2021 and helped build the platform. In 2024 I was promoted to Product Technical Lead, owning technical delivery, architecture decisions and coordination with product and business teams.

## Recognition

Won the company's "Code Ninja" and "Amazing Addition" awards.
