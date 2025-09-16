<?php

include 'db_connect.php';

// -------- Config (defaults) --------
$defaultThreshold   = 5;   // low-stock cutoff
$defaultTargetLevel = 20;  // desired on-hand level

// Allow overrides via GET or form submit
$threshold   = isset($_GET['threshold']) ? (int)$_GET['threshold'] : $defaultThreshold;
$targetLevel = isset($_GET['target'])    ? (int)$_GET['target']    : $defaultTargetLevel;

// Basic guards
if ($threshold < 0)   $threshold = 0;
if ($targetLevel < 0) $targetLevel = 0;

// For "CRITICAL" cutoff we use threshold/2 (integer floor)
$criticalCutoff = (int) floor($threshold / 2);

// Build prepared query 
$sql = "
SELECT
  product_code,
  wood_type,
  size,
  unit,
  quantity,
  location,
  price,
  CASE
    WHEN quantity <= 0 THEN 'OUT'
    WHEN quantity <= ? THEN 'CRITICAL'
    ELSE 'LOW'
  END AS severity,
  GREATEST(0, ? - quantity) AS suggested_reorder_qty
FROM INVENTORY
WHERE visible = 1
  AND quantity <= ?
ORDER BY quantity ASC, product_code;
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    die('Failed to prepare statement: ' . htmlspecialchars($conn->error));
}

// Bind: criticalCutoff, targetLevel, threshold
$stmt->bind_param('iii', $criticalCutoff, $targetLevel, $threshold);

if (!$stmt->execute()) {
    http_response_code(500);
    die('Failed to execute query: ' . htmlspecialchars($stmt->error));
}

$result = $stmt->get_result();
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Low Stock Alerts</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; }
    h2 { margin-bottom: 8px; }
    .controls {
      display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
      margin: 12px 0 18px;
    }
    .controls label { font-weight: bold; }
    .controls input[type="number"] {
      width: 80px; padding: 6px; border: 1px solid #ccc; border-radius: 4px;
    }
    .controls button {
      padding: 7px 14px; border: 0; border-radius: 4px; cursor: pointer;
      background: #007bff; color: #fff;
    }
    .alert {
      background-color: #ffefef;
      color: #7a0000;
      padding: 10px 12px;
      border: 1px solid #e2bcbc;
      border-radius: 6px;
      margin: 10px 0 16px;
    }
    table { border-collapse: collapse; width: 100%; margin-top: 6px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
    th { background-color: #f5f7fa; }
    tr:hover { background: #fafcff; }

    /* Severity highlights */
    .sev-OUT      { background: #ffe3e3; }
    .sev-CRITICAL { background: #fff1c2; }
    .sev-LOW      { background: #fffbe6; }

    .pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: bold;
    }
    .pill.OUT      { background: #d32f2f; color: #fff; }
    .pill.CRITICAL { background: #f9a825; color: #000; }
    .pill.LOW      { background: #fbc02d; color: #000; }

    .empty { color: #4a4a4a; margin-top: 12px; }
    .meta  { color: #666; font-size: 13px; margin-top: 8px; }
  </style>
</head>
<body>

  <h2>Low Stock Alerts</h2>

  <form class="controls" method="get" action="">
    <label for="threshold">Threshold ≤</label>
    <input type="number" id="threshold" name="threshold" value="<?php echo htmlspecialchars($threshold); ?>" min="0" />
    <label for="target">Target level</label>
    <input type="number" id="target" name="target" value="<?php echo htmlspecialchars($targetLevel); ?>" min="0" />
    <button type="submit">Apply</button>
    <div class="meta">Critical cutoff is computed as ⌊threshold/2⌋ = <strong><?php echo $criticalCutoff; ?></strong></div>
  </form>

  <?php if ($result->num_rows > 0): ?>
    <div class="alert">
      Warning: Some products are low on stock (threshold ≤ <?php echo htmlspecialchars($threshold); ?>).
    </div>

    <table>
      <thead>
        <tr>
          <th>Product Code</th>
          <th>Wood Type</th>
          <th>Size</th>
          <th>Unit</th>
          <th>Quantity</th>
          <th>Location</th>
          <th>Price</th>
          <th>Severity</th>
          <th>Suggested Reorder Qty<br/>(to reach <?php echo htmlspecialchars($targetLevel); ?>)</th>
        </tr>
      </thead>
      <tbody>
        <?php while ($row = $result->fetch_assoc()): 
          $sev = $row['severity'];
          $trClass = 'sev-' . $sev;
        ?>
          <tr class="<?php echo htmlspecialchars($trClass); ?>">
            <td><?php echo htmlspecialchars($row['product_code']); ?></td>
            <td><?php echo htmlspecialchars($row['wood_type']); ?></td>
            <td><?php echo htmlspecialchars($row['size']); ?></td>
            <td><?php echo htmlspecialchars($row['unit']); ?></td>
            <td><?php echo (int)$row['quantity']; ?></td>
            <td><?php echo htmlspecialchars($row['location']); ?></td>
            <td><?php echo number_format((float)$row['price'], 2); ?></td>
            <td><span class="pill <?php echo htmlspecialchars($sev); ?>"><?php echo htmlspecialchars($sev); ?></span></td>
            <td><?php echo (int)$row['suggested_reorder_qty']; ?></td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  <?php else: ?>
    <p class="empty">All stock levels are sufficient for the current threshold (≤ <?php echo htmlspecialchars($threshold); ?>).</p>
  <?php endif; ?>

</body>
</html>
<?php
$stmt->close();
$conn->close();
