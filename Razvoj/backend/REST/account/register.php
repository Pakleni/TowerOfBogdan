<?php
    //Radio Nemanja Mehovic 2018/0452

    require_once "../phpFunctions.php";

    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Methods:POST");
    header("Content-Type:application/json");
    header("Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With");

    if($_SERVER["REQUEST_METHOD"] != "POST")
    {
        http_response_code(400);
        exit();
    }

    if (isset($_POST["email"]) && isset($_POST["username"]) && isset($_POST["password"])) {
        
    }
    else {
        http_response_code(400);
        exit();
    }

    
?>