<?php
defined('BASEPATH') OR exit('No direct script access allowed');
error_reporting("ERROR");
/**
* Check UserName and Password Of Login Page
*/
class Betentrymodel extends CI_Model
{
	function __construct()
	{
		$_POST = json_decode(file_get_contents('php://input'), true);
	}

	/**
	 * [validateSaveBet valdiate save bet]
	 * @return [array] [response array]
	 * Note: isback=0 When team is backed isback=1 When team is layed
	 */
	function validateSaveBet(){

		$result = array();
		$isback = $this->input->post('isback');
		$profitAndLoss = $this->input->post('p_l');
		$loginId = $this->input->post('loginId');
		$stake = $this->input->post('stake'); 
		$inplay = $this->input->post('inplay'); 
		if($stake < 0 || $stake == 0){
			$result = array('code' => 4 ,'error'=>true,'message' => 'Stack cannot be zero');
			return $result;	
		}

		$Modelcreatemaster = $this->model_load_model('Modelcreatemaster');
		$userData = $Modelcreatemaster->viewUserAcData($loginId);
	//	print_r($userData);

        if (empty($userData)) {
            $result = array('code' => 9 ,'error'=>true,'message' => 'Something went wrong');
			return $result;	
        } elseif (isset($userData[0]['lgnusrCloseAc']) && $userData[0]['lgnusrCloseAc'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Account is Closed...');
        	return $result;	
        } elseif (isset($userData[0]['mstrlock']) && $userData[0]['mstrlock'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Account is InActive...');
        	return $result;	
        } elseif (isset($userData[0]['lgnusrlckbtng']) && $userData[0]['lgnusrlckbtng'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Betting is Locked...');
        	return $result;	
        }elseif (isset($userData[0]['stakeLimit']) && $userData[0]['stakeLimit'] != 0 && ($userData[0]['stakeLimit'] < $stake)) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Stake Limit is Over...');
        	return $result;	
        }elseif (isset($userData[0]['GoingInplayStakeLimit']) && $userData[0]['GoingInplayStakeLimit'] != 0 && $inplay == false &&  ($userData[0]['GoingInplayStakeLimit'] < $stake)) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Going Inplay Stake Limit is Over...');
        	return $result;	
        }

        if(isset($userData[0]['lgnUserMaxProfit'])){
        	$lgnUserMaxProfit = $userData[0]['lgnUserMaxProfit'];
			if($isback == 0 && ($lgnUserMaxProfit > 0) && ($profitAndLoss > $lgnUserMaxProfit)){
				$result = array('code'=>5,'error' => true ,'message' => 'Your max profit is over');	
				return $result;	
			}
        }
    /*  echo $lgnUserMaxProfit;
        echo ' P_L '.$profitAndLoss;
        die; */

		if(isset($userData[0]['lgnUserMaxLoss'])){
			$lgnUserMaxLoss = $userData[0]['lgnUserMaxLoss'];
			if($isback == 1 && ($lgnUserMaxLoss > 0) && ($profitAndLoss > $lgnUserMaxLoss)){
				$result = array('code'=>6,'error' => true,'message' => 'Your max loss is over');
				return $result;	
			}
		}
		
		return $result;

	}	

	function validateSessionSaveBet($data){
		
	//	print_r($data);die;

		$result = array();
	
		$stake = $data['betValue']; 
		$loginId = $data['loginId'];
	
		if($stake < 0 || $stake == 0){
			$result = array('code' => 4 ,'error'=>true,'message' => 'Stack cannot be zero');
			return $result;	
		}

		$Modelcreatemaster = $this->model_load_model('Modelcreatemaster');
		$userData = $Modelcreatemaster->viewUserAcData($loginId);
	//	print_r($userData);

        if (empty($userData)) {
            $result = array('code' => 9 ,'error'=>true,'message' => 'Something went wrong');
			return $result;	
        } elseif (isset($userData[0]['lgnusrCloseAc']) && $userData[0]['lgnusrCloseAc'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Account is Closed...');
        	return $result;	
        } elseif (isset($userData[0]['mstrlock']) && $userData[0]['mstrlock'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Account is InActive...');
        	return $result;	
        } elseif (isset($userData[0]['lgnusrlckbtng']) && $userData[0]['lgnusrlckbtng'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Betting is Locked...');
        	return $result;	
        }elseif (isset($userData[0]['stakeLimit']) && $userData[0]['stakeLimit'] != 0 && ($userData[0]['stakeLimit'] < $stake)) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Stake Limit is Over...');
        	return $result;	
        }elseif (isset($userData[0]['GoingInplayStakeLimit']) && $userData[0]['GoingInplayStakeLimit'] != 0 && $inplay == false &&  ($userData[0]['GoingInplayStakeLimit'] < $stake)) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Going Inplay Stake Limit is Over...');
        	return $result;	
        }

    /*  if(isset($userData[0]['lgnUserMaxProfit'])){
        	$lgnUserMaxProfit = $userData[0]['lgnUserMaxProfit'];
			if($isback == 0 && ($lgnUserMaxProfit > 0) && ($profitAndLoss > $lgnUserMaxProfit)){
				$result = array('code'=>5,'error' => true ,'message' => 'Your max profit is over');	
				return $result;	
			}
        }

		if(isset($userData[0]['lgnUserMaxLoss'])){
			$lgnUserMaxLoss = $userData[0]['lgnUserMaxLoss'];
			if($isback == 1 && ($lgnUserMaxLoss > 0) && ($profitAndLoss > $lgnUserMaxLoss)){
				$result = array('code'=>6,'error' => true,'message' => 'Your max loss is over');
				return $result;	
			}
		}  */
		
		return $result;

	}	

	/**
	 * [mobileValidateSaveBet valdiate save bet]
	 * @return [array] [response array]
	 * Note: isback=0 When team is backed isback=1 When team is layed
	 */
	function mobileValidateSaveBet($data=NULL){

		$result = array();
		$isback = $data['isback'];
		$profitAndLoss = $data['p_l'];
		$loginId = $data['loginId'];
		$stake = $data['stake']; 
		$inplay = $data['inplay']; 
		if($stake < 0 || $stake == 0){
			$result = array('code' => 4 ,'error'=>true,'message' => 'Stack cannot be zero');
			return $result;	
		}

		$Modelcreatemaster = $this->model_load_model('Modelcreatemaster');
		$userData = $Modelcreatemaster->viewUserAcData($loginId);
	//	print_r($userData);

        if (empty($userData)) {
            $result = array('code' => 9 ,'error'=>true,'message' => 'Something went wrong');
			return $result;	
        } elseif (isset($userData[0]['lgnusrCloseAc']) && $userData[0]['lgnusrCloseAc'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Account is Closed...');
        	return $result;	
        } elseif (isset($userData[0]['mstrlock']) && $userData[0]['mstrlock'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Account is InActive...');
        	return $result;	
        } elseif (isset($userData[0]['lgnusrlckbtng']) && $userData[0]['lgnusrlckbtng'] == 0) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Betting is Locked...');
        	return $result;	
        }elseif (isset($userData[0]['stakeLimit']) && $userData[0]['stakeLimit'] != 0 && ($userData[0]['stakeLimit'] < $stake)) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Your Stake Limit is Over...');
        	return $result;	
        }elseif (isset($userData[0]['GoingInplayStakeLimit']) && $userData[0]['GoingInplayStakeLimit'] != 0 && $inplay == false &&  ($userData[0]['GoingInplayStakeLimit'] < $stake)) {
        	$result = array('code' => 9 ,'error'=>true,'message' => 'Going Inplay Stake Limit is Over...');
        	return $result;	
        }

        if(isset($userData[0]['lgnUserMaxProfit'])){
        	$lgnUserMaxProfit = $userData[0]['lgnUserMaxProfit'];
			if($isback == 1 && ($lgnUserMaxProfit > 0) && ($profitAndLoss > $lgnUserMaxProfit)){
				$result = array('code'=>5,'error' => true ,'message' => 'Your max profit is over');	
				return $result;	
			}
        }
    /*  echo $lgnUserMaxProfit;
        echo ' P_L '.$profitAndLoss;
        die; */

		if(isset($userData[0]['lgnUserMaxLoss'])){
			$lgnUserMaxLoss = $userData[0]['lgnUserMaxLoss'];
			if($isback == 0 && ($lgnUserMaxLoss > 0) && ($profitAndLoss > $lgnUserMaxLoss)){
				$result = array('code'=>6,'error' => true,'message' => 'Your max loss is over');
				return $result;	
			}
		}
		
		return $result;
	}	

	function mobileSave_bet($data){ 

		if ($data['UserTypeId']==3) {
			$GetpId=$this->Get_ParantId($data['loginId']);
			$ParantId=$GetpId[0]->parentId;
			$UserId= $data['loginId'];
		}
	/*	else{
			$ParantId=$this->input->post('ParantId');
			$UserId=$this->input->post('userId');
		} */

		if($data['isback'] == 1){
			$isBack = 0;
		}else{
			$isBack = 1;
		} 
		
	 	$insertbet = array(
			            'MstDate' 		=> date('Y-m-d H:i:s',now()),
			            'LogInId' 		=> $data['loginId'],
			            'UserId' 		=> $UserId,
			            'ParantId' 		=> $ParantId,
			            'MatchId' 		=> $data['matchId'],
			            'MarketId' 		=> $data['MarketId'],
			            'SelectionId' 	=> $data['selectionId'], 
						'Odds' 			=> $data['priceVal'],
						'P_L' 			=> $data['p_l'],
						'isBack' 		=> $isBack,
						'Stack'			=> $data['stake'],
						'IsMatched' 	=> $data['isMatched'],
						'selectionName' => $data['placeName'],
						'IP_ADDESSS' 	=> $_SERVER['REMOTE_ADDR'],
						'deviceInfo' 	=> $data['deviceInfo']
			        );
			$stake= $data['stake'];
			$inplay= $data['inplay'];
			if($inplay==true){
				$InplayVal=0; //Inplay
			}else{
				$InplayVal=1; //Going Inplay 
			}
		$stateMent='Chips Deducted From Betting >>'.$_POST['MatchName'];	
		$parameter=$data['loginId'].','.$UserId.','.$ParantId.','.$data['matchId'].','.$data['selectionId'].','.$data['stake'].',"'.$data['MarketId'].'","'.$data['placeName'].'","'.date('Y-m-d H:i:s',now()).'",'.$data['priceVal'].','.$data['p_l'].','.$isBack.','.$data['isMatched'].',"'.$stateMent.'","'.$data['deviceInfo'].'","'.$_SERVER['REMOTE_ADDR'].'",'.$InplayVal.','.$data['ApiVal'];
		//echo "call sp_PlaceBet($parameter)";
		/*START pROCEDURE CALL*/
			$query =$this->db->query("call sp_PlaceBet($parameter)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($query);
			//echo $this->db->queries[0];
			return $res;
			/*END OF PROCEDURE CALL*/
			//	return true;
	}

	function Save_bet(){ 
			if ($this->input->post('UserTypeId')==3) {
				$GetpId=$this->Get_ParantId($this->input->post('loginId'));
				$ParantId=$GetpId[0]->parentId;
				$UserId=$this->input->post('loginId');
			}else{
				$ParantId=$this->input->post('ParantId');
				$UserId=$this->input->post('userId');
			}
		 	$insertbet = array(
				            'MstDate' 		=> date('Y-m-d H:i:s',now()),
				            'LogInId' 		=> $this->input->post('loginId'),
				            'UserId' 		=> $UserId,
				            'ParantId' 		=> $ParantId,
				            'MatchId' 		=> $this->input->post('matchId'),
				            'MarketId' 		=> $this->input->post('MarketId'),
				            'SelectionId' 	=> $this->input->post('selectionId'), 
							'Odds' 			=> $this->input->post('priceVal'),
							'P_L' 			=> $this->input->post('p_l'),
							'isBack' 		=> $this->input->post('isback'),
							'Stack'			=> $this->input->post('stake'),
							'IsMatched' 	=> $this->input->post('isMatched'),
							'selectionName' => $this->input->post('placeName'),
							'IP_ADDESSS' 	=> $_SERVER['REMOTE_ADDR'],
							'deviceInfo' 	=> $this->input->post('deviceInfo')
				        );
		 			$stake= $this->input->post('stake');
		 			$inplay= $this->input->post('inplay');
		 			if($inplay==true){
		 				$InplayVal=0; //Inplay
		 			}else{
		 				$InplayVal=1; //Going Inplay 
		 			}
					$stateMent='Chips Deducted From Betting >>'.$_POST['MatchName'];	
					$parameter=$this->input->post('loginId').','.$UserId.','.$ParantId.','.$this->input->post('matchId').','.$this->input->post('selectionId').','.$this->input->post('stake').',"'.$this->input->post('MarketId').'","'.$this->input->post('placeName').'","'.date('Y-m-d H:i:s',now()).'",'.$this->input->post('priceVal').','.$this->input->post('p_l').','.$this->input->post('isback').','.$this->input->post('isMatched').',"'.$stateMent.'","'.$this->input->post('deviceInfo').'","'.$_SERVER['REMOTE_ADDR'].'",'.$InplayVal.','.$this->input->post('ApiVal');
					//echo "call sp_PlaceBet($parameter)";
					/*START pROCEDURE CALL*/
						$query =$this->db->query("call sp_PlaceBet($parameter)");
						$res = $query->result_array();
						$query->next_result();
						$query->free_result();
						//print_r($query);
						//echo $this->db->queries[0];
						return $res;
					/*END OF PROCEDURE CALL*/

					

					//Add Userworking sourabh 170117
		//$creFancyId=$this->db->insert_id();
		////start user working table save the data By Manish 170117
		//$wortype="OddEven fancy";
		//$remarks="Fancy Type>>".$_POST['fancyType'].">>Fancy Name >>".$_POST['HeadName'].">> Match ID >>".$_POST['mid'];
		//$userWrkingArray = array(
		//	'woruser'=> $_POST['HeadName'],
		//	'wormode'=> 0,
		//	'wordate'=> $_POST['date'],
		//	'wortype'=> $wortype,
		//	'worcode'=> $creFancyId,
		//	'worsysn'=> $_SERVER['REMOTE_ADDR'],
		//	'worrema'=> $remarks,
		//	'worcudt'=> date('Y-m-d H:i:s',now()),
		//);
		//$condition=$this->db->insert('userworkin', $userWrkingArray);
		////End of useworking table

					return true;
	}
	function sumOfOdds($MarketId,$userId,$userType,$matchId)//170201_1
	{
		if($userId==null)$userId1=0;else $userId1=$userId;
		
			//$query =$this->db->query("call SP_OddsProfitLoss($userId1,$MarketId)");//sourabh 11-dec-2016
			$query =$this->db->query("call SP_OddsProfitLossNew($userId1,$userType,$matchId,$MarketId)");//sourabh 170201_1
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function getBetEntry($marketId,$UserTypeId,$userId,$matchId)
	{
			
			if ($userId==null) {
				$userId1=$_POST['userId'];
			}
			else{
				$userId1=$userId;
			}
			$query =$this->db->query("call SP_GetBetting($userId1,$UserTypeId,$marketId,$matchId)");//170131
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
				
			return $res;
	}

	function mbdip_getBetEntry($userId,$matchId){
		$query =$this->db->query("call SP_GetBettingLatest($userId,$matchId)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}

	function updateUnMatchedData($userId,$BackLay){
			$dataArray = array('IsMatched' => 1);
    		$this->db->where('MstCode',$userId);
            $this->db->update('tblbets', $dataArray);
            //echo $this->db->queries[0];die();		
            return true; 
	}

	function UpdatepointVal($pointVal){
			$dataArray = array('value' => $pointVal);
    		$this->db->where('Id',1);
            $this->db->update('detect_amount', $dataArray);

            $modeltblconfig = $this->model_load_model('Modeltblconfig');		
			$modeltblconfig->update(array('match_detection_point'=>$pointVal));

            //echo $this->db->queries[0];die();		
            return true; 
	}
	function UpdateBetDelay($betdelay){
			$dataArray = array('set_timeout' => $betdelay);
    		$this->db->where('usetype',3);
            $this->db->update('createmaster', $dataArray);
            
            $modeltblconfig = $this->model_load_model('Modeltblconfig');		
			$modeltblconfig->update(array('bet_delay'=>$betdelay));

            //echo $this->db->queries[0];die();		
            return true; 
	}
	function PointValue($userId){
			/*$this->db->select("value");
			$this->db->from('detect_amount');
			$this->db->where('Id',1);
			$query = $this->db->get();
			return $query->result();*/
			$this->db->select("value");
			$this->db->from('detect_amount');
			$this->db->where('user_id',$userId);
			$query = $this->db->get();
			$rowcount = $query->num_rows();
			if($rowcount==0){
				return $query->result();
			}else{
				return $query->result();
			}
	}
	function GetMasterList(){
			$this->db->select("*");
			$this->db->from('createmaster');
			$this->db->where('usetype',1);
			$query = $this->db->get();
			return $query->result();
	}
	
	function GetDealer($masterId){
			$this->db->select("*");
			$this->db->from('createmaster');
			$this->db->where('parentId',$masterId);
			$query = $this->db->get();
			return $query->result();
	}

	function Get_ParantId($userId){
			$this->db->select("parentId");
			$this->db->from('createmaster');
			$this->db->where('mstrid',$userId);
			$query = $this->db->get();
			return $query->result();
	}
	function Chip_history($UserID,$TypeID,$matchId,$MarketId,$OppAcID){
	//sourabh 161222
			$query =$this->db->query("call getChipHistory($TypeID,$UserID,$matchId,$MarketId,$OppAcID)");//sourabh 161222
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;

	}
	function online_users($userId,$userType){
			$query =$this->db->query("call getLoginUser($userId,$userType)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
	}
	function Chip_summery($userId,$type){
			$query =$this->db->query("call sp_ChipSummary($userId,$type)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}
	function profit_loss($userId,$sportId){
			$query =$this->db->query("call sp_GetP_L($userId,$sportId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}
	function profit_loss1($userId,$sportId){
			$query =$this->db->query("call sp_getAllp_l($userId,$sportId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}

	function mbdip_profit_loss($data){
			$userId = $data['user_id'];
			$sportId = $data['sport_id'];
			$event_name = $data['event_name'];
			$from_date = $data['from_date'];
			$to_date = $data['to_date'];

			$page_limit = $data['page_limit'];
			$pageno = $data['page_no'];
			$page_max = $page_limit;
        	$start = ($pageno - 1) * $page_max; 

        	
        /*	print_r($data); 
        	die; */ 

        /*	echo "CALL `sp_getAllp_l_filters`($userId, $sportId, '$event_name', '$from_date', '$to_date' , $start , $page_limit)";
        	die;  */
			$query =$this->db->query("CALL `sp_getAllp_l_filters`($userId, $sportId, '$event_name', '$from_date', '$to_date' , $start , $page_limit)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}

	function myBetsFilters($data){
			$userId = $data['user_id'];
			$from_date = $data['from_date'];
			$to_date = $data['to_date'];

			$page_limit = $data['page_limit'];
			$pageno = $data['page_no'];
			$page_max = $page_limit;
        	$start = ($pageno - 1) * $page_max; 
        	
        /*	print_r($data); 
        	die; */ 

        /*	echo "CALL `sp_getAllp_l_filters`($userId, $sportId, '$event_name', '$from_date', '$to_date' , $start , $page_limit)";
        	die;  */
			$query =$this->db->query("CALL `GetBetHistoryFilterPaging`($userId, '$from_date', '$to_date' , $start , $page_limit)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}


	function mb_myBetsFilters($data){
			$userId = $data['user_id'];
			$from_date = $data['from_date'];
			$to_date = $data['to_date'];

			$page_limit = $data['page_limit'];
			$pageno = $data['page_no'];
			$page_max = $page_limit;
        	$start = ($pageno - 1) * $page_max; 
        	
        /*	print_r($data); 
        	die; */ 

        /*	echo "CALL `sp_getAllp_l_filters`($userId, $sportId, '$event_name', '$from_date', '$to_date' , $start , $page_limit)";
        	die;  */
			$query =$this->db->query("CALL `mb_GetBetHistoryFilterPaging`($userId, '$from_date', '$to_date' , $start , $page_limit)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			//print_r($res);
			//die();			
			return $res;
	}

	function matchOddsRes(){
			$this->db->select("res.selectionName,mtchmst.matchName,mrt.Name,res.id,res.selectionId,sprt.name");
			$this->db->from(' tblselectionname res');
			$this->db->join('matchmst mtchmst', 'mtchmst.MstCode=res.matchId', 'INNER');
			$this->db->join('market mrt', 'mrt.Id=res.marketId', 'INNER');
			$this->db->join('sportmst sprt', 'sprt.id=res.sportId', 'INNER');
			
			$query = $this->db->get();
			return $query->result();
	}
	function FancyRes(){
		
			$this->db->select("mf.HeadName,mf.MatchID,mf.TypeID,mtchmst.matchName");
			$this->db->from('matchfancy mf');
			$this->db->join('matchmst mtchmst', 'mtchmst.MstCode=mf.MatchID', 'INNER');
			
			$query = $this->db->get();
			return $query->result();
	}
	function ActiveMatchUsers($matchId){
			$this->db->select("DISTINCT(cm.mstruserid) as UserName,COUNT(cm.mstruserid) as cntBetting");
			$this->db->from('matchmst mmst');
			$this->db->join('tblbets bts', 'bts.MatchId=mmst.MstCode', 'INNER');
			$this->db->join('createmaster cm', 'cm.mstrid=bts.UserId', 'INNER');
			$this->db->where('bts.MatchId',$matchId);
			$this->db->group_by('cm.mstruserid'); 
			$query = $this->db->get();
			return $query->result();
	}
	function getActiveMatches(){
			$this->db->select("MstCode,matchName");
			$this->db->from('matchmst');
			$this->db->where('active',1);
			$query = $this->db->get();
			return $query->result();
	}
	function BetHistory($userId){
		if ($userId==null) {
			$userId1=$this->session->userdata('user_id');
		}else{
			$userId1=$userId;
		}

		$query =$this->db->query("call GetBetHistory($userId1)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		//print_r($res);
		//die();			
		return $res;
	}

	function BetHistoryFilter($userId,$fromDate,$toDate){
		if ($userId==null) {
			$userId1=$this->session->userdata('user_id');
		}else{
			$userId1=$userId;
		}

	//	echo "call GetBetHistoryFilter($userId1,$fromDate,$toDate)";

		$query =$this->db->query("call GetBetHistoryFilter($userId1,'$fromDate','$toDate')");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
	//	print_r($res);
	//	die();			
		return $res;
	}

	function BetHistoryPaging($userId,$search,$pageno,$limit){
		if ($userId==null) {
			$userId1=$this->session->userdata('user_id');
		}else{
			$userId1=$userId;
		}

		$page_max = $limit;
        $start = ($pageno - 1) * $page_max;
    //  $end = $pageno * $page_max;

        if(!empty($search)){
        	$query =$this->db->query("call GetBetHistoryPaging($userId1,$limit,$start,'$search')");	
        }else{
        	$query =$this->db->query("call GetBetHistoryPaging($userId1,$limit,$start,'')");	
        }
		

		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		//print_r($res);
		//die();			
		return $res;
	}

	function myBetsPaging($userId,$betType,$pageno,$limit){
		$page_max = $limit;
        $start = ($pageno - 1) * $page_max;
        $query =$this->db->query("call GetMyBetsPaging($userId,'$betType',$limit,$start,'')");	
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}

	function mobileMarketMatchedBets($userId,$matchId,$marketId){

	//	echo "$userId,$matchId,$marketId";die;

		$query =$this->db->query("call GetMatchedBet($userId,$matchId,$marketId)");	
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}

	function mobileSessionMatchedBets($userId,$fancyId){
		$query =$this->db->query("call GetSessionMatchedBet($userId,$fancyId)");	
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}

	function mobileMarketUnMatchedBets($userId,$matchId,$marketId){

		$query =$this->db->query("call GetUnMatchedBet($userId,$matchId,$marketId)");	
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}

	function mobileAllUnMatchedBets($userId){

		$query =$this->db->query("call GetALLUnMatchedBet($userId)");	
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}


	function LiablityHistory($userId){
		if ($userId==null) {
			$userId1=$this->session->userdata('user_id');
		}else{
			$userId1=$userId;
		}

		$query =$this->db->query("call GetLiablityHistory($userId1)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}
	function AcStatement($userId){
		if ($userId==null) {
			$userId1=$this->session->userdata('user_id');
		}else{
			$userId1=$userId;
		}
			$query =$this->db->query("call sp_acStatement($userId1)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
						
			return $res;
	}
	function SlmAcStatement($userId){
		if ($userId==null) {
			$userId1=$this->session->userdata('user_id');
		}else{
			$userId1=$userId;
		}
			$query =$this->db->query("call slm_acStatement($userId1)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
						
			return $res;
	}

	function mbdip_acStatement($userId,$pageno,$limit){
		$page_max = $limit;
        $start = ($pageno - 1) * $page_max;

//        $query  =  "SET @variable = 0;";
//        $this->db->query($query);
//		$query = $this->db->query("SELECT *,ROUND((@variable := @variable + `Chips`),2)  AS `Balance` from viewacstatement where user_id = $userId order by Sdate DESC LIMIT $start,$limit;");

		$query = $this->db->query("SELECT * from viewacstatement where user_id = $userId order by Sdate DESC LIMIT $start,$limit;");

/*	echo 	"SELECT *,ROUND((@variable := @variable + `Chips`),2)  AS `Balance` from viewacstatement where user_id = $userId order by Sdate DESC LIMIT $start,$limit;";
	die; */

		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}

	function adminLimit(){
			$this->db->select("*");
			$this->db->from('tblconfig');
			$query = $this->db->get();
			return $query->result();
	}
	function UpdateAdminLimit($id,$limit){
			$limitData = array('adminLImit'  => $limit);
        	$this->db->where('Id', 1);
		    $query=$this->db->update('tblconfig', $limitData);
		    return true;
	}
	function UpdateGngInPlayLimitLimit($limit){
			$limitData = array('InPlayStack'  => $limit);
        	$this->db->where('usetype', 3);
		    $query=$this->db->update('createmaster', $limitData);
			$modeltblconfig = $this->model_load_model('Modeltblconfig');		
			$modeltblconfig->update(array('going_in_play_limit'=>$limit));
		    return true;
	}
	function deleteGetbetting($betId,$userId){
		$query =$this->db->query("call SP_DelUnmatch($userId,$betId)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $res;
	}
	function deleteGetbettingmat($betId,$userId,$marketId){
		$query =$this->db->query("call SP_DelMatch($userId,$betId,$marketId)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		echo $query;
	}
	
	function NewChip_historyP($userId,$type){
		$query =$this->db->query("call sp_ChipSumm_P($userId,$type)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $query;
	}
	function NewChip_historyM($userId,$type){
		$query =$this->db->query("call sp_ChipSumm_M($userId,$type)");
		$res = $query->result_array();
		$query->next_result();
		$query->free_result();
		return $query;
	}
	function Chip_historyById($userId,$userType,$lgnType,$parentId,$FROMDate,$ToDate){
	
			$query =$this->db->query("call GetLedger($lgnType,$userId,$userType,$parentId,'$FROMDate','$ToDate')");//170201_3//getChipHistory
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function Chip_leger($userId,$userType,$selectType,$fromDate1,$ToDate1){
	   // echo $fromDate1;
       // echo $ToDate1;
	        if($fromDate1==null ||$ToDate1==null){
                //$fromDate2="''";
                //$ToDate2="''";
                //echo "true";
              //echo "call GetLedger($userType,$userId,$selectType,0,null,null)";
                $query =$this->db->query("call GetLedger($userType,$userId,$selectType,0,null,null)");//170201
            }else{
                $fromDate2="'".$fromDate1."'";
               // echo"||";
                $ToDate2="'".$ToDate1."'";
                //echo "False";
               // echo "call GetLedger($userType,$userId,$selectType,0,$fromDate2,$ToDate2)";
                $query =$this->db->query("call GetLedger($userType,$userId,$selectType,0,$fromDate2,$ToDate2)");//170201
            }

			//$query =$this->db->query("call GetLedger($userType,$userId,$selectType,0,$fromDate2,$ToDate2)");//170201
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
	}
	function GetPlusA_c($userId,$matchId,$MarketId,$fancyId){
	
			$query =$this->db->query("call sp_PL_ChipSumm_P($userId,$matchId,'$MarketId',$fancyId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function GetMinusA_c($userId,$matchId,$MarketId,$fancyId){
	
			$query =$this->db->query("call sp_PL_ChipSumm_M($userId,$matchId,'$MarketId',$fancyId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function BetHistoryPL($userId,$matchId,$MarketId,$fancyId){
	
			$query =$this->db->query("call GetBetHistory_PL($userId,$matchId,'$MarketId',$fancyId)");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;

	}
	function setHeaderMsg(){
			$message=$_POST['setMessage'];
			//echo "call SetMarquee('$message')";
			$query =$this->db->query("call SetMarquee('$message')");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
	}
	function DisplayMsgOnHeader(){			
			$query =$this->db->query("call GetMarquee()");
			$res = $query->result_array();
			$query->next_result();
			$query->free_result();
			return $res;
	}

	function updateBalByMatchSession($matchId,$fancyId){
			$cmModel = $this->model_load_model('Modelcreatemaster');	
			$this->db->select('sbet.userId user_id,sbet.parantId dealer_id,dealer.parentId master_id');
			$this->db->from('bet_entry sbet');
			$this->db->join('createmaster dealer', 'sbet.parantId = dealer.mstrid', 'LEFT');
			$this->db->where('matchId',$matchId);
			$this->db->where('fancyId',$fancyId);
			$this->db->group_by('sbet.userId');
			$query = $this->db->get();
			$users = $query->result_array();

			$userIds = array();
			foreach($users as $user){
				$userIds[] = $user['user_id'];
				$userIds[] = $user['dealer_id'];
				$userIds[] = $user['master_id'];
			}
			$uIds = array_unique($userIds);
			foreach($uIds as $uid){
				$cmModel->updateUserBalLiablity($uid);
			}
	}
}