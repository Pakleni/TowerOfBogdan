<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "../validations.php";
    require_once "../Games/Slots.php";

    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Methods:POST");
    header("Content-Type:application/json");
    header("Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With");

    if($_SERVER["REQUEST_METHOD"] != "POST")
    {
        http_response_code(400);
        exit();
    }

    @auth();

    if(!isset($_REQUEST["bet"]) || !checkIfInt($_REQUEST["bet"]) || $_REQUEST["bet"] <= 0)
    {
        http_response_code(400);
        exit();
    }
    
    @betAmmountInRange($_REQUEST["bet"]);

    try
    {
        $game = new Slots();
        $reward = $game->getReward($_REQUEST["bet"]);
        $generatedSymbols = $game->getSymbols();
        if(!$Admin)
            @$user->addBogdin($reward[0] - $_REQUEST["bet"]);

        $answer = array($reward, $generatedSymbols);
        echo json_encode($answer);
    }
    catch(Exception $e)
    {
        http_response_code(500);
        exit();
    }
?>