<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Modelchkuser extends CI_Model
{
	function __construct(){
        $_POST = json_decode(file_get_contents('php://input'), true);
	}
	function chkAuthName(){
        $password=$_POST['password1'];
        $userName=$_POST['username1'];
        $ipadress =$_SERVER['REMOTE_ADDR'];
        $device_info = !empty($_POST['device_info']) ? $_POST['device_info'] : '';
        $browser_info = !empty($_POST['browser_info']) ? $_POST['browser_info'] : '';
        
        $sessionId=session_id();
		$query =$this->db->query("call getLogin('$userName','$password','$ipadress','$sessionId')");
        $res = $query->result_array();
        $query->next_result();
        $query->free_result();
        $resultData=$res[0];
        //print_r($resultData);
        //die();
        if($res[0]['iType']==0){

            $session_data = array('type' => $res[0]['usetype'],'user_name' 	=> $res[0]['mstruserid'],'user_id' => $res[0]['mstrid'],'last_login_id' => $res[0]['LID'],'session_id' =>session_id(),'changePass'=>$res[0]['ChangePas'],'set_timeout'=>$res[0]['set_timeout'],'mstrpassword'=>$res[0]['mstrpassword'],'logendt'=>time()+CONFIG_LOGIN_TIME_OUT,'subAdmin'=>false);

            if(!empty($res[0]['LID'])){
            	$Modeluserlogged = $this->model_load_model('Modeluserlogged');
  			  	$Modeluserlogged->update($res[0]['LID'],array('device_info'=>$device_info,'browser_info'=>$browser_info));
            }
            
            $this->session->set_userdata($session_data);
            return $resultData;

        }else{
            return $resultData;
        }
	}

    function chkSubAuthName(){
        $password=$_POST['password1'];
        $userName=$_POST['username1'];
        $ipadress =$_SERVER['REMOTE_ADDR'];
        $device_info = !empty($_POST['device_info']) ? $_POST['device_info'] : '';
        $browser_info = !empty($_POST['browser_info']) ? $_POST['browser_info'] : '';

        $sessionId=session_id();
       // echo "call getLoginSubAdmin('$userName','$password','$ipadress','$sessionId')";die;
        $query =$this->db->query("call getLoginSubAdmin('$userName','$password','$ipadress','$sessionId')");

        $res = $query->result_array();

        $query->next_result();
        $query->free_result();
        $resultData=$res[0];
        //print_r($resultData);
        //die();
        if($res[0]['iType']==0){
            $this->model_load_model('Modelcreatemaster');
            $adminData = $this->Modelcreatemaster->getUserById(1);
            //echo "<pre>";print_r($adminData);die();
            $session_data = array('type' => $adminData->usetype,'user_name'=> $resultData['mstruserid'],'user_id' => $adminData->mstrid,'session_id' =>session_id(),'set_timeout'=>$adminData->set_timeout,'mstrpassword'=>$resultData['mstrpassword'],'logendt'=>time()+CONFIG_LOGIN_TIME_OUT,'subAdmin'=>true,'subAdminId'=>$resultData['mstrid']);
           // print_r($session_data);die;

            $this->session->set_userdata($session_data);
            return $resultData;

        }else{
            return $resultData;
        }
    }


	function logoutentry($userId=null){
		//print_r($_POST);die();
			if(!empty($userId)){
				$user_id = $userId; 
			}else{
				$user_id = $_POST['userId'];
			}
			$GetStatus=$this->getUserstatus($user_id);
			
			$this->db->trans_start();
		    $logoutdata = array('logendt' => date('Y-m-d H:i:s',now()),	'online'  => 0);
        	$this->db->where('logcode', $_POST['lastLogin']);
		    $this->db->where('session_id', $_POST['sessionId']);
		    $query=$this->db->update('userlogged', $logoutdata);
		    $this->db->trans_complete();
		    return $query;
	}
	function chkLoginStatus($userId){
		$this->db->select('mstrpassword,loginstatus,lgnusrCloseAc,mstrlock,active,usetype as user_type');
		$this->db->from('createmaster');
		$this->db->where('mstrid', $userId);
		$query = $this->db->get();
        return $query->result_array();
		
	}
	function getUserstatus($userId){
		$this->db->select('loginstatus');
		$this->db->from('createmaster');
		$this->db->where('mstrid', $userId);
		$query = $this->db->get();
	}
	
}
