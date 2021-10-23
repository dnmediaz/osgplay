-- balance updated by liablity
-- Chipscntrl/getChipDataById

-- betfair session work
-- Apiadmincontroller/betfair_session
-- Apiadmincontroller/save_betfair_market
-- Modelmatchmst/findByMatchId





-- add exch session 2000  2200 loss issue
DROP PROCEDURE IF EXISTS `SP_SetResult_Session`;
DELIMITER //
CREATE PROCEDURE `SP_SetResult_Session`(
	IN `pSportsID` INT,
	IN `pMatchID` INT,
	IN `pFancyID` INT,
	IN `pResult` VARCHAR(100)

)
BEGIN
DECLARE  LID INTEGER ;
DECLARE iReturn INT;
DECLARE sMsg VARCHAR(500);
DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
     SET iReturn = 0;
 GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
    SET sMsg = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);  
  ROLLBACK;
SELECT iReturn ,sMsg;
END;
DECLARE EXIT HANDLER FOR SQLWARNING
 BEGIN
    SET iReturn = 0;
GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
    SET sMsg = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
 ROLLBACK;
SELECT iReturn ,sMsg;
END;
MainLabel:BEGIN
IF (SELECT result FROM tblresult WHERE sportId = pSportsID AND matchId = pMatchID AND selectionId = pFancyID ) IS NOT NULL THEN
    LEAVE MainLabel;
END IF; 
SET iReturn = 1;
SET sMsg = "Saved Successfully ...";
START TRANSACTION;
INSERT INTO tblresult (sportId, matchId, DATE, isFancy, selectionId, result) VALUES (pSportsID, pMatchID, NOW(), 1, pFancyID, pResult);
SET LID = LAST_INSERT_ID();
UPDATE matchfancy SET result = pResult, active = 2, DisplayMsg = 'Close Fancy ' WHERE MatchID =pMatchID AND ID =pFancyID; 

-- win
UPDATE bet_entry SET ResultID = LID, Chips = (CASE WHEN OddValue = 0 THEN (bet_value * (session_yes_size/100)) WHEN OddValue = 1 THEN bet_value ELSE 0 END)
WHERE MatchID =pMatchID AND FancyID =pFancyID AND TypeID = 2 AND (OddValue =1 AND oddsNumber > pResult) OR (OddValue =0 AND oddsNumber <= pResult); 
  
-- Loss  
UPDATE bet_entry SET ResultID =LID, Chips = -IFNULL((CASE WHEN OddValue = 0 THEN bet_value WHEN OddValue = 1 THEN (bet_value * (session_no_size/100)) ELSE 0 END),0) WHERE MatchID =pMatchID AND FancyID =pFancyID  AND TypeID = 2 AND (( OddValue =1 AND oddsNumber <= pResult) OR( OddValue =0 AND oddsNumber > pResult)); 

/*
UPDATE bet_entry dest, (
SELECT NoValume,YesValume
FROM matchfancy
WHERE ID = pFancyID) src SET dest.ResultID = LID, Chips = (CASE WHEN dest.OddValue = 0 THEN (dest.bet_value * (src.YesValume/100)) WHEN dest.OddValue = 1 THEN (dest.bet_value * (src.NoValume/100)) ELSE 0 END)
WHERE dest.MatchID =pMatchID AND dest.FancyID =pFancyID AND dest.SessInpYes <> dest.SessInpNo AND dest.TypeID = 2 AND ((dest.OddValue =1 AND dest.oddsNumber > pResult) OR (dest.OddValue =0 AND dest.oddsNumber <= pResult)); 
  
UPDATE bet_entry SET ResultID =LID, Chips = -IFNULL(bet_value,0) WHERE MatchID =pMatchID AND FancyID =pFancyID AND SessInpYes <> SessInpNo AND TypeID = 2 AND (( OddValue =1 AND oddsNumber <= pResult) OR( OddValue =0 AND oddsNumber > pResult)); 
  
 
 

UPDATE bet_entry dest, (
SELECT NoValume,YesValume
FROM matchfancy
WHERE ID = pFancyID) src SET dest.ResultID = LID, Chips = (CASE WHEN dest.OddValue = 0 THEN (dest.bet_value * (src.YesValume/100)) WHEN dest.OddValue = 1 THEN (dest.bet_value * (src.NoValume/100)) ELSE 0 END)
WHERE dest.MatchID =pMatchID AND dest.FancyID =pFancyID AND dest.SessInpYes = dest.SessInpNo AND dest.TypeID = 2 AND ((dest.OddValue =1 AND dest.oddsNumber > pResult));   

  

UPDATE bet_entry dest, (
SELECT NoValume,YesValume
FROM matchfancy
WHERE ID = pFancyID) src SET dest.ResultID = LID, Chips = (CASE WHEN dest.OddValue = 0 THEN (dest.bet_value * (src.YesValume/100)) WHEN dest.OddValue = 1 THEN (dest.bet_value * (src.NoValume/100)) ELSE 0 END)
WHERE dest.MatchID =pMatchID AND dest.FancyID =pFancyID AND dest.SessInpYes = SessInpNo AND dest.TypeID = 2 AND ((dest.OddValue =0 AND dest.oddsNumber <= pResult));
 
    

UPDATE bet_entry SET ResultID =LID, Chips = -IFNULL(bet_value,0) WHERE MatchID =pMatchID AND FancyID =pFancyID AND SessInpYes = SessInpNo AND TypeID = 2 AND (( OddValue =1 AND oddsNumber <= pResult) );   

UPDATE bet_entry SET ResultID =LID, Chips = -IFNULL(bet_value,0) WHERE MatchID =pMatchID AND FancyID =pFancyID AND SessInpYes = SessInpNo AND TypeID = 2 AND (( OddValue =0 AND oddsNumber > pResult));    */
 
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr,  ChipsDr, ResultID ,BetID,Narration,RefID ,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm ) 
SELECT NOW(), userId, 0, 1, CASE WHEN pnl > 0 THEN IFNULL(ROUND(pnl, 2),0) ELSE 0 END, CASE WHEN pnl < 0 THEN IFNULL(ROUND(ABS(pnl), 2) ,0) ELSE 0 END, LID, 0, CONCAT('PnL from Session Fancy ',pResult ) , FheadName ,8, pMatchID, pFancyID, 0, MASTER, dealer, admin, parantid, 0, parantId, 'Parent' FROM (SELECT UserID, MASTER, dealer, admin, parantid, FheadName ,SUM(Chips) pnl FROM bet_entry 
WHERE MatchID =pMatchID AND FancyID = pFancyID  GROUP BY  UserID ,FheadName ,MASTER, dealer, admin, parantid) j; 
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration, RefID, MstType, MatchId, FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm )

