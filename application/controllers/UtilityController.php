<?php

defined('BASEPATH') OR exit('No direct script access allowed');

	class UtilityController extends CI_Controller {

		function __construct() {

			parent::__construct();

			$this->load->model('Modelmatchmst');


		}
        function deleteUnMatchBetData(){
            $this->load->model("Betentrymodel");
            $data = $this->Betentrymodel->deleteUnMatchBetData();
        }

		function updateMatchmst1(){
            $this->load->model('Modeleventlst');
            $series = $this->Modeleventlst->GetApiSeriesFrmDatabase();
            $matchIds = [];

            try {
                foreach ($series as $serie){
                   // echo BR_SUPER_AMDIN_URL."getMatches/".$serie['seriesId'];
                    $matches = json_decode($this->httpGet(BR_SUPER_AMDIN_URL."getMatches/".$serie['seriesId']), true);

                  // echo "<pre>"; print_r($matches);

                    foreach ($matches as $matche) {
                       /* $data = array('MstDate' =>  date("Y-m-d\TH:i:s.000\Z",($result['start']/1000) ));*/
                        $matchIds[]=$matche['eventId'];
                        $data = array('MstDate' => $matche['eventDate']);
                        $this->db->where('MstCode', $matche['eventId']);
                        $this->db->update('matchmst', $data);

                    }
                }
                /*$data = array('active' => 0);
                $this->db->where_not_in('MstCode', $matchIds);
                $this->db->update('matchmst', $data);*/
                //echo "successfully updated";
            } catch (Exception $e) {

                echo $e->getMessage();
            }

        }


	}