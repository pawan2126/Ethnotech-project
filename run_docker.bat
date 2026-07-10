@echo off
echo ==========================================
echo LifeLink AI - Building and Launching Docker Containers
echo ==========================================
echo.
echo Step 1: Checking for Docker...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in system PATH.
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)

echo.
echo Step 2: Building and starting containers...
docker compose up --build -d

echo.
echo ==========================================
echo Deployment started in detached mode!
echo.
echo Access URLs:
echo - Frontend: http://localhost
echo - Backend:  http://localhost:8082
echo - Database: localhost:3306 (MySQL)
echo.
echo View logs with:    docker compose logs -f
echo Stop services with: docker compose down
echo ==========================================
pause
