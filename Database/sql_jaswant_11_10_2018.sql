-- Addexch.com max odd limit 30 
-- application/config/constants.php
-- /application/controllers/Loginauthcontroller.php  chkLoginUser,is_logged_in_check 
-- application/models/Betentrymodel.php mobileValidateSaveBet

-- Risk Management
ALTER TABLE `tblconfig`
	ADD COLUMN `max_bet_liability` INT NULL DEFAULT '0' COMMENT 'max bet liability' AFTER `terms_conditions`,
	ADD COLUMN `max_market_liability` INT NULL DEFAULT '0' COMMENT 'max market liability' AFTER `max_bet_liability`;

ALTER TABLE `market`
	ADD COLUMN `max_bet_liability` INT NULL DEFAULT '0' COMMENT 'max bet liability' AFTER `market_runner_json`,
	ADD COLUMN `max_market_liability` INT NULL DEFAULT '0' COMMENT 'max market liability' AFTER `max_bet_liability`;

update market set max_bet_liability = 100000 where max_bet_liability = 0;
update market set max_market_liability = 500000 where max_market_liability = 0;	

ALTER TABLE `tblconfig`
	ADD COLUMN `max_session_bet_liability` INT NULL DEFAULT '0' COMMENT 'max session bet liability' AFTER `max_market_liability`,
	ADD COLUMN `max_session_liability` INT NULL DEFAULT '0' COMMENT 'max session liability' AFTER `max_session_bet_liability`;

ALTER TABLE `matchfancy`
	ADD COLUMN `max_session_bet_liability` INT NULL DEFAULT '0' COMMENT 'max session bet liability' AFTER `ind_fancy_selection_id`,
	ADD COLUMN `max_session_liability` INT NULL DEFAULT '0' COMMENT 'max session liability' AFTER `max_session_bet_liability`;		

update matchfancy set max_session_bet_liability = 100000 where max_session_bet_liability = 0;
update matchfancy set max_session_liability = 500000 where max_session_liability = 0;	

-- application\controllers\Apiadmincontroller.php   save_global_bet_liablity,save_global_market_liablity,save_match_bet_liablity,save_match_market_liablity
-- application\controllers\Apicontroller getMarketListing
-- application\controllers\Lstsavemstrcontroller  GetFancyOnHeader
-- application\controllers\Apiusercontroller  getUserFavouriteMatchLst,getFavouriteMatchLst				

-- application\models\Modeltblconfig  max_bet_liability,max_market_liability
-- application\models\Modeleventlst saveSportMatch,mobileGetFavMrktByMatchId,getMarketLst,mobileGetFavouriteMatchLst
-- application\models\Modelmatchfancy  getFancyById,sumSessionLiablity
-- application\models\Modeltblbets  sumMarketLiablity 

-- fancy score position not updating by new runs TBD
-- /application/models/Modellstmaster  mbdip_save_session_bet

-- patnership should be set for all users when dealer parntership is set  TBD
-- /application/models/Modelcreatemaster.php  updatePartnerShip,updateChildPartnership

-- Unmatched bets updated gurmeet sir api
-- /application/controllers/Betentrycntr/updateUnMatchedData

-- manish andriod sir request
-- application\controllers\Loginauthcontroller  is_logged_in_check

-- tied market remove 
-- /system/core/Controller.php getIndFancyAdmin