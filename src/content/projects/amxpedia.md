---
title: AMXpedia — 3D Printing and Design Marketplace
short: AMXpedia
summary: An India-focused, engineering-first marketplace for 3D printing, design and industrial parts, built end to end with AI coding agents.
org: AMXpedia (own venture)
period: 2026 – present
role: Founder and builder
order: 5
domain: Marketplace & e-commerce
status: in-development
stack: [Claude Code, DigitalOcean]
links:
  - { label: "amxpedia.com", href: "https://amxpedia.com" }
keywords: [3D printing marketplace, industrial procurement platform, e-commerce architecture]
diagram:
  caption: The buying journey the platform is being built around.
  nodes:
    - { id: cat, label: "Catalogue", x: 110, y: 260, kind: store }
    - { id: pdp, label: "Product pages", x: 300, y: 260, kind: surface }
    - { id: cart, label: "Cart", x: 480, y: 260, kind: surface }
    - { id: pay, label: "Payments", x: 650, y: 260, kind: process }
    - { id: ord, label: "Orders & shipping", x: 850, y: 260, kind: process }
  edges:
    - [cat, pdp]
    - [pdp, cart]
    - [cart, pay]
    - [pay, ord]
---

## Overview

AMXpedia is an India-focused, engineering-first marketplace for 3D printing, design and industrial parts. It is in development.

## The problem

Engineers and makers in India buying parts and manufacturing services deal with scattered suppliers and thin product information. AMXpedia aims to give them one well-organised catalogue with the detail an engineer needs to choose.

## Architecture and solution

The platform is being built in phases around the buying journey: catalogue, product pages, cart, payments, orders and shipping. It runs on a DigitalOcean server, and I am building it with Claude Code as the main development tool.

## My role

Founder and builder: product, design mockups, architecture and development.

## Status

In development. The first phase to go live for stakeholder review is the catalogue and buying flow.
