<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "REST/phpFunctions.php";

    $user = null;
    $Admin = false;

    function auth()
    {
        global $user;
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

        if(($user = @User::getUserWithEmailPassword($_SERVER["PHP_AUTH_USER"],$_SERVER["PHP_AUTH_PW"])) == null)
        {
            http_response_code(401);
            exit();
        }

        $Admin = @$user->isAdmin();
    }

    function betAmmountInRange($arg)
    {
        global $user;
        global $Admin;

        if($Admin)
            return;

        if(!isset($arg) || @$user->getBogdin() < $arg)
        {
            http_response_code(403);
            exit();
        }
    }

    function checkIfInt($arg){
        return is_numeric($arg) && is_int(+$arg);
      }

?>