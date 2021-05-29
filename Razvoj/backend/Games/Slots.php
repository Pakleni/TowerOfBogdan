<?php
    //Radio Nemanja Mehovic 2018/0452
    //all symbols in their respactive categories
    define("basicSymbols", ["Cherry", "Lemon", "Eggplant", "Grapes", "Banana"]);
    define("eliteSymbols", ["Seven", "Diamond", "Egg", "Treasure"]);
    define("jackpotSymbols", "Bogdan");
    //chances of getting one symbol from each category
    define("basicChance", 75);
    define("eliteChance", 24);
    define("jackpotChance", 1);
    //Reward multipliers
    define("basicRewardsMultiplier", [1, 2, 5]);
    define("eliteRewardsMultiplier", [5, 10, 50]);
    define("jackpotRewardsMultiplier",[100, 500, 1000]);
    //num of columns and rows in slot machine
    define("rows", 3);
    define("col", 5);

    class Slots
    {
        private $matrix;

        function __construct()
        {
            $this->matrix = array();
            for ($i = 0; $i < rows; $i++)
            { 
                $this->matrix[$i] = array();
            }

            for ($i = 0; $i < rows; $i++)
                for($j = 0; $j < col; $j++)
                {
                    $tmp = random_int(1, 100);
                    if($tmp <= basicChance)
                        $this->matrix[$i][$j] = basicSymbols[random_int(0, count(basicSymbols) - 1)];
                    else if($tmp <= (basicChance + eliteChance))
                        $this->matrix[$i][$j] = eliteSymbols[random_int(0, count(eliteSymbols) - 1)];
                    else
                        $this->matrix[$i][$j] = jackpotSymbols;
                }
        }

        private function findLength($r, $c)
        {
            $cnt = 1;
            $queue = array();
            array_push($queue,array($r, $c));
            array_push($queue,NULL);
            while (count($queue) != 0)
            {
                $tmp = array_shift($queue);
                if ($tmp == NULL)
                {
                    if (count($queue) != 0)
                    {
                        $cnt++;
                        array_push($queue,NULL);
                    }
                } 
                else if ($tmp[1] < (col - 1))
                {
                    $current = $this->matrix[$tmp[0]][$tmp[1]];
                    if ($this->matrix[$tmp[0]][$tmp[1] + 1] == $current)
                    {
                        array_push($queue, array($tmp[0], $tmp[1] + 1));
                    } 
                    else if ($tmp[0] > 0 && $this->matrix[$tmp[0] - 1][$tmp[1] + 1] == $current) 
                    {
                        array_push($queue, array($tmp[0] - 1, $tmp[1] + 1));
                    } 
                    else if ($tmp[0] < (rows - 1) && $this->matrix[$tmp[0] + 1][$tmp[1] + 1] == $current)
                    {
                        array_push($queue, array($tmp[0] + 1, $tmp[1] + 1));
                    }
                }
            }
            return $cnt;
        }

        private function calculateReward($symbol, $length, $bet)
        {
            for ($i = 0; $i < count(basicSymbols); $i++)
                if (basicSymbols[$i] == $symbol)
                    return $bet * basicRewardsMultiplier[$length - 3];
            for ($i = 0; $i < count(eliteSymbols); $i++)
                if (eliteSymbols[$i] == $symbol)
                    return $bet * eliteRewardsMultiplier[$length - 3];
            if(jackpotSymbols == $symbol)
                return $bet * jackpotRewardsMultiplier[$length - 3];
            return 0;
        }


        function getReward($bet)
        {
            $reward = array(0, 0, NULL);
            for($i = 0; $i < (col - 2); $i++)
                for($j = 0; $j < rows; $j++)
                {
                    $tmp = $this->matrix[$j][$i];
                    if ($i > 0 && ($this->matrix[$j][$i - 1] == $tmp || ($j > 0 && $this->matrix[$j - 1][$i - 1] == $tmp) || ($j < (rows - 1) && $this->matrix[$j + 1][$i - 1] == $tmp)))
                        continue;
                    $length = $this->findLength($j, $i, $this->matrix);
                    if($length >= 3)
                    {
                        $tmpReward = $this->calculateReward($tmp, $length, $bet);
                        if($tmpReward > $reward[0])
                        {
                            $reward[0] = $tmpReward;
                            $reward[1] = $length;
                            $reward[2] = $tmp;
                        }
                    }
                }
            return $reward;
        }

        function getSymbols()
        {
            return $this->matrix;
        }
    }
?>