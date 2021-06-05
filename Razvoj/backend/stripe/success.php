<?php
header("Access-Control-Allow-Origin:*");

require_once "../REST/phpFunctions.php";

if(!isset($_REQUEST["hash"]))
{
	http_response_code(400);
	exit();
}

if(isset($_REQUEST["amount"]))
{
  $hash = $_REQUEST["hash"];
  $amount = $_REQUEST["amount"];
  
  User::payWithHash($hash, $amount);
}

if(isset($_REQUEST["viplevel"]))
{
  $hash = $_REQUEST["hash"];
  $viplevel = $_REQUEST["viplevel"];
  
  User::payWithHashVIP($hash, $viplevel);
}

header("Location: /success");
exit();
?>