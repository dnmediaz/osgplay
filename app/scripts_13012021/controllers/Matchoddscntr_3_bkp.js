app.controller('Matchoddscntr', ['$scope', '$http', '$stateParams', 'sessionService', '$timeout', 'Dialog', '$rootScope', 'deviceDetector', 'get_userser', '$mdDialog', 'speech', '$filter', '$location', '$state', '$interval', 'Base64', '$window', function ($scope, $http, $stateParams, sessionService, $timeout, Dialog, $rootScope, deviceDetector, get_userser, $mdDialog, speech, $filter, $location, $state, $interval, Base64, $window) {
    $scope.$on('test_dir', function (event, data) {
        $scope.getNameFunc();
    });
    var marketTimer;
    $scope.loading = false;
    $scope.loadingM = false;
    $scope.dateForm = new Date($stateParams.date);
    $scope.sportId = $stateParams.sportId;
    var stopped;
    var currentdate = new Date();
    $scope.btnPlaceDis = false;
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
    $scope.USERTYPE = sessionService.get('type');
    var MarketId = $stateParams.MarketId;
    $scope.PLAYPAUSE = 0;
    var ajaxTimer = "";
    var UpdateAdminFancyTimer = "";
    var FancyBet = "";
    var urlIp = $rootScope.gurlIp;
    var urlArray = $rootScope.gUrlArray;
    var authdata = Base64.encode(sessionService.get('user') + ':' + sessionService.get('lgPassword'));
    var Bauthdata = 'Basic ' + authdata;
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
    var matchStatus = "OPEN";
    var fetchAllDeclaredSessionS = "";
    var fetchAllSeesionOddBet = "";
    $scope.setManualValue = {};
    $scope.onKeyDownResult = "";
    $scope.onKeyUpResult = "";
    $scope.onKeyPressResult = "";
    $rootScope.setRunnername = {};
    $scope.team1backodd = [];
    $scope.team1layodd = [];
    $scope.bhavType = 0;
    $scope.IsBetAllowed = false;
    var scoreTimeOutOne = "";
    var scoreTimeOutTwo = "";
    $scope.SPORTID = $stateParams.sportId;
    $scope.marketwinlosstime = '';
    $scope.Manuald={};
    $scope.Manuald.pointDiff=0.0;
    $scope.Fdata={};
    $scope.Fdata.FancyVal1='';

    var OldFanyID = 0;
    var oldFancyTypeId = 0;
    var callscorepostype = 0;
    var old_fancy_id = 0;
    var scoreOddPosition;
    var callscoreOddpostype = 0;

    $scope.$on('$destroy', function () {
        $timeout.cancel(scoreTimeOutTwo);

    });

    $scope.RunOvers = function () {

        var input = document.querySelector("[name='overs']");


        input.addEventListener("input", function () {
            var value = this.value;
            if (value - parseInt(value) >= 0.59) {
                this.value = Math.ceil(value);
            }
        })


    }
    $scope.ManualVar = {};
    $scope.updateScoreBoard = function (a, b, c, d, e, f, g, h) {

        if (g == 1) {
            $scope.newBall = $scope.ManualVar.manualOver;

        } else {
            $scope.lastball = 0.0;
            // $scope.newBall=0.0;
            $scope.newBall = $scope.ManualVar.manualOver + parseFloat(c);
            var value = parseFloat($scope.newBall);
            if (value - parseInt(value) >= 0.59) {
                $scope.newBall = Math.ceil(value);
            }
        }
        if (h == 1) {
            e = document.getElementById('manualWicket').value;
        } else if (h == 0) {
            $scope.ManualVar.manualWickets = parseInt($scope.ManualVar.manualWickets) + e;
            e = $scope.ManualVar.manualWickets;
        }

        var scoreData = {
            betting_team: b,
            toss_winner: a,
            Overs: $scope.newBall,
            Runs: d,
            Wickets: e,
            id: $stateParams.MatchId,
            Selection1: $scope.selectionNames[0].id,
            Selection2: $scope.selectionNames[1].id,
            updatedRuns: f,
            message: $scope.ManualVar.manualMessage


        }

        $http({
            method: 'POST',
            url: 'Lstsavemstrcontroller/updateScoreBoard/',
            data: scoreData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data) {
                $scope.scoreboardjson = data.data[0];

                $scope.ManualVar.manualOver = $scope.scoreboardjson.selectedScore.overs;
                $scope.ManualVar.manualRuns = $scope.scoreboardjson.selectedScore.runs;
                $scope.ManualVar.manualWickets = parseInt($scope.scoreboardjson.selectedScore.wickets);


            });
    }

    $scope.IsShowMenu=function(type)
    {
        //
        var subAdmin= sessionService.get('subAdmin');
        if(subAdmin!=angular.isUndefinedOrNull && subAdmin=="true" )
        {
            if(sessionService.get('subAdminRole')!=angular.isUndefinedOrNull)
            {
                var groupRole= JSON.parse(sessionService.get('subAdminRole'));
                if(groupRole!=angular.isUndefinedOrNull)
                {

                    if(groupRole[type]!=angular.isUndefinedOrNull && groupRole[type]==1)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return true;
                }
            }
        }
        else
        {
            return true;
        }


    }

    var callType1 = "1";
    $scope.GetMarketListId = function () {
        if ($state.current.name == "dashboard.Matchodds" || $state.current.name == "dashboard.MatchoddsSubView") {

            getMarketlstTimer = $timeout(function () {

                if (callType1 == 1) {
                    $scope.loading = true;
                }
                else {
                    $scope.loading = false;
                }
                $scope.IsShowPage = true;
                //  socket.emit('CallGetMarketListId', {auth:Bauthdata,MatchId:$scope.MatchId,UserId:$scope.UserId});
                $http({
                    method: 'GET',
                    url: 'Apicontroller/getMarketListing/' + $scope.MatchId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                    $scope.DisplayMsg = data.data.DisplayMsg
                    debugger
                    //
                    if (data.data.result == 0) { 
                        $scope.CommonFun("Match Closed.");

                    }
                    else {
                        if (data.data.volumeLimit[0] != angular.isUndefinedOrNull) {

                            $scope.oddsLimit = parseFloat(data.data.volumeLimit[0].oddsLimit);
                            $scope.volumeLimit = parseFloat(data.data.volumeLimit[0].volumeLimit);
                        }
                        $scope.MatchOddsmsg = data.data.DisplayMsg;
                        if (data.data.DisplayMsg == 'Bet Close' || data.data.DisplayMsg == 'Bet Open') {
                            $scope.MatchOddsmsgLeft = data.data.DisplayMsg;

                        }
                        if (data.data.DisplayMsg == 'Wicket Down' || data.data.DisplayMsg == 'Free Hit' || data.data.DisplayMsg == '6' || data.data.DisplayMsg == '4' || data.data.DisplayMsg == 'Third Umpire' || data.data.DisplayMsg == 'No Ball' || data.data.DisplayMsg == 'Over' || data.data.DisplayMsg == 'Play Stop Due to Rain' || data.data.DisplayMsg == 'Run Out' || data.data.DisplayMsg == 'Take Review' || data.data.DisplayMsg == 'Ball Start' || data.data.DisplayMsg == 'Bet Close' || data.data.DisplayMsg == 'Drinks Break' || data.data.DisplayMsg == 'Inning Break'  || data.data.DisplayMsg == 'Not Out' || data.data.DisplayMsg == 'Run Check' || data.data.DisplayMsg == '1' || data.data.DisplayMsg == '2' || data.data.DisplayMsg == '3' || data.data.DisplayMsg == '5' || data.data.DisplayMsg == '0') {
                            $scope.MatchOddsmsgLeft = 'Bet Close';

                        }else{
                            $scope.MatchOddsmsgLeft = 'Bet Open';

                        }

                        $scope.MatchOddsStatus = data.data.msgStatus;
                        $scope.MatchBetAllow = data.data.isBetAllowedMatch;
                        $scope.MarketBetAllow = data.data.isBetAllowedMarket;
                        $scope.isBetAllowedOnManualMatchOdds = data.data.isBetAllowedOnManualMatchOdds;
                        $scope.isManualMatchOdds = data.data.isManualMatchOdds;
                        $scope.isManualMatch = data.data.is_manual;
                        $scope.isManualScore = data.data.isManualScore;
                        $scope.selectionNames = data.selection;

                        if ($scope.isManualMatch == 0 && $scope.isManualScore == 0) {
                            //$scope.ScoreBoard();
                            $scope.lotusScore=true;
                        }else{
                            //$scope.ScoreResult=undefined;
                            // $scope.GetScore();
                            $scope.lotusScore=false;


                        }
                        if ($scope.isManualMatch == 1 || $scope.isManualScore == 1) {


                            $scope.scoreboardjson = data.data.score_board_json[0];
                            if ($scope.scoreboardjson != angular.isUndefinedOrNull) {
                                if ($scope.scoreboardjson.selectedScore != angular.isUndefinedOrNull) {

                                    $scope.betting_team = $scope.scoreboardjson.selectedScore.bettingTeam;
                                    $scope.toss_winner = $scope.scoreboardjson.selectedScore.toss;
                                    if (callType1 == 1) {
                                        $scope.ManualVar.manualOver = $scope.scoreboardjson.selectedScore.overs;
                                        $scope.ManualVar.manualRuns = $scope.scoreboardjson.selectedScore.runs;
                                        $scope.ManualVar.manualWickets = parseInt($scope.scoreboardjson.selectedScore.wickets);
                                        //  callType1=2;
                                    }
                                }
                            }
                        }

                        if(callType1 == 1){
                            if (data.error) {

                                // Dialog.autohide(data.message);
                                $scope.loading = false;
                                // $scope.IsShowPage=false;
                                //$state.go("dashboard.Home");

                                $scope.BindSoketMarket(data);
                            }
                            else {
                                $scope.IsShowPage = true;
                                $scope.BindSoketMarket(data);
                                $scope.loading = false;
                            }
                        }


                        $scope.GetMarketListId();

                    }


                }).error(function (err) {
                    $scope.loading = false;
                });
            }, callType1 == 1 ? 0 : 1000);
        }

    }
    $scope.GetMarketListId();
    $scope.$on('$destroy', function () {
        $timeout.cancel(getMarketlstTimer);

    });
    $scope.changeMatchBetStatus = function (id, IsBetAllowed) {

        var active = IsBetAllowed == true ? 0 : 1;
        $scope.loading = true;
        $http.get(BASE_URL + 'Lstsavemstrcontroller/updateBetAllowedStatus/' + id + "/" + active).success(function (data, status, headers, config) {
            Dialog.autohide(data.message);
            $scope.loading = false;
            if (data.error == 0) {

                $scope.FinalArray[0].isBetAllowed = IsBetAllowed == true ? 0 : 1;
            }

        }).error(function (data, status, headers, config) {
            $scope.loading = false;
        });
    }
    $scope.updateScoreStatus = function (id, isManualScore) {

        var active = isManualScore == true ? 0 : 1;
        $scope.loading = true;
        $http.get(BASE_URL + 'Lstsavemstrcontroller/updateScoreStatus/' + id + "/" + active).success(function (data, status, headers, config) {
            Dialog.autohide(data.message);
            $scope.loading = false;
            if (data.error == 0) {

                $scope.FinalArray[0].isManualScore = isManualScore == true ? 0 : 1;
            }

        }).error(function (data, status, headers, config) {
            $scope.loading = false;
        });
    }
    $scope.OddsReplacement = function (Runners) {
        var teamBack = [];
        var smallBack = 0;
        var smallLay = 0;
        var smallFinalFrom = 'ex.availableToBack';

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
                smallFinalFrom = 'ex.availableToLay';
            }
            if ((teamBack[0] != teamBack[1])) {

                for (k = 0; k < Runners.length; k++) {
                    if (smallFinalFrom != 'ex.availableToLay') {
                        if (Runners[k].ex.availableToBack[0] != angular.isUndefinedOrNull && Runners[k].ex.availableToBack[0].price == smallBack) {
                            Runners[k].ex.availableToBack[0].price = (Runners[k].ex.availableToBack[0].price) - 1;
                            if (Runners[k].ex.availableToLay[0] != angular.isUndefinedOrNull) {
                                if (Runners[k].ex.availableToBack[0].price >= 0.10 && Runners[k].ex.availableToBack[0].price < 0.75) {
                                    Runners[k].ex.availableToLay[0].price = (Runners[k].ex.availableToBack[0].price + 0.02);
                                    $scope.equalBhav = false;
                                }
                                else if (Runners[k].ex.availableToBack[0].price >= 0.75 && Runners[k].ex.availableToBack[0].price < 0.94) {
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
    $scope.team1_selection_id = {};
    $scope.team2_selection_id = {};
    $scope.draw_selection_id = {};
    $scope.AssignSelectionId = function (RunnerValue) {
        if (RunnerValue.length == 3) {
            $scope.team1_selection_id[0] = RunnerValue[0].selectionId;
            $scope.team2_selection_id[0] = RunnerValue[1].selectionId;
            $scope.draw_selection_id[0] = RunnerValue[2].selectionId;
        }
        else {
            if (RunnerValue.length == 2) {
                $scope.team1_selection_id[0] = RunnerValue[0].selectionId;
                $scope.team2_selection_id[0] = RunnerValue[1].selectionId;
                $scope.draw_selection_id[0] = '';
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
            if ($state.current.name == "dashboard.Matchodds" ) {
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
    $scope.CallSocketMarket = function (result) {
        ajaxTimer = $timeout(function () {
            if ($state.current.name == "dashboard.Matchodds" ) {
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
                                    $scope.loading = false;
                                }
                            }

                        }
                        else{

                            $http.get('Lstsavemstrcontroller/manualMatchOddsDetails/' + $scope.MarketId).success(function (data, status, headers, config) {
                                $scope.isManualMatchOdds = data.isManualMatchOdds;
                                $scope.isManualMatchOddsData = data.data_formated;
                                //if($scope.isManualMatchOdds == 0)
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
    $scope.BindIndianFancy = function (data, mId) {


        // var temp  =  JSON.parse(event.data);

        var dataResult = data;

        // dataResult.push(data.message);
        var tempResult = [];
        if (dataResult != angular.isUndefinedOrNull) {

            if (dataResult.length > 0 && dataResult[0] != null) {
                var ind = dataResult.findIndex(x => x.market_id == mId);
                if (ind > -1) {
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

            }

            // $('#odds').html(JSON.stringify(event.data));
            //var Data = JSON.parse(event.data);
            //   alert(JSON.stringify(event.data));
            //console.log(JSON.stringify(event.data));
            //showMessage("<div class='"+Data.buy+"'>"+Data.sell+Data.average+"</div>");
            //$('#chat-message').val('');
        }

    }
    $scope.UpdateAdminFancyList = function (marketId) {
        $scope.UpdateAdminFancyTimer = $timeout(function () {
            if ($state.current.name == "dashboard.Matchodds" || $state.current.name == "dashboard.MatchoddsSubView") {
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
                });
            }
        }, 1000);
    }
    $scope.$on('$destroy', function () {

        $timeout.cancel(UpdateAdminFancyTimer);

    });
    /*
        $scope.SocketMarket = function (result) {
            //$scope.FancyLiveData = result.session;
            var market = result.data.runners;
            $scope.OddsReplacement(result.data.runners);

            $scope.FancyLiveData = result.session;

            if (market != angular.isUndefinedOrNull) {
                for (var m = 0; m < market.length; m++) {
                    //   ;
                    var inde = $scope.FinalArray[0].runners.findIndex(img => img.id === market[m].id);
                    if (inde > -1) {
                        for (var b = 0; b < $scope.FinalArray[0].runners[inde].ex.availableToBack.length; b++) {
                            var count = b + 1;
                            try {
                                $scope.FinalArray[0].runners[inde].ex.availableToBack[b].selected = $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToBack[b].price, $scope.FinalArray[0].runners[inde].ex.availableToBack[b].size, market[m].ex.availableToBack[b].price, market[m].ex.availableToBack[b].size);
                            }
                            catch (e) {

                            }
                            try {
                                $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = market[m].ex.availableToBack[b].price;
                            }
                            catch (e) {
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
                                }
                                catch(e){

                                }
                            try {
                                $scope.FinalArray[0].runners[inde].ex.availableToLay[b].price = market[m].ex.availableToLay[b].price;
                            }
                            catch (e) {
                                if ($scope.FinalArray[0].runners[inde].ex.availableToLay[b] != angular.isUndefinedOrNull) {
                                    $scope.FinalArray[0].runners[inde].ex.availableToLay[b].price = "";
                                }
                            }
                        try {
                            $scope.FinalArray[0].runners[inde].ex.availableToLay[b].size = market[m].ex.availableToLay[b].size;
                                }
                                catch(e)
                                {

                                }
                        }


                    }
                }
            }


        }
    */
    $scope.SocketMarket = function (result, manualstatus, manualdata) {
        if(result.session != angular.isUndefinedOrNull)
            $scope.FancyLiveData = result.session;
        // var market = result.data.runners;
        //$scope.FancyLiveData = result.session;
        var market = result.data.runners;
        $scope.OddsReplacement(result.data.runners);


        if (market != angular.isUndefinedOrNull) {
            for (var m = 0; m < market.length; m++) {
                //   ;
                var inde = $scope.FinalArray[0].runners.findIndex(img => img.selectionId === market[m].selectionId);
                if (inde > -1) {
                    for (var b = 0; b < $scope.FinalArray[0].runners[inde].ex.availableToBack.length; b++) {
                        var count = b + 1;
                        try {
                            $scope.FinalArray[0].runners[inde].ex.availableToBack[b].selected = $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToBack[b].price, $scope.FinalArray[0].runners[inde].ex.availableToBack[b].size, market[m].ex.availableToBack[b].price, market[m].ex.availableToBack[b].size);
                        }
                        catch (e) {

                        }
                        try {
                            if (manualstatus == 0) {
                                $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = market[m].ex.availableToBack[b].price;
                            }
                            else {
                                if (b == 0)
                                    $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = manualdata.ex.availableToBack[m].price - 1;

                                else {
                                    $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = market[m].ex.availableToBack[b].price - 1;
                                }
                            }
                        }
                        catch (e) {
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
                        try{
                            $scope.FinalArray[0].runners[inde].ex.availableToLay[b].selected = $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToLay[b].price, $scope.FinalArray[0].runners[inde].ex.availableToLay[b].size, market[m].ex.availableToLay[b].price, market[m].ex.availableToLay[b].size);
                        }
                        catch(e)
                        {

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
                        try{
                            $scope.FinalArray[0].runners[inde].ex.availableToLay[b].size = market[m].ex.availableToLay[b].size;
                        }
                        catch(e)
                        {

                        }

                    }


                }
            }
        }


    }
    $scope.GetOddCall = 1;
    $scope.OddsBetUserData = [];
    $scope.SessionBetUserData = [];
    $scope.GetOddSessionBets = function () {
        fetchAllSeesionOddBet = $timeout(function () {
            if ($state.current.name == "dashboard.Matchodds" || $state.current.name == "dashboard.MatchoddsSubView") {
                $http.get('Betentrycntr/GatBetDataByOddsAndSession/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                    if (data != angular.isUndefinedOrNull) {
                        if ($scope.OddsBetUserData.length != data.OddsBetUserData.length) {
                            $scope.MarketWinLoss();
                        }
                        if ($scope.SessionBetUserData.length != data.SessionBetUserData.length) {
                            $scope.MarketWinLoss();
                        }
                    }

                    $scope.OddsBetUserData = data.OddsBetUserData;
                    $scope.SessionBetUserData = data.SessionBetUserData;
                    $scope.GetOddSessionBets();
                    $scope.GetOddCall = 2;
                }).error(function (err) {
                    $scope.GetOddSessionBets();
                });

            }
        }, $scope.GetOddCall == 1 ? 0 : 6000);
    }
    $scope.GetOddSessionBets();

    $scope.$on('$destroy', function () {
        $timeout.cancel(fetchAllSeesionOddBet);

    });

    $scope.fetchCall = 1;
    $scope.fetchAllDeclaredSession = function () {
        fetchAllDeclaredSessionS = $timeout(function () {
            if ($state.current.name == "dashboard.Matchodds" || $state.current.name == "dashboard.MatchoddsSubView") {
                $http.get('Geteventcntr/declaredSessionList/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                    $scope.alllDeclaredSession = data.matchStatement.matchData;
                    $scope.totalPossion = data.matchStatement.totalProfit;
                    $scope.fetchAllDeclaredSession();
                });


                $scope.fetchCall = 2;
            }
        }, $scope.fetchCall == 1 ? 0 : 6000);

    };
    $scope.fetchAllDeclaredSession();

    $scope.$on('$destroy', function () {
        $timeout.cancel(fetchAllDeclaredSessionS);

    });

    var getKeyboardEventResult = function (keyEvent, keyEventDesc) {
        return keyEventDesc + " (keyCode: " + (window.event ? keyEvent.keyCode : keyEvent.which) + ")";
    };
    $scope.onKeyDown = function ($event) {
        $scope.onKeyDownResult = getKeyboardEventResult($event, "Key down");
        alert($scope.onKeyDownResult);
    };

    if (false ){
        document.addEventListener('keydown', function (evt) {
            var e = window.event || evt;
            var key = e.which || e.keyCode;
            if (76 == key) {
                $scope.setMessage('Bet Close')
            }
            else if (79 == key) {
                $scope.setMessage('Bet Open');


            }
            else if (65 == key) {

                $scope.Manuald.pointDiff=0.09;

            }
            else if (83 == key) {
                $scope.setMessage('Ball Start')

            }
            else if (48 == key) {
                $scope.setMessage('0')

            }
            else if (49 == key) {
                $scope.setMessage('1')

            }
            else if (50 == key) {
                $scope.setMessage('2')

            }
            else if (51 == key) {
                $scope.setMessage('3')

            }
            else if (52 == key) {
                $scope.setMessage('4')

            }
            else if (53 == key) {
                $scope.setMessage('5')

            }
            else if (54 == key) {
                $scope.setMessage('6')

            }
            else if (187 == key) {
                if($scope.bhavType == 0)
                    $scope.bhavType=1;
                else
                    $scope.bhavType=0;

            }
            else if (81 == key) {
                $scope.Manuald.pointDiff=0.01;
            }
            else if (87 == key) {
                $scope.Manuald.pointDiff=0.02;
            }
            else if (69 == key) {
                $scope.Manuald.pointDiff=0.03;
            }
            else if (82 == key) {
                $scope.Manuald.pointDiff=0.04;
            }
            else if (84 == key) {
                $scope.Manuald.pointDiff=0.05;
            }
            else if (89 == key) {
                $scope.Manuald.pointDiff=0.06;
            }
            else if (85 == key) {
                $scope.Manuald.pointDiff=0.07;
            }
            else if (73 == key) {
                $scope.Manuald.pointDiff=0.08;
            }
            else if (79 == key) {
                $scope.Manuald.pointDiff=0.09;
            }
            else if (80 == key) {
                $scope.Manuald.pointDiff=0.10;
            }




        }, false);
    }
    $scope.GetScore = function () {
        var cName = $state.current.name;
        var sName = "dashboard.Matchodds";

        scoreTimeOutOne = $timeout(function () {
            if (cName == sName) {
                var eventIds = $stateParams.MatchId;
                //var eventIds = '28448035';
                $http.get(BASE_URL + 'Geteventcntr/GetScoreApi/' + eventIds + '/' + $scope.isManualScore).then(function (result) {
                    if (result.data.length != 0) {
                        $scope.Documents = result.data[0];
                        $scope.displayScore = true;
                        if ($scope.Documents.eventTypeId == 2) {
                            $scope.Home = result.data[0].score.home.gameSequence;
                            $scope.away = result.data[0].score.away.gameSequence;
                        }
                    } else {
                        $scope.displayScore = false;
                    }
                    $scope.GetScore();

                });
            }
        }, 2000)

    }
    $scope.GetScore();
    $scope.$on('$destroy', function () {
        $timeout.cancel(scoreTimeOutOne);

    });
    $scope.ScoreBoard = function () {
        return;
        var cName = $state.current.name;
        var sName = "dashboard.Matchodds";

        scoreTimeOutTwo = $timeout(function () {

            if (cName == sName) {
                $.ajax({
                    url:"https://score.crakex.in:3290/matchid/"+$scope.MatchId,
                    type:"GET",
                    success:function(data){
                        $scope.ScoreResult=data.result;
                        $scope.ScoreBoard();
                    },
                    error:function(data)
                    {
                        $scope.ScoreBoard();
                    }
                })
                /*       $http.get("https://www.lotusbook.com/api/match-center/stats/4/" + $scope.MatchId).success(function (data) {

                           $scope.ScoreResult = data.result;
                           $scope.ScoreBoard();

                       });*/
            }
            //}

        }, 2000)
    }
    $scope.ScoreBoard();
    // if ($scope.isManualMatch == 0 || $scope.isManualScore == 0) {
    // }

    $scope.IsManual = '';
    $scope.IsManualOdds = function (GetMarketInfo) {

        console.log($scope.setManualValue);
        $scope.IsManual = !$scope.IsManual;
        //$scope.IsManualTitle = $scope.IsManual == true ? 'Manual' : 'Auto';

        $scope.IsManualVal = GetMarketInfo.isManualMatchOdds == '0' ? '1' : '0';

        $http.get('Lstsavemstrcontroller/updateMatchOddsStatus/' + $stateParams.MarketId + '/' + $scope.IsManualVal).success(function (data, status, headers, config) {
            GetMarketInfo.isManualMatchOdds = GetMarketInfo.isManualMatchOdds == '0' ? '1' : '0';
            $scope.IsManualTitle = GetMarketInfo.isManualMatchOdds == '1' ? 'Manual' : 'Auto';
            $scope.ManualData = data.message;
            if ($scope.IsManualVal == 1) {
                $scope.UpdateManualOdds(0, $scope.pointDiff, $scope.setManualValue, 1)
                $scope.setMessage('Bet Open')

            }

            //  Dialog.autohide($scope.ManualData);

        });
    }
    $scope.updateManualbetAllow = function (value) {

        $http.get('Lstsavemstrcontroller/updateBetAllowedOnManualMatch/' + $stateParams.MarketId + '/' + value).success(function (data, status, headers, config) {
            $scope.isBetAllowedOnManualMatchOdds = value;

            if (value == 1){
                $scope.setMessage('Bet Open');

            }
            else{
                $scope.setMessage('Bet Close');

            }

            $scope.ManualData = data.message;
            //  Dialog.autohide($scope.ManualData);

        });
    }


    $scope.CalCulatePointDiff = function (indx, pointDiff) {
        $scope.team1layodd[indx] = $scope.team1backodd[indx] > 0 ? (parseFloat($scope.team1backodd[indx]) + parseFloat(pointDiff)).toFixed(3) : 0;
        $scope.team1layodd[indx] = parseFloat($scope.team1layodd[indx]);
    }


    $scope.updateCommentry = function (iscommentry) {
        $scope.IsManualVal = iscommentry == '0' ? '1' : '0';

        $http.get('Lstsavemstrcontroller/updateMatchOddsMsgStatus/' + $stateParams.MarketId + '/' + $scope.IsManualVal).success(function (data, status, headers, config) {

            if ($scope.IsManualVal == 1)
                $scope.setMessage('Bet Open')
            $scope.MatchOddsStatus = iscommentry == '0' ? '1' : '0';
            $scope.IsCommentryTitle = iscommentry == '0' ? 'Manual' : 'Auto';
            $scope.ManualData = data.message;
            Dialog.autohide($scope.ManualData);

        });
    }


    $scope.setMessage = function (msgChk) {

        var TypeId = 2;
        var formData = {marketId: $stateParams.MarketId, message: msgChk, matchId: $stateParams.MatchId};
        var url = BASE_URL + "Lstsavemstrcontroller/setMatchOddsMsg/";
        $http.post(url, formData).success(function (response) {

            var resp = "Update Success " + msgChk;
            // Dialog.autohide(resp);

        });

    }

    $scope.lastFocusId = function (id) {

        $scope.lastFocusIdd = id;
        alert($scope.lastFocusIdd);
    }

    $scope.sameBhav = function (val) {

        $scope.bhavType = val;

    }
    $scope.UpdateManualOdds = function (index, pointDiff, ManualValue, checkM, runnerlength, marketInfo) {

        $scope.selectionId1 = null;
        $scope.selectionId2 = null;
        $scope.selectionId3 = null;
        var isBetAllowedOnManualMatchOdds = $scope.isBetAllowedOnManualMatchOdds == 0 ? 1 : 0
        $scope.updateManualbetAllow(isBetAllowedOnManualMatchOdds);
        if (checkM == 1) {
            if (ManualValue.Back[0].ex.availableToBack[0] != angular.isUndefinedOrNull)
                $scope.team1backodd[0] = $scope.getOddCalcVal(ManualValue.Back[0].ex.availableToBack[0].price, 1);
            if (ManualValue.Back[1].ex.availableToBack[0] != angular.isUndefinedOrNull)
                $scope.team1backodd[1] = $scope.getOddCalcVal(ManualValue.Back[1].ex.availableToBack[0].price, 1);
            if (ManualValue.Back[2] != angular.isUndefinedOrNull) {
                $scope.team1layodd[2] = $scope.getOddCalcVal(ManualValue.Back[2].ex.availableToLay[0].price, 1);
                if (ManualValue.Back[2].ex.availableToBack[0] != angular.isUndefinedOrNull)
                    $scope.team1backodd[2] = $scope.getOddCalcVal(ManualValue.Back[2].ex.availableToBack[0].price, 1);
            }
            if (ManualValue.Back[0].ex.availableToLay[0] != angular.isUndefinedOrNull)
                $scope.team1layodd[0] = $scope.getOddCalcVal(ManualValue.Back[0].ex.availableToLay[0].price, 1);
            if (ManualValue.Back[1].ex.availableToLay[0] != angular.isUndefinedOrNull)
                $scope.team1layodd[1] = $scope.getOddCalcVal(ManualValue.Back[1].ex.availableToLay[0].price, 1);


        }
        else if (runnerlength == 3) {
            $scope.selectionId1 = marketInfo[0].selectionId;
            $scope.selectionId2 = marketInfo[1].selectionId;
            $scope.selectionId3 = marketInfo[2].selectionId;
            if (index == 0) {
                $scope.team1layodd[0] = (parseFloat($scope.team1backodd[0]) + pointDiff).toFixed(2);


            }
            else if (index == 1) {

                $scope.team1layodd[1] = (parseFloat($scope.team1backodd[1]) + pointDiff).toFixed(2);


            }
            else {

                $scope.team1layodd[2] = (parseFloat($scope.team1backodd[2]) + pointDiff).toFixed(2);

            }
        }
        else if (runnerlength == 2) {
            $scope.selectionId1 = marketInfo[0].selectionId;
            $scope.selectionId2 = marketInfo[1].selectionId;
            if ($scope.bhavType == 0) {
                if (index == 0) {
                    $scope.team1layodd[0] = (parseFloat($scope.team1backodd[0]) + pointDiff).toFixed(2);
                    $scope.team1layodd[1] = 0;
                    $scope.team1layodd[2] = 0;
                    $scope.team1backodd[1] = 0;
                    $scope.team1backodd[2] = 0;

                } else if (index == 1) {

                    $scope.team1layodd[0] = 0;
                    $scope.team1layodd[1] = (parseFloat($scope.team1backodd[1]) + pointDiff).toFixed(2);
                    $scope.team1layodd[2] = 0;
                    $scope.team1backodd[0] = 0;
                    $scope.team1backodd[2] = 0;


                }
                else {
                    $scope.team1layodd[0] = 0;
                    $scope.team1layodd[1] = 0;
                    $scope.team1backodd[0] = 0;
                    $scope.team1backodd[1] = 0;
                    $scope.team1layodd[2] = (parseFloat($scope.team1backodd[2]) + pointDiff).toFixed(2);
                }
            }
            else {

                if (index == 0) {
                    $scope.team1layodd[0] = 0;
                    $scope.team1layodd[1] = 0;
                    $scope.team1layodd[2] = 0;
                    $scope.team1backodd[1] = $scope.team1backodd[0];
                    $scope.team1backodd[2] = 0;

                } else if (index == 1) {

                    $scope.team1layodd[0] = 0;
                    $scope.team1layodd[1] = 0;
                    $scope.team1layodd[2] = 0;
                    $scope.team1backodd[0] = $scope.team1backodd[1];
                    $scope.team1backodd[2] = 0;


                }
                else {
                    $scope.team1layodd[0] = 0;
                    $scope.team1layodd[1] = 0;
                    $scope.team1backodd[0] = 0;
                    $scope.team1backodd[1] = 0;
                    $scope.team1layodd[2] = 0;
                }
            }

        }


        var formData = {
            "market_id": $stateParams.MarketId,
            "selectionId1": $scope.selectionId1,
            "selectionId2": $scope.selectionId2,
            "selectionId3": $scope.selectionId3,
            "team1_back": $scope.team1backodd[0].toString(),
            "team1_lay": $scope.team1layodd[0],
            "team2_back": $scope.team1backodd[1],
            "team2_lay": $scope.team1layodd[1],
            "draw_back": $scope.team1backodd[2],
            "draw_lay": $scope.team1layodd[2],
            "dlay_time": pointDiff,
            "status": isBetAllowedOnManualMatchOdds
        };
        var url = BASE_URL + "Lstsavemstrcontroller/saveManualMatchOdds";
        $http.post(url, formData).success(function (response) {
            if (!response.error) {
                // Dialog.autohide(response.message);
            }
        });
    }

    var callcancelbet = 1;
    $scope.GetUserData = function () {
        $scope.FancyBet1 = $timeout(function () {
            if ($state.current.name == "dashboard.Matchodds" || $state.current.name == "dashboard.MatchoddsSubView") {
                $http.get('Betentrycntr/GatBetData/' + $stateParams.MarketId + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId).success(function (data, status, headers, config) {
                    //$scope.UserData = data.betUserData;
                    $scope.cancelledBetUserData = data.cancelledBetUserData;
                    $scope.GetUserData();
                    callcancelbet = 2;
                }).error(function () {
                    $scope.GetUserData();
                })
            }
        }, callcancelbet == 1 ? 0 : 6000);

    }
    $scope.GetUserData();
    $scope.clearScorePos = function () {
        $timeout.cancel(scorePosition);
        $scope.scorePosition1 = [];
        var callscorepostype = 0;
    }
    var scorePosition;
    $scope.scorePosition1 = [];
    $scope.result = [];
    var OldFanyID = 0;
    var oldFancyTypeId = 0;
    var callscorepostype = 0;
    $scope.scorePosition = function (FancyId, FancyTypeId) {
        if (FancyId != OldFanyID) {
            OldFanyID = FancyId;
            oldFancyTypeId = FancyTypeId;
            $scope.scorePosition1 = [];
            $timeout.cancel(scorePosition);

        }
        if (FancyId != angular.isUndefinedOrNull) {
            scorePosition = $timeout(function () {
                if ($state.current.name == "dashboard.Matchodds" || $state.current.name == "dashboard.MatchoddsSubView") {
                    var $promise = $http.get(BASE_URL + 'Sessioncntr/FancyScorePosition/' + FancyId + '/' + sessionService.get('slctUseID') + '/' + FancyTypeId);
                    $promise.then(function (response) {

                        if (callscorepostype == 0) {
                            $scope.scorePosition1 = [];
                            $scope.result = [];

                            $scope.scorePosition1 = response.data.scorePosition;
                            callscorepostype = 1;
                        }
                        else {
                            $scope.result = response.data.scorePosition;

                        }

                        for (var i = 0; i < $scope.result.length; i++) {

                            $scope.scorePosition1[i] = ($scope.result[i]);


                        }


                        $scope.scorePosition(FancyId, FancyTypeId);
                    });
                }
            }, 4000);
        }
    }

    $scope.$on('$destroy', function () {
        $timeout.cancel(scorePosition);

    });
    //FancyBet = $timeout($scope.GetUserData, 3000);
    $scope.$on('$destroy', function () {
        $timeout.cancel(FancyBet);

    });

    $scope.styleColor = function (value) {
        if (value < 0) {
            return "RED";
        } else {
            return "GREEN";
        }
    }
    if ($scope.gtTypeId != 3) {
        var scorePosition = $interval(function () {
            if ($stateParams.MatchId == sessionService.get('MatchId') && $scope.gtTypeId != 3) {
                var $promise = $http.get(BASE_URL + 'Sessioncntr/FancyScorePosition/' + sessionService.get('fancyId') + '/' + sessionService.get('slctUseID') + '/' + sessionService.get('FancyType'));
                $promise.then(function (response) {
                    $scope.scorePosition = response.data.scorePosition;
                });
            }
        }, 2000);
    }
    $scope.deleteUser = function (betId, userId) {
        var result = confirm("Are you sure want to delete Unmatched Records");
        if (result) {
            $http.get('Betentrycntr/deleteGetbetting/' + betId + '/' + userId).success(function (data, status, headers, config) {

                Dialog.autohide("Record Deleted Successfully...");
            });

        }

    }
    $scope.deleteUser1 = function (betId, userId, MarketId) {
        var result = confirm("Are you sure want to delete Matched Records?");
        if (result) {
            $http.get('Betentrycntr/deleteGetbettingmat/' + betId + '/' + userId + '/' + MarketId).success(function (data, status, headers, config) {

                Dialog.autohide("Record Deleted Successfully...");

            });

        }

    }
    $scope.sum = function (items, prop) {
        return items.reduce(function (a, b) {
            var t = parseFloat(a) + parseFloat(b[prop]);
            return parseFloat(a) + parseFloat(b[prop]);
        }, 0);
    };


    /*end of new function*/
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
                    $scope.message = data.status.message;
                    $rootScope.$broadcast('changeSidebar_Market', {});

                    if (sessionService.get('type') == "1")
                        $state.go('dashboard.Masterdashboard');
                    else if (sessionService.get('type') == "2")
                        $state.go('dashboard.Dealerdashboard');
                    else if (sessionService.get('type') == "3")
                        $state.go('dashboard.Userdashboard');
                } catch (e) {
                    console.log(data.status.error);
                }
            });
    }

    $scope.getNameFunc = function () {

        var user_id = sessionService.get('slctUseID');
        var user_type = sessionService.get('slctUseTypeID');

        $http.get('Geteventcntr/getBackLaysOfMarketSelectionName/' + $scope.MarketId + '/' + user_id + '/' + user_type + '/' + $scope.MatchId).success(function (data, status, headers, config) {

            if (data.runnerSlName != angular.isUndefinedOrNull && data.runnerSlName.length > 0)
                $scope.GetMarketBackLayDataSelectionName = data.runnerSlName[0].runners;
            if (data.RunnerValue != angular.isUndefinedOrNull && data.RunnerValue.length != 0)
                $scope.RunnerValue = data.RunnerValue;
            else
                $scope.RunnerValue = [{}];

            if (data.MarketData != angular.isUndefinedOrNull && data.MarketData.length != 0)
                $scope.GetMarketInfo = data.MarketData[0];
            //$scope.IsManualTitle =$scope.GetMarketInfo.isManualMatchOdds == '1' ? 'Manual' : 'Auto';
            $scope.ManualMatchOddsData = data.ManualMatchOddsData;
            if ($scope.ManualMatchOddsData != null) {
                $scope.team1backodd[0] = $scope.getOddCalcVal(parseFloat($scope.ManualMatchOddsData.team1_back - 1), 1);
                $scope.team1backodd[1] = $scope.getOddCalcVal(parseFloat($scope.ManualMatchOddsData.team2_back - 1), 1);
                $scope.team1backodd[2] = $scope.getOddCalcVal(parseFloat($scope.ManualMatchOddsData.draw_back - 1), 1);
                $scope.team1layodd[0] = $scope.getOddCalcVal(parseFloat($scope.ManualMatchOddsData.team1_lay - 1), 1);
                $scope.team1layodd[1] = $scope.getOddCalcVal(parseFloat($scope.ManualMatchOddsData.team2_lay - 1), 1);
                $scope.team1layodd[2] = $scope.getOddCalcVal(parseFloat($scope.ManualMatchOddsData.draw_lay - 1), 1);

            }
        });
    }
    $scope.getSumValPnL = function (a, b) {
        if (a == angular.isUndefinedOrNull && b == angular.isUndefinedOrNull) {
            a = 0;
            b = 0;
        }
        return (parseFloat(a) + parseFloat(b));
    }
    $scope.counter = 0;
    var totalMatch = 0;
    var selectedRunner = null;
    $scope.$on("$destroy", function (event) {
        $interval.cancel($scope.stopScore);
        $timeout.cancel($scope.callOddsFunc);
        $scope.callOddsFunc = angular.isUndefinedOrNull;
    });
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
            if (sessionService.get('type') == "0") {
                $http({
                    method: 'POST',
                    url: 'Geteventcntr/matchMarketLst/',
                    data: {
                        matchId: $stateParams.MatchId,
                        sportsId: 4,
                        user_id: sessionService.get('user_id')
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                    try {
                        $scope.FancyLength = data.getMatchFancy.length;
                        if ($scope.FancyLength > 0 && $scope.FancyData != angular.isUndefinedOrNull && $scope.FancyData.length > 0) {
                            if ($scope.FancyData.length == data.getMatchFancy.length) {
                                for (var i = 0; i < data.getMatchFancy.length; i++) {
                                    if ($scope.FancyData[i].SessInptYes == data.getMatchFancy[i].SessInptYes && $scope.FancyData[i].SessInptNo == data.getMatchFancy[i].SessInptNo && $scope.FancyData[i].active == data.getMatchFancy[i].active && $scope.FancyData[i].DisplayMsg == data.getMatchFancy[i].DisplayMsg) {

                                    } else {
                                        $scope.FancyData = data.getMatchFancy;
                                    }
                                }
                            } else {
                                $scope.FancyData = data.getMatchFancy;
                            }

                        } else {
                            $scope.FancyData = data.getMatchFancy;
                        }
                        if ($filter('filter')(data.MatchMarket, {Id: $scope.MarketId})[0].IsPlay == "1") {
                            $scope.PLAYPAUSE = $filter('filter')(data.MatchMarket, {Id: $scope.MarketId})[0].IsPlay;
                        } else {
                            $scope.PLAYPAUSE = $filter('filter')(data.MatchMarket, {Id: $scope.MarketId})[0].IsPlay;
                        }
                    } catch (e) {
                    }
                });
            }
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
                if (response.data.MarketRunner != angular.isUndefinedOrNull && response.data.MarketRunner.totalMatched > totalMatch) {
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
                                if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack.length == selectedRunner[j].ex.ex.availableToBack.length) {
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0].price != selectedRunner[j].ex.ex.availableToBack[0].price || $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0].size != selectedRunner[j].ex.ex.availableToBack[0].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0].price = selectedRunner[j].ex.ex.availableToBack[0].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0].size = selectedRunner[j].ex.ex.availableToBack[0].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0].price = "";
                                        }
                                    }
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1].price != selectedRunner[j].ex.ex.availableToBack[1].price || $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1].size != selectedRunner[j].ex.ex.availableToBack[1].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1].price = selectedRunner[j].ex.ex.availableToBack[1].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1].size = selectedRunner[j].ex.ex.availableToBack[1].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1].price = "";
                                        }
                                    }
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[2].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[2].price != selectedRunner[j].ex.ex.availableToBack[2].price || $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[2].size != selectedRunner[j].ex.ex.availableToBack[2].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[2].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[2].price = selectedRunner[j].ex.ex.availableToBack[2].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[2].size = selectedRunner[j].ex.ex.availableToBack[2].size;
                                    } catch (e) {
                                        g
                                        if ($scope.GetMarketBackLayData.rgunners[j].ex.ex.availableToBack[2] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.rgunners[j].ex.ex.availableToBack[2].price = "";
                                        }
                                    }
                                } else {

                                    $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack = selectedRunner[j].ex.ex.availableToBack;
                                }
                                if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay.length == selectedRunner[j].ex.ex.availableToLay.length) {
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0].price != selectedRunner[j].ex.ex.availableToLay[0].price || $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0].size != selectedRunner[j].ex.ex.availableToLay[0].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0].price = selectedRunner[j].ex.ex.availableToLay[0].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0].size = selectedRunner[j].ex.ex.availableToLay[0].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0].price = "";
                                        }
                                    }
                                    g
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1].price != selectedRunner[j].ex.ex.availableToLay[1].price || $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1].size != selectedRunner[j].ex.ex.availableToLay[1].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1].price = selectedRunner[j].ex.ex.availableToLay[1].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1].size = selectedRunner[j].ex.ex.availableToLay[1].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1].price = "";
                                        }
                                    }
                                    try {
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2].SELECTED = false;
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2].price != selectedRunner[j].ex.ex.availableToLay[2].price || $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2].size != selectedRunner[j].ex.ex.availableToLay[2].size) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2].SELECTED = true;
                                        }
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2].price = selectedRunner[j].ex.ex.availableToLay[2].price;
                                        $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2].size = selectedRunner[j].ex.ex.availableToLay[2].size;
                                    } catch (e) {
                                        if ($scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2] != angular.isUndefinedOrNull) {
                                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2].price = "";
                                        }
                                    }
                                } else {

                                    $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay = selectedRunner[j].ex.ex.availableToLay;
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
                    for (var j = 0; j < maxloop; j++) { // $scope.GetMarketBackLayData.runners.length 170204
                        //for (var i = 0; i < 3; i++) {//$scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack.length
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[0].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[1].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToBack[2].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[0].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[1].SELECTED = false;
                        } catch (e) {
                        }
                        try {
                            $scope.GetMarketBackLayData.runners[j].ex.ex.availableToLay[2].SELECTED = false;
                        } catch (e) {
                        }
                        //}
                    }
                    if ($scope.GetMarketBackLayData.Status != 3) {
                        if ($scope.GetMarketBackLayData.marketId != null) {
                            $scope.callOddsFunc();
                            $scope.getNameFunc();
                        }
                    }
                } else {
                    $scope.callOddsFunc();
                    $scope.getNameFunc();
                }
            }, 1000);
            /*{aakash 161226*/
            var OnlineStatus = $interval(OnlineStatusChanged, 10000)
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
                        $scope.getNameFunc();
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
        //}
    }
    $scope.callOddsCloseMatch = function () {
        //
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
                    $scope.saveMatchoddsResult($scope.MatchId, $scope.GetMarketInfo.SportID, $scope.MarketId, vSelectionID, 1, $scope.GetMarketInfo.SportName, $stateParams.matchName, $scope.GetMarketInfo.MarketName, selectionName1);
                //}
                //}
            } else {
                $http.get('Geteventcntr/getSelectionName/' + $scope.MarketId + '/' + $scope.MatchId).success(function (data, status, headers, config) {
                    //$scope.RunnerValue = data.RunnerValue;
                    selectionName1 = $filter('filter')(data.RunnerValue, {selectionId: vSelectionID})[0].selectionName;
                    if (selectionName1 != "")
                    //
                        $scope.saveMatchoddsResult($scope.MatchId, $scope.GetMarketInfo.SportID, $scope.MarketId, vSelectionID, 1, $scope.GetMarketInfo.SportName, $stateParams.matchName, $scope.GetMarketInfo.MarketName, selectionName1);
                });
            }
            //}
            //}
        } else if ($scope.MatchResult == "CLOSED") {
            $scope.GetMarketBackLayData.status = "CLOSED";
            $timeout.cancel(marketTimer);
            marketTimer = angular.isUndefinedOrNull;
            $rootScope.$broadcast('changeSidebar_Market', {});
            if (sessionService.get('type') == "1")
                $state.go('dashboard.Masterdashboard');
            else if (sessionService.get('type') == "2")
                $state.go('dashboard.Dealerdashboard');
            else if (sessionService.get('type') == "3")
                $state.go('dashboard.Userdashboard');

        }

    };
    $scope.stakeValReset = function (val) {
        $scope.stake = parseInt(val);
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
    $scope.stakeVal = function (val, selectionId, stake) {

        if (stake == angular.isUndefinedOrNull) {
            stake = 0;
        }
        if (stake == 0) {
        }
        $scope.sumOfVal = parseFloat(val) * parseInt(stake) - parseInt(stake);
        $scope.sumOfVal = $scope.sumOfVal.toFixed(2);
        $scope.stake = parseInt(val);//$scope.stake +
        $scope.MarketId = $stateParams.MarketId;
        $scope.UserTypeId = sessionService.get('type');
        var userId = document.getElementById('userId').value;
        var ParantId = document.getElementById('ParantId').value;
        var loginId = document.getElementById('loginId').value;
        var selectionId = document.getElementById('selectionId').value;
        var matchId = document.getElementById('matchId').value;
        var isback = document.getElementById('isback').value;
        var MarketId = document.getElementById('MarketId').value;
        var priceVal = $scope.priceVal;
        var stake = $scope.stake;
        var placeName = document.getElementById('placeName').value;
        var chkValPrice = document.getElementById('chkValPrice').value;
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
    $scope.getValColor = function (val) {
        if (val == angular.isUndefinedOrNull || val == 0)
            return 'color:#000000';
        else if (val > 0)
            return 'color:darkgreen';
        else
            return 'color:darkred';
    }
    $scope.CommonFun = function (msg) {
        //websocket.onclose();
        Dialog.autohide(msg);
        $scope.loading = false;
        //$scope.IsShowPage=false;
        //$state.go("dealerDashboard.Home");
    }

    $scope.BindMarket12 = function (result) {

        if (result.data != angular.isUndefinedOrNull) {
            $scope.marketIdLst = result.data.marketid;
            // $scope.MarketWinLoss(result.data.marketid);
            $scope.MarketLst = result.data.marketid.split(',');
            $scope.AllMarket = $scope.MarketLst;
            $scope.FinalArray[0] = result.data.selection.result[0];
            $scope.GetMarketBackLayData = result.data.selection;
            if (result.data.selection.result[0] != null && result.data.selection.result.length > 0) {
                $scope.CallType = 'first';
                $scope.MarketId = result.data.marketid
                $scope.getFancyList(result.data.marketid);


            }
            else {

                $scope.MarketRunnerLst = result.data.marketRunner == null ? [] : result.data.marketRunner;
                $scope.TempArray = [];
                for (var j = 0; j < $scope.MarketRunnerLst.length; j++) {
                    if ($scope.MarketRunnerLst[j] != angular.isUndefinedOrNull && $scope.MarketRunnerLst[j].status == "CLOSED") {
                        var vSelectionID = $filter('filter')($scope.MarketRunnerLst[j].runners, {status: "WINNER"})[0].selectionId;
                        var obj = {"marketId": $scope.MarketRunnerLst[j].marketId, "selectionId": vSelectionID};
                        $scope.TempArray.push(obj);

                    }
                }
                if ($scope.TempArray.length > 0) {
                    $scope.saveMatchoddsResultAutoMatic($scope.TempArray);
                }
            }
        }
        else {
            $scope.loading = false;
        }
    }

    $scope.BindMarket = function (result) {

        if (result.data != angular.isUndefinedOrNull) {
            $scope.loading = false;
            $scope.marketIdLst = result.data.marketid;

            // $scope.MarketWinLoss(result.data.marketid);
            $scope.MarketLst = result.data.marketid.split(',');
            $scope.AllMarket = $scope.MarketLst;
            $scope.FinalArray[0] = result.data.selection.result[0];
            if (result.data.selection.result[0] != null && result.data.selection.result.length > 0) {
                $scope.CallType = 'first';
                $scope.SPORTID = result.data.marketRunner.result[0].eventTypeId;
                // $scope.getFancyList(result.data.marketid);
                var soketUrl = urlArray.findIndex(x => x.SportId == $scope.SPORTID);
                if (soketUrl > -1) {
                    websocket = new WebSocket(urlArray[soketUrl].url);

                    websocket.onopen = function () {
                        console.log("Opening a connection...");
                        //window.identified = false;
                    };
                    $scope.MarketId = result.data.marketid;

                    if ($scope.SPORTID == 4) {

                        $scope.PhpSocketMarket();
                    }
                    else {
                        $scope.PhpSocketMarket();
                    }
                }


            }
            else {

                $scope.MarketRunnerLst = result.data.marketRunner == null ? [] : result.data.marketRunner;
                $scope.TempArray = [];
                for (var j = 0; j < $scope.MarketRunnerLst.length; j++) {
                    if ($scope.MarketRunnerLst[j] != angular.isUndefinedOrNull && $scope.MarketRunnerLst[j].status == "CLOSED") {
                        var vSelectionID = $filter('filter')($scope.MarketRunnerLst[j].runners, {status: "WINNER"})[0].selectionId;
                        var obj = {"marketId": $scope.MarketRunnerLst[j].marketId, "selectionId": vSelectionID};
                        $scope.TempArray.push(obj);

                    }
                }
                if ($scope.TempArray.length > 0) {
                    $scope.saveMatchoddsResultAutoMatic($scope.TempArray);
                }
            }
        }
        else {
            $scope.loading = false;
        }
    }

    $scope.PhpSocketMarket = function () {
        $timeout(function () {
            $scope.loading = false;

            websocket.onmessage = function (event) {
                //
                var temp = JSON.parse(event.data);
                var dataResult = temp.message;
                var tempResult = [];
                if (dataResult != angular.isUndefinedOrNull) {
                    if (dataResult.result.length > 0) {
                        var ind = dataResult.result.findIndex(x => x.id == $scope.MarketId);
                        if (ind > -1) {
                            tempResult.data = dataResult.result[ind];
                            $scope.SocketMarket(tempResult);

                        }

                    }
                }

                // $('#odds').html(JSON.stringify(event.data));
                //var Data = JSON.parse(event.data);
                //   alert(JSON.stringify(event.data));
                //console.log(JSON.stringify(event.data));
                //showMessage("<div class='"+Data.buy+"'>"+Data.sell+Data.average+"</div>");
                //$('#chat-message').val('');
            };


            $scope.PhpSocketMarket();
        }, 1000);
    }


    var lsMarketVal = null;
    var lstmarketoldval = 0
    $scope.MarketWinLoss = function () {
        //  $scope.marketwinlosstime=$timeout(function(){

        if ($state.current.name == "dashboard.Matchodds" || $state.current.name == "dashboard.MatchoddsSubView") {
            $http({
                method: "POST",
                url: 'Apicontroller/market_win_loss',
                data: {"matchId": $scope.MatchId, "MarketId": $stateParams.MarketId},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $scope.TRunnerValue = data.data;
                //$scope.MarketWinLoss(lstMarket);
            })
        }
        // },3000);

    }
    $scope.MarketWinLoss();

    $scope.$on('$destroy', function () {
        $timeout.cancel($scope.marketwinlosstime);
    });
    $scope.MarketWinLossByMId = function (MarketId) {


        var obj = null;
        if ($scope.TRunnerValue != angular.isUndefinedOrNull) {
            obj = $filter('filter')($scope.TRunnerValue, {marketId: MarketId})[0].runners;


        }
        return obj;

    }

    $scope.FancyData = [];
    $scope.FancyDataTemp = [];
    $scope.getFancyList = function (marketId) {
        if ($state.current.name == "dashboard.Matchodds" || $state.current.name == "dashboard.MatchoddsSubView") {
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
                            $scope.FancyData = result.data;

                        for (var i = 0; i < $scope.FancyData.length; i++) {
                            var inde = $scope.FancyDataTemp.findIndex(x => x.ID == $scope.FancyData[i].ID);
                            if (inde > -1) {

                                if ($scope.FancyDataTemp[inde].fancy_mode == 'M') {
                                    $scope.FancyData[i].HeadName=$scope.FancyDataTemp[inde].HeadName;
                                    $scope.FancyData[i].fancy_mode = $scope.FancyDataTemp[inde].fancy_mode
                                    $scope.FancyData[i].SessInptNo = $scope.FancyDataTemp[inde].SessInptNo;
                                    $scope.FancyData[i].NoValume = $scope.FancyDataTemp[inde].NoValume;
                                    $scope.FancyData[i].SessInptYes = $scope.FancyDataTemp[inde].SessInptYes;
                                    $scope.FancyData[i].YesValume = $scope.FancyDataTemp[inde].YesValume;
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
                });

            }, 1000);
        }
    }
    $scope.getLiveFancyList = function () {
        $timeout(function () {
            // socket.emit('CallLiveFancy', {auth:Bauthdata,MarketId:$scope.MarketId,UserId:$scope.UserId});
            /*get_userser.getBothSessionFancy($stateParams.MatchId,function(response) {
            $scope.loading=false;
                $scope.FancyData = response.data;
            });*/
            $.ajax({
                url: 'http://139.162.52.34/customer/v1/market.php?market_id=' + $scope.MarketId,
                type: 'GET',
                dataType: 'JSON',
                success: function (result) {
                    $scope.loading = false;
                    //result = JSON.parse(result);
                    $scope.FancyLiveData = result.session;
                    var market = result.market[0].events;
                    if (market != angular.isUndefinedOrNull) {
                        for (var m = 0; m < market.length; m++) {
                            //   ;
                            var inde = $scope.FinalArray[0].runners.findIndex(img => img.id === market[m].SelectionId);
                            if (inde > -1) {
                                for (var b = 0; b < $scope.FinalArray[0].runners[inde].ex.availableToBack.length; b++) {
                                    var count = b + 1;
                                    try {
                                        $scope.FinalArray[0].runners[inde].ex.availableToBack[b].selected = $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToBack[b].price, $scope.FinalArray[0].runners[inde].ex.availableToBack[b].size, market[m]["BackPrice" + count], market[m]["BackSize" + count]);
                                    }
                                    catch (e) {

                                    }
                                    try {
                                        $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = market[m]["BackPrice" + count];
                                    }
                                    catch (e) {
                                        if ($scope.FinalArray[0].runners[inde].ex.availableToBack[b] != angular.isUndefinedOrNull) {
                                            $scope.FinalArray[0].runners[inde].ex.availableToBack[b].price = "";
                                        }
                                    }
                                    try {
                                        $scope.FinalArray[0].runners[inde].ex.availableToBack[b].size = market[m]["BackSize" + count];
                                    }
                                    catch (e) {

                                    }


                                }
                                for (var b = 0; b < $scope.FinalArray[0].runners[inde].ex.availableToLay.length; b++) {
                                    var count = b + 1;
                                    $scope.FinalArray[0].runners[inde].ex.availableToLay[b].selected = $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToLay[b].price, $scope.FinalArray[0].runners[inde].ex.availableToLay[b].size, market[m]["LayPrice" + count], market[m]["LaySize" + count]);
                                    try {
                                        $scope.FinalArray[0].runners[inde].ex.availableToLay[b].price = market[m]["LayPrice" + count];
                                    }
                                    catch (e) {
                                        if ($scope.FinalArray[0].runners[inde].ex.availableToLay[b] != angular.isUndefinedOrNull) {
                                            $scope.FinalArray[0].runners[inde].ex.availableToLay[b].price = "";
                                        }
                                    }

                                    $scope.FinalArray[0].runners[inde].ex.availableToLay[b].size = market[m]["LaySize" + count];
                                }
                                /* try{
                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[0].selected =  $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToBack[0].price,$scope.FinalArray[0].runners[inde].ex.availableToBack[0].size, market[m].BackPrice1,market[m].BackSize1);
                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[0].price = market[m].BackPrice1;
                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[1].selected =  $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToBack[1].price,$scope.FinalArray[0].runners[inde].ex.availableToBack[1].size, market[m].BackPrice2,market[m].BackSize2);
                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[1].price = market[m].BackPrice2;
                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[2].selected =  $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToBack[2].price,$scope.FinalArray[0].runners[inde].ex.availableToBack[2].size, market[m].BackPrice3,market[m].BackSize3);
                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[2].price = market[m].BackPrice3;
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[0].selected =  $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToLay[0].price,$scope.FinalArray[0].runners[inde].ex.availableToLay[0].size, market[m].LayPrice1,market[m].LaySize1);
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[0].price = market[m].LayPrice1;
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[1].selected =  $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToLay[1].price,$scope.FinalArray[0].runners[inde].ex.availableToLay[1].size, market[m].LayPrice2,market[m].LaySize2);
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[1].price = market[m].LayPrice2;
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[2].selected =  $scope.CallColor($scope.FinalArray[0].runners[inde].ex.availableToLay[2].price,$scope.FinalArray[0].runners[inde].ex.availableToLay[2].size, market[m].LayPrice3,market[m].LaySize3);
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[2].price = market[m].LayPrice3;

                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[0].size = market[m].BackSize1;
                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[1].size = market[m].BackSize2;
                                 $scope.FinalArray[0].runners[inde].ex.availableToBack[2].size = market[m].BackSize3;
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[0].size = market[m].LaySize1;
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[1].size = market[m].LaySize2;
                                 $scope.FinalArray[0].runners[inde].ex.availableToLay[2].size = market[m].LaySize3;
                             }
                             catch(e)
                             {
                                     if($scope.FinalArray[0].runners[inde].ex.availableToBack[0]!=angular.isUndefinedOrNull)
                                     {
                                         $scope.FinalArray[0].runners[inde].ex.availableToBack[0].price="";
                                     }
                                     if($scope.FinalArray[0].runners[inde].ex.availableToBack[1]!=angular.isUndefinedOrNull)
                                     {
                                         $scope.FinalArray[0].runners[inde].ex.availableToBack[1].price="";
                                     }
                                     if($scope.FinalArray[0].runners[inde].ex.availableToBack[2]!=angular.isUndefinedOrNull)
                                     {
                                         $scope.FinalArray[0].runners[inde].ex.availableToBack[2].price="";
                                     }

                                     if($scope.FinalArray[0].runners[inde].ex.availableToLay[0]!=angular.isUndefinedOrNull)
                                     {
                                         $scope.FinalArray[0].runners[inde].ex.availableToLay[0].price="";
                                     }
                                     if($scope.FinalArray[0].runners[inde].ex.availableToLay[1]!=angular.isUndefinedOrNull)
                                     {
                                         $scope.FinalArray[0].runners[inde].ex.availableToLay[1].price="";
                                     }
                                     if($scope.FinalArray[0].runners[inde].ex.availableToLay[2]!=angular.isUndefinedOrNull)
                                     {
                                         $scope.FinalArray[0].runners[inde].ex.availableToLay[2].price="";
                                     }
                             }*/

                            }
                        }
                    }
                    /*for(var i=0;i<$scope.FancyLiveData.length;i++)
                            {
                                if($scope.FancyLiveData!=null)
                                {
                                    var inde = $scope.FancyData.findIndex(img => img.ind_fancy_selection_id === 											$scope.FancyLiveData[i].SelectionId);
                                    if(inde > -1)
                                    {
                                    var obj = $scope.FancyLiveData[i];
                                    $scope.FancyData[inde].SessInptNo=obj.LayPrice1;
                                    $scope.FancyData[inde].SessInptYes=obj.BackPrice1;
                                    $scope.FancyData[inde].DisplayMsg=obj.GameStatus;
                                      $scope.FancyData[inde].active=obj.GameStatus ==" " ? 1 : 4;

                                    }


                                }
                            }*/
                    for (var i = 0; i < $scope.FancyData.length; i++) {

                        if ($scope.FancyData[i].is_indian_fancy == 1 && $scope.FancyData[i].fancy_mode == "A") {
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

                    $scope.getLiveFancyList();
                },
                error: function (err) {
                    $scope.loading = false;
                }

            })
            $scope.getNameFunc();
        }, 1000);
    }
    $scope.GetSeesionBetData = function (fancy_id) {

        var abc = $scope.Fdata.FancyVal1;
        if ($scope.Fdata.FancyVal1 != old_fancy_id) {
            old_fancy_id = $scope.Fdata.FancyVal1;
            $timeout.cancel(scoreOddPosition);
            $scope.UserSessionData = [];
            callscoreOddpostype = 0;
        }
        scoreOddPosition = $timeout(function () {
            $http.get('Betentrycntr/GatBetFancyData/' + 0 + '/' + sessionService.get('type') + '/' + sessionService.get('user_id') + '/' + $stateParams.MatchId + '/' +  $scope.Fdata.FancyVal1).success(function (data, status, headers, config) {


                if (callscoreOddpostype == 0) {
                    $scope.UserSessionData = [];
                    $scope.UserSessionData = data.betUserData;
                    callscoreOddpostype = 1;
                }
                else {
                    var result = data.betUserData;

                }
                if (data.betUserData != angular.isUndefinedOrNull) {
                    if ($scope.UserSessionData.length > 0) {
                        if (data.betUserData[0].selectionName != $scope.UserSessionData[0].selectionName) {
                            $scope.UserSessionData = result;
                        }
                    }
                }
                for (var i in result) {

                    var ind = $scope.UserSessionData.findIndex(x => x.SrNo == result[i].SrNo);
                    if (ind == -1) {
                        $scope.UserSessionData.push(result[i]);
                    }
                    else {
                        $scope.UserSessionData[i] = result[i];
                    }

                }
                $scope.GetSeesionBetData($scope.FancyVal1);
            });

        }, 2000);
    }

    $scope.CallColor = function (Oldprice, Oldsize, NPrice, NSize) {
        if (Oldprice != NPrice || Oldsize != NSize) {
            return true;
        }
        else {
            return false;
        }
    }
    $scope.getOddCalcVal = function (a, ovType) {
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
                z = parseFloat((parseFloat(x) * parseFloat(y)).toFixed(2));
                break;
        }
        if (z >= 0) return (z);
        else return "";
    }
    $scope.getNameFunc();
    //  $scope.callOddsFunc();
    $scope.GetMarketListId();
    $scope.$on("$destroy", function (event) {
        $timeout.cancel(marketTimer);
        marketTimer = angular.isUndefinedOrNull;
    });
}]);
app.directive('crntusrpsn', function () {
    return {
        templateUrl: 'app/scripts/directives/timeline/Matchodds_crntusr_psn.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: ['$scope', '$http', '$stateParams', 'sessionService', '$interval', '$timeout', function ($scope, $http, $stateParams, sessionService, $interval, $timeout) {
            $scope.getUserPosition = function (userId, userType) {
                $scope.crntusep_userId = userId;
                $scope.crntusep_userType = userType;
                if (userType != "3") {
                    $http.get(BASE_URL + 'Usercurrntposicntr/getUserPosition/' + userId + '/' + userType + '/' + $stateParams.MatchId + '/' + $stateParams.MarketId).success(function (data, status, headers, config) {

                        $scope.totalTeamA = 0;
                        $scope.totalTeamB = 0;
                        $scope.totaltheDraw = 0;
                        $scope.userPosition = data.userPosition;
                        $scope.userOwnPosition = data.userOwnPosition;
                        if ($scope.userPosition != angular.isUndefinedOrNull) //sourabh 170107
                            for (var i = 0; i < $scope.userPosition.result_array.length; i++) {
                                $scope.totalTeamA = parseFloat($scope.totalTeamA) + parseFloat($scope.userPosition.result_array[i].TeamA);
                                $scope.totalTeamB = parseFloat($scope.totalTeamB) + parseFloat($scope.userPosition.result_array[i].TeamB);
                                $scope.totaltheDraw = parseFloat($scope.totaltheDraw) + parseFloat($scope.userPosition.result_array[i].theDraw);
                            }
                        /*console.log($scope.totalTeamA);
                         //
                         alert($scope.totalTeamA);*/
                    });
                }
            }
            $scope.getCrntUserPosition_Back = function () {
                $scope.crntusep_userId = sessionService.get('user_id');
                $scope.crntusep_userType = sessionService.get('type');
                $scope.getCrntUserPosition();
            }
            $scope.getUserPosition(sessionService.get('user_id'), sessionService.get('type'));
            $scope.getCrntUserPosition = function () {
                $scope.getUserPosition($scope.crntusep_userId, $scope.crntusep_userType);
            } //sourabh 170127
            $scope.si_getCrntUserPosition = $timeout($scope.getCrntUserPosition, 5000);
            $scope.$on("$destroy", function (event) {
                $timeout.cancel($scope.si_getCrntUserPosition);
                //clearInterval($scope.si_getCrntUserPosition);
            }); //sourabh 170124
        }]
    }
});
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

