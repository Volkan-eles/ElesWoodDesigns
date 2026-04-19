$filePath = "data\etsy_products.json"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
$orig = $content
$content = $content.Replace([char]0x131, 'i')   # ı
$content = $content.Replace([char]0x130, 'i')   # I (dotted capital)
$content = $content.Replace([char]0x11F, 'g')   # g with breve
$content = $content.Replace([char]0x11E, 'g')   # G with breve
$content = $content.Replace([char]0xFC, 'u')    # u umlaut
$content = $content.Replace([char]0xDC, 'u')    # U umlaut
$content = $content.Replace([char]0x15F, 's')   # s cedilla
$content = $content.Replace([char]0x15E, 's')   # S cedilla
$content = $content.Replace([char]0xF6, 'o')    # o umlaut
$content = $content.Replace([char]0xD6, 'o')    # O umlaut
$content = $content.Replace([char]0xE7, 'c')    # c cedilla
$content = $content.Replace([char]0xC7, 'c')    # C cedilla
if ($content -ne $orig) {
    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "DONE - Turkish chars normalized in slugs"
} else {
    Write-Host "No changes needed"
}