SELECT NOW(), userId, 1, 1,  IFNULL(ROUND((betvl*SessionComm)/100, 2),0) Comm, 0, LID, 0, CONCAT('Commission [ Session : ', pResult , ' ]' ), FheadName , 9, pMatchID, pFancyID, 0, MASTER, dealer, admin, parantid, 0, parantId, 'Parent Session Comm.' FROM (SELECT UserID, MASTER, dealer, admin, parantid, FheadName ,SUM(bet_value) betvl,SessionComm FROM bet_entry INNER JOIN createmaster b ON UserID = b.MstrId WHERE MatchID =pMatchID AND FancyID = pFancyID  GROUP BY  UserID ,FheadName ,MASTER, dealer, admin, parantid,SessionComm) j; 

INSERT INTO tblchipdet (MstDate, UserID, LoginID, CrDr, ChipsCr, ChipsDr, ResultID, BetID, Narration, RefID, MstType, MatchId, FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm)
SELECT MstDate , b.mstrid ,1 ,1, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) < 0 THEN IFNULL(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) ELSE 0 END, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) > 0 THEN IFNULL(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) ELSE 0 END, LID, BetID ,CONCAT(RefID ,   ' From  ', c.MstrUserId , ' ]') ,RefID ,8 ,pMatchID ,pFancyId, UserID, 0, 0, 0, b.parentId, 1, userId, 'Client Session A/c' FROM tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId 
INNER JOIN createmaster c ON a.userid = c.MstrId 
WHERE MatchId =pMatchID AND FancyID =pFancyID  AND levelV = 0 AND msttype = 8 GROUP BY MstDate , b.mstrid ,LID,BetID, c.MstrUserId, UserID, b.parentId;
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID ,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm  )
SELECT MstDate ,b.mstrid ,1 ,1, 0, IFNULL(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) , LID, BetID ,CONCAT(RefID  , '[ Comm. To ', c.MstrUserId , ' ]') ,RefID , 9, pMatchID ,pFancyID, UserID, 0, 0, 0, b.parentId, 1, userId, 'Client Session Comm.' FROM    tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId 
INNER JOIN createmaster c ON a.UserID = c.MstrId 
WHERE MatchId =pMatchID AND FancyId =pFancyID  AND levelV = 0 AND msttype = 9 GROUP BY MstDate ,b.mstrid ,LID,BetID, c.MstrUserId, UserID, b.parentId HAVING SUM(a.ChipsCr-a.ChipsDr) > 0;
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm )
SELECT mstdate, b.mstrid , 1, 1, ROUND(ROUND(SUM((a.ChipsCr-a.ChipsDr) * (pMaster+pAdmin) / 100), 4), 2) Comm , 0, LID , BetID,CONCAT(RefID  ,' Session Comm. Dealer From Master [ Session : ', pResult , ' ]' ) , RefID ,9, pMatchID ,pFancyID, 0, 0, 0, 0, b.parentId, 1 , b.parentId, 'Parent Commission' FROM  tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId
WHERE  a.MatchId =pMatchID AND a.FancyId =pFancyID AND levelV = 0 AND msttype = 9  GROUP BY MstDate ,b.mstrid ,LID,BetID, b.MstrUserId, b.parentId HAVING SUM(a.ChipsCr-a.ChipsDr) > 0;
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm )
SELECT mstdate, b.mstrid , 1, 1, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) > 0 THEN IFNULL(ROUND(ABS(SUM((a.ChipsCr-a.ChipsDr) * (pMaster+pAdmin) / 100)), 2),0)  ELSE 0 END, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) < 0 THEN IFNULL(ROUND(ABS(SUM((a.ChipsCr-a.ChipsDr) * (pMaster+pAdmin) / 100)) , 2),0)  ELSE 0 END Comm ,ResultID , BetID,CONCAT(RefID  ,' Partnership Dealer To Master [ Session : ', pResult , ' ]' ) , RefID , 8, pMatchID ,pFancyID, 0, 0, 0, 0, b.parentId, 1, b.parentId, 'Parent A/c' FROM  tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId 
WHERE  a.MatchId =pMatchID AND a.FancyId =pFancyID AND levelV = 0 AND msttype = 8  GROUP BY MstDate ,b.mstrid ,LID, BetID, b.MstrUserId, b.parentId ;


INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID ,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV , oppAcID, oppAcNm )
SELECT MstDate, b.mstrid, 1, 1, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) < 0 THEN IFNULL(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) ELSE 0 END, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) > 0 THEN IFNULL(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) ELSE 0 END, LID, BetID ,CONCAT(RefID, ' From  ', c.MstrUserId , ' ]') ,'' , 8 ,pMatchID ,pFancyID, UserID, 0, 0, 0, b.parentId, 2, userId, 'Dealer A/c' FROM tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId 
INNER JOIN createmaster c ON a.userid = c.MstrId 
WHERE MatchId =pMatchID AND FancyId =pFancyID  AND levelV = 1 AND msttype = 8 AND ChildID = 0 GROUP BY MstDate , b.mstrid ,LID,BetID, c.MstrUserId, UserID, b.parentId;
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID ,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV , oppAcID, oppAcNm  )
SELECT MstDate ,b.mstrid ,1 ,1, 0,  IFNULL(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) , LID, BetID ,CONCAT(RefID  ,   '[ Comm. To  ', c.MstrUserId , ' ]') ,'' , 9, pMatchID ,pFancyID, UserID, 0, 0, 0, b.parentId, 2, userId, 'Dealer Commission' FROM    tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId 
INNER JOIN createmaster c ON a.UserID = c.MstrId 
WHERE MatchId =pMatchID AND FancyId =pFancyID  AND levelV = 1 AND msttype = 9 AND ChildID = 0 GROUP BY MstDate ,b.mstrid ,LID,BetID, c.MstrUserId, UserID, b.parentId HAVING SUM(a.ChipsCr-a.ChipsDr) > 0;
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm )
SELECT mstdate, c.mstrid , 1, 1, IFNULL(ROUND(ROUND(SUM((a.ChipsCr-a.ChipsDr) * (pAdmin) / 100), 4), 2),0) Comm , 0, LID , BetID,CONCAT(RefID  ,' Comm. Master From Admin [ Session : ', pResult , ' ]' ) , RefID ,9, pMatchID ,pFancyID, 0, 0, 0, 0, c.parentId, 2, c.parentId, 'Parent Commission' FROM  tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId  
INNER JOIN createmaster c ON b.parentid = c.MstrId 
WHERE  a.MatchId =pMatchID AND a.FancyId =pFancyID AND levelV = 0 AND msttype = 9  GROUP BY MstDate ,c.mstrid ,LID,BetID, c.MstrUserId, c.parentId HAVING SUM(a.ChipsCr-a.ChipsDr) > 0;
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm )
SELECT mstdate, c.mstrid , 1, 1, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) > 0 THEN IFNULL(ROUND(ABS(SUM((a.ChipsCr-a.ChipsDr) * (pAdmin) / 100)), 2),0)  ELSE 0 END, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) < 0 THEN IFNULL(ROUND(ABS(SUM((a.ChipsCr-a.ChipsDr) * (pAdmin) / 100)) , 2),0)  ELSE 0 END Comm ,LID , BetID,CONCAT(RefID  ,' Partnership Master To Admin [ Session : ', pResult , ' ]' ) , RefID , 8, pMatchID ,pFancyID, 0, 0, 0, 0, c.parentId, 2, c.parentId, 'Parent A/c' FROM  tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId  
INNER JOIN createmaster c ON b.parentid = c.MstrId 
WHERE  a.MatchId =pMatchID AND a.FancyId =pFancyID AND levelV = 0 AND msttype = 8  GROUP BY MstDate ,c.mstrid ,LID, BetID, c.MstrUserId, c.parentId ;


INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID ,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV, oppAcID, oppAcNm  )
SELECT MstDate, b.mstrid, 1, 1, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) < 0 THEN ifnull(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) ELSE 0 END, CASE WHEN SUM(a.ChipsCr-a.ChipsDr) > 0 THEN IFNULL(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) ELSE 0 END, LID, BetID ,CONCAT(RefID  , ' From  ', c.MstrUserId , ' ]') ,RefID , 8 ,pMatchID ,pFancyID, UserID, 0, 0, 0, b.parentId, 3, userId, 'Master A/c' FROM tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId 
INNER JOIN createmaster c ON a.userid = c.MstrId 
WHERE MatchId =pMatchID AND FancyId =pFancyID  AND levelV = 2 AND msttype = 8 AND ChildID = 0 GROUP BY MstDate , b.mstrid ,LID,BetID, c.MstrUserId, UserID, b.parentId;
INSERT INTO tblchipdet (MstDate , UserID ,LoginID , CrDr, ChipsCr, ChipsDr, ResultID ,BetID,Narration,RefID ,MstType ,MatchId,FancyId, ChildID, pMaster, pDealer, pAdmin, parantid, LevelV , oppAcID, oppAcNm )
SELECT MstDate ,b.mstrid ,1 ,1,  0, IFNULL(ROUND(ABS(SUM(a.ChipsCr-a.ChipsDr)), 2),0) , LID, BetID ,CONCAT(RefID  ,   '[ Comm. To  ', c.MstrUserId , ' ]') ,RefID , 9, pMatchID ,pFancyID, UserID, 0, 0, 0, b.parentId, 3, userId, 'Master Commission' FROM    tblchipdet a 
INNER JOIN createmaster b ON a.parantid = b.MstrId 
INNER JOIN createmaster c ON a.UserID = c.MstrId 
WHERE MatchId =pMatchID AND FancyId =pFancyID  AND levelV = 2 AND msttype = 9  AND ChildID = 0 GROUP BY MstDate ,b.mstrid ,LID,BetID, c.MstrUserId, UserID, b.parentId HAVING SUM(a.ChipsCr-a.ChipsDr) > 0;
COMMIT;
SELECT iReturn ,sMsg;
END;
END//
DELIMITER ;


