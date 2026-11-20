---
title: Bihar Digital Health Applications
short: Bihar digital health
summary: Apps for a statewide public-health programme in Bihar that reached 5,000 frontline health workers, including Sanjivan, the state's COVID-19 app.
org: CARE India — Bihar Technical Support Program
period: 2019 – 2021
role: Manager, Systems
order: 4
domain: Public-sector digital health
status: delivered
stack: [Android, Kotlin, Aadhaar authentication, Real-time reporting]
facts:
  - { value: "5,000", label: "frontline health workers reached by the programme" }
keywords: [government digital health, public health technology, Android apps, COVID-19 app]
diagram:
  caption: Field apps for health workers and a citizen app, built with the state's Health and ICDS departments.
  nodes:
    - { id: fw, label: "Frontline health workers", x: 110, y: 150, kind: actor }
    - { id: cit, label: "Citizens", x: 110, y: 380, kind: actor }
    - { id: raft, label: "RAFT: facility reporting", x: 410, y: 90, kind: surface }
    - { id: aims, label: "AIMS: worker registry (Aadhaar)", x: 410, y: 200, kind: surface }
    - { id: bed, label: "Newborn-care bed tracking", x: 410, y: 300, kind: surface }
    - { id: san, label: "Sanjivan COVID-19 app", x: 410, y: 410, kind: surface }
    - { id: dept, label: "State Health & ICDS departments", x: 790, y: 250, kind: process }
  edges:
    - [fw, raft]
    - [fw, aims]
    - [fw, bed]
    - [cit, san, "test centres, hospitals, free beds"]
    - [raft, dept]
    - [aims, dept]
    - [bed, dept]
    - [san, dept]
---

## Overview

At CARE India I ran systems for the Bihar Technical Support Program, a statewide public-health programme that reached 5,000 frontline health workers. I worked closely with the Government of Bihar's Health and ICDS departments.

## The problem

A programme at that scale depends on timely information from the field: which facilities are working, which health workers are active, where newborn-care beds are free. During COVID-19, citizens also needed to find test centres, hospitals and free beds quickly.

## The technical challenge

- Apps that work for health workers in the field, at state scale.
- Verified identities for a large workforce.
- Information that reaches the state departments in time to act.

## Architecture and solution

- **RAFT:** real-time facility reporting from the field.
- **AIMS:** a health-worker registry with Aadhaar authentication.
- **Newborn-care bed tracking** for facilities.
- **Sanjivan:** Bihar's COVID-19 app, which showed citizens nearby test centres, hospitals and free beds, in several languages.

## My role

Manager, Systems. I ran the programme's systems and led the team that built Sanjivan.
