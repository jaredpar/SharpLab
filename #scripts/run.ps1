param (
    [switch] [boolean] $ServerOnly = $false,
    [switch] [boolean] $NoCache = $false
)

Set-StrictMode -Version 2
$ErrorActionPreference = 'Stop'

Write-Host "Opening new window for initial wait" -ForegroundColor White
Start-Process powershell -ArgumentList "-File `"$PSScriptRoot/run/wait.ps1`""

$tags = @('--tags', 'server')
if (!$ServerOnly) { $tags += @('--tags', 'assets') }
if (!$NoCache) { $tags += @('--tags', 'cache') }

Create-Directory "!azurite" | Out-Null

dotnet tye run --watch @tags