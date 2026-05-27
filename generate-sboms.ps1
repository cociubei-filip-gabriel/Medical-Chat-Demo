# Ensure target directories exist
New-Item -ItemType Directory -Force -Path .\target\backend | Out-Null
New-Item -ItemType Directory -Force -Path .\target\desktop | Out-Null
New-Item -ItemType Directory -Force -Path .\target\frontend | Out-Null

Write-Host "Checking/Installing dotnet CycloneDX tool..." -ForegroundColor Cyan
dotnet tool install --global CycloneDX 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    dotnet tool update --global CycloneDX
}

Write-Host "Generating SBOM for ChatMEDICAL.Api (Backend)..." -ForegroundColor Cyan
# Generate JSON SBOM
dotnet-CycloneDX ChatMEDICAL.Api/ChatMEDICAL.Api.csproj -o .\target\backend -F json
if (Test-Path .\target\backend\bom.json) {
    Remove-Item -Force .\target\backend\sbom.json -ErrorAction SilentlyContinue
    Rename-Item .\target\backend\bom.json sbom.json
}
# Generate XML SBOM
dotnet-CycloneDX ChatMEDICAL.Api/ChatMEDICAL.Api.csproj -o .\target\backend -F xml
if (Test-Path .\target\backend\bom.xml) {
    Remove-Item -Force .\target\backend\sbom.xml -ErrorAction SilentlyContinue
    Rename-Item .\target\backend\bom.xml sbom.xml
}

Write-Host "Generating SBOM for ChatMEDICAL (WinUI App)..." -ForegroundColor Cyan
# Generate JSON SBOM
dotnet-CycloneDX ChatMEDICAL/ChatMEDICAL.csproj -o .\target\desktop -F json
if (Test-Path .\target\desktop\bom.json) {
    Remove-Item -Force .\target\desktop\sbom.json -ErrorAction SilentlyContinue
    Rename-Item .\target\desktop\bom.json sbom.json
}
# Generate XML SBOM
dotnet-CycloneDX ChatMEDICAL/ChatMEDICAL.csproj -o .\target\desktop -F xml
if (Test-Path .\target\desktop\bom.xml) {
    Remove-Item -Force .\target\desktop\sbom.xml -ErrorAction SilentlyContinue
    Rename-Item .\target\desktop\bom.xml sbom.xml
}

Write-Host "Generating SBOM for chatmedical-web (React Frontend)..." -ForegroundColor Cyan
Push-Location ChatMEDICAL/chatmedical-web
npx -y @cyclonedx/cyclonedx-npm --output-format JSON --output-file ..\..\target\frontend\sbom.json
npx -y @cyclonedx/cyclonedx-npm --output-format XML --output-file ..\..\target\frontend\sbom.xml
Pop-Location

Write-Host "SBOM generation completed. Files located in .\target\" -ForegroundColor Green
