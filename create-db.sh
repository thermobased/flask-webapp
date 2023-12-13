#!/bin/sh -xe

rm -f collection.db
sqlite3 collection.db < create.sql
