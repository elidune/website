---
title: Troubleshooting
description: Startup, sign-in, email sending, empty search, and restore.
navTitle: Troubleshooting
order: 61
section: help
draft: false
locale: en
---

Commands and setting names are in [Deployment](/en/dev/deployment/). This page describes what staff and the person installing can observe.

## The software does not start

Look at the state of the services and the last lines of the log. The commands are in deployment.

**Settings not found.** Start the stack from the folder that contains the environment file, or name that file explicitly.

**Port already taken.** Change the published port, stop the stack, then start it again. The ports inside the all-in-one image do not change.

**Image refused.** Sign in to the registry before downloading the image. The account used must be allowed to read it.

**Empty line.** A variable written with no value can make configuration unreadable. Delete the line.

**Search refuses its key.** In production mode, the key is at least 16 characters. Replace it, then restart, so the search engine follows.

The health indicator distinguishes a healthy service, a first setup that is still required, and a database that cannot be reached. Its address is in deployment.

## Sign-in

Too many attempts from the same address slow sign-in for a minute. This is not a wrong password. Behind a web server that gathers every desk onto one address, widen the quota or declare that server as a trusted intermediary, so each desk is counted apart. The detail is in [Authentication](/en/dev/authentication/).

The block per login (five failures in fifteen minutes) is cleared from the patron record, by a staff member who can edit patrons.

## Email

No reset message: check the library’s public address, the sending host, the sender, and that the email section can be edited from the interface if the values come from the screen. The test send is reserved for the administrator, in the server settings.

## Empty search after an import

The search index is separate from the database. After a large import or a restore, run reindexing (Settings, Server, Catalog). If the search engine is stopped, search uses the database.

## Restore

Restoring a backup replaces the whole database. The upload size is limited. Plan a closure. If connections stay open after the restore, restart the server.
