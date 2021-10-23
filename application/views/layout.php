<?php
@session_start();
error_reporting(0);
//var_dump($this->session->userdata('type'));
$type = $this->session->userdata('type');
 $coustom_base_url =$_SERVER['REQUEST_SCHEME']."://".$_SERVER['HTTP_HOST']."/";

if(isset($_GET['login/'])){
    if($type=='0'){
        return redirect($coustom_base_url."#/dashboard/Home");
    }elseif ($type=='1'){
        return redirect($coustom_base_url."#/masterDashboard/Home");
    }elseif ($type=='2'){
        return redirect($coustom_base_url."#/dealerDashboard/Home");
    }elseif ($type=='3'){
        return redirect($coustom_base_url."#/userDashboard/Home");
    }
}
  defined('BASEPATH') or exit('No direct script access allowed');
  
?>
<!DOCTYPE html>

<!--<script>

        document.getElementById('mainWrapper').style.backgroundImage="http://139.162.219.17/app/assets/newscreen/images/Soccer.png";

</script>-->

<html class="no-js" ng-app="ApsilonApp" manifest="app/assets/html5appcache.appcache">
  <head>
      <meta http-equiv="cache-control" content="max-age=0" />
      <meta http-equiv="cache-control" content="no-cache" />
      <meta http-equiv="expires" content="0" />
      <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
      <meta http-equiv="pragma" content="no-cache" />
      <?php if ($_SERVER['REQUEST_SCHEME']=='https') { ?>
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
      <?php } ?>
     <!-- <meta http-equiv="cache-control" content="max-age=0" />
      <meta http-equiv="cache-control" content="no-cache" />
      <meta http-equiv="expires" content="0" />
      <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />-->
     <!-- <meta http-equiv="pragma" content="no-cache" />-->
      <script> var BASE_URL = "<?php echo site_url(); ?>";</script>
<title>	<?php echo $this->config->item('title'); ?></title>
      <meta charset="utf-8"/> 
      <meta name="description" content=""/> 
      <meta name="viewport" content="meta name=”viewport” content=”width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

     <!--  <link rel="stylesheet" href="app/styles/libs/loading-bar.min.css"/>
      <link rel="stylesheet" href="app/dist/ng-slim-scroll.css"/> -->
      
        <!--  
        Comm_minify        
        
          <link rel="stylesheet" href="app/dist/angular-tree-widget.css"/>
          <link rel="stylesheet" href="app/assets/css/AdminLTE.min.css?ver=1.1"/>
      <link rel="stylesheet" href="app/assets/css/angular-material.css" />
      -->
      
    <!-- <link rel="stylesheet" href="app/assets/css/comm_minify.css?ver=1.1"/>-->
      <link defer="defer" rel="stylesheet" type="text/css" href="app/assets/css/AllMix.css" />
	<link rel="stylesheet" ng-if="userType==3" type="text/css" href="app/assets/newscreen/vendor/bootstrap/css/bootstrap.min.css">

	 <link defer="defer" rel="stylesheet" type="text/css"  href="app/assets/newscreen/fonts/font-awesome-4.7.0/css/font-awesome.min.css">

	<link defer="defer" rel="stylesheet" type="text/css" href="app/assets/newscreen/fonts/iconic/css/material-design-iconic-font.min.css">

<!--	<link rel="stylesheet" type="text/css"  href="app/assets/newscreen/vendor/animate/animate.css"> -->



    <link defer="defer" rel="stylesheet" type="text/css" href="app/assets/newscreen/css/main.css">
    

   <!--  ng-class="usertype == 1 ? 'master-header-page' : (usertype == 2 ? 'dealer-header-page' :(usertype == 3 ? 'user-header-page' :'' ) )-->
     
     
      <!--   <link rel="stylesheet" type="text/css" ng-if="userType==0 || userType==1 || userType==2" href="app/assets/css/bootstrap.min.css" />-->
      <link rel="stylesheet" type="text/css" ng-if="userType==0 || userType==1 || userType==2" href="app/assets/css/my-style.css" />
    <!-- <link rel="stylesheet" type="text/css" ng-if="userType==0 || userType==1 || userType==2" href="app/assets/newscreen/css/admin.css" />-->
      <link rel="stylesheet" type="text/css" ng-if="userType==0 || userType==1 || userType==2" href="app/assets/newscreen/css/AMD.css" />

       
