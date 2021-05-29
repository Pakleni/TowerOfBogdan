<?php
    //Radio Nemanja Mehovic 2018/0452
    function auth()
    {
        return  isset($_SERVER["PHP_AUTH_PW"]) && isset($_SERVER["PHP_AUTH_USER"]);
    }

    function betAmmountInRange()
    {
        return isset($_REQUEST["bet"]);
    }

    function checkIfInt( $arg ){
        return is_numeric($arg) && is_int(+$arg);
      }

?>