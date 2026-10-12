---
title: Install with Docker
description: Planned structure of the Docker installation guide. Draft, with no verified step-by-step procedure.
navTitle: Installation
order: 1
draft: true
locale: en
---

This page sets out the installation guide. It does not replace the guide in the [elidune/elidune](https://github.com/elidune/elidune/blob/main/docs/README-docker.md) repository.

## What the guide will cover

- Prerequisites (Docker and Compose).
- Choosing between the multi-service stack and the all-in-one image.
- Environment file and secrets.
- Start, checks, backups, and updates.

## Facts already written in the software repository

The README and `docs/README-docker.md` state that:

- there are two Compose files, `docker/docker-compose.yml` and `docker/docker-compose.all-in-one.yml`;
- a published image is `ghcr.io/elidune/elidune-all-in-one`;
- there is no default administrator account: the first launch goes through the interface wizard.

Exact commands, ports, and variables stay in that guide. They are not copied here until this page has been reviewed.
