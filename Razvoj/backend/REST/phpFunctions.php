<?php

    //Radio Mihailo Pacaric 2018/0609

    //promenljive za lakse menjanje hosta
    $DATABASE = "https://database.mandrakestudios.net/htdocs/bogdani/";
    $HOST = "https://tower-of-bogdan.vercel.app/";

    /**
     * DataBase - sluzi za pravljenje konekcija sa bazom i izvrsavanje upita
     * @version 1.0
     */
    class DataBase
    {
        /**
         * funkcija za pravljenje konekcije do baze
         * @return mysqli
         */
        public static function connectToDB()
        {
            $user = 'bogdan';
            $pass = 'glupasifra';
            $db = 'towerofbogdan';

            $dbc = mysqli_connect('localhost', $user, $pass, $db) or die("Unable to connect");
            return $dbc;
        }
        /**
         * funkcija za izvrsavanje sql-a na bazi
         * @param mysqli $dbc
         * @param string $sql
         * @param string $bind
         * @param array $params
         * @param bool $resNeeded
         * @param bool $retNeeded
         * @return array
         */
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
    }

    /**
     * vip - klasa za pristupanje vip podacima u bazi
     * @version 2.1
     */
    class vip{
        /**
         * funkcija koja vraca ime vipa
         * @param int $vipid
         * @return string
         */
        public static function getVIPName($vipid)
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT Name
                FROM VIPLevel
                WHERE VIPLevel.ID = ?
                SQL;
            
            $result = DataBase::SQL($dbc, $sql, "i", array($vipid), false, true);

            if (count($result) > 0)
            {
                $row = $result[0];
                return $row["Name"];
            }

            return null;
        }
        /**
         * funkcija koja vraca cenu vipa
         * @param int $vipid
         * @return int
         */
        public static function getVIPPrice($vipid)
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT Cost
                FROM VIPLevel
                WHERE VIPLevel.ID = ?
                SQL;
            
            $result = DataBase::SQL($dbc, $sql, "i", array($vipid), false, true);

            if (count($result) > 0)
            {
                $row = $result[0];
                return $row["Cost"];
            }

            return null;
        }
    }
    /**
     * User - klasa za pristupanje user podacima u bazi
     * @version 2.3
     */
    class User
    {
        /**
         * promenljiva koja cuva user id
         * @var int $userID
         */
        private $userID;
        /**
         * pomocna funkcija za hasing
         * @param string $pass
         * @return string
         */
        private static function pepper($pass)
        {
            $pepper = "mehovic";

            return hash_hmac("sha256", $pass, $pepper);
        }
        /**
         * hesiranje sifre
         * @param string $pass
         * @return string
         */
        private static function hashIt($pass)
        {
            return password_hash(User::pepper($pass), PASSWORD_ARGON2ID);
        }
        /**
         * konstruktor koji samo setuje userid na -1
         * @return null
         */
        private function __construct()
        {
            $this->userID = -1;
        }
        /**
         * funkcija koji pravi nov objekat tipa User koji sadrzi userId usera u bazi koji ima isti email i sifru kao $email i $password ili vraca null ako nema takvog korisnika u bazi
         * @param string $email
         * @param strint $password
         * @return User
         */
        static function getUserWithEmailPassword($email, $password)
        {
            $instance = new self();

            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT *
                FROM User
                WHERE Email = ?
                SQL;

            $result = DataBase::SQL($dbc, $sql, "s", array($email), false, true);
            
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
        /**
         * funkcija koja pravi novog korisnika u bazi sa usernamom $user, sifrom $pass i emailom $mail
         * @param string $user
         * @param string $pass
         * @param string $mail
         * @return bool
         */
        static function createAccount($user, $pass, $mail)
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT *
                FROM User
                WHERE Email = ?
                SQL;

            $result = DataBase::SQL($dbc, $sql, "s", array($mail), false, true);
            
            if (count($result) > 0) { return false; }

            $hashed = User::hashIt($pass);

            $sql = <<<SQL
                INSERT INTO User(Username, User.Password, Email, VIPLevelID, BogdanFloorID)
                VALUES (?, ?, ?, 1, 1)
                SQL;

                DataBase::SQL($dbc, $sql, "sss", array($user, $hashed, $mail), false, false);

            mysqli_close($dbc);

            return true;
        }
        /**
         * funkcija koja proverava  da li user sa emailom koji je jednak $mail postoji
         * @param string $mail
         * @return bool
         */
        static function checkEmail($mail)
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT *
                FROM User
                WHERE Email = ?
                SQL;
        
            $result = DataBase::SQL($dbc, $sql, "s", array($mail), false, true);
        
            mysqli_close($dbc);
            
            if (count($result) > 0) { return true; }
        
            return false;
        }
        /**
         * funkcija koja proverava  da li user sa usernameom koji je jednak $username postoji
         * @param string $username
         * @return bool
         */
        static function checkUsername($username)
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT *
                FROM User
                WHERE Username = ?
                SQL;

            $result = DataBase::SQL($dbc, $sql, "s", array($username), false, true);

            mysqli_close($dbc);
            
            if (count($result) > 0) { return true; }

            return false;
        }
        /**
         * funkcija koja vraca najboljih 5 igraca iz baze
         * @return array
         */
        static function getTop5()
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT User.Username, User.BogdanFloorID
                FROM User
                ORDER BY User.BogdanFloorID DESC
                LIMIT 5
                SQL;
            
        
            $retSql = DataBase::SQL($dbc, $sql, "", array(), false, true);
        
            mysqli_close($dbc);
        
            $ret = array();
        
            foreach ($retSql as $key => $value)
                array_push($ret, $value);
        
            return $ret;
        }
        /**
         * funkcija koja korisniku koji sadrzi $hash u tabeli dodaje $amount bogdinara
         * @param string $hash
         * @param int $amount
         * @return null
         */
        static function payWithHash($hash, $amount)
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                UPDATE User
                SET User.paymentHash = NULL, Bogdinari = Bogdinari + ?
                WHERE User.paymentHash = ?
                SQL;
                
            DataBase::SQL($dbc, $sql, "is", array($amount, $hash), false, false);
        }
        /**
         * funkcija koja korisniku koji sadrzi $hash u tabeli postavlja da bude vip sa idom $vipLevel
         * @param string $hash
         * @param int $viplevel
         * @return null
         */
        static function payWithHashVIP($hash, $viplevel)
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                UPDATE User
                SET User.paymentHash = NULL, User.VIPLevelID = ?
                WHERE User.paymentHash = ?
                SQL;
                
            DataBase::SQL($dbc, $sql, "is", array($viplevel, $hash), false, false);
        }
        /**
         * funkcija koja vraca user id
         * @return int
         */
        function getID()
        {
            return $this->userID;
        }
        /**
         * funkcija koja vraca koliko bogdinara korisnik ima
         * @return int
         */
        function getBogdin()
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT Bogdinari
                FROM User
                WHERE User.ID = ?;
                SQL;

            $row = DataBase::SQL($dbc, $sql, "i", array($this->userID), true, true);

            mysqli_close($dbc);

            return $row[0]["Bogdinari"];
        }
        /**
         * funkcija koja dodaje $amount bogdinara korisniku
         * @param int $amount
         * @return null
         */
        function addBogdin($amount)
        {
            $dbc = DataBase::connectToDB();

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

            DataBase::SQL($dbc, $sql, "ii", array($tmp,$this->userID), false, false);

            mysqli_close($dbc);
        }
        /**
         * funkcija koja korisniku menja sifru da bude $newPassword
         * @param string $newPassword
         * @return null
         */
        function changePassword($newPassword)
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                UPDATE User
                SET User.Password = ?
                WHERE User.ID = ?
                SQL;

            $hashed = User::hashIt($newPassword);

            DataBase::SQL($dbc, $sql, "si", array($hashed, $this->userID), false, false);

            mysqli_close($dbc);
        }
        /**
         * funkcija koja korisniku povecava floor level
         * @return bool
         */
        function ascend()
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT BogdanFloor.CostToAscendTo
                FROM User, BogdanFloor
                WHERE User.ID = ? AND BogdanFloor.ID = User.BogdanFloorID + 1 AND User.Bogdinari >= BogdanFloor.CostToAscendTo
                SQL;

            $result = DataBase::SQL($dbc, $sql, "i", array($this->userID), false, true);

            if (count($result) > 0)
            {
                $price = $result[0]["CostToAscendTo"];
                $sql = <<<SQL
                    UPDATE User
                    SET User.Bogdinari = User.Bogdinari - ?, User.BogdanFloorID = User.BogdanFloorID + 1
                    WHERE User.ID = ? AND EXISTS (SELECT * FROM BogdanFloor WHERE BogdanFloor.ID = User.BogdanFloorID + 1)  
                    SQL;

                DataBase::SQL($dbc, $sql, "ii", array($price, $this->userID), false, false);

                mysqli_close($dbc);

                return true;
            } 
            else 
            {
                mysqli_close($dbc);
                return false;
            }
        }
        /**
         * funkcija koja vraca vip level korisnika
         * @return int
         */
        function getVip()
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT User.VIPLevelID
                FROM User
                WHERE User.ID = ?
                SQL;
            

            $retSql = DataBase::SQL($dbc, $sql, "i", array($this->userID), false, true);

            mysqli_close($dbc);

            return $retSql[0]["VIPLevelID"];
        }
        /**
         * funkcija koja kaze da li je korisnik admin
         * @return bool
         */
        function isAdmin()
        {
            return $this->getVip() == 5;
        }
        /**
         * funkcija koja vraca sve korisne informacije usera
         * @return array
         */
        function getAllUserInfo()
        {
            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                SELECT u.Username, u.Email, u.Bogdinari, VIPLevel.Name AS VipName, b1.ID AS FloorNumber, b1.Name AS FloorName, b1.CostToStay AS CostToStay, b2.CostToAscendTo AS CostToNext
                FROM User u JOIN BogdanFloor b1 LEFT JOIN BogdanFloor b2 ON b2.ID = u.BogdanFloorID + 1 LEFT JOIN VIPLevel ON u.VIPLevelID = VIPLevel.ID
                WHERE u.ID = ? AND b1.ID = u.BogdanFloorID
                SQL;
            
            $retSql = DataBase::SQL($dbc, $sql, "i", array($this->userID), false, true);

            mysqli_close($dbc);

            $ret = array();

            foreach ($retSql[0] as $key => $value)
                $ret[$key] = $value;

            return $ret;
        }
        /**
         * funkcija koja postavlja random hash useru u tabeli
         * @return string
         */
        function setRandomHash()
        {
            $seed = str_split('abcdefghijklmnopqrstuvwxyz'.'ABCDEFGHIJKLMNOPQRSTUVWXYZ');

            $str = "";
            for($i = 0; $i < 256; $i++){
                $str .= $seed[random_int(0, count($seed) - 1)];
            }

            $dbc = DataBase::connectToDB();

            $sql = <<<SQL
                UPDATE User
                SET User.paymentHash = ?
                WHERE User.ID = ?
                SQL;
            
            DataBase::SQL($dbc, $sql, "si", array($str,$this->userID), false, false);

            mysqli_close($dbc);

            return $str;
        }
    }
?>