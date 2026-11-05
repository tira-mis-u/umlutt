param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    [switch]$Detailed = $false
)

# Geometry Validator for Draw.io XML
# Returns exit code 0 if no ERRORs, 1 if any ERRORs found.
# Diagnostics are printed for each check.

if (-not (Test-Path $FilePath)) {
    Write-Error "File not found: $FilePath"
    exit 1
}

try {
    [xml]$xmlDoc = Get-Content -Path $FilePath -Raw -Encoding UTF8
} catch {
    Write-Host "[FAIL] XML Parse Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$mxfile = $xmlDoc.mxfile
if (-not $mxfile) { Write-Host "[FAIL] Missing <mxfile>" -ForegroundColor Red; exit 1 }
$diagram = $mxfile.diagram
if (-not $diagram) { Write-Host "[FAIL] Missing <diagram>" -ForegroundColor Red; exit 1 }
$model = $diagram.mxGraphModel
if (-not $model) { Write-Host "[FAIL] Missing <mxGraphModel>" -ForegroundColor Red; exit 1 }
$root = $model.root
if (-not $root) { Write-Host "[FAIL] Missing <root>" -ForegroundColor Red; exit 1 }

$pageWidth = if ($model.pageWidth) { [double]$model.pageWidth } else { 1169.0 }
$pageHeight = if ($model.pageHeight) { [double]$model.pageHeight } else { 827.0 }
$isPaged = ($model.page -eq "1")

$allCells = $root.SelectNodes("mxCell")
$cellMap = @{}
$vertices = @{}
$edges = @()
$edgeMap = @{}
$labels = @()

foreach ($cell in $allCells) {
    $id = $cell.GetAttribute("id")
    if ($id) { $cellMap[$id] = $cell }
    if ($cell.GetAttribute("edge") -eq "1") {
        $edges += $cell
        if ($id) { $edgeMap[$id] = $cell }
    }
}

foreach ($cell in $allCells) {
    $id = $cell.GetAttribute("id")
    $parent = $cell.GetAttribute("parent")
    $style = $cell.GetAttribute("style")
    $val = $cell.GetAttribute("value")
    $isEdge = ($cell.GetAttribute("edge") -eq "1")
    $isVertex = ($cell.GetAttribute("vertex") -eq "1")

    # Form A: Child edgeLabel cell attached to an edge
    $isChildEdgeLabel = ($parent -and $edgeMap.ContainsKey($parent)) -and ($cell.GetAttribute("connectable") -eq "0" -or $style -match "edgeLabel")

    if ($isChildEdgeLabel) {
        $labels += [PSCustomObject]@{
            Id = $id
            ParentEdgeId = $parent
            Value = $val
            Cell = $cell
            IsChildCell = $true
        }
    } elseif ($isEdge) {
        # Form B: Inline label on edge itself
        if (-not [string]::IsNullOrWhiteSpace($val)) {
            $labels += [PSCustomObject]@{
                Id = "${id}_label"
                ParentEdgeId = $id
                Value = $val
                Cell = $cell
                IsChildCell = $false
            }
        }
    } elseif ($isVertex) {
        # Regular domain vertex (only if not an edge-attached label)
        $vertices[$id] = $cell
    }
}

# Parse Geometries — first pass: store raw (local) coordinates
$boxes = @{}
foreach ($id in $vertices.Keys) {
    $v = $vertices[$id]
    $geo = $v.SelectSingleNode("mxGeometry")
    if ($geo) {
        $x = if ($geo.GetAttribute("x")) { [double]$geo.GetAttribute("x") } else { 0.0 }
        $y = if ($geo.GetAttribute("y")) { [double]$geo.GetAttribute("y") } else { 0.0 }
        $w = if ($geo.GetAttribute("width")) { [double]$geo.GetAttribute("width") } else { 0.0 }
        $h = if ($geo.GetAttribute("height")) { [double]$geo.GetAttribute("height") } else { 0.0 }
        $style = $v.GetAttribute("style")
        $val = $v.GetAttribute("value")
        $parent = $v.GetAttribute("parent")

        $isExplicitContainer = ($style -match "(^|;)container=1(;|\$)" -or $style -match "(^|;)swimlane(;|\$)" -or $style -match "(^|;)group(;|\$)")
        # System Boundary: strictly transparent (fillColor=none), top-aligned title, non-rounded or rounded=0. Never Action or State.
        $isSystemBoundary = ($style -match "fillColor=none" -and $style -match "verticalAlign=top" -and ($style -match "shape=rect" -or $style -match "rounded=0") -and -not ($style -match "rounded=1"))
        $isPackageFolder = ($style -match "shape=folder")
        $isContainer = ($isExplicitContainer -or $isSystemBoundary -or $isPackageFolder)
        $isOverlay = ($style -match "intentional_overlay=1" -or $style -match "overlay" -or $style -match "shape=image" -or $style -match "icon")
        $rot = if ($style -match "rotation=([-\d\.]+)") { [double]$matches[1] } else { 0.0 }

        $boxes[$id] = [PSCustomObject]@{
            Id = $id
            Value = $val
            LocalLeft = $x
            LocalTop = $y
            Left = $x      # will be updated to canvas coords below
            Top = $y       # will be updated to canvas coords below
            Right = $x + $w
            Bottom = $y + $h
            Width = $w
            Height = $h
            Parent = $parent
            Style = $style
            IsContainer = $isContainer
            IsExplicitContainer = $isExplicitContainer
            IsSemanticBoundary = $isSystemBoundary
            IsOverlay = $isOverlay
            Rotation = $rot
        }
    }
}

# Second pass: resolve canvas (absolute) coordinates for children of containers.
# Draw.io stores child geometry relative to the parent container's top-left corner.
# Root-level cells (parent = "0" or "1") already use canvas coordinates.
function ResolveCanvasOffset($boxId, [hashtable]$allBoxes) {
    $b = $allBoxes[$boxId]
    if (-not $b) { return @(0.0, 0.0) }
    $p = $b.Parent
    if (-not $p -or $p -eq "0" -or $p -eq "1") { return @(0.0, 0.0) }
    if (-not $allBoxes.ContainsKey($p)) { return @(0.0, 0.0) }
    $parentOffsets = ResolveCanvasOffset $p $allBoxes
    $px = $allBoxes[$p].LocalLeft + $parentOffsets[0]
    $py = $allBoxes[$p].LocalTop  + $parentOffsets[1]
    return @($px, $py)
}

foreach ($id in @($boxes.Keys)) {
    $b = $boxes[$id]
    $p = $b.Parent
    if ($p -and $p -ne "0" -and $p -ne "1" -and $boxes.ContainsKey($p)) {
        $offsets = ResolveCanvasOffset $id $boxes
        $canvasX = $b.LocalLeft + $offsets[0]
        $canvasY = $b.LocalTop  + $offsets[1]
        $b.Left   = $canvasX
        $b.Top    = $canvasY
        $b.Right  = $canvasX + $b.Width
        $b.Bottom = $canvasY + $b.Height
    }
}

$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
$passes = [System.Collections.Generic.List[string]]::new()

# Helper function to check if A is child of B
function IsDescendantOf($childId, $parentId) {
    if (-not $boxes.ContainsKey($childId)) { return $false }
    $currParent = $boxes[$childId].Parent
    while ($currParent -and $currParent -ne "0" -and $currParent -ne "1") {
        if ($currParent -eq $parentId) { return $true }
        if ($boxes.ContainsKey($currParent)) {
            $currParent = $boxes[$currParent].Parent
        } else { break }
    }
    return $false
}

function Get-RotatedBoxVertices($box) {
    $cx = ($box.Left + $box.Right) / 2.0
    $cy = ($box.Top + $box.Bottom) / 2.0
    $hw = $box.Width / 2.0
    $hh = $box.Height / 2.0
    $rad = $box.Rotation * [Math]::PI / 180.0
    $cos = [Math]::Cos($rad)
    $sin = [Math]::Sin($rad)

    $corners = @(
        @(-$hw, -$hh),
        @($hw, -$hh),
        @($hw, $hh),
        @(-$hw, $hh)
    )
    $pts = @()
    foreach ($c in $corners) {
        $rx = $c[0] * $cos - $c[1] * $sin
        $ry = $c[0] * $sin + $c[1] * $cos
        $pts += [PSCustomObject]@{ X = $cx + $rx; Y = $cy + $ry }
    }
    return $pts
}

function Test-ObbOverlap($pts1, $pts2) {
    $polys = @($pts1, $pts2)
    foreach ($poly in $polys) {
        for ($i = 0; $i -lt $poly.Count; $i++) {
            $p1 = $poly[$i]
            $p2 = $poly[($i + 1) % $poly.Count]
            $edgeX = $p2.X - $p1.X
            $edgeY = $p2.Y - $p1.Y
            $axisX = -$edgeY
            $axisY = $edgeX
            $len = [Math]::Sqrt($axisX * $axisX + $axisY * $axisY)
            if ($len -lt 0.0001) { continue }
            $axisX /= $len
            $axisY /= $len

            $min1 = [double]::MaxValue; $max1 = [double]::MinValue
            foreach ($pt in $pts1) {
                $proj = $pt.X * $axisX + $pt.Y * $axisY
                if ($proj -lt $min1) { $min1 = $proj }
                if ($proj -gt $max1) { $max1 = $proj }
            }

            $min2 = [double]::MaxValue; $max2 = [double]::MinValue
            foreach ($pt in $pts2) {
                $proj = $pt.X * $axisX + $pt.Y * $axisY
                if ($proj -lt $min2) { $min2 = $proj }
                if ($proj -gt $max2) { $max2 = $proj }
            }

            if ($max1 -le ($min2 + 0.1) -or $max2 -le ($min1 + 0.1)) {
                return $false
            }
        }
    }
    return $true
}

function Test-SegmentBoxIntersection($p1, $p2, $box) {
    $cx = ($box.Left + $box.Right) / 2.0
    $cy = ($box.Top + $box.Bottom) / 2.0
    $hw = $box.Width / 2.0
    $hh = $box.Height / 2.0

    $x1 = $p1.X
    $y1 = $p1.Y
    $x2 = $p2.X
    $y2 = $p2.Y

    if ($box.Rotation -and [Math]::Abs($box.Rotation) -gt 0.01) {
        $rad = -$box.Rotation * [Math]::PI / 180.0
        $cos = [Math]::Cos($rad)
        $sin = [Math]::Sin($rad)

        $dx1 = $x1 - $cx; $dy1 = $y1 - $cy
        $x1 = $cx + ($dx1 * $cos - $dy1 * $sin)
        $y1 = $cy + ($dx1 * $sin + $dy1 * $cos)

        $dx2 = $x2 - $cx; $dy2 = $y2 - $cy
        $x2 = $cx + ($dx2 * $cos - $dy2 * $sin)
        $y2 = $cy + ($dx2 * $sin + $dy2 * $cos)
    }

    $isEllipse = ($box.Style -match "ellipse")
    if ($isEllipse) {
        # Normalized ellipse collision: scale y by a/b to transform ellipse into a circle of radius a
        $a = $hw
        $b = $hh
        if ($a -le 1.0 -or $b -le 1.0) { return $false }

        $sy1 = $cy + ($y1 - $cy) * ($a / $b)
        $sy2 = $cy + ($y2 - $cy) * ($a / $b)
        $sx1 = $x1
        $sx2 = $x2

        $sdx = $sx2 - $sx1
        $sdy = $sy2 - $sy1
        $dLenSq = ($sdx * $sdx) + ($sdy * $sdy)

        if ($dLenSq -lt 0.0001) {
            $dist = [Math]::Sqrt(($sx1 - $cx) * ($sx1 - $cx) + ($sy1 - $cy) * ($sy1 - $cy))
        } else {
            $t = (($cx - $sx1) * $sdx + ($cy - $sy1) * $sdy) / $dLenSq
            $t = [Math]::Max(0.0, [Math]::Min(1.0, $t))
            $closestX = $sx1 + $t * $sdx
            $closestY = $sy1 + $t * $sdy
            $dist = [Math]::Sqrt(($closestX - $cx) * ($closestX - $cx) + ($closestY - $cy) * ($closestY - $cy))
        }

        # Exact geometric intersection: segment penetrates ellipse if normalized distance <= a
        if ($dist -le $a) {
            return $true
        }
        return $false
    }

    $isRhombus = ($box.Style -match "(^|;)shape=rhombus(;|\$)" -or $box.Style -match "(^|;)rhombus(;|\$)")
    if ($isRhombus) {
        # Exact rhombus polygon intersection for arbitrary width and height (W == H or W != H)
        if ($hw -le 1.0 -or $hh -le 1.0) { return $false }

        # Check if either endpoint is strictly inside or on the boundary of the rhombus: |x-cx|/hw + |y-cy|/hh <= 1.0
        $p1Inside = (([Math]::Abs($x1 - $cx) / $hw) + ([Math]::Abs($y1 - $cy) / $hh)) -le 1.0
        $p2Inside = (([Math]::Abs($x2 - $cx) / $hw) + ([Math]::Abs($y2 - $cy) / $hh)) -le 1.0
        if ($p1Inside -or $p2Inside) { return $true }

        # Check segment-segment intersection with all 4 boundary edges of the rhombus
        $vTop    = [PSCustomObject]@{ X = $cx; Y = $cy - $hh }
        $vRight  = [PSCustomObject]@{ X = $cx + $hw; Y = $cy }
        $vBottom = [PSCustomObject]@{ X = $cx; Y = $cy + $hh }
        $vLeft   = [PSCustomObject]@{ X = $cx - $hw; Y = $cy }

        $rhombusEdges = @(
            @($vTop, $vRight),
            @($vRight, $vBottom),
            @($vBottom, $vLeft),
            @($vLeft, $vTop)
        )

        $dx1 = $x2 - $x1; $dy1 = $y2 - $y1
        foreach ($e in $rhombusEdges) {
            $eP1 = $e[0]; $eP2 = $e[1]
            $dx2 = $eP2.X - $eP1.X; $dy2 = $eP2.Y - $eP1.Y
            $denom = $dx1 * $dy2 - $dy1 * $dx2

            if ([Math]::Abs($denom) -gt 0.000001) {
                $t = (($eP1.X - $x1) * $dy2 - ($eP1.Y - $y1) * $dx2) / $denom
                $u = (($eP1.X - $x1) * $dy1 - ($eP1.Y - $y1) * $dx1) / $denom
                if ($t -ge 0.0 -and $t -le 1.0 -and $u -ge 0.0 -and $u -le 1.0) {
                    return $true
                }
            } else {
                # Parallel or collinear: check if edge segment lies on same infinite line
                $cross = ($eP1.X - $x1) * $dy1 - ($eP1.Y - $y1) * $dx1
                if ([Math]::Abs($cross) -lt 0.0001) {
                    # Collinear: check if 1D interval projections overlap with positive length (> 0.5px)
                    if ([Math]::Abs($dx1) -gt [Math]::Abs($dy1)) {
                        $min1 = [Math]::Min($x1, $x2); $max1 = [Math]::Max($x1, $x2)
                        $min2 = [Math]::Min($eP1.X, $eP2.X); $max2 = [Math]::Max($eP1.X, $eP2.X)
                    } else {
                        $min1 = [Math]::Min($y1, $y2); $max1 = [Math]::Max($y1, $y2)
                        $min2 = [Math]::Min($eP1.Y, $eP2.Y); $max2 = [Math]::Max($eP1.Y, $eP2.Y)
                    }
                    $overlapMin = [Math]::Max($min1, $min2)
                    $overlapMax = [Math]::Min($max1, $max2)
                    if (($overlapMax - $overlapMin) -gt 0.5) {
                        return $true
                    }
                }
            }
        }
        return $false
    }

    # Standard, rounded or rotated rectangular node: Liang-Barsky against local AABB
    $xmin = $cx - $hw + 1.0
    $xmax = $cx + $hw - 1.0
    $ymin = $cy - $hh + 1.0
    $ymax = $cy + $hh - 1.0

    if ($xmax -le $xmin -or $ymax -le $ymin) { return $false }

    $dx = $x2 - $x1
    $dy = $y2 - $y1

    $p = @(-$dx, $dx, -$dy, $dy)
    $q = @(($x1 - $xmin), ($xmax - $x1), ($y1 - $ymin), ($ymax - $y1))
    $u1 = 0.0
    $u2 = 1.0

    for ($k = 0; $k -lt 4; $k++) {
        if ([Math]::Abs($p[$k]) -lt 0.00001) {
            if ($q[$k] -lt 0.0) { return $false }
        } elseif ($p[$k] -lt 0.0) {
            $r = $q[$k] / $p[$k]
            if ($r -gt $u2) { return $false }
            if ($r -gt $u1) { $u1 = $r }
        } else {
            $r = $q[$k] / $p[$k]
            if ($r -lt $u1) { return $false }
            if ($r -lt $u2) { $u2 = $r }
        }
    }

    if ($u1 -lt $u2 -and $u1 -lt 1.0 -and $u2 -gt 0.0) {
        return $true
    }
    return $false
}

# -------------------------------------------------------------
# 1. NODE-NODE COLLISION & 2. CONTAINER-CHILD CONTAINMENT
# -------------------------------------------------------------
$vKeys = @($boxes.Keys)
$hardOverlapFound = $false
$validContainmentCount = 0
$containerEscapeFound = $false

# Direct parent-child container boundary validation (using canvas-resolved coords)
# Every XML child must reside within its explicit parent container boundary.
foreach ($id in $boxes.Keys) {
    $b = $boxes[$id]
    if ($boxes.ContainsKey($b.Parent) -and $b.Parent -ne "0" -and $b.Parent -ne "1") {
        $pBox = $boxes[$b.Parent]
        # Tolerance of 1px for rounding artefacts
        $tol = 1.0
        $escapes = ($b.Left -lt ($pBox.Left - $tol) -or $b.Right -gt ($pBox.Right + $tol) -or $b.Top -lt ($pBox.Top - $tol) -or $b.Bottom -gt ($pBox.Bottom + $tol))
        if ($escapes) {
            $containerEscapeFound = $true
            $errors.Add("2. [Container-Child Out-of-Bounds] Child node '$id' [$($b.Left),$($b.Top),$($b.Width)x$($b.Height)] extends outside container parent '$($pBox.Id)' [$($pBox.Left),$($pBox.Top),$($pBox.Width)x$($pBox.Height)].")
        } else {
            $validContainmentCount++
        }
    }
}

for ($i = 0; $i -lt $vKeys.Count; $i++) {
    for ($j = $i + 1; $j -lt $vKeys.Count; $j++) {
        $b1 = $boxes[$vKeys[$i]]
        $b2 = $boxes[$vKeys[$j]]

        # Check containment
        $b1InB2 = ($b1.Left -ge ($b2.Left - 0.5) -and $b1.Right -le ($b2.Right + 0.5) -and $b1.Top -ge ($b2.Top - 0.5) -and $b1.Bottom -le ($b2.Bottom + 0.5))
        $b2InB1 = ($b2.Left -ge ($b1.Left - 0.5) -and $b2.Right -le ($b1.Right + 0.5) -and $b2.Top -ge ($b1.Top - 0.5) -and $b2.Bottom -le ($b1.Bottom + 0.5))

        if ($b1InB2 -and $b2.IsContainer) {
            # Check XML Containment
            if ($b1.Parent -eq $b2.Id -or (IsDescendantOf $b1.Id $b2.Id)) {
                $validContainmentCount++
                continue
            }
            # Check Semantic Diagram Containment
            # System Boundary encloses Use Cases, Notes, or child Packages; Swimlane encloses workflow actions/nodes
            if ($b2.IsSemanticBoundary) {
                if ($b1.Style -match "ellipse" -or $b1.Style -match "shape=note" -or $b1.Style -match "shape=folder") {
                    $validContainmentCount++
                    continue
                }
            } elseif ($b2.Style -match "swimlane") {
                $validContainmentCount++
                continue
            }
        }
        if ($b2InB1 -and $b1.IsContainer) {
            # Check XML Containment
            if ($b2.Parent -eq $b1.Id -or (IsDescendantOf $b2.Id $b1.Id)) {
                $validContainmentCount++
                continue
            }
            # Check Semantic Diagram Containment
            if ($b1.IsSemanticBoundary) {
                if ($b2.Style -match "ellipse" -or $b2.Style -match "shape=note" -or $b2.Style -match "shape=folder") {
                    $validContainmentCount++
                    continue
                }
            } elseif ($b1.Style -match "swimlane") {
                $validContainmentCount++
                continue
            }
        }
        if ($b1.IsOverlay -or $b2.IsOverlay) {
            # Intentional overlay exemption
            continue
        }
        # Flow Final Composite Vertex Pair Exemption:
        # Strictly restricted to the two crossed diagonal line vertices inside an ellipse Flow Final container.
        # Must satisfy all 7 Flow Final structural constraints:
        # 1. Identical parent container
        # 2. Parent is an ellipse container (circle)
        # 3. Both children are shape=line vertices
        # 4. One child has rotation=45 and the other has rotation=-45 (or 315)
        # 5. Both children have connectable=0
        # 6. Both line lengths match parent diameter
        # 7. Both lines are centered at parent center (local coordinates)
        if ($b1.Parent -eq $b2.Parent -and $b1.Parent -ne "0" -and $b1.Parent -ne "1" -and $boxes.ContainsKey($b1.Parent)) {
            $pBox = $boxes[$b1.Parent]
            $pStyle = $pBox.Style
            $parentIsCircle = ($pBox.IsContainer -and $pStyle -match "ellipse" -and ($pStyle -match "aspect=fixed" -or [Math]::Abs($pBox.Width - $pBox.Height) -lt 0.01))
            
            if ($parentIsCircle) {
                $b1Connectable = ($vertices[$b1.Id].GetAttribute("connectable") -ne "0")
                $b2Connectable = ($vertices[$b2.Id].GetAttribute("connectable") -ne "0")
                
                $b1IsLine = ($b1.Style -match "(^|;)shape=line(;|\$)")
                $b2IsLine = ($b2.Style -match "(^|;)shape=line(;|\$)")
                
                if (-not $b1Connectable -and -not $b2Connectable -and $b1IsLine -and $b2IsLine) {
                    $b1Rot = if ($b1.Style -match "rotation=([-\d\.]+)") { [double]$matches[1] } else { 0.0 }
                    $b2Rot = if ($b2.Style -match "rotation=([-\d\.]+)") { [double]$matches[1] } else { 0.0 }
                    $isOppositeRot = (($b1Rot -eq 45.0 -and ($b2Rot -eq -45.0 -or $b2Rot -eq 315.0)) -or (($b1Rot -eq -45.0 -or $b1Rot -eq 315.0) -and $b2Rot -eq 45.0))
                    
                    $dimMatch = ([Math]::Abs($b1.Width - $pBox.Width) -le 1.0 -and [Math]::Abs($b2.Width - $pBox.Width) -le 1.0)
                    
                    $b1CenterX = $b1.LocalLeft + ($b1.Width / 2.0)
                    $b1CenterY = $b1.LocalTop + ($b1.Height / 2.0)
                    $b2CenterX = $b2.LocalLeft + ($b2.Width / 2.0)
                    $b2CenterY = $b2.LocalTop + ($b2.Height / 2.0)
                    $pCenterX = $pBox.Width / 2.0
                    $pCenterY = $pBox.Height / 2.0
                    
                    $isCentered = ([Math]::Abs($b1CenterX - $pCenterX) -le 1.0 -and [Math]::Abs($b1CenterY - $pCenterY) -le 1.0 -and [Math]::Abs($b2CenterX - $pCenterX) -le 1.0 -and [Math]::Abs($b2CenterY - $pCenterY) -le 1.0)
                    
                    if ($isOppositeRot -and $dimMatch -and $isCentered) {
                        continue
                    }
                }
            }
        }
        if (IsDescendantOf $b1.Id $b2.Id -or IsDescendantOf $b2.Id $b1.Id) {
            continue
        }

        # Calculate Collision (Rotation-aware OBB or standard AABB)
        $hasRotation = ([Math]::Abs($b1.Rotation) -gt 0.01 -or [Math]::Abs($b2.Rotation) -gt 0.01)
        if ($hasRotation) {
            $pts1 = Get-RotatedBoxVertices $b1
            $pts2 = Get-RotatedBoxVertices $b2
            if (Test-ObbOverlap $pts1 $pts2) {
                $hardOverlapFound = $true
                $errors.Add("1. [Node-Node Collision] Hard overlap between Cell '$($b1.Id)' [$($b1.Left),$($b1.Top),$($b1.Width)x$($b1.Height), rot=$($b1.Rotation)] and Cell '$($b2.Id)' [$($b2.Left),$($b2.Top),$($b2.Width)x$($b2.Height), rot=$($b2.Rotation)].")
            }
        } else {
            $ix = [Math]::Max(0.0, [Math]::Min($b1.Right, $b2.Right) - [Math]::Max($b1.Left, $b2.Left))
            $iy = [Math]::Max(0.0, [Math]::Min($b1.Bottom, $b2.Bottom) - [Math]::Max($b1.Top, $b2.Top))

            if ($ix -gt 0 -and $iy -gt 0) {
                $hardOverlapFound = $true
                $errors.Add("1. [Node-Node Collision] Hard overlap between Cell '$($b1.Id)' [$($b1.Left),$($b1.Top),$($b1.Width)x$($b1.Height)] and Cell '$($b2.Id)' [$($b2.Left),$($b2.Top),$($b2.Width)x$($b2.Height)]. Overlap Area: ($ix x $iy px).")
            } elseif ($ix -gt -30 -and $iy -gt -30 -and -not $b1.IsContainer -and -not $b2.IsContainer) {
                # Clearance warning (< 30px)
                $distX = [Math]::Max(0.0, [Math]::Max($b1.Left, $b2.Left) - [Math]::Min($b1.Right, $b2.Right))
                $distY = [Math]::Max(0.0, [Math]::Max($b1.Top, $b2.Top) - [Math]::Min($b1.Bottom, $b2.Bottom))
                if ($distX -lt 30 -and $distY -lt 30) {
                    $warnings.Add("1. [Clearance Warning] Node '$($b1.Id)' and Node '$($b2.Id)' distance < 30px (dx=$distX, dy=$distY).")
                }
            }
        }
    }
}
if (-not $hardOverlapFound) {
    $passes.Add("1. [Node-Node Collision] Zero hard overlaps detected between independent nodes.")
}
if (-not $containerEscapeFound) {
    if ($validContainmentCount -gt 0) {
        $passes.Add("2. [Container-Child Containment] $validContainmentCount valid container-child containment relationship(s) verified.")
    } else {
        $passes.Add("2. [Container-Child Containment] No invalid container escapes detected.")
    }
}

# -------------------------------------------------------------
# 3. TEXT OVERFLOW CHECK
# -------------------------------------------------------------
$overflowCount = 0
foreach ($id in $boxes.Keys) {
    $b = $boxes[$id]
    if (-not [string]::IsNullOrWhiteSpace($b.Value) -and -not $b.IsContainer) {
        # Normalize HTML and extract lines
        $val = $b.Value
        # Replace <br> and <hr> with newline
        $val = [System.Text.RegularExpressions.Regex]::Replace($val, "<(br|hr)\s*/?>", "`n", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        # Replace block ending tags with newline
        $val = [System.Text.RegularExpressions.Regex]::Replace($val, "</(p|div|tr|li|h[1-6])>", "`n", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        # Strip all remaining HTML tags
        $val = [System.Text.RegularExpressions.Regex]::Replace($val, "<[^>]+>", "")
        $cleanText = [System.Net.WebUtility]::HtmlDecode($val).Trim()

        # Split into logical lines, filtering empty whitespace lines caused by adjacent closing tags
        $rawLines = @($cleanText -split "\r?\n")
        $lines = @()
        foreach ($rl in $rawLines) {
            $t = $rl.Trim()
            if ($t.Length -gt 0) {
                $lines += $t
            }
        }

        if ($lines.Count -gt 0) {
            # Font size metrics
            $fontSize = 12.0
            if ($b.Style -match "fontSize=([0-9\.]+)") {
                $fontSize = [double]$matches[1]
            }
            # Latin ~0.55*fontSize, Vietnamese with tone marks ~0.58-0.60*fontSize
            $charWidth = $fontSize * 0.58
            $lineHeight = $fontSize * 1.4

            $maxLineChars = 0
            foreach ($l in $lines) {
                if ($l.Length -gt $maxLineChars) { $maxLineChars = $l.Length }
            }
            $maxLineWidth = $maxLineChars * $charWidth

            $hasWrap = ($b.Style -match "whiteSpace=wrap")
            $isActor = ($b.Style -match "shape=umlActor")
            $isEllipse = ($b.Style -match "ellipse")
            $hasExternalLabel = ($b.Style -match "verticalLabelPosition=(top|bottom)" -or $b.Style -match "labelPosition=(left|right)")

            if ($hasWrap) {
                # Text wraps within available node width
                $availW = if ($isEllipse) { [Math]::Max(20.0, ($b.Width * 0.75) - 10.0) } else { [Math]::Max(20.0, $b.Width - 10.0) }
                $totalVisualLines = 0
                foreach ($l in $lines) {
                    $subLines = [Math]::Max(1, [int][Math]::Ceiling(($l.Length * $charWidth) / $availW))
                    $totalVisualLines += $subLines
                }
                $estHeight = $totalVisualLines * $lineHeight
                $availH = if ($isEllipse) { [Math]::Max(10.0, ($b.Height * 0.8) - 6.0) } else { [Math]::Max(10.0, $b.Height - 6.0) }

                if ($estHeight -gt $availH -and -not $hasExternalLabel) {
                    $overflowCount++
                    $warnings.Add("3. [Text Overflow Risk] Node '$id' ('$cleanText'): Est text height $([Math]::Round($estHeight, 1)) px exceeds available height $([Math]::Round($availH, 1)) px with wrap ($totalVisualLines visual lines).")
                }
            } else {
                # Text does not wrap
                $totalLines = $lines.Count
                $estHeight = $totalLines * $lineHeight

                if ($maxLineWidth -gt ($b.Width - 8.0)) {
                    if ((-not $isActor -and -not $hasExternalLabel) -or $maxLineWidth -gt 150) {
                        $overflowCount++
                        $warnings.Add("3. [Text Overflow Risk] Node '$id' ('$cleanText'): Est text width $([Math]::Round($maxLineWidth, 1)) px exceeds node width $($b.Width) px without wrap.")
                    }
                } elseif ($estHeight -gt ($b.Height - 6.0) -and -not $isActor -and -not $hasExternalLabel) {
                    $overflowCount++
                    $warnings.Add("3. [Text Overflow Risk] Node '$id' ('$cleanText'): Est text height $([Math]::Round($estHeight, 1)) px exceeds node height $($b.Height) px without wrap ($totalLines lines).")
                }
            }
        }
    }
}
if ($overflowCount -eq 0) {
    $passes.Add("3. [Text Overflow] All node labels fit within their geometric bounds.")
}

# -------------------------------------------------------------
# 4. EDGE-NODE COLLISION & 8. ENDPOINT ATTACHMENT
# -------------------------------------------------------------
$edgeSegments = @()
$edgePolylines = @{}
$edgeNodeCollisionFound = $false
$endpointErrorFound = $false

foreach ($edge in $edges) {
    $edgeId = $edge.GetAttribute("id")
    $source = $edge.GetAttribute("source")
    $target = $edge.GetAttribute("target")

    # 8. Endpoint attachment check
    if ([string]::IsNullOrWhiteSpace($source) -or [string]::IsNullOrWhiteSpace($target)) {
        $endpointErrorFound = $true
        $errors.Add("8. [Endpoint Attachment - Level 1: Reference Integrity] Edge '$edgeId' is missing valid source or target attribute (source='$source', target='$target').")
        continue
    }
    if (-not $boxes.ContainsKey($source) -or -not $boxes.ContainsKey($target)) {
        $endpointErrorFound = $true
        $errors.Add("8. [Endpoint Attachment - Level 1: Reference Integrity] Edge '$edgeId' references non-existent source ('$source') or target ('$target').")
        continue
    }

    $srcBox = $boxes[$source]
    $tgtBox = $boxes[$target]
    $style = $edge.GetAttribute("style")

    # Level 2: Port Configuration Check (entry/exit ranges 0.0 to 1.0)
    if ($style -match "exitX=([0-9\.\-]+)") {
        $px = [double]$matches[1]
        if ($px -lt 0.0 -or $px -gt 1.0) {
            $endpointErrorFound = $true
            $errors.Add("8. [Endpoint Attachment - Level 2: Port Configuration] Edge '$edgeId' has out-of-range exitX=$px (must be 0.0 to 1.0).")
        }
    }
    if ($style -match "exitY=([0-9\.\-]+)") {
        $py = [double]$matches[1]
        if ($py -lt 0.0 -or $py -gt 1.0) {
            $endpointErrorFound = $true
            $errors.Add("8. [Endpoint Attachment - Level 2: Port Configuration] Edge '$edgeId' has out-of-range exitY=$py (must be 0.0 to 1.0).")
        }
    }
    if ($style -match "entryX=([0-9\.\-]+)") {
        $px = [double]$matches[1]
        if ($px -lt 0.0 -or $px -gt 1.0) {
            $endpointErrorFound = $true
            $errors.Add("8. [Endpoint Attachment - Level 2: Port Configuration] Edge '$edgeId' has out-of-range entryX=$px (must be 0.0 to 1.0).")
        }
    }
    if ($style -match "entryY=([0-9\.\-]+)") {
        $py = [double]$matches[1]
        if ($py -lt 0.0 -or $py -gt 1.0) {
            $endpointErrorFound = $true
            $errors.Add("8. [Endpoint Attachment - Level 2: Port Configuration] Edge '$edgeId' has out-of-range entryY=$py (must be 0.0 to 1.0).")
        }
    }

    # Resolve points
    $pts = @()

    # Source port approximation
    $srcX = ($srcBox.Left + $srcBox.Right) / 2.0
    $srcY = ($srcBox.Top + $srcBox.Bottom) / 2.0
    if ($style -match "exitX=([0-9\.]+)") { $srcX = $srcBox.Left + [double]$matches[1] * $srcBox.Width }
    if ($style -match "exitY=([0-9\.]+)") { $srcY = $srcBox.Top + [double]$matches[1] * $srcBox.Height }
    $pts += [PSCustomObject]@{ X = $srcX; Y = $srcY }

    $waypoints = $edge.SelectNodes("mxGeometry/Array/mxPoint")
    if ($waypoints) {
        foreach ($wp in $waypoints) {
            $wx = [double]$wp.GetAttribute("x")
            $wy = [double]$wp.GetAttribute("y")
            $pts += [PSCustomObject]@{ X = $wx; Y = $wy }
        }
    }

    # Target port approximation
    $tgtX = ($tgtBox.Left + $tgtBox.Right) / 2.0
    $tgtY = ($tgtBox.Top + $tgtBox.Bottom) / 2.0
    if ($style -match "entryX=([0-9\.]+)") { $tgtX = $tgtBox.Left + [double]$matches[1] * $tgtBox.Width }
    if ($style -match "entryY=([0-9\.]+)") { $tgtY = $tgtBox.Top + [double]$matches[1] * $tgtBox.Height }
    $pts += [PSCustomObject]@{ X = $tgtX; Y = $tgtY }

    $edgePolylines[$edgeId] = $pts

    # Build segments for collision & crossing
    for ($p = 0; $p -lt $pts.Count - 1; $p++) {
        $p1 = $pts[$p]
        $p2 = $pts[$p + 1]
        $edgeSegments += [PSCustomObject]@{
            EdgeId = $edgeId
            Source = $source
            Target = $target
            P1 = $p1
            P2 = $p2
            IsFirst = ($p -eq 0)
            IsLast = ($p -eq ($pts.Count - 2))
        }

        # Check intersection with unrelated vertices (4. Edge-Node Collision via Liang-Barsky)
        foreach ($vId in $boxes.Keys) {
            if ($vId -eq $source -or $vId -eq $target) { continue }
            $vb = $boxes[$vId]
            if ($vb.IsContainer -or $vb.IsOverlay) { continue }

            # Broad-phase bounding box check
            $segMinX = [Math]::Min($p1.X, $p2.X)
            $segMaxX = [Math]::Max($p1.X, $p2.X)
            $segMinY = [Math]::Min($p1.Y, $p2.Y)
            $segMaxY = [Math]::Max($p1.Y, $p2.Y)

            $maxDim = [Math]::Max($vb.Width, $vb.Height)
            $vbMargin = if ($vb.Rotation -and [Math]::Abs($vb.Rotation) -gt 0.01) { $maxDim * 0.5 } else { 0.0 }
            $vbMinX = $vb.Left - $vbMargin
            $vbMaxX = $vb.Right + $vbMargin
            $vbMinY = $vb.Top - $vbMargin
            $vbMaxY = $vb.Bottom + $vbMargin

            if ($segMaxX -lt $vbMinX -or $segMinX -gt $vbMaxX -or $segMaxY -lt $vbMinY -or $segMinY -gt $vbMaxY) {
                continue
            }

            # Narrow-phase: Liang-Barsky line-box clipping in local frame
            if (Test-SegmentBoxIntersection $p1 $p2 $vb) {
                $edgeNodeCollisionFound = $true
                $errors.Add("4. [Edge-Node Collision] Edge '$edgeId' segment ($([Math]::Round($p1.X, 1)),$([Math]::Round($p1.Y, 1)))-($([Math]::Round($p2.X, 1)),$([Math]::Round($p2.Y, 1))) cuts through unrelated Node '$vId' [$($vb.Left),$($vb.Top),$($vb.Width)x$($vb.Height)].")
            }
        }
    }
}

if (-not $edgeNodeCollisionFound) {
    $passes.Add("4. [Edge-Node Collision] No connectors cut through unrelated nodes.")
}
if (-not $endpointErrorFound) {
    $passes.Add("8. [Endpoint Attachment] Level 1 (Reference Integrity) and Level 2 (Port Configuration) verified for all $($edges.Count) edge(s). Level 3 (Geometric Attachment): Visual verification pending (render engine required).")
}

# -------------------------------------------------------------
# 5. EDGE-LABEL COLLISION
# -------------------------------------------------------------
$labelCollisionFound = $false
foreach ($lbl in $labels) {
    $parentEdgeId = $lbl.ParentEdgeId
    $lblVal = $lbl.Value
    if ([string]::IsNullOrWhiteSpace($lblVal)) { continue }
    $cell = $lbl.Cell
    $geo = $cell.SelectSingleNode("mxGeometry")
    if ($geo -and $edgePolylines.ContainsKey($parentEdgeId)) {
        $pts = $edgePolylines[$parentEdgeId]
        if ($pts.Count -ge 2) {
            $isRelative = ($geo.GetAttribute("relative") -eq "1" -or $geo.GetAttribute("relative") -eq "true")

            if ($isRelative) {
                # Polyline arc-length parameterization
                $totalLen = 0.0
                $segLens = @()
                for ($k = 0; $k -lt $pts.Count - 1; $k++) {
                    $segDx = $pts[$k+1].X - $pts[$k].X
                    $segDy = $pts[$k+1].Y - $pts[$k].Y
                    $len = [Math]::Sqrt($segDx * $segDx + $segDy * $segDy)
                    $segLens += $len
                    $totalLen += $len
                }

                # Draw.io relative position 'x':
                # Default is 0 (center of edge, t = 0.5)
                # x ranges from -1.0 (start) to 1.0 (end)
                # mxGraph getPoint: gx = rx / 2, dist = Math.round((gx + 0.5) * totalLen)
                $rx = if ($geo.GetAttribute("x")) { [double]$geo.GetAttribute("x") } else { 0.0 }
                $gx = $rx / 2.0
                $dist = [Math]::Round(($gx + 0.5) * $totalLen)

                # Segment selection matching mxGraph getPoint loop
                $segment = if ($segLens.Count -gt 0) { $segLens[0] } else { 0.0 }
                $accumLen = 0.0
                $index = 1
                $pointCount = $pts.Count

                while ($dist -ge [Math]::Round($accumLen + $segment) -and $index -lt ($pointCount - 1)) {
                    $accumLen += $segment
                    $segment = $segLens[$index]
                    $index++
                }

                $factor = if ($segment -eq 0.0) { 0.0 } else { ($dist - $accumLen) / $segment }
                $p0 = $pts[$index - 1]
                $pe = $pts[$index]

                # mxGraph getPoint formula:
                # nx = dy / segment; ny = dx / segment
                # x = bx + (nx * gy + offsetX); y = by - (ny * gy - offsetY)
                $segDx = $pe.X - $p0.X
                $segDy = $pe.Y - $p0.Y
                $nx = if ($segment -eq 0.0) { 0.0 } else { $segDy / $segment }
                $ny = if ($segment -eq 0.0) { 0.0 } else { $segDx / $segment }

                $ry = if ($geo.GetAttribute("y")) { [double]$geo.GetAttribute("y") } else { 0.0 }
                $offset = $geo.SelectSingleNode("mxPoint[@as='offset']")
                $ox = if ($offset -and $offset.GetAttribute("x")) { [double]$offset.GetAttribute("x") } else { 0.0 }
                $oy = if ($offset -and $offset.GetAttribute("y")) { [double]$offset.GetAttribute("y") } else { 0.0 }

                $lblCenterX = $p0.X + ($segDx * $factor) + ($nx * $ry + $ox)
                $lblCenterY = $p0.Y + ($segDy * $factor) - ($ny * $ry - $oy)
            } else {
                # relative=false (or missing relative attribute):
                # According to mxGraph updateEdgeLabelOffset:
                # p0 = points[0], pe = points[points.length - 1]
                # x = p0.x + (pe.x - p0.x)/2 + ox
                # y = p0.y + (pe.y - p0.y)/2 + oy
                $p0 = $pts[0]
                $pe = $pts[$pts.Count - 1]
                $dx = $pe.X - $p0.X
                $dy = $pe.Y - $p0.Y

                $offset = $geo.SelectSingleNode("mxPoint[@as='offset']")
                $ox = if ($offset -and $offset.GetAttribute("x")) { [double]$offset.GetAttribute("x") } else { 0.0 }
                $oy = if ($offset -and $offset.GetAttribute("y")) { [double]$offset.GetAttribute("y") } else { 0.0 }

                $lblCenterX = $p0.X + ($dx / 2.0) + $ox
                $lblCenterY = $p0.Y + ($dy / 2.0) + $oy
            }

            # Rendered text bounding box calculation (emulating mxText.updateBoundingBox & mxUtils.getAlignmentAsPoint):
            # mxCellRenderer.prototype.getLabelBounds(state) defines Layout Bounds with origin at state.absoluteOffset.
            # When text is rendered, mxText applies margin offsets based on align and verticalAlign:
            # - align=center: dx = -0.5 * W; align=left: dx = 0; align=right: dx = -W
            # - verticalAlign=middle: dy = -0.5 * H; verticalAlign=top: dy = 0; verticalAlign=bottom: dy = -H
            # Note: For unconstrained text (width/height undeclared), dimensions are an Approximation/Heuristic ($charLen * 7px).
            $hasExplicitW = ($geo.GetAttribute("width") -ne $null -and [double]$geo.GetAttribute("width") -gt 0)
            $hasExplicitH = ($geo.GetAttribute("height") -ne $null -and [double]$geo.GetAttribute("height") -gt 0)

            $lblStyle = $cell.GetAttribute("style")
            $align = if ($lblStyle -match "align=([a-z]+)") { $matches[1] } else { "center" }
            $valign = if ($lblStyle -match "verticalAlign=([a-z]+)") { $matches[1] } else { "middle" }

            $ptX = if ($align -eq "left") { 0.0 } elseif ($align -eq "right") { -1.0 } else { -0.5 }
            $ptY = if ($valign -eq "top") { 0.0 } elseif ($valign -eq "bottom") { -1.0 } else { -0.5 }

            if ($hasExplicitW -and $hasExplicitH) {
                # Explicit dimensions defined in mxGeometry (ignoreStringSize = true in mxText)
                $lblW = [double]$geo.GetAttribute("width")
                $lblH = [double]$geo.GetAttribute("height")
            } else {
                # Unconstrained edge label: Approximation/Heuristic based on character length and default line height
                $cleanText = [System.Net.WebUtility]::HtmlDecode([System.Text.RegularExpressions.Regex]::Replace($lblVal, "<[^>]+>", " ")).Trim()
                $charLen = [Math]::Max(4, $cleanText.Length)
                $lblW = if ($hasExplicitW) { [double]$geo.GetAttribute("width") } else { [Math]::Max(40.0, $charLen * 7.0) }
                $lblH = if ($hasExplicitH) { [double]$geo.GetAttribute("height") } else { 20.0 }
            }

            $lblLeft = $lblCenterX + ($ptX * $lblW)
            $lblTop = $lblCenterY + ($ptY * $lblH)
            $lblRight = $lblLeft + $lblW
            $lblBottom = $lblTop + $lblH

            foreach ($vId in $boxes.Keys) {
                $vb = $boxes[$vId]
                if ($vb.IsContainer -or $vb.IsOverlay) { continue }

                $ix = [Math]::Max(0.0, [Math]::Min($lblRight, $vb.Right) - [Math]::Max($lblLeft, $vb.Left))
                $iy = [Math]::Max(0.0, [Math]::Min($lblBottom, $vb.Bottom) - [Math]::Max($lblTop, $vb.Top))
                if ($ix -gt 0 -and $iy -gt 0) {
                    $labelCollisionFound = $true
                    $warnings.Add("5. [Edge-Label Collision Warning] Label '$lblVal' on edge '$parentEdgeId' overlaps Node '$vId' at ($([Math]::Round($lblCenterX, 1)), $([Math]::Round($lblCenterY, 1))).")
                }
            }
        }
    }
}
if (-not $labelCollisionFound) {
    $passes.Add("5. [Edge-Label Clearance] Edge labels do not collide with adjacent nodes.")
}

# -------------------------------------------------------------
# 6. EDGE-EDGE OVERLAP & 7. EDGE CROSSING
# -------------------------------------------------------------
$edgeOverlapFound = $false
$edgeCrossingCount = 0

for ($s1 = 0; $s1 -lt $edgeSegments.Count; $s1++) {
    for ($s2 = $s1 + 1; $s2 -lt $edgeSegments.Count; $s2++) {
        $seg1 = $edgeSegments[$s1]
        $seg2 = $edgeSegments[$s2]

        if ($seg1.EdgeId -eq $seg2.EdgeId) { continue }

        $s1Horiz = ([Math]::Abs($seg1.P1.Y - $seg1.P2.Y) -lt 0.01)
        $s2Horiz = ([Math]::Abs($seg2.P1.Y - $seg2.P2.Y) -lt 0.01)
        $s1Vert = ([Math]::Abs($seg1.P1.X - $seg1.P2.X) -lt 0.01)
        $s2Vert = ([Math]::Abs($seg2.P1.X - $seg2.P2.X) -lt 0.01)

        # Check Collinear Overlap
        if ($s1Horiz -and $s2Horiz -and [Math]::Abs($seg1.P1.Y - $seg2.P1.Y) -lt 1.0) {
            $overlapLen = [Math]::Min([Math]::Max($seg1.P1.X, $seg1.P2.X), [Math]::Max($seg2.P1.X, $seg2.P2.X)) - [Math]::Max([Math]::Min($seg1.P1.X, $seg1.P2.X), [Math]::Min($seg2.P1.X, $seg2.P2.X))
            if ($overlapLen -gt 25.0) {
                $edgeOverlapFound = $true
                $warnings.Add("6. [Edge-Edge Overlap] Edge '$($seg1.EdgeId)' and Edge '$($seg2.EdgeId)' share collinear horizontal overlap of $overlapLen px at y=$($seg1.P1.Y).")
            }
        } elseif ($s1Vert -and $s2Vert -and [Math]::Abs($seg1.P1.X - $seg2.P1.X) -lt 1.0) {
            $overlapLen = [Math]::Min([Math]::Max($seg1.P1.Y, $seg1.P2.Y), [Math]::Max($seg2.P1.Y, $seg2.P2.Y)) - [Math]::Max([Math]::Min($seg1.P1.Y, $seg1.P2.Y), [Math]::Min($seg2.P1.Y, $seg2.P2.Y))
            if ($overlapLen -gt 25.0) {
                $edgeOverlapFound = $true
                $warnings.Add("6. [Edge-Edge Overlap] Edge '$($seg1.EdgeId)' and Edge '$($seg2.EdgeId)' share collinear vertical overlap of $overlapLen px at x=$($seg1.P1.X).")
            }
        }

        # Check Edge Crossing (H vs V)
        if ($s1Horiz -and $s2Vert) {
            $hMinX = [Math]::Min($seg1.P1.X, $seg1.P2.X); $hMaxX = [Math]::Max($seg1.P1.X, $seg1.P2.X)
            $vMinY = [Math]::Min($seg2.P1.Y, $seg2.P2.Y); $vMaxY = [Math]::Max($seg2.P1.Y, $seg2.P2.Y)
            $crossX = $seg2.P1.X; $crossY = $seg1.P1.Y

            if ($crossX -gt ($hMinX + 1) -and $crossX -lt ($hMaxX - 1) -and $crossY -gt ($vMinY + 1) -and $crossY -lt ($vMaxY - 1)) {
                $edgeCrossingCount++
                $warnings.Add("7. [Edge Crossing] Edge '$($seg1.EdgeId)' crosses Edge '$($seg2.EdgeId)' at ($crossX, $crossY).")
            }
        } elseif ($s1Vert -and $s2Horiz) {
            $vMinY = [Math]::Min($seg1.P1.Y, $seg1.P2.Y); $vMaxY = [Math]::Max($seg1.P1.Y, $seg1.P2.Y)
            $hMinX = [Math]::Min($seg2.P1.X, $seg2.P2.X); $hMaxX = [Math]::Max($seg2.P1.X, $seg2.P2.X)
            $crossX = $seg1.P1.X; $crossY = $seg2.P1.Y

            if ($crossX -gt ($hMinX + 1) -and $crossX -lt ($hMaxX - 1) -and $crossY -gt ($vMinY + 1) -and $crossY -lt ($vMaxY - 1)) {
                $edgeCrossingCount++
                $warnings.Add("7. [Edge Crossing] Edge '$($seg1.EdgeId)' crosses Edge '$($seg2.EdgeId)' at ($crossX, $crossY).")
            }
        }
    }
}

if (-not $edgeOverlapFound) {
    $passes.Add("6. [Edge-Edge Overlap] No long overlapping edge corridors detected.")
}
if ($edgeCrossingCount -eq 0) {
    $passes.Add("7. [Edge Crossing] Zero edge crossings detected.")
} else {
    $passes.Add("7. [Edge Crossing] Detected $edgeCrossingCount crossing(s) (logged as optimization warnings).")
}

# -------------------------------------------------------------
# 9. PORT CONGESTION CHECK
# -------------------------------------------------------------
$portUsage = @{}
foreach ($edge in $edges) {
    $edgeId = $edge.GetAttribute("id")
    $source = $edge.GetAttribute("source")
    $target = $edge.GetAttribute("target")
    $style = $edge.GetAttribute("style")

    # Only track explicit ports (exitX & exitY present, or entryX & entryY present)
    $mEx = [System.Text.RegularExpressions.Regex]::Match($style, "exitX=([0-9\.]+)")
    $mEy = [System.Text.RegularExpressions.Regex]::Match($style, "exitY=([0-9\.]+)")
    if ($mEx.Success -and $mEy.Success) {
        $exitKey = "${source}_exit_($($mEx.Groups[1].Value),$($mEy.Groups[1].Value))"
        if (-not $portUsage.ContainsKey($exitKey)) { $portUsage[$exitKey] = @() }
        $portUsage[$exitKey] += $edgeId
    }

    $mEnx = [System.Text.RegularExpressions.Regex]::Match($style, "entryX=([0-9\.]+)")
    $mEny = [System.Text.RegularExpressions.Regex]::Match($style, "entryY=([0-9\.]+)")
    if ($mEnx.Success -and $mEny.Success) {
        $entryKey = "${target}_entry_($($mEnx.Groups[1].Value),$($mEny.Groups[1].Value))"
        if (-not $portUsage.ContainsKey($entryKey)) { $portUsage[$entryKey] = @() }
        $portUsage[$entryKey] += $edgeId
    }
}

$portCongestionFound = $false
foreach ($pKey in $portUsage.Keys) {
    $conns = $portUsage[$pKey]
    if ($conns.Count -ge 3) {
        $portCongestionFound = $true
        $warnings.Add("9. [Port Congestion] Port '$pKey' has $($conns.Count) connections: $($conns -join ', ').")
    }
}
if (-not $portCongestionFound) {
    $passes.Add("9. [Port Congestion] All ports have balanced connections (< 3 per specific port).")
}

# -------------------------------------------------------------
# 10. CANVAS BOUNDS CHECK
# -------------------------------------------------------------
$boundsErrorFound = $false
foreach ($id in $boxes.Keys) {
    $b = $boxes[$id]
    if ($b.Left -lt 0 -or $b.Top -lt 0) {
        $boundsErrorFound = $true
        $errors.Add("10. [Canvas Bounds] Node '$id' has negative coordinates: Left=$($b.Left), Top=$($b.Top).")
    } elseif ($isPaged -and ($b.Right -gt $pageWidth -or $b.Bottom -gt $pageHeight)) {
        $warnings.Add("10. [Canvas Bounds Warning] Node '$id' exceeds declared page boundaries: Right=$($b.Right) > $pageWidth or Bottom=$($b.Bottom) > $pageHeight.")
    }
}
if (-not $boundsErrorFound) {
    $passes.Add("10. [Canvas Bounds] All nodes reside strictly within non-negative canvas coordinates.")
}

# -------------------------------------------------------------
# SUMMARY REPORT
# -------------------------------------------------------------
Write-Host "=== GEOMETRY VALIDATION REPORT: $FilePath ===" -ForegroundColor Cyan
foreach ($p in $passes) {
    Write-Host "  [PASS] $p" -ForegroundColor Green
}
foreach ($w in $warnings) {
    Write-Host "  [WARN] $w" -ForegroundColor Yellow
}
foreach ($e in $errors) {
    Write-Host "  [FAIL] $e" -ForegroundColor Red
}

$status = if ($errors.Count -eq 0) { "PASSED" } else { "FAILED" }
$color = if ($errors.Count -eq 0) { [ConsoleColor]::Green } else { [ConsoleColor]::Red }
Write-Host "=== RESULT: $status (Errors: $($errors.Count), Warnings: $($warnings.Count)) ===" -ForegroundColor $color

if ($errors.Count -gt 0) {
    exit 1
} else {
    exit 0
}
