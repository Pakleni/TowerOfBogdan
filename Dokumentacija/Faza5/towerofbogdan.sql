-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 06, 2021 at 07:50 PM
-- Server version: 10.3.27-MariaDB-0+deb10u1
-- PHP Version: 7.3.27-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `towerofbogdan`
--

-- --------------------------------------------------------

--
-- Table structure for table `BogdanFloor`
--

CREATE TABLE `BogdanFloor` (
  `ID` int(11) NOT NULL,
  `Name` varchar(60) NOT NULL,
  `CostToAscendTo` bigint(255) NOT NULL,
  `CostToStay` bigint(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `BogdanFloor`
--

INSERT INTO `BogdanFloor` (`ID`, `Name`, `CostToAscendTo`, `CostToStay`) VALUES
(1, 'Tourist', 0, 0),
(2, 'Lower Fool', 115, 47),
(3, 'Upper Fool', 133, 55),
(4, 'Lower Magician', 154, 64),
(5, 'Upper Magician', 179, 75),
(6, 'Lower High Priestess', 209, 89),
(7, 'Upper High Priestess', 245, 107),
(8, 'Lower Empress', 289, 129),
(9, 'Upper Empress', 342, 156),
(10, 'Lower Emperor', 407, 191),
(11, 'Upper Emperor', 488, 236),
(12, 'Lower Hierophant', 587, 293),
(13, 'Upper Hierophant', 711, 368),
(14, 'Lower Lovers', 866, 466),
(15, 'Upper Lovers', 1060, 595),
(16, 'Lower Chariot', 1306, 768),
(17, 'Upper Chariot', 1620, 1002),
(18, 'Lower Strength', 2022, 1321),
(19, 'Upper Strength', 2541, 1760),
(20, 'Lower Hermit', 3214, 2374),
(21, 'Upper Hermit', 4095, 3239),
(22, 'Lower Wheel of Fortune', 5256, 4475),
(23, 'Upper Wheel of Fortune', 6796, 6263),
(24, 'Lower Justice', 8855, 8885),
(25, 'Upper Justice', 11631, 12782),
(26, 'Lower Hanged Man', 15402, 18657),
(27, 'Upper Hanged Man', 20568, 27648),
(28, 'Lower Death', 27707, 41623),
(29, 'Upper Death', 37658, 63695),
(30, 'Lower Temperance', 51658, 99145),
(31, 'Upper Temperance', 71537, 157079),
(32, 'Lower Devil', 100038, 253491),
(33, 'Upper Devil', 141308, 416986),
(34, 'Lower Tower', 201684, 699722),
(35, 'Upper Tower', 290945, 1198733),
(36, 'Lower Star', 424351, 2098318),
(37, 'Upper Star', 625975, 3756178),
(38, 'Lower Moon', 934230, 6882339),
(39, 'Upper Moon', 1411130, 12919493),
(40, 'Lower Sun', 2158013, 24871115),
(41, 'Upper Sun', 3342533, 49149949),
(42, 'Lower Judgement', 5245633, 99812283),
(43, 'Upper Judgement', 8344337, 208521744),
(44, 'Lower World', 13459643, 448660052),
(45, 'Upper World', 22024424, 995391890);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `ID` int(11) NOT NULL,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(256) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Bogdinari` bigint(255) NOT NULL DEFAULT 100,
  `VIPLevelID` int(11) DEFAULT 1,
  `BogdanFloorID` int(11) DEFAULT 1,
  `paymentHash` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`ID`, `Username`, `Password`, `Email`, `Bogdinari`, `VIPLevelID`, `BogdanFloorID`, `paymentHash`) VALUES
(2, 'Pakleni', '$argon2id$v=19$m=65536,t=4,p=1$SGVUMmpMd0RiN3lRdk5hMQ$XAnTIS2ikki+sVQczKCVJl9skmWqOZsF/vGy3Kg5e4U', 'ognjenbjel@protonmail.com', 12342, 4, 45, 'eNCGYaOxexUhbhKjzhLXlPdvyytdVboBpNQWtXICSgTudkyIrFAzuWEwIxWjNcQifIJvIrurGxndoHugxvULbPSVdzKLFzneyWMXJzJyRsjWGbqaIxAVaFREbcwUjFqjoAgdsffeWFUTWDwhUwrGGhcWXXJzYgOEfLBiJuAoCunasYljaRIZnhPRugwpVByxHOYckZPDlxFetloMpQGHEbvktkYneBDHDQuGSgBeVDHjPBHlwcmXDCvYWVdGUKbj'),
(3, 'kbjefs', '$argon2id$v=19$m=65536,t=4,p=1$MkRVbVk3Y2RnZ0Z3VVdlUQ$M3G4gg7Knm5UW+webtK6vSOsRCz0iy2mQ5ZJd8pmTj4', 'ognjenbjel@gmail.com', 100, 1, 1, NULL),
(4, 'Gloginja99', '$argon2id$v=19$m=65536,t=4,p=1$UXkyZVJIMkpuS0JGV1B2MQ$15rFIlMxqBjO6xX3FeBP9qTgqJLXtz/PzE+UObWIoPw', 'amarko00@hotmail.com', 81, 1, 1, 'beFVsLQywdfnzbhGzZlTLOzGWWseZthdXPPTQljaUrysgAGLupFcChKrYLNlxAZdDDwJiJexGISKXJQwZctJjZdNprSfZfHIqnTrhELSIPOwcHHEjhYdRIqFEfKkyFILbSFyiFDzjQZmGQddMQpuTvzOWvyLPVoAhqKxQLUiytFMAYIwabYSdshZTqdceUHEiNptyorwfmqVmOIFdzRAxvseNTmmCENIOwWbSUprlRTxthLuhKmzkDuGoeYdiNdL'),
(5, 'mikipace', '$argon2id$v=19$m=65536,t=4,p=1$TzFtVFRRSkNzM0VaYWZnag$6N8oVkIzDwhtfAzPmSaf8sotybSZzgLqNtatWyGcgnA', 'mihailopacaric@gmail.com', 100, 5, 1, NULL),
(8, 'ognjenbjel@protonmail.com', '$argon2id$v=19$m=65536,t=4,p=1$dWFVdnBpYkxDTVkyaDlrWA$2NaG1pbsRVrKxIMIapblXxSCOQWwe0EVptTDgfGRp8s', 'ognjenbje1l@protonmail.com', 100, 1, 1, NULL),
(9, 'teferi', '$argon2id$v=19$m=65536,t=4,p=1$L0R4R3FKL3pKc0VoeHFEVw$PMDGZRwashVvUr33p34zGwU/cflA7AaLSAy2Z4sxjvI', 'teferi@gmail.com', 160985, 4, 32, 'PgBXxllQMqNXoMbTtcQABTVusqWgyiCbpEVtwknwQtjIlXuEEATluUWWGUlddosSEEifCmmnBpPNCKFdJwkelaPHfiJIvbaUbZdJqKXDYszptgEvVzpnnLWbbebSkUzJmUSNchUNiLMEaQVQApeuXgtcwEwyxdydcweXKQHYhIoGZfmjLUbijSEHglArMTQiHhmorshqIAseMEHLrtaokSfxrvRngdQXPQdZHzSJVzoaZtVCcAKzzowtOQwCuMnh'),
(10, 'test', '$argon2id$v=19$m=65536,t=4,p=1$L05TMnlZR1FHcEhoakVMMQ$/Tj9YlQ0MYXF6BiQYAuk8ikyR6hr99v87ul+o7HlTa4', 'test@test.com', 58371, 4, 24, NULL),
(11, 'mikigrozni', '$argon2id$v=19$m=65536,t=4,p=1$NXVpRDZVLktxTHZyTHc0cA$M8NQZD4ZNcl9A1lhCWtqKzPo4nQtkkQ3TjM7Vqu59xA', 'mihailo@gmail.com', 0, 4, 29, 'OLhvLPOpmCblQSjJvcQzLqhPnEhnwaAVbCDWZxXumMcgYhuzMrfyZIXXqtjMXafFoeOKTiWUpfhDiPjgzBfvEtRHPDhlonZcuBamcTpSCFGvckiSXRovhpHVOOopcpvwuAjFzkjoynGpRozFjIbeHZOyZFqdQdtWSJCrxztfbCPIaCGrKjULKxwDcFaEaITphZoFmEbfYuIbmuTcbtVmRwIAaxHmjOTnlQcCatfTLUmBNMHCSTExkVPTQIjPHdwe'),
(12, 'dincabrdo', '$argon2id$v=19$m=65536,t=4,p=1$L0duclZBWFFvODV4Vnkubw$WVqAL9wyLlLHcNfet6EbaE4I2oS87S5zc2N7teMRvk8', 'a.dincic99@gmail.com', 100, 5, 1, NULL),
(13, 'nikola', '$argon2id$v=19$m=65536,t=4,p=1$MllZYzl6cGkyelFjMUcwUw$TiXKBiOl96h+ctPcnx0B43vQ5Et142vgFmtSZXsdHeg', 'nikola@dajic.com', 100, 1, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `VIPLevel`
--

CREATE TABLE `VIPLevel` (
  `ID` int(11) NOT NULL,
  `Name` varchar(60) NOT NULL,
  `Cost` bigint(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `VIPLevel`
--

INSERT INTO `VIPLevel` (`ID`, `Name`, `Cost`) VALUES
(1, 'Registrovan Korisnik', 0),
(2, 'VIP', 100),
(3, 'Bogdan', 500),
(4, 'VIP Bogdan', 25000),
(5, 'Admin', -1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `BogdanFloor`
--
ALTER TABLE `BogdanFloor`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `paymentHash` (`paymentHash`),
  ADD KEY `BogdanFloorID` (`BogdanFloorID`),
  ADD KEY `VIPLevelID` (`VIPLevelID`);

--
-- Indexes for table `VIPLevel`
--
ALTER TABLE `VIPLevel`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `BogdanFloor`
--
ALTER TABLE `BogdanFloor`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=793;
--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `VIPLevel`
--
ALTER TABLE `VIPLevel`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_ibfk_1` FOREIGN KEY (`BogdanFloorID`) REFERENCES `BogdanFloor` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `User_ibfk_2` FOREIGN KEY (`VIPLevelID`) REFERENCES `VIPLevel` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
