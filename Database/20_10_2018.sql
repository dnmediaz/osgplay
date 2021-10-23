-- all run on betdip demo

DROP PROCEDURE IF EXISTS `SP_GetBetting`;
DELIMITER $$
CREATE  PROCEDURE `SP_GetBetting`(IN `pUserID` INT, IN `pTypeID` INT, IN `pMarketID` VARCHAR(100), IN `pMatchId` INT)
  BEGIN
    DECLARE  LID INTEGER ;
    set @num:=0;
    IF pTypeID = 3 THEN

      IF pMarketID = 0 THEN
        SELECT  * ,(@num:=@num+1) SrNo  FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L , bet.UserId
                                              FROM tblbets bet
                                                     INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                     LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                              WHERE bet.UserId = pUserID AND bet.MatchId = pMatchId
                                              UNION
                                              SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', a.session_no_size ,'-' , a.session_yes_size ,')' ) else a.FHeadName end  selectionName,FORMAT(a.OddsNumber,0) Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate, a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,FORMAT((CASE WHEN a.OddValue = 1 THEN a.bet_value WHEN a.OddValue = 0 THEN (a.bet_value * (a.session_yes_size/100)) ELSE 0 END), 0) P_L,a.userid UserId
                                              FROM bet_entry a
                                                     inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                     INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                     LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                              WHERE a.UserId = pUserID AND a.matchID =pMatchId  )a  ORDER BY orgDate DESC ;

      ELSE

        SELECT  * ,(@num:=@num+1) SrNo  FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack,  DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L , bet.UserId
                                              FROM tblbets bet
                                                     INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                     LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                              WHERE bet.UserId = pUserID AND bet.MarketId = pMarketID
                                              UNION
                                              SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', a.session_no_size ,'-' , a.session_yes_size ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,FORMAT((CASE WHEN a.OddValue = 1 THEN a.bet_value WHEN a.OddValue = 0 THEN (a.bet_value * (a.session_yes_size/100)) ELSE 0 END), 0) P_L,a.userid UserId
                                              FROM bet_entry a
                                                     inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                     INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                     LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                              WHERE a.UserId = pUserID AND a.matchID =pMatchId  )a  ORDER BY orgDate DESC ;

      END IF;

    ELSE IF pTypeID = 2 THEN
      SELECT * ,(@num:=@num+1) SrNo,(select COUNT(distinct UserId ) AUser FROM (SELECT bet.UserId FROM tblbets bet WHERE bet.ParantID = 649 AND bet.MarketId = pMarketID UNION All SELECT a.userid UserId FROM bet_entry a WHERE a.ParantID = 649 AND a.matchID =pMatchId  )a) AUser FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack,  DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L, bet.UserId
                                                                                                                                                                                                                                                                                           FROM tblbets bet
                                                                                                                                                                                                                                                                                                  INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                                                                                                                                                  LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                                                                                                                                                                                                                                                                           WHERE bet.ParantID = pUserID AND bet.MarketId = pMarketID
                                                                                                                                                                                                                                                                                           UNION
                                                                                                                                                                                                                                                                                           SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', a.session_no_size ,'-' , a.session_yes_size ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2) and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,FORMAT((CASE WHEN a.OddValue = 1 THEN a.bet_value WHEN a.OddValue = 0 THEN (a.bet_value * (a.session_yes_size/100)) ELSE 0 END), 0) P_L,a.userid UserId
                                                                                                                                                                                                                                                                                           FROM bet_entry a
                                                                                                                                                                                                                                                                                                  inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                                                                                                                                                  INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                                                                                                                                                  LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                                                                                                                                           WHERE a.ParantID = pUserID AND a.matchID =pMatchId  )a  ORDER BY orgDate DESC ;
    ELSE IF pTypeID = 1 THEN
      SELECT *,(@num:=@num+1) SrNo ,(select COUNT(distinct UserId ) AUser from (SELECT bet.UserId FROM tblbets bet  WHERE bet.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID) AND bet.MarketId = pMarketID
                                                                                UNION all
                                                                                SELECT a.userid UserId FROM bet_entry a
                                                                                WHERE a.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID)  AND a.matchID =pMatchId ) D)AUser FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack,  DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L, bet.UserId
                                                                                                                                                                                                                         FROM tblbets bet
                                                                                                                                                                                                                                INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                                                                                LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                                                                                                                                                                                                         WHERE bet.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID) AND bet.MarketId = pMarketID
                                                                                                                                                                                                                         UNION
                                                                                                                                                                                                                         SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName,  case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', a.session_no_size ,'-' , a.session_yes_size ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds  ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,FORMAT((CASE WHEN a.OddValue = 1 THEN a.bet_value WHEN a.OddValue = 0 THEN (a.bet_value * (a.session_yes_size/100)) ELSE 0 END), 0) P_L,a.userid UserId
                                                                                                                                                                                                                         FROM bet_entry a
                                                                                                                                                                                                                                inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                                                                                INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                                                                                LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                                                                         WHERE a.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID)  AND a.matchID =pMatchId  ) a  ORDER BY orgDate DESC ;
    ELSE IF pTypeID = 0 THEN
      SELECT  *,(@num:=@num+1) SrNo,(SELECT COUNT(distinct UserId ) AUser FROM (SELECT bet.UserId FROM tblbets bet WHERE bet.MarketId = pMarketID UNION all
                                                                                SELECT a.userid UserId FROM bet_entry a WHERE a.matchID =pMatchId) a)AUser FROM (SELECT crMid.mstruserid AS MasterName,crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack,  DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId,
                                                                                                                                                                        bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L , bet.UserId,bet.IP_ADDESSS ip
                                                                                                                                                                 FROM tblbets bet
                                                                                                                                                                        INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                        LEFT JOIN createmaster crPid ON bet.ParantId =
                                                                                                                                                                                                        crPid.mstrid
                                                                                                                                                                        LEFT JOIN createmaster crMid ON crPid.parentId = crMid.mstrid
                                                                                                                                                                 WHERE bet.MarketId = pMarketID UNION
                                                                                                                                                                 SELECT crMid.mstruserid AS  MasterName ,crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', a.session_no_size ,'-' , a.session_yes_size ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,
                                                                                                                                                                        a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2) and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,
                                                                                                                                                                        a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,FORMAT((CASE WHEN a.OddValue = 1 THEN a.bet_value WHEN a.OddValue = 0 THEN (a.bet_value * (a.session_yes_size/100)) ELSE 0 END), 0) P_L,a.userid UserId,a.IP_ADDRESS ip
                                                                                                                                                                 FROM bet_entry a
                                                                                                                                                                        inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                        INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                        LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                        LEFT JOIN createmaster crMid ON crPid.parentId = crMid.mstrid
                                                                                                                                                                 WHERE a.matchID =pMatchId) a  ORDER BY orgDate DESC ;
    END IF;
    END IF;
    END IF;
    END IF;
  END$$
