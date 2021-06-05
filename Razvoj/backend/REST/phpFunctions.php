<?php

    $DATABASE = "https://database.mandrakestudios.net/htdocs/bogdani/";
    $HOST = "https://tower-of-bogdan.vercel.app/";
    
    class vip{
        public static function getVIPName($vipid)
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT Name
                FROM VIPLevel
                WHERE VIPLevel.ID = ?
                SQL;
            
            $result = User::SQL($dbc, $sql, "i", array($vipid), false, true);

            if (count($result) > 0)
            {
                $row = $result[0];
                return $row["Name"];
            }

            return null;
        }
        
        public static function getVIPPrice($vipid)
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT Cost
                FROM VIPLevel
                WHERE VIPLevel.ID = ?
                SQL;
            
            $result = User::SQL($dbc, $sql, "i", array($vipid), false, true);

            if (count($result) > 0)
            {
                $row = $result[0];
                return $row["Cost"];
            }

            return null;
        }
    }

    class User
    {

        private $userID;

        private static function pepper($pass)
        {
            $pepper = "mehovic";

            return hash_hmac("sha256", $pass, $pepper);
        }

        private static function hashIt($pass)
        {
            return password_hash(User::pepper($pass), PASSWORD_ARGON2ID);
        }

        public static function connectToDB()
        {
            $user = 'bogdan';
            $pass = 'glupasifra';
            $db = 'towerofbogdan';

            $dbc = mysqli_connect('localhost', $user, $pass, $db) or die("Unable to connect");
            return $dbc;
        }

        public static function SQL($dbc, $sql, $bind, $params, $resNeeded, $retNeeded)
        {
            $stmt = mysqli_stmt_init($dbc);
            if (!mysqli_stmt_prepare($stmt, $sql))
                die("BadSQL: " . $sql);

            if(count($params) != 0)
                if (!call_user_func_array("mysqli_stmt_bind_param", array_merge(array($stmt, $bind), $params)))
                    if (strpos($sql, "?") !== false)
                        die("Can't bind: " . $sql);

            if (!mysqli_stmt_execute($stmt))
                die("Can't exe: " . $sql);
            
            $result = mysqli_stmt_get_result($stmt);

            if ($result === FALSE && mysqli_errno($dbc) !== 0)
                die("Error Code: " . strval(mysqli_errno($dbc)));


            $ret = array();

            if(!$retNeeded)
                return $ret;

            if (mysqli_num_rows($result) > 0)
                while ($row = mysqli_fetch_assoc($result))
                {
                    array_push($ret, $row);
                }
            else
                if ($resNeeded === TRUE)
                    die("NoResult: " . $sql);

            return $ret;
        }

        private function __construct()
        {
            $this->userID = -1;
        }
    
        static function getUserWithEmailPassword($email, $password)
        {
            $instance = new self();

            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT *
                FROM User
                WHERE Email = ?
                SQL;

            $result = User::SQL($dbc, $sql, "s", array($email), false, true);
            
            if (count($result) > 0)
            {
                $row = $result[0];
                if (password_verify(User::pepper($password), $row['Password']))
                {
                    $instance->userID = $row['ID'];
                }
                else
                    $instance = null;
            }
            else
                $instance = null;

            mysqli_close($dbc);

            return $instance;
        }

        static function createAccount($user, $pass, $mail)
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT *
                FROM User
                WHERE Email = ?
                SQL;

            $result = User::SQL($dbc, $sql, "s", array($mail), false, true);
            
            if (count($result) > 0) { return false; }

            $hashed = User::hashIt($pass);

            $sql = <<<SQL
                INSERT INTO User(Username, User.Password, Email, VIPLevelID, BogdanFloorID)
                VALUES (?, ?, ?, 1, 1)
                SQL;

            User::SQL($dbc, $sql, "sss", array($user, $hashed, $mail), false, false);

            mysqli_close($dbc);

            return true;
        }

        static function checkEmail($mail)
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT *
                FROM User
                WHERE Email = ?
                SQL;
        
            $result = User::SQL($dbc, $sql, "s", array($mail), false, true);
        
            mysqli_close($dbc);
            
            if (count($result) > 0) { return true; }
        
            return false;
        }

        static function checkUsername($username)
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT *
                FROM User
                WHERE Username = ?
                SQL;

            $result = User::SQL($dbc, $sql, "s", array($username), false, true);

            mysqli_close($dbc);
            
            if (count($result) > 0) { return true; }

            return false;
        }

        static function getTop5()
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT User.Username, User.BogdanFloorID
                FROM User
                ORDER BY User.BogdanFloorID DESC
                LIMIT 5
                SQL;
            
        
            $retSql = User::SQL($dbc, $sql, "", array(), false, true);
        
            mysqli_close($dbc);
        
            $ret = array();
        
            foreach ($retSql as $key => $value)
                array_push($ret, $value);
        
            return $ret;
        }

        static function payWithHash($hash, $amount)
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                UPDATE User
                SET User.paymentHash = NULL, Bogdinari = Bogdinari + ?
                WHERE User.paymentHash = ?
                SQL;
                
            User::SQL($dbc, $sql, "sis", array($amount, $hash), false, false);
        }

        static function payWithHashVIP($hash, $viplevel)
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                UPDATE User
                SET User.paymentHash = NULL, User.VIPLevelID = ?
                WHERE User.paymentHash = ?
                SQL;
                
            User::SQL($dbc, $sql, "sis", array($viplevel, $hash), false, false);
        }

        function getID()
        {
            return $this->userID;
        }

        function getBogdin()
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT Bogdinari
                FROM User
                WHERE User.ID = ?;
                SQL;

            $row = User::SQL($dbc, $sql, "i", array($this->userID), true, true);

            mysqli_close($dbc);

            return $row[0]["Bogdinari"];
        }

        function addBogdin($amount)
        {
            $dbc = User::connectToDB();

            $tmp = $amount;

            if($tmp > 0)
            {
                $vipLevel = $this->getVip();
                $tmp = floor($tmp * pow(1.1, $vipLevel - 1));
            }

            $sql = <<<SQL
                UPDATE User
                SET Bogdinari = Bogdinari + ?
                WHERE User.ID = ?
                SQL;

            User::SQL($dbc, $sql, "ii", array($tmp,$this->userID), false, false);

            mysqli_close($dbc);
        }

        function changePassword($newPassword)
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                UPDATE User
                SET User.Password = ?
                WHERE User.ID = ?
                SQL;

            $hashed = User::hashIt($newPassword);

            User::SQL($dbc, $sql, "si", array($hashed, $this->userID), false, false);

            mysqli_close($dbc);
        }

        function ascend()
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT BogdanFloor.CostToAscendTo
                FROM User, BogdanFloor
                WHERE User.ID = ? AND BogdanFloor.ID = User.BogdanFloorID + 1 AND User.Bogdinari >= BogdanFloor.CostToAscendTo
                SQL;

            $result = User::SQL($dbc, $sql, "i", array($this->userID), false, true);

            if (count($result) > 0)
            {
                $price = $result[0]["CostToAscendTo"];
                $sql = <<<SQL
                    UPDATE User
                    SET User.Bogdinari = User.Bogdinari - ?, User.BogdanFloorID = User.BogdanFloorID +1
                    WHERE User.ID = ?
                    SQL;

                User::SQL($dbc, $sql, "ii", array($price, $this->userID), false, false);

                mysqli_close($dbc);

                return true;
            } 
            else 
            {
                mysqli_close($dbc);
                return false;
            }
        }

        function getVip()
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT User.VIPLevelID
                FROM User
                WHERE User.ID = ?
                SQL;
            

            $retSql = User::SQL($dbc, $sql, "i", array($this->userID), false, true);

            mysqli_close($dbc);

            return $retSql[0]["VIPLevelID"];
        }

        function isAdmin()
        {
            return $this->getVip() == 5;
        }

        function getAllUserInfo()
        {
            $dbc = User::connectToDB();

            $sql = <<<SQL
                SELECT User.Username, User.Email, User.Bogdinari, VIPLevel.Name AS VipName, b1.ID AS FloorNumber, b1.Name AS FloorName, b1.CostToStay AS CostToStay, b2.CostToAscendTo AS CostToNext
                FROM User, VIPLevel, BogdanFloor b1, BogdanFloor b2
                WHERE User.ID = ? AND User.VIPLevelID = VIPLevel.ID AND b1.ID = User.BogdanFloorID AND b2.ID = User.BogdanFloorID + 1
                SQL;
            
            $retSql = User::SQL($dbc, $sql, "i", array($this->userID), false, true);

            mysqli_close($dbc);

            $ret = array();

            foreach ($retSql[0] as $key => $value)
                $ret[$key] = $value;

            return $ret;
        }

        function setRandomHash()
        {
            $seed = str_split('abcdefghijklmnopqrstuvwxyz'.'ABCDEFGHIJKLMNOPQRSTUVWXYZ');

            $str = "";
            for($i = 0; $i < 256; $i++){
                $str .= $seed[random_int(0, count($seed) - 1)];
            }

            $dbc = User::connectToDB();

            $sql = <<<SQL
                UPDATE User
                SET User.paymentHash = ?
                WHERE User.ID = ?
                SQL;
            
            User::SQL($dbc, $sql, "si", array($str,$this->userID), false, false);

            mysqli_close($dbc);

            return $str;
        }
    }
?>