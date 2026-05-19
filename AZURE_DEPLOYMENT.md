# ChatMEDICAL - rulare API, Docker si Azure

## Arhitectura

- `ChatMEDICAL` ramane clientul desktop WinUI.
- `ChatMEDICAL.Api` este backend-ul ASP.NET Core care poate rula in Docker si Azure.
- Clientul WinUI foloseste local `http://localhost:5088` prin `Services/MedicalApiClient.cs`.

## Rulare locala

Porneste API-ul:

```powershell
dotnet run --project .\ChatMEDICAL.Api\ChatMEDICAL.Api.csproj --urls http://localhost:5088
```

Verifica API-ul:

```powershell
Invoke-RestMethod http://localhost:5088/health
Invoke-RestMethod http://localhost:5088/api/specialties
```

Apoi porneste aplicatia WinUI din Visual Studio sau cu profilul existent.

## Docker local

Ai nevoie de Docker Desktop instalat si pornit.

```powershell
docker build -f .\ChatMEDICAL.Api\Dockerfile -t chatmedical-api .
docker run --rm -p 5088:8080 chatmedical-api
```

## Azure Container Registry

```powershell
az login
az group create -n rg-chatmedical -l westeurope
az acr create -g rg-chatmedical -n chatmedicalacr --sku Basic
az acr login -n chatmedicalacr

docker tag chatmedical-api chatmedicalacr.azurecr.io/chatmedical-api:1
docker push chatmedicalacr.azurecr.io/chatmedical-api:1
```

## Azure Container Apps

```powershell
az containerapp env create `
  -g rg-chatmedical `
  -n chatmedical-env `
  -l westeurope

az containerapp create `
  -g rg-chatmedical `
  -n chatmedical-api `
  --environment chatmedical-env `
  --image chatmedicalacr.azurecr.io/chatmedical-api:1 `
  --target-port 8080 `
  --ingress external `
  --registry-server chatmedicalacr.azurecr.io
```

Dupa deploy, schimba `BaseAddress` din `ChatMEDICAL\Services\MedicalApiClient.cs` catre URL-ul public al API-ului din Azure.