DELIMITER ;



DROP PROCEDURE IF EXISTS `SP_GetBettingAll`;
DELIMITER $$
CREATE  PROCEDURE `SP_GetBettingAll`(IN `pUserID` INT, IN `pTypeID` INT, IN `pMarketID` VARCHAR(100), IN `pMatchId` INT)
  BEGIN
    DECLARE  LID INTEGER ;
    set @num:=0;
    IF pTypeID = 3 THEN

      IF pMarketID = 0 THEN
        SELECT  * ,(@num:=@num+1) SrNo  FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L , bet.UserId,matmst.matchName
                                              FROM tblbets bet
                                                     INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                     left JOIN matchmst matmst ON bet.MatchId = matmst.MstCode
                                                     LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                              WHERE bet.UserId = pUserID AND bet.MatchId = pMatchId
                                              UNION
                                              SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,(CASE WHEN a.OddValue = 0 THEN (a.bet_value * (m.YesValume/100)) WHEN a.OddValue = 1 THEN (a.bet_value * (m.NoValume/100)) ELSE 0 END) P_L,a.userid UserId,matmst.matchName
                                              FROM bet_entry a
                                                     inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                     INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                     left JOIN matchmst matmst ON a.matchId = matmst.MstCode
                                                     LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                              WHERE a.UserId = pUserID AND a.matchID =pMatchId  )a  ORDER BY orgDate DESC ;

      ELSE

        SELECT  * ,(@num:=@num+1) SrNo  FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L , bet.UserId,matmst.matchName
                                              FROM tblbets bet
                                                     INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                     LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                                     left JOIN matchmst matmst ON bet.MatchId = matmst.MstCode

                                              WHERE bet.UserId = pUserID AND bet.MarketId != pMarketID
                                              UNION
                                              SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate, a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId,matmst.matchName
                                              FROM bet_entry a
                                                     inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                     INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                     left JOIN matchmst matmst ON a.matchId = matmst.MstCode

                                                     LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                              WHERE a.UserId = pUserID AND a.matchID =pMatchId  )a  ORDER BY orgDate DESC ;

      END IF;

    ELSE IF pTypeID = 2 THEN
      SELECT * ,(@num:=@num+1) SrNo,(select COUNT(distinct UserId ) AUser FROM (SELECT bet.UserId FROM tblbets bet WHERE bet.ParantID = 649 AND bet.MarketId = pMarketID UNION All SELECT a.userid UserId FROM bet_entry a WHERE a.ParantID = 649 AND a.matchID =pMatchId  )a) AUser FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L, bet.UserId,matmst.matchName
                                                                                                                                                                                                                                                                                           FROM tblbets bet
                                                                                                                                                                                                                                                                                                  INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                                                                                                                                                  left JOIN matchmst matmst ON bet.MatchId = matmst.MstCode

                                                                                                                                                                                                                                                                                                  LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                                                                                                                                                                                                                                                                           WHERE bet.ParantID = pUserID AND bet.MarketId != pMarketID
                                                                                                                                                                                                                                                                                           UNION
                                                                                                                                                                                                                                                                                           SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2) and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId,matmst.matchName
                                                                                                                                                                                                                                                                                           FROM bet_entry a
                                                                                                                                                                                                                                                                                                  inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                                                                                                                                                  INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                                                                                                                                                  left JOIN matchmst matmst ON a.matchId = matmst.MstCode

                                                                                                                                                                                                                                                                                                  LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                                                                                                                                           WHERE a.ParantID = pUserID AND a.matchID =pMatchId  )a  ORDER BY orgDate DESC ;
    ELSE IF pTypeID = 1 THEN
      SELECT *,(@num:=@num+1) SrNo ,(select COUNT(distinct UserId ) AUser from (SELECT bet.UserId FROM tblbets bet  WHERE bet.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID) AND bet.MarketId != pMarketID
                                                                                UNION all
                                                                                SELECT a.userid UserId FROM bet_entry a
                                                                                WHERE a.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID)  AND a.matchID =pMatchId ) D)AUser FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L, bet.UserId,matmst.matchName
                                                                                                                                                                                                                         FROM tblbets bet
                                                                                                                                                                                                                                INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                                                                                left JOIN matchmst matmst ON bet.MatchId = matmst.MstCode

                                                                                                                                                                                                                                LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                                                                                                                                                                                                         WHERE bet.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID) AND bet.MarketId != pMarketID
                                                                                                                                                                                                                         UNION
                                                                                                                                                                                                                         SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName,  case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds  ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId,matmst.matchName
                                                                                                                                                                                                                         FROM bet_entry a
                                                                                                                                                                                                                                inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                                                                                INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                                                                                left JOIN matchmst matmst ON a.matchId = matmst.MstCode

                                                                                                                                                                                                                                LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                                                                         WHERE a.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID)  AND a.matchID !=pMatchId  ) a  ORDER BY orgDate DESC ;
    ELSE IF pTypeID = 0 THEN
      SELECT  *,(@num:=@num+1) SrNo,(SELECT COUNT(distinct UserId ) AUser FROM (SELECT bet.UserId FROM tblbets bet WHERE bet.MarketId != pMarketID UNION all
                                                                                SELECT a.userid UserId FROM bet_entry a WHERE a.matchID !=pMatchId) a)AUser FROM (SELECT crMid.mstruserid AS MasterName,crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId,
                                                                                                                                                                         bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L , bet.UserId,bet.IP_ADDESSS ip,matmst.matchName
                                                                                                                                                                  FROM tblbets bet
                                                                                                                                                                         INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                         left JOIN matchmst matmst ON bet.MatchId = matmst.MstCode

                                                                                                                                                                         LEFT JOIN createmaster crPid ON bet.ParantId =
                                                                                                                                                                                                         crPid.mstrid
                                                                                                                                                                         LEFT JOIN createmaster crMid ON crPid.parentId = crMid.mstrid
                                                                                                                                                                  WHERE bet.MarketId != pMarketID UNION
                                                                                                                                                                  SELECT crMid.mstruserid AS  MasterName ,crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,
                                                                                                                                                                         a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2) and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,
                                                                                                                                                                         a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId,a.IP_ADDRESS ip,matmst.matchName
                                                                                                                                                                  FROM bet_entry a
                                                                                                                                                                         inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                         INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                         LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                         left JOIN matchmst matmst ON a.matchId = matmst.MstCode

                                                                                                                                                                         LEFT JOIN createmaster crMid ON crPid.parentId = crMid.mstrid
                                                                                                                                                                  WHERE a.matchID !=pMatchId) a  ORDER BY orgDate DESC ;
    END IF;
    END IF;
    END IF;
    END IF;


  END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `SP_GetAllBetting`;
