ALTER TABLE `manual_match_odds` ADD `active_team1` ENUM('0','1') NOT NULL DEFAULT '1' AFTER `team1_lay`;
ALTER TABLE `manual_match_odds` ADD `active_team2` ENUM('0','1') NOT NULL DEFAULT '1' AFTER `team2_lay`;
ALTER TABLE `manual_match_odds` ADD `active_draw` ENUM('0','1') NOT NULL DEFAULT '1' AFTER `draw_lay`;
ALTER TABLE `manual_match_odds` ADD `dlay_time` VARCHAR(50) NOT NULL DEFAULT '0' AFTER `active_draw`;
