$ErrorActionPreference = "Stop"

# ========================================================
# csv_to_json.ps1  -  EtsyListingsDownload.csv -> data/etsy_products.json
# Kullanim (Preview):  powershell -ExecutionPolicy Bypass -File scripts\csv_to_json.ps1
# Kullanim (Kaydet):   powershell -ExecutionPolicy Bypass -File scripts\csv_to_json.ps1 save
# ========================================================

$CsvPath = "EtsyListingsDownload.csv"
$JsonOut  = "data\etsy_products.json"
$Preview  = ($args -notcontains "save")

$DISCOUNT_RATE    = 0.30
$DEFAULT_RATING   = 4.7
$DEFAULT_REVIEWS  = 285
$DEFAULT_TIME     = "8 hours"
$DEFAULT_PAGES    = 15

function Get-Slug($text) {
    $s = $text.ToLower().Trim()
    $s = [regex]::Replace($s, '[^\w\s-]', '')
    $s = [regex]::Replace($s, '[\s_]+', '-')
    $s = [regex]::Replace($s, '-+', '-')
    if ($s.Length -gt 120) { $s = $s.Substring(0, 120) }
    return $s.Trim('-')
}

function Get-Category($title, $desc) {
    $combined = ($title + " " + $desc.Substring(0, [Math]::Min(200, $desc.Length))).ToLower()
    if ($combined -match "bar cart|charcuterie|serving cart|beverage cart|coffee cart|mobile bar|food cart|vendor cart") { return "Kitchen" }
    if ($combined -match "outdoor kitchen|grill station|bbq grill") { return "Kitchen" }
    if ($combined -match "farmstand|farm stand|farm cart|flower cart|roadside|flower stand|produce") { return "Garden" }
    if ($combined -match "workbench|workshop|garage|shop table") { return "Workshop" }
    if ($combined -match "bed frame|bunk bed|loft bed") { return "Bedroom" }
    return "Furniture"
}

function Get-Difficulty($title, $desc) {
    $combined = ($title + " " + $desc.Substring(0, [Math]::Min(200, $desc.Length))).ToLower()
    if ($combined -match "rotating|lift top|lift-top|ping pong|outdoor kitchen|modular") { return "Hard" }
    if ($combined -match "folding|foldable|collapsible|beginner") { return "Easy" }
    return "Easy"
}

function Convert-ImageUrl($url, $size = "fullxfull") {
    if (-not $url) { return "" }
    return [regex]::Replace($url, 'il_[^./]+\.', "il_$size.")
}

# ── Mevcut JSON'dan etsy_url eslemesi ──────────────────────
$urlMap = @{}
if (Test-Path $JsonOut) {
    try {
        $existing = Get-Content $JsonOut -Raw -Encoding UTF8 | ConvertFrom-Json
        foreach ($p in $existing) {
            if ($p.name -and $p.etsy_url) {
                $key = $p.name.ToLower().Trim() -replace '\s+', ' '
                $urlMap[$key] = $p.etsy_url
            }
        }
        Write-Host "Mevcut JSON'dan $($urlMap.Count) URL yuklendi."
    } catch {
        Write-Host "Mevcut JSON yuklenemedi: $_"
    }
}

function Find-EtsyUrl($title) {
    $key = $title.ToLower().Trim() -replace '\s+', ' '
    if ($urlMap.ContainsKey($key)) { return $urlMap[$key] }
    # 45-karakter prefix eslesmesi
    $prefix = if ($key.Length -gt 45) { $key.Substring(0,45) } else { $key }
    foreach ($k in $urlMap.Keys) {
        $kp = if ($k.Length -gt 45) { $k.Substring(0,45) } else { $k }
        if ($kp -eq $prefix) { return $urlMap[$k] }
    }
    return ""
}

# ── CSV oku ─────────────────────────────────────────────────
if (-not (Test-Path $CsvPath)) {
    Write-Error "CSV bulunamadi: $CsvPath"
    Write-Host "Etsy Shop Manager -> Listings -> Download CSV yapip buraya koy."
    exit 1
}

$rows = Import-Csv $CsvPath -Encoding UTF8
Write-Host "CSV'de $($rows.Count) urun bulundu."

$products = @()
$idx = 1

