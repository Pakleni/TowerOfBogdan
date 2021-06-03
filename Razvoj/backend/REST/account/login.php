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

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if(!isset($data->email) || !isset($data->password))
    {
        http_response_code(400);
        exit();
    }
    if(filter_var($data->email, FILTER_VALIDATE_EMAIL) === false)
    {
        http_response_code(401);
        exit();
    }

    if(@getId($data->email, $data->password) == -1)
    {
        http_response_code(401);
        exit();
    }
?>