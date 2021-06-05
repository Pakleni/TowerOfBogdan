<?php
header("Access-Control-Allow-Origin:*");
header('Content-Type: application/json');

require_once "../REST/phpFunctions.php";
require_once 'stripe-php-7.81.0/init.php';
\Stripe\Stripe::setApiKey('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

if($_SERVER["REQUEST_METHOD"] == "OPTIONS")
{
    exit();
}

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

$vipid = $data->viplevel;

if($vipid <= 1 || $vipid >= 5){
  http_response_code(401);
  exit();
}

$name = @vip::getVIPName($vipid);
$price = @vip::getVIPPrice($vipid);

$hash = "";

$hash = @$user->setRandomHash();

if($vipid <= @$user->getVip()){
  http_response_code(202);
  exit();
}

if($hash != ""){
  $checkout_session = \Stripe\Checkout\Session::create([
    'payment_method_types' => ['card'],
    'line_items' => [[
      'price_data' => [
        'currency' => 'usd',
        'unit_amount' => $price*100,
        'product_data' => [
          'name' => 'VIP: '.$name,
          'images' => ["http://localhost/logo.png"],
        ],
      ],
      'quantity' => 1,
    ]],
    'mode' => 'payment',
    'success_url' => 'https://database.mandrakestudios.net/htdocs/bogdani/stripe/success.php?viplevel='.$vipid.'&hash='.$hash,
    'cancel_url' => 'https://tower-of-bogdan.vercel.app/cancel',
  ]);
  http_response_code(200);
  echo json_encode(['id' => $checkout_session->id]);

} else {
  http_response_code(401);
  echo "fail";
}