@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-23"
cd /d "%~dp0"
call mvnw.cmd -f pom.xml clean compile
