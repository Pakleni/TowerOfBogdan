<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "../validations.php";
    require_once "phpFunctions.php";

    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Methods:GET");
    header("Content-Type:application/json");
    header("Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With");

    if($_SERVER["REQUEST_METHOD"] != "GET")
    {
        http_response_code(400);
        exit();
    }

    @auth();

    if($Admin)
        echo -1;
    else
        echo @getBogdin($UserID);
?>