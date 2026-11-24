@echo off
setlocal
cd /d "%~dp0"
where mvn.cmd >nul 2>&1
if not errorlevel 1 goto installed
set "MAVEN_HOME=%USERPROFILE%\.m2\stockflow-tools\apache-maven-3.9.11"
if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-maven.ps1"
    if errorlevel 1 exit /b 1
)
call "%MAVEN_HOME%\bin\mvn.cmd" %*
exit /b %errorlevel%

:installed
call mvn.cmd %*
exit /b %errorlevel%
