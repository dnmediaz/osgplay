ALTER TABLE `market`
  ADD `isManualMatchOdds` TINYINT(4) NOT NULL DEFAULT '0' AFTER `gin_play_stake`,
  ADD `isBetAllowedOnManualMatchOdds` TINYINT(4) NOT NULL DEFAULT '0' AFTER `isManualMatchOdds`;


-- manual_match_odds   -------------------------------------------------------------

CREATE TABLE `manual_match_odds` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `market_id` VARCHAR(100) NULL DEFAULT NULL,
  `team1_back` DECIMAL(10,2) NULL DEFAULT NULL,
  `team1_lay` DECIMAL(10,2) NULL DEFAULT NULL,
  `team2_back` DECIMAL(10,2) NULL DEFAULT NULL,
  `team2_lay` DECIMAL(10,2) NULL DEFAULT NULL,
  `draw_back` DECIMAL(10,2) NULL DEFAULT NULL,
  `draw_lay` DECIMAL(10,2) NULL DEFAULT NULL,
  `createdOn` DATETIME NULL DEFAULT NULL,
  `updatedOn` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
)
  COLLATE='latin1_swedish_ci'
  ENGINE=InnoDB
  AUTO_INCREMENT=1;

ALTER TABLE `manual_match_odds`
  ADD `active` TINYINT(4) NOT NULL DEFAULT '0' AFTER `draw_lay`;

--

ALTER TABLE `tblbets` ADD `type` ENUM('auto','manual') NOT NULL DEFAULT 'auto' AFTER `isApp`;

--

