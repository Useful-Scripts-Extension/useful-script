<!-- https://www.facebook.com/groups/j2team.community/permalink/885702488428539 -->

<?php
$token = $_GET['token'];
if($_GET['id'])
{
$stat=json_decode(auto('https://graph.beta.facebook.com/'.$_GET[id].'/feed?fields=id,likes&access_token='.$token.'&limit='.$_GET[limit].''),true);
$my=json_decode(auto('https://graph.facebook.com/me?access_token='.$token.'&fields=id'),true);
$myid=$my[id];
for($i=0;$i<=count($stat[data]);$i++)
{
if($stat[data][$i][likes][data][id] == $myid){ $i++; }
set_time_limit(0);
echo auto('https://graph.facebook.com/'.$stat[data][$i][id].'/reactions?type='.$_GET[camxuc].'&method=post&access_token='.$token.'&method=post');
echo '<br>';
}
}
function auto($url){
   $curl = curl_init();
   curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($curl, CURLOPT_URL, $url);
   $ch = curl_exec($curl);
   curl_close($curl);
   return $ch;
   }
?>
// code by danhthong+lulzquan 

// bạn có thể không ghi nguồn khi dùng nhưng làm ơn đừng mang code của mình đi bán...đó là lý do mình rất ít share code -.- 
//domain.php/baocamxuc.php?token={{token}}&camxuc={{camxuc}}&id={{uid}}&limit={{soluong}}

