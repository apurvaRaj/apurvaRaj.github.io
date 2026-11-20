---
title: AI Agents and Workflow Automation Systems
short: AI agents & automation
summary: An agentic workflow platform with human approval steps, an MCP gateway that lets AI assistants run notebooks on the firm's servers, and automation for reporting, publishing and video.
org: FidelFolio Investments
period: 2025 – present
role: Architect and builder
order: 6
domain: AI & agentic systems
status: live
stack: [LangGraph, OpenAI API, MCP, FastAPI, Jupyter, Python, n8n, Docker, Nginx]
links:
  - { label: "agent-exec-gateway on GitHub", href: "https://github.com/apurvaRaj/agent-exec-gateway" }
keywords: [agentic AI developer, AI solutions architect, MCP, LLM workflow automation, human in the loop]
diagram:
  caption: Each step is an LLM, a tool or a person, and every run is logged.
  nodes:
    - { id: task, label: "Task", x: 70, y: 260, kind: actor }
    - { id: llm, label: "LLM step: reason", x: 260, y: 150, kind: process }
    - { id: tool, label: "Tool step: Python, data", x: 470, y: 150, kind: process }
    - { id: human, label: "Human step: approve", x: 690, y: 150, kind: actor }
    - { id: runs, label: "Run log & registry", x: 470, y: 390, kind: store }
    - { id: out, label: "Reports & outputs", x: 910, y: 150, kind: surface }
  edges:
    - [task, llm]
    - [llm, tool]
    - [tool, human]
    - [human, out]
    - [llm, runs]
    - [tool, runs]
    - [human, runs]
---

## Overview

At FidelFolio I design the systems that let AI do real work safely: an agentic workflow platform, a gateway that gives AI assistants controlled access to the firm's compute, and automation that removes routine manual work.

## The problem

A small team running research, reporting and marketing has more recurring work than people. AI can take on much of it, but only if every step is controlled, visible and reviewable, because the outputs reach clients.

## The technical challenge

- Letting AI agents use tools without giving them more access than each step needs.
- Keeping a person in the loop at the points that matter.
- Making every run traceable, so good workflows can be reused and bad ones explained.
- Connecting AI assistants to notebooks and Python on the firm's servers without exposing data or keys.

## Architecture and solution

- **Agentic workflow platform.** Coordinates AI agents, tools and human approval steps. It controls what each step can access, logs every run and reuses proven workflows. It now runs recurring reporting and testing, which made reports faster and more reliable.
- **MCP execution gateway.** Lets AI assistants run Jupyter notebooks and Python on the firm's servers, with controlled tool access and read-only data permissions. The code is on GitHub as `agent-exec-gateway`.
- **Automation.** Reporting, social publishing and explainer-video production automated with n8n, Docker and Python.

## My role

Architect and builder of all three.

## Key engineering decisions

- **Three kinds of step.** An LLM step reasons, a tool step executes, a human step approves or redirects. Workflows are sequences of these.
- **Least access per step.** A step is given only the tools and data it needs.
- **Every run is a record.** Inputs, outputs and the steps that produced them are kept, so a later run can build on an earlier one.
- **Read-only by default.** AI access to firm data is read-only; anything that writes goes through a person.