DROP PROCEDURE IF EXISTS `sp_PlaceBet`;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_PlaceBet`(IN `pLogInId` INT, IN `pUserId` INT,
                                                          IN `pParantId` INT, IN `pMatchId` INT,
                                                          IN `pSelectionId` INT, IN `pStack` INT,
                                                          IN `pMarketId` VARCHAR(100),
                                                          IN `pselectionName` VARCHAR(100), IN `pMstDate` DATETIME,
                                                          IN `pOdds` DECIMAL(10, 2), IN `pP_L` DECIMAL(10, 2),
                                                          IN `pisBack` INT, IN `pIsMatched` INT,
                                                          IN `pNarration` VARCHAR(200),
                                                          IN `pdeviceInfo` VARCHAR(100),
                                                          IN `pIP_ADDESSS` VARCHAR(100), IN `pInPlayStack` INT,
                                                          IN `pIsApp` INT,
                                                          IN `pType` VARCHAR(100))
  BEGIN
    DECLARE LID INTEGER;
    DECLARE lCtr integer;
    DECLARE resultV INT;
    DECLARE retMess VARCHAR(500);
    DECLARE checkBal decimal(50, 2);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
      set resultV = -1;
      GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
      SET retMess = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
      ROLLBACK;
      select resultV, retMess;
    END;
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
      set resultV = -2;
      GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
      SET retMess = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
      ROLLBACK;
      SELECT resultV, retMess;
    END;

    MainLabel: BEGIN
      DECLARE InStack INTEGER;
      DECLARE InTotalStack INTEGER;

      set InTotalStack = pStack + (select IFNULL(SUM(Stack), 0)Stack
                                   from tblbets
                                   where userid = pUserId
                                     and MatchId = pMatchId
                                     and MarketId = pMarketId);
      set InStack = (select IFNULL(InPlayStack, 0)InPlayStack from createmaster where mstrid = pUserId);
      IF pInPlayStack = 1 and InTotalStack > InStack and InStack > 0
      THEN
        SET resultV = -4;
        SET retMess = CONCAT("Check Stack Limit In InPlay ...", InStack);
        SELECT resultV, retMess;
        LEAVE MainLabel;
      END IF;

      SET resultV = 0;
      SET lCtr = (SELECT COUNT(*) FROM tblpartner WHERE UserID = pUserId);
      if lCtr = 0
      then
        SET resultV = -3;
        SET retMess = CONCAT("ERROR ", "No Partner for user");
        SELECT resultV, retMess;
      END IF;
      IF lCtr > 0
      THEN


        INSERT INTO tblbets (LogInId,
                             UserId,
                             ParantId,
                             MatchId,
                             SelectionId,
                             Stack,
                             MarketId,
                             selectionName,
                             MstDate,
                             Odds,
                             P_L,
                             isBack,
                             IsMatched,
                             deviceInfo,
                             IP_ADDESSS,
                             SAdmin,
                             Admin,
                             MASTER,
                             Dealer,
                             isApp,type)
        SELECT pLogInId,
               pUserId,
               a.parentid,
               pMatchId,
               pSelectionId,
               pStack,
               pMarketId,
               pselectionName,
               pMstDate,
               pOdds,
               pP_L,
               pisBack,
               pIsMatched,
               pdeviceInfo,
               pIP_ADDESSS,
               0,
               Admin,
               MASTER,
               Dealer,
               pIsApp,pType
        FROM createmaster a
               inner join tblpartner b on a.mstrid = b.UserID
        WHERE a.useType = 3
          and a.mstrid = pUserId;
        SET resultV = LAST_INSERT_ID();


        set checkBal = (SELECT ROUND(IFNULL(c.Chips, 0) + IFNULL(j.ChipBal, 0) + case
                                                                                   when
            ROUND(IFNULL(i.Liability, 0) + IFNULL(L.Liability, 0) +
                  IFNULL(N.Liability, 0) + IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0) + IFNULL(O.Liability, 0) +
                  IFNULL(qryOddEven.Liability, 0), 2) < 0 then ROUND(IFNULL(i.Liability, 0) + IFNULL(L.Liability, 0) +
                                                                     IFNULL(N.Liability, 0) + IFNULL(k.Liability, 0) +
                                                                     IFNULL(M.Liability, 0) +
                                                                     IFNULL(O.Liability, 0) +
                                                                     IFNULL(qryOddEven.Liability, 0), 2)
                                                                                   else 0 end, 2) Balance
                        FROM (SELECT SUM(P_L)Lay
                              FROM tblbets
                              WHERE isBack = 1
                                AND UserId = pUserId
                                AND Result IS NULL
                                AND ResultID IS NULL) a,
                             (SELECT SUM(Stack)Stack
                              FROM tblbets
                              WHERE isBack = 0
                                AND UserId = pUserId
                                AND Result IS NULL
                                AND ResultID IS NULL)b,
                             (SELECT SUM(Chips)Chips
                              FROM tblchips
                              WHERE IsFree = 1
                                AND ResultID IS NULL
                                AND BetID IS NULL
                                AND UserID = pUserId)c,
                             (SELECT SUM(a.ChipsCr - a.ChipsDr) Chips FROM tblchipdet a WHERE a.UserID = pUserId) d,
                             (SELECT IFNULL(SUM(P_L), 0)P_L
                              FROM `tblbets`
                              WHERE result = 1
                                AND isBack = 0
                                AND UserID = pUserId)e,
                             (SELECT IFNULL(SUM(-P_L), 0)P_L
                              FROM `tblbets`
                              WHERE result = 1
                                AND isBack = 1
                                AND UserID = pUserId)f,
                             (SELECT IFNULL(SUM(-Stack), 0)P_L
                              FROM `tblbets`
                              WHERE result = 0
                                AND isBack = 0
                                AND UserID = pUserId)g,
                             (SELECT IFNULL(SUM(Stack), 0)P_L
                              FROM `tblbets`
                              WHERE result = 0
                                AND isBack = 1
                                AND UserID = pUserId)h,
                             (Select sum(X.mSum)Liability
                              from (select min(a.pnlvalue)'mSum'
                                    from (SELECT SUM(winValue + lossValue) pnlvalue, matchId, MarketId, SelectionId
                                          FROM vewUserPnlDetails
                                          WHERE userId = pUserId
                                          GROUP BY matchId, MarketId, SelectionId)a
                                    Where a.pnlvalue < 0
                                    group by MarketId)X) i,
                             (SELECT SUM(IFNULL(ChipsCr, 0) - IFNULL(ChipsDr, 0)) ChipBal
                              FROM tblchipdet
                              WHERE UserID = pUserId)j,
                             (SELECT SUM(minvalue) Liability
                              FROM (SELECT MIN(pnlvalue) minvalue, matchId, MarketId
                                    FROM (SELECT SUM(aa) pnlvalue, matchId, fancyid MarketId, yes SelectionId
                                          FROM vewsessionliability
                                          WHERE userId = pUserId
                                          GROUP BY yes, matchId, fancyid) X
                                    GROUP BY matchId, MarketId) Y) k,
                             (select SUM(bet_value) * -1 Liability
                              from `bet_entry`
                              where TypeID in (3)
                                and ResultID is null
                                and userid = pUserId)L,
                             (SELECT SUM(minvalue) Liability
                              FROM (SELECT MIN(pnlvalue) minvalue, matchId, MarketId
                                    FROM (SELECT SUM(aa) pnlvalue, matchId, fancyid MarketId, runvalue SelectionId
                                          FROM vewUpDownliability
                                          WHERE userId = pUserId
                                          GROUP BY runvalue, matchId, fancyid) X1
                                    GROUP BY matchId, MarketId) Y1) M,
                             (select SUM(bet_value) * -1 Liability
                              from `bet_entry` a
                                     inner join matchfancy b on a.fancyId = b.ID
                              where a.TypeID = 4
                                and ResultID is null
                                and userid = pUserId)N,
                             (SELECT SUM(winValue) Liability FROM vewUserPnlUnMOnly WHERE userId = pUserId) O,
                             (select ifnull(Liability, 0) *
                                     case when ifnull(Liability, 0) > 0 then -1 else 1 end Liability
                              from (select SUM(case when OddValue = 1 then 1 else -1 end * bet_value) Liability
                                    from `bet_entry`
                                    where TypeID in (1)
                                      and ResultID is null
                                      and userid = pUserId) qryOEinner) qryOddEven);
        IF checkBal >= 0
        THEN


          SET resultV = 0;
          IF pIsMatched = 0
          THEN
            SET retMess = "Unmatched bet saved successfully";
          ELSE
            SET retMess = "Saved Successfully";
          END IF;
          SELECT resultV, retMess;
        end if;
        IF checkBal < 0
        THEN

          SET retMess = "Insufficient Balance";
          SELECT resultV, retMess;
        end if;

      end if;

    End;
  END$$
DELIMITER ;