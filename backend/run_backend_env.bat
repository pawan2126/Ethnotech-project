@echo off
REM Set environment variables required for NotificationService
set "TWILIO_ACCOUNT_SID=YOUR_TWILIO_SID"
set "TWILIO_AUTH_TOKEN=YOUR_TWILIO_TOKEN"
set "TWILIO_FROM_NUMBER=YOUR_TWILIO_NUMBER"
set "FIREBASE_SERVICE_ACCOUNT_PATH=path\to\serviceAccount.json"

call run_backend.bat
