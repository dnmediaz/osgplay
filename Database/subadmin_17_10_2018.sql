--  run on only localhost
drop table IF EXISTS sub_admin;
CREATE TABLE `sub_admin` (
  `mstrid` INT(11) NOT NULL AUTO_INCREMENT,
  `mstrcrdate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mstrname` VARCHAR(30) NOT NULL,
  `mstruserid` VARCHAR(50) NOT NULL,
  `mstrpassword` VARCHAR(200) NOT NULL,
  `mobileno` VARCHAR(13) NOT NULL,
  `mstrremarks` VARCHAR(100) NULL DEFAULT NULL,
  `usetype` TINYINT(4) NOT NULL,
  `loginid` INT(11) NOT NULL,
  `ipadress` VARCHAR(14) NOT NULL,
  `usecrdt` DATETIME NOT NULL,
  `parentId` INT(11) NOT NULL,
  `mstrlock` INT(11) NOT NULL DEFAULT '1',
  `partner` VARCHAR(3) NULL DEFAULT NULL,
  `lgnusrlckbtng` INT(1) NOT NULL DEFAULT '1',
  `lgnusrCloseAc` INT(1) NOT NULL DEFAULT '1',
  `stakeLimit` INT(11) NULL DEFAULT '0',
  `Commission` DECIMAL(5,2) NULL DEFAULT '0.00',
  `lgnUserMaxProfit` INT(11) NULL DEFAULT NULL,
  `lgnUserMaxLoss` INT(11) NULL DEFAULT NULL,
  `lgnUserMaxStake` INT(11) NULL DEFAULT NULL,
  `active` TINYINT(1) NULL DEFAULT '1',
  `loginstatus` VARCHAR(200) NULL DEFAULT NULL,
  `usemodt` DATETIME NULL DEFAULT NULL,
  `SessionComm` DECIMAL(5,2) NULL DEFAULT '0.00',
  `OtherComm` DECIMAL(5,2) NULL DEFAULT '0.00',
  `chkupdatePass` INT(11) NULL DEFAULT '0',
  `set_timeout` INT(11) NULL DEFAULT '0',
  `HelperID` INT(11) NULL DEFAULT '0',
  `InPlayStack` INT(11) NULL DEFAULT '0',
  `betfair_session_token` VARCHAR(255) NULL DEFAULT NULL COMMENT 'betfair session token',
  `liability` FLOAT(10,2) NOT NULL COMMENT 'user liability',
  `balance` FLOAT(10,2) NOT NULL COMMENT 'user balance',
  `p_l` FLOAT(10,2) NOT NULL COMMENT 'user p l',
  `freechips` FLOAT(10,2) NOT NULL COMMENT 'user freechip',
  `chip` FLOAT(10,2) NOT NULL COMMENT 'chip',
  `sessionLiability` FLOAT(10,2) NOT NULL COMMENT 'session liability',
  `unmatchliability` FLOAT(10,2) NOT NULL COMMENT 'unmatch liability',
  `match_stake` VARCHAR(255) NOT NULL COMMENT 'json match stake',
  `one_click_stake` VARCHAR(255) NOT NULL COMMENT 'json one click stake',
  `is_confirm_bet` ENUM('Y','N') NOT NULL DEFAULT 'N' COMMENT '\'Y\'=> Yes , \'N\'=>No',
  `self_lgnusrlckbtng` INT(11) NULL DEFAULT '0',
  `parent_lgnusrlckbtng` INT(11) NOT NULL DEFAULT '0',
  `self_lgnusrCloseAc` INT(11) NOT NULL DEFAULT '0',
  `parent_lgnusrCloseAc` INT(11) NOT NULL DEFAULT '0',
  `self_mstrlock` INT(11) NOT NULL DEFAULT '0',
  `parent_mstrlock` INT(11) NOT NULL DEFAULT '0',
  `mstrlock_by_user_id` INT(11) NULL DEFAULT '0',
  `create_no_of_child` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`mstrid`)
)
  COLLATE='latin1_swedish_ci'
  ENGINE=InnoDB
  AUTO_INCREMENT=12
