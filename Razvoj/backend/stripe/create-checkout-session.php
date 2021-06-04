<?php

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

if(!isset($data->email) || !isset($data->password))
{
	http_response_code(400);
	exit();
}

$UserID = @getId($data->email, $data->password);

if($UserID == -1)
{
	http_response_code(401);
	exit();
}

$email = $data->email;
$password = $data->password;

$YOUR_DOMAIN = 'http://localhost/stripe';

$checkout_session = \Stripe\Checkout\Session::create([
  'payment_method_types' => ['card'],
  'line_items' => [[
    'price_data' => [
      'currency' => 'usd',
      'unit_amount' => 2000,
      'product_data' => [
        'name' => 'Stubborn Attachments',
        'images' => ["https://i.imgur.com/EHyR2nP.png"],
      ],
    ],
    'quantity' => 1,
  ]],
  'mode' => 'payment',
  'success_url' => $YOUR_DOMAIN . '/success.php',
  'cancel_url' => $YOUR_DOMAIN . '/cancel.html',
]);

echo json_encode(['id' => $checkout_session->id]);