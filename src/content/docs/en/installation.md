---
title: Installation
description: Prepare a server, choose a Docker image, create the first administrator, then back up and update.
navTitle: Installation
order: 10
section: install
draft: false
locale: en
---

This guide explains how to put Elidune into service for a library. Commands, file names, and server settings are in [Deployment](/en/dev/deployment/).

Elidune is free software, published under the GNU AGPL-3.0 licence.

## What to have ready

- A computer that can run Docker, with Docker Compose.
- Disk space for the software, the database, and the search index.
- At least 2 GB of memory for a trial. A library in daily use needs more.
- The ports used by the chosen installation must be free.

## Two ways to install

**One image.** The server, the interface, the database, the cache, and search run in the same container. This is the shortest path for a library that is starting out.

**Several services.** The interface, the server, the database, the cache, and search are separate. This split helps when each part must be watched or backed up on its own.

Both installations open the same interface. The choice does not change the desk screens.

## First start

1. Get the software and prepare the settings file, as described in [Deployment](/en/dev/deployment/).
2. Change the two secrets asked for before the first launch: the one that signs sessions, and the search engine key. A key that is too short is refused.
3. Start the services.
4. Open the interface. While no account and no settings exist, the first-setup wizard appears. No administrator password is shipped with the software.

An empty line in the settings file can stop startup. Delete the line rather than leaving it blank.

## First-setup wizard

Four steps:

1. Introduction.
2. Library: name or town, a required country, a time zone when the country has several, address, and optional email and phone numbers.
3. Administrator: login, a password of at least 8 characters, given name, family name, sex, date of birth, optional email, and the account language (French, English, German, or Spanish). The account created is an administrator.
4. Optional email sending. Skipping the step leaves the file configuration.

A second pass through the wizard is refused: the library already exists. Too many attempts from the same address slow the wizard for a minute.

## Public address and the padlock

Elidune does not terminate HTTPS itself. A web server in front receives encrypted visits and forwards them to the software. Examples are in [Deployment](/en/dev/deployment/).

The library’s public address must be recorded, with no trailing slash. If it stays empty, password-reset messages are not sent.

If the browser reaches the interface and the server on two different addresses, the allowed origin must be declared. The detail is in the developer documentation.

## Updates

1. Back up the database before any upgrade.
2. Choose the version to install: stable, the development version, or a pinned version.
3. Restart the services with that version.
4. At startup, Elidune applies database updates that are still pending.

A database created with older versions, before the schema was squashed, must be realigned once before deployment. Do not run that alignment on a fresh database. The procedure is in [Deployment](/en/dev/deployment/).

Plan a stop, and try a restore on a copy before a major upgrade.

## Backups

Two means exist.

**From settings**, an administrator downloads a database backup. Restoring it replaces the whole database: the operation is destructive. Plan it during a closure. If connections stay open afterwards, restart the server. The upload size is limited.

**Docker volumes** keep the database, the cache, and the search index separately. After a database restore, rebuild the catalogue index in Settings, Server, Catalog. Otherwise search can stay empty.

## See also

- [Getting started](/en/docs/getting-started/)
- [Troubleshooting](/en/docs/troubleshooting/)
- [Deployment](/en/dev/deployment/)
