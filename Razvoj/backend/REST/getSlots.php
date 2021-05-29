<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "../validations.php";
    require_once "../Games/Slots.php";

    if(!auth())
    {
        http_response_code(401);
        exit();
    }

    if(!isset($_REQUEST["bet"]) || !checkIfInt($_REQUEST["bet"]) || $_REQUEST["bet"] <= 0)
    {
        http_response_code(400);
        exit();
    }

    if(!betAmmountInRange())
    {
        http_response_code(403);
        exit();
    }


    $game = new Slots();
    $reward = $game->getReward($_REQUEST["bet"]);
    $generatedSymbols = $game->getSymbols();

    $answer = array($reward, $generatedSymbols);

    echo json_encode($answer);
?>