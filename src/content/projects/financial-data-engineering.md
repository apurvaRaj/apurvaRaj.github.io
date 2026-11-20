---
title: Financial Data Engineering and Analytics
short: Financial data engineering
summary: Python data pipelines, cross-source company matching, index history and interactive analytics behind FidelFolio's research.
org: FidelFolio Investments
period: 2025 – present
role: Architect and hands-on engineer
order: 7
domain: Data engineering
status: live
stack: [Python, pandas, SQLAlchemy, MySQL, rapidfuzz, Plotly, matplotlib]
facts:
  - { value: "~147", label: "NSE index histories maintained" }
  - { value: "30+ yrs", label: "of company prices and fundamentals" }
keywords: [financial data engineering, Python data pipelines, pandas, market data, analytics]
diagram:
  caption: From raw vendor files to analysis-ready tables and interactive charts.
  nodes:
    - { id: v1, label: "Market data vendors", x: 100, y: 160, kind: source }
    - { id: idx, label: "Index files", x: 100, y: 370, kind: source }
    - { id: match, label: "Company matching (fuzzy)", x: 340, y: 160, kind: process }
    - { id: fill, label: "Gap fill & name mapping", x: 340, y: 370, kind: process }
    - { id: db, label: "Analysis-ready tables", x: 600, y: 260, kind: store }
    - { id: viz, label: "Interactive analytics", x: 860, y: 260, kind: surface }
  edges:
    - [v1, match]
    - [idx, fill]
    - [match, db]
    - [fill, db]
    - [db, viz]
---

## Overview

The data engineering underneath FidelFolio's research: pipelines that load and clean market data, keep it consistent over time, and turn it into analysis people can explore.

## The problem

Market data is messy. Company names differ between data providers, index names change over the years, and trading holidays leave gaps. Research built on inconsistent data gives inconsistent answers.

## The technical challenge

- Matching the same company across providers when names don't agree.
- Keeping long index histories continuous through renames and missing days.
- Making results explorable by researchers, not just stored.

## Architecture and solution

- **Python and SQLAlchemy pipelines** load data into MySQL, add new series as they appear, and fill missing trading days.
- **Index history** for around 147 NSE indices, including the mapping between current index names and older names used before 2015.
- **Company matching** across data providers with fuzzy matching (rapidfuzz) and a blended scorer.
- **Analytics:** reusable indicator calculations and interactive Plotly charts comparing strategies, alongside matplotlib charts for reports.

## My role

Architect and hands-on engineer: I design the pipelines and write much of the code.

## Key engineering decisions

- **Shared read and write helpers.** Scripts use one library to read and write the database instead of building their own connections or holding credentials.
- **Fix the data once, upstream.** Name mapping and gap filling happen in the pipeline, so every downstream analysis inherits the fix.
