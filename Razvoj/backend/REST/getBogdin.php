<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "../validations.php";
    require_once "phpFunctions.php";
    /*
        Rest access point za dohvatanje koliko bogdinara korisnik ima
    */
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Methods:GET, OPTIONS");
    header("Content-Type:application/json");
    header("Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With");

    if($_SERVER["REQUEST_METHOD"] == "OPTIONS")
    {
        exit();
    }

    if($_SERVER["REQUEST_METHOD"] != "GET")
    {
        http_response_code(400);
        exit();
    }

    @auth();

    if($Admin)
        echo -1;
    else
        echo @$user->getBogdin();
?>