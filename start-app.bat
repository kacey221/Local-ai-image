@echo off
cd /d "%~dp0"
node scripts\start-app.mjs
if errorlevel 1 pause
