-- User fancy socre position
DROP PROCEDURE IF EXISTS `sp_GetScorePosition`;
DELIMITER //
CREATE PROCEDURE `sp_GetScorePosition`(
	IN `pUserID` INT,
	IN `pFancyID` INT,
	IN `pTypeID` INT
)
BEGIN
DECLARE lUseType INTEGER;
SET lUseType = (SELECT usetype FROM createmaster WHERE mstrid = pUserID);
IF lUseType = 3 THEN

	SELECT  CONVERT(SUM(aa) * -1, DECIMAL(10,2)) ResultValue ,Yes SessInptYes FROM(
	SELECT CASE WHEN OddValue = 1 THEN 'No' ELSE 'Yes' END Odds , 
	CASE WHEN OddValue = 1 THEN 
		CASE WHEN OddsNumber <=  Yes THEN - (b.bet_value * (b.session_no_size/100))
		ELSE ABS(b.bet_value) END 
	ELSE 
		CASE WHEN OddsNumber > Yes THEN - (b.bet_value)
		ELSE ABS(b.bet_value * (b.session_yes_size/100)) END 
	END * 1 aa ,
	Yes ,Bet_ID ,Bet_Value ,OddValue ,OddsNumber FROM sessionlist a
	LEFT JOIN (SELECT i.* FROM bet_entry i INNER JOIN createmaster j ON j.mstrid = i.userid) b ON a.ID = b.FancyID
	WHERE TypeID =2 AND b.FancyID = pFancyID
	)aa GROUP BY Yes ORDER BY Yes DESC ;

ELSEIF lUseType = 2 THEN

	SELECT  CONVERT(SUM(aa) * -1, DECIMAL(10,2)) ResultValue ,Yes SessInptYes FROM(
	SELECT CASE WHEN OddValue = 1 THEN 'No' ELSE 'Yes' END Odds , 
	CASE WHEN OddValue = 1 THEN 
		CASE WHEN OddsNumber <=  Yes THEN - ((b.bet_value * (b.session_no_size/100))  * (b.Dealer/100))
		ELSE ABS(b.bet_value * (b.Dealer/100)) END 
	ELSE 
		CASE WHEN OddsNumber > Yes THEN - (b.bet_value * (b.Dealer/100))
		ELSE ABS((b.bet_value * (b.session_yes_size/100))  * (b.Dealer/100)) END 
	END * 1 aa ,
	Yes ,Bet_ID ,Bet_Value ,OddValue ,OddsNumber FROM sessionlist a
	LEFT JOIN (SELECT i.* FROM bet_entry i INNER JOIN createmaster j ON j.mstrid = i.userid INNER JOIN createmaster k ON k.mstrid = j.parentId WHERE k.parentId = pUserID ) b ON a.ID = b.FancyID
	WHERE TypeID =2 AND b.FancyID = pFancyID
	)aa GROUP BY Yes ORDER BY Yes DESC ;

ELSEIF lUseType = 1 THEN

	SELECT  CONVERT(SUM(aa) * -1, DECIMAL(10,2)) ResultValue ,Yes SessInptYes   FROM(
	SELECT CASE WHEN OddValue = 1 THEN 'No' ELSE 'Yes' END Odds , 
	CASE WHEN OddValue = 1 THEN 
		CASE WHEN OddsNumber <=  Yes THEN - ((b.bet_value * (b.session_no_size/100))  * (b.Master/100))
		ELSE ABS(b.bet_value * (b.Master/100)) END 
	ELSE 
		CASE WHEN OddsNumber > Yes THEN - (b.bet_value * (b.Master/100))
		ELSE ABS((b.bet_value * (b.session_yes_size/100))  * (b.Master/100)) END 
	END * 1 aa ,
	Yes ,Bet_ID ,Bet_Value ,OddValue ,OddsNumber FROM sessionlist a
	LEFT JOIN (SELECT i.* FROM bet_entry i INNER JOIN createmaster j ON j.mstrid = i.userid INNER JOIN createmaster k ON k.mstrid = j.parentid INNER JOIN createmaster l ON l.mstrid =k.parentId WHERE l.parentid = pUserID ) b ON a.ID = b.FancyID
	WHERE TypeID =2 AND b.FancyID = pFancyID
	)aa GROUP BY   Yes ORDER BY Yes DESC;
	