<!--     <link rel="stylesheet" type="text/css" ng-if="userType==0 || userType==1 || userType==2" href="app/assets/css/responsive.css" />-->
     
     
<!--    <link rel="stylesheet" type="text/css" ng-if="userType==0 || userType==1 || userType==2" href="app/assets/newscreen/css/custom.css" />-->

    
    
    
     <link rel="stylesheet" type="text/css" ng-if="userType==3" href="app/assets/newscreen/css/userstyle.css" />

<link href="app/assets/css/responsive.css" rel="stylesheet" type="text/css"/>
  
<!-- <?php /*if ($type==''){ */?>
<link rel="stylesheet" type="text/css"  href="app/assets/newscreen/css/login.css">	  
	  
	  --><?php /*} */?>


  </head>
  

  
  
  
  
  

  <body class="skin-blue sidebar-mini" id="mainWrapper">

   <div class="wrapper">
      <div ui-view></div>
     
    </div>
	
 <div class="footer_area" ng-if="$root.userType!=undefined && $root.userType!=0"  ng-controller="commonCtrl">
      <div class="footer_nav">
      <ul>
      <li><a data-toggle="modal"  ng-click="ShowTerAndCondition()">Term and Condition</a> © {{getYear()}} </li>
      <li class="flogo"> | <img src="app/images/f-logo.png" alt="Logo"> </li>
      </ul>
      </div>
      
      </div>
	<div id="rulespopup" ng-if="$root.userType!=undefined && $root.userType!=0" class="modal rulespopuptext fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Term & Condition</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body">

      <div id="TermConditionId"></div>
      
      </div>
      
    </div>

  </div>
</div>
  <!-- javascript Links -->
    <!-- <script src="https://use.fontawesome.com/3bf12dcdf0.js"></script> -->
    <script type="text/javascript" src="app/dist/jquery-latest.min.js" ></script>
     <script src="app/js/libs/rtsplayer.js" ></script>
     <!--<script type="text/javascript" src="app/assets/js/Roboto.js" ></script>-->

   <!-- <script type="text/javascript" src="app/dist/agGrid.js" ></script>

      <script type="text/javascript" src="app/lib/angular.min.js" ></script>-->

   <script  type="text/javascript" src="app/dist/agGrid.js" ></script>
   <script type="text/javascript" src="https://code.angularjs.org/1.4.9/angular.min.js"></script>

     <!-- <script type="text/javascript" src="app/js/libs/angular-ui-router.min.js" ></script>
      <script type="text/javascript" src="app/lib/angular-aria.min.js" ></script>
      <script type="text/javascript" src="app/lib/angular-material.js" ></script>
       <script type="text/javascript" src="app/lib/angular-animate.min.js" ></script>-->
   <script  type="text/javascript" src="app/js/libs/ocLazyLoad.min.js" ></script>

   <script  type="text/javascript" src="app/dist/AllMixV2.js" ></script>
   <script  type="text/javascript" src="app/dist/AllMix.js" ></script>
      <script type="text/javascript" src="app/scripts/app_9.js?var=<?php echo $s=(RAND() * (10 - 1) + 1)?>" ></script>


      <!--	<script src="app/assets/newscreen/vendor/bootstrap/js/popper.js" ></script>-->

     <!--  <script type="text/javascript" src="app/js/libs/loading-bar.min.js" ></script> -->
      <script  type="text/javascript" src="app/assets/js/ui-bootstrap-tpls-0.10.0.min.js" ></script>
  <!--<script  src="app/js/manualdatetime.js" ></script>-->
      <script  type="text/javascript" src="app/scripts/controllers/Form.js" ></script>
      <script  type="text/javascript" src="app/scripts/services/sessionService.js" ></script>
      <script  type="text/javascript" src="app/scripts/services/loginService.js" ></script>
     <!-- <script type="text/javascript" src="app/assets/js/app.min.js" ></script>-->

     <!-- <script type="text/javascript" src="app/js/res.js" ></script>-->


<!--===============================================================================================-->
   <!--<script src="app/assets/newscreen/vendor/animsition/js/animsition.min.js" ></script>-->