DELIMITER $$
CREATE  PROCEDURE `SP_GetAllBetting`(IN `pUserID` INT, IN `pTypeID` INT)
  BEGIN
    DECLARE  LID INTEGER ;
    set @num:=0;
    IF pTypeID = 3 THEN

      SELECT  * ,(@num:=@num+1) SrNo  FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L , bet.UserId
                                            FROM tblbets bet
                                                   INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                   LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                            WHERE bet.UserId = pUserID AND bet.ResultID IS NULL
                                            UNION
                                            SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate, a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId
                                            FROM bet_entry a
                                                   inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                   INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                   LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                            WHERE a.UserId = pUserID AND a.ResultID IS NULL  )a  ORDER BY orgDate DESC ;


    ELSE IF pTypeID = 2 THEN
      SELECT * ,(@num:=@num+1) SrNo,(select COUNT(distinct UserId ) AUser FROM (SELECT bet.UserId FROM tblbets bet WHERE bet.ParantID = 649 AND bet.MarketId = 1.129973968 UNION All SELECT a.userid UserId FROM bet_entry a WHERE a.ParantID = 649 AND a.matchID =28129198  )a) AUser FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate, bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L, bet.UserId
                                                                                                                                                                                                                                                                                             FROM tblbets bet
                                                                                                                                                                                                                                                                                                    INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                                                                                                                                                    LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                                                                                                                                                                                                                                                                             WHERE bet.ParantID = pUserID AND bet.MarketId = pMarketID
                                                                                                                                                                                                                                                                                             UNION
                                                                                                                                                                                                                                                                                             SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2) and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId
                                                                                                                                                                                                                                                                                             FROM bet_entry a
                                                                                                                                                                                                                                                                                                    inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                                                                                                                                                    INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                                                                                                                                                    LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                                                                                                                                             WHERE a.ParantID = pUserID AND a.matchID =pMatchId  )a  ORDER BY orgDate DESC ;
    ELSE IF pTypeID = 1 THEN
      SELECT *,(@num:=@num+1) SrNo ,(select COUNT(distinct UserId ) AUser from (SELECT bet.UserId FROM tblbets bet  WHERE bet.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID) AND bet.MarketId = pMarketID
                                                                                UNION all
                                                                                SELECT a.userid UserId FROM bet_entry a
                                                                                WHERE a.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID)  AND a.matchID =pMatchId ) D)AUser FROM (SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate, bet.MstDate orgDate, bet.IsMatched, bet.MarketId, bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L, bet.UserId
                                                                                                                                                                                                                         FROM tblbets bet
                                                                                                                                                                                                                                INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                                                                                LEFT JOIN createmaster crPid ON bet.ParantId = crPid.mstrid
                                                                                                                                                                                                                         WHERE bet.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID) AND bet.MarketId = pMarketID
                                                                                                                                                                                                                         UNION
                                                                                                                                                                                                                         SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName,  case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds  ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId
                                                                                                                                                                                                                         FROM bet_entry a
                                                                                                                                                                                                                                inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                                                                                INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                                                                                LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                                                                         WHERE a.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID)  AND a.matchID =pMatchId  ) a  ORDER BY orgDate DESC ;
    ELSE IF pTypeID = 0 THEN
      SELECT  *,(@num:=@num+1) SrNo,(SELECT COUNT(distinct UserId ) AUser FROM (SELECT bet.UserId FROM tblbets bet WHERE bet.MarketId = pMarketID UNION all
                                                                                SELECT a.userid UserId FROM bet_entry a WHERE a.matchID =pMatchId) a)AUser FROM (SELECT crMid.mstruserid AS MasterName,crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, bet.selectionName, bet.Odds, bet.Stack, bet.isBack, DATE_FORMAT(bet.MstDate,"%d-%b-%Y %H:%i:%S") MstDate,bet.MstDate orgDate, bet.IsMatched, bet.MarketId,
                                                                                                                                                                        bet.SelectionId, bet.MatchId, bet.MstCode ,bet.P_L , bet.UserId,bet.IP_ADDESSS ip
                                                                                                                                                                 FROM tblbets bet
                                                                                                                                                                        INNER JOIN createmaster crlgn ON bet.UserId = crlgn.mstrid
                                                                                                                                                                        LEFT JOIN createmaster crPid ON bet.ParantId =
                                                                                                                                                                                                        crPid.mstrid
                                                                                                                                                                        LEFT JOIN createmaster crMid ON crPid.parentId = crMid.mstrid
                                                                                                                                                                 WHERE bet.MarketId = pMarketID UNION
                                                                                                                                                                 SELECT crMid.mstruserid AS  MasterName ,crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,
                                                                                                                                                                        a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2) and OddValue = 0 then 0 else 1 end isBack,  DATE_FORMAT(a.dateTime,"%d-%b-%Y %H:%i:%S") MstDate,a.dateTime orgDate,1 IsMatched ,
                                                                                                                                                                        a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId,a.IP_ADDRESS ip
                                                                                                                                                                 FROM bet_entry a
                                                                                                                                                                        inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                        INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                        LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                        LEFT JOIN createmaster crMid ON crPid.parentId = crMid.mstrid
                                                                                                                                                                 WHERE a.matchID =pMatchId) a  ORDER BY orgDate DESC ;
    END IF;
    END IF;
    END IF;
    END IF;
  END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS `GetBetHistoryFilterPaging`;
