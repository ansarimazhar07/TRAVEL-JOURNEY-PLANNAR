# setup_backend.ps1
# 
# Run this script AFTER installing XAMPP.
# It copies backend files and images to the correct htdocs location.
#
# How to run:
#   Right-click this file → "Run with PowerShell"
#   OR in PowerShell: .\setup_backend.ps1

$projectRoot = "D:\antiprojects\TRAVEL JOURNEY PLANNER"
$htdocs      = "C:\xampp\htdocs\travel-journey-planner"

Write-Host "Travel Journey Planner — Backend Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Check XAMPP is installed
if (-not (Test-Path "C:\xampp")) {
    Write-Host "ERROR: XAMPP not found at C:\xampp" -ForegroundColor Red
    Write-Host "Please install XAMPP first from: https://www.apachefriends.org/download.html"
    Read-Host "Press Enter to exit"
    exit
}

# Create target directory
Write-Host "`n[1/3] Creating htdocs folder..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$htdocs\backend" | Out-Null
New-Item -ItemType Directory -Force -Path "$htdocs\images\destinations" | Out-Null
Write-Host "      Created: $htdocs" -ForegroundColor Green

# Copy backend PHP files
Write-Host "[2/3] Copying PHP backend files..." -ForegroundColor Yellow
Copy-Item -Path "$projectRoot\backend\*" -Destination "$htdocs\backend\" -Force
Write-Host "      Copied: backend/*.php" -ForegroundColor Green

# Copy destination images
Write-Host "[3/3] Copying destination images..." -ForegroundColor Yellow
Copy-Item -Path "$projectRoot\frontend\public\images\destinations\*" `
          -Destination "$htdocs\images\destinations\" -Force
Write-Host "      Copied: 8 destination images" -ForegroundColor Green

Write-Host "`n✅ Done! Backend files are ready." -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Open C:\xampp\htdocs\travel-journey-planner\backend\config.php"
Write-Host "     and fill in your DB credentials."
Write-Host ""
Write-Host "  2. Open phpMyAdmin: http://localhost/phpmyadmin"
Write-Host "     Create database: travel_planner"
Write-Host "     Import: database\travel_planner.sql"
Write-Host "     Import: database\phase2_destinations.sql"
Write-Host ""
Write-Host "  3. Test API: http://localhost/travel-journey-planner/backend/destinations.php"
Write-Host ""
Write-Host "  4. Open React app: http://localhost:5173/destinations"
Write-Host ""
Read-Host "Press Enter to close"
