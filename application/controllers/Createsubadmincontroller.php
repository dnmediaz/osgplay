<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CreateSubAdmincontroller extends CI_Controller {
    function __construct() {
        parent::__construct();
        $this->load->model('Modelsubadmin');
        $_POST = json_decode(file_get_contents('php://input'), true);
        if ($this->session->userdata('user_id') != '') { } else { redirect(base_url());}
    }
    function index(){
        $data['id']=$this->Modelsubadmin->getFormData();

        $this->output->set_content_type('application/json')->set_output(json_encode($data));

    }

    function changekPassword(){

        $condition=$this->Modelsubadmin->changePassword();

        if ($condition) {
            echo json_encode(array('error' => 0 ,'message' => 'Password Change Successfully....'));
        }else{
            echo json_encode(array('error' => 1 ,'message' => 'Password Not match ....'));
        }
    }

    function CheckUserName($user){
        $check=$this->Modelsubadmin->chkUsernameForSave($user);
        if ($check==0) {
            echo json_encode(array('error' => 0 ,'message' => 'Username available...'));
        }else{
            echo json_encode(array('error' => 1 ,'message' => 'Username Already Exits...'));
        }
    }

    function SaveSubAdmin(){
        $this->load->model('ModelUserRights');
        $userRole = $this->ModelUserRights->hasRole('AddSubAdmin');
        if($userRole['status']){
            return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
        }
        $query=$this->Modelsubadmin->SaveSubAdmin();
        if ($query==1) {

            $data=array('error' => 0 ,'message' => 'Subadmin Register Successfully...');

        }elseif ($query==3){
            $data=array('error' => 1 ,'message' => 'Username Already Exit...');
        }
        else{

            $data=array('error' => 1 ,'message' => 'Subadmin Not Register...');
        }

        $data['subadmin']=$this->Modelsubadmin->getSubadmin();
        $this->output->set_content_type('application/json')->set_output(json_encode($data));
    }
    function getSubadmin(){

        $this->load->model('ModelUserRights');
        $userRole = $this->ModelUserRights->hasRole('ViewSubAdmin');
        if($userRole['status']){
            return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
        }
        $query=$this->Modelsubadmin->getSubadmin();
        $data=array('error' => 0 ,'message' => 'sub admin listing','data'=>$query);

        $this->output->set_content_type('application/json')->set_output(json_encode($data));

    }
    function closeUserAccount(){
        $this->load->model('ModelUserRights');
        $userRole = $this->ModelUserRights->hasRole('manageSubAdmin');
        if($userRole['status']){
            return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
        }
        $query=$this->Modelsubadmin->closeUserAccount();
        if ($query) {
            $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 0 ,'message' => 'Records Updated Successfully...')));
        }else{
            $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => 'Records Updated Successfully...')));
        }

    }
    function updateAccount(){
        $this->load->model('ModelUserRights');
        $userRole = $this->ModelUserRights->hasRole('manageSubAdmin');
        if($userRole['status']){
            return $this->output->set_content_type('application/json')->set_output( json_encode(array('error' => 1 ,'message' => $userRole['message'])));
        }
        $query=$this->Modelsubadmin->updateAccount();
        if ($query==1) {
            echo json_encode(array('error' => 0 ,'message' => 'Records Updated Successfully...'));
        }elseif ($query==3){
            echo json_encode(array('error' => 1 ,'message' => 'Username Already Exit...'));
        }else{
            echo json_encode(array('error' => 1 ,'message' => 'Records Updated Successfully...'));
        }
    }
    function changePassword(){
        /*$_POST = json_decode(file_get_contents('php://input'), true);*/
        if ($_POST['newpassword']==$_POST['Renewpassword']) {
            $query=$this->Modelsubadmin->changePassword();
            //print_r($query);die();
            if ($query) {
                $passwordData = array('mstrpassword' => sha1($_POST['newpassword']));
                $this->session->set_userdata('mstrpassword', $passwordData['mstrpassword']);
                echo json_encode(array('error' => 0 ,'message' => 'Password Change Successfully...','data'=>$passwordData));
            }else{
                echo json_encode(array('error' => 1 ,'message' => 'Invalid Password ...'));
            }

        }else{
            echo json_encode(array('error' => 1 ,'message' => 'New Password and Retype Password not Match...'));
        }


    }


    function get_Master_AltSubAdmin($userType,$adminId){
        $data['userList']=$this->Modelsubadmin->get_Master_AltSubAdmin($userType,$adminId);
        $data['menuList']=$this->Modelsubadmin->get_Helper_MenuList($adminId);
        $this->output->set_content_type('application/json')->set_output(json_encode($data));
    }
    function get_HelperRights($adminId){
        $data['menuList']=$this->Modelsubadmin->get_Helper_MenuList($adminId);
        $this->output->set_content_type('application/json')->set_output(json_encode($data));
    }
}