DELIMITER $$
CREATE  PROCEDURE `GetBetHistoryFilterPaging`(IN `pUserID` INT, IN `pFromDate` DATETIME, IN `pToDate` DATETIME, IN `qoffset` INT, IN `qlimit` INT)
  BEGIN
    DECLARE pType INTEGER ;
    DECLARE pDateConditions varchar(255) default '';
    DECLARE finalQuery varchar(60000) default '';

    if pToDate != '0000-00-00' AND pFromDate != '0000-00-00' THEN
      SET pDateConditions = CONCAT(" where aa.orgDate >= '",pFromDate,"' AND aa.orgDate <= '",pToDate,"'");
    else
      SET pDateConditions =  '';
    end if;

    set @num:=0;
    set pType = (select usetype from createmaster where mstrid = pUserID);
    IF pType = 3 THEN

      SET @finalQuery = CONCAT(
          "SELECT *,(@num:=@num+1) SrNo FROM (SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblbets a
             left join createmaster b on a.UserID = b.mstrid
             left join createmaster c on a.ParantID = c.mstrid
             LEFT JOIN matchmst d ON a.MatchId = d.MstCode
             LEFT JOIN sportmst e ON d.SportId = e.ID
             LEFT JOIN market f ON a.MarketId =f.ID
             WHERE a.UserId = ", pUserID ,"
    Union
     SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate ,a.MstDate orgDate, a.P_L,a.Stack  Profit,0 Liability,'Match Abandoned' STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblabandonedbets a
    left join createmaster b on a.UserID = b.mstrid
    left join createmaster c on a.ParantID = c.mstrid
    LEFT JOIN matchmst d ON a.MatchId = d.MstCode
    LEFT JOIN sportmst e ON d.SportId = e.ID
    LEFT JOIN market f ON a.MarketId =f.ID
    WHERE a.UserId =", pUserID ,"
    Union
    SELECT a.OddValue mstcode, CONCAT('>>',d.MatchName,'>>',a.FheadName,'') Description, '' selectionName
    , CASE WHEN a.OddValue = 0 THEN 'Back' ELSE 'Lay' END Type,OddsNumber Odds, bet_value Stack, DATE_FORMAT(a.dateTime,'%d-%b-%Y %H:%i:%S') MstDate,a.dateTime orgDate, '' P_L, CASE WHEN IFNULL(a.Chips, 0) > 0 THEN Chips ELSE  0 END Profit, CASE WHEN IFNULL(a.Chips, 0) < 0 THEN Chips ELSE  0 END Liability,
CASE WHEN  a.ResultID IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM bet_entry a
left join createmaster b on a.UserID = b.mstrid
  left join createmaster c on a.ParantID = c.mstrid
left JOIN matchfancy m ON a.fancyID =m.ID
    LEFT JOIN matchmst d ON a.matchId = d.MstCode
    LEFT JOIN sportmst e ON a.sportId = e.ID
    where userId = ", pUserId , " )aa " , pDateConditions  ,"  ORDER BY aa.orgDate DESC, aa.mstcode DESC  LIMIT ", qoffset , " , " , qlimit );

    ELSEIF pType = 2 THEN

      SET @finalQuery = CONCAT(
          "SELECT *,(@num:=@num+1) SrNo FROM (SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblbets a
            left join createmaster b on a.UserID = b.mstrid
            left join createmaster c on a.ParantID = c.mstrid
            LEFT JOIN matchmst d ON a.MatchId = d.MstCode
            LEFT JOIN sportmst e ON d.SportId = e.ID
            LEFT JOIN market f ON a.MarketId =f.ID
            WHERE a.ParantId =", pUserID ,"
    Union
    SELECT a.bet_id mstcode, CONCAT('>>',d.MatchName,'>>',a.FheadName,'') Description, '' selectionName
, CASE WHEN a.OddValue = 0 THEN 'Back' ELSE 'Lay' END Type,
OddsNumber Odds, bet_value Stack, DATE_FORMAT(a.dateTime,'%d-%b-%Y %H:%i:%S') MstDate,a.dateTime orgDate, '' P_L, CASE WHEN IFNULL(a.Chips, 0) > 0 THEN Chips ELSE  0 END Profit, CASE WHEN IFNULL(a.Chips, 0) < 0 THEN Chips ELSE  0 END Liability,
CASE WHEN  a.ResultID IS NULL THEN 'Open' ELSE 'Settled' END STATUS , b.mstruserid UserNm,c.mstruserid DealerNm FROM bet_entry a
  left join createmaster b on a.UserID = b.mstrid
  left join createmaster c on a.ParantID = c.mstrid
left JOIN matchfancy m ON a.fancyID =m.ID
    LEFT JOIN matchmst d ON a.matchId = d.MstCode
    LEFT JOIN sportmst e ON a.sportId = e.ID
    where ParantId = ",pUserID,"
    )aa ", pDateConditions , " ORDER BY aa.orgDate DESC, aa.mstcode DESC LIMIT ", qoffset , " , " , qlimit );

    ELSEIF pType = 1 THEN

      SET @finalQuery = CONCAT(
          "SELECT *,(@num:=@num+1) SrNo FROM (SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm ,c.mstruserid DealerNm   FROM tblbets a
            left join createmaster b on a.UserID = b.mstrid
            left join createmaster c on a.ParantID = c.mstrid
            LEFT JOIN matchmst d ON a.MatchId = d.MstCode
            LEFT JOIN sportmst e ON d.SportId = e.ID
            LEFT JOIN market f ON a.MarketId =f.ID
            WHERE a.ParantId IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID =", pUserID ,")
    Union
    SELECT a.bet_id mstcode, CONCAT(e.Name ,'>', d.MatchName,'>', a.FheadName ,'>', IFNULL(m.result,'')) Description, '' selectionName
