<div class="col-sm-12 col-md-4">
<div class="load-box ng-hide" ng-show="loading">
            <img id="mySpinner" src="app/images/loading1.gif">
        </div>
        
        
        
        
         <div class="newbal2"><h4>Balance</h4> {{$root.Balance}}</div>
        
        <div class="betstoshow"  onclick="removefullscreen()"  ng-click="$root.betslipshow=true;">
        <span>Betslip</span>
        </div>
 
 <div id="betslips" ng-show="$root.betslipshow==true">
 <div class="actionbox">
 
   <i  onclick="hidebetslips()" id="inlarge" class="fa fa-arrows-alt"></i> 
 <i id="closedthis" onclick="removefullscreen()" ng-click="$root.betslipshow=false;clearAll()" class="fa fa-times"></i>
 
 
 
 
 </div>  

 
 <div class="oneclickbet">
<!--       <div class="mobileview banking">  <a onclick="myfunNew()" id="showonclick" > <span class="betshowbtn">Betslip</span> <span class="closebtn">Close</span>   </a>  </div>-->
      
      <div class="switch_box">
		  
		  <label class="switch">
			  <input type="checkbox" class="switch-input" ng-model="IsToggle" ng-click="getStakesett(1)"  id="formButton1">
			  <span class="switch-label" data-on="On" data-off="Off"></span>
			  <span class="switch-handle"></span> 
		  </label>
		  <small class='clickbet'> 1 Click Betting </small>
           <a class="editstake" href="javascript:void(0)" title="Edit Stakes" data-toggle="modal" data-target="#edit_popup" ng-click="CallOnclickSetting()">Edit Stakes</a>
		  
      <form id="form1" name="form1" ng-init="isEdit=true">
       <div class="iner_form">
       <ul>
       <li ng-show="!isEdit" ng-repeat="stack in one_click_stack track by $index" class="form_text">
 <input type="text"   class="form-control"  oninput="this.value = this.value.replace(/[^0-9]/g, '');" placeholder="" 
ng-model="one_click_stack[$index]" required></li>

<li ng-show="isEdit" ng-repeat="stack in one_click_stack track by $index" class="form_text">
 <button type="button" ng-class="{btn_active:$index==btnActive}" ng-click="setOneClickBetStake(stack,$index)" class="btn btn_default">{{one_click_stack[$index]}}</button></li>

       <li class="form_text" ng-show="isEdit" ng-click="isEdit=false"><div class="form_button">	      <a href="javascript:void(0)">Edit</a>	    </div></li>
      <li class="form_text" ng-show="!isEdit"><div class="form_button"><a class="savebtn" ng-style="{'pointer-evenet:none':form1.$invalid==true}" ng-click="SaveOneClick()" href="javascript:void(0)">Save</a>	    </div>
	<div class="form_button">	      <a ng-click="isEdit=true;CallOnclickSetting()" href="javascript:void(0)">Cancel</a>	    </div>
      </li>

       </ul>
      
      </div>
      
  </form> 
      </div>
 
 </div>
  <div class="Liabilitynew">Liability: {{$root.total_liability}}</div>
 
 
<!-- ng-show="betslipinfo == true"-->
 <div class="smg_texfill" ng-repeat="back in BackLayArray" >
  <div class="sigma_olomouc">
 <span class="error" ng-if="back.IsErrorShow">{{back.Message}}</span><br ng-if="back.IsErrorShow">
 <span class="success" ng-if="!back.IsErrorShow">{{back.Message}}</span><br ng-if="!back.IsErrorShow">
<?php /*?>  <label ng-if="back.isback==0">Back</label>
 <label ng-if="back.isback==1" class="before_lay">Lay</label><?php */?>
  <a href="#">{{back.MatchName}}</a>
  </div>
  <div class="bet_back" ng-class="{'bet_lay':back.isback==1}">
  <span class="selection_name">{{back.placeName}} </span>
  <div class="bet_fields clearfix">
  
  <ul class="odds_tex">
  <li>
    <div class="form-group">
      <label ng-show="back.is_session_fancy=='N'">Odds</label>
      <label ng-show="back.is_session_fancy!='N'">{{back.isback==1 ? 'No':'Yes'}}</label>
      
      <div class="newbuttons">
      <a ng-if="back.SportId!=111" class="minushbtn btn" ng-click="Increment(back,'-')" href="javascript:void(0)"> - </a>
      <input type="number" ng-change="updateLiability(back)" ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/" min="0" step="0.01" ng-model="back.priceVal" class="form-control numclass" ng-disabled="back.is_session_fancy!='N'">
       <a ng-if="back.SportId!=111" href="javascript:void(0)" ng-click="Increment(back,'+')" class="plushbtn btn"> + </a>
