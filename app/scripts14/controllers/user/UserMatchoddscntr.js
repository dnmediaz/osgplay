app.controller('Matchoddscntr', ['$scope', '$http', '$stateParams', 'sessionService', '$timeout', 'Dialog', '$rootScope', 'deviceDetector', 'get_userser', '$mdDialog', 'speech', '$filter', '$location', '$state', '$interval', '$window', 'Base64', function ($scope, $http, $stateParams, sessionService, $timeout, Dialog, $rootScope, deviceDetector, get_userser, $mdDialog, speech, $filter, $location, $state, $interval, $window, Base64) {
    $scope.$on('test_dir', function (event, data) {
        $scope.getNameFunc();
    });

    $scope.PLAYPAUSE = 0;
    $scope.loading = false;
    $scope.dateForm = new Date($stateParams.date);
    $scope.sportId = 0;
    $scope.SPORTID = $stateParams.sportId;
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
    $scope.FileterArray = [];
    $scope.loadingM1 = {};
    $scope.loadingS = {};
    $scope.IdUnique = 0;
    $scope.equalBhav = false;

    $scope.betButtons = [{'session': '100', 'value': 100},{'session': '500', 'value': 500}, {'session': '1K', 'value': 1000}, {
        'session': '2K',
        'value': 2000
    }, {'session': '5K', 'value': 5000}, {
        'session': '10K',
        'value': 10000
    }, {'session': '25K', 'value': 25000}, {'session': '50K', 'value': 50000}];
    $scope.sessionbetButtons = [2000, 5000, 10000, 25000, 50000, 100000, 150000];
    $scope.sessionButtons = [{'session': '100', 'value': 100},{'session': '500', 'value': 500}, {'session': '1K', 'value': 1000}, {
        'session': '2K',
        'value': 2000
    }, {'session': '5K', 'value': 5000}, {
        'session': '10K',
        'value': 10000
    }, {'session': '25K', 'value': 25000}, {'session': '50K', 'value': 50000}];
    $scope.minBet = 100;
    $scope.minSessionBet = 100;
    $scope.stopScore = "";
    $scope.scoreTimeOut = "";
    $scope.fetchAllDeclaredSessionS = "";
    $scope.fetchAllSeesionOddBet = "";
    $scope.showScore = false;
    $rootScope.MyLenth = 0;
    $scope.isconfirmbet = sessionService.get('config_unmatched');
    $scope.scoreShowtype = '';
   // $scope.uniqueNumber.previous = 0;
    $scope.stakeIds = [];
    $scope.prevAction = {};
    $scope.priceVal1 = {};
    $scope.formStatus = {};
    $scope.selectionId = {};
    $scope.placeName1 = {};
    $scope.TRunnerValue1 = {};
    $scope.stake2 = {};
    $scope.oldstake2 = {};
    $scope.oldpriceval = {};
    $scope.priveobj = {};
    $scope.prive = {};
    $scope.isExistIndianFancy = true;
    $scope.isExistFancy = true;
    $scope.FancyData = [];
    $scope.FancyDataTemp = [];
    $scope.OddsBetUserData = [];
    $scope.SessionBetUserData = [];
    $scope.counter = 0;
    $scope.openfancy = {};
    $scope.SessInptYes = {};
    $scope.SessInptNo = {};
    $scope.stake1 = {};
    $scope.comStake = 0;
    var stopped;
    var currentdate = new Date();
    var marketTimer;
    var stopped21;
    var totalMatch = 0;
    var selectedRunner = null;
    var oldId = 0;
    var dataResult;
    var oldval = 0;
    var oldIndex = 0;
    var callType1 = "1";
    var uniqueNumber = {};
    var websocket = null;
    var phpsoket = null;
    var sessionsocket = null;
    var urlIp = $rootScope.gurlIp;
    var urlArray = $rootScope.gUrlArray;
    var ajaxTimer = "";
    var isMatched;
    var MarketId = $stateParams.MarketId;
    var matchStatus = "OPEN";
    var getMarketlstTimer = "";
    var getFancyTimer='';


    var authdata = Base64.encode(sessionService.get('user') + ':' + sessionService.get('lgPassword'));
    var Bauthdata = 'Basic ' + authdata;
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
    // $scope.ScoreBoard = function () {
    //     if ($state.current.name == "userDashboard.Matchodds") {

    //         $.get("https://www.lotusbook.com/api/match-center/stats/4/" + $scope.MatchId, function (data, status) {

    //             $scope.ScoreResultData = data.result;
    //             $scope.ScoreResult = data.result;
    //             $scope.scoreTimeOut = $timeout(function () {
    //                 $scope.ScoreBoard();

    //             }, 1000)
    //         });

    //     }
    // }


    $scope.$on('$destroy', function () {
        $timeout.cancel($scope.scoreTimeOut);
    })


    $scope.isExistIndianFancy=true;
    $scope.isExistFancy=true;
    $scope.InClick=-1;
    $scope.LeaderShow=function(indx)
	{
        debugger; 
		if(indx==$scope.InClick)
		{
            $scope.InClick=-1;
		}
		else {
            $scope.InClick=indx;
		}

    }
    

    $scope.fetchCall = 1;
    $scope.fetchAllDeclaredSession = function () {
        fetchAllDeclaredSessionS = $timeout(function () {
            if ($state.current.name == "userDashboard.Matchodds") {

                $http.get('Geteventcntr/declaredSessionList/' +  sessionService.get('user_id')+ '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                    $scope.alllDeclaredSession = data.matchStatement.matchData;
                    $scope.totalPossion = data.matchStatement.totalProfit;
                    $scope.fetchAllDeclaredSession();
                });


                $scope.fetchCall = 2;
            }
        }, $scope.fetchCall == 1 ? 0 : 6000);

    };
    $scope.fetchAllDeclaredSession();

    // $scope.GetScore = function () {
    //     var eventIds = $stateParams.MatchId;
    //     if ($state.current.name == "userDashboard.Matchodds") {
    //         $http.get($rootScope.redisUrlRead+ 'score&match_id=' + eventIds).success(function (result) {

    //             if (result.length != 0) {
    //                 $scope.Documents = result[0];
    //                 $scope.displayScore = true;

    //                 if ($scope.Documents.eventTypeId == 2) {
    //                     $scope.Home = result[0].score.home.gameSequence;
    //                     $scope.away = result[0].score.away.gameSequence;
    //                 }
    //             } else {
    //                 $scope.displayScore = false;
    //                 $interval.cancel($scope.stopScore);
    //             }
    //         });
    //     }
    // }


        $scope.GetScore = function () {
        var eventIds = $stateParams.MatchId;
        $scope.ScoreTimeOut = $timeout(function () {
            if ($state.current.name == "userDashboard.Matchodds") {
                $http.get(BASE_URL + 'Geteventcntr/GetScoreApi/' + eventIds).then(function (result) {

                    if (result.data.length != 0) {
                        $scope.Documents = result.data[0];
                        $scope.displayScore = true;
                        if ($scope.Documents.eventTypeId == 2) {
                            $scope.Home = result.data[0].score.home.gameSequence;
                            $scope.away = result.data[0].score.away.gameSequence;
                        }
                    } else {
                        $scope.displayScore = false;
                        $interval.cancel($scope.stopScore);
                    }
                    $scope.GetScore();

                });
            }
        }, 1000);

        //var eventIds = '28448035';

    }
    $scope.stopScore = $interval(function () {
        //Display the current time.
        $scope.GetScore();
    }, 5000);
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.stopScore);

    });

    $scope.GetMarketListId = function () {

        if ($state.current.name == "userDashboard.Matchodds") {


            if (callType1 == 1) {
                $scope.loading = true;
            }
            else {
                $scope.loading = false;
            }

            //  socket.emit('CallGetMarketListId', {auth:Bauthdata,MatchId:$scope.MatchId,UserId:$scope.UserId});
            $http({
                method: 'GET',
                url: 'Apicontroller/getMarketListing/' + $scope.MatchId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                try {


                    if (data.code == 14) {
                        Dialog.autohide(data.message);
                        $scope.loading = false;
                        $scope.IsShowPage = false;
                        $state.go("userDashboard.Home");
                    }
                    else {
                        $scope.MatchOddsmsg = data.data.DisplayMsg;
                        $scope.MatchOddsStatus = data.data.msgStatus;
                        $scope.MatchBetAllow = data.data.isBetAllowedMatch;
                        $scope.MarketBetAllow = data.data.isBetAllowedMarket;
                        $scope.isBetAllowedOnManualMatchOdds = data.data.isBetAllowedOnManualMatchOdds;
                        $scope.is_manual = data.is_manual;
                             if(data.scoreboard_id != angular.isUndefinedOrNull){
                    $scope.scoreboard_id=data.scoreboard_id;

                } 


                         if($scope.is_manual == 0 && callType1 ==1){
                            $scope.ScoreBoard();

                          }
                   
                        $scope.isManualMatchOdds = data.data.isManualMatchOdds;
                        if (data.data.result == 0 || data.data.marketid == "") {
                            Dialog.autohide("Match Closed.");
                            $scope.loading = false;
                            $scope.IsShowPage = false;
                            $state.go("userDashboard.Home");
                        }

                        else if (callType1 == 1) {
                            var tResult = data;
                            $scope.oddsLimit = parseFloat(tResult.data.volumeLimit[0].oddsLimit);
                            $scope.volumeLimit = parseFloat(tResult.data.volumeLimit[0].volumeLimit);


                            $timeout.cancel(ajaxTimer);
                            ajaxTimer = null;
                            if (tResult.error) {

                                $scope.BindSoketMarket(tResult);
                            }
                            else {
                                $scope.IsShowPage = true;
                                $scope.GetScore();
                                $scope.BindSoketMarket(tResult);
                            }
                        }
                        getMarketlstTimer = $timeout(function () {
                            $scope.GetMarketListId();

                        }, 1000);
                    }
                }
                catch (e) {
                    getMarketlstTimer = $timeout(function () {
                        $scope.GetMarketListId();

                    }, 1000);
                }

            }).error(function (err) {
                $scope.loading = false;
                getMarketlstTimer = $timeout(function () {
                    $scope.GetMarketListId();

                }, 1000);
            });

        }

    }
    $scope.GetMarketListId();
    $scope.$on('$destroy', function () {
        $timeout.cancel(getMarketlstTimer);

    })

        $rootScope.MatchScoreApi="https://score.crakex.in:3290/node/matchid/";
    $scope.ScoreBoard = function () {
        return;
           $scope.scoreTimeOut = $timeout(function(){
        $.ajax({
            url:$rootScope.MatchScoreApi+$scope.scoreboard_id,
           // url:$rootScope.MatchScoreApi,
            type:"GET",
            headers: { 'TokenId': sessionService.get('TokenId')},
            success:function(data){
                $scope.ScoreResult=data;
                if(data.length != 0){
                    $scope.lastover=(data[0].lb).split('|');
                    if($scope.ScoreResult[0].bd%6 != 0){
                        $scope.overlast=(($scope.ScoreResult[0].bd-($scope.ScoreResult[0].bd%6))/6)+1;
                    }else{
                        $scope.overlast=(($scope.ScoreResult[0].bd-($scope.ScoreResult[0].bd%6))/6);
                    }



                    if($scope.lastover.length==4 && $scope.lastover[3] != " "){
                        // $scope.lastover=($scope.lastover[]).split('.');
                        $scope.lastover1=($scope.lastover[3]).split('.');
                        $scope.lastover2=($scope.lastover[2]).split('.');
                        $scope.lastover3=($scope.lastover[1]).split('.');
                        $scope.overlast1=$scope.overlast-1;
                        $scope.overlast2=$scope.overlast-2;

                    }
                    else if($scope.lastover.length==4 && $scope.lastover[2] != " "){
                        $scope.lastover1=($scope.lastover[2]).split('.');
                        $scope.lastover2=($scope.lastover[1]).split('.');
                        $scope.lastover3=($scope.lastover[0]).split('.');
                        $scope.overlast1=$scope.overlast-1;
                        $scope.overlast2=$scope.overlast-2;
                    }
                    else if($scope.lastover.length==3 && $scope.lastover[2] != " "){
                        $scope.lastover1=($scope.lastover[2]).split('.');
                        $scope.lastover2=($scope.lastover[1]).split('.');
                        $scope.lastover3=($scope.lastover[0]).split('.');
                        $scope.overlast1=$scope.overlast-1;
                        $scope.overlast2=$scope.overlast-2;
                    }
                    else if($scope.lastover.length==3 && $scope.lastover[2] == " "){
                        $scope.lastover1=($scope.lastover[1]).split('.');
                        $scope.lastover2=($scope.lastover[0]).split('.');
                        $scope.overlast1=$scope.overlast-1;
                        //$scope.lastover3=($scope.lastover[0]).split('.');
                    }
                    else if($scope.lastover.length==2 && $scope.lastover[1] != " "){
                        $scope.lastover1=($scope.lastover[1]).split('.');
                        $scope.lastover2=($scope.lastover[0]).split('.');
                        $scope.overlast1=$scope.overlast-1;
                    }
                    else if($scope.lastover.length==2 && $scope.lastover[1] == " "){
                        $scope.lastover1=($scope.lastover[0]).split('.');
                        //$scope.lastover3=($scope.lastover[0]).split('.');
                    }
                    else if($scope.lastover.length==1 && $scope.lastover[0] != " "){
                        $scope.lastover1=($scope.lastover[0]).split('.');
                        //$scope.lastover3=($scope.lastover[0]).split('.');
                    }
                    else{
                        $scope.lastover1='';

                    }
                    /*  $scope.lastover1=($scope.lastover[0]).split('.');

                      if(data[0].lb != ''){
                          $scope.lastover2=(($scope.lastover[1]).split('.'));
                          $scope.lastover3=($scope.lastover[2]).split('.');
                      }*/


                    $scope.ScoreBoard();
                }else
                {
                    $scope.ScoreResult=undefined;

                }

            },
            error:function(data)
            {

                $scope.ScoreBoard();
            }
        })
/*  $http.get("https://www.lotusbook.com/api/match-center/stats/4/"+$scope.MatchId).success(function(data){

        $scope.ScoreResult=data.result;
        $scope.ScoreBoard();
    });*/
},1000)

    }











    $scope.ChangeMarketId = function (MarketId) {
        $scope.DisMarketId = MarketId;
        $scope.CallType = 'Second';
        var inde = $scope.MarketLst.indexOf($scope.MarketLst.filter(function (item) {
            return item == MarketId
        })[0]);
        //
        if (inde > -1) {
            var MatchOdds = $scope.FinalArray[inde];
            if (MatchOdds.marketName != "Match Odds") {
                $scope.MarketLst.splice(inde, 1);
            }
        }
        else {
            $scope.MarketLst.push(MarketId);
            $scope.loading = true;
        }
        var inde1 = $scope.FileterArray.indexOf($scope.FileterArray.filter(function (item) {
            return item.marketId == MarketId;
        })[0]);
        if (inde1 > -1) {

            $scope.FileterArray.splice(inde1, 1);
        }
        else {
            $scope.FileterArray = [];
            for (var m = 0; m < $scope.MarketLst.length; m++) {

                var inde2 = $scope.FinalArray.indexOf($scope.FinalArray.filter(function (item) {
                    return item.marketId == $scope.MarketLst[m];
                })[0]);
                if (inde2 > -1) {
                    $scope.FileterArray.push($scope.FinalArray[inde2]);
                }
            }

        }

    }
    $scope.loadRunner = function (id) {
        //BindIndianFancy
        var result = $scope.FileterArray.filter(function (item) {
            return item.marketId == id;
        })[0]
        if (result != null) {
            return result.runners;
        }
        else {
            return [];
        }
    }
    $scope.GetMarketRunner = function () {
        if ($scope.CallType == 'first') {
            var inde = $scope.FinalArray.indexOf($scope.FinalArray.filter(function (item) {
                return item.marketName == "Match Odds"
            })[0]);
            if (inde > -1) {
                $scope.MarketLst = [];
                $scope.FileterArray = [];
                MatchOdd = $scope.FinalArray[inde];
                $scope.FinalArray.splice(inde, 1);
                $scope.FinalArray.splice(0, 0, MatchOdd);
                $scope.MarketLst.push($scope.FinalArray[inde].marketId);
                $scope.FileterArray.push($scope.FinalArray[inde]);
                // $scope.loading = false;
            }
            else {
                $scope.MarketLst = [];
                $scope.FileterArray = [];
                if ($scope.FinalArray.length > 0) {
                    $scope.FileterArray.push($scope.FinalArray[0]);
                    $scope.MarketLst.push($scope.FinalArray[0].marketId);
                }
                //$scope.loading = false;
            }
        }
        else {
            $scope.loading = false;
        }
        stopped21 = $timeout(function () {
            if ($scope.MarketLst.length > 0) {
                //
                //socket.emit('callBackLaysOfMarketSetting', {auth:Bauthdata,marketIds:$scope.MarketLst,matchId:$scope.MatchId,UserId:$scope.UserId});
                //
            }
            $scope.GetMarketRunner();
        }, 2000);
    }
    $scope.getRandomSpan = function () {
        var date = Date.now();

        if (date <= uniqueNumber.previous) {
            date = ++uniqueNumber.previous;
        } else {
            uniqueNumber.previous = date;
        }
        $scope.stakeIds.push(date);
        $scope.stake2['field_' + date] = 0;
        $scope.stake1['field_' + date] = 0;
        $scope.oldstake2['field_' + date] = 0;
        $scope.oldpriceval['field_' + date] = 0;
        $scope.prevAction['field_' + date] = -1;
        return date;
        //return Math.floor((Math.random()*6)+1);
    }
    $scope.CommonFun = function (msg) {
        websocket.onclose();
        //Dialog.autohide(msg);
        $scope.loading = false;
        $scope.IsShowPage = false;
        //$state.go("dealerDashboard.Home");
    }

    $scope.MarketWinLoss = function (lstMarket) {
        //marketwinlossdata = $timeout(function () {
        if ($state.current.name == "userDashboard.Matchodds") {

            $http({
                method: "POST",
                url: 'Apicontroller/market_win_loss',
                data: {"matchId": $scope.MatchId, "MarketId": lstMarket},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.TRunnerValue = data.data;
                // $scope.MarketWinLoss(lstMarket);

            })
        }
        //  }, 1000);

    }
    $scope.MarketWinLoss($stateParams.MarketId);
    $scope.MarketWinLossByMId = function (MarketId) {

        var obj = null;
        if ($scope.TRunnerValue != angular.isUndefinedOrNull) {
            obj = $filter('filter')($scope.TRunnerValue, {marketId: MarketId})[0].runners;


        }
        return obj;

    }

    $scope.SocketMarket = function (result, manualstatus, manualdata) {
       ;
        $scope.manualstatus = manualstatus;

        //$scope.FancyLiveData = result.session;
        if (result != angular.isUndefinedOrNull) {
            var market = result.data.runners;
            var hst;
            var lst;
            if (manualstatus == 0) {
                $scope.OddsReplacement(result.data.runners);

                $scope.FancyLiveData = result.session;

            }
        }
        if (market != angular.isUndefinedOrNull) {
            // $scope.CheckBet(0);
            for (var m = 0; m < market.length; m++) {
                //   ;
                 ;
                var inde = $scope.FinalArray[0].runners.findIndex(img => img.id === market[m].selectionId);
                if (inde > -1) {
                    $scope.FinalArray[0].IsMatchDisable = false;
                    var lengthOfRunner = ($scope.FinalArray[0].runners[inde].ex.availableToBack.length > $scope.FinalArray[0].runners[inde].ex.availableToLay.length ? $scope.FinalArray[0].runners[inde].ex.availableToBack.length : $scope.FinalArray[0].runners[inde].ex.availableToLay.length)
                    for (var b = 0; b < lengthOfRunner; b++) {
                        var count = b + 1;
                        try {
                            $scope.FinalArray[0].runners[inde].ex.availableToBack[b].selected = $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToBack[b].price, $scope.FinalArray[0].runners[inde].ex.availableToBack[b].size, market[m].ex.availableToBack[b].price, market[m].ex.availableToBack[b].size);
                            //$scope.FinalArray[0].runners[inde].ex.availableToBack[b].Isdisabled =  $scope.checkchanges($scope.FinalArray[0].runners[inde].ex.availableToBack[b].price,$scope.FinalArray[0].runners[inde].ex.availableToBack[b].size, market[m].ex.availableToBack[b].price,market[m].ex.availableToBack[b].size);
//alert( $scope.FinalArray[0].runners[inde].ex.availableToBack[b].Isdisabled);
                        }
                        catch (e) {

                        }
                        try {
                            if (manualstatus == 0) {
                                $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = market[m].ex.availableToBack[b].price;
                            }
                            else {

                                if (b == 0) {
                                    if ($scope.FinalArray[0].runners[inde].ex.availableToBack[b] != angular.isUndefinedOrNull)
                                        $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = manualdata.ex.availableToBack[m].price - 1;
                                    else {
                                        $scope.FinalArray[0].runners[inde].ex.availableToBack.push({'price': manualdata.ex.availableToBack[m].price - 1});

                                    }
                                }

                                else {
                                    $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = market[m].ex.availableToBack[b].price;
                                }
                            }
                        } catch (e) {
                            if ($scope.FinalArray[0].runners[inde].ex.availableToBack[b] != angular.isUndefinedOrNull) {
                                $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = "";
                            }
                        }
                        try {
                            $scope.FinalArray[0].runners[inde].ex.availableToBack[b].size = market[m].ex.availableToBack[b].size;
                        }
                        catch (e) {

                        }


                    }
                    for (var b = 0; b < $scope.FinalArray[0].runners[inde].ex.availableToLay.length; b++) {
                        var count = b + 1;
                        try {
                            $scope.FinalArray[0].runners[inde].ex.availableToLay[b].selected = $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToLay[b].price, $scope.FinalArray[0].runners[inde].ex.availableToLay[b].size, market[m].ex.availableToLay[b].price, market[m].ex.availableToLay[b].size);
//$scope.FinalArray[0].runners[inde].ex.availableToLay[b].Isdisabled =  $scope.checkchanges($scope.FinalArray[0].runners[inde].ex.availableToLay[b].price,$scope.FinalArray[0].runners[inde].ex.availableToLay[b].size, market[m].ex.availableToLay[b].price,market[m].ex.availableToLay[b].size);
                        }
                        catch (e) {

                        }
                        try {

                            if (manualstatus == 0) {
                                $scope.FinalArray[0].runners[inde].ex.availableToLay[b].price = market[m].ex.availableToLay[b].price;
                            }
                            else {
                                if (b == 0)
                                    $scope.FinalArray[0].runners[inde].ex.availableToLay[b].price = manualdata.ex.availableToLay[m].price - 1;

                                else {
                                    $scope.FinalArray[0].runners[inde].ex.availableToLay[b].price = market[m].ex.availableToLay[b].price;
                                }
                            }
                        }
                        catch (e) {
                            if ($scope.FinalArray[0].runners[inde].ex.availableToLay[b] != angular.isUndefinedOrNull) {
                                $scope.FinalArray[0].runners[inde].ex.availableToLay[b].price = "";
                            }
                        }

                        $scope.FinalArray[0].runners[inde].ex.availableToLay[b].size = market[m].ex.availableToLay[b].size;
                    }


                }
            }
        }
        if (false) {

            for (var i = 0; i < $scope.FancyData.length; i++) {

                if ($scope.FancyData[i].is_indian_fancy == 1 && $scope.FancyData[i].fancy_mode == "A") {
                    if ($scope.FancyLiveData != angular.isUndefinedOrNull) {
                        var inde = $scope.FancyLiveData.findIndex(img => img.SelectionId === $scope.FancyData[i].ind_fancy_selection_id);
                        if (inde > -1) {
                            var obj = $scope.FancyLiveData[inde];
                            if (obj != angular.isUndefinedOrNull) {
                                $scope.FancyData[i].SessInptNo = obj.LayPrice1;
                                $scope.FancyData[i].SessInptYes = obj.BackPrice1;
                                $scope.FancyData[i].DisplayMsg = obj.GameStatus;
                                $scope.FancyData[i].active = obj.GameStatus == "" ? 1 : 4;
                            }

                        }
                        else {
                            $scope.FancyData[i].SessInptNo = '';
                            $scope.FancyData[i].SessInptYes = '';
                            $scope.FancyData[i].DisplayMsg = 'Result Awaiting';
                            $scope.FancyData[i].active = 4;
                        }


                    }
                }

            }

        }

    }
    $scope.GetOddSessionBets = function () {

        // alert($stateParams.MarketId);
        fetchAllSeesionOddBet = $timeout(function () {
            if ($state.current.name == "userDashboard.Matchodds") {


                $http.get('Betentrycntr/GatBetDataByOddsAndSession/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId ).success(function (data, status, headers, config) {


                    if ($scope.OddsBetUserData == undefined || $scope.SessionBetUserData == undefined) {
                        $scope.OddsBetUserData = data.OddsBetUserData;
                        $scope.SessionBetUserData = data.SessionBetUserData;
                        $scope.OddsBetUserDataTotal=data.OddsBetUserData.length;                                $scope.SessionBetUserDataTotal=data.SessionBetUserData.length;
                        //$scope.MarketWinLoss($stateParams.MarketId);
                        if($scope.OddsBetUserData.length == 1){
                            $scope.MarketWinLoss($stateParams.MarketId);
                        }

                    }
                        else if ($scope.OddsBetUserData.length != data.OddsBetUserData.length  ) {
                            $scope.MarketWinLoss($stateParams.MarketId);
                            $scope.OddsBetUserData = data.OddsBetUserData;
                            $scope.SessionBetUserData = data.SessionBetUserData;
                        $scope.OddsBetUserDataTotal=data.OddsBetUserData.length;                                $scope.SessionBetUserDataTotal=data.SessionBetUserData.length;
                        }
                      else if ($scope.SessionBetUserData.length != data.SessionBetUserData.length   ) {
                            $scope.MarketWinLoss($stateParams.MarketId);
                            $scope.OddsBetUserData = data.OddsBetUserData;
                            $scope.SessionBetUserData = data.SessionBetUserData;
                           $scope.OddsBetUserDataTotal=data.OddsBetUserData.length;
                           $scope.SessionBetUserDataTotal=data.SessionBetUserData.length;
                        }





                    $scope.GetOddSessionBets();

                }).error(function (err) {
                    $scope.GetOddSessionBets();
                });
            }

        }, 2000);
    }

    $scope.OddsReplacement = function (Runners) {
         ;
        var teamBack = [];
        var smallBack = 0;
        var smallLay = 0;
        var smallFinalFrom = 'back';

        if (Runners.length > 2) {
            for (k = 0; k < Runners.length; k++) {
                if (Runners[k].ex.availableToBack[0] != angular.isUndefinedOrNull || Runners[k].ex.availableToLay[0] != angular.isUndefinedOrNull) {
                    if (Runners[k].ex.availableToBack[0] != angular.isUndefinedOrNull)
                        Runners[k].ex.availableToBack[0].price = (Runners[k].ex.availableToBack[0].price) - 1;
                    if (Runners[k].ex.availableToLay[0] != angular.isUndefinedOrNull)

                        Runners[k].ex.availableToLay[0].price = (Runners[k].ex.availableToLay[0].price) - 1;

                }
                else {
                    Runners[k].ex.availableToBack[0].price = 0;
                    Runners[k].ex.availableToLay[0].price = 0;
                }
            }
        } else {
            for (i = 0; i < Runners.length; i++) {

                if (Runners[i].ex.availableToBack[0] != angular.isUndefinedOrNull) {

                    teamBack[i] = Runners[i].ex.availableToBack[0].price;

                    if (smallBack == 0) {
                        smallBack = Runners[i].ex.availableToBack[0].price;
                    } else {
                        if (smallBack > Runners[i].ex.availableToBack[0].price) {
                            smallBack = Runners[i].ex.availableToBack[0].price;
                        }
                    }
                }
                if (Runners[i].ex.availableToLay[0] != angular.isUndefinedOrNull) {
                    if (smallLay == 0) {
                        smallLay = Runners[i].ex.availableToLay[0].price;
                    } else {
                        if (smallLay > Runners[i].ex.availableToLay[0].price) {
                            smallLay = Runners[i].ex.availableToLay[0].price;
                        }
                    }
                }

            }


            if (teamBack.length >= 2) {
                if (teamBack[0] == teamBack[1]) {
                    Runners[0].ex.availableToLay[0].price = 0;
                    Runners[0].ex.availableToBack[0].price = Runners[0].ex.availableToBack[0].price > 0 ? (Runners[0].ex.availableToBack[0].price) - 1 : Runners[0].ex.availableToBack[0].price;
                    Runners[1].ex.availableToBack[0].price = Runners[1].ex.availableToBack[0].price > 0 ? Runners[1].ex.availableToBack[0].price - 1 : Runners[1].ex.availableToBack[0].price;
                    if (Runners[2] != angular.isUndefinedOrNull) {
                        Runners[2].ex.availableToBack[0].price = 0;
                        Runners[2].ex.availableToLay[0].price = 0;
                    }
                    Runners[1].ex.availableToLay[0].price = 0;
                }

            }

            if (smallLay < smallBack) {
                smallFinalFrom = 'lay';
            }
            if ((teamBack[0] != teamBack[1])) {

                for (k = 0; k < Runners.length; k++) {
                    if (smallFinalFrom != 'lay') {
                        if (Runners[k].ex.availableToBack[0] != angular.isUndefinedOrNull && Runners[k].ex.availableToBack[0].price == smallBack) {
                            Runners[k].ex.availableToBack[0].price = (Runners[k].ex.availableToBack[0].price) - 1;
                            if (Runners[k].ex.availableToLay[0] != angular.isUndefinedOrNull) {
                                if (Runners[k].ex.availableToBack[0].price >= 0.15 && Runners[k].ex.availableToBack[0].price < 0.70) {
                                    Runners[k].ex.availableToLay[0].price = (Runners[k].ex.availableToBack[0].price + 0.02);
                                    $scope.equalBhav = false;
                                }
                                else if (Runners[k].ex.availableToBack[0].price >= 0.70 && Runners[k].ex.availableToBack[0].price < 0.94) {
                                    Runners[k].ex.availableToLay[0].price = (Runners[k].ex.availableToBack[0].price + 0.03);
                                    $scope.equalBhav = false;
                                }
                                else if (Runners[k].ex.availableToBack[0].price >= 0.94 && Runners[k].ex.availableToBack[0].price < 0.98) {
                                    Runners[k].ex.availableToLay[0].price = 0;
                                    $scope.equalBhav = true;
                                    $scope.storelastPrice = (Runners[k].ex.availableToBack[0].price);
                                }
                                else if (Runners[k].ex.availableToBack[0].price > 0.97) {
                                    Runners[k].ex.availableToLay[0].price = 0;
                                    $scope.equalBhav = true;
                                    $scope.storelastPrice = 0.97;
                                }
                                else {
                                    Runners[k].ex.availableToLay[0].price = (Runners[k].ex.availableToBack[0].price + 0.01);
                                    $scope.equalBhav = false;
                                }

                            }
                        }
                        else {

                            if (Runners[k].ex.availableToBack[0] != angular.isUndefinedOrNull) {

                                if (($scope.storelastPrice == (smallBack - 1)) || $scope.equalBhav) {
                                    Runners[k].ex.availableToBack[0].price = $scope.storelastPrice;
                                }
                                else {
                                    Runners[k].ex.availableToBack[0].price = 0;
                                }

                            }

                            if (Runners[k].ex.availableToLay[0] != angular.isUndefinedOrNull)
                                Runners[k].ex.availableToLay[0].price = 0;
                        }
                    }
                    else {
                        if (Runners[k].ex.availableToLay[0] != angular.isUndefinedOrNull && Runners[k].ex.availableToLay[0].price == smallLay) {
                            Runners[k].ex.availableToLay[0].price = (Runners[k].ex.availableToLay[0].price) - 1;
                        } else {
                            if (Runners[k].ex.availableToBack[0] != angular.isUndefinedOrNull)
                                Runners[k].ex.availableToBack[0].price = 0;
                            if (Runners[k].ex.availableToLay[0] != angular.isUndefinedOrNull)
                                Runners[k].ex.availableToLay[0].price = 0;
                        }
                    }
                }
            }
        }
    }
 
    $scope.BindSoketMarket = function (result) {
        if (result.data != angular.isUndefinedOrNull) {
            $scope.marketIdLst = result.data.marketid;
            $scope.MarketId = result.data.marketid;
            //var callbackResult=$scope.SetResult($scope.marketIdLst);
            //$scope.MarketWinLoss(result.data.marketid);
            $scope.MarketLst = result.data.marketid.split(',');
            $scope.AllMarket = $scope.MarketLst;


            if (callType1 == 1) {
                var tempResult = result;
                var market = tempResult.data.runners;
                $scope.OddsReplacement(tempResult.data.runners);

                $scope.ApiResult = result;

                $scope.FinalArray.push(result.data);

                $scope.GetMarketBackLayDataSelectionName = $scope.FinalArray[0].runners;
                $scope.FinalArray[0].id = $scope.FinalArray[0].marketid;
                if ($scope.SPORTID == 4) {

                    $scope.getFancyList(result.data.marketid);
                    // $scope.UpdateAdminFancyList($scope.MarketId);
                    $scope.GetOddSessionBets();

                }
                callType1 = 2;
                /* if ($scope.isManualMatch == 1 || $scope.isManualMatchOdds == 1) {
                     $scope.CallManualOdds();
                 }*/
            }
            if ($state.current.name == "userDashboard.Matchodds" ) {
                get_userser.getSocketDataApiDetail($scope.marketIdLst, function (data) {
                    try {
                        //console.log(data);
                        var dataResult = data;
                        var tempResult = [];
                        $scope.market_sel_id = [];


                        if (dataResult != angular.isUndefinedOrNull && dataResult.length > 0 && dataResult[0] != angular.isUndefinedOrNull) {

                            if ($scope.marketIdLst != angular.isUndefinedOrNull) {
                                var ind = dataResult.findIndex(x => x.marketId == $scope.MarketId);
                                if (ind > -1) {
                                    tempResult.data = dataResult[ind];
                                    var tempArray = $scope.FinalArray[0];
                                    $scope.FinalArray[0].inPlay = tempResult.data.inPlay;

                                    // $scope.FinalArray[0] = tempResult.data;

                                    var market = tempResult.data.runner;
                                    $scope.OddsReplacement(tempResult.data.runners);

                                    // $scope.FinalArray[0].volumeLimit=tempArray.volumeLimit;
                                    // $scope.FinalArray[0].IsMatchDisable=tempArray.IsMatchDisable;
                                    // $scope.FinalArray[0].is_favourite=tempArray.is_favourite;

                                    if ($scope.FinalArray[0].mtype == "MATCH_ODDS") {
                                        $scope.BindIndianFancy(dataResult['session'], $scope.FinalArray[0].id);
                                    }


                                    if ($scope.FinalArray[0].runners.length > 0) {
                                        if ($scope.FinalArray[0].mtype == "MATCH_ODDS" || $scope.FinalArray[0].btype == "ODDS") {
                                            $scope.GetMarketBackLayDataSelectionName = $scope.FinalArray[0].runners;
                                        }

                                        for (var r = 0; r < $scope.FinalArray[0].runners.length; r++) {
                                            if ($scope.FinalArray[0].runners[r].selectionId != angular.isUndefinedOrNull) {
                                                $scope.FinalArray[0].runners[r].id = $scope.FinalArray[0].runners[r].selectionId;
                                            }

                                            if ($scope.FinalArray[0].runners[r].name == "" || tempArray.runners[r].name == angular.isUndefinedOrNull) {
                                                var sId = $scope.FinalArray[0].id + "-" + $scope.FinalArray[0].runners[r].id;
                                                $scope.FinalArray[0].runners[r].selection_id = sId;

                                                $scope.market_sel_id.push(sId);
                                            }
                                            else {
                                                var rindx = $scope.FinalArray[0].runners.findIndex(x => x.id == tempArray.runners[r].id);
                                                if (rindx > -1) {
                                                    $scope.FinalArray[0].runners[rindx].name = tempArray.runners[r].name;
                                                }
                                                if ($scope.FinalArray[0].mtype == "MATCH_ODDS" || $scope.FinalArray[0].btype == "ODDS") {
                                                    $scope.BindIndianFancy(dataResult['session'], $scope.FinalArray[0].id);
                                                }
                                                //$scope.CallSocketMarket();
                                            }
                                        }


                                    }
                                    else if ($scope.FinalArray[0].runners.length == 0) {
                                        $scope.FinalArray[0].runners = tempResult.data.runners;
                                        for (var r = 0; r < $scope.FinalArray[0].runners.length; r++) {
                                            if ($scope.FinalArray[0].runners[r].name == "" || $scope.FinalArray[0].runners[r].name == angular.isUndefinedOrNull || true) {
                                                var sId = $scope.FinalArray[0].id + "-" + $scope.FinalArray[0].runners[r].id;
                                                $scope.FinalArray[0].runners[r].selection_id = sId;
                                                $scope.market_sel_id.push(sId);
                                            }

                                        }


                                    }

                                    if ($scope.market_sel_id.length > 0) {
                                        $scope.SelectionName = [];
                                        var selection_id = $scope.market_sel_id.join(',');

                                        get_userser.getSelectionList(selection_id, function (data) {

                                            $scope.SelectionName = data;
                                            for (var j = 0; j < $scope.FinalArray.length; j++) {

                                                if ($scope.FinalArray[0].mtype == "MATCH_ODDS" || $scope.FinalArray[0].btype == "ODDS") {
                                                    $scope.BindIndianFancy(dataResult['session'], $scope.FinalArray[j].id);
                                                }
                                                for (var s = 0; s < $scope.SelectionName.length; s++) {
                                                    var indx = $scope.FinalArray[j].runners.findIndex(x => x.selection_id == $scope.SelectionName[s].selection_id)
                                                    if (indx > -1) {
                                                        $scope.FinalArray[j].runners[indx].name = $scope.SelectionName[s].runnername;
                                                    }
                                                }
                                                if ($scope.FinalArray[0].mtype == "MATCH_ODDS" || $scope.FinalArray[0].btype == "ODDS") {
                                                    $scope.GetMarketBackLayDataSelectionName = $scope.FinalArray[0].runners
                                                }
                                                // $scope.FinalArray[j].runners=tempArray.runners;

                                                $scope.CallSocketMarket();
                                            }

                                        });
                                    }

                                    //  $scope.FinalArray[0] = tempResult.data;
                                    callType1 = 2;
                                    $scope.CallSocketMarket();
                                    $scope.loading = false;
                                }
                                else {
                                    Dialog.autohide("Bhav not comming from api.");
                                    $scope.loading = false;
                                    $scope.IsShowPage = false;
                                    $timeout.cancel(ajaxTimer);

                                    $state.go("dashboard.Home");


                                }
                            }
                        }

                        else {
                            $scope.loading = false;
                            $scope.CallSocketMarket(result);

                        }
                    }
                    catch (e) {
                        $scope.CallSocketMarket(result);
                    }

                });
            }


        }

    }
    $scope.fetchManualBhav = function(temstore){
        $http.get($rootScope.redisUrlRead+'getmanualMatchOddsDetails&market_id=' + $scope.marketIdLst).success(function (data, status, headers, config) {
           // $scope.isManualMatchOdds = data.isManualMatchOdds;
            $scope.isManualMatchOddsData = data.data_formated;
            $scope.SocketMarket(temstore, $scope.isManualMatchOdds, $scope.isManualMatchOddsData);
        });


    }
    $scope.CallSocketMarket = function (result) {
        ajaxTimer = $timeout(function () {
            if ($state.current.name == "userDashboard.Matchodds" ) {
                get_userser.getSocketDataApiDetail($scope.marketIdLst, function (data) {
                    try {
                        
                        //console.log(data);
                        var dataResult = data; 
                        var tempResult = [];


                        if (dataResult != angular.isUndefinedOrNull && dataResult.length > 0 && dataResult[0] != angular.isUndefinedOrNull) {

                            if ($scope.marketIdLst != angular.isUndefinedOrNull) {
                                var ind = dataResult.findIndex(x => x.marketId == $scope.MarketId);
                                if (ind > -1) {
                                    tempResult.data = dataResult[ind];
                                    var tempArray = $scope.FinalArray[0];
                                    // $scope.FinalArray[0]=tempResult.data;
                                    if (tempResult.data.mtype == "MATCH_ODDS") {
                                        $scope.BindIndianFancy(dataResult['session'], tempResult.data.id);
                                    }
                                    $http.get('Lstsavemstrcontroller/manualMatchOddsDetails/' + $scope.MarketId).success(function (data, status, headers, config) {
                                        $scope.isManualMatchOdds = data.isManualMatchOdds;
                                        $scope.isManualMatchOddsData = data.data_formated;
                                        //if($scope.isManualMatchOdds == 0)
                                        $scope.SocketMarket(tempResult, $scope.isManualMatchOdds, $scope.isManualMatchOddsData);
                                        // $scope.MarketWinLoss($scope.MarketId);
                                        //else
                                        // $scope.SocketMarketManual(tempResult,$scope.isManualMatchOddsData);

                                    });
                                    // $scope.SocketMarket(tempResult, $scope.isManualMatchOdds, $scope.isManualMatchOddsData);

                                    $scope.loading = false;
                                }
                            }

                        }
                        else{

                            $http.get('Lstsavemstrcontroller/manualMatchOddsDetails/' + $scope.MarketId).success(function (data, status, headers, config) {
                                $scope.isManualMatchOdds = data.isManualMatchOdds;
                                $scope.isManualMatchOddsData = data.data_formated;
                                //if($scope.isManualMatchOdds == 0)
                                 ;
                                $scope.SocketMarket($scope.ApiResult, $scope.isManualMatchOdds, $scope.isManualMatchOddsData);
                            });}
                        $scope.CallSocketMarket();
                    }
                    catch (ex) {
                        $scope.CallSocketMarket();
                    }
                });
                $timeout.cancel(ajaxTimer);


            }
//$scope.GetScore();
        }, 1000);
    }
    $scope.$on('$destroy', function () {
        $timeout.cancel(ajaxTimer);
    });
    $scope.GetOddSessionBets(1);

    $scope.$on('$destroy', function () {
        $timeout.cancel($scope.fetchAllSeesionOddBet);

    });

    $scope.display_Yesfancy = function (sessionValueNo, sessionValueYes, id, indexVal) { //sourabh 170125
      
        $scope.SessInptYes['field_' + indexVal] = parseFloat(sessionValueYes);
        $scope.SessInptNo['field_' + indexVal] = parseFloat(sessionValueNo);
        $(".betOverlaypre" + indexVal).hide();
        if (!$scope.openfancy) {
            $scope.openfancy = {};
        }
        if (!$scope.betValue) {
            $scope.betValue = {};
        }
        $scope.openfancy[id] = {yes: true, open: true};
        if (sessionService.get('slctUseTypeID') == "3") {
            $scope.isBackYes = 1;
            $scope.showOdd1 = true;
            $scope.betValue[id] = 0;
            // $scope.setTimerSession(indexVal);
            //$scope.sessionValue = parseInt(sessionValue);
            $scope.userType = sessionService.get('type');
            $scope.UserTypeId = sessionService.get('slctUseTypeID');
            focus('betValueLay');

        } else
            Dialog.autohide('Please Select Valid User');
    }
    $scope.display_Nofancy = function (sessionValueYes, sessionValueNo, id, indexVal) { //sourabh 170125


        $scope.SessInptYes['field_' + indexVal] = parseFloat(sessionValueYes);
        $scope.SessInptNo['field_' + indexVal] = parseFloat(sessionValueNo);
        $(".betOverlaypre" + indexVal).hide();
        if (!$scope.openfancy) {
            $scope.openfancy = {};
        }
        if (!$scope.betValue) {
            $scope.betValue = {};
        }
        $scope.openfancy[id] = {yes: false, open: true};
        // $scope.setTimerSession(indexVal);
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
    $scope.FancyNull = function () {

        if ($scope.FancyData != angular.isUndefinedOrNull && false) {
            for (var i = $scope.FancyData.length; i--;) {


                if ($scope.FancyData[i].is_indian_fancy == 1 && $scope.FancyData[i].fancy_mode == "A") {

                    $scope.FancyData[i].isIndianShow = false;
                    $scope.FancyData.splice(i, 1);
                }

            }
        }
    }
    $scope.BindIndianFancy = function (data, mId) {


        // var temp  =  JSON.parse(event.data);

        var dataResult = data;

        // dataResult.push(data.message);
        var tempResult = [];
        if (dataResult != angular.isUndefinedOrNull) {

            if (dataResult.length > 0 && dataResult[0] != null) {
                var ind = dataResult.findIndex(x => x.market_id == mId);
                if (ind > -1) {
                    try {

                        tempResult.data = dataResult[ind].value.session;
                        $scope.FancyLiveData = tempResult.data;
                        $scope.loading = false;
                        //$scope.SocketMarket(tempResult);
                        if ($scope.FancyData != angular.isUndefinedOrNull) {

                            for (var i = 0; i < $scope.FancyData.length; i++) {

                                if ($scope.FancyData[i].is_indian_fancy == 1 && $scope.FancyData[i].fancy_mode == "A") {
                                    if ($scope.FancyLiveData != angular.isUndefinedOrNull) {
                                        var inde = $scope.FancyLiveData.findIndex(img => img.SelectionId === $scope.FancyData[i].ind_fancy_selection_id);
                                        if (inde > -1) {
                                            var obj = $scope.FancyLiveData[inde];
                                            if (obj != angular.isUndefinedOrNull) {
                                                $scope.FancyData[i].SessInptNo = obj.LayPrice1;
                                                $scope.FancyData[i].NoValume = obj.LaySize1;
                                                $scope.FancyData[i].SessInptYes = obj.BackPrice1;
                                                $scope.FancyData[i].YesValume = obj.BackSize1;
                                                if (obj.GameStatus == 'SUSPENDED1') {
                                                    $scope.FancyData[i].DisplayMsg = 'Ball Running';
                                                }
                                                else {
                                                    $scope.FancyData[i].DisplayMsg = obj.GameStatus;
                                                }
                                                if ($scope.FancyDataTemp.length > 0 && $scope.FancyDataTemp[i].active == 0) {
                                                    $scope.FancyData[i].active = $scope.FancyDataTemp[i].active;
                                                }
                                                else {
                                                    $scope.FancyData[i].active = (obj.GameStatus == "" || obj.GameStatus == 'ACTIVE') ? 1 : 4;
                                                }

                                            }

                                        }
                                        else {
                                            $scope.FancyData[i].SessInptNo = '';
                                            $scope.FancyData[i].SessInptYes = '';
                                            $scope.FancyData[i].DisplayMsg = 'Result Awaiting';
                                            $scope.FancyData[i].active = 4;

                                        }


                                    }
                                }

                            }

                        }
                        else {
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
                else {

                    //sessionsocket.onclose();
                    //Dialog.autohide("Record not found.");
                    $scope.loading = false;
                    //$scope.IsShowPage=false;
                    if ($scope.FancyData != angular.isUndefinedOrNull) {

                        for (var i = 0; i < $scope.FancyData.length; i++) {
                            if ($scope.FancyData[i].is_indian_fancy == 1 && $scope.FancyData[i].fancy_mode == "A" && $scope.FancyData[i].market_id == $scope.MarketId) {
                                $scope.FancyData[i].SessInptNo = '';
                                $scope.FancyData[i].SessInptYes = '';
                                $scope.FancyData[i].DisplayMsg = 'Result Awaiting';
                                $scope.FancyData[i].active = 4;

                            }
                        }
                    }


                }
            }
            else {
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
        else {
            $scope.FancyNull();
        }

    }

    $scope.saveSessionstake= function () {

               $scope.loading=true;
               
                var stakeData = {
                    session_stake: $scope.sessionsettingData,
              
                }
                $http({ method: 'POST', url: BASE_URL+ 'Apiusercontroller/session_stake_setting/', data: stakeData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .success(function (data) {
                    debugger;
                    
                    $scope.CallOnclickSetting();
                    $scope.loading=false;
                    $scope.stakemsg = data.message;
		    Dialog.autohide($scope.stakemsg);
		     $("#edit_popup .btn-secondary").close();
                }).error(function(err){
			$scope.loading=false;
			});
            }
    $scope.saveMatchoddstake = function () {
		//
               $scope.loading=true;
               
                var stakeData = {
                    match_stake: $scope.stakesettingData,
              
                }
                $http({ method: 'POST', url: BASE_URL+ 'Apiusercontroller/stake_setting/', data: stakeData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .success(function (data) {
                    $scope.loading=false;
                    $scope.stakemsg = data.message;
		    Dialog.autohide($scope.stakemsg);
		     $("#edit_popup .btn-secondary").close();
                }).error(function(err){
			$scope.loading=false;
			});
            }

//   $scope.CallgetsessionStack = function()
//   {
//       $scope.loading=true;
//      $http.get( BASE_URL+'Apiusercontroller/get_stake_setting/').success(function (data, status, headers, config) {
              
//               $rootScope.MatchStack=data.data.match_stake;
//              if($scope.IsToggle)
//               {
//                   $scope.btnActive=0;
//                    $scope.one_click_stack=data.data.one_click_stake;
//                    $scope.oneClickSelectedBet=$scope.one_click_stack[0];
//                          $scope.stakesettingData =data.data.match_stake;
//               }
//               else
//               {
//                          $scope.stakesettingData =data.data.match_stake;
//               }
//          $scope.loading=false;
//           });
//   }
    $scope.CallOnclickSetting=function()
{
	$scope.loading=true;
   $http.get( BASE_URL+'Apiusercontroller/get_stake_setting/').success(function (data, status, headers, config) {
			
            $rootScope.MatchStack=data.data.match_stake;
		   if($scope.IsToggle)
			{
				$scope.btnActive=0;
				 $scope.one_click_stack=data.data.one_click_stake;
				 $scope.oneClickSelectedBet=$scope.one_click_stack[0];
                       $scope.stakesettingData =data.data.match_stake;
                       $scope.sessionsettingData = data.data.session_stake;
			}
			else
			{
                       $scope.stakesettingData =data.data.match_stake;
                       $scope.sessionsettingData = data.data.session_stake;

			}
       $scope.loading=false;
		});
}
    $scope.getFancyList = function (marketId) {
        // debugger;
        if ($state.current.name == "userDashboard.Matchodds") {
            getFancyTimer = $timeout(function () {
                $http({
                    method: 'GET',
                    url: BASE_URL + 'Apicontroller/matchLstIndianSession/' + $scope.MatchId + '/' + marketId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (result) {
                    if (result.data != angular.isUndefinedOrNull && result.data.length != $scope.FancyData.length) {
                        $scope.FancyData = result.data;
                    }
                    else {
                        
                        if (result.data != angular.isUndefinedOrNull)
                            $scope.FancyDataTemp = result.data;
                        for (var i = 0; i < $scope.FancyData.length; i++) {
                            var inde = $scope.FancyDataTemp.findIndex(x => x.ID == $scope.FancyData[i].ID);
                            if (inde > -1) {

                                if ($scope.FancyDataTemp[inde].fancy_mode == 'A') {
                                    $scope.FancyData[i].HeadName=$scope.FancyDataTemp[inde].HeadName;
                                    $scope.FancyData[i].fancy_mode = $scope.FancyDataTemp[inde].fancy_mode
                                    $scope.FancyData[i].SessInptNo = $scope.FancyDataTemp[inde].SessInptNo;
                                    $scope.FancyData[i].NoValume = $scope.FancyDataTemp[inde].NoValume;
                                    $scope.FancyData[i].SessInptYes = $scope.FancyDataTemp[inde].SessInptYes;
                                    $scope.FancyData[i].YesValume = $scope.FancyDataTemp[inde].YesValume;
                                    $scope.FancyData[i].MaxStake = $scope.FancyDataTemp[inde].MaxStake;
                                    $scope.FancyData[i].pointDiff = $scope.FancyDataTemp[inde].pointDiff;
                                    $scope.FancyData[i].rateDiff = $scope.FancyDataTemp[inde].rateDiff;
                                    $scope.FancyData[i].fancyRange = $scope.FancyDataTemp[inde].fancyRange;
                                    $scope.FancyData[i].DisplayMsg = $scope.FancyDataTemp[inde].DisplayMsg;
                                    $scope.FancyData[i].active = $scope.FancyDataTemp[inde].active;
                                    $scope.FancyData[i].fancy_position = $scope.FancyDataTemp[inde].fancy_position;
                                    $scope.FancyData[i].max_exposure = $scope.FancyDataTemp[inde].max_exposure;

                                }
                                else {
                                    $scope.FancyData[i].fancy_mode = $scope.FancyDataTemp[inde].fancy_mode;
                                }
                            }

                        }

                    }
                    $scope.getFancyList(marketId);
                }).error(function (err) {
                    $scope.loading = false;
                    $scope.getFancyList(marketId);

                });

            }, 1000);
        }
    }
    $scope.UpdateAdminFancyList = function (marketId) {
        $scope.AdminFancyTimeOut = $timeout(function () {
            if ($state.current.name == "userDashboard.Matchodds") {
                $http({
                    method: 'GET',
                    url: 'Apicontroller/matchLstAdminSession/' + $stateParams.MatchId + '/' + marketId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (result) {

                    $scope.AdminFancyLiveData = result.data;
                    if ($scope.AdminFancyLiveData.length > 0) {
                        for (var i = 0; i < $scope.FancyData.length; i++) {

                            if ($scope.FancyData[i].fancy_mode == "M") {

                                var inde = $scope.AdminFancyLiveData.findIndex(img => img.ID === $scope.FancyData[i].ID);
                                if (inde > -1) {
                                    var obj = $scope.AdminFancyLiveData[inde];
                                    if (obj != angular.isUndefinedOrNull) {
                                        $scope.FancyData[i].SessInptNo = obj.SessInptNo;
                                        $scope.FancyData[i].SessInptYes = obj.SessInptYes;
                                        $scope.FancyData[i].NoValume = obj.NoValume;
                                        $scope.FancyData[i].YesValume = obj.YesValume;
                                        $scope.FancyData[i].MaxStake = obj.MaxStake;
                                        $scope.FancyData[i].pointDiff = obj.pointDiff;
                                        $scope.FancyData[i].rateDiff = obj.rateDiff;
                                        $scope.FancyData[i].fancyRange = obj.fancyRange;
                                        $scope.FancyData[i].DisplayMsg = obj.DisplayMsg;
                                        $scope.FancyData[i].active = obj.active;
                                        $scope.FancyData[i].fancy_mode = obj.fancy_mode;
                                    }

                                }
                                else {
                                    $scope.FancyData[i].SessInptNo = '';
                                    $scope.FancyData[i].SessInptYes = '';
                                    $scope.FancyData[i].DisplayMsg = 'Result Awaiting';
                                    $scope.FancyData[i].active = 4;
                                }


                            }
                        }
                    }
                    $scope.UpdateAdminFancyList(marketId);
                }).error(function (err) {
                    $scope.loading = false;
                    $scope.UpdateAdminFancyList(marketId);
                });
            }
        }, 1000)


    }
    $scope.IsShowFancy = function () {

        var ind = $scope.FancyData.findIndex(x => x.DisplayMsg != 'Result Awaiting');
        if (ind == -1) {
            $scope.isExistFancy = false;
        }
        return $scope.isExistFancy;
    }
    $scope.getOddValue = function (item, priceVal, oddsLimit, matchId, back_layStatus, placeName, selectionId, index, MarketId) {
        oldval = 0;
        oldIndex = 0;
        //$scope.btnPlaceDis = true;
        priceVal = parseFloat(priceVal) + parseFloat(oddsLimit);
        $scope.SessionbtnPlaceDis = true;
        $scope.UserTypeId = sessionService.get('type');
        $scope.UserId = sessionService.get('slctUseID');
        $scope.ParantId = sessionService.get('slctParantID');
        $scope.loginId = sessionService.get('user_id');
        $scope.slctUseTypeID = sessionService.get('slctUseTypeID');
        $scope.stake = 0;

        //$scope.comStake=0;


        //$scope.ResetCalculateWinAmt1(index);
        /* var isback = document.getElementById('isback'+index).value;
  if(isback!="")
  {
  //$scope.stakeVal(priceVal, selectionId, $scope.stake1['field_'+index],index,item);
    //$scope.stake1['field_'+index]=0;

  }
  else
  {

    //$scope.stake1['field_'+index]=0;
  }*/
        $scope.priceVal = priceVal != angular.isUndefinedOrNull ? parseFloat(priceVal.toFixed(2)) : 0;
        $scope.priceVal1['field_' + index] = parseFloat($scope.priceVal.toFixed(2));
        $scope.MatchId = $scope.MatchId;
        $scope.displayTable = true;
        $scope.acc = 1;
        $scope.formStatus['field_' + index] = back_layStatus;
        //$scope.ResetCalculateWinAmt(index,selectionId);
        // $scope.CalculateWinAmt(index);
        $scope.placeName = placeName;
        $scope.placeName1['field_' + index] = placeName;
        $scope.selectionId['field_' + index] = selectionId;
        var s = item.currentTarget.getAttribute("data-id");
        $scope.testModel = parseFloat(priceVal);
        var oldPnLValue1 = 0;
        $scope.slctProfit = 0;
        $scope.RunnerValue = $scope.MarketWinLossByMId(MarketId);
        if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length != angular.isUndefinedOrNull) {
            if ($scope.formStatus['field_' + index] == '1') {
                if (oldPnLValue1 != angular.isUndinedorNull) {
                    oldPnLValue1 = $filter('filter')($scope.RunnerValue, {selectionId: $scope.selectionId})[0]; //170316
                    if (oldPnLValue1 != angular.isUndefinedOrNull) {
                        $scope.oldPnLValue = $scope.getSumValPnL(oldPnLValue1.winValue, oldPnLValue1.lossValue);
                        $scope.slctProfit = $scope.getSumValPnL(oldPnLValue1.winValue, oldPnLValue1.lossValue);
                    }
                }
            } else {
                var minVal = 0;
                if ($scope.RunnerValue.length == 2) {
                    // oldPnLValue1 =$filter('filter')($scope.RunnerValue, { SelectionId: $scope.selectionId })[0];
                    $scope.RunnerValue.find(function (item, j) {
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
                    $scope.RunnerValue.find(function (item, j) {
                        var selectionVal = (parseFloat(item.winValue) + parseFloat(item.lossValue));
                        if (item.SelectionId != $scope.selectionId) {
                            //var t=(parseFloat(item.winValue) + parseFloat(item.lossValue));
                            var t1 = (parseFloat(item.winValue) + parseFloat(item.lossValue));
                            $scope.arrayText.push(t1);
                            console.log("Push+===" + $scope.arrayText);
                        }
                    });
                    minVal = Math.min.apply(Math, $scope.arrayText.map(function (item) {
                        return item;
                    }));
                    if (minVal < 0) {
                        minVal = 0;
                    }
                    ;
                }
                $scope.oldPnLValue = minVal;
            }
        } else {
            $scope.oldPnLValue = 0;
        }

    };
    $scope.getApiFrom = function (MarketId, MatchId, sportId) {
        $scope.btnPlaceDis = true;
        $scope.SessionbtnPlaceDis = true;
        $scope.MarketId = $stateParams.MarketId;
        $scope.UserTypeId = sessionService.get('type');
        var userId = document.getElementById('userId').value;
        var ParantId = document.getElementById('ParantId').value;
        var loginId = document.getElementById('loginId').value;
        var selectionId = document.getElementById('selectionId' + $scope.IdUnique).value;
        var matchId = $scope.MarketId;// document.getElementById('matchId').value;
        var isback = document.getElementById('isback' + $scope.IdUnique).value;
        //  var MarketId = document.getElementById('MarketId').value;
        var priceVal = $scope.priceVal1['field_' + $scope.IdUnique];
        var stake = $scope.stake1['field_' + $scope.IdUnique];
        var placeName = document.getElementById('placeName' + $scope.IdUnique).value; 
        var tempArray = $scope.FinalArray[0];

        get_userser.get_OddsFromApi($stateParams.MarketId, selectionId, MatchId, isback, tempArray, $scope.oddsLimit,function (response) {
            $scope.ApiOddsValue = $scope.getOddCalcVal(response.oddsValue, 1);
            var chkValPrice = $scope.ApiOddsValue;
            var P_and_l = 0,
                P_and_lLB = 0;
            if (isback == 0) {
                if (priceVal <= $scope.ApiOddsValue && $scope.ApiOddsValue != 0) { //1<=1.11 and place at 1.11
                    isMatched = 1; //match
                    priceVal = $scope.ApiOddsValue;
                } else { //1.31<=1.11 and place at 1.31
                    isMatched = 0; //unmatch
                    priceVal = priceVal;
                    $scope.oldPnLValue = 0; //04_04_2017 0 to -1
                }
            } else { //lay
                if (priceVal >= $scope.ApiOddsValue && $scope.ApiOddsValue != 0) { //2>=1.12 and place bet at 1.12
                    isMatched = 1; //match
                    priceVal = $scope.ApiOddsValue;
                } else { //1.01>=1.12 and place bet at 1.01
                    isMatched = 0; //unmatch
                    priceVal = priceVal;
                    $scope.oldPnLValue = 0; //04_04_2017 0 to -1
                }
            }
            if (deviceDetector.device == 'unknown') {
                var DIVICE = 'Desktop';
            } else {
                var DIVICE = deviceDetector.device;
            }
            //

            var PricePlusOne = $scope.getOddCalcVal(parseFloat(priceVal) + 1, 1)
            P_and_l = (PricePlusOne * stake) - stake;
            var deviceInformation = " browser: " + deviceDetector.browser + " browser_version :" + deviceDetector.browser_version + "  device: " + DIVICE + "  OS : " + deviceDetector.os + " os_version: " + deviceDetector.os_version;
            $scope.formData = {
                userId: sessionService.get('slctUseID'),
                ParantId: ParantId,
                loginId: loginId,
                selectionId: selectionId,
                matchId: $stateParams.MatchId,
                isback: isback,
                stake: stake,
                priceVal: (PricePlusOne),
                p_l: P_and_l,
                MarketId: MarketId,
                // isMatched: isMatched,
                UserTypeId: $scope.UserTypeId,
                placeName: placeName,
                MatchName: $stateParams.matchName,
                deviceInfo: deviceInformation,
                inplay: response.inplay,
                ApiVal: 0,
                sportId: sportId,
                manualstatus: $scope.manualstatus,
            }

            $scope.getCheckLimitorVal($scope.formData);
        
            if (((sessionService.get('config_unmatched') == 'Y') && isMatched == 0) || isMatched == 1) {
                if ($scope.gtTypeId == 3) {
                    //
                    //if ($scope.cValid) {
                    $http({
                        method: 'POST',
                        url: 'Betentrycntr/Save_bet/',
                        data: $scope.formData,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function (data) {
                        // $scope.GetUserData();
                        $scope.loadingM1['field_' + $scope.IdUnique] = false;
                        if (data.error >= 0) {
                            $scope.priceVal = 0;
                            $scope.stake = 0;
                            $scope.acc = false;
                            $scope.btnPlaceDis = false;
                            $scope.SessionbtnPlaceDis = false;
                            if (isMatched == 0) {

                                Dialog.autohide(data.message);

                            } else {
                                Dialog.autohide(data.message);
                            }
                            $scope.CloseBetPopup($scope.GetMarketInfo, $scope.IdUnique);
                            $scope.loading = false;
                            $rootScope.$broadcast('changeText', {});
                            $scope.RunnerValue = data.RunnerValue;
                            var chkUserType = sessionService.get('type');
                            if (chkUserType == 3) {
                                $scope.UserId = sessionService.get('slctUseID');
                                get_userser.GetWALLibiInfo($scope.UserId);
                            } else {
                                $scope.UserId = sessionService.get('user_id');
                                get_userser.GetWALLibiInfo($scope.UserId);
                            }
                            $scope.ResetCalculateWinAmt($scope.IdUnique, selectionId);

                        } else if (data.error < 0) {
                            Dialog.autohide('' + data.message);
                            $scope.btnPlaceDis = false;
                            $scope.SessionbtnPlaceDis = false;
                            $scope.loading = false;
                            $scope.loadingM1['field_' + $scope.IdUnique] = false;
                        }

                        $scope.reset_all_selection($scope.IdUnique);
                    });
                    // $scope.priceVal1['field_' + $scope.IdUnique]=0;
                    // $scope.stake1['field_' + $scope.IdUnique]=0;


                    //  $scope.GetUserData();
                    //  $state.reload();

                } else {
                    alert("Invalid user");
                    $scope.btnPlaceDis = false;
                    $scope.SessionbtnPlaceDis = false;
                    $scope.loading = false;
                    $scope.loadingM1['field_' + $scope.IdUnique] = false;
                }
            }
            else {
                $scope.btnPlaceDis = false;
                $scope.SessionbtnPlaceDis = false;
                $scope.loading = false;
                $scope.loadingM1['field_' + $scope.IdUnique] = false;

                $scope.ResetCalculateWinAmt($scope.IdUnique, selectionId);
                Dialog.autohide("Bhav changed");
            }
        }
        );
    }
    $scope.place_bet = function (marketitem, id) {
        if ((($scope.MatchBetAllow == 1 && ($scope.MatchOddsmsg != 'Bet Close' && $scope.MatchOddsmsg != 'Ball Start') && $scope.isManualMatchOdds == 0) || ($scope.MatchBetAllow == 1 && ($scope.MatchOddsmsg != 'Bet Close' && $scope.MatchOddsmsg != 'Ball Start') && $scope.isManualMatchOdds == 1)) || ($scope.isBetAllowedOnManualMatchOdds == 1 && $scope.isManualMatchOdds == 1)) {
            // if (($scope.MatchBetAllow == 1 && $scope.MarketBetAllow == 1 && ($scope.MatchOddsmsg != 'Bet Close' && $scope.MatchOddsmsg != 'Ball Start') && $scope.isManualMatchOdds == 0) || ($scope.isBetAllowedOnManualMatchOdds == 1 && $scope.isManualMatchOdds == 1 && ($scope.MatchOddsmsg != 'Bet Close' && $scope.MatchOddsmsg != 'Ball Start'))) {
            $scope.stack = $scope.stake1['field_' + id];
            $scope.GetMarketBackLayData = marketitem;
            $scope.GetMarketInfo = marketitem;
            $scope.loadingM1['field_' + id] = true;
            $scope.IdUnique = id;
            $scope.betSportId = marketitem.eventTypeId;
            //$scope.loadingM = true;
            $http.get('Chipscntrl/checkDeduction/' + sessionService.get('slctUseID') + "/" + $stateParams.MatchId).then(function (articles) {
                //
                return parseInt(articles.data.chkcnt[0].numb);
            }).then(function (cnt) {
                //
                if (cnt == 0) {
                    $http.get('Chipscntrl/getChipDataById/' + sessionService.get('slctUseID')).success(function (data, status, headers, config) {

                        var cipsData = data.betLibility;
                        $scope.sessionLiability = -1 * parseFloat(cipsData[0].sessionLiability).toFixed(2);
                        $scope.GET_BALANCE = parseFloat(cipsData[0].Balance).toFixed(2);
                        /*start code cut balance*/
                        $http.get('Betentrycntr/PointValue/' + sessionService.get('slctUseID')).success(function (data, status, headers, config) {
                            //
                            //$scope.PointValue = parseInt(data.GetPoint[0].value);
                            if (data.GetPoint.length == 0) {
                                $scope.PointValue = 0;
                            } else {
                                $scope.PointValue = parseFloat(data.GetPoint[0].value);
                            }
                            //$scope.message=data.message;
                            if ($scope.GET_BALANCE >= $scope.PointValue) {
                                var userID = sessionService.get('user_id');
                                var userType = sessionService.get('type');

                                var ChipData = {
                                    UserName: sessionService.get('slctUseName'),
                                    UserId: userID,
                                    userType: userType,
                                    ChpsVal: $scope.PointValue,
                                    MatchID: $stateParams.MatchId,
                                    MatchName: $stateParams.matchName,
                                };
                                $http({
                                    method: 'POST',
                                    url: 'Chipscntrl/SaveChipAc/',
                                    data: ChipData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                }).success(function (data) {
                                    $scope.TOTAL_LIABILITY = -1 * (parseFloat(cipsData[0].sessionLiability) + parseFloat(cipsData[0].unmatchliability));
                                    $scope.CloseBetPopup($scope.GetMarketInfo, $scope.IdUnique);
                                    //  $scope.ResetCalculateWinAmt(id);
                                    // $scope.stake1['field_' + id]=0;
                                    $scope.reset_all_selection(id);
                                    //$scope.MarketWinLoss($scope.marketIdLst);

                                    // $state.reload();

                                });

                            } else {
                                Dialog.autohide('Insufficient Balance');

                                $scope.stake1['field_' + id] = 0;
                                $scope.comStake = 0;
                                $scope.btnPlaceDis = false;
                                $scope.SessionbtnPlaceDis = false;
                                $scope.loadingM1['field_' + id] = false;
                                return;

                            }
                            $scope.loadingM1['field_' + id] = false;
                        });
                        /*End of code to cut Balance*/
                    });
                    $scope.loadingM1['field_' + id] = false;

                }
                get_userser.getBetDelay(sessionService.get('slctUseID'), function (data) {
                    //  var BetDelay = (parseInt(data) * 1000);
                    var BetDelay = 0;
                    if (($scope.stake1['field_' + id] >= $scope.minBet && $scope.stake1['field_' + id] <= 1000000) || $scope.isManualMatchOdds != 1) {

                        $timeout(function () {
                            $scope.getApiFrom($stateParams.MarketId, $stateParams.MatchId, $scope.betSportId)
                        }, BetDelay);
// $scope.loadingM = false;


                    } else if ($scope.stake1['field_' + id] < $scope.minBet) {

                        Dialog.autohide('Please Enter Min ' + $scope.minBet + '  Stake');
                        $scope.loadingM1['field_' + id] = false;


                    } else if ($scope.stake1['field_' + id] > 200000) {
                        Dialog.autohide('Please Enter Max 1000000 Stake');
                        $scope.loadingM1['field_' + id] = false;
                    }
                    else if ($scope.isManualMatchOdds == 1) {
                        $timeout(function () {
                            $scope.getApiFrom(marketitem.marketid, $stateParams.MatchId, $stateParams.sportId)
                        }, BetDelay);
// $scope.loadingM = false;

                    }
                });
            });
        } else {
            Dialog.autohide('Bet Closed');

        }
    };
    $scope.saveSessionBet = function (pointDiff, FancyData, IndexVal, getbetval) {

        $scope.loadingS['field_' + IndexVal] = true;
        $scope.btnPlaceDisSession = true;
        if ($scope.MatchBetAllow != 0) {
            if (FancyData.MaxStake >= getbetval) {
                $(".betOverlaypre" + IndexVal).show();
                $(".betOverlaypre" + IndexVal).addClass('betOverlay');
                var HeadName = FancyData.HeadName;
                var SessInptNo = $scope.SessInptNo['field_' + IndexVal] == undefined ? 0 : $scope.SessInptNo['field_' + IndexVal];
                var SessInptYes = $scope.SessInptYes['field_' + IndexVal] == undefined ? 0 : $scope.SessInptYes['field_' + IndexVal];
                var FncyId = FancyData.FncyId;
                var sportId = FancyData.SprtId;
                var UserTypeId = sessionService.get('slctUseTypeID');
                var UserId = sessionService.get('slctUseID');
                var loginId = sessionService.get('user_id');
                var ParantId = sessionService.get('slctParantID');
                var amount = document.getElementById('betValueLay' + IndexVal).value;
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
                    type: sessionService.get('type'),
                    OddsNumber: OddsNumber,
                    TypeID: FancyData.TypeID,
                    HeadName: HeadName,
                    SessInptNo: SessInptNo,
                    SessInptYes: SessInptYes,
                    sportId: sportId,
                    FancyId: FncyId,
                    pointDiff: pointDiff,
                    deviceInformation: deviceInformation,
                    SessSizeNo: 90,
                    SessSizeYes: 110,
                    MarketId: $stateParams.MarketId,
                    fancy_mode: FancyData.fancy_mode
                }
                var callUrl = 'Lstsavemstrcontroller/save_session_bet';
                if (FancyData.is_indian_fancy == 1) {
                    callUrl = 'Lstsavemstrcontroller/save_indian_session_bet';
                }
                else {
                    callUrl = 'Lstsavemstrcontroller/save_session_bet';
                }
                if (amount >= $scope.minSessionBet && amount <= 200000) {
                    if ($scope.checkValidation(sessionData, IndexVal)) {
                        $timeout(function () {
                            $http({
                                method: 'POST',
                                url: BASE_URL + callUrl,
                                data: sessionData,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function (data) {
                                $scope.showOdd1 = false;
                                if (data.error >= 0) {
                                    get_userser.GetWALLibiInfo(sessionService.get('slctUseID'));
                                    Dialog.autohide(data.message);
                                    $(".betOverlaypre" + IndexVal).hide();
                                    $(".betOverlaypre" + IndexVal).removeClass('betOverlay');
                                    $scope.GetBetValueReset(0, true, FancyData.ID);
                                    //  $scope.GetUserData();
                                    $scope.loadingS['field_' + IndexVal] = false;
                                    $scope.btnPlaceDisSession = false;
                                } else if (data.error < 0) {
                                    Dialog.autohide(data.message);
                                    $(".betOverlaypre" + IndexVal).hide();
                                    $(".betOverlaypre" + IndexVal).removeClass('betOverlay');
                                    $scope.loadingS['field_' + IndexVal] = false;
                                    $scope.btnPlaceDisSession = false;

                                }
                            });
                        }, 2000);
                    }

                } else if (amount < $scope.minSessionBet) {
                    Dialog.autohide('Please Enter Min ' + $scope.minSessionBet + ' Stake');
                    $scope.loadingS['field_' + IndexVal] = false;
                    $scope.btnPlaceDisSession = false;

                } else if (amount > 200000) {
                    Dialog.autohide('Please Enter Max 200000 Stake');
                    $scope.loadingS['field_' + IndexVal] = false;
                    $scope.btnPlaceDisSession = false;

                }

            } else {
                $scope.loadingS['field_' + IndexVal] = false;
                $scope.btnPlaceDisSession = false;

                Dialog.autohide('Your max Stack limit is over');
            }
        } else {
            $scope.loadingS['field_' + IndexVal] = false;
            $scope.btnPlaceDisSession = false;

            Dialog.autohide('Match Bet Not Allowed');
        }

    };

    $scope.ChangeColorTemp = function (newVal, id) {

        if (id != angular.isUndefinedOrNull && $scope.prive['field_' + id] != angular.isUndefinedOrNull && newVal != angular.isUndefinedOrNull) {
            newVal.id = id;
            //$scope.Index=newVal.id;
            if (newVal != angular.isUndefinedOrNull && $scope.prive != angular.isUndefinedOrNull) {


                if ((newVal.price != $scope.prive['field_' + id].price || newVal.size != $scope.prive['field_' + id].size) && newVal.id == $scope.prive['field_' + id].id) { //$scope.priveobj['field_'+$scope.Index] = false;
                    $scope.Index = newVal.id;
                    $scope.priveobj['field_' + $scope.Index] = false;
                    if ($scope.Index != angular.isUndefinedOrNull) {
                        $scope.priveobj['field_' + $scope.Index] = true;
                        $scope.prive['field_' + id] = newVal;
                        return true;


                    }


                }
                else if ((newVal.price == $scope.prive['field_' + id].price || newVal.size == $scope.prive['field_' + id].size)) {
                    $scope.priveobj['field_' + $scope.Index] = false;
                    //$scope.priveobj={};
                    //$scope.prive['field_'+id]=newVal;
                    //$('tbody td.callYlCss').toggleClass('callYlCss');
                    // $('tbody td.callCYanCss').toggleClass('callCYanCss');
                    return false;
                    //$timeout(function() {$scope.priveobj['field_'+$scope.Index]=false;$scope.prive['field_'+id]=newVal}, 500);
                }
                else {
                    $scope.priveobj['field_' + $scope.Index] = false;
                }
            }
            //$scope.prive=id;
        }
        else {
            if (id != angular.isUndefinedOrNull) {
                $scope.prive['field_' + id] = newVal;
                return false;
            }
        }


    }
    $scope.ChangeColor = function (obj) {
        var i = 0;
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
    $scope.CheckBet = function (i) {
        if ($scope.FinalArray[i] != angular.isUndefinedOrNull) { //sourabh 170107
            /*start code for Match UnMatch*/
            if ($scope.FinalArray[i] != angular.isUndefinedOrNull && $scope.FinalArray[i].status != "CLOSED" && $scope.MatchResult != "CLOSED") {
                $http.get('Betentrycntr/GatBetData/' + 0 + '/' + sessionService.get('slctUseTypeID') + '/' + sessionService.get('slctUseID') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                    if (data.result != 0) {
                        tem = true;
                        var oldUserData = 0;
                        if ($scope.UserData != angular.isUndefinedOrNull) oldUserData = $scope.UserData.length;
                        $scope.UserData = data.betUserData;
                        // console.log('8**************************',$scope.UserData,'.......................',data.betUserData.length,'-----------------------',oldUserData);
                        if (oldUserData != data.betUserData.length) {
                        }

                        try {
                            for (var u = 0; u < $scope.UserData.length; u++) {
                                if ($scope.FinalArray[i] != angular.isUndefinedOrNull) {
                                    $scope.FinalArray[i].runners.find(function (item, j) {
                                        if (item.id == $scope.UserData[u].SelectionId && ($scope.FinalArray[i].id == $scope.UserData[u].MarketId) && ($scope.UserData[u].MatchId == $stateParams.MatchId) && ($scope.UserData[u].IsMatched == 0)) {
                                            if ($scope.UserData[u].isBack == 0) {
                                                if (item.ex.availableToBack.length != 0 && $scope.UserData[u].Odds <= (item.ex.availableToBack[0].price + $scope.oddsLimit).toFixed(2)) {
                                                    $http.get('Betentrycntr/updateUnMatchedData/' + $scope.UserData[u].MstCode + '/' + 0 + '/' + $scope.FinalArray[i].id + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                                                        if (data.length > 0) {
                                                            $scope.UserData = data.betUserData;
                                                        }
                                                        // $scope.getBetsData();
                                                    });
                                                }
                                            } else {
                                                if (item.ex.availableToLay.length != 0 && $scope.UserData[u].Odds >= (item.ex.availableToLay[0].price + $scope.oddsLimit).toFixed(2)) {
                                                    $http.get('Betentrycntr/updateUnMatchedData/' + $scope.UserData[u].MstCode + '/' + 1 + '/' + $scope.FinalArray[i].id + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                                                        if (data.length > 0) {
                                                            $scope.UserData = data.betUserData;
                                                        }
                                                        // $scope.getBetsData();
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        } catch (e) {
                            tem = true;
                        }
                    }
                    else {
                        websocket.onclose();
                        $timeout.cancel(phpsoket);
                        Dialog.autohide("Match Closed.");
                        $scope.loading = false;
                        $scope.IsShowPage = false;
                        $state.go("userDashboard.Home");
                    }
                });
            }
            else {
                $scope.callOddsCloseMatch($scope.FinalArray[i]);
            }
        }

    }
    $scope.CallColor = function (Oldprice, Oldsize, NPrice, NSize) {
        if (Oldprice != NPrice || Oldsize != NSize) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.callOddsFuncAgain = function () {
        $scope.callOddsFunc()
    }
    $scope.callOddsFunc = function () {
        var maxloop = 0;
        if (sessionService.get('slctUseTypeID') == 3) {
            $scope.UserId = sessionService.get('slctUseID');
            get_userser.GetWALLibiInfo($scope.UserId);
        } else {
            $scope.UserId = sessionService.get('user_id');
            get_userser.GetWALLibiInfo($scope.UserId);
        }
        var $promise = $http.get('Geteventcntr/getBackLaysOfMarket/' + MarketId + '/' + $stateParams.MatchId);
        $promise.then(function (response) {
            //For Play Pause start


            //For Play Pause end
            if (response.data.MatchOddsVolVal != angular.isUndefinedOrNull) {
                if (response.data.MatchOddsVolVal[0].oddsLimit != angular.isUndefinedOrNull)
                    $scope.oddsLimit = parseFloat(response.data.MatchOddsVolVal[0].oddsLimit);
                else
                    $scope.oddsLimit = 0;
                if (response.data.MatchOddsVolVal[0].volumeLimit != angular.isUndefinedOrNull && response.data.MatchOddsVolVal[0].volumeLimit != 0)
                    $scope.volumeLimit = parseFloat(response.data.MatchOddsVolVal[0].volumeLimit);
                else
                    $scope.volumeLimit = 1;
                if (response.data.MatchOddsVolVal[0].result != "0")
                    $scope.MatchResult = "CLOSED";
                else
                    $scope.MatchResult = "OPEN";
            }
            if ($scope.GetMarketBackLayData == angular.isUndefinedOrNull) {
                $scope.GetMarketBackLayData = response.data.MarketRunner;
                if (response.data.MarketRunner == angular.isUndefinedOrNull) {
                    try {
                        $scope.GetMarketBackLayData.inplay = response.data.MarketRunner.inplay;
                    } catch (e) {
                        console.log('inplay--');
                        console.log(response.data.MarketRunner);
                    }
                    $scope.GetMarketBackLayData.status = response.data.MarketRunner.status;
                    matchStatus = response.data.MarketRunner.status;
                    totalMatch = response.data.MarketRunner.totalMatched;
                    $scope.GetMarketBackLayData.totalMatched = response.data.MarketRunner.totalMatched;
                    if ($scope.GetMarketBackLayData.status == "CLOSED" || $scope.MatchResult == "CLOSED") {
                        $scope.callOddsCloseMatch();
                    }
                }
            } else if (MarketId == $scope.GetMarketBackLayData.marketId) {
                selectedRunner = null;
                if (response.data.MarketRunner != angular.isUndefinedOrNull) {//&& response.data.MarketRunner.totalMatched > totalMatch
                    selectedRunner = response.data.MarketRunner.runners;
                    try {
                        $scope.GetMarketBackLayData.inplay = response.data.MarketRunner.inplay;
                    } catch (e) {
                        console.log('inplay--');
                        console.log(response.data.MarketRunner);
                    }
                    $scope.GetMarketBackLayData.status = response.data.MarketRunner.status;
                    matchStatus = response.data.MarketRunner.status;
                    //$scope.GetMarketBackLayData.IsActive = data.IsActive;
                    totalMatch = response.data.MarketRunner.totalMatched;
                    $scope.GetMarketBackLayData.totalMatched = response.data.MarketRunner.totalMatched;
                    if ($scope.MatchResult == "OPEN" && $scope.GetMarketBackLayData.status == "OPEN" && $scope.GetMarketBackLayData.runners != angular.isUndefinedOrNull && $scope.GetMarketBackLayData.runners.length > 0) { //&& selectedRunner != angular.isUndefinedOrNull
                        try {
                            if ($scope.GetMarketBackLayData.runners.length < selectedRunner.length) //170204
                                maxloop = selectedRunner.length;
                            else
                                maxloop = $scope.GetMarketBackLayData.runners.length;
                            for (var j = 0; j < maxloop; j++) { //170204 $scope.GetMarketBackLayData.runners.length
                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack.length == selectedRunner[j].ex.availableToBack.length) {
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price != selectedRunner[j].ex.availableToBack[0].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].size != selectedRunner[j].ex.availableToBack[0].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price = selectedRunner[j].ex.availableToBack[0].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].size = selectedRunner[j].ex.availableToBack[0].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[0] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].price = "";
                                        }
                                    }
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price != selectedRunner[j].ex.availableToBack[1].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].size != selectedRunner[j].ex.availableToBack[1].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price = selectedRunner[j].ex.availableToBack[1].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].size = selectedRunner[j].ex.availableToBack[1].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[1] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].price = "";
                                        }
                                    }
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price != selectedRunner[j].ex.availableToBack[2].price || $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].size != selectedRunner[j].ex.availableToBack[2].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price = selectedRunner[j].ex.availableToBack[2].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].size = selectedRunner[j].ex.availableToBack[2].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToBack[2] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].price = "";
                                        }
                                    }
                                } else {

                                    $scope.GetMarketBackLayData.runners[j].ex.availableToBack = selectedRunner[j].ex.availableToBack;
                                }
                                if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay.length == selectedRunner[j].ex.availableToLay.length) {
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price != selectedRunner[j].ex.availableToLay[0].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size != selectedRunner[j].ex.availableToLay[0].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price = selectedRunner[j].ex.availableToLay[0].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size = selectedRunner[j].ex.availableToLay[0].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[0] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].price = "";
                                        }
                                    }
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price != selectedRunner[j].ex.availableToLay[1].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].size != selectedRunner[j].ex.availableToLay[0].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price = selectedRunner[j].ex.availableToLay[1].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].size = selectedRunner[j].ex.availableToLay[1].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[1] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].price = "";
                                        }
                                    }
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price != selectedRunner[j].ex.availableToLay[2].price || $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].size != selectedRunner[j].ex.availableToLay[2].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price = selectedRunner[j].ex.availableToLay[2].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].size = selectedRunner[j].ex.availableToLay[2].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.availableToLay[2] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].price = "";
                                        }
                                    }
                                } else {

                                    $scope.GetMarketBackLayData.runners[j].ex.availableToLay = selectedRunner[j].ex.availableToLay;
                                }
                            }
                        } catch (e) {

                            $scope.GetMarketBackLayData = angular.isUndefinedOrNull;
                        }
                        $scope.counter = $scope.counter + 1;
                    } else if ($scope.GetMarketBackLayData.status == "CLOSED" || $scope.MatchResult == "CLOSED") //170201
                    {
                        $scope.GetMarketBackLayData = response.data.MarketRunner;
                        $scope.callOddsCloseMatch();
                    }
                } else if ($scope.GetMarketBackLayData.status == "CLOSED" || $scope.MatchResult == "CLOSED") //170201
                {
                    $scope.GetMarketBackLayData = response.data.MarketRunner;
                    $scope.callOddsCloseMatch();

                }
            } else {
                $scope.GetMarketBackLayData = response.data.MarketRunner;
                try {
                    $scope.GetMarketBackLayData.inplay = response.data.MarketRunner.inplay;
                } catch (e) {
                    console.log('inplay--');
                    console.log(response.data.MarketRunner);
                }
                $scope.GetMarketBackLayData.status = response.data.MarketRunner.status;
                matchStatus = response.data.MarketRunner.status;
                $scope.GetMarketBackLayData.totalMatched = response.data.MarketRunner.totalMatched;
            }
            marketTimer = $timeout(function () {

                if ($scope.GetMarketBackLayData != angular.isUndefinedOrNull) { //sourabh 170107
                    /*start code for Match UnMatch*/
                    if ($scope.GetMarketBackLayData != angular.isUndefinedOrNull && $scope.GetMarketBackLayData.status != "CLOSED" && $scope.MatchResult != "CLOSED") {
                        $http.get('Betentrycntr/GatBetData/' + 0 + '/' + sessionService.get('slctUseTypeID') + '/' + sessionService.get('slctUseID') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {

                            var oldUserData = 0;
                            if ($scope.UserData != angular.isUndefinedOrNull) oldUserData = $scope.UserData.length;
                            $scope.UserData = data.betUserData;
                            // console.log('8**************************',$scope.UserData,'.......................',data.betUserData.length,'-----------------------',oldUserData);
                            if (oldUserData != data.betUserData.length)
                                $scope.getBetsData();
                            try {
                                for (var i = 0; i < $scope.UserData.length; i++) {
                                    if ($scope.GetMarketBackLayData != angular.isUndefinedOrNull) {
                                        $scope.GetMarketBackLayData.runners.find(function (item, j) {
                                            if (item.selectionId == $scope.UserData[u].SelectionId && ($scope.GetMarketBackLayData.marketId == $scope.UserData[u].MarketId) && ($scope.UserData[u].MatchId == $stateParams.MatchId) && ($scope.UserData[u].IsMatched == 0)) {
                                                if ($scope.UserData[u].isBack == 0) {
                                                    if (item.ex.availableToBack.length != 0 && $scope.UserData[u].Odds <= (item.ex.availableToBack[0].price + $scope.oddsLimit).toFixed(2)) {
                                                        $http.get('Betentrycntr/updateUnMatchedData/' + $scope.UserData[u].MstCode + '/' + 0 + '/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                                                            $scope.UserData = data.betUserData;
                                                            $scope.getBetsData();
                                                        });
                                                    }
                                                } else {
                                                    if (item.ex.availableToLay.length != 0 && $scope.UserData[u].Odds >= (item.ex.availableToLay[0].price + $scope.oddsLimit).toFixed(2)) {
                                                        $http.get('Betentrycntr/updateUnMatchedData/' + $scope.UserData[u].MstCode + '/' + 1 + '/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                                                            $scope.UserData = data.betUserData;
                                                            $scope.getBetsData();
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            } catch (e) {
                            }
                        });
                    }

                    /*End of The code Match unmatch*/
                    for (var j = 0; j < maxloop; j++) { // $scope.GetMarketBackLayData.runners.length 170204
                        //for (var i = 0; i < 3; i++) {//$scope.GetMarketBackLayData.runners[j].ex.availableToBack.length
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[0].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[1].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.availableToBack[2].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[0].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[1].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.availableToLay[2].SELECTED = false;
                        } catch (e) {
                        }
                        //}
                    }
                    if ($scope.GetMarketBackLayData.Status != 3) {
                        if ($scope.GetMarketBackLayData.marketId != null) {
                            $scope.callOddsFunc();
                            // $scope.getNameFunc();
                        }
                    }
                } else {
                    $scope.callOddsFunc();
                    // $scope.getNameFunc();
                }
            }, 1000);
            /*{aakash 161226*/
            //   var OnlineStatus = $interval(OnlineStatusChanged, 10000)
            var updatedOnline = function () {
                //console.log("akash2", navigator.onLine)
                if (navigator.onLine) {
                    //clearInterval(Changed);
                    $interval.cancel(Changed);
                    Changed = angular.isUndefinedOrNull;
                    location.reload();
                }
            }
            var Changed;

            function OnlineStatusChanged() {
                if (navigator.onLine) {
                    if (!$scope.netConn) {
                        $mdDialog.hide();
                        $scope.netConn = true;
                        $scope.callOddsFunc();
                        //  $scope.getNameFunc();
                    }
                } else {
                    Changed = $interval(updatedOnline, 100)
                    if ($scope.netConn) {
                        $mdDialog.show({
                            clickOutsideToClose: false,
                            escapeToClose: false,
                            template: "<md-dialog style='border: rgb(255, 0, 0) solid 2px;width: 300px;height: 100px;font-size:14px;font-weight:bold;'><md-dialog-content>Internet Connection is Disconnect... Please Wait...</md-dialog-content></md-dialog>",
                            locals: {prntScope: $scope},
                            fullscreen: false,
                            controller: function DialogController(prntScope) {
                                prntScope.netConn = false;
                            }
                        });
                    }
                }
            }

            /*}aakash 161226*/

        });
    }
    $scope.callOddsCloseMatch = function (tempdata) { //sourabh 15-nov-2016
        //

        $scope.GetMarketBackLayData = tempdata;
        $scope.RunnerValue = tempdata.runners;
        if ($scope.GetMarketBackLayData.status == "CLOSED") {
            var vSelectionID = $filter('filter')($scope.GetMarketBackLayData.runners, {status: "WINNER"})[0].selectionId;
            var selectionName1 = "";
            //for (var j = 0; j < $scope.GetMarketBackLayData.runners.length; j++) {
            //if ($scope.GetMarketBackLayData.runners[j].status == "WINNER") {

            if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length > 0 && $scope.RunnerValue[0].length > 0) //sourabh 170131
            {
                //
                selectionName1 = $filter('filter')($scope.RunnerValue, {SelectionId: vSelectionID})[0].selectionName;
                //for (var i = 0; i < $scope.RunnerValue.length; i++) {
                //if ($scope.RunnerValue[i].SelectionId == $scope.GetMarketBackLayData.runners[j].selectionId || $scope.RunnerValue[i].selectionId == $scope.GetMarketBackLayData.runners[j].selectionId) {
                //selectionName1 = $scope.RunnerValue[i].selectionName;
                if (selectionName1 != "")
                    $scope.saveMatchoddsResult($scope.MatchId, $scope.GetMarketInfo.SportID, $scope.MarketId, vSelectionID, 1, $scope.GetMarketInfo.SportName, $stateParams.matchName, $scope.GetMarketInfo.name, selectionName1);
                //}
                //}
            } else {
                $scope.MarketId = tempdata.marketId;
                $http.get('Geteventcntr/getSelectionName/' + $scope.MarketId + '/' + $scope.MatchId).success(function (data, status, headers, config) {
                    //$scope.RunnerValue = data.RunnerValue;
                    selectionName1 = $filter('filter')(data.RunnerValue, {selectionId: vSelectionID})[0].selectionName;
                    if (selectionName1 != "")
                    //
                        $scope.saveMatchoddsResult($scope.MatchId, $scope.GetMarketInfo.SportID, $scope.MarketId, vSelectionID, 1, $scope.GetMarketInfo.SportName, $stateParams.matchName, $scope.GetMarketInfo.name, selectionName1);
                });
            }
            //}
            //}
        } else if ($scope.MatchResult == "CLOSED") {
            $scope.GetMarketBackLayData.status = "CLOSED";
            $timeout.cancel(marketTimer);
            marketTimer = angular.isUndefinedOrNull;
            $rootScope.$broadcast('changeSidebar_Market', {sportsId: $scope.SPORTID, MatchId: $scope.MatchId});
            /*if (sessionService.get('type') == "3")
                $state.go('userDashboard.Home');*/

        }

    };

    $scope.GetBetValueReset = function (Value1, hideOdd, id) {
        if (!$scope.openfancy) {
            $scope.openfancy = {};
        }
        if (!$scope.betValue) {
            $scope.betValue = {};
        }
        $scope.openfancy[id] = {open: false};
        $scope.betValue[id] = parseInt(Value1);
        if (hideOdd) $scope.showOdd1 = !hideOdd;
    }
    $scope.GetBetValue = function (Value1, id) {

        if (!$scope.betValue) {
            $scope.betValue = {};
        }
        //    $scope.betValue[id] = parseInt($scope.betValue[id]) + parseInt(Value1);//parseInt($scope.betValue[id]) +
        $scope.betValue[id] = parseInt(Value1);//parseInt($scope.betValue[id]) +
        if (Value1 == 0) {
        }
        //
        // $scope.MarketId = $stateParams.MarketId;
        $scope.UserTypeId = sessionService.get('type');
        //  $scope.stack=Value1;
        $scope.formData = {
            stake: $scope.betValue[id],

            MarketId: $scope.MarketId,

            UserTypeId: $scope.UserTypeId,
            betval: id

        }

        $scope.chkUserValidation($scope.formData);
        $scope.getCheckLimitorVal($scope.formData);
    }
    $scope.GetBetValue1 = function (Value1, id) {
        //

        if (!$scope.betValue) {
            $scope.betValue = {};
        }
        $scope.betValue[id] = parseInt(Value1);//parseInt($scope.betValue[id]) +

        if (Value1 == 0) {
        }
        //
        $scope.MarketId = $stateParams.MarketId;
        $scope.UserTypeId = sessionService.get('type');
        $scope.stack = Value1;
        $scope.formData = {
            stake: $scope.stack,

            MarketId: $scope.MarketId,

            UserTypeId: $scope.UserTypeId,
            betval: id

        }

        $scope.chkUserValidation($scope.formData);
        $scope.getCheckLimitorVal($scope.formData);

    }

    $scope.Reset = function (Id, marketInfo) {

        if ($scope.stake1['field_' + marketInfo.uniqueId] != 0 || oldIndex != marketInfo.uniqueId) {
            if (marketInfo.IsShow) {
//oldval=0;oldIndex=0;
            }
        }
    }
    $scope.ShowBetPopup = function (marketInfo, isback, marketitem) {

        if ($scope.prevAction['field_' + marketInfo.uniqueId] == -1) {
            $scope.prevAction['field_' + marketInfo.uniqueId] = isback;
        }
        if (oldId == 0) {
            oldId = marketInfo.uniqueId;
            marketInfo.IsShow = true;
            // $scope.setTimer(marketInfo.uniqueId);
        }
        else if (oldId == marketInfo.uniqueId || true) {
            var a = $scope.oldstake2;
            var b = $scope.stake2;
            var c = $scope.stake1;


            if ($scope.stake1['field_' + marketInfo.uniqueId] != 0 && false && $scope.stake1['field_' + marketInfo.uniqueId] != angular.isUndefinedOrNull) {
                var total = ($scope.stake2['field_' + marketInfo.uniqueId] + $scope.oldstake2['field_' + marketInfo.uniqueId]) - $scope.stake2['field_' + marketInfo.uniqueId];
                $scope.stake2['field_' + marketInfo.uniqueId] = 0;
                $scope.oldstake2['field_' + marketInfo.uniqueId] = 0;
                $scope.CalculateWinAmt(marketInfo.uniqueId, marketInfo.id);
                $scope.stake1['field_' + marketInfo.uniqueId] = 0;
                $scope.stake2['field_' + marketInfo.uniqueId] = 0;
                $scope.oldstake2['field_' + marketInfo.uniqueId] = 0;
            }
            if ($scope.stake1['field_' + marketInfo.uniqueId] != $scope.oldstake2['field_' + marketInfo.uniqueId] || isback != $scope.prevAction['field_' + marketInfo.uniqueId]) {
                $scope.TempCalculateWinAmt(marketInfo.uniqueId, marketInfo.id);
            }
            //$scope.stakeVal(0,$scope.selectionId['field_'  +  marketInfo.uniqueId],null,marketInfo.uniqueId,marketitem,marketInfo.id);
            marketInfo.IsShow = true;
            // $scope.setTimer(marketInfo.uniqueId);
        }
        else {
            oldId = marketInfo.uniqueId;
            marketInfo.IsShow = true;
            // $scope.setTimer(marketInfo.uniqueId);
        }


        $scope.prevAction['field_' + marketInfo.uniqueId] = isback;


    }
    $scope.CloseBetPopup = function (marketitem, id) {
        $scope.GetMarketInfo = marketitem;
        var inde2 = $scope.GetMarketInfo.runners.indexOf($scope.GetMarketInfo.runners.filter(function (item) {
            return item.uniqueId == id;
        })[0]);
        if (inde2 > -1) {
            $scope.GetMarketInfo.runners[inde2].IsShow = false;
        }
    }

    $scope.callProfiltLoss = function (index) {

        var tempcalstack = 0;
        if (($scope.priceVal1['field_' + index] + 1) >= 0 && $scope.stake1['field_' + index] != 0) {
            var tempcal = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
            var isback = $scope.formStatus['field_' + index];
            if (isback == 0) {
                tempcalstack = 0;
                var tcal = $scope.stake2['field_' + index] - tempcal;
                var fcal = $scope.stake2['field_' + index] - tcal;
                for (var i = 0; i < $scope.stakeIds.length; i++) {

                    if ($scope.stakeIds[i] != index) {
                        if ($scope.prevAction['field_' + $scope.stakeIds[i]] == 1) {
                            tempcalstack += parseInt($scope.stake1['field_' + $scope.stakeIds[i]]);
                        }
                        else {
                            tempcalstack -= parseInt($scope.stake1['field_' + $scope.stakeIds[i]]);
                        }

                    }
                }
                $scope.stake2['field_' + index] = fcal + tempcalstack;
            }
            else {
                tempcalstack = 0;
                var tcal = $scope.stake2['field_' + index] + tempcal;
                var fcal = $scope.stake2['field_' + index] - tcal;
                for (var i = 0; i < $scope.stakeIds.length; i++) {

                    if ($scope.stakeIds[i] != index) {
                        if ($scope.prevAction['field_' + $scope.stakeIds[i]] == 0) {
                            tempcalstack += parseInt($scope.stake1['field_' + $scope.stakeIds[i]]);
                        }
                        else {
                            tempcalstack -= parseInt($scope.stake1['field_' + $scope.stakeIds[i]]);
                        }

                    }
                }

                $scope.stake2['field_' + index] = fcal - tempcalstack;
            }
            $scope.oldpriceval['field_' + index] = ($scope.priceVal1['field_' + index] + 1);
            $scope.prevAction['field_' + index] = isback;
        }

    }
    $scope.callProfiltLossTemp = function (index, id) {

        var tempcal = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
        var isback = $scope.formStatus['field_' + index];
        if ($scope.selectionId['field_' + index] == id && isback == 0) {
            var curp = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
            var oldp = (($scope.oldpriceval['field_' + index] * $scope.oldstake2['field_' + index]) - $scope.oldstake2['field_' + index])

            $scope.stake2['field_' + index] = curp + oldp + $scope.stake2['field_' + index];
        }
        else {
            var temp = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
            var oldtemp = ($scope.oldpriceval['field_' + index] * $scope.oldstake2['field_' + index]) - $scope.oldstake2['field_' + index];
            $scope.stake2['field_' + index] = temp + oldtemp - $scope.stake2['field_' + index];
            $scope.stake2['field_' + index] = -$scope.stake2['field_' + index];
        }

    }
    $scope.TempCalculateWinAmt = function (index, id) {

        if ($scope.stake1['field_' + index] != $scope.oldstake2['field_' + index] || index != oldIndex) {
            var isback = $scope.formStatus['field_' + index];

            for (var i = 0; i < $scope.stakeIds.length; i++) {

                if ($scope.stakeIds[i] == index) {
                    //assign profit (profit will be added
                    if ($scope.selectionId['field_' + index] == id && isback == 0) {
                        var curp = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
                        var oldp = (($scope.oldpriceval['field_' + index] * $scope.oldstake2['field_' + index]) - $scope.oldstake2['field_' + index])

                        $scope.stake2['field_' + $scope.stakeIds[i]] = curp + oldp + $scope.stake2['field_' + index];
                    }
                    else {
                        var temp = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
                        var oldtemp = ($scope.oldpriceval['field_' + index] * $scope.oldstake2['field_' + index]) - $scope.oldstake2['field_' + index];
                        $scope.stake2['field_' + $scope.stakeIds[i]] = temp + oldtemp - $scope.stake2['field_' + index];
                        $scope.stake2['field_' + $scope.stakeIds[i]] = -$scope.stake2['field_' + $scope.stakeIds[i]];
                    }

                }
                else {
                    //assign stack will be deducted
                    if ($scope.selectionId['field_' + $scope.stakeIds[i]] != id && isback == 0) {
                        var tcal = $scope.stake1['field_' + index] + $scope.oldstake2['field_' + index];
                        $scope.stake2['field_' + $scope.stakeIds[i]] = $scope.stake2['field_' + $scope.stakeIds[i]] - tcal;
                        $scope.stake2['field_' + $scope.stakeIds[i]] = $scope.stake2['field_' + $scope.stakeIds[i]];
                    }
                    else {
                        $scope.stake2['field_' + $scope.stakeIds[i]] += $scope.stake1['field_' + index] + $scope.oldstake2['field_' + index];
                        //$scope.stake2['field_'+$scope.stakeIds[i]]=-$scope.stake2['field_'+$scope.stakeIds[i]];
                        // $scope.stake2['field_'+$scope.stakeIds[i]]=-$scope.stake2['field_'+$scope.stakeIds[i]];
                    }
                }
            }
            $scope.oldstake2['field_' + index] = $scope.stake1['field_' + index];
            $scope.oldpriceval['field_' + index] = ($scope.priceVal1['field_' + index] + 1);
            oldIndex = index;
        }

    }
    $scope.reset_all_selection = function (Id) {
        $scope.acc = 0;
        $scope.comStake = 0;
        //$scope.ResetCalculateWinAmt(Id);
        $scope.stake1['field_' + Id] = 0;

    };
    $scope.FinalCalCulation = function (index) {

    }
    $scope.CalculateWinAmt = function (index, id) {

        if ($scope.stake1['field_' + index] != $scope.oldstake2['field_' + index] || index != oldIndex) {
            var isback = $scope.formStatus['field_' + index];

            for (var i = 0; i < $scope.stakeIds.length; i++) {

                if ($scope.stakeIds[i] == index) {
                    //assign profit (profit will be added
                    if ($scope.selectionId['field_' + index] == id && isback == 0) {

                        $scope.stake2['field_' + $scope.stakeIds[i]] += (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index] - ((($scope.priceVal1['field_' + index] + 1) * $scope.oldstake2['field_' + index]) - $scope.oldstake2['field_' + index]);
                    }
                    else {
                        var temp = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
                        var oldtemp = (($scope.priceVal1['field_' + index] + 1) * $scope.oldstake2['field_' + index]) - $scope.oldstake2['field_' + index];
                        $scope.stake2['field_' + $scope.stakeIds[i]] = temp - $scope.stake2['field_' + $scope.stakeIds[i]] - oldtemp;
                        $scope.stake2['field_' + $scope.stakeIds[i]] = -$scope.stake2['field_' + $scope.stakeIds[i]];
                    }

                }
                else {
                    //assign stack will be deducted
                    if ($scope.selectionId['field_' + $scope.stakeIds[i]] != id && isback == 0)
                        $scope.stake2['field_' + $scope.stakeIds[i]] += -$scope.stake1['field_' + index] + $scope.oldstake2['field_' + index];
                    else {
                        $scope.stake2['field_' + $scope.stakeIds[i]] += $scope.stake1['field_' + index] - $scope.oldstake2['field_' + index];
                        // $scope.stake2['field_'+$scope.stakeIds[i]]=-$scope.stake2['field_'+$scope.stakeIds[i]];
                    }
                }
            }
            $scope.oldstake2['field_' + index] = $scope.stake1['field_' + index];
            $scope.oldpriceval['field_' + index] = ($scope.priceVal1['field_' + index] + 1);

            oldIndex = index;
        }

    }
    $scope.ResetCalculateWinAmt = function (index, id) {

        var isback = $scope.formStatus['field_' + index];
        if ($scope.stake1['field_' + index] != 0) {
            for (var i = 0; i < $scope.stakeIds.length; i++) {
                if ($scope.stakeIds[i] == index) {
                    //profit will be subtract
                    if ($scope.selectionId['field_' + index] == id && isback == 0) {
                        var tcal = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
                        var told = ((($scope.priceVal1['field_' + index] + 1) * $scope.oldstake2['field_' + index]) - $scope.oldstake2['field_' + index]);
                        $scope.stake2['field_' + $scope.stakeIds[i]] -= tcal
                    }
                    else {
                        var temp = (($scope.priceVal1['field_' + index] + 1) * $scope.stake1['field_' + index]) - $scope.stake1['field_' + index];
                        var oldtemp = ($scope.priceVal1['field_' + index] * $scope.oldstake2['field_' + index]) - $scope.oldstake2['field_' + index];
                        $scope.stake2['field_' + $scope.stakeIds[i]] += temp - 0;
                    }

                }
                else {
                    //assign stack will be added
                    if ($scope.selectionId['field_' + $scope.stakeIds[i]] != id && isback == 0)
                        $scope.stake2['field_' + $scope.stakeIds[i]] += $scope.stake1['field_' + index];
                    else
                        $scope.stake2['field_' + $scope.stakeIds[i]] += -$scope.stake1['field_' + index];
                }
            }
            $scope.oldstake2['field_' + index] = 0;
            $scope.oldpriceval['field_' + index] = 0;
        }

        oldIndex = 0;
    }

    $scope.saveMatchoddsResult = function (Match_id, Sport_id, market_id, selectionId, model_result, spartName, matchName, MarketName, selectionName) {
        var marketData = {
            Sport_id: Sport_id,
            Match_id: Match_id,
            market_id: market_id,
            selectionId: selectionId,
            result: model_result,
            isFancy: 1,
            sportName: spartName,
            matchName: matchName,
            MarketName: MarketName,
            selectionName: selectionName
        }
        $timeout.cancel(marketTimer);
        marketTimer = angular.isUndefinedOrNull;
        $http({
            method: 'POST',
            url: 'Geteventcntr/SetResult/',
            data: marketData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data) {
                try {
                    $scope.loading = false;
                    $scope.message = data.status.message;
                    //
                    //$rootScope.$broadcast('changeSidebar_Market', {});
                    $scope.PLAYPAUSE = $filter('filter')(data.MatchMarket, {Id: $scope.MarketId})[0].IsPlay;
                    // if (sessionService.get('type') == "1")
                    //     $state.go('dashboard.Masterdashboard');
                    // else if (sessionService.get('type') == "2")
                    //     $state.go('dashboard.Dealerdashboard');
                    // else if (sessionService.get('type') == "3")
                    //     $state.go('dashboard.Userdashboard');
                } catch (e) {
                    console.log(data.status.error);
                    $scope.loading = false;
                }
            });
    }
    $scope.saveMatchoddsResultAutoMatic = function (tempArray) {

        var marketData = tempArray;
        $timeout.cancel(phpsoket);
        phpsoket = angular.isUndefinedOrNull;
        $http({
            method: 'POST',
            url: 'Apicontroller/SetResult/',
            data: marketData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data) {
                try {
                    $scope.loading = false;
                    if (data.error) {
                    }
                    else {
                        $scope.message = data.message;

                        $scope.loading = false;
                        $scope.IsShowPage = false;
                        if (websocket != null) {
                            websocket.onclose();
                        }
                        if (sessionsocket != null) {
                            sessionsocket.onclose();
                        }
                        $rootScope.$on("step1", {id: $scope.SPORTID});
                        $state.go("userDashboard.Home");
                    }

                    //
                    //$rootScope.$broadcast('changeSidebar_Market', {});
                    //$scope.PLAYPAUSE=$filter('filter')(data.MatchMarket, { Id: $scope.MarketId })[0].IsPlay;
                    // if (sessionService.get('type') == "1")
                    //     $state.go('dashboard.Masterdashboard');
                    // else if (sessionService.get('type') == "2")
                    //     $state.go('dashboard.Dealerdashboard');
                    // else if (sessionService.get('type') == "3")
                    //     $state.go('dashboard.Userdashboard');
                } catch (e) {
                    console.log(data.status.error);
                    $scope.loading = false;
                }
            });
    }

    $scope.getNameFunc = function () {
        var user_id = sessionService.get('slctUseID');
        var user_type = sessionService.get('slctUseTypeID');
        //
        $http.get('Geteventcntr/getBackLaysOfMarketSelectionName/' + $scope.MarketId + '/' + user_id + '/' + user_type + '/' + $scope.MatchId).success(function (data, status, headers, config) ///sourabh 161226 change
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
    $scope.getSumValPnL = function (a, b) {

        if (a == angular.isUndefinedOrNull && b == angular.isUndefinedOrNull) {
            a = 0;
            b = 0;
        }
        else {
            var temp = parseFloat(a) + parseFloat(b);
        }

        return (parseFloat(a) + parseFloat(b));
    }
    $scope.$on("$destroy", function (event) {
        $timeout.cancel($scope.callOddsFunc);
        $scope.callOddsFunc = angular.isUndefinedOrNull;
    });
    $scope.stakeValReset = function (val, Id) { //sourabh 15-nov-2016
        // $scope.stake = parseInt(val);
        //$scope.ResetCalculateWinAmt(Id);
        $scope.stake1['field_' + Id] = 0;
        //$scope.selectionId['field_' + index]=0;
        oldval = 0;
        oldIndex = 0;
        $scope.comStake = 0;
    };
    $scope.getCalculation = function (priceVal, stake) {
        //
        if (stake == angular.isUndefinedOrNull) {
            stake = 0;
        } else {
            $scope.sumOfVal = parseFloat(priceVal) * parseInt(stake) - parseInt(stake);
            $scope.sumOfVal = $scope.sumOfVal.toFixed(2);
        }

    }
    $scope.stakeVal = function (val, selectionId, stake, index, marketitem, id, clickType) { //sourabh 15-nov-2016

        $scope.GetMarketBackLayData = marketitem;
        $stateParams.MarketId = $scope.GetMarketBackLayData.marketid;

        $scope.IdUnique = index;
        if (stake == angular.isUndefinedOrNull) {
            stake = 0;
        }
        if (stake == 0) {
        }
        $scope.sumOfVal = parseFloat(val) * parseInt(stake) - parseInt(stake);
        $scope.sumOfVal = $scope.sumOfVal.toFixed(2);
        if (clickType == 'inputType') {
            // $scope.stake1['field_' + index] = $scope.stake1['field_' + index] + parseInt(val);//$scope.stake +
        }
        else {
            $scope.stake1['field_' + index] = parseInt(val);//$scope.stake +
        }
        $scope.stake = $scope.stake1['field_' + index];
        //$scope.stake2['field_' + index]=$scope.stake1['field_' + index];
        $scope.comStake = $scope.stake1['field_' + index];
        $scope.MarketId = $scope.GetMarketBackLayData.id;
        $scope.UserTypeId = sessionService.get('type');
        var userId = document.getElementById('userId').value;
        var ParantId = document.getElementById('ParantId').value;
        var loginId = document.getElementById('loginId').value;
        var selectionId = document.getElementById('selectionId' + index).value;
        var matchId = document.getElementById('matchId').value;
        var isback = document.getElementById('isback' + index).value;
        var MarketId = document.getElementById('MarketId').value;
        var priceVal = $scope.priceVal1['field_' + index];
        var stake = $scope.stake1['field_' + index];
        var placeName = document.getElementById('placeName' + $scope.IdUnique).value;
        var chkValPrice = isback == "1" ? document.getElementById('chkValPrice1' + $scope.IdUnique).value : document.getElementById('chkValPrice0' + $scope.IdUnique).value;
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
        //$scope.CalculateWinAmt(index, id);

    }
    $scope.chkUserValidation = function (formData) {
        get_userser.getCheckLimitOfPlaceBet(sessionService.get('slctUseID'), $stateParams.MatchId, $scope.MarketId, function (data) {

            $scope.viewUserAc1 = data.viewUserAc2[0];
            $scope.checkStakeLimit(formData);
        });
    }
    $scope.getCheckLimitorVal = function (formdata) {
        //
        get_userser.getCheckLimitOfPlaceBet(sessionService.get('slctUseID'), $stateParams.MatchId, $stateParams.MarketId, function (data) {

            $scope.viewUserAc1 = data.viewUserAc2[0];
            $scope.checkStakeLimit($scope.formData);
        });
        if ($scope.RunnerValue != angular.isUndefinedOrNull && $scope.RunnerValue.length > 0) {
            var vMaxProfit = 0,
                vMaxLoss = 0;
            $scope.RunnerValue.find(function (item, j) {
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
    $scope.checkStakeLimit = function (formdata) {


        $scope.stake = formdata.stake;
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
            alert("Problem Ocurred");
        }
    }
    $scope.getValColor = function (val) { //20-dec-2016 asha

        if (val == angular.isUndefinedOrNull || val == 0)
            return 'color:#000000';
        else if (val > 0)
            return 'color:#007c0e';
        else
            return 'color:#ff0000';
    }
    $scope.getOddCalcVal = function (a, ovType) { //sourabh 161229
        var x = 0,
            y = 0,
            z = 0;

        if (isNaN(a) && a != angular.isUndefinedOrNull) {
            var ind = a.indexOf('$');
            if (ind > -1) {
                a = a.replace('$', '');
            }

        }
        switch (ovType) {
            case 1:
                if (a != angular.isUndefinedOrNull) {
                    x = a;
                    if ($scope.oddsLimit != angular.isUndefinedOrNull) y = $scope.oddsLimit;
                }
                z = (parseFloat(x) + parseFloat(y)).toFixed(2);
                break;
            case 2:
                if (a != angular.isUndefinedOrNull) {
                    x = a;
                    if ($scope.volumeLimit != angular.isUndefinedOrNull) y = $scope.volumeLimit;
                }
                z = (parseFloat(x) * parseFloat(y)).toFixed(0);
                break;
        }
        if (z >= 0) return z;
        else return "";
    }
    $scope.$on("$destroy", function (event) {
        $timeout.cancel(marketTimer);
        $timeout.cancel(stopped);
        marketTimer = angular.isUndefinedOrNull;
    });
    $scope.showSessionFancy = function (fanctTypeId, fanctId) {
         
        $scope.sessionFancy = fanctId;
        $scope.sessionFancyType = fanctTypeId;
        get_userser.GetFancyData($stateParams.MatchId, $scope.sessionFancy, sessionService.get('user_id'), sessionService.get('type'), $scope.sessionFancyType, function (response) { //sourabh 170125_1
            $scope.FancyData = response.data.fancyForm;
            $scope.showOdd1 = false;
            $scope.GetFancyBal();
        });
    }
    $scope.checkValidation = function (sessionData, checkValidation) { //sourabh 170125
        if (sessionData.betValue == "" || sessionData.betValue <= 0) {
            Dialog.autohide('You cannot play at zero Stake...');
            $(".betOverlaypre" + checkValidation).removeClass('betOverlay');
            $(".betOverlaypre" + checkValidation).hide();
            focus('betValue');
            return false;
        }
        return true;
    }
    $scope.GetFancyBal = function () { //sourabh 170125
        ////
        get_userser.GetFancyBal($scope.FancyData[0].ID, function (response1) {
            ////
            if (response1 == null) {
                $scope.TotalBet = 0;
            } else {
                $scope.TotalBet = response1;
            }


        });
    }

    $scope.SetResult = function (tResult) {

        var response = [];
        $.ajax({
            url: 'http://18.130.213.12/betfair/betting_apis/result.php?market_id=' + tResult.data.marketid,
            type: 'GET',
            dataType: 'JSON',
            success: function (tdata) {

                var result = tdata[0].result;
                if (result[0].status == "CLOSED") {


                    $scope.MarketRunnerLst = result == null ? [] : result;
                    $scope.TempArray = [];
                    for (var j = 0; j < $scope.MarketRunnerLst.length; j++) {
                        if ($scope.MarketRunnerLst[j] != angular.isUndefinedOrNull) {
                            var vSelectionID = $filter('filter')($scope.MarketRunnerLst[j].runners, {status: "WINNER"})[0].selectionId;
                            var obj = {"marketId": $scope.MarketRunnerLst[j].marketId, "selectionId": vSelectionID};
                            $scope.TempArray.push(obj);

                        }
                    }
                    if ($scope.TempArray.length > 0) {
                        $scope.saveMatchoddsResultAutoMatic($scope.TempArray);
                    }


                }
                else {
                    $scope.oddsLimit = parseFloat(tResult.data.volumeLimit[0].oddsLimit);
                    $scope.volumeLimit = parseFloat(tResult.data.volumeLimit[0].volumeLimit);

                    if (tResult.error) {

                        $scope.BindSoketMarket(tResult);
                    }
                    else {
                        $scope.IsShowPage = true;
                        $scope.GetScore();
                        $scope.BindSoketMarket(tResult);
                    }
                }
            },
            error: function (err) {
                response.status = true;
                response.Result = null;
                return response;
            }
        });
    }


}]);
app.directive('ngEnter', function () {
    return function (scope, elem, attrs) {
//alert('df');
        elem.bind("keydown keypress", function (event) {
            // 13 represents enter button
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

