<?php

defined('BASEPATH') or exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
define('FILE_READ_MODE', 0644);
define('FILE_WRITE_MODE', 0666);
define('DIR_READ_MODE', 0755);
define('DIR_WRITE_MODE', 0755);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/

define('FOPEN_READ', 'rb');
define('FOPEN_READ_WRITE', 'r+b');
define('FOPEN_WRITE_CREATE_DESTRUCTIVE', 'wb'); // truncates existing file data, use with care
define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE', 'w+b'); // truncates existing file data, use with care
define('FOPEN_WRITE_CREATE', 'ab');
define('FOPEN_READ_WRITE_CREATE', 'a+b');
define('FOPEN_WRITE_CREATE_STRICT', 'xb');
define('FOPEN_READ_WRITE_CREATE_STRICT', 'x+b');

/*
|--------------------------------------------------------------------------
| Display Debug backtrace
|--------------------------------------------------------------------------
|
| If set to TRUE, a backtrace will be displayed along with php errors. If
| error_reporting is disabled, the backtrace will not display, regardless
| of this setting
|
*/
define('SHOW_DEBUG_BACKTRACE', true);

/*
|--------------------------------------------------------------------------
| Exit Status Codes
|--------------------------------------------------------------------------
|
| Used to indicate the conditions under which the script is exit()ing.
| While there is no universal standard for error codes, there are some
| broad conventions.  Three such conventions are mentioned below, for
| those who wish to make use of them.  The CodeIgniter defaults were
| chosen for the least overlap with these conventions, while still
| leaving room for others to be defined in future versions and user
| applications.
|
| The three main conventions used for determining exit status codes
| are as follows:
|
|    Standard C/C++ Library (stdlibc):
|       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
|       (This link also contains other GNU-specific conventions)
|    BSD sysexits.h:
|       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
|    Bash scripting:
|       http://tldp.org/LDP/abs/html/exitcodes.html
|
*/
define('EXIT_SUCCESS', 0); // no errors
define('EXIT_ERROR', 1); // generic error
define('EXIT_CONFIG', 3); // configuration error
define('EXIT_UNKNOWN_FILE', 4); // file not found
define('EXIT_UNKNOWN_CLASS', 5); // unknown class
define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
define('EXIT_USER_INPUT', 7); // invalid user input
define('EXIT_DATABASE', 8); // database error
define('EXIT__AUTO_MIN', 9); // lowest automatically-assigned error code
define('EXIT__AUTO_MAX', 125); // highest automatically-assigned error code

define('DEFAULT_PAGING_LIMIT', 10);
define('ONE_REPORT_PAGING_LIMIT', 15);

define('CONFIG_UNMATCHED', 'Y');
define('CONFIG_LOGIN_TIME_OUT', 1800); 

define('ONE_CLICK_STAKE_OPTION', '[50,100,200]');
define('MATCH_STAKE_OPTION', '[1000,5000,10000,25000,50000,100000,150000]');
define('SESSION_STAKE_OPTION', '[500,1000,2000,5000,10000,15000,25000,50000]');

define('BETFAIR_APP_KEY', 'pULrrs5uJ2CUBeMY'); // Betfair app key  
define('BETFAIR_USERNAME', 'dannybillqwe@yandex.com'); // Betfair username
define('BETFAIR_PASSWORD', 'Nitinqwe1'); // Betfair Password

define('ERROR_AUTH', 1); 
define('ERROR_AUTH_MSG', 'Unauthorized access'); 
define('ERROR_INVALID_PASSWORD', 2); 
define('ERROR_INVALID_PASSWORD_MSG', 'Invalid Password'); 
define('ERROR_PASSWORD_MATCH', 3); 
define('ERROR_PASSWORD_MATCH_MSG', 'New Password and Retype Password not Match'); 
define('ERROR_TRY_AGAIN', 4); 
define('ERROR_TRY_AGAIN_MSG', 'Please try again'); 
define('ERROR_MAX_PROFIT', 5); 
define('ERROR_MAX_PROFIT_MSG', 'Your max profit is over'); 
define('ERROR_MAX_LOSS', 6); 
define('ERROR_MAX_LOSS_MSG', 'Your max loss is over'); 
define('ERROR_USER', 7); 
define('ERROR_USER_MSG', 'User not found'); 
define('ERROR_DELETE', 8); 
define('ERROR_DELETE_MSG', 'Record not deleted'); 
define('ERROR_INVALID_USER_PASSWORD', 9); 
define('ERROR_INVALID_USER_PASSWORD_MSG', 'Invalid username and password'); 
define('ERROR_USERNAME_EXISTS', 10); 
define('ERROR_USERNAME_EXISTS_MSG', 'Username Already Exits'); 
define('ERROR_PARAM_REQUIRED', 11); 
define('ERROR_PARAM_REQUIRED_MSG', 'Invalid params'); 
define('ERROR_EXITS', 12); 
define('ERROR_EXITS_MSG', 'Already exists'); 
define('ERROR_RECORD_NOT_EXITS', 13); 
define('ERROR_RECORD_NOT_EXITS_MSG', 'Record does not exists'); 
define('ERROR_RECORD_NOT_ACTIVE', 14); 
define('ERROR_RECORD_NOT_ACTIVE_MSG', 'Record not active');
define('REDIS_UN_MATCH_BET_SERVER', '127.0.0.1');


define('BETFAIR_SPORT_CRICKET', 4); 
define('BETFAIR_SPORT_TENNIS', 2);  
define('BETFAIR_SPORT_SOCCER', 1); 
define('BR_SUPER_AMDIN_URL','http://18.130.124.176/super_admin/BetfairApicontroller/');
define('BR_LIVE_SESSION_URL','http://139.162.242.237/betfair/betting_apis/market.php?market_id=');
define('BR_LIVE_ODDS_URL','http://139.162.242.237/betfair/betting_apis/odds.php?');
define('BR_LIVE_SERIES_URL','http://139.162.242.237/betfair/betting_apis/series.php?series_id=');
define('BR_LIVE_MATCHES_URL','http://139.162.242.237/betfair/betting_apis/matches.php?');
define('BR_LIVE_RESULT_URL','http://139.162.242.237/betfair/betting_apis/result.php?');
define('BR_LIVE_MATCHES_ODDS_URL','http://139.162.242.237/betfair/betting_apis/multi_market.php?');
define('BR_LIVE_CRICKET_SOCKET_URL','http://139.162.242.237/cricket_data.php');
define('BR_LIVE_SOCCER_SOCKET_URL','http://139.162.242.237/soccer_data.php');
define('BR_LIVE_TENNIS_SOCKET_URL','http://139.162.242.237/tennis_data.php');
define('BR_LIVE_SESSION_SOCKET_URL','http://139.162.242.237/session2_data.php');
define('EXCH_BACK_LAY_BY_MARKETS_URL','http://139.162.242.237/get_back_lay_price.php');