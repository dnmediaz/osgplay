app.controller("Evenoddfancycntr",["$scope","$http","$stateParams","$rootScope","sessionService","deviceDetector","Dialog","get_userser","$interval","speech","$state","$filter",function(e,a,t,d,s,n,r,l,c,i,o,u){function h(e){return 1==e.data.OddValue?"ODD":"EVEN"}function y(){if(b){var e={getRows:function(e){setTimeout(function(){var a=b.slice(e.startRow,e.endRow),t=-1;b.length<=e.endRow&&(t=b.length),e.successCallback(a,t)},500)}};D.api.setDatasource(e)}}function f(e){b=e,y()}if(e.btnPlaceDis=!1,e.matchId=t.matchId,e.FancyID=t.FancyID,e.TypeID=t.TypeID,e.MatchName=t.matchName,e.sportId=t.sportId,e.betValue=0,e.OddValue="odd",e.EvenValue="even",e.showOdd1=!1,e.showEven1=!1,e.ngValue=!1,e.userType=sessionService.get('type'),e.UserTypeId=s.get("slctUseTypeID"),e.display_Oddfancy=function(){e.showOdd1=!0,e.showEven1=!1,e.betValue=0,e.userType=sessionService.get('type'),e.UserTypeId=s.get("slctUseTypeID")},l.userChipSetting(function(e){d.userPlcBtn=e,d.MyLenth=e.length}),e.GetBetValue=function(a,t){e.betValue=parseInt(a)+parseInt(t)},e.display_Evenfancy=function(){e.showEven1=!0,e.showOdd1=!1,e.betValue=0,e.userType=sessionService.get('type'),e.UserTypeId=s.get("slctUseTypeID")},e.checkValidation=function(a){return""==a.betValue||a.betValue<=0?(r.autohide("You cannot play at zero Bet On Odds...","1000"),e.btnPlaceDis=!1,$("#betValue").focus(),!1):!0},e.saveUserOddFancyBet=function(c){e.btnPlaceDis=!0;var o=a.post(BASE_URL+"Lstsavemstrcontroller/getUserInfo/"+s.get("slctUseID"));o.then(function(o){var u=(o.data.userInfo,parseInt(o.data.userInfo[0].mstrlock)),h=parseInt(o.data.userInfo[0].lgnusrlckbtng),y=parseInt(o.data.userInfo[0].lgnusrCloseAc),m=parseInt(o.data.userInfo[0].stakeLimit),b=parseInt(o.data.userInfo[0].active),D=parseInt(o.data.userInfo[0].usetype),p=parseInt(document.getElementById("betValue").value);if(1==u&&1==h&&1==y&&1==b&&3==D&&(0==m||m>=p)&&parseInt(d.Balance)>=p){if("unknown"==n.device)var I="Desktop";else var I=n.device;var g=" browser: "+n.browser+" browser_version :"+n.browser_version+"  device: "+I+"  OS : "+n.os+" os_version: "+n.os_version,w=(s.get("slctUseTypeID"),s.get("slctUseID")),v=sessionService.get('user_id'),O=s.get("slctParantID"),V={userId:w,ParantId:O,loginId:v,betValue:p,FancyID:t.FancyID,matchId:t.matchId,OddValue:c,type:sessionService.get('type'),OddsNumber:c,TypeID:t.TypeID,HeadName:e.FancyData[0].HeadName,sportId:t.sportId,deviceInformation:g};e.checkValidation(V)?a({method:"POST",url:BASE_URL+"Lstsavemstrcontroller/saveUserFancy",data:V,headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(a){0==a.error?(l.GetWALLibiInfo(s.get("slctUseID")),e.scorePosition=a.scorePosition,e.UserBetData=a.UserBetData,f(a.UserBetData),e.showOdd1=!1,e.showEven1=!1,i.sayText("b"),e.btnPlaceDis=!1,r.autohide(a.message,"1000")):(r.autohide(a.message,"1000"),e.btnPlaceDis=!1)}):e.btnPlaceDis=!1}else 0==u?(r.autohide("user Lock","3000"),e.btnPlaceDis=!1):0==h?(r.autohide("user batting is Lock ","3000"),e.btnPlaceDis=!1):0==y?(r.autohide("user account closed","3000"),e.btnPlaceDis=!1):0==b?(r.autohide("user Inactive","3000"),e.btnPlaceDis=!1):3!=D?(r.autohide("Please select Valid user","3000"),e.btnPlaceDis=!1):0!=m&&p>=m?(r.autohide("Invalid Stake Limit","3000"),e.btnPlaceDis=!1):parseInt(d.Balance)<p&&(r.autohide("insufficient Balance","3000"),e.btnPlaceDis=!1)})},0==sessionService.get('type'))var m=[{headerName:"id",width:30,field:"bet_id",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"UserName",width:100,field:"userName",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Dealer",width:100,field:"ParantName",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Master",width:100,field:"MasterName",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"amount",width:80,field:"bet_value",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Score",width:80,field:"OddsNumber",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"ODD/EVEN",width:100,valueGetter:h,cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Time",width:130,field:"dateTime",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}}];else if(1==sessionService.get('type'))var m=[{headerName:"id",width:30,field:"bet_id",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"UserName",width:100,field:"userName",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Dealer",width:100,field:"ParantName",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"amount",width:80,field:"bet_value",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Score",width:80,field:"OddsNumber",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"ODD/EVEN",width:100,valueGetter:h,cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Time",width:130,field:"dateTime",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}}];else if(2==sessionService.get('type'))var m=[{headerName:"id",width:30,field:"bet_id",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"UserName",width:100,field:"userName",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"amount",width:80,field:"bet_value",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Score",width:80,field:"OddsNumber",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"ODD/EVEN",width:100,valueGetter:h,cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Time",width:130,field:"dateTime",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}}];else if(3==sessionService.get('type'))var m=[{headerName:"id",width:30,field:"bet_id",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"amount",width:80,field:"bet_value",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Score",width:80,field:"OddsNumber",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"ODD/EVEN",width:100,valueGetter:h,cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}},{headerName:"Time",width:130,field:"dateTime",cellClass:function(e){return 1==e.data.OddValue?"lay-head":"back-head"}}];var b,D={enableSorting:!0,enableFilter:!0,debug:!0,rowSelection:"multiple",enableColResize:!0,paginationPageSize:500,columnDefs:m,rowModelType:"pagination"},p=document.querySelector("#myGrid");new agGrid.Grid(p,D),e.GetBetLst=function(){l.GetFancyData(t.matchId,t.FancyID,s.get("user_id"),s.get("type"),t.TypeID,function(a){e.FancyData=a.data.fancyForm,e.scorePosition=a.data.scorePosition,e.showOdd1=!1,e.showEven1=!1,e.ngValue=!1,e.UserBetData=a.data.UserBetData,f(a.data.UserBetData)})},l.GetFancyData(t.matchId,t.FancyID,s.get("user_id"),s.get("type"),t.TypeID,function(a){e.FancyData=a.data.fancyForm,e.scorePosition=a.data.scorePosition,e.showOdd1=!1,e.showEven1=!1,e.ngValue=!1,e.UserBetData=a.data.UserBetData,f(a.data.UserBetData)}),e.RefreshData=function(){l.GetFancyData(t.matchId,t.FancyID,s.get("user_id"),s.get("type"),t.TypeID,function(a){e.scorePosition=a.data.scorePosition})},e.GetBetLst=function(){l.GetFancyData(t.matchId,t.FancyID,s.get("user_id"),s.get("type"),t.TypeID,function(a){"3"!=s.get("type")&&e.UserBetData.length!=a.data.UserBetData.length&&(e.scorePosition=a.data.scorePosition,e.UserBetData=a.data.UserBetData,i.sayText("b"),f(a.data.UserBetData)),2==a.data.fancyForm[0].active?(e.closeFancy=1,e.Msg="Fancy Closed"):0==a.data.fancyForm[0].active?(e.closeFancy=1,e.Msg="Fancy Inactive"):1==a.data.fancyForm[0].active&&(e.closeFancy=0,e.Msg=""),e.FancyData=a.data.fancyForm}),"0"!=s.get("type")&&a({method:"POST",url:BASE_URL+"Geteventcntr/matchMarketLst/",data:{matchId:t.matchId,sportsId:4,user_id:s.get("user_id")},headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(e){try{"1"==u("filter")(e.getMatchFancy,{ID:t.FancyID})[0].IsPlay&&(d.$broadcast("changeSidebar_Market",{}),"1"==s.get("type")?o.go("dashboard.Masterdashboard"):"2"==s.get("type")?o.go("dashboard.Dealerdashboard"):"3"==s.get("type")&&o.go("dashboard.Userdashboard"))}catch(a){}})};var I=c(e.GetBetLst,1e3);e.$on("$destroy",function(e){c.cancel(I),I=angular.isUndefinedOrNull})}]);