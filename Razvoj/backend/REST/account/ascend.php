<?php
    //Radio Nemanja Mehovic 2018/0452
    require_once "../phpFunctions.php";
    /*
        Rest access point za ascendovanje usera(povecavanje sprata)
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
        exit();
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if(!isset($data->email) || !isset($data->password))
    {
        http_response_code(400);
        exit();
    }

    $user = @User::getUserWithEmailPassword($data->email, $data->password);

    if($user == null)
    {
        http_response_code(401);
        exit();
    }

    $flag = @$user->ascend();
    if(!$flag)
    {
        http_response_code(403);
        exit();
    }
?>