DROP PROCEDURE IF EXISTS `GetBetHistoryFilterPaging`;
DELIMITER $$
CREATE PROCEDURE `GetBetHistoryFilterPaging`(IN `pUserID` INT, IN `pFromDate` DATETIME, IN `pToDate` DATETIME, IN `qoffset` INT, IN `qlimit` INT)
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
          "SELECT *,(@num:=@num+1) SrNo FROM (SELECT a.mstcode, CONCAT(e.Name ,' > ', d.MatchName ,' > ', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblbets a
             left join createmaster b on a.UserID = b.mstrid
             left join createmaster c on a.ParantID = c.mstrid
             LEFT JOIN matchmst d ON a.MatchId = d.MstCode
             LEFT JOIN sportmst e ON d.SportId = e.ID
             LEFT JOIN market f ON a.MarketId =f.ID
             WHERE a.UserId = ", pUserID ,"
    Union
     SELECT a.mstcode, CONCAT(e.Name ,' > ', d.MatchName ,' > ', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate ,a.MstDate orgDate, a.P_L,a.Stack  Profit,0 Liability,'Match Abandoned' STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblabandonedbets a
    left join createmaster b on a.UserID = b.mstrid
    left join createmaster c on a.ParantID = c.mstrid
    LEFT JOIN matchmst d ON a.MatchId = d.MstCode
    LEFT JOIN sportmst e ON d.SportId = e.ID
    LEFT JOIN market f ON a.MarketId =f.ID
    WHERE a.UserId =", pUserID ,"
    Union
    SELECT a.OddValue mstcode, CONCAT(' > ',d.MatchName,' > ',a.FheadName,' > ',' (', a.session_no_size ,'-' ,a.session_yes_size ,') ', IFNULL(m.result,'')) Description, (CASE WHEN a.OddValue = 0 THEN 'Yes' ELSE 'No' END) selectionName
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
          "SELECT *,(@num:=@num+1) SrNo FROM (SELECT a.mstcode, CONCAT(e.Name ,' > ', d.MatchName ,' > ', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm,c.mstruserid DealerNm FROM tblbets a
            left join createmaster b on a.UserID = b.mstrid
            left join createmaster c on a.ParantID = c.mstrid
            LEFT JOIN matchmst d ON a.MatchId = d.MstCode
            LEFT JOIN sportmst e ON d.SportId = e.ID
            LEFT JOIN market f ON a.MarketId =f.ID
            WHERE a.ParantId =", pUserID ,"
    Union      
    SELECT a.bet_id mstcode, CONCAT('>',d.MatchName,' > ',a.FheadName,' > ',' (', a.session_no_size ,'-' ,a.session_yes_size ,') ', IFNULL(m.result,'')) Description, (CASE WHEN a.OddValue = 0 THEN 'Yes' ELSE 'No' END) selectionName
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
          "SELECT *,(@num:=@num+1) SrNo FROM (SELECT a.mstcode, CONCAT(e.Name ,' > ', d.MatchName ,' > ', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm ,c.mstruserid DealerNm   FROM tblbets a
            left join createmaster b on a.UserID = b.mstrid
            left join createmaster c on a.ParantID = c.mstrid
            LEFT JOIN matchmst d ON a.MatchId = d.MstCode
            LEFT JOIN sportmst e ON d.SportId = e.ID
            LEFT JOIN market f ON a.MarketId =f.ID
            WHERE a.ParantId IN (SELECT Mstrid  FROM createmaster WHERE usetype = 2 AND parentID =", pUserID ,")
    Union  
    SELECT a.bet_id mstcode, CONCAT(e.Name ,' > ', d.MatchName,' > ', a.FheadName ,' > ',' (', a.session_no_size ,'-' ,a.session_yes_size ,') ', IFNULL(m.result,'')) Description, (CASE WHEN a.OddValue = 0 THEN 'Yes' ELSE 'No' END) selectionName
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
          "SELECT *,(@num:=@num+1) SrNo FROM (SELECT a.mstcode, CONCAT(e.Name ,' > ', d.MatchName ,' > ', f.Name) Description, a.selectionName, CASE WHEN a.isBack = 0 THEN 'Back' ELSE 'Lay' END Type, a.Odds, a.Stack, DATE_FORMAT(a.MstDate,'%d-%b-%Y %H:%i:%S') MstDate,a.MstDate orgDate, a.P_L, CASE WHEN IFNULL(a.result, 0) = 1 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.P_L ELSE  a.Stack END END Profit, CASE WHEN IFNULL(a.result, 0) = 0 THEN CASE WHEN IFNULL(a.isBack, 0) = 0 THEN a.Stack ELSE a.P_L END END Liability, CASE WHEN  a.result IS NULL THEN 'Open' ELSE 'Settled' END STATUS, b.mstruserid UserNm ,c.mstruserid DealerNm  FROM tblbets a
          left join createmaster b on a.UserID = b.mstrid
          left join createmaster c on a.ParantID = c.mstrid
          LEFT JOIN matchmst d ON a.MatchId = d.MstCode
          LEFT JOIN sportmst e ON d.SportId = e.ID
          LEFT JOIN market f ON a.MarketId =f.ID
          Union    
          SELECT a.bet_id mstcode,CONCAT(' > ',d.MatchName,' > ',a.FheadName,' (', a.session_no_size ,'-' ,a.session_yes_size ,') ', IFNULL(m.result,'') ) Description, (CASE WHEN a.OddValue = 0 THEN 'Yes' ELSE 'No' END) selectionName
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

-- settlement
-- model  Modelcreatemaster/submitClearChip
-- model  Modelcreatemaster/updateUserBalLiablity
-- controller  Chipscntrl/getChipDataById


DROP PROCEDURE IF EXISTS `getLiability`;
DELIMITER $$
CREATE PROCEDURE `getLiability`(IN `User_ID` INT)
BEGIN

    SELECT ROUND(IFNULL(c.Chips,0),2 ) FreeChip , ROUND(IFNULL(d.Chips,0), 2) Chip , IFNULL(a.Lay,0) AS Lay  , IFNULL(b.Stack,0) AS Back , 

    case when ROUND(IFNULL(i.Liability, 0)+ IFNULL(L.Liability, 0)+ IFNULL(N.Liability, 0)+ IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0) + IFNULL(O.Liability, 0) + IFNULL(qryOddEven.Liability, 0), 2) < 0 then ROUND(IFNULL(i.Liability, 0) + IFNULL(L.Liability, 0) + IFNULL(N.Liability, 0)+ IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0) + IFNULL(O.Liability, 0) + IFNULL(qryOddEven.Liability, 0), 2) else 0 end Liability, 

    

    ROUND(IFNULL(c.Chips,0) + IFNULL(j.ChipBal, 0) +  case when ROUND(IFNULL(i.Liability, 0) + IFNULL(L.Liability, 0) + IFNULL(N.Liability, 0) + IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0) + IFNULL(O.Liability, 0) + IFNULL(qryOddEven.Liability, 0), 2) < 0 then ROUND(IFNULL(i.Liability, 0) + IFNULL(L.Liability, 0) + IFNULL(N.Liability, 0) + IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0)+ IFNULL(O.Liability, 0) + IFNULL(qryOddEven.Liability, 0), 2) else 0 end ,2) Balance ,

 

    IFNULL((e.P_L + f.P_L + g.P_L + h.P_L),0)P_L, IFNULL(i.Liability, 0) marketliability, IFNULL(P.ChipBal, 0) chipspnl, IFNULL(L.Liability, 0) otherLiability, IFNULL(M.Liability, 0) upDownLiability , IFNULL(N.Liability, 0) lastdigit, IFNULL(k.Liability, 0) sessionLiability, IFNULL(O.Liability, 0) unmatchliability , IFNULL(qryOddEven.Liability, 0) oddEvenLiability FROM  

    (SELECT SUM(P_L)Lay FROM tblbets  WHERE isBack = 1 AND UserId =User_ID AND Result IS NULL AND ResultID IS NULL)  a ,    (SELECT  SUM(Stack)Stack FROM tblbets WHERE isBack = 0 AND  UserId =User_ID AND Result IS NULL AND ResultID IS NULL)b ,     (SELECT  SUM(Chips)Chips FROM tblchips WHERE IsFree = 1 AND ResultID IS NULL AND BetID IS NULL AND UserID =  User_ID )c ,

    ( SELECT SUM(a.ChipsCr-a.ChipsDr) Chips FROM tblchipdet a WHERE a.UserID = User_ID) d ,

    (SELECT IFNULL(SUM(P_L),0 )P_L FROM `tblbets` WHERE result =1 AND isBack = 0 AND UserID =User_ID)e,

    (SELECT IFNULL(SUM(-P_L),0 )P_L FROM `tblbets` WHERE result =1 AND isBack = 1 AND UserID =User_ID)f,

    (SELECT IFNULL(SUM(-Stack),0 )P_L FROM `tblbets` WHERE result =0 AND isBack = 0 AND UserID =User_ID)g,

    (SELECT IFNULL(SUM(Stack),0 )P_L FROM `tblbets` WHERE result =0 AND isBack = 1 AND UserID =User_ID)h,

    (Select sum(X .mSum)Liability from(select min(a.pnlvalue)'mSum' from (SELECT SUM(winValue + lossValue) pnlvalue, matchId, MarketId, SelectionId 

FROM vewUserPnlDetails WHERE userId = User_ID GROUP BY matchId, MarketId, SelectionId )a Where a.pnlvalue<0  group by MarketId)X ) i , 

    (SELECT  SUM(IFNULL(ChipsCr, 0) - IFNULL(ChipsDr, 0)) ChipBal FROM tblchipdet WHERE UserID =  User_ID AND MstType != 51)j, 

    (SELECT SUM(minvalue) Liability  FROM (SELECT MIN(pnlvalue) minvalue, matchId, MarketId FROM (SELECT SUM(aa) pnlvalue, matchId, fancyid  MarketId, yes SelectionId FROM vewsessionliability WHERE userId = User_ID GROUP BY yes,  matchId, fancyid) X GROUP BY matchId, MarketId)  Y) k,  

    (select SUM(bet_value)*-1  Liability from  `bet_entry` where TypeID in (3) and ResultID is null and userid = User_ID )L,   

    (SELECT SUM(minvalue)  Liability  FROM (SELECT MIN(pnlvalue) minvalue, matchId, MarketId FROM (SELECT SUM(aa) pnlvalue, matchId, fancyid  MarketId, runvalue SelectionId FROM vewUpDownliability WHERE userId = User_ID GROUP BY runvalue,  matchId, fancyid) X1 GROUP BY matchId, MarketId)  Y1) M,

    (select SUM(bet_value )*-1 Liability  from  `bet_entry` a inner join matchfancy b on a.fancyId = b.ID where a.TypeID = 4 and ResultID is null and userid = User_ID)N,

    (SELECT SUM(winValue) Liability  FROM  vewUserPnlUnMOnly WHERE userId = User_ID ) O,

    (SELECT  SUM(IFNULL(ChipsCr, 0) - IFNULL(ChipsDr, 0)) ChipBal FROM tblchipdet WHERE UserID =  User_ID) P,

    (select ifnull(Liability, 0) * case when ifnull(Liability, 0) > 0 then -1 else 1 end Liability from (select SUM(case when OddValue = 1 then 1 else -1 end * bet_value) Liability from `bet_entry` where TypeID in (1) and ResultID is null and userid = User_ID) qryOEinner) qryOddEven;  