, CASE WHEN a.OddValue = 0 THEN 'Back' ELSE 'Lay' END Type,
OddsNumber Odds, bet_value Stack, DATE_FORMAT(a.dateTime,'%d-%b-%Y %H:%i:%S') MstDate,a.dateTime orgDate, '' P_L, CASE WHEN IFNULL(a.Chips, 0) > 0 THEN Chips ELSE  0 END Profit, CASE WHEN IFNULL(a.Chips, 0) < 0 THEN Chips ELSE  0 END Liability,
CASE WHEN  a.ResultID IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm ,c.mstruserid DealerNm   FROM bet_entry a
 left join createmaster b on a.UserID = b.mstrid
left join createmaster c on a.ParantID = c.mstrid
left JOIN matchfancy m ON a.fancyID =m.ID
    LEFT JOIN matchmst d ON a.matchId = d.MstCode
    LEFT JOIN sportmst e ON a.sportId = e.ID
    where ParantId IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID =", pUserID ,")
    )aa ", pDateConditions , " ORDER BY aa.orgDate DESC, aa.mstcode DESC LIMIT ", qoffset , " , " , qlimit );
    ELSEIF pType = 0 THEN

      SET @finalQuery = CONCAT(
          "SELECT *,(@num:=@num+1) SrNo FROM (SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm ,c.mstruserid DealerNm  FROM tblbets a
          left join createmaster b on a.UserID = b.mstrid
          left join createmaster c on a.ParantID = c.mstrid
          LEFT JOIN matchmst d ON a.MatchId = d.MstCode
          LEFT JOIN sportmst e ON d.SportId = e.ID
          LEFT JOIN market f ON a.MarketId =f.ID
          Union
          SELECT a.bet_id mstcode,CONCAT('>>',d.MatchName,'>>',a.FheadName,'') Description, '' selectionName
      , CASE WHEN a.OddValue = 0 THEN 'Back' ELSE 'Lay' END Type,
      OddsNumber Odds, bet_value Stack, DATE_FORMAT(a.dateTime,'%d-%b-%Y %H:%i:%S') MstDate,a.dateTime orgDate, '' P_L, CASE WHEN IFNULL(a.Chips, 0) > 0 THEN Chips ELSE  0 END Profit, CASE WHEN IFNULL(a.Chips, 0) < 0 THEN Chips ELSE  0 END Liability,
      CASE WHEN  a.ResultID IS NULL THEN 'Open' ELSE 'Settled' END STATUS , b.mstruserid UserNm ,c.mstruserid DealerNm  FROM bet_entry a
      left join createmaster b on a.UserID = b.mstrid
      left join createmaster c on a.ParantID = c.mstrid
      left JOIN matchfancy m ON a.fancyID =m.ID
          LEFT JOIN matchmst d ON a.matchId = d.MstCode
          LEFT JOIN sportmst e ON a.sportId = e.ID
          )aa ", pDateConditions , " ORDER BY aa.orgDate DESC, aa.mstcode DESC LIMIT ", qoffset , " , " , qlimit );

    END IF;



    PREPARE stmt FROM @finalQuery;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;


  END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `GetBetHistoryFilterPagingCount`;