foreach ($row in $rows) {
    $title = $row.TITLE.Trim()
    if (-not $title) { continue }

    $desc = if ($row.DESCRIPTION) { $row.DESCRIPTION.Trim() } else { "" }
    $rawPrice = [double]([regex]::Replace($row.PRICE, '[^\d.]', ''))
    if ($rawPrice -le 0) { $rawPrice = 9.99 }
    $salePrice = [Math]::Round($rawPrice * $DISCOUNT_RATE, 2)

    # Resimler
    $fullImages    = @()
    $thumbImages   = @()
    for ($i = 1; $i -le 10; $i++) {
        $col = "IMAGE$i"
        if ($row.PSObject.Properties[$col] -and $row.$col) {
            $url = $row.$col.Trim()
            if ($url) {
                $fullImages  += Convert-ImageUrl $url "fullxfull"
                $thumbImages += Convert-ImageUrl $url "794xN"
            }
        }
    }

    # Etiketler
    $tags = @()
    if ($row.TAGS) {
        $tags = $row.TAGS -split "," | ForEach-Object { $_.Trim() -replace '\s+', '_' } | Where-Object { $_ }
    }

    $category   = Get-Category $title $desc
    $difficulty = Get-Difficulty $title $desc
    $etsy_url   = Find-EtsyUrl $title
    $slug       = Get-Slug $title
    $shortDesc  = ($desc -replace '\s+', ' ').Substring(0, [Math]::Min(220, $desc.Length)).Trim()

    $product = [ordered]@{
        id               = "etsy-$idx"
        slug             = $slug
        name             = $title
        category         = $category
        price            = $salePrice
        originalPrice    = $rawPrice
        rating           = $DEFAULT_RATING
        reviewCount      = $DEFAULT_REVIEWS
        difficulty       = $difficulty
        estimatedTime    = $DEFAULT_TIME
        pages            = $DEFAULT_PAGES
        description      = $shortDesc
        longDescription  = $desc
        features         = @($tags | Select-Object -First 5)
        tags             = @($tags)
        materials        = @("Digital Download", "PDF File", "Instant Download")
        image            = if ($fullImages.Count -gt 0) { $fullImages[0] } else { "" }
        thumbnail        = if ($thumbImages.Count -gt 0) { $thumbImages[0] } else { "" }
        images           = @($fullImages)
        imagesThumbnails = @($thumbImages)
        etsy_url         = $etsy_url
        bestseller       = $false
    }

    $products += $product
    $idx++
}

# ── Ozet ────────────────────────────────────────────────────
$urlCount = ($products | Where-Object { $_.etsy_url }).Count
$imgCount = ($products | Where-Object { $_.image }).Count

Write-Host ""
Write-Host "$($products.Count) urun islendi | URL: $urlCount/$($products.Count) | Resim: $imgCount/$($products.Count)"
Write-Host ""
Write-Host ("{0,6}  {1,-55}  {2,7}  {3,4}  {4,5}" -f "No", "Baslik", "Fiyat", "URL", "Resim")
Write-Host ("-" * 90)
foreach ($p in $products) {
    $urlOk = if ($p.etsy_url) { "OK" } else { "--" }
    $imgOk = if ($p.image) { "OK" } else { "--" }
    $name55 = if ($p.name.Length -gt 55) { $p.name.Substring(0,55) } else { $p.name.PadRight(55) }
    Write-Host ("{0,6}  {1,-55}  `${2,5:F2}  {3,4}  {4,5}" -f $p.id, $name55, $p.price, $urlOk, $imgOk)
}

if ($Preview) {
    Write-Host ""
    Write-Host "[Onizleme modu - kaydedilmedi. -Preview parametresini kaldirarak calistir.]"
    exit 0
}

# ── Kaydet ──────────────────────────────────────────────────
if (-not (Test-Path (Split-Path $JsonOut))) {
    New-Item -ItemType Directory -Path (Split-Path $JsonOut) | Out-Null
}

$products | ConvertTo-Json -Depth 10 | Set-Content $JsonOut -Encoding UTF8
Write-Host ""
Write-Host "Kaydedildi -> $JsonOut"
Write-Host "Simdi: git add data/etsy_products.json && git commit -m 'urunler guncellendi' && git push"
