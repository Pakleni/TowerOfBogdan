<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "REST/phpFunctions.php";

    $UserID = -1;
    $Admin = false;

    function auth()
    {
        global $UserID;
        global $Admin;

        if(!isset($_SERVER["PHP_AUTH_PW"]) || !isset($_SERVER["PHP_AUTH_USER"]))
        {
            http_response_code(401);
            exit();
        }

        if(filter_var($_SERVER["PHP_AUTH_USER"], FILTER_VALIDATE_EMAIL) === false)
        {
            http_response_code(401);
            exit();
        }

        if(($UserID = getId($_SERVER["PHP_AUTH_USER"],$_SERVER["PHP_AUTH_PW"])) == -1)
        {
            http_response_code(401);
            exit();
        }

        $Admin = @getVip($UserID) == 5;
    }

    function betAmmountInRange($arg)
    {
        global $UserID;
        global $Admin;

        if($Admin)
            return;

        if(!isset($arg) || getBogdin($UserID) < $arg)
        {
            http_response_code(403);
            exit();
        }
    }

    function checkIfInt($arg){
        return is_numeric($arg) && is_int(+$arg);
      }

?>