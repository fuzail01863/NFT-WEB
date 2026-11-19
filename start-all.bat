@echo off
echo ==============================================
echo   Starting Fuzail NFT Marketplace Fullstack
echo ==============================================

echo [1/3] Starting Hardhat Local Node...
start "1. Hardhat Node (Port 8545)" cmd /k "npx hardhat node"

timeout /t 5 /nobreak >nul

echo [2/3] Deploying Smart Contracts to Local Node...
call npx hardhat run scripts/deploy.js --network localhost

echo [3/3] Starting Backend API (Port 8000)...
start "2. Backend API (Port 8000)" cmd /k "cd \"NFT backened\" && node server.js"

echo [4/4] Starting Frontend App (Port 5173)...
start "3. Frontend Vite (Port 5173)" cmd /k "cd \"NFT frontened\" && npm run dev"

echo.
echo ==============================================
echo   All 3 services launched successfully!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   Hardhat:  http://127.0.0.1:8545
echo ==============================================
pause