;


drop table IF EXISTS tblhelperright;
CREATE TABLE `tblhelperright` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `HelperID` INT(11) NULL DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `user` TINYINT(4) NULL DEFAULT '0',
  `AddUser` TINYINT(1) NULL DEFAULT '0',
  `ViewUser` TINYINT(11) NULL DEFAULT '0',
  `UpdateUser` TINYINT(1) NULL DEFAULT '0',
  `ChangePwd` TINYINT(1) NULL DEFAULT '0',
  `UserLock` TINYINT(1) NULL DEFAULT '0',
  `BettingLock` TINYINT(1) NULL DEFAULT '0',
  `Close_Ac` TINYINT(1) NULL DEFAULT '0',
  `chip` TINYINT(4) NULL DEFAULT '0',
  `ChipCr` TINYINT(1) NULL DEFAULT '0',
  `ChipDr` TINYINT(1) NULL DEFAULT '0',
  `fancy` TINYINT(4) NULL DEFAULT '0',
  `AddFancy` TINYINT(1) NULL DEFAULT '0',
  `ViewFancy` TINYINT(4) NULL DEFAULT '0',
  `EditFancy` TINYINT(1) NULL DEFAULT '0',
  `ActiveFancy` TINYINT(4) NULL DEFAULT '0',
  `LimitFancy` TINYINT(4) NULL DEFAULT '0',
  `Result` TINYINT(1) NULL DEFAULT '0',
  `ChipHistory` TINYINT(1) NULL DEFAULT '0',
  `ChipSummary` TINYINT(1) NULL DEFAULT '0',
  `seriesMatch` TINYINT(4) NULL DEFAULT '0',
  `ViewSeriesMatch` TINYINT(4) NULL DEFAULT '0',
  `ManageSeriesMatch` TINYINT(4) NULL DEFAULT '0',
  `settlementEntryList` TINYINT(4) NULL DEFAULT '0',
  `ViewSettlementEntryList` TINYINT(4) NULL DEFAULT '0',
  `ManageSettlementEntryList` TINYINT(4) NULL DEFAULT '0',
  `settledMatches` TINYINT(4) NULL DEFAULT '0',
  `ViewSettledMatches` TINYINT(4) NULL DEFAULT '0',
  `ManageSettledMatches` TINYINT(4) NULL DEFAULT '0',
  `trashBets` TINYINT(4) NULL DEFAULT '0',
  `ViewTrashBets` TINYINT(4) NULL DEFAULT '0',
  `ManageTrashBets` TINYINT(4) NULL DEFAULT '0',
  `marketSetting` TINYINT(4) NULL DEFAULT '0',
  `ViewMarketSetting` TINYINT(4) NULL DEFAULT '0',
  `ManageMarketSetting` TINYINT(4) NULL DEFAULT '0',
  `matchSetting` TINYINT(4) NULL DEFAULT '0',
  `ViewMatch` TINYINT(1) NULL DEFAULT '0',
  `ActiveMatch` TINYINT(4) NULL DEFAULT '0',
  `LimitMatch` TINYINT(4) NULL DEFAULT '0',
  `setMatchResult` TINYINT(4) NULL DEFAULT '0',
  `ViewSetMatchResult` TINYINT(4) NULL DEFAULT '0',
  `ManageSetMatchResult` TINYINT(4) NULL DEFAULT '0',
  `settings` TINYINT(4) NULL DEFAULT '0',
  `ViewSetting` TINYINT(4) NULL DEFAULT '0',
  `ManageSetting` TINYINT(4) NULL DEFAULT '0',
  `closedUsersAccount` TINYINT(4) NULL DEFAULT '0',
  `ViewClosedUsersAccount` TINYINT(4) NULL DEFAULT '0',
  `ManageClosedUsersAccount` TINYINT(4) NULL DEFAULT '0',
  `RemoveOldGameAndUser` TINYINT(4) NULL DEFAULT '0',
  `RemoveOldBetData` TINYINT(4) NULL DEFAULT '0',
  `MarketWatch` TINYINT(4) NULL DEFAULT '0',
  `subAdmin` TINYINT(4) NULL DEFAULT '0',
  `ViewSubAdmin` TINYINT(4) NULL DEFAULT '0',
  `AddSubAdmin` TINYINT(4) NULL DEFAULT '0',
  `manageSubAdmin` TINYINT(4) NULL DEFAULT '0',
  `profitAndLoss` TINYINT(4) NULL DEFAULT '0',
  `ViewProfitAndLoss` TINYINT(4) NULL DEFAULT '0',
  `ManageProfitAndLoss` TINYINT(4) NULL DEFAULT '0',
  `OnlineUsers` TINYINT(4) NULL DEFAULT '0',
  `role` TINYINT(4) NULL DEFAULT '0',
  `AddRole` TINYINT(4) NULL DEFAULT '0',
  `ViewRole` TINYINT(4) NULL DEFAULT '0',
  `ManageRole` TINYINT(4) NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  INDEX `HealperID` (`HelperID`)
)
  COLLATE='latin1_swedish_ci'
  ENGINE=InnoDB