END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_insClearChip`;
DELIMITER $$
CREATE PROCEDURE `sp_insClearChip`(IN `pUserID` INT, IN `pLoginID` INT, IN `pCrDr` INT, IN `pChips` DECIMAL(10,2), IN `pIsFree` INT, IN `pNarration` VARCHAR(50), IN `pparantid` INT, IN `HelperID` INT)
BEGIN
    DECLARE  LID INTEGER ;
    DECLARE  Lparantid INTEGER; DECLARE Lusertype INTEGER ;
    DECLARE resultV INT; DECLARE retMess VARCHAR(500); DECLARE useName VARCHAR(500);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET resultV = -1;
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
        SET retMess = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); 
        ROLLBACK;    
        SELECT resultV, retMess;
    END;
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
       SET resultV = -2;
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
        SET retMess = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);     
        ROLLBACK;
        SELECT resultV, retMess;
    END;
    START TRANSACTION;
        SELECT usetype,mstruserid into Lusertype,useName FROM `createmaster` WHERE mstrid = pUserID; 
        SET Lparantid = (SELECT parentId FROM `createmaster` WHERE mstrid = pparantid); 
        
        INSERT INTO `tblcashentry` (`parentId`, `childId`, `onDate`, `typeId`, `amountV`, `remarkV`, `CrDr`) VALUES (pparantid, pUserID, NOW(), 50, case when pCrDr = 1 then 1 else -1 end * pChips, pNarration, pCrDr);
        SET LID = LAST_INSERT_ID();
        IF pCrDr = "1" THEN
            INSERT INTO tblchipdet
            (MstDate, UserID, LoginID, CrDr, Narration, parantid, ChipsCr, ChipsDr, MstType, oppAcID, RefID, ChildID, LevelV, oppAcNm, CashEntryID)
            VALUES 
            (NOW(), pUserID, pLoginID, 1, 'Cash Received from Parent', pparantid, 0, pChips, 50, pparantid, 'Entry', 0, -1, 'Received', LID);
            
        INSERT INTO tblchipdet
            (MstDate, UserID, LoginID, CrDr, Narration, parantid, ChipsCr, ChipsDr, MstType, oppAcID, RefID, ChildID, LevelV, oppAcNm, CashEntryID)
            VALUES 
            (NOW(), pparantid, pLoginID, 1, concat('Cash Paid To ', useName), Lparantid, pChips , 0 , 51, pUserID, 'Entry', pUserID, -1, 'Paid', LID); 
        ELSEIF pCrDr = "2" THEN 
          INSERT INTO tblchipdet
            (MstDate, UserID, LoginID, CrDr, Narration, parantid, ChipsCr, ChipsDr, MstType, oppAcID, RefID, ChildID, LevelV, oppAcNm, CashEntryID)
            VALUES 
            (NOW(), pUserID, pLoginID, 1, 'Cash Paid to Parent', pparantid, pChips, 0, 51, pparantid, 'Entry', 0, -1, 'Paid', LID); 
            
            INSERT INTO tblchipdet
            (MstDate, UserID, LoginID, CrDr, Narration, parantid, ChipsCr, ChipsDr, MstType, oppAcID, RefID, ChildID, LevelV, oppAcNm, CashEntryID)
            VALUES 
            (NOW(), pparantid, pLoginID, 1, concat('Cash Received from ', useName), Lparantid, 0, pChips, 51, pUserID, 'Entry', pUserID, -1, 'Received', LID);  
        END IF;
    COMMIT;
    SET resultV = 0;
    SET retMess = 'Saved Successfully ...';
    SELECT resultV, retMess;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_acStatement_filters`;
