<?php

require_once "../REST/phpFunctions.php";

$hash = $_REQUEST["hash"];
$amount = $_REQUEST["amount"];

User::payWithHash($hash, $amount);

header("Location: /success");
exit();
?>