<span class="error" ng-show="back.isMaxOdds">Max odds is {{config_max_odd_limit}}.</span>
    </div>
    </div>
  </li>
  <li>
    <div class="form-group" ng-init="back.stake=0">
      <label>Stake</label>
      <input type="number" min="0" class="form-control numclass" ng-change="updateLiability(back)"   placeholder="0" ng-focus="setbtn($index)" ng-model="back.stake" ng-blur="setstacksetng($index)">
      <span class="error" ng-show="back.isError">Please Enter stack.</span>
    </div>
  </li>
  <li class="lastprofit">
    <div class="form-group" ng-show="back.is_session_fancy=='N'">
      <label ng-show="(back.isback==0) ">Profit </label>
      <label ng-show="(back.isback==1)">Liability</label>

	<input type="hidden" ng-init="back.p_l=((back.priceVal*back.stake)-back.stake)" ng-model="back.p_l">
      <span ng-if="back.isManual" ng-init="back.p_l=((back.priceVal*back.stake)-back.stake)">{{((back.priceVal+1)*back.stake)-back.stake | number:2}}</span>
      <span ng-if="!back.isManual" ng-init="back.p_l=((back.priceVal*back.stake)-back.stake)">{{(back.priceVal*back.stake)-back.stake | number:2}}</span>
    </div>
  </li>
     <i ng-click="RemoveBackLay(back.unique_id,back.isback,((back.priceVal*back.stake)-back.stake),back.stake,back.isback,back)" class="fa fa-window-close"></i>
  </ul>

  <div class="first_row"  ng-if="setRef==$index">
  <ul>
  <li ng-repeat="betbutton in $root.MatchStack | limitTo :5 track by $index">
 <button  type="button" ng-click="back.isError=false;addStake(((back.priceVal*back.stake)-back.stake),betbutton,back.isback,back)" class="btn num-btns">{{betbutton}}</button></li>
<li><button type="button" ng-click="back.stake=0;back.p_l=0;updateLiability(back)"> Clear</button></li>
  </ul>
  </div>
  </div>
  </div>

  </div>
<!--  ng-show="BackLayArray.length>0 && betslipinfo == true" -->
  
  <div class="liability" ng-if="BackLayArray.length>0">
 
  
  <div class="remove_all text-right">
  <ul>
  <li><span>
  <input type="checkbox" ng-click="update_confirmation_setting(ischeckconfirmval)" ng-model="ischeckconfirmval" ng-checked="$root.ischeckconfirm == 'Y'?true:false" id="test2" >
  <label for="test2">Confirm bets before placing </label>
  </span></li>
  <li><a href="javascript:void(0)" ng-click="layArray=[];backArray=[];BackLayArray=[];$root.total_liability=0;clearAll();">Remove All</a></li>
  <li><a href="javascript:void(0)" ng-class="{'clsActive':isActive}" ng-click="Place_bet()">Place bets</a></li>
  </ul>
  </div>
  
  
  
  </div>
  
  
  
 
 </div>
 
 
 
 
 <div id="allbets" ng-if="$root.isAllbetsShow">
 <div class="tab-pane tab_bg" id="2a">
