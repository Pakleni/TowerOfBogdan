<?php

    function auth()
    {
        return  isset($_SERVER["PHP_AUTH_PW"]) && isset($_SERVER["PHP_AUTH_USER"]);
    }

    function betAmmountInRange()
    {
        return isset($_REQUEST["bet"]);
    }

?>