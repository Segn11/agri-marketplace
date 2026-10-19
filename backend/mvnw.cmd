@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script for Agri Marketplace Backend
@REM ----------------------------------------------------------------------------
@IF "%DEBUG%" == "" @ECHO OFF

@SETLOCAL
@SET ERROR_CODE=0

@SET MAVEN_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6
@SET MAVEN_ZIP=%MAVEN_DIR%\apache-maven-3.9.6-bin.zip
@SET MAVEN_BIN=%MAVEN_DIR%\apache-maven-3.9.6\bin\mvn.cmd

IF EXIST "%MAVEN_BIN%" GOTO RUN_MAVEN

ECHO [Agri Marketplace] Local Maven not found in PATH.
ECHO [Agri Marketplace] Provisioning Apache Maven 3.9.6 wrapper into %MAVEN_DIR%...

powershell -Command "if (!(Test-Path '%MAVEN_DIR%')) { New-Item -ItemType Directory -Force -Path '%MAVEN_DIR%' | Out-Null }; $ProgressPreference = 'SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip' -OutFile '%MAVEN_ZIP%'; Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%MAVEN_DIR%' -Force; Remove-Item '%MAVEN_ZIP%' -Force"

IF NOT EXIST "%MAVEN_BIN%" (
    ECHO [ERROR] Failed to download or extract Maven.
    ECHO [ERROR] Please install Maven via: winget install Apache.Maven
    EXIT /B 1
)

:RUN_MAVEN
"%MAVEN_BIN%" %*
EXIT /B %ERRORLEVEL%
