<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "../validations.php";
    require_once "../Games/Roulette.php";

    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Methods:POST, OPTIONS");
    header("Content-Type:application/json");
    header("Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With");

    if($_SERVER["REQUEST_METHOD"] == "OPTIONS")
    {
        exit();
    }

    if($_SERVER["REQUEST_METHOD"] != "POST")
    {
        http_response_code(400);
        exit();
    }

    @auth();

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if(!isset($data->bets) || !is_array($data->bets))
    {
        http_response_code(400);
        exit();
    }

    $allBets = 0;
    foreach ($data->bets as &$tmp) 
    {
        if(!isset($tmp->field) || !isset($tmp->bet) || !checkIfInt($tmp->bet) || $tmp->bet <= 0)
        {
            http_response_code(400);
            exit();
        }
        if(is_numeric($tmp->field) && (strlen($tmp->field) > 2 || $tmp->field < 0 || $tmp->field > 36))
        {
            http_response_code(400);
            exit();
        }
        else if(!is_numeric($tmp->field) && !array_search($tmp->field,nonNumberFields,true))
        {
            http_response_code(400);
            exit();
        }
        $allBets += $tmp->bet;
    }

    @betAmmountInRange($allBets);

    try
    {
        $game = new Roulette();
        $reward = $game->getReward($data->bets);
        $num = $game->getNum();
        if(!$Admin)
            @$user->addBogdin($reward - $allBets);

        $answer = array(floor($reward*pow(1.1,@$user->getVip() - 1)), $num);
        echo json_encode($answer);
    }
    catch(Exception $e)
    {
        http_response_code(500);
        exit();
    }
?>