<?php
    //Radio Nemanja Mehovic 2018/0452
    define("nonNumberFields",["00","red","black","even","odd","1to18","19to36","1st12","2nd12","3rd12","col1","col2","col3"]);
    define("red",[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
    define("singleDigitMultiplier",36);
    define("rowColMultiplier",3);
    define("evenSplitMultiplier",2);

    class Roulette
    {
        private $num;

        function __construct()
        {
            $this->num = random_int(0, 37);
        }

        function getReward($bets)
        {
            $reward = 0;
            foreach($bets as $tmp)
            {
                if(($pos = array_search($tmp->field,nonNumberFields,true)) !== false)
                {
                    switch(nonNumberFields[$pos])
                    {
                        case "00":
                            if($this->num == 37)
                                $reward += $tmp->bet * singleDigitMultiplier;
                        break;
                        case "red":
                            if(array_search($this->num,red,true))
                                $reward += $tmp->bet * evenSplitMultiplier;
                        break;
                        case "black":
                            if(!array_search($this->num,red,true) && $this->num != 0 && $this->num != 37)
                                $reward += $tmp->bet * evenSplitMultiplier;
                        break;
                        case "even":
                            if(($this->num % 2) == 0 && $this->num != 0)
                                $reward += $tmp->bet * evenSplitMultiplier;
                        break;
                        case "odd":
                            if(($this->num % 2) != 0 && $this->num != 37)
                                $reward += $tmp->bet * evenSplitMultiplier;
                        break;
                        case "1to18":
                            if($this->num >= 1 && $this->num <= 18)
                                $reward += $tmp->bet * evenSplitMultiplier;
                        break;
                        case "19to36":
                            if($this->num >= 19 && $this->num <= 36)
                                $reward += $tmp->bet * evenSplitMultiplier;
                        break;
                        case "1st12":
                            if($this->num >= 1 && $this->num <= 12)
                                $reward += $tmp->bet * rowColMultiplier;
                        break;
                        case "2nd12":
                            if($this->num >= 13 && $this->num <= 24)
                                $reward += $tmp->bet * rowColMultiplier;
                        break;
                        case "3rd12":
                            if($this->num >= 25 && $this->num <= 36)
                                $reward += $tmp->bet * rowColMultiplier;
                        break;
                        case "col1":
                            for($i = 1; $i <= 34; $i += 3)
                                if($this->num == $i)
                                    $reward += $tmp->bet * rowColMultiplier;
                        break;
                        case "col2":
                            for($i = 2; $i <= 35; $i += 3)
                                if($this->num == $i)
                                    $reward += $tmp->bet * rowColMultiplier;
                        break;
                        case "col3":
                            for($i = 3; $i <= 36; $i += 3)
                                if($this->num == $i)
                                    $reward += $tmp->bet * rowColMultiplier;
                        break;
                    }
                }
                else if($this->num == $tmp->field)
                    $reward += $tmp->bet * singleDigitMultiplier;
            }
            return $reward;
        }

        function getNum()
        {
            return $this->num;
        }
    }

?>