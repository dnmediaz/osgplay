<?php

defined('BASEPATH') OR exit('No direct script access allowed');

	class Apiadmincontroller extends CI_Controller {
		var $globalUserId;
		var $globalUserType;
		public $APP_KEY = BETFAIR_APP_KEY;

		function __construct() {

				header('Access-Control-Allow-Origin: *');

		        parent::__construct();

                $_POST = json_decode(file_get_contents('php://input'), true);

		        $node1=$this->session->userdata('user_id');

		        $this->load->model('Modelchkuser');
		       // if ($this->session->userdata('user_id') != '') { } else { redirect(base_url());}
		       $currentMethod = $this->router->method;
		    /*   $allowAuth = array('chkLoginUser','getMarketListing','matchLstIndianSessionPublic');
		       if(!in_array($currentMethod, $allowAuth)){
					$this->checkAuthentication();
		       }  */
		}

		function matchlist(){
		    $str = $this->httpGet('http://167.99.198.2:3001/api/matches/list ');
		    echo $str;
		}

		/**
		 * [checkAuthentication check user authentication by headers]
		 * @return [type] [description]
		 */
	/*	function checkAuthentication(){

			$this->load->model('Modelcreatemaster');

			$username = $this->input->request_headers('PHP_AUTH_USER');
    		$password = $this->input->request_headers('PHP_AUTH_PW'); 
			$http_auth = $this->input->request_headers('Authorization');

			if(!empty($http_auth['Authorization'])){ 
 
				$basicauth = explode(' ', $http_auth['Authorization']);

				$userPass = $basicauth[1]; 
				$userPass = base64_decode($userPass);
				$authUser = explode(':', $userPass);
				$userName = $authUser[0];
				$password = $authUser[1];
				$checkUser = $this->Modelcreatemaster->checkUserStatus($userName,$password);
				
				if(empty($checkUser)){
					$response = array();
					$response["code"] = 1;
        			$response["error"] = true;
        			$response["message"] = "unauthorized access";
					$this->output->set_status_header(412)->set_content_type('application/json')->set_output(json_encode($response));
					exit();
				}else{
					$this->globalUserId = $checkUser['mstrid'];
					$this->globalUserType = $checkUser['usetype'];
				}
			}else{
					$response = array();
					$response["code"] = 1;
        			$response["error"] = true;
        			$response["message"] = "unauthorized access";
					$this->output->set_status_header(412)->set_content_type('application/json')->set_output(json_encode($response));
					exit();
			}
		} */

		function declareresult(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetMatchResult');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$response = array();
			$this->load->model('Modelmarket');
			$this->load->model('Modeltblselection');
			$this->load->model('Modeleventlst');
			$this->load->model('Modeltblbets');
			$this->load->model('Modelcreatemaster');
			
        	$results = $this->Modelmarket->resultDeclareMarketId();
        //	print_r($results);

        	if(!empty($results)){
        		$marketIds = array();
        		$matchArr = array();
	        	foreach($results as $result){
	        		$marketId = $result['marketId'];
	        		$marketIds[] = $marketId;
	        		$matchArr[$marketId] = $result['matchName'];
	        	}
	        	$marketStr = implode(',', $marketIds);
	        //	$marketStr = "1.179958225";
	        	$resultUrl = BETFAIR_RESULT_URL.$marketStr;
	        //	echo $resultUrl; die;
	        	$resultArr = $this->httpGetArr($resultUrl);
	        //	print_r($resultArr); 

	        	$filterResult = array();
	        	$filterMatchResult = array();
	        /*	if(!empty($resultArr[0]['result'])){  
	        		$finalResult = $resultArr[0]['result'];  */
	        	//	print_r($finalResult);die;
	        		foreach($resultArr as $fResult){
	        			if($fResult['status'] == 'CLOSED'){
	        				$temp = array();
	        				$tempMatches = array();
	        				
	        				if(!empty($fResult['runners'])){
	        					foreach($fResult['runners'] as $runners){
	        						if($runners['status'] == 'WINNER'){
	        							$temp['selectionId'] = $runners['selectionId'];
	        						}		
	        					}
	        					if(!empty($temp['selectionId'])){
	        						$temp['marketId'] = $fResult['marketId'];
	        						$filterResult[] = $temp;
	        						$tempMatches['matchName'] =  $matchArr[$fResult['marketId']]; 
	        						$filterMatchResult[] = $tempMatches; 
	        					}
	        				}
	        				
	        			}
	        		}
	        //	}

	        //	print_r($filterResult);
            /*    $this->db->trans_start();
                $this->db->trans_strict(FALSE); */
                    foreach ($filterResult as $data) {
                        $marketId = $data['marketId'];
                        $selectionId = $data['selectionId'];
                        $marketData = $this->Modelmarket->findByMarketId($marketId);

                        $selectionName = $this->Modeltblselection->findBySelectionNameMarket($selectionId,$marketId);

                     //   echo $selectionName;

                        $marketData = array_merge($marketData, array('market_id' => $marketId, 'selectionId' => $selectionId, 'selectionName' => $selectionName, 'isFancy' => 1, 'result' => 1));
                        $matchId = $marketData['Match_id'];

                    //    print_r($marketData);die;
                        $condition = $this->Modeleventlst->SetMatchResult($marketData);

                    //    echo 'test3';die;

                        if ($condition[0]['resultV'] == 0) {
                          $this->load->model('Modeltblbets');
                          $this->Modeltblbets->updateUserBalByMatch($matchId, $marketId);

                        
		                /*    $uIds = $this->Modeltblbets->getMatchUser($matchId,$marketId);
		                    foreach($uIds as $uid){
		                        $this->Modelcreatemaster->updateUserBalLiablity($uid);
		                    } */

							
                            $redis = new Redis();
                            $redis->connect(REDIS_UN_MATCH_BET_SERVER, 6379); 

                            $database = $this->db->database;
                            $key = $database . '_' . $marketId . '*';
                            $redis->delete($redis->keys($key));
                        }

                    }
            /*    if ($this->db->trans_status() === FALSE) {

                    $this->db->trans_rollback();

                }
                else {

                    $this->db->trans_commit();

                } */

                if(!empty($filterMatchResult)){
					$response["code"] = 0;
					$response["error"] = false;
					$showMatches = array();
					foreach($filterMatchResult as $fmresult){
						$showMatches[] = $fmresult['matchName'];
					}
					$msg = "Following matches have been declared : ".implode(' , ' , $showMatches); 
        			$response["message"] = $msg;
        		/*	$filterMatchResult = array();
        			$filterMatchResult[] = array('matchName'=>'Eng Vs India');
        			$filterMatchResult[] = array('matchName'=>'India Vs Pakistan'); */
        			$response["data"] = $filterMatchResult;


				}else{
					$response["code"] = 1;
					$response["error"] = true;
        			$response["message"] = "No match result declared yet";
				} 
        	}
        	else{
        		$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = "There are no match to declare a match";
        	}
        	
			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
		} 

		function delete_match_profit_loss($matchId=0){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageProfitAndLoss');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->load->model('Modeltblchipdet');

			$response = array();
			$isUpdated = $this->Modeltblchipdet->updateByMatchId($matchId,array('is_deleted'=>'Y'));
			
			if ($isUpdated) {
				$response["code"] = 0;
				$response["error"] = false;
	        	$response["message"] = "Match deleted Successfully...";
			}else{
				$response["code"] = ERROR_DELETE;
				$response["error"] = true;
	        	$response["message"] = ERROR_DELETE_MSG;
			}

			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));

		}

		/**
		 * [one_page_report description]
		 * @param  [type] $userId   [description]
		 * @param  [type] $fromDate [description]
		 * @param  [type] $toDate   [description]
		 * @param  [type] $type     [1=>'bet_history']
		 * @return [type]           [description]
		 */
		
		// {"user_id":15,"from_date":"2018-07-01","from_time":"01:00:00","to_date":"2018-08-28","to_time":"23:00:00","type":4,"page_no":1}

		function one_page_report(){	

			$userId=$_POST['user_id'];
			$sportId=isset($_POST['sport_id']) ? $_POST['sport_id'] : 0;
			$fromDate=$_POST['from_date'];
			$fromTime=$_POST['from_time'];
			$toDate=$_POST['to_date'];
			$toTime=$_POST['to_time'];
			$type=$_POST['type'];
			$betType= isset($_POST['bet_type'])?$_POST['bet_type'] : 'M';
			$page_no=$_POST['page_no'];
			$transaction_type=isset($_POST['transaction_type'])?$_POST['transaction_type'] : 'ALL';

			if(!empty($fromDate) && !empty($fromTime)){
				$fromDateTime = $fromDate.' '.$fromTime;
			}elseif(!empty($fromDate) && empty($fromTime)){
				$fromDateTime = $fromDate.' 00:00:00';
			}else{
				$fromDateTime = 0;
			}
			
			if(!empty($toDate) && !empty($toTime)){
				$toDateTime = $toDate.' '.$toTime;
			}elseif(!empty($toDate) && empty($toTime)){
				$toDateTime = $toDate.' 23:59:59';	
			}else{
				$toDateTime = 0;
			}	

			$pageLimit = ONE_REPORT_PAGING_LIMIT;
			$this->load->model('Betentrymodel');
			
			$loginUserId = $this->globalUserId;
			$data = array();
			if($type==1){

                $this->load->model('ModelUserRights');
                $userRole = $this->ModelUserRights->hasRole('BetHistory');
                if($userRole['status']){
                    return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
                }

				$params = array('user_id'=>$userId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no,'bet_type'=>$betType);
				$data = $this->Betentrymodel->myBetsFilters($params);
				$totalCount = $this->Betentrymodel->myBetsFiltersCount($params);
				$recordCount = $totalCount[0]['cnt'];
				$response["tot_p_l"] = $totalCount[0]['tot_p_l'];
				$response["tot_profit"] = $totalCount[0]['tot_profit'];
				$response["tot_liability"] = $totalCount[0]['tot_liability'];
			}elseif($type==2){
                $this->load->model('ModelUserRights');
                $userRole = $this->ModelUserRights->hasRole('ProfitLoss');
                if($userRole['status']){
                    return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
                }

				$params = array('user_id'=>$userId,'sport_id'=>$sportId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no);
				/*$data = $this->Betentrymodel->mbdip_profit_loss($params);
				$totalCount = $this->Betentrymodel->mbdip_profit_loss_count($params);
				$recordCount = $totalCount[0]['cnt'];
				$response["tot_PnL"] = $totalCount[0]['PnL'];
				$response["tot_Comm"] = $totalCount[0]['Comm'];*/

                $data = $this->Betentrymodel->mbdip_profit_loss_by_match_possition($params);
                $totalCount = $this->Betentrymodel->mbdip_profit_loss_count_by_match_possition($params);
                $recordCount = $totalCount[0]['cnt'];
                $response["tot_PnL"] = $totalCount[0]['PnL'];
                $response["tot_Comm"] = $totalCount[0]['Comm'];
			}elseif($type==3){

                $this->load->model('ModelUserRights');
                $userRole = $this->ModelUserRights->hasRole('AccountStatements');
                if($userRole['status']){
                    return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
                }

				$params = array('user_id'=>$userId,'sport_id'=>$sportId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>15000,'page_no'=>$page_no,'transaction_type'=>$transaction_type);
				$data = $this->Betentrymodel->AcStatementFilter($params);
				$totalCount = $this->Betentrymodel->AcStatementFilterCount($params);
			//	print_r($totalCount);die;
			//	$totalCount = 1;
				$recordCount = 1;
				$response["tot_credit"] = $totalCount[0]['tot_credit'];
				$response["tot_debit"] = $totalCount[0]['tot_debit'];
				$response["tot_balance"] = $totalCount[0]['tot_credit'] + $totalCount[0]['tot_debit'];
			}elseif($type==4){

                $this->load->model('ModelUserRights');
                $userRole = $this->ModelUserRights->hasRole('LoginHistory');
                if($userRole['status']){
                    return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
                }

				$this->load->model('Modeluserlogged');
				$params = array('user_id'=>$userId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no);
				$data = $this->Modeluserlogged->findByUserId($params);
				$totalCount = $this->Modeluserlogged->findByUserIdCount($params);
				$recordCount = $totalCount[0]['cnt'];
			}

			$response["code"] = 0;
			$response["error"] = false;
			$response["message"] = "Reports listing";
			$response["data"] = $data;
			$response["count"] = $recordCount;
			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			
		}

		/**
		 * [one_page_report_export description]
		 * @param  [type] $userId   [description]
		 * @param  [type] $fromDate [description]
		 * @param  [type] $toDate   [description]
		 * @param  [type] $type     [1=>'bet_history']
		 */
		// {"user_id":15,"from_date":"2018-08-28","from_time":"01:00:00","to_date":"2018-08-28","to_time":"23:00:00","type":1,"page_no":1}
		function one_page_report_export($userId=null,$fromDate=NULL,$toDate=NULL,$type=NULL){

			$userId=$_POST['user_id'];
            $sportId=isset($_POST['sport_id'])?$_POST['sport_id'] : 0;
			$fromDate=$_POST['from_date'];
			$fromTime=$_POST['from_time'];
			$toDate=$_POST['to_date'];
			$toTime=$_POST['to_time'];
			$type=$_POST['type'];
			$betType= isset($_POST['bet_type'])?$_POST['bet_type'] : 'M';
			$transaction_type=isset($_POST['transaction_type'])?$_POST['transaction_type'] : 'ALL';


			if(!empty($fromDate) && !empty($fromTime)){
				$fromDateTime = $fromDate.' '.$fromTime;
			}elseif(!empty($fromDate) && empty($fromTime)){
				$fromDateTime = $fromDate.' 00:00:00';
			}else{
				$fromDateTime = 0;
			}
			
			if(!empty($toDate) && !empty($toTime)){
				$toDateTime = $toDate.' '.$toTime;
			}elseif(!empty($toDate) && empty($toTime)){
				$toDateTime = $toDate.' 23:59:59';	
			}else{
				$toDateTime = 0;
			}	

			$page_no = 1;
			$pageLimit = 9000;
			$this->load->model('Betentrymodel');
			
			$loginUserId = $this->globalUserId;
			$data = array();
			if($type==1){
				$params = array('user_id'=>$userId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no,'bet_type'=>$betType);
				$data = $this->Betentrymodel->myBetsFilters($params);
				$totalCount = $this->Betentrymodel->myBetsFiltersCount($params);
				$recordCount = $totalCount[0]['cnt'];
			}elseif($type==2){
                $params = array('user_id'=>$userId,'sport_id'=>$sportId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no);
                $data = $this->Betentrymodel->mbdip_profit_loss_by_match_possition($params);
                $totalCount = $this->Betentrymodel->mbdip_profit_loss_count_by_match_possition($params);
                $recordCount = $totalCount[0]['cnt'];
				/*$params = array('user_id'=>$userId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no);
				$data = $this->Betentrymodel->mbdip_profit_loss($params);
				$totalCount = $this->Betentrymodel->mbdip_profit_loss_count($params);
				$recordCount = $totalCount[0]['cnt'];*/
			}elseif($type==3){
				$params = array('user_id'=>$userId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>15000,'page_no'=>$page_no,'transaction_type'=>$transaction_type);
				$data = $this->Betentrymodel->AcStatementFilter($params);
			//	$totalCount = $this->Betentrymodel->AcStatementFilterCount($params);
				$totalCount = 1;
				$recordCount = 1;
			}elseif($type==4){
				$this->load->model('Modeluserlogged');
				$params = array('user_id'=>$userId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no);
				$data = $this->Modeluserlogged->findByUserId($params);
				$totalCount = $this->Modeluserlogged->findByUserIdCount($params);
				$recordCount = $totalCount[0]['cnt'];
			}

			$response["code"] = 0;
			$response["error"] = false;
			$response["message"] = "Reports listing";
			$response["data"] = $data;
			$response["count"] = $recordCount;
			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			
		}

		/**
		 * [one_page_report description]
		 * @param  [type] $userId   [description]
		 * @param  [type] $fromDate [description]
		 * @param  [type] $toDate   [description]
		 * @param  [type] $type     [1=>'bet_history']
		 * @return [type]           [description]
		 */
		


		function one_page_report_pl($userId=null,$fromDate=NULL,$toDate=NULL,$sportId=NULL,$page_no=1){	
			$userId=$_POST['user_id'];
			$fromDate=$_POST['from_date'];
			$fromTime=$_POST['from_time'];
			$toDate=$_POST['to_date'];
			$toTime=$_POST['to_time'];
			$sportId=$_POST['sport_id'];
			$page_no=$_POST['page_no'];

			if(!empty($fromDate) && !empty($fromTime)){
				$fromDateTime = $fromDate.' '.$fromTime;
			}elseif(!empty($fromDate) && empty($fromTime)){
				$fromDateTime = $fromDate.' 00:00:00';
			}else{
				$fromDateTime = 0;
			}
			
			if(!empty($toDate) && !empty($toTime)){
				$toDateTime = $toDate.' '.$toTime;
			}elseif(!empty($toDate) && empty($toTime)){
				$toDateTime = $toDate.' 23:59:59';	
			}else{
				$toDateTime = 0;
			}	

			$pageLimit = DEFAULT_PAGING_LIMIT;
			$this->load->model('Betentrymodel');
			$loginUserId = $this->globalUserId;
			$data = array();

			$params = array('user_id'=>$userId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no,'sport_id'=>$sportId);
			$data = $this->Betentrymodel->mbdip_profit_loss($params);
			$totalCount = $this->Betentrymodel->mbdip_profit_loss_count($params);
			$recordCount = $totalCount[0]['cnt'];
			$response["tot_PnL"] = $totalCount[0]['PnL'];
			$response["tot_Comm"] = $totalCount[0]['Comm'];

			$response["code"] = 0;
			$response["error"] = false;
			$response["message"] = "Reports listing";
			$response["data"] = $data;
			$response["count"] = $recordCount;
			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			
		}

		/**
		 * [one_page_report description]
		 * @param  [type] $userId   [description]
		 * @param  [type] $fromDate [description]
		 * @param  [type] $toDate   [description]
		 * @param  [type] $type     [1=>'bet_history']
		 * @return [type]           [description]
		 */
		function one_page_report_pl_export($userId=null,$fromDate=NULL,$toDate=NULL,$sportId=NULL){	

			$userId=$_POST['user_id'];
			$fromDate=$_POST['from_date'];
			$fromTime=$_POST['from_time'];
			$toDate=$_POST['to_date'];
			$toTime=$_POST['to_time'];
			$sportId=$_POST['sport_id'];

			if(!empty($fromDate) && !empty($fromTime)){
				$fromDateTime = $fromDate.' '.$fromTime;
			}elseif(!empty($fromDate) && empty($fromTime)){
				$fromDateTime = $fromDate.' 00:00:00';
			}else{
				$fromDateTime = 0;
			}
			
			if(!empty($toDate) && !empty($toTime)){
				$toDateTime = $toDate.' '.$toTime;
			}elseif(!empty($toDate) && empty($toTime)){
				$toDateTime = $toDate.' 23:59:59';	
			}else{
				$toDateTime = 0;
			}	

			$page_no = 1;
			$pageLimit = 9000;
			$this->load->model('Betentrymodel');
			$loginUserId = $this->globalUserId;
			$data = array();

			$params = array('user_id'=>$userId,'from_date'=>$fromDateTime,'to_date'=>$toDateTime,'page_limit'=>$pageLimit,'page_no'=>$page_no,'sport_id'=>$sportId);
			$data = $this->Betentrymodel->mbdip_profit_loss($params);
			$totalCount = $this->Betentrymodel->mbdip_profit_loss_count($params);
			$recordCount = $totalCount[0]['cnt'];

			$response["code"] = 0;
			$response["error"] = false;
			$response["message"] = "Reports listing";
			$response["data"] = $data;
			$response["count"] = $recordCount;
			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			
		}

	    function get_all_matches(){	    

            $this->load->model('Modelmatchmst');

            $supperAdminMatchIds = $this->Modelmatchmst->getAcriveMatchIds();

            $temp = ['cricket'=>[],'soccer'=>[],'tennis'=>[]];
            $cricketSeries = $this->Modelmatchmst->findActiveSeriesBySport(4);
            foreach($cricketSeries as $cSeries){
            	$sportId = $cSeries['SportID'];
            	$curl = BETFAIR_MATCH_URL . 4 . '&CompetitionID=' . $cSeries['seriesId'];
            	$cmatchResult = $this->httpGet($curl);
		    	$cdata = json_decode($cmatchResult,true);
		    	$tempEvent = [];
		    	foreach($cdata as $cd){
					$tempEvent['MstCode'] = $cd['event']['id'];
				    $tempEvent['MstDate'] =  $cd['event']['openDate'];
				    $tempEvent['startDate'] = "0000-00-00 00:00:00";
				    $tempEvent['SportID'] = $sportId;
				    $tempEvent['active'] = "0";
				    $tempEvent['matchName'] = $cd['event']['name'];
				    $tempEvent['countryCode'] = "";
				    $tempEvent['marketCount'] = "0";
				    $tempEvent['createdOn'] = "0000-00-00 00:00:00";
				    $tempEvent['seriesId'] = $cSeries['seriesId'];
				    $tempEvent['oddsLimit'] = "0";
				    $tempEvent['volumeLimit'] = "1.00";
				    $tempEvent['HelperID'] = "0";
				    $tempEvent['runner_json'] = "";
				    $tempEvent['score_board_json'] = "[]";
				    $tempEvent['bet_deleted'] = "0";
				    $tempEvent['hard_bet_deleted'] = "0";
				    $tempEvent['is_manual'] = "0";
		    		$tempEvent['active'] = in_array($cd['event']['id'],$supperAdminMatchIds) ? 1:0;
					$tempEvent['eventName'] = $cd['event']['name']; 
					$tempEvent['eventDate'] = $cd['event']['openDate']; 
		    		$tempEvent['seriesName'] = $cSeries['Name']; 
		    		$temp['cricket'][] = $tempEvent;	
		    	}
            }

            $soccerSeries = $this->Modelmatchmst->findActiveSeriesBySport(1);
            foreach($soccerSeries as $sSeries){
            	$sportId = $sSeries['SportID'];
            	$surl = BETFAIR_MATCH_URL . 1 . '&CompetitionID=' . $sSeries['seriesId'];
            	$smatchResult = $this->httpGet($surl);
		    	$sdata = json_decode($smatchResult,true);
		    	$tempEvent = [];
		    	foreach($sdata as $sd){
		    		$tempEvent['MstCode'] = $sd['event']['id'];
				    $tempEvent['MstDate'] =  $sd['event']['openDate'];
				    $tempEvent['startDate'] = "0000-00-00 00:00:00";
				    $tempEvent['SportID'] = $sportId;
				    $tempEvent['active'] = "0";
				    $tempEvent['matchName'] = $sd['event']['name'];
				    $tempEvent['countryCode'] = "";
				    $tempEvent['marketCount'] = "0";
				    $tempEvent['createdOn'] = "0000-00-00 00:00:00";
				    $tempEvent['seriesId'] = $sSeries['seriesId'];
				    $tempEvent['oddsLimit'] = "0";
				    $tempEvent['volumeLimit'] = "1.00";
				    $tempEvent['HelperID'] = "0";
				    $tempEvent['runner_json'] = "";
				    $tempEvent['score_board_json'] = "[]";
				    $tempEvent['bet_deleted'] = "0";
				    $tempEvent['hard_bet_deleted'] = "0";
				    $tempEvent['is_manual'] = "0";
		    		$tempEvent['active'] = in_array($sd['event']['id'],$supperAdminMatchIds) ? 1:0;
		    		$tempEvent['eventName'] = $sd['event']['name']; 
					$tempEvent['eventDate'] = $sd['event']['openDate']; 
		    		$tempEvent['seriesName'] = $sSeries['Name']; 
		    		$temp['soccer'][] = $tempEvent;	
		    	}
            }

            $tennisSeries = $this->Modelmatchmst->findActiveSeriesBySport(2);
            foreach($tennisSeries as $tSeries){
            	$sportId = $tSeries['SportID'];
            	$turl = BETFAIR_MATCH_URL . 2 . '&CompetitionID=' . $tSeries['seriesId'];
            	$tmatchResult = $this->httpGet($turl);
		    	$tdata = json_decode($tmatchResult,true);
		    	$tempEvent = [];
		    	foreach($tdata as $td){
		    		$tempEvent['MstCode'] = $td['event']['id'];
				    $tempEvent['MstDate'] =  $td['event']['openDate'];
				    $tempEvent['startDate'] = "0000-00-00 00:00:00";
				    $tempEvent['SportID'] = $sportId;
				    $tempEvent['active'] = "0";
				    $tempEvent['matchName'] = $td['event']['name'];
				    $tempEvent['countryCode'] = "";
				    $tempEvent['marketCount'] = "0";
				    $tempEvent['createdOn'] = "0000-00-00 00:00:00";
				    $tempEvent['seriesId'] = $tSeries['seriesId'];
				    $tempEvent['oddsLimit'] = "0";
				    $tempEvent['volumeLimit'] = "1.00";
				    $tempEvent['HelperID'] = "0";
				    $tempEvent['runner_json'] = "";
				    $tempEvent['score_board_json'] = "[]";
				    $tempEvent['bet_deleted'] = "0";
				    $tempEvent['hard_bet_deleted'] = "0";
				    $tempEvent['is_manual'] = "0";
		    		$tempEvent['active'] = in_array($td['event']['id'],$supperAdminMatchIds) ? 1:0;
		    		$tempEvent['eventName'] = $td['event']['name']; 
					$tempEvent['eventDate'] = $td['event']['openDate']; 
		    		$tempEvent['seriesName'] = $tSeries['Name']; 
		    		$temp['tennis'][] = $tempEvent;	
		    	}
            }


		/*	$url = BR_SUPER_AMDIN_URL."getAllMatches";
		    $matchResult = $this->httpGet($url);
		    $data = json_decode($matchResult,true); */

		    /*foreach ($data as $rec){
		        if(in_array($rec->))
            }*/

        /*  $supperAdminMatchIds = $this->Modelmatchmst->getAcriveMatchIds();
            $supperAdminSeriesIds = $this->Modelmatchmst->getActiveSeriesIds();

            $temp =[];
            foreach ($data['cricket'] as $cricket){
                if(in_array($cricket['SeriesId'],$supperAdminSeriesIds)){
                    $cricket['active'] = in_array($cricket['eventId'],$supperAdminMatchIds) ? 1:0;
                    $temp['cricket'][] = $cricket;
                    $temppp[]=$cricket['eventId'];
                }

            }

            foreach ($data['soccer'] as $soccer){
                if(in_array($soccer['SeriesId'],$supperAdminSeriesIds)) {
                    $soccer['active'] = in_array($soccer['eventId'], $supperAdminMatchIds) ? 1 : 0;
                    $temp['soccer'][] = $soccer;
                }
            }
            foreach ($data['tennis'] as $tennis){
                if(in_array($tennis['SeriesId'],$supperAdminSeriesIds)) {
                    $tennis['active'] = in_array($tennis['eventId'], $supperAdminMatchIds) ? 1 : 0;
                    $temp['tennis'][] = $tennis;
                }
            } */

			$response["code"] = 0;
			$response["error"] = false;
			$response["message"] = "match listing";
			$response["data"] = $temp;
			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
		}

		/**
		 * [betfair_session get betfair session]
		 * @return [json] [response]
		 */
		function betfair_session($matchId=null,$sportsId=NULL){

			$this->load->model('Modelmatchmst');
			$matchData = $this->Modelmatchmst->findByMatchId($matchId);
			$seriesId = $matchData['seriesId'];
			
			$this->load->model('Modelmarket');

			$response = array();
			$checkActiveMarket = array();

			$marketIds = $this->Modelmarket->findAllMarketIdByMatch($matchId);
			$checkMarketArr = explode(',', $marketIds['marketId']);

			$betfairMarketUrl = BETFAIR_MARKET_URL.$matchId;
			$betfairMarkets = $this->httpGetArr($betfairMarketUrl);	

			$bookmakerMarketUrl = BETFAIR_BOOKMAKER_MARKET_URL.$matchId;
			$bookmakrerMarkets = $this->httpGetArr($bookmakerMarketUrl);	

			if(!empty($bookmakrerMarkets)){
				$betfairMarkets[] = $bookmakrerMarkets[0];				
			}
			
		//	$findMarkets = array('Tied Match','Completed Match','To Win the Toss');

			$betfairSession = array();
			foreach($betfairMarkets as $betfairMarket){

			//	if(in_array($betfairMarket['marketName'], $findMarkets)){

					if(in_array($betfairMarket['marketId'], $checkMarketArr)){
						$betfairSession[] = array('market_id'=>$betfairMarket['marketId'],'market_name'=>$betfairMarket['marketName'],'seriesId'=>$seriesId,'sportsId'=>$sportsId,'is_exists'=>1,'match_id'=>$matchId,'market_runner_json'=>'');
					}else{
						$betfairSession[] = array('market_id'=>$betfairMarket['marketId'],'market_name'=>$betfairMarket['marketName'],'series_id'=>$seriesId,'sports_id'=>$sportsId,'is_exists'=>0,'match_id'=>$matchId,'market_runner_json'=>'');
					}
			//	}

			}	

			if(empty($betfairSession)){
				$response["code"] = 1;
				$response["error"] = true;
				$response["message"] = 'Betfair Session has not been created for this match';
			}else{
				$response["code"] = 0;
				$response["error"] = false;
				$response["message"] = "Betfair Session listing";
				$response["data"] = $betfairSession;
			}

			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));

		}	


		/**
		 * [get_indian_session get indian session]
		 * @return [json] [response]
		 */
		function get_betfair_session($matchId=null,$sportsId=NULL){
			
			$this->load->model('Modelmarket');

			$response = array();
			$checkActiveMarket = array();

			$marketIds = $this->Modelmarket->findAllMarketIdByMatch($matchId);
			$checkMarketArr = explode(',', $marketIds['marketId']);

			if($sportsId==4){
				$matchData = $this->httpGetArr(BR_LIVE_CRICKET_SOCKET_URL);	
			}elseif($sportsId==2){
				$matchData = $this->httpGetArr(BETFAIR_SPORT_TENNIS);	
			}elseif($sportsId==1){
				$matchData = $this->httpGetArr(BETFAIR_SPORT_SOCCER);	
			}

		//	$this->pr($matchData);


			$betfairSession = array();

            if(!empty($matchData['result'])){
                foreach($matchData['result'] as $match){
                    /*	echo $match['id'];
                        echo var_dump(strpos($match['id'],'FY'));
                        echo '<BR>';
                        echo $matchId; */

                    if($match['groupById']==$matchId && $match['mtype']!='MATCH_ODDS' && empty(strpos($match['id'],'FY'))){

                        if(in_array($match['id'], $checkMarketArr)){
                            $betfairSession[] = array('market_id'=>$match['id'],'market_name'=>$match['name'],'seriesId'=>$match['competition']['id'],'sportsId'=>$match['eventTypeId'],'is_exists'=>1,'match_id'=>$matchId);
                        }else{
                            $betfairSession[] = array('market_id'=>$match['id'],'market_name'=>$match['name'],'series_id'=>$match['competition']['id'],'sports_id'=>$match['eventTypeId'],'is_exists'=>0,'match_id'=>$matchId);
                        }
                    }
                }
            }
				
			//	die;

			if(empty($betfairSession)){
				$response["code"] = 1;
				$response["error"] = true;
    			$response["message"] = 'Betfair Session has not been created for this match';
			}else{
				$response["code"] = 0;
				$response["error"] = false;
        		$response["message"] = "Session fancy listing";
				$response["data"] = $betfairSession;
			}

			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			
		}

		/**
		 * [save_betfair_market save betfair market]
		 * params : {"market_id":"1.150389463","market_name":"Tied Match","match_id":28982318,"sports_id":4,"series_id":9962116}
		 */
		function save_betfair_market(){

			$response = array();
			$this->verifyRequiredParams($_POST,array('market_id','market_name','match_id','sports_id','series_id'));	

			$data = array('marketId'=> $_POST['market_id'],'marketName'=> $_POST['market_name'],'MatchId'=> $_POST['match_id'],'SportsId'=> $_POST['sports_id'],'seriesId'=> $_POST['series_id'],'market_runner_json'=>$_POST['market_runner_json']);

			if($data['marketName']=='Bookmaker'){
				$marketUrl = BETFAIR_BOOKMAKER_SELECTION_URL.$_POST['market_id'];	
			}else{
				$marketUrl = BETFAIR_SELECTION_URL.$_POST['market_id'];	
			}

			$marketJson = $this->httpGet($marketUrl);
			$marketArr = json_decode($marketJson,true);
			

			if(!empty($marketArr[0])){
				$data['is_manual'] = 0;
				$runnerNames = array();
				$i = 1;
				foreach($marketArr[0]['runners'] as $runners){
					$runnerNames[$runners['selectionId']] = $runners['runnerName'];
					$keyRunnerName = 'runnerName'.$i;
					$keySelectionId = 'selectionId'.$i;
					$data[$keyRunnerName] = $runners['runnerName']; 
					$data[$keySelectionId] = $runners['selectionId'];
					$i++;
				}

			/*	$marketOddsUrl = BETFAIR_ODDS_URL.$_POST['market_id'];
				$marketOddsJson = $this->httpGet($marketOddsUrl);
				$marketOddArr = json_decode($marketOddsJson,true);

				if(!empty($marketOddArr[0]['runners'])){
					foreach($marketOddArr[0]['runners'] as $mArr){
						$data['selection_json'][] = array('selectionId'=>$mArr['selectionId'],'runnerName'=>$runnerNames[$mArr['selectionId']]);
						$temp = $mArr;
						$temp['name'] = $runnerNames[$mArr['selectionId']];
						$defaultRunners[] = $temp;
					} 
					$defaultRunnersJson = json_encode($defaultRunners);
					$data['market_runner_json'] = $defaultRunnersJson;
				}else{    */
					$defaultRunners = array();
					foreach($marketArr[0]['runners'] as $mArr){
						$temp = array();
						$temp['selectionId'] = (int)$mArr['selectionId'];
						$temp['handicap'] = 0;
						$temp['status'] = "ACTIVE";
						$temp['lastPriceTraded'] = 0;
						$temp['totalMatched'] = 0;
						$temp['ex']['availableToBack'] = array('0'=>array('price'=>'--','size'=>'--'),'1'=>array('price'=>'--','size'=>'--'),'2'=>array('price'=>'--','size'=>'--'));
						$temp['ex']['availableToLay'] = array('0'=>array('price'=>'--','size'=>'--'),'1'=>array('price'=>'--','size'=>'--'),'2'=>array('price'=>'--','size'=>'--'));
						$temp['ex']['tradedVolume'] = [];
						$temp['name'] = $mArr['runnerName'];
						$defaultRunners[] = $temp;
					} 
					$defaultRunnersJson = json_encode($defaultRunners);
					$data['market_runner_json'] = $defaultRunnersJson;
			//	}

			$this->load->model('Modeleventlst');
			$this->load->model('Modelmarket');

			$chkMarket = $this->Modeleventlst->chkMatchMarket($data['marketId']);
			
			if(empty($chkMarket)){

				$result = $this->Modelmarket->saveMarket($data);

				if (!empty($result)) {

					$response["code"] = 0;
					$response["error"] = false;
	    			$response["message"] = 'Betfair session saved successfully';
	    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
				}else{
					$response["code"] = 1;
					$response["error"] = true;
	        		$response["message"] = 'Error';
	        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
				}

			}else{
				$response["code"] = 1;
				$response["error"] = true;
	    		$response["message"] = 'Already exists';
	    		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}


			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Error';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}	

		}

		/**
		 * [save_betfair_session save betfair session]
		 * params : {"marketId":"1.147724608-3.FY","Name":"MATCH 1ST OVER RUN (BAN VS AFG)ADV","matchId":28891377,"sportsId":4,"seriesId":12039039}
		 */
		function save_betfair_session(){

			$this->verifyRequiredParams($_POST,array('market_id','market_name','match_id','sports_id','series_id'));	

			$data = array('marketId'=> $_POST['market_id'],'marketName'=> $_POST['market_name'],'MatchId'=> $_POST['match_id'],'SportsId'=> $_POST['sports_id'],'seriesId'=> $_POST['series_id']);

			$marketUrl = EXCH_ODDS_BY_MARKETS_URL.'?market_id='.$_POST['market_id'];
			$marketJson = $this->httpGet($marketUrl);
			$marketArr = json_decode($marketJson,true);

			foreach($marketArr as $mArr){
				if(!empty($mArr['runners'])){
					$marketId = $mArr['id'];
					$data['market_runner_json'] = json_encode($mArr['runners']);
					foreach($mArr['runners'] as $runner){
						$data['selection_json'][] = array('selectionId'=>$runner['id'],'runnerName'=>$runner['name']);
					}
				}
			}
			
			$this->load->model('Modeleventlst');
			$this->load->model('Modelmarket');

			$chkMarket = $this->Modeleventlst->chkMatchMarket($data['marketId']);

			if(empty($chkMarket)){

				$result = $this->Modelmarket->saveMarket($data);

				if (!empty($result)) {

					$response["code"] = 0;
					$response["error"] = false;
	    			$response["message"] = 'Betfair session saved successfully';
	    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
				}else{
					$response["code"] = 1;
					$response["error"] = true;
	        		$response["message"] = 'Error';
	        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
				}

			}else{
				$response["code"] = 1;
				$response["error"] = true;
	    		$response["message"] = 'Already exists';
	    		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}


		function save_global_bet_liablity(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_bet_liability'));	
			$updateData = array('max_bet_liability'=> $_POST['max_bet_liability']);
			
			$this->load->model('Modeltblconfig');
			$result = $this->Modeltblconfig->update($updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_global_market_liablity(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_market_liability'));	
			$updateData = array('max_market_liability'=> $_POST['max_market_liability']);
			
			$this->load->model('Modeltblconfig');
			$result = $this->Modeltblconfig->update($updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_global_market_profit(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_market_profit'));	
			$updateData = array('max_market_profit'=> $_POST['max_market_profit']);
			
			$this->load->model('Modeltblconfig');
			$result = $this->Modeltblconfig->update($updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_match_bet_liablity(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageMarketSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_bet_liability','MarketId'));	
			$updateData = array('max_bet_liability'=> $_POST['max_bet_liability']);
			
			$this->load->model('Modelmarket');
			$result = $this->Modelmarket->update($_POST['MarketId'],$updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_match_market_liablity(){

            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageMarketSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_market_liability','MarketId'));	
			$updateData = array('max_market_liability'=> $_POST['max_market_liability']);
			
			$this->load->model('Modelmarket');
			$result = $this->Modelmarket->update($_POST['MarketId'],$updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_match_market_profit(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageMarketSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_market_profit','MarketId'));	
			$updateData = array('max_market_profit'=> $_POST['max_market_profit']);
			
			$this->load->model('Modelmarket');
			$result = $this->Modelmarket->update($_POST['MarketId'],$updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}


		function save_global_session_bet_liablity(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_session_bet_liability'));	
			$updateData = array('max_session_bet_liability'=> $_POST['max_session_bet_liability']);
			
			$this->load->model('Modeltblconfig');
			$result = $this->Modeltblconfig->update($updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_global_session_liablity(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_session_liability'));	
			$updateData = array('max_session_liability'=> $_POST['max_session_liability']);
			
			$this->load->model('Modeltblconfig');
			$result = $this->Modeltblconfig->update($updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_session_bet_liablity(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('LimitFancy');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_session_bet_liability','ID'));	
			$updateData = array('max_session_bet_liability'=> $_POST['max_session_bet_liability']);
			
			$this->load->model('Modelmatchfancy');
			$result = $this->Modelmatchfancy->update($_POST['ID'],$updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_session_liablity(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('LimitFancy');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('max_session_liability','ID'));	
			$updateData = array('max_session_liability'=> $_POST['max_session_liability']);
			
			$this->load->model('Modelmatchfancy');
			$result = $this->Modelmatchfancy->update($_POST['ID'],$updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function save_global_terms_conditions(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('terms_conditions'));	
			$updateData = array('terms_conditions'=> $_POST['terms_conditions']);
			
			$this->load->model('Modeltblconfig');
			$result = $this->Modeltblconfig->update($updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}


		function save_apk_version(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('version_code','version_name'));	   
			$insertData = array('version_code'=> $_POST['version_code'],'version_name'=>$_POST['version_name']);
			
			$this->load->model('Modelapkversion');
			$result = $this->Modelapkversion->add($insertData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function update_apk_status(){
            $this->load->model('ModelUserRights');
            $userRole = $this->ModelUserRights->hasRole('ManageSetting');
            if($userRole['status']){
                return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
            }
			$this->verifyRequiredParams($_POST,array('status'));	
			$updateData = array('status'=> $_POST['status']);
			
			$this->load->model('Modelapkversion');
			$result = $this->Modelapkversion->update($updateData);

			if (!empty($result)) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Saved successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Not saved';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}

		}

		function reset_user_settlement($userId){
			$this->load->model('Modeltblchipdet');			
			$result = $this->Modeltblchipdet->resetUserSettlement($userId);
			if ($result) {
				$response["code"] = 0;
				$response["error"] = false;
    			$response["message"] = 'Settlement reset successfully';
    			$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}else{
				$response["code"] = 1;
				$response["error"] = true;
        		$response["message"] = 'Something went wrong';
        		$this->output->set_status_header(200)->set_content_type('application/json')->set_output(json_encode($response));
			}
		}

		

}