<div class="showallbets" ng-init="IsShowBetInfo=true"> <input checked="checked" name="checkbox-group" ng-model="IsShowBetInfo" id="test1" type="checkbox">
  <label for="test1">Show bet Info</label></div>
  
  <!--ng-if="isconfirmbet=='Y'"-->
  <div class="show_betinfo">
              <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                  <div class="panel panel-default" ng-if="isconfirmbet=='Y'">
                      <div class="panel-heading" role="tab" id="headingOne">
                          <h4 class="panel-title">
                              <a role="button" data-toggle="collapse" data-parent="#accordion" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                               Unmatched Bets ({{(UserData | filter : {"IsMatched":"0"}).length}})
                              </a>
                          </h4>
                        
                      </div>
                      <div id="collapseOne" class="panel-collapse" role="tabpanel" aria-labelledby="headingOne">
                          <div class="panel-body">
            <div class="fancy-collapse-panel">
                    <div class="panel panel-default match">
                          <div class="panel-heading" role="tab" id="headingOne">
                            <h3 class="panel-title">UnMatched Bets ({{(UserData | filter : {"IsMatched":"0"}).length}})</h3>
                        </div>
                        <div class="panel-body unmatchedScrollTable" ng-show="IsShowBetInfo" ng-if='(UserData | filter : {"IsMatched":"0"}).length>0'>
                            <table class="table betslip-table">

                                <tbody>
                                	<thead>
                                                                                                            <tr>
                                                                        					  <th></th>
                                                                                                                <th>Runner</th>
                                                                                                                <th ng-if="USERTYPE==0">Master</th>
                                                                                                                <th ng-if="USERTYPE==0 || USERTYPE==1">Dealer</th>
                                                                                                                <th ng-if="USERTYPE==0 || USERTYPE==1 ||USERTYPE==2">Client</th>
                                                                                                                <th>odds </th>
                                                                                                                <th>stack</th>
                                                                                                                <th>P&l</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                    <tr ng-repeat='unMatchedData in (UserData | filter : {"IsMatched":"0"})' ng-class="{'bet_lay': unMatchedData.isBack == 1 , 'bet_back': unMatchedData.isBack == 0}">

                    					<td><span class="fa fa-trash" ng-click="deleteUser(unMatchedData.MstCode,unMatchedData.UserId)"></span></td>
                    					 <td>{{unMatchedData.selectionName}} <br>{{unMatchedData.MstDate}}
                                                                                                                          </td>
                                                                                <td ng-if="USERTYPE==0">{{unMatchedData.MasterName}}</td>
                                                                                <td ng-if="USERTYPE==0 || USERTYPE==1">{{unMatchedData.ParantName}}</td>
                                                                                <td ng-if="USERTYPE==0 || USERTYPE==1 ||USERTYPE==2">{{unMatchedData.userName}}</td>
                                                                                <td>{{unMatchedData.Odds}}</td>
                                                                                <td>{{unMatchedData.Stack}}</td>
                                                                                <td>{{unMatchedData.P_L}}</td>
                    					</tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                             
                          </div>
                      </div>
                  </div>
                  <div class="panel panel-default">
                      <div class="panel-heading" role="tab" id="headingTwo">
                          <h4 class="panel-title">
                              <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                  Matched Bets ({{(UserData | filter : {"IsMatched":"1"}).length}})
                              </a>
                          </h4>
                           <!-- <input checked="checked" name="checkbox-group" ng-model="IsShowBetInfo" id="test1" type="checkbox">
  							<label for="test1">Show bet Info</label>-->
                           
                      </div>
                      <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                          <div class="panel-body">
                            <div class="fancy-collapse-panel">
                    <div class="panel panel-default match">
                         <div class="panel-heading" role="tab" id="headingOne">
                            <h3 class="panel-title">Matched Bets ({{(UserData | filter : {"IsMatched":"1"}).length}})</h3>
                        </div>
                        <div class="panel-body unmatchedScrollTable"  ng-show="IsShowBetInfo" ng-if='(UserData | filter : {"IsMatched":"1"}).length>0'>
                            <table class="table betslip-table">

                                <tbody>
                                          <thead>
                                                                                                                                                       <tr>
                                                                                                                                                           <th>Runner</th>
                                                                                                                                                           <th ng-if="USERTYPE==0">Master</th>
                                                                                                                                                           <th ng-if="USERTYPE==0 || USERTYPE==1">Dealer</th>
                                                                                                                                                           <th ng-if="USERTYPE==0 || USERTYPE==1 ||USERTYPE==2">Client</th>
                                                                                                                                                           <th>odds </th>
                                                                                                                                                           <th>stack</th>
                                                                                                                                                           <th>P&l</th>
                                                                                                                                                       </tr>
                                                                                                                                                   </thead>
                                    <tr ng-repeat='unMatchedData in (UserData | filter : {"IsMatched":"1"})' ng-class="{'bet_lay': unMatchedData.isBack == 1 , 'bet_back': unMatchedData.isBack == 0}">

                                                                                                                        <td>{{unMatchedData.selectionName}} <br>{{unMatchedData.MstDate}}</td>
                                                        <td ng-if="USERTYPE==0">{{unMatchedData.MasterName}}</td>
                                              <td ng-if="USERTYPE==0 || USERTYPE==1">{{unMatchedData.ParantName}}</td>
                                                  <td ng-if="USERTYPE==0 || USERTYPE==1 ||USERTYPE==2">{{unMatchedData.userName}}</td>
                                                                                                                         <td>{{unMatchedData.Odds}}</td>
                                                                                                                         <td>{{unMatchedData.Stack}}</td>
                                                                                                                         <td>{{unMatchedData.P_L}}</td>
                                                </tr>
                                          <tr>

                                                                                                                            </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
              </div>
                      </div>
                  </div>
              </div>
  </div>
  
 
  
  
  </div>
 
 </div>
 
 
 
 
 
 
 
 
 
 
 
 
 
        <div class="account_overview"> 
     <!--   <div class="livetv_heading collapsed" data-toggle="collapse" data-target="#livetv" aria-expanded="true">Live TV</div>-->
         
        <div class="livetv collapse" id="livetv">      
        
           <div class="livevideo">
              <video  ng-if="false" width="320" height="240" autoplay controls src="http://109.237.26.156:8021/1">

                       </video>
          <div ng-if="$root.IsShowTv=='Y'">


                         <input type="radio" name="TV" onclick="ChangeFrame(1)" />TV1
                         <input type="radio" name="TV" onclick="ChangeFrame(2)" />TV2
                         <input type="radio" name="TV" onclick="ChangeFrame(3)" />TV3
                         <input type="radio" name="TV" onclick="ChangeFrame(4)" />TV4
                         <a style="cursor:pointer;color:red;font-size:20px;" onclick="ChangeFrame(0)">X</a>
                     </div>
                     <div ng-if="$root.IsShowTv=='Y'" id="dvPlayer">
                     </div>
        
        </div>
        
        </div>
        
        
       
      
      
      
      <div class="showpoupbox">
      

      
      
      
       <div class="mobilebox">
      
      <div class="betsilip_sec">
     
      <div id="exTab1">	
 
        
        
        <div class="edit_stakes">
  <div class="modal" tabindex="-1" role="dialog" id="edit_popup">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header"></div>
        <div class="modal-body">
	<form name="stakesettForm">
        <div class="row">
       <div class="col-sm-4" ng-repeat="stakeval in stakesettingData | limitTo :5 track by $index">
        <input type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '');"  class="form-control" placeholder="" ng-model="stakesettingData[$index]" required>
       </div>
    
      </div>
