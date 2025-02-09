#!/bin/bash

dotenv ../.env

vite preview --port $(BCE_WEB_SERVER_HTTPS_PORT)"
