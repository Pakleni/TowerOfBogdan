<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "../validations.php";
    require_once "../Games/Slots.php";
    /*
        Rest access point za igranje slotova
    */
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
        {
            @$user->addBogdin(- $_REQUEST["bet"]);
            @$user->addBogdin($reward[0]);
        }

        $answer = array(array(floor($reward[0]*pow(1.1,@$user->getVip() - 1)), $reward[1], $reward[2]), $generatedSymbols);
        echo json_encode($answer);
    }
    catch(Exception $e)
    {
        http_response_code(500);
        exit();
    }
?>