DELIMITER $$
CREATE  PROCEDURE `GetBetHistoryFilterPagingCount`(IN `pUserID` INT, IN `pFromDate` DATETIME, IN `pToDate` DATETIME)
  BEGIN
    DECLARE pType INTEGER ;
    DECLARE pDateConditions varchar(255) default '';
    DECLARE finalQuery varchar(60000) default '';

    if pToDate != '0000-00-00' AND pFromDate != '0000-00-00' THEN
      SET pDateConditions = CONCAT(" where aa.orgDate >= '",pFromDate,"' AND aa.orgDate <= '",pToDate,"'");
    else
      SET pDateConditions =  '';
    end if;

    set @num:=0;
    set pType = (select usetype from createmaster where mstrid = pUserID);
    IF pType = 3 THEN

      SET @finalQuery = CONCAT(
          "SELECT count(*) cnt,(@num:=@num+1) SrNo,ROUND(SUM(P_L),2) tot_p_l,ROUND(SUM(Profit),2) tot_profit,ROUND(SUM(Liability),2) tot_liability FROM (SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblbets a
             left join createmaster b on a.UserID = b.mstrid
             left join createmaster c on a.ParantID = c.mstrid
             LEFT JOIN matchmst d ON a.MatchId = d.MstCode
             LEFT JOIN sportmst e ON d.SportId = e.ID
             LEFT JOIN market f ON a.MarketId =f.ID
             WHERE a.UserId = ", pUserID ,"
    Union
     SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L,a.Stack  Profit,0 Liability,'Match Abandoned' STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblabandonedbets a
    left join createmaster b on a.UserID = b.mstrid
    left join createmaster c on a.ParantID = c.mstrid
    LEFT JOIN matchmst d ON a.MatchId = d.MstCode
    LEFT JOIN sportmst e ON d.SportId = e.ID
    LEFT JOIN market f ON a.MarketId =f.ID
    WHERE a.UserId =", pUserID ,"
    Union
    SELECT a.OddValue mstcode, CONCAT('>>',d.MatchName,'>>',a.FheadName,'') Description, '' selectionName
    , CASE WHEN a.OddValue = 0 THEN 'Back' ELSE 'Lay' END Type,OddsNumber Odds, bet_value Stack, DATE_FORMAT(a.dateTime,'%d-%b-%Y %H:%i:%S') MstDate,a.dateTime orgDate, '' P_L, CASE WHEN IFNULL(a.Chips, 0) > 0 THEN Chips ELSE  0 END Profit, CASE WHEN IFNULL(a.Chips, 0) < 0 THEN Chips ELSE  0 END Liability,
CASE WHEN  a.ResultID IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM bet_entry a
left join createmaster b on a.UserID = b.mstrid
  left join createmaster c on a.ParantID = c.mstrid
left JOIN matchfancy m ON a.fancyID =m.ID
    LEFT JOIN matchmst d ON a.matchId = d.MstCode
    LEFT JOIN sportmst e ON a.sportId = e.ID
    where userId = ", pUserId , " )aa " , pDateConditions  ,"  ORDER BY aa.orgDate DESC, aa.mstcode DESC ");

    ELSEIF pType = 2 THEN

      SET @finalQuery = CONCAT(
          "SELECT count(*) cnt,(@num:=@num+1) SrNo,ROUND(SUM(P_L),2) tot_p_l,ROUND(SUM(Profit),2) tot_profit,ROUND(SUM(Liability),2) tot_liability FROM (SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblbets a
            left join createmaster b on a.UserID = b.mstrid
            left join createmaster c on a.ParantID = c.mstrid
            LEFT JOIN matchmst d ON a.MatchId = d.MstCode
            LEFT JOIN sportmst e ON d.SportId = e.ID
            LEFT JOIN market f ON a.MarketId =f.ID
            WHERE a.ParantId =", pUserID ,"
    Union
    SELECT a.bet_id mstcode, CONCAT('>>',d.MatchName,'>>',a.FheadName,'') Description, '' selectionName
, CASE WHEN a.OddValue = 0 THEN 'Back' ELSE 'Lay' END Type,
OddsNumber Odds, bet_value Stack, DATE_FORMAT(a.dateTime,'%d-%b-%Y %H:%i:%S') MstDate,a.dateTime orgDate, '' P_L, CASE WHEN IFNULL(a.Chips, 0) > 0 THEN Chips ELSE  0 END Profit, CASE WHEN IFNULL(a.Chips, 0) < 0 THEN Chips ELSE  0 END Liability,
CASE WHEN  a.ResultID IS NULL THEN 'Open' ELSE 'Settled' END STATUS , b.mstruserid UserNm,c.mstruserid DealerNm FROM bet_entry a
  left join createmaster b on a.UserID = b.mstrid
  left join createmaster c on a.ParantID = c.mstrid
left JOIN matchfancy m ON a.fancyID =m.ID
    LEFT JOIN matchmst d ON a.matchId = d.MstCode
    LEFT JOIN sportmst e ON a.sportId = e.ID
    where ParantId = ",pUserID,"
    )aa ", pDateConditions , " ORDER BY aa.orgDate DESC, aa.mstcode DESC ");

    ELSEIF pType = 1 THEN

      SET @finalQuery = CONCAT(
          "SELECT count(*) cnt,(@num:=@num+1) SrNo,ROUND(SUM(P_L),2) tot_p_l,ROUND(SUM(Profit),2) tot_profit,ROUND(SUM(Liability),2) tot_liability FROM (SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm ,c.mstruserid DealerNm   FROM tblbets a
            left join createmaster b on a.UserID = b.mstrid
            left join createmaster c on a.ParantID = c.mstrid
            LEFT JOIN matchmst d ON a.MatchId = d.MstCode
            LEFT JOIN sportmst e ON d.SportId = e.ID
            LEFT JOIN market f ON a.MarketId =f.ID
            WHERE a.ParantId IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID =", pUserID ,")
    Union
    SELECT a.bet_id mstcode, CONCAT(e.Name ,'>', d.MatchName,'>', a.FheadName ,'>', IFNULL(m.result,'')) Description, '' selectionName
