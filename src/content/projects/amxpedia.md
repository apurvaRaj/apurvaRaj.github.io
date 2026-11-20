---
title: AMXpedia — Marketplace for 3D-Printed Parts
short: AMXpedia
summary: An India-focused marketplace for 3D-printed items and components, built with AI coding agents.
org: AMXpedia (own venture)
period: 2026 – present
role: Founder and builder
order: 5
domain: Marketplace & e-commerce
status: in-development
stack: [Claude Code, DigitalOcean]
links:
  - { label: "amxpedia.com", href: "https://amxpedia.com" }
keywords: [3D printing marketplace, 3D-printed parts, e-commerce architecture]
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

AMXpedia is an India-focused marketplace for 3D-printed items and components. It is in development.

## The problem

Buying 3D-printed parts in India usually means finding a supplier, sending files back and forth and comparing quotes by hand. AMXpedia puts 3D-printed items and components in one catalogue that people can browse and buy from directly.

## Architecture and solution

The platform is being built in phases around the buying journey: catalogue, product pages, cart, payments, orders and shipping. It runs on a DigitalOcean server, and I am building it with Claude Code as the main development tool.

## My role

Founder and builder: product, design mockups, architecture and development.

## Status

In development. The first phase to go live for stakeholder review is the catalogue and buying flow.