ELSEIF lUseType = 0 THEN
	SELECT  CONVERT(SUM(aa) * -1, DECIMAL(10,2)) ResultValue ,Yes SessInptYes   FROM(
	SELECT CASE WHEN OddValue = 1 THEN 'No' ELSE 'Yes' END Odds , 
	CASE WHEN OddValue = 1 THEN 
		CASE WHEN OddsNumber <=  Yes THEN - Bet_value 
		ELSE Bet_value END 
	ELSE 
		CASE WHEN OddsNumber > Yes THEN - Bet_value 
		ELSE Bet_value END 
	END * 1 aa ,
	Yes ,Bet_ID ,Bet_Value ,OddValue ,OddsNumber FROM sessionlist a
	LEFT JOIN bet_entry b ON a.ID = b.FancyID
	WHERE TypeID =2 AND b.FancyID = pFancyID  AND SessInpYes <> SessInpNo
	UNION ALL
	SELECT CASE WHEN OddValue = 1 THEN 'No' ELSE 'Yes' END Odds , 
	CASE WHEN OddValue = 1 THEN 
		CASE WHEN OddsNumber <=  Yes THEN - (Bet_value +(Bet_value* ponitDiff)/100)
		ELSE ABS(Bet_value -(Bet_value* ponitDiff)/100) END 
	ELSE 
		CASE WHEN OddsNumber > Yes THEN - (Bet_value -(Bet_value* ponitDiff)/100)
		ELSE ABS(Bet_value +(Bet_value* ponitDiff)/100) END 
	END * 1 aa ,
	Yes ,Bet_ID ,Bet_Value ,OddValue ,OddsNumber FROM sessionlist a
	LEFT JOIN bet_entry b ON a.ID = b.FancyID
	WHERE TypeID =2 AND b.FancyID = pFancyID AND SessInpYes =SessInpNo
	)aa GROUP BY   Yes ORDER BY Yes DESC ;
END IF;
END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;




-- add exch session 2000  2200 loss issue
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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;


-- min stake limit
-- application/config/constants.php define('MIN_STAKE', '1000'); ERROR_MIN_STAKE
-- applcation/Apiusercontroller/  save_multiple_bets,one_click_stake_setting,stake_setting
-- models\Betentrymodel.php  validateSessionSaveBet,mobileValidateSaveBet

-- Runners json issue on home page
-- models\Modeleventlst  mobileGetUserFavouriteMatchLst,
-- models\Modelmarket  updateDefaultRunnerMarket,
-- models/Modeltblselection    findByMarketId
-- application/Geteventcntr saveSportMatch
-- system/core/controller updateMarketRunners

ALTER TABLE `tblconfig`
	ADD COLUMN `max_market_profit` INT NULL DEFAULT '0' COMMENT 'max market profit' AFTER `max_market_liability`;

ALTER TABLE `market`
	ADD COLUMN `max_market_profit` INT NULL DEFAULT '0' COMMENT 'max market profit' AFTER `max_market_liability`;

update market set max_market_profit = 2000000 where max_market_profit = 0;	
update tblconfig set max_market_profit = 2000000 where max_market_profit = 0 AND Id = 1;

-- Max market profit risk management
-- application/controllers/Apiadmincontroller save_global_market_profit,save_match_market_profit
-- models/Modeleventlst  getMarketLst , saveMatchMarket
-- models/Modeltblconfig find
-- models/Modelmarket findByMarketId
-- models/Betentrymodel  mobileValidateSaveBet



-- Set result 
-- controllers/Apiadmincontroller declareresult
-- models/Modelmarket resultDeclareMarketId
-- Testcntr/updatedselectiontbl
-- Testcntr/updatedselectiontblByResult
-- Apiadmincontroller/declareresult/

-- select * from market LEFT JOIN tblselection ON market.Id = tblselection.marketId where tblselection.id IS NULL order by createdOn DESC

-- prashant
ALTER TABLE `manual_match_odds` ADD `active_team1` ENUM('0','1') NOT NULL DEFAULT '1' AFTER `team1_lay`;
ALTER TABLE `manual_match_odds` ADD `active_team2` ENUM('0','1') NOT NULL DEFAULT '1' AFTER `team2_lay`;
ALTER TABLE `manual_match_odds` ADD `active_draw` ENUM('0','1') NOT NULL DEFAULT '1' AFTER `draw_lay`;
ALTER TABLE `manual_match_odds` ADD `dlay_time` VARCHAR(50) NOT NULL DEFAULT '0' AFTER `active_draw`;