DELIMITER $$
CREATE PROCEDURE `sp_acStatement_filters`(IN `pUserID` INT, IN `pFromDate` DATETIME, IN `pToDate` DATETIME, IN `qoffset` INT, IN `qlimit` INT)
BEGIN
    DECLARE pDateConditions varchar(255) default '';
    DECLARE finalQuery varchar(60000) default '';

    if pToDate != '0000-00-00' AND pFromDate != '0000-00-00' THEN
      SET pDateConditions = CONCAT(" where t.Sdate >= '",pFromDate,"' AND t.Sdate <= '",pToDate,"'");
    else
      SET pDateConditions =  '';
    end if;

    SET @variable = 0;
    SET @finalQuery = CONCAT( "select *,@variable := @variable + `Chips` AS `Balance` from (
select convert_tz(tcd.MstDate,'+00:00','+05:30') 'Sdate',cm.mstrUserId ,(CASE WHEN tcd.ChipsCr > 0 THEN tcd.ChipsCr ELSE (tcd.ChipsDr * -1) END) Chips,tcd.Narration ,tcd.ChipsCr 'Credit'
,tcd.ChipsDr 'Debit','-1' as IsBack,'-1' as isFancy
from tblchipdet tcd    
INNER JOIN createmaster cm On cm.mstrid =tcd.UserId
Where tcd.UserId = ",pUserId,"
Union All
select T0.MstDate 'Sdate',T1.mstrUserId ,T0.Chips,T0.Narration ,ifnull((Select SUM(l1.Chips) from TBLCHIPS l1 Where l1.UserId = T0.UserId and l1.Crdr = 1 and L1.MstDate= T0.Mstdate ),0.0) 'Credit'
,ifnull((Select SUM(l1.Chips) from TBLCHIPS l1 Where l1.UserId = T0.UserId and l1.Crdr = 2 and L1.MstDate= T0.Mstdate ),0.0) 'Debit','-1' as IsBack,'-1' as isFancy
from TBLCHIPS T0
INNER JOIN createmaster T1 On T1.mstrid =T0.UserId
Where T0.UserId = ",pUserId,"
Union All
select T0.MstDate 'Sdate',T1.mstrUserId ,T0.Chips,Concat((select MatchName from matchmst Where MstCode= MatchId),':-',T0.SelectionName,'odds::',T0.Odds,',Stake::',T0.Stack )'Narration' ,
ifnull((Select SUM(l1.Chips) from TblBets l1 Where l1.UserId = T0.UserId and l1.Chips >0.0 and L1.MstDate= T0.Mstdate ),0.0) 'Credit'
,ifnull(case when T0.Result>=0 then (Select SUM(l1.Chips) from TblBets l1 Where l1.UserId = T0.UserId and l1.Chips <=0.0 and L1.MstDate= T0.Mstdate ) end,0.0)  'Debit', IsBack,'0' as isFancy
from TblBets T0
INNER JOIN createmaster T1 On T1.mstrid =T0.UserId
Where T0.UserId = ",pUserId,"
Union All
select T0.DateTime 'Sdate',T1.mstrUserId ,T0.Chips,Concat((select MatchName from matchmst Where MstCode= MatchId),':-',(Select k0.HeadName from matchfancy k0 Where k0.MatchId =T0.MatchId and T0.FancyId = K0.Id  ) )'Narration' ,ifnull((Select SUM(l1.Chips) from bet_entry l1 Where l1.UserId = T0.UserId and l1.Chips >0.0 and L1.DateTime= T0.DateTime ),0.0) 'Credit'
,ifnull(-(Select SUM(l1.bet_value) from bet_entry l1 Where l1.UserId = T0.UserId and L1.DateTime= T0.DateTime ),0.0)  'Debit', Oddvalue as isBack,'1' as isFancy
from bet_entry T0
INNER JOIN createmaster T1 On T1.mstrid =T0.UserId
Where T0.UserId = ",pUserId," ) as t " , pDateConditions  ," order by t.Sdate ASC LIMIT ", qoffset , " , " , qlimit );



    PREPARE stmt FROM @finalQuery;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;


  END$$
