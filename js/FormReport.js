/* 日期：106年6冃4日
 * 說明：讓網頁加入更多的內容
 */
$(document).ready(function(){
  
$(".has_children").click(function(){
  $(this).addClass("highlight")
  .children("dt").show().end()
  
  .siblings().removeClass("highlight")
  .children("dt").hide(); 
  
});

});
