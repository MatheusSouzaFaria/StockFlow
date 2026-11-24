$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$version = '3.9.11'
$root = Join-Path $env:USERPROFILE '.m2\stockflow-tools'
$base = "https://archive.apache.org/dist/maven/maven-3/$version/binaries/apache-maven-$version-bin.zip"
$zip = Join-Path $root "apache-maven-$version-bin.zip"
New-Item -ItemType Directory -Force -Path $root | Out-Null
Write-Host "Baixando Apache Maven $version (primeira execução)..."
try {
  Invoke-WebRequest -UseBasicParsing -Uri $base -OutFile $zip
  $checksum = (Invoke-WebRequest -UseBasicParsing -Uri "$base.sha512").Content
  if ($checksum -is [byte[]]) { $checksum = [Text.Encoding]::ASCII.GetString($checksum) }
  $expected = [regex]::Match([string]$checksum, '(?i)\b[0-9a-f]{128}\b').Value
  if (!$expected -or (Get-FileHash $zip -Algorithm SHA512).Hash -ne $expected) { throw 'Checksum SHA-512 inválido.' }
  Expand-Archive -Path $zip -DestinationPath $root -Force
} finally { Remove-Item $zip -ErrorAction SilentlyContinue }