<!--===============================================================================================-->

	<!--<script src="app/assets/newscreen/vendor/bootstrap/js/bootstrap.min.js" ></script>-->
   <script   src="app/assets/newscreen/vendor/bootstrap/js/bootstrap.min.js"></script>

  <!--<script src="app/assets/newscreen/js/main.js" ></script>-->




 	  <script>

	    $(function () {
    var top = 190;
    $(window).scroll(function (event) {
        // what the y position of the scroll is
        var y = $(this).scrollTop();

        // whether that's below the form
        if (y >= top) {
            // if so, ad the fixed class
            $('.mobilebox').addClass('fixed');
        } else {
            // otherwise remove it
            $('.mobilebox').removeClass('fixed');
        }
    });
});

	  	$(document).on("keyup", "#search12", function()
                           {

                             var val = $("#search12").val().toLowerCase()
                             if (val) {
                               $('ul li span').each(function(idx, obj){

                                 if ($(obj).text().toLowerCase().indexOf(val) !== -1)
                                 {
                                 if($(obj).hasClass("myMenu1"))
                                    $(obj).addClass('highlight')

                                // $(obj).parent.eq(idx).addClass('highlight')


                                 }

                                 else
                                 {
                                  $(obj).removeClass('highlight')
                                  //$(obj).parent().closest('li').removeClass('highlight')

                                 }



                               })

                             }
                             else
                               $('ul li span').removeClass('highlight')
                           })
		$(document).on("click", "#content1 ul li a", function()
		{

			if($("html").hasClass("mobile") || $("html").hasClass("tablet"))
			{
				if($(this).attr('href') != '')
				{
					$(window).scrollTop(0);



				}
				else
				{


				}

			}
		});



		$(document).on("keypress", ".numclass", function(evt)
        		{
                           if (evt.which != 8 && evt.which != 46 && evt.which != 0 && evt.which < 48 || evt.which > 57)
                             {
                                 evt.preventDefault();
                             }
                             else if(evt.which == 46 && $(this).val().indexOf('.') != -1)
                             {
                                evt.preventDefault();
                             }
        		});
		$(document).on("click", ".ul li a", function()
		{

			if($("html").hasClass("mobile") || $("html").hasClass("tablet"))
			{

				if($(this).attr('href') != '' || $(this).attr('href')=="javascript:;")
				{
					$(window).scrollTop(0);


				}
				else
				{



				}

			}

			});


		 function myfunNew()
			{

		$("body").toggleClass("activebetslip");
			}



		function myfun()
			{

		$("body").toggleClass("addrightcls");
			}
function mobilefun(){
if($("html").hasClass("mobile") || $("html").hasClass("tablet"))
			{
$("body").toggleClass("addrightcls");
}
}
function addClass(self)
{
    $('.md-ink-ripple.active').removeClass('active');
    $(self).addClass('active');


}


  		</script>

<script>
$(window).scroll(function() {

  var uheight = $( ".usercontent").innerHeight();
$('#menu2').css("min-height", uheight);

		var sidebarh = $( ".content").innerHeight();
$('.main-sidebar').css("min-height", sidebarh);

});
 $(window).resize(function() {
	 	var sidebarh = $( ".content").innerHeight();
$('.main-sidebar').css("min-height", sidebarh);

	  var uheight = $( ".usercontent").innerHeight();
$('#menu2').css("min-height", uheight);


  if ($(window).width() < 767) {
   //  alert('Less than 767');
   $("body").addClass("mobile");

  }
 else {
   // alert('More than 767');
	$("body").removeClass("addrightcls");
	$("body").removeClass("mobile");
 }
});

 $(document).ready(function(){



		$(document).on("click", "#formButton",function(){
        $("#form1").toggle();
		$(".clickbet").toggle();
    });
});


	 $(document).on("click", "#menu2 li.submenu>a",function(){
	//$(this).parent('li').addClass('active');
	//$('#menu2 li.active .lav1').animate({	height:"auto", right:"0px"}, 500);
    });



	$(document).on("click", "#menu2 .lav1 li.submenu>a",function(){
	//$('#menu2 .lav1').addClass('subactive');
	//$('#menu2 li.lv1').animate({right:"-500px"}, 500);
   // $('#menu2 .lav1 li.active .lav2 ').animate({height:"auto", right:"0px"}, 500);
	 });



	 $(document).on("click", "#menu2 .lav2>li.prv",function(){
	//$('#menu2 .lav1').removeClass('subactive');
	//$('.lav1 .submenu ').removeClass('active');
	//$('#menu2 ul.lav1').animate({right:"-500"}, 0);
	//$('#menu2 ul.lav2').animate({right:"-500px"}, 500);
   // $('#menu2 li.lv1 ').animate({height:"auto", right:"0px"}, 500);
	//$('#menu2 ul.lav1').animate({right:"0"}, 500);
	 });



	 $(document).on("click", "#menu2 .lav1>li.prv",function(){

	//$('.submenu ').removeClass('active');
	//$('#menu2 li.lv1 ').animate({ right:"-500px"}, 500);
	//$('#menu2 ul.lav1').animate({ right:"-500px"}, 10);
	 });</script>
  </body>
  
         
         
</html>
