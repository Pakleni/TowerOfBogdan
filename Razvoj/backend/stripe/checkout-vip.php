<?php

require_once "../REST/phpFunctions.php";
require_once 'stripe-php-7.81.0/init.php';
\Stripe\Stripe::setApiKey('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

header('Content-Type: application/json');

if($_SERVER["REQUEST_METHOD"] != "POST")
{
    http_response_code(400);
    exit();
}

$json = file_get_contents('php://input');
$data = json_decode($json);

if(!isset($data->email) || !isset($data->password) || !isset($data->viplevel))
{
	http_response_code(400);
	exit();
}

$user = @User::getUserWithEmailPassword($data->email, $data->password);

if($user == null)
{
  http_response_code(401);
  exit();
}

$hash = "";

$hash = @$user->setRandomHash();

$YOUR_DOMAIN = 'http://localhost/stripe';
if($hash != ""){
  $checkout_session = \Stripe\Checkout\Session::create([
    'payment_method_types' => ['card'],
    'line_items' => [[
      'price_data' => [
        'currency' => 'usd',
        'unit_amount' => 2000,
        'product_data' => [
          'name' => 'VIP',
          'images' => [""],
        ],
      ],
      'quantity' => 1,
    ]],
    'mode' => 'payment',
    'success_url' => $YOUR_DOMAIN . '/success.php?viplevel='.$data->viplevel.'&hash='.$hash,
    'cancel_url' => $YOUR_DOMAIN . '/cancel.php',
  ]);
  
  echo json_encode(['id' => $checkout_session->id]);

} else {
  echo "fail";
}