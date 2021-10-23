DROP PROCEDURE IF EXISTS `sp_getAllp_l_filters_count_by_match_possition`;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getAllp_l_filters_count_by_match_possition`(
  IN `pUserId` INT,
  IN `pSportID` INT,
  IN `pEventName` VARCHAR(50),
  IN `pFromDate` DATETIME,
  IN `pToDate` DATETIME
)
  BEGIN
    declare pEventNameConditions varchar(255) default '';
    declare pSportIdConditions varchar(255) default '';
    declare pDateConditions varchar(255) default '';
    declare finalQuery varchar(60000) default '';


    if pEventName != '' THEN
      SET pEventNameConditions =  CONCAT(" and EventName LIKE'%",pEventName,"%' ");
    else
      SET pEventNameConditions = '';
    end if;


    if pSportID = 0 THEN
      SET pSportIdConditions = ' where (sport_id = 4 OR sport_id = 2 OR sport_id = 1) ';
    else
      SET pSportIdConditions =  CONCAT(' where sport_id = ',pSportID);
    end if;

    if pToDate != '0000-00-00' AND pFromDate != '0000-00-00' THEN
      SET pDateConditions = CONCAT(" and ( settle_date >= '",pFromDate,"' AND settle_date <= '",pToDate,"' ) ");
    else
      SET pDateConditions =  '';
    end if;


    SET @finalQuery = CONCAT(
        " select count(*) cnt , ROUND(sum(PnL),2) PnL,ROUND(sum(Comm),2) Comm from p_l_by_match " , pSportIdConditions , pDateConditions , pEventNameConditions ," AND UserId = ", pUserId  );

    PREPARE stmt FROM @finalQuery;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;


  END$$
DELIMITER ;