</form>
        </div>
        <div class="modal-footer text-center">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" ng-disabled="stakesettForm.$invalid" ng-click="saveMatchoddstake()">Save</button>
        </div>
      </div>
    </div>
  </div>
   </div>
   
                                                    
                                                        
  
	<!--<div class="tab_bg">	  
<p ng-show="BackLayArray.length == 0 && betslipinfo == true" style="    margin: 5px;
">Click on the odds to add selections to the betslip.

</p>
 </div>-->	  
  
  <div ng-if="false" class="smg_texfill" ng-repeat="lay in layArray" >
  <div class="sigma_olomouc">
  <label class="before_lay">Lay</label>
  <a href="#"> {{lay.MatchName}}</a>
  </div>
  <div class="bet_back bet_lay">
  <span class="selection_name">{{lay.placeName}} </span>
  <div class="bet_fields clearfix">
  
  <ul class="odds_tex">
  <li>
    <div class="form-group">
      <label>Odds</label>
      <input type="number" ng-model="lay.priceVal" class="form-control" value="0">
    </div>
  </li>
  <li>
    <div class="form-group" ng-init="lay.stake=0">
      <label>Stake{{((lay.priceVal*lay.stake)-lay.stake)}}</label>
      <input type="number" ng-change="updateLiability(lay.stake)"  ng-model="lay.stake" placeholder="0" class="form-control">
      <span ng-show="lay.isError">Please Enter stack.</span>
    </div>
  </li>
  <li>
    <div class="form-group">
      <label>Liability</label>
	<input type="hidden" ng-init="lay.p_l=((lay.priceVal*lay.stake)-lay.stake)" ng-model="lay.p_l">
       <span ng-init="lay.p_l=((lay.priceVal*lay.stake)-lay.stake)">{{(lay.priceVal*lay.stake)-lay.stake | number:2}}</span>
    </div>
  </li>
     <i ng-click="RemoveBackLay(lay.unique_id,lay.isback)" class="fa fa-window-close"></i>
  </ul>
  
  <div class="first_row" ng-if="$index==0">
  <ul>
  <li ng-repeat="betbutton in $root.MatchStack track by $index">
 <button  type="button" ng-click="lay.stake=betbutton;addStake(lay.p_l)" class="btn num-btns">{{betbutton}}</button></li>
 <li><button type="button" ng-click="lay.stake=0"> Clear</button></li>
  </ul>
  </div>
  </div>
  </div>
  </div>
  
  
  
  
  </div>
	  
  
  </div>
  
	  	</div>
	  </div>
  
    </div>
 
          
    
      </div>
