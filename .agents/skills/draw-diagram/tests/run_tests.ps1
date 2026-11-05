param(
    [string]$ValidatorScript = "$PSScriptRoot\..\scripts\validate_drawio_xml.ps1",
    [string]$FixturesDir = "$PSScriptRoot\fixtures"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   GEOMETRY VALIDATOR TEST SUITE: FALSE POSITIVE/NEGATIVE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$testCases = @(
    @{
        Name = "Case 01: Hard Node-Node Overlap"
        File = "$FixturesDir\case01-hard-overlap.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "Node-Node Collision"
        Category = "False Negative Prevention (Must catch deliberate hard overlap)"
    },
    @{
        Name = "Case 02: Valid Container-Child Containment"
        File = "$FixturesDir\case02-container-child.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Zero hard overlaps"
        Category = "False Positive Prevention (Must NOT flag valid children in container)"
    },
    @{
        Name = "Case 03: Intentional Overlay in Control"
        File = "$FixturesDir\case03-intentional-overlay.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Zero hard overlaps"
        Category = "False Positive Prevention (Must classify intentional overlay correctly)"
    },
    @{
        Name = "Case 04: Edge Through Unrelated Node"
        File = "$FixturesDir\case04-edge-through-node.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "Edge-Node Collision"
        Category = "False Negative Prevention (Must catch connector cutting through node)"
    },
    @{
        Name = "Case 05: Edge Near Node With Adequate Clearance"
        File = "$FixturesDir\case05-edge-near-node-clearance.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "No connectors cut through unrelated nodes"
        Category = "False Positive Prevention (Must NOT flag edge passing safely near node)"
    },
    @{
        Name = "Case 06: Long Edge-Edge Collinear Overlap"
        File = "$FixturesDir\case06-edge-edge-overlap.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Edge-Edge Overlap"
        Category = "Diagnostic Warning (Must detect overlapping collinear edge corridor)"
    },
    @{
        Name = "Case 07: Single-Point Edge Crossing"
        File = "$FixturesDir\case07-edge-crossing.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Edge Crossing"
        Category = "Diagnostic Warning (Must identify crossing point without breaking exit code)"
    },
    @{
        Name = "Case 08: Edge Label Colliding With Node"
        File = "$FixturesDir\case08-edge-label-collision.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Edge-Label Collision"
        Category = "Diagnostic Warning (Must detect label overlapping adjacent obstacle)"
    },
    @{
        Name = "Case 09: Missing Endpoint Attachment"
        File = "$FixturesDir\case09-endpoint-attachment-missing.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "Endpoint Attachment"
        Category = "False Negative Prevention (Must catch missing source/target on edge)"
    },
    @{
        Name = "Case 10: Canvas Bounds Negative Coordinate"
        File = "$FixturesDir\case10-canvas-bounds-overflow.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "Canvas Bounds"
        Category = "False Negative Prevention (Must catch negative coordinate)"
    },
    @{
        Name = "Case 11: Container-Child Out-of-Bounds"
        File = "$FixturesDir\case11-container-child-oob.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "Container-Child Out-of-Bounds"
        Category = "False Negative Prevention (Must catch child node extending outside container)"
    },
    @{
        Name = "Case 12: Text Overflow Risk"
        File = "$FixturesDir\case12-text-overflow.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Text Overflow Risk"
        Category = "Diagnostic Warning (Must detect text label exceeding node boundary without wrap)"
    },
    @{
        Name = "Case 13: Port Congestion Warning"
        File = "$FixturesDir\case13-port-congestion.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Port Congestion"
        Category = "Diagnostic Warning (Must detect >= 3 connections concentrated on single port)"
    },
    @{
        Name = "Case 14: Canvas Positive Overflow Warning"
        File = "$FixturesDir\case14-canvas-positive-overflow.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Canvas Bounds Warning"
        Category = "Diagnostic Warning (Must detect node exceeding declared paged canvas limits)"
    },
    @{
        Name = "Case 15: Independent Rectangle Inside Another Rectangle"
        File = "$FixturesDir\case15-independent-rect-overlap.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "Node-Node Collision"
        Category = "False Negative Prevention (Must catch unparented independent nodes nested on same level)"
    },
    @{
        Name = "Case 16: Diagonal Edge Segment Cutting Through Node"
        File = "$FixturesDir\case16-diagonal-edge-collision.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "Edge-Node Collision"
        Category = "False Negative Prevention (Must catch diagonal line-rectangle collision via Liang-Barsky)"
    },
    @{
        Name = "Case 17: Multiline Text With Line Breaks In Node"
        File = "$FixturesDir\case17-multiline-text-fit.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "All node labels fit within their geometric bounds"
        Category = "False Positive Prevention (Must NOT flag short multiline text as text overflow)"
    },
    @{
        Name = "Case 18: Multiple Undeclared Ports On Hub Node"
        File = "$FixturesDir\case18-multiple-undeclared-ports.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "All ports have balanced connections"
        Category = "False Positive Prevention (Must NOT flag edges without explicit ports as port congestion)"
    },
    @{
        Name = "Case 19: Action/State Node Must Not Become A Container"
        File = "$FixturesDir\case19-action-state-not-container.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "Node-Node Collision"
        Category = "Semantic Containment (Ordinary Action/State must trigger collision, not semantic containment)"
    },
    @{
        Name = "Case 20: Edge Label With relative='0' Center Anchor"
        File = "$FixturesDir\case20-edge-label-relative-false.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Edge-Label Collision Warning"
        Category = "Edge Label Geometry (Must resolve relative=0 center position and detect obstacle collision)"
    },
    @{
        Name = "Case 21: Edge Label With Normal Vector Offset y"
        File = "$FixturesDir\case21-edge-label-y-normal-offset.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Edge-Label Collision Warning"
        Category = "Edge Label Geometry (Must displace along segment normal and detect collision)"
    },
    @{
        Name = "Case 22: Edge Label With Safe Clearance"
        File = "$FixturesDir\case22-edge-label-safe-clearance.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Edge-Label Clearance"
        Category = "Edge Label Geometry (Must verify adequate clearance without false alarm)"
    },
    @{
        Name = "Case 23: Rotated Rect AABB vs OBB Separation"
        File = "$FixturesDir\case23-rotated-rect-aabb-vs-obb.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Zero hard overlaps"
        Category = "Rotation Geometry (SAT must eliminate AABB false positive for separated rotated rectangles)"
    },
    @{
        Name = "Case 24: Shape-specific Ellipse Clipping (AABB-corner safe, true interior collision)"
        File = "$FixturesDir\case24-edge-through-ellipse-corner-aabb.drawio.xml"
        ExpectedExit = 1
        ExpectedPattern = "cuts through unrelated Node 'ellipse-node'"
        Category = "Shape-specific Clipping (Corner clip must NOT trigger collision, true cutting edge MUST trigger collision)"
    },
    @{
        Name = "Case 25: Multiline Text Height Overflow"
        File = "$FixturesDir\case25-multiline-text-height-overflow.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Text Overflow Risk"
        Category = "Multiline Text Metrics (Must detect height overflow for explicit multiple lines)"
    },
    @{
        Name = "Case 26: Wrapped Text Height Overflow"
        File = "$FixturesDir\case26-wrapped-text-height-overflow.drawio.xml"
        ExpectedExit = 0
        ExpectedPattern = "Text Overflow Risk"
        Category = "Multiline Text Metrics (Must calculate line wraps and detect height overflow)"
    }
)

$passedCount = 0
$failedCount = 0

foreach ($tc in $testCases) {
    Write-Host "`n----------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "RUNNING: $($tc.Name)" -ForegroundColor Yellow
    Write-Host "Category: $($tc.Category)" -ForegroundColor Gray

    $output = & powershell -ExecutionPolicy Bypass -File $ValidatorScript -FilePath $tc.File 2>&1
    $actualExit = $LASTEXITCODE
    $outText = $output -join "`n"

    $exitMatch = ($actualExit -eq $tc.ExpectedExit)
    $patternMatch = ($outText -match $tc.ExpectedPattern)

    if ($exitMatch -and $patternMatch) {
        Write-Host "RESULT: [TEST PASSED]" -ForegroundColor Green
        Write-Host "  -> Exit Code: $actualExit (Expected: $($tc.ExpectedExit))"
        Write-Host "  -> Verified Diagnostic: Found expected pattern '$($tc.ExpectedPattern)'"
        $passedCount++
    } else {
        Write-Host "RESULT: [TEST FAILED]" -ForegroundColor Red
        Write-Host "  -> Exit Code: $actualExit (Expected: $($tc.ExpectedExit))"
        Write-Host "  -> Output Pattern Match: $patternMatch (Looking for '$($tc.ExpectedPattern)')"
        Write-Host "  -> Output received:"
        Write-Host $outText -ForegroundColor DarkYellow
        $failedCount++
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "SUITE SUMMARY: $passedCount / $($testCases.Count) Test Cases Passed" -ForegroundColor $(if ($failedCount -eq 0) { [ConsoleColor]::Green } else { [ConsoleColor]::Red })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failedCount -gt 0) { exit 1 } else { exit 0 }