, CASE WHEN a.OddValue = 0 THEN 'Back' ELSE 'Lay' END Type,
OddsNumber Odds, bet_value Stack, DATE_FORMAT(a.dateTime,'%d-%b-%Y %H:%i:%S') MstDate,a.dateTime orgDate, '' P_L, CASE WHEN IFNULL(a.Chips, 0) > 0 THEN Chips ELSE  0 END Profit, CASE WHEN IFNULL(a.Chips, 0) < 0 THEN Chips ELSE  0 END Liability,
CASE WHEN  a.ResultID IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm ,c.mstruserid DealerNm   FROM bet_entry a
 left join createmaster b on a.UserID = b.mstrid
left join createmaster c on a.ParantID = c.mstrid
left JOIN matchfancy m ON a.fancyID =m.ID
    LEFT JOIN matchmst d ON a.matchId = d.MstCode
    LEFT JOIN sportmst e ON a.sportId = e.ID
    where ParantId IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID =", pUserID ,")
    )aa ", pDateConditions , " ORDER BY aa.orgDate DESC, aa.mstcode DESC ");
    ELSEIF pType = 0 THEN

      SET @finalQuery = CONCAT(
          "SELECT count(*) cnt,(@num:=@num+1) SrNo,ROUND(SUM(P_L),2) tot_p_l,ROUND(SUM(Profit),2) tot_profit,ROUND(SUM(Liability),2) tot_liability FROM (SELECT a.mstcode, CONCAT(e.Name ,'>', d.MatchName ,'>', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm ,c.mstruserid DealerNm  FROM tblbets a
          left join createmaster b on a.UserID = b.mstrid
          left join createmaster c on a.ParantID = c.mstrid
          LEFT JOIN matchmst d ON a.MatchId = d.MstCode
          LEFT JOIN sportmst e ON d.SportId = e.ID
          LEFT JOIN market f ON a.MarketId =f.ID
          Union
          SELECT a.bet_id mstcode,CONCAT('>>',d.MatchName,'>>',a.FheadName,'') Description, '' selectionName
      , CASE WHEN a.OddValue = 0 THEN 'Back' ELSE 'Lay' END Type,
      OddsNumber Odds, bet_value Stack, DATE_FORMAT(a.dateTime,'%d-%b-%Y %H:%i:%S') MstDate,a.dateTime orgDate, '' P_L, CASE WHEN IFNULL(a.Chips, 0) > 0 THEN Chips ELSE  0 END Profit, CASE WHEN IFNULL(a.Chips, 0) < 0 THEN Chips ELSE  0 END Liability,
      CASE WHEN  a.ResultID IS NULL THEN 'Open' ELSE 'Settled' END STATUS , b.mstruserid UserNm ,c.mstruserid DealerNm  FROM bet_entry a
      left join createmaster b on a.UserID = b.mstrid
      left join createmaster c on a.ParantID = c.mstrid
      left JOIN matchfancy m ON a.fancyID =m.ID
          LEFT JOIN matchmst d ON a.matchId = d.MstCode
          LEFT JOIN sportmst e ON a.sportId = e.ID
          )aa ", pDateConditions , " ORDER BY aa.orgDate DESC, aa.mstcode DESC ");

    END IF;



    PREPARE stmt FROM @finalQuery;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;


  END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `SP_GetFancyBetting`;
