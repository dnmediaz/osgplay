app.controller('Matchoddscntr', ['$scope', '$http', '$stateParams', 'sessionService', '$timeout', 'Dialog', '$rootScope', 'deviceDetector', 'get_userser', '$mdDialog', 'speech', '$filter', '$location', '$state', '$interval','$window','Base64', function($scope, $http, $stateParams, sessionService, $timeout, Dialog, $rootScope, deviceDetector, get_userser, $mdDialog, speech, $filter, $location, $state, $interval,$window,Base64) {
    $scope.$on('test_dir', function(event, data) { $scope.getNameFunc(); });
    $scope.PLAYPAUSE=0;
    var marketTimer;
    var stopped21;
    $scope.loading = false;
    $scope.dateForm = new Date($stateParams.date);
    $scope.sportId = 0;
    $scope.SPORTID=$stateParams.sportId;
    var stopped;
    var currentdate = new Date();
    $scope.btnPlaceDis = false;
    $scope.btnPlaceDisSession = false;
    $scope.SessionbtnPlaceDis = false;
    $scope.netConn = true;
    $scope.gtTypeId = sessionService.get('type');
    $scope.matchName = $stateParams.matchName;
    $scope.MatchId = $stateParams.MatchId;
    $scope.MarketId = $stateParams.MarketId;
    $scope.date = $stateParams.date;
    $scope.UserTypeId = sessionService.get('slctUseTypeID');
    $scope.UserId = sessionService.get('slctUseID');
    $scope.displayTable = false;
    $scope.logInTypeId = sessionService.get('slctUseTypeID');
    $scope.logInId = sessionService.get('slctUseID');
    $scope.FinalArray = [];
    $scope.FileterArray=[];
    $rootScope.MatchStack=[];
    $rootScope.one_click_stack=[];
    $rootScope.SessionStack=[];
    $scope.loadingM1 ={};
    $scope.IdUnique =0;
    $scope.betButtons=[1000,5000,10000, 25000, 50000, 100000, 150000];
    $scope.sessionbetButtons=[500,1000,5000,10000, 25000, 50000, 100000, 150000];
    $scope.minBet=1000;

    var websocket=null;
    var phpsoket=null;
    var sessionsocket=null;
    var urlIp=$rootScope.gurlIp;
    var urlArray=$rootScope.gUrlArray;
    $scope.ajaxTimer="";
    
    //var socket = io.connect('http://35.177.100.67:3000', {query: 'userId='+$scope.UserId} );
    //$rootScope.step1({ id: $scope.SPORTID });
    //
    $timeout(function(){
       // $rootScope.$broadcast('step1', { id: $scope.SPORTID });
      //  $rootScope.$broadcast('step10', { id: $scope.SPORTID,MstCode:$scope.MatchId,matchName:$scope.matchName});
    },1500)
   
    var MarketId = $stateParams.MarketId;
	
    var matchStatus = "OPEN";
$rootScope.MyLenth=0;
  /*  get_userser.userChipSetting(function(response) {
        $rootScope.userPlcBtn = response;
        $rootScope.MyLenth = response.length;
    });*/

    var authdata = Base64.encode(sessionService.get('user') + ':' +    sessionService.get('lgPassword'));
    var Bauthdata='Basic ' + authdata;
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

//step 1
$scope.SetCommonProperty=function(SId,MId)
{

if(SId!=angular.isUndefinedOrNull && MId.matchid !=angular.isUndefinedOrNull && MId.id!=angular.isUndefinedOrNull)
{
$rootScope.$broadcast('callAssignKeyInit',{'SelectionId':SId,'MatchId':MId.matchid,'MarketId':MId.id});
}
}

    $scope.SetCommonPropertyForManual=function(SId,MId)
    {
        if(SId!=angular.isUndefinedOrNull && MId.groupById !=angular.isUndefinedOrNull && MId.id!=angular.isUndefinedOrNull)
        {
            $rootScope.$broadcast('callAssignKeyInit',{'SelectionId':SId+'_M','MatchId':MId.matchid,'MarketId':MId.marketid});
        }
    }

    $scope.GetSelectionName=function(marketlst)
	{
		var pdata={"market_json":marketlst};
        $http({
            method: 'POST',
            url: 'http://18.130.213.12/matchbook/v1/get_selection',
			data:pdata,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {

        })

	}
    var callType1="1";
    $scope.GetMarketListId = function()
	{

$scope.getMarketlstTimer=$timeout(function(){

    if($state.current.name=="userDashboard.Matchodds")
    {
        if(callType1==1)
        {
            $scope.loading = true;
        }
        else{$scope.loading = false;}

        //  socket.emit('CallGetMarketListId', {auth:Bauthdata,MatchId:$scope.MatchId,UserId:$scope.UserId});
        $http({
            method: 'GET',
            url: 'Apicontroller/getMarketListing/'+$scope.MatchId,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
            if(data.error)
            {
                Dialog.autohide(data.message);
                $scope.loading = false;
                $scope.IsShowPage=false;
                $state.go("userDashboard.Home");
            }
            else
            {
                $scope.BindManulalOdds(data.data[0].runners);
                $scope.isManualMatchOdds=data.isManualMatchOdds;
                $scope.isManualMatch=data.is_manual;
                $rootScope.MatchStack=data.match_stack;
                $rootScope.SessionStack=data.session_stack;
                // $scope.isFavoriteVal=data.data.is_favourite;
                //$rootScope.one_click_stack=data.one_click_stack;
                if(data.data.result==0 || data.data.marketid=="")
                {
                    Dialog.autohide("Match Closed.");
                    $scope.loading = false;
                    $scope.IsShowPage=false;
                    //$scope.ClearAllTimeOut();
                    $state.go("userDashboard.Home");
                }

                else if(callType1==1){
                    var tResult = data;

                    //  $scope.oddsLimit=parseFloat(tResult.data.volumeLimit[0].oddsLimit);
                    //   $scope.volumeLimit=parseFloat(tResult.data.volumeLimit[0].volumeLimit);
                    $timeout.cancel($scope.ajaxTimer);
                    $scope.ajaxTimer=null;
                    if(tResult.error)
                    {

                        $scope.BindSoketMarket(tResult);
                    }
                    else
                    {
                        $scope.IsShowPage=true;
                        $scope.GetScore();
                        $scope.BindSoketMarket(tResult);
                    }
                }
                else if(callType1==2)
                {
                    $scope.BindSoketMarketSecondStep(data);
                }
            }
            $scope.GetMarketListId();
            callType1=2;
        }).error(function(err){
            $scope.loading = false;

        });
    }

         
	},1000);
    }
    $scope.BindManulalOdds=function(result)
	{
		if(result!=angular.isUndefinedOrNull)
		{
			$scope.Manualdata=result;
		}
	}
    $scope.GetMarketListCheck = function()
	{
		//
	   $scope.loading = true;
	   
	 //  socket.emit('CallGetMarketListId', {auth:Bauthdata,MatchId:$scope.MatchId,UserId:$scope.UserId});
		 $http({
                    method: 'GET',
                    url: 'Apicontroller/getMarketListing/'+$scope.MatchId,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    
                    if(data.data.result==0 || data.data.marketid=="")
                    {
                        Dialog.autohide("Match Closed.");
                        $scope.loading = false;
                        $scope.IsShowPage=false;
                        $state.go("userDashboard.Home");
                    }
                  
		}).error(function(err){
			 $scope.loading = false;
        });	
        
    }
    $scope.GetMarketSelectionName = function()
	{
		//
		 $http({
                    method: 'POST',
                    url: 'Apicontroller/getBackLaysOfMarketSelectionName',//+$scope.MatchId+'/'+$scope.SPORTID+'/'+sessionService.get('user_id')
                    data: {
                        "filter":{"marketIds":$scope.MarketLst},
                        "maxResults":"100",
			"marketProjection":["MARKET_START_TIME","RUNNER_DESCRIPTION"]
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
				$scope.FinalArray = data;
				$scope.CallType='first';
				$scope.GetMarketRunner();	
				
			       
				
			}).error(function(err){
			 $scope.loading = false;
		});	
	}
	
$scope.ChangeMarketId = function(MarketId)
{
	$scope.DisMarketId=MarketId;
	$scope.CallType ='Second';
	var inde = $scope.MarketLst.indexOf($scope.MarketLst.filter(function(item) {
    return item == MarketId
})[0]);
			//
				if(inde > -1)
				{
				 var MatchOdds = $scope.FinalArray[j];
				  if(MatchOdds.marketName!="Match Odds")
					{
						 $scope.MarketLst.splice(inde,1);
					}	
				}
				else
				{
				   $scope.MarketLst.push(MarketId);
					$scope.loading = true;
				}
	var inde1 = $scope.FileterArray.indexOf($scope.FileterArray.filter(function(item) {
   				 return item.marketId == MarketId;
				})[0]);
	if(inde1>-1)
		{

				  $scope.FileterArray.splice(inde1,1);
		}
	else
	{
		$scope.FileterArray=[];
		for(var m=0;m<$scope.MarketLst.length;m++)
		{
			
			var inde2 = $scope.FinalArray.indexOf($scope.FinalArray.filter(function(item) {
   				 return item.marketId == $scope.MarketLst[m];
				})[0]);
			if(inde2>-1)
			{
				$scope.FileterArray.push($scope.FinalArray[inde2]);
			}
		}
		
	}
	
}
$scope.loadRunner = function(id)
{
  //BindIndianFancy
 var result = $scope.FileterArray.filter(function(item) {
   				 return item.marketId == id;
				})[0]
if(result!=null)
{
	return result.runners;
}
else{
return [];
}
}
           $scope.GetMarketRunner = function()
	{
	       if($scope.CallType=='first')
		{
			var inde = $scope.FinalArray.indexOf($scope.FinalArray.filter(function(item) {
   				 return item.marketName == "Match Odds"
				})[0]);
				if(inde > -1)
				{
				  $scope.MarketLst=[];	
				  $scope.FileterArray=[];
				  MatchOdd = $scope.FinalArray[j];
				  $scope.FinalArray.splice(inde,1);
				  $scope.FinalArray.splice(0, 0, MatchOdd);	
				  $scope.MarketLst.push($scope.FinalArray[j].marketId);
				  $scope.FileterArray.push($scope.FinalArray[j]);
				  // $scope.loading = false;
				}
				else
				{
				   $scope.MarketLst=[];	
				   $scope.FileterArray=[];
				   if($scope.FinalArray.length>0)
					{
				   $scope.FileterArray.push($scope.FinalArray[0]);
				   $scope.MarketLst.push($scope.FinalArray[0].marketId);
					}
 				//$scope.loading = false;
				}
		}
else{$scope.loading = false;}
	  stopped21 = $timeout(function() {
		if($scope.MarketLst.length > 0)
		{
		//
		//socket.emit('callBackLaysOfMarketSetting', {auth:Bauthdata,marketIds:$scope.MarketLst,matchId:$scope.MatchId,UserId:$scope.UserId});
		//
		}
		$scope.GetMarketRunner();
		},2000);	
	}
    var uniqueNumber ={};
	uniqueNumber.previous = 0;
   // $rootScope.stakeIds=[];
   // $rootScope.stake2={};
//$rootScope.FinalTeam=[];
$scope.Selection=[];
    $scope.getRandomSpan = function(id){

var ind=$scope.Selection.findIndex(x=>x==id);
	if(ind==-1){
	$scope.Selection.push(id);
		 
	}
	else
	{
	var date = Date.now();
    
    if (date <= uniqueNumber.previous) {
        date = ++uniqueNumber.previous;
    } else {
        uniqueNumber.previous = date;
    }
   // $rootScope.stakeIds.push(date);
   // $rootScope.stake2['field_' + date] =0;
   // $rootScope.stake2['loss_' + date] =0;
  //  $rootScope.stake2['win_' + date] =0;
  //  var obj={'placeName':'','TeamW':0,'TeamL':0,'UId':date};
   // $rootScope.FinalTeam.push(obj);
    return date;	
	}
  		//return Math.floor((Math.random()*6)+1);
    }

$scope.CommonFun=function(msg)
{
	websocket.onclose();
	//Dialog.autohide(msg);
	$scope.loading = false;
	$scope.IsShowPage=false;
	//$state.go("dealerDashboard.Home");
}

    $scope.FancyData=[];
    $scope.BindSoketMarketSecondStep=function(result)
	{

       	    if(result.data != angular.isUndefinedOrNull)
            {
		if(result.data.length!=$scope.FinalArray.length)
		{
			$scope.loading = true;
			$scope.FinalArray=[];
			 for(var i=0;i<result.data.length;i++){
				$scope.FinalArray.push(result.data[i]);
			}
			$scope.BindSoketMarket(result)
			$scope.loading = false;
		}
        else
        {
            for(var i=0;i<result.data.length;i++){
                var ind=$scope.FinalArray.findIndex(x=>x.marketid==result.data[i].marketid && x.is_auto==result.data[i].is_auto);
                if(ind>-1)
                {
                    $scope.FinalArray[ind].visibility=result.data[i].visibility;

                    $scope.FinalArray[ind].day=result.data[i].day;
                    $scope.Day= $scope.FinalArray[ind].day;
                    if($scope.FinalArray[ind].is_auto=='M')
                    {
                        $scope.FinalArray[ind].runners=result.data[i].runners;
                        $scope.FinalArray[ind].isBetAllowedOnManualMatchOdds=result.data[i].isBetAllowedOnManualMatchOdds;
                        $scope.FinalArray[ind].isManualMatchOdds=result.data[i].isManualMatchOdds;
                        $scope.FinalArray[ind].is_manual=result.data[i].is_manual;

                    }
                    if(result.data[i].is_manual==1)
                    {
                        $scope.FinalArray[ind].id=result.data[i].marketid;
                    }
                    $scope.FinalArray[ind].name=result.data[i].market_name;

                }

            }
        }
	    }
	}
    $scope.market_sel_id=[];
    $scope.BindSoketMarket=function(result)
    {

	$scope.marketIdLst=[];
        if(result.data != angular.isUndefinedOrNull)
            {

		  for(var i=0;i<result.data.length;i++){
             var rindx= $scope.marketIdLst.findIndex(x=>x==result.data[i].marketid);
             if(rindx==-1)
             {
                 $scope.marketIdLst.push(result.data[i].marketid);
             }

           		
			if(callType1==1)
			{
	 	   	  $scope.FinalArray.push(result.data[i]);
			}
			if($scope.SPORTID == 4)
			{
                $scope.getFancyList(result.data[i].marketid);
                $scope.UpdateAdminFancyList(result.data[i].marketid);
			}

		    }
		
            //var callbackResult=$scope.SetResult($scope.marketIdLst);
         
            $scope.MarketLst=$scope.marketIdLst.join(',');
            $scope.MarketWinLoss($scope.MarketLst);
            $scope.CallMarketLiability();
	    $scope.MarketId= $scope.MarketLst;
            $scope.AllMarket =  $scope.MarketLst;

		$rootScope.$broadcast('BindUserBets',{MatchId:$scope.MatchId});
		
		 $scope.GetScore();
		if(true){
            for(var j=0;j<$scope.FinalArray.length;j++) {
                if($scope.FinalArray[j].is_manual==1)
                {
                    $scope.FinalArray[j].id=$scope.FinalArray[j].marketid;
                }

                for (var r = 0; r < $scope.FinalArray[j].runners.length; r++) {
                    $scope.SetCommonProperty($scope.FinalArray[j].runners[r].id, $scope.FinalArray[j]);
                }
            }
}
	       get_userser.getSocketDataApiDetail($scope.MarketLst,function(data) {
               $scope.market_sel_id=[];
            //console.log(data);
	 			 var dataResult = data;
		                     var tempResult =[];

		                         if(dataResult !=angular.isUndefinedOrNull && dataResult.length>0 && dataResult[0]!=angular.isUndefinedOrNull)
		                         {
						for(var j=0;j<$scope.FinalArray.length;j++)
						{
					             var ind = dataResult.findIndex(x=>x.marketId==$scope.FinalArray[j].marketid);
				                     if(ind>-1)
				                     {


				                         tempResult.data=dataResult[ind];
							 var tempArray=$scope.FinalArray[j];
							 $scope.FinalArray[j].volumeLimit=tempArray.volumeLimit;
							 $scope.FinalArray[j].IsMatchDisable=tempArray.IsMatchDisable;
							 $scope.FinalArray[j].is_favourite=tempArray.is_favourite;
							 $scope.FinalArray[j].id=tempResult.data.id;
							 $scope.FinalArray[j].mtype=tempResult.data.mtype;
							 $scope.FinalArray[j].btype=tempResult.data.btype;
							 $scope.FinalArray[j].name=tempResult.data.name;
							 $scope.FinalArray[j].status=tempResult.data.status;
							 $scope.FinalArray[j].inPlay=tempResult.data.inPlay;
							 $scope.FinalArray[j].groupById=tempResult.data.matchid;
							 $scope.FinalArray[j].day=tempResult.data.day;
							 $scope.Day= $scope.FinalArray[j].day;
							 $scope.FinalArray[j].isBetAllowedOnManualMatchOdds=tempArray.isBetAllowedOnManualMatchOdds;// it will disable odds of autotomanula match
							 //data base runners exist
							 if($scope.FinalArray[j].runners.length>0)
							 {

							 	for(var r=0;r<$scope.FinalArray[j].runners.length;r++)
								{
									if($scope.FinalArray[j].runners[r].selectionId != angular.isUndefinedOrNull){
                                        $scope.FinalArray[j].runners[r].id=$scope.FinalArray[j].runners[r].selectionId;
									}
									//$scope.SetCommonProperty($scope.FinalArray[j].runners[r].id,$scope.FinalArray[j]);
									if($scope.FinalArray[j].runners[r].name=="" || tempArray.runners[r].name==angular.isUndefinedOrNull){
										var sId=$scope.FinalArray[j].id +"-"+ $scope.FinalArray[j].runners[r].id;
                                        $scope.FinalArray[j].runners[r].selection_id=sId;

                                        $scope.market_sel_id.push(sId);
									}
									else
									{
                                      var rindx=  $scope.FinalArray[j].runners.findIndex(x=>x.id==tempArray.runners[r].id);
                                      if(rindx>-1)
									  {
                                          $scope.FinalArray[j].runners[rindx].name=tempArray.runners[r].name;
									  }
                                        if($scope.FinalArray[j].mtype=="MATCH_ODDS" || $scope.FinalArray[j].btype=="ODDS"){
                                            $scope.BindIndianFancy(dataResult['session'],$scope.FinalArray[j].id);
                                        }


                                        $scope.CallSocketMarket();
									}
								}


							 }
							 else if($scope.FinalArray[j].runners.length==0)
                                         {
                                             $scope.FinalArray[j].runners=tempResult.data.runners;
                                             for(var r=0;r<$scope.FinalArray[j].runners.length;r++)
                                             {
                                                 if($scope.FinalArray[j].runners[r].name=="" || $scope.FinalArray[j].runners[r].name==angular.isUndefinedOrNull || true){
                                                     var sId=$scope.FinalArray[j].id +"-"+ $scope.FinalArray[j].runners[r].id;
                                                     $scope.FinalArray[j].runners[r].selection_id=sId;
                                                     $scope.market_sel_id.push(sId);
                                                 }
                                                // $scope.SetCommonProperty($scope.FinalArray[j].runners[r].id,$scope.FinalArray[j]);
                                             }


                                         }

				                         $scope.loading = false;
							}
							else{
                                // debugger;
                                $scope.doMatchDisabled();
								//Dialog.autohide("Odds not comming from api.");
								 $scope.loading = false;
								 //$scope.CallSocketMarket();
		                            			//$scope.IsShowPage=false;
								//$timeout.cancel($scope.ajaxTimer);
		                            			//$state.go("userDashboard.Home");
							}
						}

                                     if($scope.market_sel_id.length>0)
                                     {
                                         $scope.SelectionName=[];
                                         var selection_id=$scope.market_sel_id.join(',');

                                         get_userser.getSelectionList(selection_id,function(data) {

                                             $scope.SelectionName=data;
                                             for(var j=0;j<$scope.FinalArray.length;j++)
                                             {

                                                 if($scope.FinalArray[j].mtype=="MATCH_ODDS" || $scope.FinalArray[j].btype=="ODDS"){
                                                     $scope.BindIndianFancy(dataResult['session'],$scope.FinalArray[j].id);
                                                 }
                                                 for(var s=0;s<$scope.SelectionName.length;s++)
                                                 {
                                                     var indx=$scope.FinalArray[j].runners.findIndex(x=>x.selection_id==$scope.SelectionName[s].selection_id)
                                                     if(indx>-1)
                                                     {
                                                         $scope.FinalArray[j].runners[indx].name=$scope.SelectionName[s].runnername;
                                                     }
                                                 }
                                                // $scope.FinalArray[j].runners=tempArray.runners;

                                                 $scope.CallSocketMarket();
                                             }

                                         });
                                     }



		                       
					}
				else {
                    
                    $scope.doMatchDisabled()
					if($scope.SPORTID == 4 && dataResult.length==0 && dataResult[0]==angular.isUndefinedOrNull)
					{
						$scope.isSessionNull=true;

					}
                    $scope.loading = false;

				 }
			});
      

            }

    }

    // FOR SUSPENDED MATCH
    $scope.doMatchDisabled = function(){
         for(var j=0;j<$scope.FinalArray.length;j++)
        {
            if($scope.FinalArray[j].is_manual != 1){

            $scope.FinalArray[j].status='SUSPENDED';
            }

        }
    
    }

    $scope.CallSocketMarket=function(){
$scope.ajaxTimer = $timeout(function(){
callType1="2";
 //$scope.GetMarketListId();
		   get_userser.getSocketDataApiDetail($scope.MarketLst,function(data) {
  		   	try{
                // debugger;
	 			 var dataResult = data;
		                     var tempResult =[];
		                
		                         if(dataResult !=angular.isUndefinedOrNull && dataResult.length>0 && dataResult[0] !=angular.isUndefinedOrNull)
		                         {
		                            for(var j=0;j<$scope.FinalArray.length;j++)
						{
					             var ind = dataResult.findIndex(x=>x.marketId==$scope.FinalArray[j].marketid);
				                     if(ind>-1)
				                     {

		                                        tempResult.data=dataResult[ind];
                                         $scope.FinalArray[j].status=tempResult.data.status;
                                         $scope.FinalArray[j].inPlay=tempResult.data.inPlay;
                                         if($scope.FinalArray[j].mtype=="MATCH_ODDS" || $scope.FinalArray[j].btype=="ODDS"){
		                                         $scope.BindIndianFancy(dataResult['session'],$scope.FinalArray[j].marketid);
							}
                                         if($scope.SPORTID == 4)
                                         {
                                             $scope.BindIndianFancy(dataResult['session'],$scope.FinalArray[j].marketid);
                                         }

							 $scope.SocketMarket(tempResult);
			                                 $scope.loading = false;
						
						     }
						}
					}
					$timeout.cancel($scope.ajaxTimer);

                $scope.CallSocketMarket();
            }
            catch (e) {
                $scope.CallSocketMarket();
            }
				});

if($scope.SPORTID==4)
{
	//$scope.getFancyList($scope.MarketId);
	
	//$scope.BindIndianFancy($scope.MarketId);
}	

// $scope.GetScore();
},1000);
	}
    $scope.FancyNull=function()
    {

        if($scope.FancyData!=angular.isUndefinedOrNull) {
            for (var i = $scope.FancyData.length; i--;) {
                    if ($scope.FancyData[i].is_indian_fancy == 1 && $scope.FancyData[i].fancy_mode == "A") {

                        $scope.FancyData[i].isIndianShow = false;
                        //$scope.FancyData.splice(i, 1);
                    }

            }
        }
    }
	$scope.isExistIndianFancy=true;
    $scope.isExistFancy=true;
    $scope.InClick=-1;
    $scope.LeaderShow=function(indx)
	{
		if(indx==$scope.InClick)
		{
            $scope.InClick=-1;
		}
		else {
            $scope.InClick=indx;
		}

	}
    $scope.BindIndianFancy=function(data,mId)
    {


            // var temp  =  JSON.parse(event.data);

            var dataResult=data;

            // dataResult.push(data.message);
            var tempResult =[];
            if(dataResult!=angular.isUndefinedOrNull)
            {

                if(dataResult.length>0 && dataResult[0]!=null)
                {
                    var ind = dataResult.findIndex(x=>x.market_id==mId);
                    if(ind>-1)
                    {
                    	try{

                        tempResult.data=dataResult[ind].value.session;
                        $scope.FancyLiveData=tempResult.data;
                        $scope.loading = false;
                        //$scope.SocketMarket(tempResult);
                        if($scope.FancyData!=angular.isUndefinedOrNull)
                        {

                            for(var i=0;i<$scope.FancyData.length;i++)
                            {

                                if($scope.FancyData[i].is_indian_fancy==1 && $scope.FancyData[i].fancy_mode=="A")
                                {
                                    if($scope.FancyLiveData!=angular.isUndefinedOrNull)
                                    {
                                        var inde = $scope.FancyLiveData.findIndex(img => img.SelectionId === $scope.FancyData[i].ind_fancy_selection_id);
                                        if(inde > -1)
                                        {
                                            var obj = $scope.FancyLiveData[inde];
                                            if(obj!=angular.isUndefinedOrNull)
                                            {
                                                $scope.FancyData[i].isIndianShow = true;
                                                $scope.FancyData[i].SessInptNo=obj.LayPrice1;
                                                $scope.FancyData[i].NoValume=obj.LaySize1;
                                                $scope.FancyData[i].SessInptYes=obj.BackPrice1;
                                                $scope.FancyData[i].YesValume=obj.BackSize1;
                                                if(obj.GameStatus=='SUSPENDED1')
                                                {
                                                    $scope.FancyData[i].DisplayMsg='Ball Running';
                                                }
                                                else{
                                                    $scope.FancyData[i].DisplayMsg=obj.GameStatus;
                                                }
                                                if($scope.FancyDataTemp.length>0 && $scope.FancyDataTemp[i].active==0)
                                                {
                                                    $scope.FancyData[i].active=$scope.FancyDataTemp[i].active;
                                                }
                                                else{
                                                    $scope.FancyData[i].active=(obj.GameStatus =="" || obj.GameStatus=='ACTIVE') ? 1 : 4;
                                                }

                                            }

                                        }
                                        else
                                        {
                                            $scope.FancyData[i].SessInptNo='';
                                            $scope.FancyData[i].SessInptYes='';
                                            $scope.FancyData[i].DisplayMsg='Result Awaiting';
                                            $scope.FancyData[i].active= 4;


                                        }


                                    }
                                }

                            }

                        }
                        else{
                            // sessionsocket.onclose();
                            //  Dialog.autohide("Betting not allow.");
                            $scope.loading = false;
                            //   $scope.IsShowPage=false;
                            //  $state.go("userDashboard.Home");


                        }

                        }
                        catch (e) {

                        }
                    }
                    else
                    {

                        //sessionsocket.onclose();
                        //Dialog.autohide("Record not found.");
                        $scope.loading = false;
                        //$scope.IsShowPage=false;
                        if($scope.FancyData!=angular.isUndefinedOrNull)
                        {

                            for(var i=0;i<$scope.FancyData.length;i++)
                            {
                                if($scope.FancyData[i].is_indian_fancy==1 && $scope.FancyData[i].fancy_mode=="A" && $scope.FancyData[i].market_id==$scope.MarketId)
                                {
                                    $scope.FancyData[i].SessInptNo='';
                                    $scope.FancyData[i].SessInptYes='';
                                    $scope.FancyData[i].DisplayMsg='Result Awaiting';
                                    $scope.FancyData[i].active= 4;

                                }
                            }
                        }


                    }
                }
                else{
                    // sessionsocket.onclose();
                    // Dialog.autohide("Betting not allow.");
                    $scope.loading = false;
                    // $scope.IsShowPage=false;
                    //$state.go("userDashboard.Home");
                    $scope.FancyNull();
                }

                // $('#odds').html(JSON.stringify(event.data));
                //var Data = JSON.parse(event.data);
                //   alert(JSON.stringify(event.data));
                //console.log(JSON.stringify(event.data));
                //showMessage("<div class='"+Data.buy+"'>"+Data.sell+Data.average+"</div>");
                //$('#chat-message').val('');
            }
            else
			{
                $scope.FancyNull();
			}

    }


    $scope.IsShowFancy=function()
	{

      var ind=  $scope.FancyData.findIndex(x=>x.DisplayMsg!='Result Awaiting');
      if(ind==-1)
	  {
			$scope.isExistFancy=false;
	  }
	  return $scope.isExistFancy;
	}



$scope.SocketMarket = function(result)
{
	
    //$scope.FancyLiveData = result.session;
    var market = result.data.runners;
    var j = $scope.FinalArray.findIndex(x=>x.marketid==result.data.marketId);
    if(market!=angular.isUndefinedOrNull)
    {
    	if(j>-1){
           // $scope.CheckBet(j);
		}

        for(var m=0;m<market.length;m++)
        {

	 
		if(j>-1){
           var inde = $scope.FinalArray[j].runners.findIndex(img => img.id ===market[m].selectionId || img.id === market[m].selectionId);
           if(inde>-1)
           {
	       $scope.FinalArray[j].IsMatchDisable=false;
               for(var b=0;b<$scope.FinalArray[j].runners[inde].ex.availableToBack.length;b++)
               {


                var count = b+1;  
                try{
                    $scope.FinalArray[j].runners[inde].ex.availableToBack[b].selected =  $scope.CallColor($scope.FinalArray[j].runners[inde].ex.availableToBack[b].price, market[m].ex.availableToBack[b].price);

                   // $scope.CallColor($scope.FinalArray[j].runners[inde].ex.availableToBack[b].price,$scope.FinalArray[j].runners[inde].ex.availableToBack[b].size, market[m].ex.availableToBack[b].price,market[m].ex.availableToBack[b].size);
                }
                catch(e)
                {

                }
               try{
                $scope.FinalArray[j].runners[inde].ex.availableToBack[b].price = market[m].ex.availableToBack[b].price;
               }
               catch(e)
               {
                if($scope.FinalArray[j].runners[inde].ex.availableToBack[b]!=angular.isUndefinedOrNull)
                {
                    $scope.FinalArray[j].runners[inde].ex.availableToBack[b].price="";
                }
               }
               try{
                $scope.FinalArray[j].runners[inde].ex.availableToBack[b].size = market[m].ex.availableToBack[b].size;
                 }
                catch(e)
                {
                    
                }
                
              
               }
               for(var b=0;b<$scope.FinalArray[j].runners[inde].ex.availableToLay.length;b++)
               {
                var count = b+1;
                try{
                    $scope.FinalArray[j].runners[inde].ex.availableToLay[b].selected =  $scope.CallColor($scope.FinalArray[j].runners[inde].ex.availableToLay[b].price,market[m].ex.availableToLay[b].price);
				}
				catch (e) {

                }

                try{
                    $scope.FinalArray[j].runners[inde].ex.availableToLay[b].price = market[m].ex.availableToLay[b].price;
                }
                catch(e)
                {
                        if($scope.FinalArray[j].runners[inde].ex.availableToLay[b]!=angular.isUndefinedOrNull)
                    {
                        $scope.FinalArray[j].runners[inde].ex.availableToLay[b].price="";
                    }
                }


                   try{
                       $scope.FinalArray[j].runners[inde].ex.availableToLay[b].size = market[m].ex.availableToLay[b].size;
                   }
                   catch (e) {

                   }
               }
      

           }
	   else
		{
			$scope.FinalArray[j].IsMatchDisable=true;
		}
        }
    }

                   
}   

}
$scope.priveobj={};
$scope.prive={};
$scope.ChangeColorTemp = function(newVal,id)
{

	if(id!=angular.isUndefinedOrNull && $scope.prive['field_'+id] !=angular.isUndefinedOrNull && newVal!=angular.isUndefinedOrNull)
	{
    newVal.id=id;
    //$scope.Index=newVal.id;
	if(newVal!=angular.isUndefinedOrNull && $scope.prive!=angular.isUndefinedOrNull)
		
		{
	
	
	if ((newVal.price != $scope.prive['field_'+id].price || newVal.size != $scope.prive['field_'+id].size) && newVal.id==$scope.prive['field_'+id].id)
		{	//$scope.priveobj['field_'+$scope.Index] = false;
	             $scope.Index=newVal.id;
		        $scope.priveobj['field_'+$scope.Index]=false;
			if($scope.Index !=angular.isUndefinedOrNull)
			{
			     $scope.priveobj['field_'+$scope.Index]=true;$scope.prive['field_'+id]=newVal;
			     return true;
			
		 
			}
			
			
		}
		else if((newVal.price == $scope.prive['field_'+id].price || newVal.size == $scope.prive['field_'+id].size)){
			 $scope.priveobj['field_'+$scope.Index]=false;
			 //$scope.priveobj={};
			 //$scope.prive['field_'+id]=newVal;
			 //$('tbody td.callYlCss').toggleClass('callYlCss');
			// $('tbody td.callCYanCss').toggleClass('callCYanCss');
				 return false;
			//$timeout(function() {$scope.priveobj['field_'+$scope.Index]=false;$scope.prive['field_'+id]=newVal}, 500);
		}
		else{ $scope.priveobj['field_'+$scope.Index]=false;}
	  }
	//$scope.prive=id;
	}
	else
{
if(id!=angular.isUndefinedOrNull)
	{
	$scope.prive['field_'+id]=newVal;
	return false;
}
}
	
		
	
}


$scope.ChangeColor = function(obj)
{
	var i=0;
   selectedRunner = obj.runners;
if ($scope.FinalArray[i].status == "OPEN" && $scope.FinalArray[i].runners != angular.isUndefinedOrNull && $scope.FinalArray[i].runners.length > 0) {
try {
if ($scope.FinalArray[i].runners.length < selectedRunner.length) //170204
maxloop = selectedRunner.length;
else
maxloop = $scope.FinalArray[i].runners.length;
for (var j = 0; j < maxloop; j++) { //170204 $scope.GetMarketBackLayData.runners.length
if ($scope.FinalArray[i].runners[j].ex.availableToBack.length == selectedRunner[j].ex.availableToBack.length) {
try {
$scope.FinalArray[i].runners[j].ex.availableToBack[0].SELECTED = false;
if ($scope.FinalArray[i].runners[j].ex.availableToBack[0].price != selectedRunner[j].ex.availableToBack[0].price || $scope.FinalArray[i].runners[j].ex.availableToBack[0].size != selectedRunner[j].ex.availableToBack[0].size) {
$scope.FinalArray[i].runners[j].ex.availableToBack[0].SELECTED = true;
}
$scope.FinalArray[i].runners[j].ex.availableToBack[0].price = selectedRunner[j].ex.availableToBack[0].price;
$scope.FinalArray[i].runners[j].ex.availableToBack[0].size = selectedRunner[j].ex.availableToBack[0].size;
} catch (e) {
if ($scope.FinalArray[i].runners[j].ex.availableToBack[0] != angular.isUndefinedOrNull) {
$scope.FinalArray[i].runners[j].ex.availableToBack[0].price = "";
}
}
try {
$scope.FinalArray[i].runners[j].ex.availableToBack[1].SELECTED = false;
if ($scope.FinalArray[i].runners[j].ex.availableToBack[1].price != selectedRunner[j].ex.availableToBack[1].price || $scope.FinalArray[i].runners[j].ex.availableToBack[1].size != selectedRunner[j].ex.availableToBack[1].size) {
$scope.FinalArray[i].runners[j].ex.availableToBack[1].SELECTED = true;
}
$scope.FinalArray[i].runners[j].ex.availableToBack[1].price = selectedRunner[j].ex.availableToBack[1].price;
$scope.FinalArray[i].runners[j].ex.availableToBack[1].size = selectedRunner[j].ex.availableToBack[1].size;
} catch (e) {
if ($scope.FinalArray[i].runners[j].ex.availableToBack[1] != angular.isUndefinedOrNull) {
$scope.FinalArray[i].runners[j].ex.availableToBack[1].price = "";
}
}
try {
$scope.FinalArray[i].runners[j].ex.availableToBack[2].SELECTED = false;
if ($scope.FinalArray[i].runners[j].ex.availableToBack[2].price != selectedRunner[j].ex.availableToBack[2].price || $scope.FinalArray[i].runners[j].ex.availableToBack[2].size != selectedRunner[j].ex.availableToBack[2].size) {
$scope.FinalArray[i].runners[j].ex.availableToBack[2].SELECTED = true;
}
$scope.FinalArray[i].runners[j].ex.availableToBack[2].price = selectedRunner[j].ex.availableToBack[2].price;
$scope.FinalArray[i].runners[j].ex.availableToBack[2].size = selectedRunner[j].ex.availableToBack[2].size;
} catch (e) {
if ($scope.FinalArray[i].runners[j].ex.availableToBack[2] != angular.isUndefinedOrNull) {
$scope.FinalArray[i].runners[j].ex.availableToBack[2].price = "";
}
}
} else {

$scope.FinalArray[i].runners[j].ex.availableToBack = selectedRunner[j].ex.availableToBack;
}
if ($scope.FinalArray[i].runners[j].ex.availableToLay.length == selectedRunner[j].ex.availableToLay.length) {
try {
$scope.FinalArray[i].runners[j].ex.availableToLay[0].SELECTED = false;
if ($scope.FinalArray[i].runners[j].ex.availableToLay[0].price != selectedRunner[j].ex.availableToLay[0].price || $scope.FinalArray[i].runners[j].ex.availableToLay[0].size != selectedRunner[j].ex.availableToLay[0].size) {
$scope.FinalArray[i].runners[j].ex.availableToLay[0].SELECTED = true;
}
$scope.FinalArray[i].runners[j].ex.availableToLay[0].price = selectedRunner[j].ex.availableToLay[0].price;
$scope.FinalArray[i].runners[j].ex.availableToLay[0].size = selectedRunner[j].ex.availableToLay[0].size;
} catch (e) {
if ($scope.FinalArray[i].runners[j].ex.availableToLay[0] != angular.isUndefinedOrNull) {
$scope.FinalArray[i].runners[j].ex.availableToLay[0].price = "";
}
}
try {
$scope.FinalArray[i].runners[j].ex.availableToLay[1].SELECTED = false;
if ($scope.FinalArray[i].runners[j].ex.availableToLay[1].price != selectedRunner[j].ex.availableToLay[1].price || $scope.FinalArray[i].runners[j].ex.availableToLay[0].size != selectedRunner[j].ex.availableToLay[0].size) {
$scope.FinalArray[i].runners[j].ex.availableToLay[1].SELECTED = true;
}
$scope.FinalArray[i].runners[j].ex.availableToLay[1].price = selectedRunner[j].ex.availableToLay[1].price;
$scope.FinalArray[i].runners[j].ex.availableToLay[1].size = selectedRunner[j].ex.availableToLay[1].size;
} catch (e) {
if ($scope.FinalArray[i].runners[j].ex.availableToLay[1] != angular.isUndefinedOrNull) {
$scope.FinalArray[i].runners[j].ex.availableToLay[1].price = "";
}
}
try {
$scope.FinalArray[i].runners[j].ex.availableToLay[2].SELECTED = false;
if ($scope.FinalArray[i].runners[j].ex.availableToLay[2].price != selectedRunner[j].ex.availableToLay[2].price || $scope.FinalArray[i].runners[j].ex.availableToLay[2].size != selectedRunner[j].ex.availableToLay[2].size) {
$scope.FinalArray[i].runners[j].ex.availableToLay[2].SELECTED = true;
}
$scope.FinalArray[i].runners[j].ex.availableToLay[2].price = selectedRunner[j].ex.availableToLay[2].price;
$scope.FinalArray[i].runners[j].ex.availableToLay[2].size = selectedRunner[j].ex.availableToLay[2].size;
} catch (e) {
if ($scope.FinalArray[i].runners[j].ex.availableToLay[2] != angular.isUndefinedOrNull) {
$scope.FinalArray[i].runners[j].ex.availableToLay[2].price = "";
}
}
} else {

$scope.FinalArray[i].runners[j].ex.availableToLay = selectedRunner[j].ex.availableToLay;
}
//$scope.FinalArray[i].runners[r].ex=runners.ex;
}
} catch (e) {

// $scope.FinalArray[i] = angular.isUndefinedOrNull;
}
}

}


$scope.CheckBet=function(i)
{
    if ($scope.FinalArray[i] != angular.isUndefinedOrNull) {
        /*start code for Match UnMatch*/
        if ($scope.FinalArray[i] != angular.isUndefinedOrNull && $scope.FinalArray[i].status != "CLOSED" && $scope.MatchResult != "CLOSED") {
            try {
                for (var u = 0; u < $rootScope.GUserData.length; u++) {
                    if ($scope.FinalArray[i] != angular.isUndefinedOrNull) {
                        $scope.FinalArray[i].runners.find(function (item, j) {
                            if (item.id == $rootScope.GUserData[u].SelectionId && ($scope.FinalArray[i].id == $rootScope.GUserData[u].MarketId) && ($rootScope.GUserData[u].MatchId == $stateParams.MatchId) && ($rootScope.GUserData[u].IsMatched == 0)) {
                                if ($rootScope.GUserData[u].isBack == 0) {
                                    if (item.ex.availableToBack.length != 0 && $rootScope.GUserData[u].Odds <= (item.ex.availableToBack[0].price + parseFloat($scope.FinalArray[i].volumeLimit[0].oddsLimit)).toFixed(2)) {
                                        $http.get('Betentrycntr/updateUnMatchedData/' + $rootScope.GUserData[u].MstCode + '/' + 0 + '/' + $scope.FinalArray[i].id + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                                            $rootScope.$broadcast('BindUserBets', {MatchId: $scope.MatchId});
                                            // $scope.getBetsData();
                                        });
                                    }
                                } else {
                                    if (item.ex.availableToLay.length != 0 && $rootScope.GUserData[u].Odds >= (item.ex.availableToLay[0].price + parseFloat($scope.FinalArray[i].volumeLimit[0].oddsLimit)).toFixed(2)) {
                                        $http.get('Betentrycntr/updateUnMatchedData/' + $rootScope.GUserData[u].MstCode + '/' + 1 + '/' + $scope.FinalArray[i].id + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                                            $rootScope.$broadcast('BindUserBets', {MatchId: $scope.MatchId});
                                            // $scope.getBetsData();
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            } catch (e) {
               // tem = true;
            }
        }
    }
}
    $scope.UpdateUnMatchedBet=function(type,MstCode,marketid,matchId) {
        $http.get('Betentrycntr/updateUnMatchedData/' + MstCode + '/' + type + '/' + marketid + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + matchId).success(function (data, status, headers, config) {
        });
    }


	 $scope.TRunnerValue1={};


    $scope.MarketWinLoss = function()
    {
        // $scope.winlosstimeout=$timeout(function(){
        // if($state.current.name=='userDashboard.Matchodds')
        // {

        $http({
            method:"POST",
            url:BASE_URL+'Apicontroller/market_win_loss',
            data: {"matchId":$scope.MatchId,"MarketId":$scope.MarketLst},
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(function(data){
            //
            var tempResult=data.data;
            for(var i=0;i<tempResult.length;i++)
            {
                $scope.TRunnerValue1['field_'+tempResult[i].marketId] = tempResult[i];
            }
            // $scope.MarketWinLoss(lstMarket);
        })

        //}
        // },2000)
    }

    $scope.CallMarketLiability = function()
    {

        $http({
            method:"POST",
            url:BASE_URL+'/Apicontroller/update_market_win_loss',
            data: {"matchId":$scope.MatchId,"MarketId":$scope.MarketLst},
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(function(data){
            var tempResult=data.data;
            for(var i=0;i<tempResult.length;i++)
            {
                $scope.TRunnerValue1['field_'+tempResult[i].marketId] = tempResult[i];
            }
        })


    }


    $scope.$on('CallMarketLiability',function(event,data){
        $scope.CallMarketLiability();
    })

    $scope.MarketWinLossByMId = function(MarketId)
	{
		var obj = null;
		if($scope.TRunnerValue1 != angular.isUndefinedOrNull && MarketId!= angular.isUndefinedOrNull)
		{
			if(($scope.TRunnerValue1['field_'+MarketId]) != angular.isUndefinedOrNull){
				  obj = ($scope.TRunnerValue1['field_'+MarketId]).runners;
			}
		  
		  
		}
		return obj;
	
	}
    $scope.$on('MarketWinLoss_Matchodds',function(event,data){
		 $scope.MarketWinLoss(data.marketId);
	})
    $scope.GetScore=function(){      
	$scope.GetScoreTimer=$timeout(function(){
            var eventIds = $stateParams.MatchId;
         //var eventIds = '28448035';
        $http.get(BASE_URL+'Geteventcntr/GetScoreApi/'+eventIds).then(function(result) {
            
            if (result.data.length!= 0) {
                $scope.Documents=result.data[0];
		if($scope.Documents.matchStatus=="Finished")
		{
			 $scope.displayScore=false;
		}
		else
		{
			 $scope.displayScore=true;
		}
               
                if($scope.Documents.eventTypeId==2){
                    $scope.Home=result.data[0].score.home.gameSequence;
                    $scope.away=result.data[0].score.away.gameSequence;
                }
            }else{
                $scope.displayScore=false;
                $interval.cancel($scope.stopScore);
            }
		 $timeout.cancel($scope.GetScoreTimer);
		
		 $scope.GetScore();
		
        });
	},1000);
    }
    $scope.stopScore = $interval(function () {
                    //Display the current time.
      $scope.GetScore();
    }, 5000);

    $interval.cancel($scope.stopScore);
    
    $scope.priceVal1 = {};
    $scope.formStatus={};
    $scope.selectionId={};
    $scope.placeName1={};
    $scope.TRunnerValue1={};

    $scope.arrayObj={};
    $scope.getOddValueManual = function(item, priceVal,oddsLimit, matchId, back_layStatus, placeName, selectionId,index,MarketId,currentpos,active,marketitem) {
        //$scope.btnPlaceDis = true;
        if(active==1){

            $rootScope.currentpos=currentpos;
            priceVal = parseFloat(priceVal) + parseFloat(oddsLimit);
            if(priceVal>0){
            //$scope.SessionbtnPlaceDis = true;
            $scope.UserTypeId = sessionService.get('type');
            $scope.UserId = sessionService.get('slctUseID');
            $scope.ParantId = sessionService.get('slctParantID');
            $scope.loginId = sessionService.get('user_id');
            $scope.slctUseTypeID = sessionService.get('slctUseTypeID');
            $scope.stake = 0;
            $scope.priceVal =priceVal != angular.isUndefinedOrNull ?  parseFloat(priceVal.toFixed(2)) : 0;
            $scope.priceVal1['field_' + index]=parseFloat($scope.priceVal.toFixed(2));
            $scope.MatchId = $scope.MatchId;
            $scope.displayTable = true;
            $scope.acc = 1;
            $scope.formStatus['field_' + index] = back_layStatus;
            $scope.placeName = placeName;
            $scope.placeName1['field_'+index]=placeName;
            $scope.selectionId['field_' + index] = selectionId;
            var s = item.currentTarget.getAttribute("data-id");
            $scope.testModel = parseFloat(priceVal);
            var oldPnLValue1 = 0;
            $scope.slctProfit = 0;
            if (deviceDetector.device == 'unknown') {
                var DIVICE = 'Desktop';
            } else {
                var DIVICE = deviceDetector.device;
            }
            var deviceInformation = " browser: " + deviceDetector.browser + " browser_version :" + deviceDetector.browser_version + "  device: " + DIVICE + "  OS : " + deviceDetector.os + " os_version: " + deviceDetector.os_version;

            $scope.arrayObj={
                userId: $scope.UserId,
                ParantId: $scope.ParantId,
                loginId: $scope.loginId,
                selectionId: $scope.selectionId['field_' + index],
                matchId: $stateParams.MatchId,
                isback: $scope.formStatus['field_' + index],
                stake:'',
                priceVal: priceVal,
                p_l: '',
                MarketId: MarketId,
                isMatched: 1,
                UserTypeId: $scope.UserTypeId,
                placeName:marketitem.name.indexOf("Match Odds")==-1 ?  marketitem.name + " " + $scope.placeName1['field_'+index] : $scope.placeName1['field_'+index],
                MatchName: $stateParams.matchName,
                deviceInfo: deviceInformation,
                inplay: '',
                ApiVal: 0,
                unique_id:index,
                is_session_fancy:'N',
                IsErrorShow:false,
                Message:'',
                SportId:$scope.SPORTID,
                matchdate:$scope.dateForm,
				isManual:true,
				teamName:'team_'+currentpos
            };
            $rootScope.$broadcast('CallAddBackOrLay',$scope.arrayObj);
            /*  if(back_layStatus==0) //ex.availableToBack
            {
                var ind=$scope.backArray.findIndex(x=>x.uniqueId==index);
                if(ind==-1)
                {
                $scope.backArray.splice(0,0,$scope.arrayObj);
                }
            }
            else{
                var ind=$scope.layArray.findIndex(x=>x.uniqueId==index);
                if(ind==-1)
                {
                $scope.layArray.splice(0,0,$scope.arrayObj);
                }
               }*/
            }

        }
    };
    $scope.getOddValue = function(item, priceVal,oddsLimit, matchId, back_layStatus, placeName, selectionId,index,MarketId,currentpos,isMatchDisable,marketitem) {
                       //$scope.btnPlaceDis = true;
	if(!isMatchDisable && marketitem.visibility==1 && marketitem.status!='SUSPENDED' && marketitem.status!='CLOSED'){
	$rootScope.currentpos=currentpos;
	priceVal = parseFloat(priceVal) + parseFloat(oddsLimit);
        //$scope.SessionbtnPlaceDis = true;
        $scope.UserTypeId = sessionService.get('type');
        $scope.UserId = sessionService.get('slctUseID');
        $scope.ParantId = sessionService.get('slctParantID');
        $scope.loginId = sessionService.get('user_id');
        $scope.slctUseTypeID = sessionService.get('slctUseTypeID');
        $scope.stake = 0;
        $scope.priceVal =priceVal != angular.isUndefinedOrNull ?  parseFloat(priceVal.toFixed(2)) : 0;
	$scope.priceVal1['field_' + index]=parseFloat($scope.priceVal.toFixed(2));
        $scope.MatchId = $scope.MatchId;
        $scope.displayTable = true;
        $scope.acc = 1;
        $scope.formStatus['field_' + index] = back_layStatus;
        $scope.placeName = placeName;
	$scope.placeName1['field_'+index]=placeName;
        $scope.selectionId['field_' + index] = selectionId;
        var s = item.currentTarget.getAttribute("data-id");
        $scope.testModel = parseFloat(priceVal);
        var oldPnLValue1 = 0;
        $scope.slctProfit = 0;
	$scope.RunnerValue = $scope.MarketWinLossByMId(MarketId);
        if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length != angular.isUndefinedOrNull) {
            if ($scope.formStatus['field_' + index] == '1') {
               if(oldPnLValue1 != angular.isUndinedorNull){
                oldPnLValue1 = $filter('filter')($scope.RunnerValue, { selectionId: $scope.selectionId })[0]; //170316
		if(oldPnLValue1!=angular.isUndefinedOrNull)
		{
                $scope.oldPnLValue = $scope.getSumValPnL(oldPnLValue1.winValue, oldPnLValue1.lossValue);
                $scope.slctProfit = $scope.getSumValPnL(oldPnLValue1.winValue, oldPnLValue1.lossValue);}
		}
            } else {
                var minVal = 0;
                if ($scope.RunnerValue.length == 2) {
                    // oldPnLValue1 =$filter('filter')($scope.RunnerValue, { SelectionId: $scope.selectionId })[0];
                    $scope.RunnerValue.find(function(item, j) {
                        if (item.SelectionId != $scope.selectionId) {
                            minVal = (parseFloat(item.winValue) + parseFloat(item.lossValue));
                            if (minVal >= 0) {

                            } else {
                                minVal = 0;
                            }
                            // alert(minVal);
                        }
                    });
                } else if ($scope.RunnerValue.length > 2) {
                    $scope.arrayText = [];
                    //oldPnLValue1 =$filter('filter')($scope.RunnerValue, { SelectionId: $scope.selectionId })[0];
                    $scope.RunnerValue.find(function(item, j) {
                        var selectionVal = (parseFloat(item.winValue) + parseFloat(item.lossValue));
                        if (item.SelectionId != $scope.selectionId) {
                            //var t=(parseFloat(item.winValue) + parseFloat(item.lossValue));
                            var t1 = (parseFloat(item.winValue) + parseFloat(item.lossValue));
                            $scope.arrayText.push(t1);
                            console.log("Push+===" + $scope.arrayText);
                        }
                    });
                    minVal = Math.min.apply(Math, $scope.arrayText.map(function(item) { return item; }));
                    if (minVal < 0) {
                        minVal = 0;
                    };
                }
                $scope.oldPnLValue = minVal;
            }
        } else {
            $scope.oldPnLValue = 0;
        }
	if (deviceDetector.device == 'unknown') {
                var DIVICE = 'Desktop';
            } else {
                var DIVICE = deviceDetector.device;
            }
	 var deviceInformation = " browser: " + deviceDetector.browser + " browser_version :" + deviceDetector.browser_version + "  device: " + DIVICE + "  OS : " + deviceDetector.os + " os_version: " + deviceDetector.os_version;
	$scope.arrayObj={
                userId: $scope.UserId,
                ParantId: $scope.ParantId,
                loginId: $scope.loginId,
                selectionId: $scope.selectionId['field_' + index],
                matchId: $stateParams.MatchId,
                isback: $scope.formStatus['field_' + index],
                stake:'',
                priceVal: priceVal,
                p_l: '',
            
                MarketId: MarketId,
                isMatched: 1,
                UserTypeId: $scope.UserTypeId,
                placeName:marketitem.name.indexOf("Match Odds")==-1 ?  marketitem.name + " " + $scope.placeName1['field_'+index] : $scope.placeName1['field_'+index],
                MatchName: $stateParams.matchName,
                deviceInfo: deviceInformation,
                inplay: '',
                ApiVal: 0,
		unique_id:index,
		is_session_fancy:'N',
		IsErrorShow:false,
		Message:'',
		SportId:$scope.SPORTID,
		matchdate:$scope.dateForm,
		max_bet_liability:parseFloat(marketitem.max_bet_liability),
        isManual:false
            };
	$rootScope.$broadcast('CallAddBackOrLay',$scope.arrayObj);
    /*  if(back_layStatus==0) //back
	{
		var ind=$scope.backArray.findIndex(x=>x.uniqueId==index);
		if(ind==-1)
		{
		$scope.backArray.splice(0,0,$scope.arrayObj);
		}
	}
	else{
		var ind=$scope.layArray.findIndex(x=>x.uniqueId==index);
		if(ind==-1)
		{
		$scope.layArray.splice(0,0,$scope.arrayObj);
		}
	   }*/
	}
    };
$scope.$on('callgetOddValue',function(event,data){
$scope.getOddValue(data.item,data.priceVal,data.oddsLimit, data.matchId, data.back_layStatus, data.placeName, data.selectionId,data.index,data.MarketId,data.currentpos,data.isMatchDisable);
});
$scope.RemoveBackLay = function(uniqueId,type)
{

	$rootScope.$broadcast('RemoveAddBackOrLay',{'uniqueId':uniqueId,'type':type});
}

$scope.setbackData = function(item, priceVal,oddsLimit, matchId, back_layStatus, placeName, selectionId,index,MarketId) {
      
 	priceVal = parseFloat(priceVal) + parseFloat(oddsLimit);
        $scope.SessionbtnPlaceDis = true;
        $scope.UserTypeId = sessionService.get('type');
        $scope.UserId = sessionService.get('slctUseID');
        $scope.ParantId = sessionService.get('slctParantID');
        $scope.loginId = sessionService.get('user_id');
        $scope.slctUseTypeID = sessionService.get('slctUseTypeID');
        $scope.stake = 0;
        $scope.priceVal =priceVal != angular.isUndefinedOrNull ?  parseFloat(priceVal.toFixed(2)) : 0;
	$scope.priceVal1['field_' + index]=parseFloat($scope.priceVal.toFixed(2));
        $scope.MatchId = $scope.MatchId;
        $scope.displayTable = true;
        $scope.acc = 1;
        $scope.formStatus['field_' + index] = back_layStatus;
        $scope.placeName = placeName;
	$scope.placeName1['field_'+index]=placeName;
        $scope.selectionId['field_' + index] = selectionId;
	$scope.backarrayObj={
                userId: $scope.UserId,
                ParantId: $scope.ParantId,
                loginId: $scope.loginId,
                selectionId: $scope.selectionId['field_' + index],
                matchId: $stateParams.MatchId,
                isback: $scope.formStatus['field_' + index],
                stake:'',
                priceVal: priceVal,
                p_l: '',
                MarketId: MarketId,
                isMatched: '',
                UserTypeId: $scope.UserTypeId,
                placeName: $scope.placeName1['field_'+index],
                MatchName: $stateParams.matchName,
                deviceInfo: deviceInformation,
                inplay: '',
                ApiVal: 0,
		uniqueId:index
            };
	var ind=$scope.backArray.findIndex(x=>x.uniqueId==index);
	if(ind==-1)
	{
	$scope.backArray.push($scope.backarrayObj);
	}
	console.log($scope.backArray);
      
    };
    $scope.reset_all_selection = function(Id) {
        $scope.acc = 0;
        $scope.stake1['field_' + Id] = 0;
    };
    $scope.GetUserData=function(){
        $http.get('Betentrycntr/GatBetData/' + 0 + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function(data, status, headers, config) {
            $scope.UserData = data.betUserData;
        });
    }
    $scope.GetUserData();
	
   
   	$scope.CloseBetPopup = function(marketitem,id) {
		$scope.GetMarketInfo = marketitem;
		var inde2 = $scope.GetMarketInfo.runners.indexOf($scope.GetMarketInfo.runners.filter(function(item) {
   				 return item.uniqueId == id;
				})[0]);
		if(inde2>-1)
		{
			$scope.GetMarketInfo.runners[inde2].IsShow=false;
		}
	}

$scope.isfavorite={};
    $scope.setfavourite = function(matchs,index)
	{
		 $scope.loading = true;
		

		 $http({
                    method: 'POST',
                    url: 'Apiusercontroller/favourite',//+$scope.MatchId+'/'+$scope.SPORTID+'/'+sessionService.get
                    data: {
                        "market_id":matchs.id,
                      
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
				 $scope.GetMarketListId();
				$scope.message=data.message;
				Dialog.autohide($scope.message);
			      $scope.isfavorite['field' + index]=true;
			      matchs.is_favourite='Y';
             $scope.loading = false;
			}).error(function(err){
			 $scope.loading = false;
		});	
	};
    $scope.setUnfavourite = function(marketitem,index)
	{

	 $scope.loading = true;
	

		 $http({
                    method: 'POST',
                    url: 'Apiusercontroller/unfavourite',//+$scope.MatchId+'/'+$scope.SPORTID+'/'+sessionService.get
                    data: {
                        "market_id":marketitem.id,
                      
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
				//$scope.getSportDetail(0);
				 $scope.GetMarketListId();
				$scope.message=data.message;
				Dialog.autohide($scope.message);
			      	marketitem.is_favourite='N';
             $scope.loading = false;
			}).error(function(err){
			 $scope.loading = false;
		});
			
	//$rootScope.$broadcast('setunfavorite',{markets:marketitem,index:index});
	};


    $scope.getNameFunc = function() {
        var user_id = sessionService.get('slctUseID');
        var user_type = sessionService.get('slctUseTypeID');
        //
        $http.get('Geteventcntr/getBackLaysOfMarketSelectionName/' + $scope.MarketId + '/' + user_id + '/' + user_type + '/' + $scope.MatchId).success(function(data, status, headers, config) ///sourabh 161226 change
            {
                //
                if (data.runnerSlName != angular.isUndefinedOrNull && data.runnerSlName.length > 0)
                    $scope.GetMarketBackLayDataSelectionName = data.runnerSlName[0].runners;
                if (data.RunnerValue != angular.isUndefinedOrNull && data.RunnerValue.length != 0)
                    $scope.RunnerValue = data.RunnerValue;
                else
                    $scope.RunnerValue = [{}];

                if (data.MarketData != angular.isUndefinedOrNull && data.MarketData.length != 0)
                    $scope.GetMarketInfo = data.MarketData[0];
            });
    }
    $scope.getSumValPnL = function(a, b) {
        
        if(a==angular.isUndefinedOrNull && b==angular.isUndefinedOrNull){
            a=0;
            b=0;
        }
        else
        {
            var temp = parseFloat(a) + parseFloat(b);
        }

        return (parseFloat(a) + parseFloat(b));
    }
    $scope.counter = 0;
    var totalMatch = 0;
    var selectedRunner = null;
    $scope.$on("$destroy", function(event) {
    $interval.cancel($scope.stopScore);
        $timeout.cancel($scope.callOddsFunc);
        $scope.callOddsFunc = angular.isUndefinedOrNull;
        $timeout.cancel(phpsoket); 
    });
    
    $scope.stakeValReset = function(val,Id) { //sourabh 15-nov-2016
       // $scope.stake = parseInt(val);
	$scope.stake1['field_' + Id] = 0;
    };
    $scope.getCalculation = function(priceVal, stake) {
       //
        if (stake == angular.isUndefinedOrNull) {
            stake = 0;
        } else {
            $scope.sumOfVal = parseFloat(priceVal) * parseInt(stake) - parseInt(stake);
            $scope.sumOfVal = $scope.sumOfVal.toFixed(2);
        }

    }
    $scope.stake1={};
    $scope.stakeVal = function(val, selectionId, stake,index,marketitem) { //sourabh 15-nov-2016
		
	$scope.GetMarketBackLayData = marketitem;
    $stateParams.MarketId=$scope.GetMarketBackLayData.id;
    
	$scope.IdUnique= index;
        if (stake == angular.isUndefinedOrNull) {
            stake = 0;
        }
        if (stake == 0) {}
        $scope.sumOfVal = parseFloat(val) * parseInt(stake) - parseInt(stake);
        $scope.sumOfVal = $scope.sumOfVal.toFixed(2);
        $scope.stake1['field_' + index] = $scope.stake1['field_' + index] + parseInt(val);//$scope.stake +
	$scope.stake=$scope.stake1['field_' + index];
        $scope.MarketId = $scope.GetMarketBackLayData.id;
        $scope.UserTypeId = sessionService.get('type');
        var userId = document.getElementById('userId').value;
        var ParantId = document.getElementById('ParantId').value;
        var loginId = document.getElementById('loginId').value;
        var selectionId = document.getElementById('selectionId'+index).value;
        var matchId = document.getElementById('matchId').value;
        var isback = document.getElementById('isback'+index).value;
        var MarketId = document.getElementById('MarketId').value;
        var priceVal = $scope.priceVal1['field_' + index];
        var stake = $scope.stake1['field_' + index];
        var placeName = document.getElementById('placeName'+$scope.IdUnique).value;
        var chkValPrice = isback== "1" ? document.getElementById('chkValPrice1'+$scope.IdUnique).value : document.getElementById('chkValPrice0'+$scope.IdUnique).value;
        chkValPrice = parseFloat(chkValPrice);
        if (chkValPrice == priceVal) {
            var isMatched = 1;
        } else {
            var isMatched = 0;
        }
        var P_and_l = (priceVal * stake) - stake;
        $scope.formData = {
            userId: sessionService.get('slctUseID'),
            ParantId: ParantId,
            loginId: loginId,
            selectionId: selectionId,
            matchId: $stateParams.MatchId,
            isback: isback,
            stake: stake,
            priceVal: priceVal,
            p_l: P_and_l,
            MarketId: MarketId,
            isMatched: isMatched,
            UserTypeId: $scope.UserTypeId,
            placeName: placeName,
            MatchName: $stateParams.matchName
        }
        $scope.getCheckLimitorVal($scope.formData);
    }
    $scope.chkUserValidation = function(formData) {
        get_userser.getCheckLimitOfPlaceBet(sessionService.get('slctUseID'), $stateParams.MatchId, $stateParams.MarketId, function(data) {

            $scope.viewUserAc1 = data.viewUserAc2[0];
            $scope.checkStakeLimit(formData);
        });
    }
    $scope.getCheckLimitorVal = function(formdata) {
	//
        get_userser.getCheckLimitOfPlaceBet(sessionService.get('slctUseID'), $stateParams.MatchId, $stateParams.MarketId, function(data) {

            $scope.viewUserAc1 = data.viewUserAc2[0];
            $scope.checkStakeLimit($scope.formData);
        });
        if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length > 0) {
            var vMaxProfit = 0,
                vMaxLoss = 0;
            $scope.RunnerValue.find(function(item, j) {
                if ($scope.formData.selectionId == item.SelectionId) {
                    if ($scope.formStatus == 0) {
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (($scope.formData.priceVal * $scope.formData.stake) - $scope.formData.stake)) < vMaxLoss) {
                            vMaxLoss = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (($scope.formData.priceVal * $scope.formData.stake) - $scope.formData.stake));
                        }
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (($scope.formData.priceVal * $scope.formData.stake) - $scope.formData.stake)) > vMaxProfit) {
                            vMaxProfit = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (($scope.formData.priceVal * $scope.formData.stake) - $scope.formData.stake));
                        }

                    } else {
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake - ($scope.formData.priceVal * $scope.formData.stake))) < vMaxLoss) {
                            vMaxLoss = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake - ($scope.formData.priceVal * $scope.formData.stake)));
                        }
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake - ($scope.formData.priceVal * $scope.formData.stake))) > vMaxProfit) {
                            vMaxProfit = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake - ($scope.formData.priceVal * $scope.formData.stake)));
                        }
                    }
                } else {
                    if ($scope.formStatus == 0) {
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (-$scope.formData.stake)) < vMaxLoss) {
                            vMaxLoss = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (-$scope.formData.stake));
                        }
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (-$scope.formData.stake)) > vMaxProfit) {
                            vMaxProfit = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + (-$scope.formData.stake));
                        }
                    } else {
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake)) < vMaxLoss) {
                            vMaxLoss = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake));
                        }
                        if (((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake)) > vMaxProfit) {
                            vMaxProfit = ((parseFloat(item.winValue) + parseFloat(item.lossValue)) + ($scope.formData.stake));
                        }
                    }
                }
            });
            $scope.SlMaxProfit = vMaxProfit;
            $scope.SlMaxLoss = vMaxLoss;
            console.log("" + $scope.SlMaxProfit + "|||||" + $scope.SlMaxLoss);
        }
    }

     $scope.checkStakeLimit = function(formdata) {

        //
        if ($scope.viewUserAc1 == angular.isUndefinedOrNull) {
            $scope.cValid = false;
            return false;
        } else if ($scope.viewUserAc1.lgnusrCloseAc == 0) {
            Dialog.autohide('Your Account is Closed...');
            $scope.stake = 0;
	    $scope.betValue[formdata.betval] = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = true;
            return false;
        } else if ($scope.viewUserAc1.mstrlock == 0) {
            Dialog.autohide('Your Account is InActive...');
            $scope.stake = 0;
	    $scope.betValue[formdata.betval] = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = true;
            return false;
        } else if ($scope.viewUserAc1.lgnusrlckbtng == 0) {
            Dialog.autohide('Your Betting is Locked...');
            $scope.stake = 0;
	    $scope.betValue[formdata.betval] = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = true;
            return false;
        } else if (parseInt($scope.viewUserAc1.stakeLimit) != 0 && parseInt($scope.viewUserAc1.stakeLimit) < $scope.stake) {
            Dialog.autohide('Your Stake Limit is Over...');
            $scope.stake = 0;
	    $scope.betValue[formdata.betval] = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = true;
            return false;
        } 
else if (parseInt($scope.viewUserAc1.stakeLimit) != 0 && parseInt($scope.viewUserAc1.stakeLimit) < formdata.stake) {
            Dialog.autohide('Your Stake Limit is Over...');
//console.log(FancyData);

	    $scope.betValue[formdata.betval] = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = true;
            return false;
        } else if (-parseInt($scope.viewUserAc1.lgnUserMaxLoss) != 0 && -parseInt($scope.viewUserAc1.lgnUserMaxLoss) > $scope.SlMaxLoss) { //ye market wise aayegi n ki overall par
            Dialog.autohide('Your Max Loss is Over.....');
            $scope.stake = 0;
	    $scope.betValue[formdata.betval] = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = true;
            return false;
        } else if (parseFloat($scope.viewUserAc1.lgnUserMaxProfit) != 0 && parseFloat($scope.viewUserAc1.lgnUserMaxProfit) < $scope.SlMaxProfit) //sourabh 170102 new
        {
            Dialog.autohide('Your Max Profit is Over.....');
            $scope.stake = 0;
	    $scope.betValue[formdata.betval] = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = true;
            return false;
        } else if ($scope.GetMarketBackLayData != angular.isUndefinedOrNull && $scope.GetMarketBackLayData.inplay == 'false' && parseInt($scope.viewUserAc1.GoingInplayStakeLimit) != 0 && parseInt($scope.viewUserAc1.GoingInplayStakeLimit) < $scope.stake) {
            Dialog.autohide('Going Inplay Stake Limit is Over...');
            $scope.stake = 0;
	    $scope.betValue[formdata.betval] = 0;
            $scope.cValid = false;
            $scope.btnPlaceDis = true;
            return false;
        } else if ($scope.viewUserAc1 != angular.isUndefinedOrNull && $scope.viewUserAc1.lgnusrCloseAc == 1 && $scope.viewUserAc1.mstrlock == 1 && $scope.viewUserAc1.lgnusrlckbtng == 1 && (parseInt($scope.viewUserAc1.stakeLimit) >= $scope.stake || parseInt($scope.viewUserAc1.stakeLimit) == 0)) {
            $scope.cValid = true;
            $scope.btnPlaceDis = false;
            return true;
        } else {
 $scope.btnPlaceDis = false;
            alert("Problem Occered");
        }
    }
     $scope.getValColor = function(val) { //20-dec-2016 asha
	
        if (val == angular.isUndefinedOrNull || val == 0)
            return 'color:#000000';
        else if (val > 0)
            return 'color:#007c0e !important';
        else
            return 'color:#ff0000 !important';
    }
         $scope.getOddCalcVal = function(a, ovType,oddsLimit,volumeLimit) { //sourabh 161229
	$scope.oddsLimit=oddsLimit;
	$scope.volumeLimit=volumeLimit;
        var x = 0,
            y = 0,
            z = 0;
            
            if(isNaN(a) && a != angular.isUndefinedOrNull)
            {
                var ind = a.indexOf('$');
                if(ind>-1)
                {
                    a=a.replace('$','');
                }
                
            }
        switch (ovType) {
            case 1:
                if (a != angular.isUndefinedOrNull) {
                    x = a;
                    if ($scope.oddsLimit != angular.isUndefinedOrNull) y = $scope.oddsLimit;
                }
                //z =parseFloat((parseFloat(x) + parseFloat(y)).toFixed(2));
                z=isInt_number(a) ? parseFloat((parseFloat(x) + parseFloat(y))) : parseFloat((parseFloat(x) + parseFloat(y))).toFixed(2);

                break;
            case 2:
                if (a != angular.isUndefinedOrNull) {
                    x = a;
                    if ($scope.volumeLimit != angular.isUndefinedOrNull) y = $scope.volumeLimit;
                }
                z =  parseFloat((parseFloat(x) * parseFloat(y))).toFixed(0);
                break;
        }
        if (z > 0) return z;
        else return "";
    }
    $scope.getManulaPrice=function(p)
    {

        if(isInt_number(p))
        {
           return parseFloat(p);
        }
        else
        {
            return parseFloat(p).toFixed(2);
        }
    }
    function isInt_number(num) {
        return num % 1 === 0;
    }
  //  $scope.getNameFunc();
  //  $scope.callOddsFunc();
  //  $scope.countdown();

    $scope.$on("$destroy", function(event) {
        $timeout.cancel(marketTimer);
         $timeout.cancel(stopped);
        marketTimer = angular.isUndefinedOrNull;
    });
    /*start code for Fancy*/
    $scope.$on("$destroy", function(event) {
        $interval.cancel($scope.si_getMatchUnmatchData);
        $scope.si_getMatchUnmatchData = angular.isUndefinedOrNull;

    }); 
    $scope.showSessionFancy = function(fanctTypeId, fanctId) {
        $scope.sessionFancy = fanctId;
        $scope.sessionFancyType = fanctTypeId;
        get_userser.GetFancyData($stateParams.MatchId, $scope.sessionFancy, sessionService.get('user_id'), sessionService.get('type'), $scope.sessionFancyType, function(response) { //sourabh 170125_1
            $scope.FancyData = response.data.fancyForm;
            $scope.showOdd1 = false;
            $scope.GetFancyBal();
        });
    }
    $scope.checkValidation = function(sessionData,checkValidation) { //sourabh 170125
        if (sessionData.betValue == "" || sessionData.betValue <= 0) {
            Dialog.autohide('You cannot play at zero Stake...');
            $(".betOverlaypre"+checkValidation).removeClass('betOverlay');
            $(".betOverlaypre"+checkValidation).hide();
            focus('betValue');
            return false;
        }
        return true;
    }
	$scope.CallSession = function(FancyObject,index,isback)
	{

	$scope.UserTypeId = sessionService.get('type');
        $scope.UserId = sessionService.get('slctUseID');
        $scope.ParantId = sessionService.get('slctParantID');
        $scope.loginId = sessionService.get('user_id');
        $scope.slctUseTypeID = sessionService.get('slctUseTypeID');
		if (deviceDetector.device == 'unknown') {
                var DIVICE = 'Desktop';
            } else {
                var DIVICE = deviceDetector.device;
            }
	 var deviceInformation = " browser: " + deviceDetector.browser + " browser_version :" + deviceDetector.browser_version + "  device: " + DIVICE + "  OS : " + deviceDetector.os + " os_version: " + deviceDetector.os_version;
	
	 var OddsNumber =0;
	 if (isback == 0) {
                    OddsNumber = FancyObject.SessInptYes;
                } else {
                    OddsNumber = FancyObject.SessInptNo;
                }

	$scope.arrayObj={
                userId: $scope.UserId,
                ParantId: $scope.ParantId,
                loginId: $scope.loginId,
                selectionId: FancyObject.FncyId+"_"+FancyObject.MatchID,
                matchId: FancyObject.MatchID,
                isback: isback,
                stake:0,
                priceVal: parseInt(OddsNumber),
                p_l: 0,
                MarketId: FancyObject.market_id,
                isMatched: 1,
                UserTypeId: $scope.UserTypeId,
                placeName: '',
                MatchName: FancyObject.HeadName,
                deviceInfo: deviceInformation,
                inplay: '',
                ApiVal: 0,
		unique_id:FancyObject.FncyId+"_"+FancyObject.MatchID,
		is_session_fancy:'Y',
		IsErrorShow:false,
		Message:'',
		SessInptNo:FancyObject.SessInptNo,
		SessInptYes:FancyObject.SessInptYes,
		NoValume:FancyObject.NoValume,
		YesValume:FancyObject.YesValume,
		//OddsNumber:OddsNumber,
		OddValue:isback,
		FancyId:FancyObject.FncyId,
		pointDiff:FancyObject.pointDiff,
		HeadName:FancyObject.HeadName,
		ind_fancy_selection_id:FancyObject.ind_fancy_selection_id,
		type:sessionService.get('type'),
		FancyID: FancyObject.ID,
		TypeID: FancyObject.TypeID,
		SportId:"111",
		matchdate:$scope.dateForm,
        max_bet_liability:FancyObject.max_session_bet_liability
            };
/*{"unique_id":index,"is_session_fancy":"Y","MarketId":"1.146701355","ind_fancy_selection_id":2,"betValue":"500","FancyID":"290","matchId":"28844828","OddValue":1,"type":"3","OddsNumber":"99","TypeID":"2","HeadName":"virat kohli 1st inning runs","SessInptNo":"99","SessInptYes":"100","sportId":"4","FancyId":"108","pointDiff":"10.00","deviceInformation":"browser: chrome browser_version :68.0.3440.106  device: Desktop  OS : windows os_version: windows-7"}*/
	$rootScope.$broadcast('CallAddBackOrLay',$scope.arrayObj);
	}
            $scope.openfancy = {};
            $scope.display_Yesfancy = function(sessionValue, id,indexVal) { //sourabh 170125
                $(".betOverlaypre"+indexVal).hide();
                if (!$scope.openfancy) {
                    $scope.openfancy = {};
                }
                if(!$scope.betValue) {
                    $scope.betValue = {};
                }
                $scope.openfancy[id] = {yes: true, open: true};
                if (sessionService.get('slctUseTypeID') == "3") {
                    $scope.isBackYes = 1;
                    $scope.showOdd1 = true;
                    $scope.betValue[id] = 0;
                    //$scope.sessionValue = parseInt(sessionValue);
                    $scope.userType = sessionService.get('type');
                    $scope.UserTypeId = sessionService.get('slctUseTypeID');
                    focus('betValueLay');

                } else
                    Dialog.autohide('Please Select Valid User');
            }
            $scope.display_Nofancy = function(sessionValue, id,indexVal) { //sourabh 170125
                $(".betOverlaypre"+indexVal).hide();
                if (!$scope.openfancy) {
                    $scope.openfancy = {};
                }
                if(!$scope.betValue) {
                    $scope.betValue = {};
                }
                $scope.openfancy[id] = {yes: false, open: true};
                if (sessionService.get('slctUseTypeID') == "3") {
                    $scope.isBackYes = 0;
                    $scope.showOdd1 = true;
                    $scope.betValue[id] = 0;
                    //$scope.sessionValue = parseInt(sessionValue);
                    $scope.userType = sessionService.get('type');
                    $scope.UserTypeId = sessionService.get('slctUseTypeID');
                    focus('betValueLay');
                } else
                    Dialog.autohide('Please Select Valid User');
            }
            $scope.GetFancyBal = function() { //sourabh 170125
                ////
                get_userser.GetFancyBal($scope.FancyData[0].ID, function(response1) {
                    ////
                    if (response1 == null) {
                        $scope.TotalBet = 0;
                    } else {
                        $scope.TotalBet = response1;
                    }


                });
            }
            $scope.GetBetValueReset = function(Value1, hideOdd, id) {
                if (!$scope.openfancy) {
                    $scope.openfancy = {};
                }
                if(!$scope.betValue) {
                    $scope.betValue = {};
                }
                $scope.openfancy[id] = {open: false};
                $scope.betValue[id] = parseInt(Value1);
                if (hideOdd) $scope.showOdd1 = !hideOdd;
            }
		//$scope.betValue[id]=0;
                     $scope.GetBetValue = function(Value1, id) {
               // 

                if(!$scope.betValue) {
                    $scope.betValue = {};
                }
                $scope.betValue[id] = parseInt($scope.betValue[id]) + parseInt(Value1);//parseInt($scope.betValue[id]) +
 if (Value1 == 0) {}
      // 
       // $scope.MarketId = $stateParams.MarketId;
        $scope.UserTypeId = sessionService.get('type');
                  //  $scope.stack=Value1;
        $scope.formData = {
            stake: $scope.betValue[id],
      
            MarketId: $scope.MarketId,
        
            UserTypeId: $scope.UserTypeId,
betval:id
  
        }
      // $scope.getCheckLimitorVal($scope.formData);
                $scope.chkUserValidation($scope.formData);
       $scope.getCheckLimitorVal($scope.formData);
            }

  $scope.GetBetValue1 = function(Value1, id) {
                //

                if(!$scope.betValue) {
                    $scope.betValue = {};
                }
               $scope.betValue[id] =  parseInt(Value1);//parseInt($scope.betValue[id]) +

 if (Value1 == 0) {}
      // 
        $scope.MarketId = $stateParams.MarketId;
        $scope.UserTypeId = sessionService.get('type');
   $scope.stack=Value1;
        $scope.formData = {
            stake: $scope.stack,
      
            MarketId: MarketId,
        
            UserTypeId: $scope.UserTypeId,
betval:id
  
        }
                $scope.chkUserValidation($scope.formData);
       $scope.getCheckLimitorVal($scope.formData);
              
            }
            $scope.saveSessionBet = function(pointDiff,FancyData,IndexVal,getbetval) { 
                

if(FancyData.MaxStake >= getbetval){
                $(".betOverlaypre"+IndexVal).show();
                $(".betOverlaypre"+IndexVal).addClass('betOverlay');
                var HeadName = FancyData.HeadName;
                var SessInptNo = FancyData.SessInptNo;
                var SessInptYes = FancyData.SessInptYes;
                var FncyId = FancyData.FncyId;
                var sportId = FancyData.SprtId;
                var UserTypeId = sessionService.get('slctUseTypeID');
                var UserId = sessionService.get('slctUseID');
                var loginId = sessionService.get('user_id');
                var ParantId = sessionService.get('slctParantID');
                var amount = document.getElementById('betValueLay'+IndexVal).value;
                if ($scope.isBackYes == 0) {
                    OddsNumber = SessInptYes;
                } else {
                    OddsNumber = SessInptNo;
                }
                if (deviceDetector.device == 'unknown') {
                    var DIVICE = 'Desktop';
                } else {
                    var DIVICE = deviceDetector.device;
                }
                var deviceInformation = '"' + " browser: " + deviceDetector.browser + " browser_version :" + deviceDetector.browser_version + "  device: " + DIVICE + "  OS : " + deviceDetector.os + " os_version: " + deviceDetector.os_version + '"';
                var sessionData = {
                    userId: UserId,
                    ParantId: ParantId,
                    loginId: loginId,
                    betValue: amount,
                    FancyID: FancyData.ID,
                    matchId: $stateParams.MatchId,
                    OddValue: $scope.isBackYes,
                    type:sessionService.get('type'),
                    OddsNumber: OddsNumber,
                    TypeID: FancyData.TypeID,
                    HeadName: HeadName,
                    SessInptNo: SessInptNo,
                    SessInptYes: SessInptYes,
                    sportId: sportId,
                    FancyId: FncyId,
                    pointDiff: pointDiff,
                    deviceInformation: deviceInformation
                }
		var callUrl='Lstsavemstrcontroller/save_session_bet';
		if(FancyData.is_indian_fancy==1)
		{
			callUrl='Lstsavemstrcontroller/save_indian_session_bet';	
		}
		else{
			callUrl='Lstsavemstrcontroller/save_session_bet';
		}
                if (amount >= 500 && amount <= 200000) {
                    if ($scope.checkValidation(sessionData,IndexVal)) {
                        $timeout(function() {
                            $http({ method: 'POST',url: BASE_URL + callUrl,data: sessionData,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(data) {
                                $scope.showOdd1 = false;
                                if(data.error>=0){                                
                                    get_userser.GetWALLibiInfo(sessionService.get('slctUseID'));
                                    Dialog.autohide(data.message);
                                    $(".betOverlaypre"+IndexVal).hide();
                                    $(".betOverlaypre"+IndexVal).removeClass('betOverlay');
				     $scope.GetBetValueReset(0,true,FancyData.ID);
                                    $scope.GetUserData();
                                }else if(data.error < 0){                                
                                    Dialog.autohide(data.message);
                                    $(".betOverlaypre"+IndexVal).hide();
                                    $(".betOverlaypre"+IndexVal).removeClass('betOverlay');
                                }
                            });
                        }, 2000);
                    }
                    
                } else if (amount < 500) {
                    Dialog.autohide('Please Enter Min 500 Stake');
                    $scope.loadingM = false;
                }else if(amount > 200000){
                    Dialog.autohide('Please Enter Max 200000 Stake');
                    $scope.loadingM = false;
                }
                
                    }else{
		 Dialog.autohide('Your max Stack limit is over');
}
               
                
                
            };
           
    /*end of the code Fancy*/
    $scope.deleteUser = function (betId, userId) {
        var result = confirm("Are you sure want to delete Records Unmatched");
        if (result) {
            $http.get('Betentrycntr/deleteGetbetting/' + betId + '/' + userId).success(function (data, status, headers, config) {
                /*Dialog.autohide(data.message);*/
                Dialog.autohide("Record Deleted Successfully...");
                $http.get('Betentrycntr/GatBetData/' + 0 + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                    $scope.UserData = data.betUserData;
                   // $scope.getBetsData();
                });
                $http.get('Chipscntrl/getChipDataById/' +  sessionService.get('user_id')).success(function (data, status, headers, config) {
                    $scope.cipsData = data.betLibility;
                    sessionService.set('FreeChips', $scope.cipsData[0].FreeChip);
                    sessionService.set('ChipInOut', $scope.cipsData[0].Chip);
                    sessionService.set('Liability', $scope.cipsData[0].Liability);
                    sessionService.set('Balance', $scope.cipsData[0].Balance);
                    sessionService.set('P_L', $scope.cipsData[0].P_L);
                    $scope.$watch('sessionService', function (newVal, oldVal) {
                        $scope.FreeChips = $scope.cipsData[0].FreeChip;
                        $scope.ChipInOut = $scope.cipsData[0].Chip;
                        $scope.Liability = $scope.cipsData[0].Liability;
                        $scope.Balance = $scope.cipsData[0].Balance;
                        $scope.P_L = $scope.cipsData[0].P_L;
                    });
                    $rootScope.user = sessionService.get('slctUseName');
                    $rootScope.Balance = sessionService.get('Balance');
                    $rootScope.Liability = sessionService.get('Liability');
                });



            });

        }

    }
    $scope.FancyData=[];
  $scope.FancyDataTemp=[];
    $scope.getFancyList = function(marketId) {
	$scope.getFancyTimer=$timeout(function(){
      $http({
                    method: 'GET',
                    url: 'Apicontroller/matchLstIndianSession/'+$scope.MatchId+'/'+marketId,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(result) {

		if(result.data!=angular.isUndefinedOrNull && result.data.length!=$scope.FancyData.length)
		{
		 $scope.FancyData = result.data;
		}
		else
		{
            $scope.FancyData = result.data;
            if(result.data!=angular.isUndefinedOrNull){
                $scope.FancyDataTemp= result.data;
                for(var i=0;i<$scope.FancyData.length;i++) {
                    var inde = $scope.FancyDataTemp.findIndex(x=>x.ID==$scope.FancyData[i].ID);
                    if (inde > -1) {
                        
                        if($scope.FancyDataTemp[inde].fancy_position.length>0)
                        {
                            $scope.FancyData[i].fancy_position=$scope.FancyDataTemp[inde].fancy_position;
                            $scope.FancyData[i].max_exposure=$scope.FancyDataTemp[inde].max_exposure;
                        }
                        $scope.FancyData[i].max_session_bet_liability=$scope.FancyDataTemp[inde].max_session_bet_liability;
                        $scope.FancyData[i].max_session_liability=$scope.FancyDataTemp[inde].max_session_liability;

                    }

                }
            }


		}

		if($scope.isSessionNull)
		{

            $scope.FancyNull();
		}
$scope.getFancyList(marketId);	
}).error(function(err){
			 $scope.loading = false;
          $scope.getFancyList(marketId);
		});
		
	},1000);	

    }

    $scope.UpdateAdminFancyList = function(marketId) {
$scope.UpdateAdminFancyTimer=$timeout(function(){
      $http({
                    method: 'GET',
                    url: 'Apicontroller/matchLstAdminSession/'+$stateParams.MatchId+'/'+marketId,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(result) {

$scope.AdminFancyLiveData=result.data;
if($scope.AdminFancyLiveData.length>0)
{
				       for(var i=0;i<$scope.FancyData.length;i++)
                        {
                            
                            if($scope.FancyData[i].fancy_mode=="M")
                            {
			
				var  inde = $scope.AdminFancyLiveData.findIndex(img => img.ID ===$scope.FancyData[i].ID);
                                if(inde > -1)
                                {
                                var obj = $scope.AdminFancyLiveData[inde];
                                if(obj!=angular.isUndefinedOrNull)
                                {
                                $scope.FancyData[i].SessInptNo=obj.SessInptNo;
                                $scope.FancyData[i].SessInptYes=obj.SessInptYes;
				$scope.FancyData[i].NoValume=obj.NoValume;
                                $scope.FancyData[i].YesValume=obj.YesValume;
				$scope.FancyData[i].MaxStake=obj.MaxStake;
                                $scope.FancyData[i].pointDiff=obj.pointDiff;
				$scope.FancyData[i].rateDiff=obj.rateDiff;
                                $scope.FancyData[i].fancyRange=obj.fancyRange;
                                $scope.FancyData[i].DisplayMsg=obj.DisplayMsg;
                                  $scope.FancyData[i].active=obj.active;
                                  $scope.FancyData[i].max_session_bet_liability=obj.max_session_bet_liability;
                                   // $scope.FancyData[i].fancy_position=obj.fancy_position;

                                }
    
                                }
                                else
                                {
                                $scope.FancyData[i].SessInptNo='';
                                $scope.FancyData[i].SessInptYes='';
                                $scope.FancyData[i].DisplayMsg='Result Awaiting';
                                    $scope.FancyData[i].active= 4;

                                }
    
                            
                            }
                        }
}
else {

}
		 $scope.UpdateAdminFancyList(marketId);

			}).error(function(err){
			 $scope.loading = false;
          $scope.UpdateAdminFancyList(marketId);
		});	
},1000);
    }


    $scope.CallColor=function(Oldprice,NPrice)
    {
        if(Oldprice!=NPrice)
                    {
                        return true;
                    }
                    else{
                        return false;
                    }
    }

$scope.ScoreBoard=function()
{
    $scope.scoreTimeOut = $timeout(function(){
	$http.get("https://www.lotusbook.com/api/match-center/stats/4/"+$scope.MatchId).success(function(data){

		$scope.ScoreResult=data.result;
		$scope.ScoreBoard();
	});
},1000)
}
	$scope.ScoreBoard();

    $scope.$on('$destroy', function () {
	    $timeout.cancel($scope.ajaxTimer);
	    $timeout.cancel($scope.getMarketlstTimer);
	    $timeout.cancel($scope.getFancyTimer);
	    $timeout.cancel($scope.GetScoreTimer);
	    $timeout.cancel($scope.UpdateAdminFancyTimer);
		  $timeout.cancel($scope.scoreTimeOut);
   });
$scope.ClearAllTimeOut=function()
{
	
	    $timeout.cancel($scope.getMarketlstTimer);
	    $timeout.cancel($scope.ajaxTimer);
	    $timeout.cancel($scope.getFancyTimer);
	    $timeout.cancel($scope.GetScoreTimer);
	    $timeout.cancel($scope.UpdateAdminFancyTimer);
		$scope.GetScoreTimer=null;
		  $timeout.cancel($scope.scoreTimeOut);
}
$scope.$on('MatchOddsTimeOut',function(event,data){
$scope.ClearAllTimeOut();
});
}]);
  app.directive('ngEnter', function() {
    return function(scope, elem, attrs) {
//alert('df');
      elem.bind("keydown keypress", function(event) {
        // 13 represents enter button
        if (event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  });


