<?php
    //Radio Nemanja Mehovic 2018/0452
    function auth()
    {
        if(!isset($_SERVER["PHP_AUTH_PW"]) || !isset($_SERVER["PHP_AUTH_USER"]))
        {
            http_response_code(401);
            exit();
        }
    }

    function betAmmountInRange($arg)
    {
        if(!isset($arg))
        {
            http_response_code(403);
            exit();
        }
    }

    function checkIfInt($arg){
        return is_numeric($arg) && is_int(+$arg);
      }

?>