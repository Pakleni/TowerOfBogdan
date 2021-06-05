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
    'success_url' => 'https://database.mandrakestudios.net/htdocs/bogdani/stripe/success.php?amount='.$amount.'&hash='.$hash,
    'cancel_url' => 'https://tower-of-bogdan.vercel.app/cancel',
  ]);
  
  http_response_code(200);
  echo json_encode(['id' => $checkout_session->id]);

} else {
  http_response_code(401);
  echo "fail";
}