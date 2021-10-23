<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Modeltblresult extends CI_Model
{
	function __construct()
	{
		parent::__construct();
		$_POST = json_decode(file_get_contents('php://input'), true);
	}

	function findById($id=NULL){
		$this->db->select('*');
		$this->db->from('tblresult');
		$this->db->where('tblresult.resId',$id);
		$this->db->limit(1);  
		$query = $this->db->get();
		return $query->row_array();	
	}

	function validateDeclareResult($sportid=NULL,$matchid=NULL,$marketid=NULL){
		$result = array();
		$this->db->select('*');
		$this->db->from('tblresult');
		$this->db->where('tblresult.sportId',$sportid);
		$this->db->where('tblresult.matchId',$matchid);
		$this->db->where('tblresult.marketId',$marketid);
		$this->db->limit(1);  
		$query = $this->db->get();
		$userData = $query->row_array();	

	
        if (!empty($userData)) {
            $result = array('code' => 1 ,'error'=>true,'message' => 'Already Saved ...');
			return $result;	
        }
		return $result;
	}

}