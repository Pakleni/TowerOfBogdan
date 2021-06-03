<?php
    //Radio Nemanja Mehovic 2018/0452
    // "Email Already Exists" => 201;
    // "Username Already Exists" => 202;
    // "Account was not succesfully created" => 203;
    // "Account was succesfully created" => 204;
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

    if (isset($_POST["email"]) && isset($_POST["username"]) && isset($_POST["password"]))
    {
        if(filter_var($_POST["email"], FILTER_VALIDATE_EMAIL) === false)
        {
            http_response_code(401);
            exit();
        }
        if(@checkEmail($_POST["email"]))
        {
            http_response_code(201);
            exit();
        }
        if(@checkUsername($_POST["username"]))
        {
            http_response_code(202);
            exit();
        }
        $flag = @createAccount($_POST["username"], $_POST["password"], $_POST["email"]);
        if($flag)
        {
            http_response_code(204);
            exit();
        }
        else
        {
            http_response_code(203);
            exit();
        }
    }
    else {
        http_response_code(400);
        exit();
    }

    
?>