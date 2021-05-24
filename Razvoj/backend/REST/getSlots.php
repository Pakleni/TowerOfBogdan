<?php
    require_once "../validations.php";
    require_once "../Games/Slots.php";

    if(!auth())
    {
        http_response_code(401);
        exit();
    }

    if(!betAmmountInRange())
    {
        http_response_code(400);
        exit();
    }


    $game = new Slots();
    $reward = $game->getReward($_REQUEST["bet"]);
    $generatedSymbols = $game->getSymbols();

    $answer = array($reward, $generatedSymbols);

    echo json_encode($answer);
?>