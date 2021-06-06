<?php
    //Radio Nemanja Mehovic 2018/0452
    //sve moguce karte koje mogu da se izvuku
    define("allCards",[1,2,3,4,5,6,7,8,9,10,11]);
    /**
     *  Game21 - klasa za igranje igre 21
     *
     *  @version 1.1
     */
    class Game21
    {
        /**
         * promenljiva koja sadrzi karte koje mogu da izvuku diler i player
         * @var array
        */
        private $cardsAvailable;
        /**
         * karte koje player trenutno ima
         * @var array
        */
        private $playerCards;
        /**
         * larte koje diler trenutno ima
         * @var array
        */
        private $dealerCards;
        /**
         * pobednik igre 1 - pobedio je igrac -1 -pobednik je diler 0 - igra se idalje igra
         * @var int
        */
        private $winner;
        /**
         * konstruktor za pravljenje igre 21 inicijalizuje sa sa prethodnim stanjem igre ili ako je prethodno stanje null pravi pocetno stanje
         * @param array $currentState
         * @return null
        */
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
        /**
         * funkcija za igranje igre gde igrac i diler izvlace po jednu kartu(igra moze se zaustaviti sa ovom funkciom ako neko pobedi)
         * @return null
        */
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
        /**
         * funkcija za zaustavljanje igre
         * @return null
        */
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
        /**
         * funkcija za dohvatanje koliko je igrac osvojio
         * @param int $bet
         * @return int
        */
        function getReward($bet)
        {
            $reward = 0;
            if($this->winner == 1)
                $reward = $bet * 2;
            return $reward;
        }
        /**
         * funkcija koja vraca trenutno stanje igre
         * @return array
        */
        function getState()
        {
            return array($this->playerCards, $this->dealerCards);
        }
        /**
         * funkcija koja vraca pobednika
         * @return int
        */
        function getWinner()
        {
            return $this->winner;
        }
        /**
         * funkcija koja samo proverava da li zbig brojeva u nizu $arr je jednak 21
         * @param array $arr
         * @return bool
        */
        private function checkIf21($arr)
        {
            $sum = 0;
            foreach ($arr as $tmp)
                $sum += $tmp;
            return $sum == 21;
        }
        /**
         * funkcija koja proverava da li je zbir brojeva u nizu $arr veci od 21
         * @param array $arr
         * @return bool
        */
        private function checkIfBusted($arr)
        {
            $sum = 0;
            foreach($arr as $tmp)
                $sum += $tmp;
            return $sum > 21;
        }
        /**
         * funkcija za generisanje nasumicnog broja izmedju min(cardsAvailable) i max(cardsAvailable) koji je validan
         * @return int
        */
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