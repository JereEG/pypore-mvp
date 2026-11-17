@echo off
title Pypore - Trazabilidad Ganadera Soberana (Bufalo)
cd /d "%~dp0"
echo.
echo ============================================================
echo   PYPORE (Huella Propia) - Trazabilidad Ganadera Soberana
echo   Punta de Lanza: Rodeo Bubalino del NEA · Hedera HCS
echo ============================================================
echo.
echo   Landing Institucional : http://localhost:3000
echo   Demo Interactiva      : http://localhost:3000/demo
echo.

if exist ".next\BUILD_ID" (
  echo Iniciando servidor en modo produccion...
  start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"
  call npm.cmd run start
) else (
  echo Iniciando servidor en modo desarrollo...
  start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"
  call npm.cmd run dev
)
