$filePath = "data\etsy_products.json"
# IMPORTANT: Use UTF8NoBOM to avoid adding a BOM that breaks Turbopack JSON parsing
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$content = [System.IO.File]::ReadAllText($filePath, $utf8NoBom)
$orig = $content
$content = $content.Replace([char]0x131, 'i')   # i (dotless) -> i
$content = $content.Replace([char]0x130, 'i')   # I (dotted capital) -> i
$content = $content.Replace([char]0x11F, 'g')   # g with breve -> g
$content = $content.Replace([char]0x11E, 'g')   # G with breve -> g
$content = $content.Replace([char]0xFC, 'u')    # u umlaut -> u
$content = $content.Replace([char]0xDC, 'u')    # U umlaut -> u
$content = $content.Replace([char]0x15F, 's')   # s cedilla -> s
$content = $content.Replace([char]0x15E, 's')   # S cedilla -> s
$content = $content.Replace([char]0xF6, 'o')    # o umlaut -> o
$content = $content.Replace([char]0xD6, 'o')    # O umlaut -> o
$content = $content.Replace([char]0xE7, 'c')    # c cedilla -> c
$content = $content.Replace([char]0xC7, 'c')    # C cedilla -> c
if ($content -ne $orig) {
    [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
    Write-Host "DONE - Turkish chars normalized in slugs (BOM-free UTF8)"
} else {
    Write-Host "No changes needed"
}
