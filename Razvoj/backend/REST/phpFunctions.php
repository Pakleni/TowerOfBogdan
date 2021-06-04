<?php
header('Access-Control-Allow-Origin: *');

//require 'phpFunctions.php';
//$playerID = getId($user, $pass);

function pepper($pass) {
	$pepper = "mehovic";

	return hash_hmac("sha256", $pass, $pepper);
}

function hashIt($pass) {

	return password_hash(pepper($pass), PASSWORD_ARGON2ID);
}

function SQL($dbc, $sql, $bind, $params, $resNeeded, $retNeeded)
{
	$stmt = mysqli_stmt_init($dbc);
	if (!mysqli_stmt_prepare($stmt, $sql)) {
		die("BadSQL: " . $sql);
	}

	if(count($params) != 0)
	{
		if (!call_user_func_array("mysqli_stmt_bind_param", array_merge(array($stmt, $bind), $params))) {
			if (strpos($sql, "?") !== false) die("Can't bind: " . $sql);
		}
	}

	if (!mysqli_stmt_execute($stmt)) {
		die("Can't exe: " . $sql);
	}
	
	$result = mysqli_stmt_get_result($stmt);

	if ($result === FALSE && mysqli_errno($dbc) !== 0) {
		die("Error Code: " . strval(mysqli_errno($dbc)));
	}

	$ret = array();

	if(!$retNeeded)
		return $ret;

	if (mysqli_num_rows($result) > 0) {
		while ($row = mysqli_fetch_assoc($result)) {
			array_push($ret, $row);
		}
	} else {
		if ($resNeeded === TRUE)
			die("NoResult: " . $sql);
	}

	return $ret;
}

function connectToDB()
{
	$user = 'bogdan';
	$pass = 'glupasifra';
	$db = 'towerofbogdan';

	$dbc = mysqli_connect('localhost', $user, $pass, $db) or die("Unable to connect");
	return $dbc;
}

function getId($mail, $pass)
{	
	$playerID = -1;

	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT *
		FROM User
		WHERE Email = ?
		SQL;

	$result = SQL($dbc, $sql, "s", array($mail), false, true);
	
	
	if (count($result) > 0) {
		$row = $result[0];
		if (password_verify(pepper($pass), $row['Password'])) {
			$playerID = $row['ID'];
		}
	}

	mysqli_close($dbc);

	return $playerID;
}

function updateBogdin($id, $amount)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		UPDATE User
		SET Bogdinari = Bogdinari + ?
		WHERE User.ID = ?
		SQL;

	SQL($dbc, $sql, "ii", array($amount,$id), false, false);
}

function getBogdin($id)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT Bogdinari
		FROM User
		WHERE User.ID = ?;
		SQL;

	$row = SQL($dbc, $sql, "i", array($id), true, true);

	return $row[0]["Bogdinari"];
}

function createAccount($user, $pass, $mail)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT *
		FROM User
		WHERE Email = ?
		SQL;

    $result = SQL($dbc, $sql, "s", array($mail), false, true);
	
	if (count($result) > 0) { return false; }

    $hashed = hashIt($pass);

    $sql = <<<SQL
		INSERT INTO User(Username, User.Password, Email, VIPLevelID, BogdanFloorID)
		VALUES (?, ?, ?, 1, 1)
		SQL;

    SQL($dbc, $sql, "sss", array($user, $hashed, $mail), false, false);

	return true;
}

function checkEmail($mail)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT *
		FROM User
		WHERE Email = ?
		SQL;

    $result = SQL($dbc, $sql, "s", array($mail), false, true);
	
	if (count($result) > 0) { return true; }
	return false;
}

function checkUsername($username)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT *
		FROM User
		WHERE Username = ?
		SQL;

    $result = SQL($dbc, $sql, "s", array($username), false, true);
	
	if (count($result) > 0) { return true; }
	return false;
}

function changePassword($id, $newPassword)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		UPDATE User
		SET User.Password = ?
		WHERE User.ID = ?
		SQL;

	$hashed = hashIt($newPassword);

	SQL($dbc, $sql, "si", array($hashed, $id), false, false);
}

function ascend($id)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT BogdanFloor.CostToAscendTo
		FROM User, BogdanFloor
		WHERE User.ID = ? AND BogdanFloor.ID = User.BogdanFloorID + 1 AND User.Bogdinari >= BogdanFloor.CostToAscendTo
		SQL;

    $result = SQL($dbc, $sql, "i", array($id), false, true);

	if (count($result) > 0) {
		$price = $result[0]["CostToAscendTo"];
		$sql = <<<SQL
			UPDATE User
			SET User.Bogdinari = User.Bogdinari - ?, User.BogdanFloorID = User.BogdanFloorID +1
			WHERE User.ID = ?
			SQL;

		SQL($dbc, $sql, "ii", array($price, $id), false, false);

		return true;
	} else return false;
}

function getTop5()
{
	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT User.Username, User.BogdanFloorID
		FROM User
		ORDER BY User.BogdanFloorID DESC
		LIMIT 5
		SQL;
	

	$retSql = SQL($dbc, $sql, "", array(), false, true);

	$ret = array();

	foreach ($retSql as $key => $value) {
		array_push($ret, $value);
	}

	return $ret;
}

function getVip($id)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT User.VIPLevelID
		FROM User
		WHERE User.ID = ?
		SQL;
	

	$retSql = SQL($dbc, $sql, "i", array($id), false, true);

	return $retSql[0]["VIPLevelID"];
}

function getUser($id)
{
	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT User.Username, User.Email, User.Bogdinari, VIPLevel.Name, b1.Name AS FloorName, b1.CostToStay AS CostToStay, b2.CostToAscendTo AS CostToNext
		FROM User, VIPLevel, BogdanFloor b1, BogdanFloor b2
		WHERE User.ID = ? AND User.VIPLevelID = VIPLevel.ID AND b1.ID = User.BogdanFloorID AND b2.ID = User.BogdanFloorID + 1
		SQL;
	
	$retSql = SQL($dbc, $sql, "i", array($id), false, true);

	$ret = array();

	foreach ($retSql[0] as $key => $value) {
		$ret[$key] = $value;
	}

	return $ret;
}

function getHash($id){
	$seed = str_split('abcdefghijklmnopqrstuvwxyz'.'ABCDEFGHIJKLMNOPQRSTUVWXYZ');

	$str = "";
	for($i = 0; $i < 256; $i++){
		$str += $seed[random_int(0, count($seed) - 1)];
	}

	$dbc = connectToDB();

	$sql = <<<SQL
		UPDATE User
		SET User.paymentHash = ?
		WHERE User.ID = ?
		SQL;
	
	$retSql = SQL($dbc, $sql, "si", array($str,$id), false, false);

	return $str;
}

function setBogdinarHesh($hash, $amount)
{
	$playerID = -1;

	$dbc = connectToDB();

	$sql = <<<SQL
		SELECT *
		FROM User
		WHERE User.paymentHash = ?
		SQL;

	$result = SQL($dbc, $sql, "s", array($hash), false, true);
	
	
	if (count($result) > 0) {
		$row = $result[0];
		$playerID = $row['ID'];

		updateBogdin($playerID, $amount);
	}
}