DELIMITER $$
CREATE  PROCEDURE `SP_GetFancyBetting`(IN `pUserID` INT, IN `pTypeID` INT, IN `pMarketID` VARCHAR(100), IN `pMatchId` INT, IN `pFancyId` INT)
  BEGIN
    DECLARE  LID INTEGER ;
    set @num:=0;
    IF pTypeID = 3 THEN

      IF pMarketID = 0 THEN
        SELECT  * ,(@num:=@num+1) SrNo  FROM (
                                             SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  a.dateTime MstDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,(CASE WHEN a.OddValue = 0 THEN (a.bet_value * (m.YesValume/100)) WHEN a.OddValue = 1 THEN (a.bet_value * (m.NoValume/100)) ELSE 0 END) P_L,a.userid UserId
                                             FROM bet_entry a
                                                    inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                    INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                    LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                             WHERE a.UserId = pUserID AND a.matchID =pMatchId  )a  ORDER BY MstDate DESC ;

      ELSE

        SELECT  * ,(@num:=@num+1) SrNo  FROM (
                                             SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  a.dateTime MstDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId
                                             FROM bet_entry a
                                                    inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                    INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                    LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                             WHERE a.UserId = pUserID AND a.matchID =pMatchId  )a  ORDER BY MstDate DESC ;

      END IF;

    ELSE IF pTypeID = 2 THEN
      SELECT * ,(@num:=@num+1) SrNo,(select COUNT(distinct UserId ) AUser FROM (SELECT a.userid UserId FROM bet_entry a WHERE a.ParantID = pUserID AND a.matchID =pMatchId  )a) AUser FROM (
                                                                                                                                                                                           SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName, case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2) and OddValue = 0 then 0 else 1 end isBack,  a.dateTime MstDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId
                                                                                                                                                                                           FROM bet_entry a
                                                                                                                                                                                                  inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                                                  INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                                                  LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                                           WHERE a.fancyId = pFancyId AND a.ParantID = pUserID AND a.matchID =pMatchId  )a  ORDER BY MstDate DESC ;
    ELSE IF pTypeID = 1 THEN
      SELECT *,(@num:=@num+1) SrNo ,(select COUNT(distinct UserId ) AUser from (
                                                                               SELECT a.userid UserId FROM bet_entry a
                                                                               WHERE a.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID)  AND a.matchID =pMatchId ) D)AUser FROM (
                                                                                                                                                                                                                       SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName,  case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds  ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  a.dateTime MstDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId
                                                                                                                                                                                                                       FROM bet_entry a
                                                                                                                                                                                                                              inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                                                                                                              INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                                                                                                              LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                                                                                                                       WHERE a.fancyId = pFancyId AND a.ParantID IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID = pUserID)  AND a.matchID =pMatchId  ) a  ORDER BY MstDate DESC ;
    ELSE IF pTypeID = 0 THEN
      SELECT *,(@num:=@num+1) SrNo ,(select COUNT(distinct UserId ) AUser from (
                                                                               SELECT a.userid UserId FROM bet_entry a
                                                                               WHERE  a.matchID =pMatchId ) D)AUser FROM (
                                                                                                                         SELECT crlgn.mstruserid AS userName, crPid.mstruserid AS ParantName,  case when SessInpYes = SessInpNo  and a.TypeID =2 then CONCAT(a.FHeadName , ' (', 100-ponitDiff ,'-' ,100+ponitDiff ,')' ) else a.FHeadName end  selectionName,a.OddsNumber Odds  ,a.bet_value Stack,case when (a.TypeID =5 or a.TypeID =2)  and OddValue = 0 then 0 else 1 end isBack,  a.dateTime MstDate,1 IsMatched ,a.TypeID MarketId ,fncy_refId SelectionId , a.matchID MatchId, bet_id MstCode,a.bet_value P_L,a.userid UserId
                                                                                                                         FROM bet_entry a
                                                                                                                                inner join matchfancy m on a.Fancyid = m.ID and m.active <> 2
                                                                                                                                INNER JOIN createmaster crlgn ON a.UserId = crlgn.mstrid
                                                                                                                                LEFT JOIN createmaster crPid ON a.ParantId = crPid.mstrid
                                                                                                                         WHERE a.fancyId = pFancyId   AND a.matchID =pMatchId  ) a  ORDER BY MstDate DESC ;
    END IF;
    END IF;
    END IF;
    END IF;
  END$$
DELIMITER ;