;


-- only run localhost
DROP PROCEDURE IF EXISTS `getLoginSubAdmin`;
DELIMITER $$
CREATE  PROCEDURE `getLoginSubAdmin`(
  IN `pUserId` VARCHAR(100),
  IN `pPassword` VARCHAR(100),
  IN `pIp` VARCHAR(100),
  IN `pSession` VARCHAR(100)




)
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
  SQL SECURITY DEFINER
  COMMENT ''
  BEGIN

    DECLARE iType INT;
    DECLARE sMsg VARCHAR(500);
    DECLARE  LID INTEGER ;
    DECLARE retMess VARCHAR(500);
    DECLARE var_lgnusrCloseAc VARCHAR(50) ;
    DECLARE var_mstrlock VARCHAR(50) ;
    DECLARE var_active VARCHAR(50) ;
    DECLARE var_mstrid VARCHAR(50) ;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
      SET iType = 5;
      GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
      SET retMess = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
      ROLLBACK;
      SELECT iType, retMess;
    END;
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
      SET iType = 6;
      GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
      SET retMess = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
      ROLLBACK;
      SELECT iType, retMess;
    END;

    START TRANSACTION;

    if (EXISTS(select 1 from sub_admin where (mstruserid = pUserId and  mstrpassword = SHA1(pPassword))  ))then
      select active,mstrlock,lgnusrCloseAc,mstrid  into var_active,var_mstrlock ,var_lgnusrCloseAc,var_mstrid from sub_admin where (mstruserid = pUserId and  mstrpassword = SHA1(pPassword));
      if ( var_lgnusrCloseAc =0 ) then
        SELECT 2 as iType,"Close User ..." as Msg;
      Elseif ( var_mstrlock =0 ) then
        SELECT 3 as iType,"Lock User ..." as Msg;
      Elseif (var_active =0 ) then
        SELECT 4 as iType,"Login Failed ..." as Msg;
      Elseif ( var_active =1 and var_mstrlock =1 and var_lgnusrCloseAc =1 ) then





        update sub_admin set loginstatus = pSession  where mstrid = var_mstrid  ;

        select mstrid , mstrcrdate  ,mstrname ,mstruserid , mstrpassword ,mobileno  ,mstrremarks  ,usetype  ,loginid  ,ipadress ,usecrdt ,parentId  ,mstrlock  ,partner  ,lgnusrlckbtng  ,lgnusrCloseAc  ,stakeLimit  ,Commission  ,lgnUserMaxProfit  ,lgnUserMaxLoss  ,lgnUserMaxStake  ,active  ,loginstatus,usemodt ,0 as iType,"Login Successfully ..." as Msg ,chkupdatePass as ChangePas,set_timeout from sub_admin where mstrid = var_mstrid ;
      else
        SELECT 1 as iType,"Login Failed ..." as Msg;
      END IF;
    else
      SELECT 1 as iType,"Login Failed ..." as Msg;
    End if;

    COMMIT;

  END
$$
DELIMITER ;
