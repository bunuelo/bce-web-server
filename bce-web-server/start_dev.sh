#!/bin/bash

dotenv ../.env

vite dev --port $(BCE_WEB_SERVER_HTTPS_PORT)