DELIMITER ;

-- match declare issue with table auto increment
ALTER TABLE `p_l_by_match` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ,
ADD PRIMARY KEY (`id`);



-- sunny45bet
DROP PROCEDURE IF EXISTS `getLiability`;
DELIMITER $$
CREATE PROCEDURE `getLiability`(IN `User_ID` INT)
BEGIN

    SELECT ROUND(IFNULL(c.Chips,0),2 ) FreeChip , ROUND(IFNULL(d.Chips,0), 2) Chip , IFNULL(a.Lay,0) AS Lay  , IFNULL(b.Stack,0) AS Back , 

    case when ROUND(IFNULL(i.Liability, 0)+ IFNULL(L.Liability, 0)+ IFNULL(N.Liability, 0)+ IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0) + IFNULL(O.Liability, 0) + IFNULL(qryOddEven.Liability, 0), 2) < 0 then ROUND(IFNULL(i.Liability, 0) + IFNULL(L.Liability, 0) + IFNULL(N.Liability, 0)+ IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0) + IFNULL(O.Liability, 0) + IFNULL(qryOddEven.Liability, 0), 2) else 0 end Liability, 

    

    ROUND(IFNULL(c.Chips,0) + IFNULL(j.ChipBal, 0) +  case when ROUND(IFNULL(i.Liability, 0) + IFNULL(L.Liability, 0) + IFNULL(N.Liability, 0) + IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0) + IFNULL(O.Liability, 0) + IFNULL(qryOddEven.Liability, 0), 2) < 0 then ROUND(IFNULL(i.Liability, 0) + IFNULL(L.Liability, 0) + IFNULL(N.Liability, 0) + IFNULL(k.Liability, 0) + IFNULL(M.Liability, 0)+ IFNULL(O.Liability, 0) + IFNULL(qryOddEven.Liability, 0), 2) else 0 end ,2) Balance ,

 

    IFNULL((e.P_L + f.P_L + g.P_L + h.P_L),0)P_L, IFNULL(i.Liability, 0) marketliability, IFNULL(j.ChipBal, 0) chipspnl, IFNULL(L.Liability, 0) otherLiability, IFNULL(M.Liability, 0) upDownLiability , IFNULL(N.Liability, 0) lastdigit, IFNULL(k.Liability, 0) sessionLiability, IFNULL(O.Liability, 0) unmatchliability , IFNULL(qryOddEven.Liability, 0) oddEvenLiability FROM  

    (SELECT SUM(P_L)Lay FROM tblbets  WHERE isBack = 1 AND UserId =User_ID AND Result IS NULL AND ResultID IS NULL)  a ,    (SELECT  SUM(Stack)Stack FROM tblbets WHERE isBack = 0 AND  UserId =User_ID AND Result IS NULL AND ResultID IS NULL)b ,     (SELECT  SUM(Chips)Chips FROM tblchips WHERE IsFree = 1 AND ResultID IS NULL AND BetID IS NULL AND UserID =  User_ID )c ,

    ( SELECT SUM(a.ChipsCr-a.ChipsDr) Chips FROM tblchipdet a WHERE a.UserID = User_ID) d ,

    (SELECT IFNULL(SUM(P_L),0 )P_L FROM `tblbets` WHERE result =1 AND isBack = 0 AND UserID =User_ID)e,

    (SELECT IFNULL(SUM(-P_L),0 )P_L FROM `tblbets` WHERE result =1 AND isBack = 1 AND UserID =User_ID)f,

    (SELECT IFNULL(SUM(-Stack),0 )P_L FROM `tblbets` WHERE result =0 AND isBack = 0 AND UserID =User_ID)g,

    (SELECT IFNULL(SUM(Stack),0 )P_L FROM `tblbets` WHERE result =0 AND isBack = 1 AND UserID =User_ID)h,

    (Select sum(X .mSum)Liability from(select min(a.pnlvalue)'mSum' from (SELECT SUM(winValue + lossValue) pnlvalue, matchId, MarketId, SelectionId 

FROM vewUserPnlDetails WHERE userId = User_ID GROUP BY matchId, MarketId, SelectionId )a Where a.pnlvalue<0  group by MarketId)X ) i , 

    (SELECT  SUM(IFNULL(ChipsCr, 0) - IFNULL(ChipsDr, 0)) ChipBal FROM tblchipdet WHERE UserID =  User_ID )j, 

    (SELECT SUM(minvalue) Liability  FROM (SELECT MIN(pnlvalue) minvalue, matchId, MarketId FROM (SELECT SUM(aa) pnlvalue, matchId, fancyid  MarketId, yes SelectionId FROM vewsessionliability WHERE userId = User_ID GROUP BY yes,  matchId, fancyid) X GROUP BY matchId, MarketId)  Y) k,  

    (select SUM(bet_value)*-1  Liability from  `bet_entry` where TypeID in (3) and ResultID is null and userid = User_ID )L,   

    (SELECT SUM(minvalue)  Liability  FROM (SELECT MIN(pnlvalue) minvalue, matchId, MarketId FROM (SELECT SUM(aa) pnlvalue, matchId, fancyid  MarketId, runvalue SelectionId FROM vewUpDownliability WHERE userId = User_ID GROUP BY runvalue,  matchId, fancyid) X1 GROUP BY matchId, MarketId)  Y1) M,

    (select SUM(bet_value )*-1 Liability  from  `bet_entry` a inner join matchfancy b on a.fancyId = b.ID where a.TypeID = 4 and ResultID is null and userid = User_ID)N,

    (SELECT SUM(winValue) Liability  FROM  vewUserPnlUnMOnly WHERE userId = User_ID ) O,

    (select ifnull(Liability, 0) * case when ifnull(Liability, 0) > 0 then -1 else 1 end Liability from (select SUM(case when OddValue = 1 then 1 else -1 end * bet_value) Liability from `bet_entry` where TypeID in (1) and ResultID is null and userid = User_ID) qryOEinner) qryOddEven;  

