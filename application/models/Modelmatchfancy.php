<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Modelmatchfancy extends CI_Model
{
	function __construct()
	{
		parent::__construct();
		$_POST = json_decode(file_get_contents('php://input'), true);
	}

	function activeSessionLst($matchId=0){
		$this->db->select('MatchID,MFancyID,active');
		$this->db->from('matchfancy');
		$this->db->where('MatchID',$matchId);	
		$this->db->where('Remarks','INDIAN_SESSION_FANCY');	
		$this->db->where('active',1);	
		$query = $this->db->get();
		return $query->result_array();	
	}


	function addedSession($matchId=0){
		$this->db->select('MatchID,MFancyID,active,ind_fancy_selection_id,result,super_admin_fancy_id');
		$this->db->from('matchfancy');
		$this->db->where('MatchID',$matchId);	
		$this->db->where('Remarks','INDIAN_SESSION_FANCY');	
		$query = $this->db->get();
		return $query->result_array();	
	}
	
	function checkSessionStatus($matchId=0,$selectionId=0){
		$this->db->select('active');
		$this->db->from('matchfancy');
		$this->db->where('MatchID',$matchId);	
		$this->db->where('ind_fancy_selection_id',$selectionId);	
		$query = $this->db->get();
		return $query->row_array();	
	}

	function sessionActive($matchId=0,$selectionId=0){
		$this->db->where('MatchID',$matchId);	
		$this->db->where('MFancyID',$selectionId);	
        $this->db->update('matchfancy', array('active'=>1));
        return true; 
	}

	function update($id,$updateArr=NULL){
		$this->db->where('ID',$id);
        $this->db->update('matchfancy', $updateArr);
        return true; 
	}

	function getFancyById($id=NULL){
		$this->db->select('matchfancy.ind_fancy_selection_id,market.Id MarketId,matchfancy.is_indian_fancy,matchfancy.fancy_mode,matchfancy.max_session_bet_liability,matchfancy.max_session_liability,YesValume,NoValume');
		$this->db->from('matchfancy');
		$this->db->join('market', 'market.Name = \'Match Odds\' AND market.matchId = matchfancy.MatchID', 'LEFT');
		$this->db->where('matchfancy.ID',$id);	
		$query = $this->db->get();
		return $query->row_array();	
	}

	function getUserFancyList($userId=NULL,$matchId=NULL,$matchFancyIds=NULL){

		if(empty($matchFancyIds)){
			$matchFancyIds[] = 19632569369;
		}

		$Modelcreatemaster = $this->model_load_model('Modelcreatemaster');
  		$userData = $Modelcreatemaster->userParent($userId);

  		$dealerId = $userData['dealer_id'];
  		$masterId = $userData['master_id'];


		$this->db->select("mf.*,IFNULL(mf.result,'') result,IFNULL(mf.upDwnBack,'') upDwnBack,IFNULL(mf.upDwnLay,'') upDwnLay,IFNULL(mf.upDwnLimit,'') upDwnLimit,IFNULL(mf.rateDiff,'') rateDiff,mf.MFancyID as FncyId ,case when (select COUNT(*) from tblrights where UserID = $userId and  FancyID =  mf.ID )>0 then 1 else 0 end IsPlay
 ,CASE WHEN (SELECT COUNT(*) FROM tblplay WHERE UserID = $userId AND MatchID =mf.MatchID AND FancyID = mf.ID AND isPlay = 1 )>0 THEN 1 ELSE 0 END IsPlayIcon,m.Id market_id");
		$this->db->from('matchfancy mf');
			$this->db->join('market m', 'm.Name = \'Match Odds\' AND m.matchId = mf.MatchID', 'LEFT');
		if($userData['usetype']!=0){
			$this->db->join('user_deactive_match_session ddms', "mf.ID = ddms.fancy_id AND ddms.user_id = $dealerId", 'LEFT');
			$this->db->join('user_deactive_match_session mdms', "mf.ID = mdms.fancy_id AND mdms.user_id = $masterId", 'LEFT');
			$this->db->where('ddms.id IS NULL');
			$this->db->where('mdms.id IS NULL');
		}

		$this->db->where('mf.active !=',2);	
		$this->db->where('mf.MatchID',$matchId);
		$this->db->where('mf.result is null');
	//	$this->db->where_in('fancy_mode = "M" OR ind_fancy_selection_id',$matchFancyIds);
		$this->db->order_by("mf.ind_fancy_selection_id DESC");
		$query = $this->db->get();


	//	print_r($this->db->last_query());    die;
		return $query->result_array();	
	}

}
