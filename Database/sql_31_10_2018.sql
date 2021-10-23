
DROP PROCEDURE IF EXISTS `sp_getHomeUserD_matches`;
DELIMITER $$
CREATE  PROCEDURE `sp_getHomeUserD_matches`(IN `p_userId` INT, IN `p_userType` INT)
NO SQL
  BEGIN

    DECLARE pParantId INTEGER;

    if (p_userType = 3) then

      select matchName, marketName, ROUND(sum(TeamA), 2) as TeamA, ROUND(sum(TeamB), 2) as TeamB, ROUND(sum(theDraw), 2) as theDraw , MatchId ,MarketId ,mstDate date , SportID,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=1 LIMIT 1) teamAt,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=2 LIMIT 1) teamBt,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=3 LIMIT 1) teamCt from vewUserHomePanel a where userId = p_userId group by matchName, marketName;

    else if (p_userType = 2) then

      set pParantId = (select IFNULL(parentId,0)parentId from createmaster where mstrid = p_userId);

      select * from(select matchName, marketName, ROUND(sum(TeamA * -1 * 100 / 100), 2) as TeamA, ROUND(sum(TeamB * -1 * 100 / 100), 2) as TeamB, ROUND(sum(theDraw * -1 * 100 / 100), 2) as theDraw , MatchId ,MarketId ,mstDate date , SportID,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=1 LIMIT 1) teamAt,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=2 LIMIT 1) teamBt,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=3 LIMIT 1) teamCt from vewUserHomePanel a LEFT JOIN user_deactive_match mdm ON a.matchId = mdm.match_id AND mdm.user_id = pParantId where mdm.id IS NULL AND parantId = p_userId group by matchName, marketName

                    UNION

                    select matchmst.matchName, market.Name marketName, 0 AS TeamA, 0 AS TeamB, 0 AS theDraw, market.matchId,market.Id,matchmst.MstDate DATE, matchmst.SportID,(

                                                                                                                                                                              SELECT DISTINCT(selectionName)

                                                                                                                                                                              FROM tblselection

                                                                                                                                                                              WHERE marketId = market.Id AND teamType=1

                                                                                                                                                                              LIMIT 1) teamAt,(

                                                                                                                                                                                              SELECT DISTINCT(selectionName)

                                                                                                                                                                                              FROM tblselection

                                                                                                                                                                                              WHERE marketId = market.Id AND teamType=2

                                                                                                                                                                                              LIMIT 1) teamBt,(

                                                                                                                                                                                                              SELECT DISTINCT(selectionName)

                                                                                                                                                                                                              FROM tblselection

                                                                                                                                                                                                              WHERE marketId = market.Id AND teamType=3

                                                                                                                                                                                                              LIMIT 1) teamCt from market

                                                                                                                                                                                                                                     LEFT JOIN matchmst ON market.matchId = matchmst.MstCode

                                                                                                                                                                                                                                     LEFT JOIN user_deactive_match mdm ON matchmst.MstCode = mdm.match_id AND mdm.user_id = pParantId

                                                                                                                                                                                                                                     LEFT JOIN (select matchId from vewUserHomePanel a where userId = p_userId GROUP BY matchId) grpvewUserHomePanel ON grpvewUserHomePanel.matchId = matchmst.MstCode

                    where mdm.id IS NULL AND  matchmst.active = 1 AND grpvewUserHomePanel.matchId IS NULL)ss group by MatchId ;

    else if (p_userType = 1) then

      select matchName, marketName, ROUND(sum(TeamA * -1 * 100 / 100), 2) as TeamA, ROUND(sum(TeamB * -1 * 100 / 100), 2) as TeamB, ROUND(sum(theDraw * -1 * 100 / 100), 2) as theDraw, MatchId ,MarketId ,mstDate date , SportID,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=1 LIMIT 1) teamAt,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=2 LIMIT 1) teamBt,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=3 LIMIT 1) teamCt from vewUserHomePanel a inner join createmaster b on b.mstrid = a.parantid where b.parentId = p_userId group by matchName, marketName

      UNION

      select matchmst.matchName, market.Name marketName, 0 AS TeamA, 0 AS TeamB, 0 AS theDraw, market.matchId,market.Id,matchmst.MstDate DATE, matchmst.SportID,(

                                                                                                                                                                SELECT DISTINCT(selectionName)

                                                                                                                                                                FROM tblselection

                                                                                                                                                                WHERE marketId = market.Id AND teamType=1

                                                                                                                                                                LIMIT 1) teamAt,(

                                                                                                                                                                                SELECT DISTINCT(selectionName)

                                                                                                                                                                                FROM tblselection

                                                                                                                                                                                WHERE marketId = market.Id AND teamType=2

                                                                                                                                                                                LIMIT 1) teamBt,(

                                                                                                                                                                                                SELECT DISTINCT(selectionName)

                                                                                                                                                                                                FROM tblselection

                                                                                                                                                                                                WHERE marketId = market.Id AND teamType=3

                                                                                                                                                                                                LIMIT 1) teamCt from market

                                                                                                                                                                                                                       LEFT JOIN matchmst ON market.matchId = matchmst.MstCode

                                                                                                                                                                                                                       LEFT JOIN (select matchId from vewUserHomePanel a inner join createmaster b on b.mstrid = a.parantid where b.parentId = p_userId GROUP BY matchId) grpvewUserHomePanel ON grpvewUserHomePanel.matchId = matchmst.MstCode

      where matchmst.active = 1 AND grpvewUserHomePanel.matchId IS NULL;

    else

      select matchName, marketName, ROUND(sum(TeamA * -1 * Admin / 100), 2) as TeamA, ROUND(sum(TeamB * -1 * Admin / 100), 2) as TeamB, ROUND(sum(theDraw * -1 * Admin / 100), 2) as theDraw , MatchId ,MarketId ,mstDate date , SportID,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=1 LIMIT 1) teamAt,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=2 LIMIT 1) teamBt,(select distinct(selectionName) from vewUserHomePanel where matchid=a.matchid and teamType=3 LIMIT 1) teamCt from vewUserHomePanel a group by matchName, marketName

      UNION select matchmst.matchName, market.Name marketName, 0 AS TeamA, 0 AS TeamB, 0 AS theDraw, market.matchId,market.Id,matchmst.MstDate DATE, matchmst.SportID,(

                                                                                                                                                                      SELECT DISTINCT(selectionName)

                                                                                                                                                                      FROM tblselection

                                                                                                                                                                      WHERE marketId = market.Id AND teamType=1

                                                                                                                                                                      LIMIT 1) teamAt,(

                                                                                                                                                                                      SELECT DISTINCT(selectionName)

                                                                                                                                                                                      FROM tblselection

                                                                                                                                                                                      WHERE marketId = market.Id AND teamType=2

                                                                                                                                                                                      LIMIT 1) teamBt,(

                                                                                                                                                                                                      SELECT DISTINCT(selectionName)

                                                                                                                                                                                                      FROM tblselection

                                                                                                                                                                                                      WHERE marketId = market.Id AND teamType=3

                                                                                                                                                                                                      LIMIT 1) teamCt from market

                                                                                                                                                                                                                             LEFT JOIN matchmst ON market.matchId = matchmst.MstCode

                                                                                                                                                                                                                             LEFT JOIN (select matchId from vewUserHomePanel a GROUP BY matchId) grpvewUserHomePanel ON grpvewUserHomePanel.matchId = matchmst.MstCode

      where matchmst.active = 1 AND grpvewUserHomePanel.matchId IS NULL;

    end if;

    end if;

    end if;

  END$$
DELIMITER ;

INSERT INTO `general_settings` (`id`, `key_name`, `key_value`, `updateOn`) VALUES (NULL, 'BET_NOTIFICATION_SOUND', '0', CURRENT_TIMESTAMP);