END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_insClearChip`;
DELIMITER $$
CREATE PROCEDURE `sp_insClearChip`(IN `pUserID` INT, IN `pLoginID` INT, IN `pCrDr` INT, IN `pChips` DECIMAL(10,2), IN `pIsFree` INT, IN `pNarration` VARCHAR(50), IN `pparantid` INT, IN `HelperID` INT)
BEGIN
    DECLARE  LID INTEGER ;
    DECLARE  Lparantid INTEGER; DECLARE Lusertype INTEGER ;
    DECLARE resultV INT; DECLARE retMess VARCHAR(500); DECLARE useName VARCHAR(500);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET resultV = -1;
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
        SET retMess = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); 
        ROLLBACK;    
        SELECT resultV, retMess;
    END;
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
       SET resultV = -2;
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
        SET retMess = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);     
        ROLLBACK;
        SELECT resultV, retMess;
    END;
    START TRANSACTION;
        SELECT usetype,mstruserid into Lusertype,useName FROM `createmaster` WHERE mstrid = pUserID; 
        SET Lparantid = (SELECT parentId FROM `createmaster` WHERE mstrid = pparantid); 
        
        INSERT INTO `tblcashentry` (`parentId`, `childId`, `onDate`, `typeId`, `amountV`, `remarkV`, `CrDr`) VALUES (pparantid, pUserID, NOW(), 50, case when pCrDr = 1 then 1 else -1 end * pChips, pNarration, pCrDr);
        SET LID = LAST_INSERT_ID();
        IF pCrDr = "1" THEN
            INSERT INTO tblchipdet
            (MstDate, UserID, LoginID, CrDr, Narration, parantid, ChipsCr, ChipsDr, MstType, oppAcID, RefID, ChildID, LevelV, oppAcNm, CashEntryID)
            VALUES 
            (NOW(), pUserID, pLoginID, 1, 'Cash Received from Parent', pparantid, 0, pChips, 50, pparantid, 'Entry', 0, -1, 'Received', LID);
            
        INSERT INTO tblchipdet
            (MstDate, UserID, LoginID, CrDr, Narration, parantid, ChipsCr, ChipsDr, MstType, oppAcID, RefID, ChildID, LevelV, oppAcNm, CashEntryID)
            VALUES 
            (NOW(), pparantid, pLoginID, 1, concat('Cash Paid To ', useName), Lparantid, pChips , 0 , 50, pUserID, 'Entry', pUserID, -1, 'Paid', LID); 
        ELSEIF pCrDr = "2" THEN 
          INSERT INTO tblchipdet
            (MstDate, UserID, LoginID, CrDr, Narration, parantid, ChipsCr, ChipsDr, MstType, oppAcID, RefID, ChildID, LevelV, oppAcNm, CashEntryID)
            VALUES 
            (NOW(), pUserID, pLoginID, 1, 'Cash Paid to Parent', pparantid, pChips, 0, 50, pparantid, 'Entry', 0, -1, 'Paid', LID); 
            
            INSERT INTO tblchipdet
            (MstDate, UserID, LoginID, CrDr, Narration, parantid, ChipsCr, ChipsDr, MstType, oppAcID, RefID, ChildID, LevelV, oppAcNm, CashEntryID)
            VALUES 
            (NOW(), pparantid, pLoginID, 1, concat('Cash Received from ', useName), Lparantid, 0, pChips, 50, pUserID, 'Entry', pUserID, -1, 'Received', LID);  
        END IF;
    COMMIT;
    SET resultV = 0;
    SET retMess = 'Saved Successfully ...';
    SELECT resultV, retMess;
END$$
DELIMITER ;


