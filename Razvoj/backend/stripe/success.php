<?php

require_once "../REST/phpFunctions.php";

$hash = $_REQUEST["hash"];
$amount = $_REQUEST["amount"];

setBogdinarHesh($hash, $amount);

?>
<html>
<head>
  <title>Thanks for your order!</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <section>
    <p>
      We appreciate your business!
      <a href="">Go Back</a>.
    </p>
  </section>
</body>
</html>