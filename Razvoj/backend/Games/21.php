<?php
    //Radio Nemanja Mehovic 2018/0452
    define("allCards",[1,2,3,4,5,6,7,8,9,10,11]);
    class Game21
    {
        private $cardsAvailable;
        private $playerCards;
        private $dealerCards;
        private $winner;

        function __construct($currentState)
        {
            $this->winner = 0;
            $this->playerCards = array();
            $this->dealerCards = array();
            $this->cardsAvailable = array();

            foreach (allCards as $key => $value)
                $this->cardsAvailable[$key] = $value;

            if($currentState != null)
            {
                $this->playerCards = $currentState[0];
                $this->dealerCards = $currentState[1];
                foreach ($this->playerCards as $tmp)
                    if(($pos = array_search($tmp, $this->cardsAvailable, true)) !== false)
                        array_splice($this->cardsAvailable, $pos, 1);
                foreach ($this->dealerCards as $tmp)
                    if(($pos = array_search($tmp, $this->cardsAvailable, true)) !== false)
                        array_splice($this->cardsAvailable, $pos, 1);
            }
            else
            {
                for($i = 0; $i < 4; $i++)
                {
                    if($i < 2)
                        $this->playerCards[$i] = $this->generateVal();
                    else
                        $this->dealerCards[$i - 2] = $this->generateVal();
                }

                if($this->checkIf21($this->playerCards))
                    $this->winner = 1;
                else if($this->checkIf21($this->dealerCards))
                    $this->winner = -1;
            }
        }

        function hit()
        {
            if($this->winner != 0)
                return;
            array_push($this->playerCards,$this->generateVal());
            if($this->checkIf21($this->playerCards))
            {
                $this->winner = 1;
                return;
            }
            if($this->checkIfBusted($this->playerCards))
            {
                $this->winner = -1;
                return;
            }

            $sum = 0;
            foreach ($this->dealerCards as $tmp)
                $sum += $tmp;
            if($sum >= 17)
                return;

            array_push($this->dealerCards,$this->generateVal());
            if($this->checkIf21($this->dealerCards))
            {
                $this->winner = -1;
                return;
            }
            if($this->checkIfBusted($this->dealerCards))
            {
                $this->winner = 1;
                return;
            }
        }

        function stand()
        {
            if($this->winner != 0)
                return;

            $sumP = 0;
            foreach ($this->playerCards as $tmp)
                $sumP += $tmp;
            $sumD = 0;
            foreach ($this->dealerCards as $tmp)
                $sumD += $tmp;
            
            while($sumD < 17)
            {
                $val = $this->generateVal();
                $sumD += $val;
                array_push($this->dealerCards,$val);
            }
            if($this->checkIfBusted($this->dealerCards))
            {
                $this->winner = 1;
                return;
            }
            do
            {
                if($sumP > $sumD)
                {
                    $this->winner = 1;
                    return;
                }
                else if($sumP < $sumD)
                {
                    $this->winner = -1;
                    return;
                }
                $tmp = $this->generateVal();
                $sumD += $tmp;
                array_push($this->dealerCards, $tmp);
                if($this->checkIfBusted($this->dealerCards))
                {
                    $this->winner = 1;
                    return;
                }
            }while(true);
        }

        function getReward($bet)
        {
            $reward = 0;
            if($this->winner == 1)
                $reward = $bet * 2;
            return $reward;
        }

        function getState()
        {
            return array($this->playerCards, $this->dealerCards);
        }

        function getWinner()
        {
            return $this->winner;
        }

        private function checkIf21($arr)
        {
            $sum = 0;
            foreach ($arr as $tmp)
                $sum += $tmp;
            return $sum == 21;
        }

        private function checkIfBusted($arr)
        {
            $sum = 0;
            foreach($arr as $tmp)
                $sum += $tmp;
            return $sum > 21;
        }

        private function generateVal()
        {
            $val = -1;
            $pos = false;
            do
            {
                $val = random_int(min($this->cardsAvailable), max($this->cardsAvailable));
                if(($pos = array_search($val, $this->cardsAvailable, true)) !== false)
                    array_splice($this->cardsAvailable, $pos, 1);
            }while($pos === false);
            return $val;
        }
    }


?>