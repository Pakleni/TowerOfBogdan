<?php

require_once "../REST/phpFunctions.php";
require_once 'stripe-php-7.81.0/init.php';
\Stripe\Stripe::setApiKey('sk_test_51Iyja9DJfCOBmzFRGES8wim8nMYToD5kL3A4LRlAs3nKFwtw8kyk28CWKkpnODBnm6icV1Cf3IJnoTvdV6vEswtJ00OuzRE62j');

header('Content-Type: application/json');

if($_SERVER["REQUEST_METHOD"] != "POST")
{
    http_response_code(400);
    exit();
}

$json = file_get_contents('php://input');
$data = json_decode($json);

if(!isset($data->email) || !isset($data->password) || !isset($data->amount))
{
	http_response_code(400);
	exit();
}

$user = @User::getUserWithEmailPassword($data->email, $data->password);

if($user == null)
{
  http_response_code(401);
  echo "bad_user";
  exit();
}

//koliko bogdinara
$amount = $data->amount;
$PRICE_PER_BOGDINAR = 1;
if ($amount < 1000) {
  http_response_code(401);
  echo "no_amount";
  exit();
}
$hash = "";

$hash = @$user->setRandomHash();

$YOUR_DOMAIN = 'http://localhost';
if($hash != ""){
  $checkout_session = \Stripe\Checkout\Session::create([
    'payment_method_types' => ['card'],
    'line_items' => [[
      'price_data' => [
        'currency' => 'usd',
        'unit_amount' => $amount * $PRICE_PER_BOGDINAR - 1,
        'product_data' => [
          'name' => 'Bogdinar',
          'images' => ["http://localhost/logo.png"],
        ],
      ],
      'quantity' => 1,
    ]],
    'mode' => 'payment',
    'success_url' => $YOUR_DOMAIN . '/stripe/success.php?amount='.$amount.'&hash='.$hash,
    'cancel_url' => $YOUR_DOMAIN . '/cancel',
  ]);
  
  http_response_code(200);
  echo json_encode(['id' => $checkout_session->id]);

} else {
  http_response_code(401);
  echo "fail";
}