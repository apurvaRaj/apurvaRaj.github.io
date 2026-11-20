---
title: FidelFolio — Quantitative Investment Research & Technology Platform
short: FidelFolio platform
summary: The data platform, backtesting engines, AI-assisted screener and websites behind a SEBI-registered, rules-based investment adviser for Indian equities.
org: FidelFolio Investments
period: 2025 – present
role: Co-Founder & CTO
order: 1
domain: Fintech & quantitative technology
status: live
stack: [Python, pandas, SQLAlchemy, MySQL, React, OpenAI API, Docker, n8n, Claude Code]
facts:
  - { value: "30+ yrs", label: "of Indian share prices and fundamentals in the data platform" }
  - { value: "2", label: "public sites: fidelfolio.com and fidelfolio.ai" }
links:
  - { label: "fidelfolio.com", href: "https://fidelfolio.com" }
  - { label: "fidelfolio.ai", href: "https://fidelfolio.ai" }
keywords: [fintech technology leader, quantitative investing platform, backtesting engine, stock screener]
diagram:
  caption: How research data flows from market data to clients and the public screener.
  nodes:
    - { id: md, label: "Market data", x: 70, y: 260, kind: source }
    - { id: pipe, label: "Python pipelines", x: 230, y: 260, kind: process }
    - { id: db, label: "Financial data platform", x: 440, y: 260, kind: store }
    - { id: bt, label: "Backtesting engines", x: 640, y: 150, kind: process }
    - { id: ai, label: "AI screen assistant", x: 640, y: 380, kind: process }
    - { id: rep, label: "Research & client reports", x: 880, y: 150, kind: surface }
    - { id: scr, label: "fidelfolio.ai screener", x: 880, y: 380, kind: surface }
  edges:
    - [md, pipe]
    - [pipe, db]
    - [db, bt]
    - [db, ai]
    - [bt, rep]
    - [ai, scr, "plain language → filters"]
---

## Overview

FidelFolio Investments is a SEBI-registered investment adviser building a technology-driven, rules-based investing platform for Indian equities. As Co-Founder and CTO, I own the firm's technology: strategy, architecture and engineering delivery, from the data underneath the research to the products clients and the public use.

## The problem

Rules-based investing is only as good as its evidence. Every rule a research team proposes has to be tested against decades of history, and the results have to be reproducible: the same rule, run again, must give the same answer. Clients then need reports they can trust, and the public needs a way to explore ideas without a quant team behind them.

## The technical challenge

- Decades of prices and fundamentals for listed Indian companies, kept consistent as sources and company names change over time.
- Backtests that are reproducible and comparable across engine versions.
- Turning a research workflow that lived in notebooks into systems a small team can run every month.
- Giving non-experts a way to build stock screens without learning a query language.

## Architecture and solution

- **Financial data platform.** I architected the firm's data platform, which holds more than three decades of share prices and fundamentals for listed Indian companies. Automated Python pipelines load and check it, and it feeds research, backtests and client reports.
- **Backtesting engines.** Rules-based backtests for Indian equities, with return and fundamental analysis. New engine versions are validated against the legacy engine on the firm's mapped product portfolios before they replace it.
- **AI-assisted screener.** A live stock screener at fidelfolio.ai whose AI assistant helps users build screens in plain language.
- **Websites.** I led the build and launch of fidelfolio.com and fidelfolio.ai using AI coding agents such as Claude Code, and owned architecture, code quality and releases.

## My role

Co-Founder and CTO. I lead the technology function, drive technical hiring, mentor engineers and interns, and own products end to end.

## Key engineering decisions

- **One source of truth for market data.** Research, backtests and reports read from the same platform, so numbers agree across every output.
- **Validate before replacing.** New backtest engines run side by side with the legacy engine on the same portfolios, and differences are explained before the switch.
- **Explicit backtest policies.** Edge cases are decided once and written down: for example, a stock that can't be bought at entry has its weight spread across the rest rather than held as cash.
- **AI behind a human.** The screener's assistant proposes filters; the user sees and controls the screen it builds.
