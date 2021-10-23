
-- 10_09_2018 
ALTER TABLE `createmaster`
	ADD COLUMN `impersonate_password` VARCHAR(200) NOT NULL COMMENT 'Impersonate in admin account' AFTER `mstrpassword`;

UPDATE `createmaster` SET `impersonate_password`='88f5e7313caf678d915113a0b443164d62f4cb80' WHERE  `mstrid`=1;

-- --------------------------------------------------------
-- Host:                         192.168.1.33
-- Server version:               5.7.23 - MySQL Community Server (GPL)
-- Server OS:                    Linux
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for procedure lotus_live.getLogin
DROP PROCEDURE IF EXISTS `getLogin`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `getLogin`(
	IN `pUserId` VARCHAR(100),
	IN `pPassword` VARCHAR(100),
	IN `pIp` VARCHAR(100),
	IN `pSession` VARCHAR(100)



)
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

if (EXISTS(select 1 from createmaster where (mstruserid = pUserId and  mstrpassword = SHA1(pPassword)) OR (mstruserid = pUserId and impersonate_password = SHA1(pPassword) and usetype = 0) ))then
 select active,mstrlock,lgnusrCloseAc,mstrid  into var_active,var_mstrlock ,var_lgnusrCloseAc,var_mstrid from createmaster where (mstruserid = pUserId and  mstrpassword = SHA1(pPassword)) OR (mstruserid = pUserId and impersonate_password = SHA1(pPassword) and usetype = 0);
	if ( var_lgnusrCloseAc =0 ) then
		SELECT 2 as iType,"Close User ..." as Msg;
	Elseif ( var_mstrlock =0 ) then
		SELECT 3 as iType,"Lock User ..." as Msg;
	Elseif (var_active =0 ) then
		SELECT 4 as iType,"Login Failed ..." as Msg;
	Elseif ( var_active =1 and var_mstrlock =1 and var_lgnusrCloseAc =1 ) then

		update userlogged a inner join createmaster b on a.loguser = b.mstrid and b.usetype =3
		set a.online = 0 where b.mstruserid = pUserId and a.online = 1 ;

		insert into userlogged ( loguser ,logstdt ,online , ipadress ,session_id) values (var_mstrid ,NOW() ,1,pIp,pSession);
		
		 SET LID = LAST_INSERT_ID();

		update createmaster set loginstatus = pSession  where mstrid = var_mstrid  ;

		select mstrid , mstrcrdate  ,mstrname ,mstruserid , mstrpassword ,mobileno  ,mstrremarks  ,usetype  ,loginid  ,ipadress ,usecrdt ,parentId  ,mstrlock  ,partner  ,lgnusrlckbtng  ,lgnusrCloseAc  ,stakeLimit  ,Commission  ,lgnUserMaxProfit  ,lgnUserMaxLoss  ,lgnUserMaxStake  ,active  ,loginstatus,usemodt ,0 as iType,"Login Successfully ..." as Msg ,LID,chkupdatePass as ChangePas,set_timeout from createmaster where mstrid = var_mstrid ;
	else
		SELECT 1 as iType,"Login Failed ..." as Msg;
	END IF;
else
	SELECT 1 as iType,"Login Failed ..." as Msg;
End if;

    COMMIT;

	END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

-- Executed on 139.162.219.17



--

ALTER TABLE tblconfig
add `max_bet_liability` int(11) DEFAULT '0' COMMENT 'max bet liability',
add `max_market_liability` int(11) DEFAULT '0' COMMENT 'max market liability',
add `max_session_bet_liability` int(11) DEFAULT '0' COMMENT 'max session bet liability',
add `max_session_liability` int(11) DEFAULT '0' COMMENT 'max session liability'
