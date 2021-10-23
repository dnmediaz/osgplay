DROP PROCEDURE IF EXISTS `sp_acStatement_filters`;
DELIMITER $$
CREATE  PROCEDURE `sp_acStatement_filters`(IN `pUserID` INT, IN `pFromDate` DATETIME, IN `pToDate` DATETIME, IN `qoffset` INT, IN `qlimit` INT)
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

DROP PROCEDURE IF EXISTS `sp_acStatement_filters_count`;
DELIMITER $$
CREATE  PROCEDURE `sp_acStatement_filters_count`(IN `pUserID` INT, IN `pFromDate` DATETIME, IN `pToDate` DATETIME)
  BEGIN
    DECLARE pDateConditions varchar(255) default '';
    DECLARE finalQuery varchar(60000) default '';

    if pToDate != '0000-00-00' AND pFromDate != '0000-00-00' THEN
      SET pDateConditions = CONCAT(" where t.Sdate >= '",pFromDate,"' AND t.Sdate <= '",pToDate,"'");
    else
      SET pDateConditions =  '';
    end if;

    SET @variable = 0;
    SET @finalQuery = CONCAT( "select count(*) cnt,SUM(Credit) tot_credit,SUM(Debit) tot_debit,@variable := @variable + `Chips` AS `Balance` from (
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
Where T0.UserId = ",pUserId," ) as t " , pDateConditions  ," order by t.Sdate ASC");



    PREPARE stmt FROM @finalQuery;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;


  END$$
DELIMITER ;