<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "../validations.php";
    require_once "../Games/21.php";
    /*
        Rest access point za igranje 21
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
        echo("Method not POST");
        exit();
    }

    @auth();

    if(!isset($_REQUEST["operation"]))
    {
        http_response_code(400);
        echo("no operation");
        exit();
    }

    if(isset($_REQUEST["sessionId"]))
    {
        session_id($_REQUEST["sessionId"]);
    }


    $flag1 = session_start();
    if(!$flag1)
    {
        http_response_code(500);
        exit();
    }
    try
    {
        $game = null;
        switch($_REQUEST["operation"])
        {
            case "start":
                if(!isset($_REQUEST["bet"]) || !checkIfInt($_REQUEST["bet"]) || $_REQUEST["bet"] <= 0)
                {
                    http_response_code(400);
                    exit();
                }

                if(isset($_SESSION["started"]))
                {
                    session_destroy();
                    session_start();
                    $_SESSION = array();
                }

                @betAmmountInRange($_REQUEST["bet"]);
                if(!$Admin)
                    @$user->addBogdin(-$_REQUEST["bet"]);

                $_SESSION["started"] = true;
                $game = new Game21(null);
                $_SESSION["bet"] = $_REQUEST["bet"];
            break;
            case "hit":
                if(!isset($_SESSION["started"]))
                {
                    http_response_code(400);
                    exit();
                }
                $game = new Game21($_SESSION["state"]);
                $game->hit();
            break;
            case "stand":
                if(!isset($_SESSION["started"]))
                {
                    http_response_code(400);
                    exit();
                }
                $game = new Game21($_SESSION["state"]);
                $game->stand();
            break;
            case "keepalive":
                if(isset($_SESSION["started"]))
                {
                    if(!isset($_SESSION["keepalive"]))
                        $_SESSION["keepalive"] = 0;
                    else
                        $_SESSION["keepalive"]++;
                }
                exit();
            break;
            case "end":
                if(isset($_SESSION["started"]))
                {
                    $_SESSION = array();
                    session_destroy();
                }
                exit();
            break;
            default:
                http_response_code(400);
                exit();
            break;
        }
        $_SESSION["state"] = $game->getState();
        $bet = $_SESSION["bet"];
        if($game->getWinner() != 0)
        {
            session_destroy();
            if(!$Admin)
                @$user->addBogdin($game->getReward($bet));
        }
        echo json_encode(array($game->getWinner(),$game->getState(),floor($game->getReward($bet)*pow(1.1,@$user->getVip() - 1)), session_id()));
    }
    catch(Exception $e)
    {
        http_response_code(500);
        exit();
    }
?>