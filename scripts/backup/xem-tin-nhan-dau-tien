#EndRegion
#include<_HttpRequest.au3>
#include<String.au3>
#include<Inet.au3>
#include <MsgBoxConstants.au3>
#include <ButtonConstants.au3>
#include <EditConstants.au3>
#include <GUIConstantsEx.au3>
#include <StaticConstants.au3>
#include <WindowsConstants.au3>
#Region ### START Koda GUI section ### Form=
$Form1 = GUICreate("Tool Check Tin Nhắn FaceBook", 301, 156, 192, 124)
$Button1 = GUICtrlCreateButton("Check Nào !!", 72, 112, 139, 41)
GUICtrlSetFont(-1, 12, 800, 0, "MS Sans Serif")
$Label1 = GUICtrlCreateLabel("Tài Khoản : ", 0, 8, 86, 20)
GUICtrlSetFont(-1, 10, 800, 0, "MS Sans Serif")
$Input1 = GUICtrlCreateInput("", 112, 8, 185, 24)
GUICtrlSetFont(-1, 10, 800, 0, "MS Sans Serif")
$Label2 = GUICtrlCreateLabel("Mật Khẩu : ", 0, 40, 79, 20)
GUICtrlSetFont(-1, 10, 800, 0, "MS Sans Serif")
$Input2 = GUICtrlCreateInput("", 112, 40, 185, 24)
GUICtrlSetFont(-1, 10, 800, 0, "MS Sans Serif")
$Label3 = GUICtrlCreateLabel("Id Cần Check : ", 0, 72, 107, 20)
GUICtrlSetFont(-1, 10, 800, 0, "MS Sans Serif")
$Input3 = GUICtrlCreateInput("", 112, 72, 185, 24)
GUICtrlSetFont(-1, 10, 800, 0, "MS Sans Serif")
GUISetState(@SW_SHOW)
#EndRegion ### END Koda GUI section ###
 
While 1
	$nMsg = GUIGetMsg()
	Switch $nMsg
		Case $GUI_EVENT_CLOSE
			Exit
		 Case $Button1
			_main()
	EndSwitch
WEnd


Func _main()
   if GUICtrlRead($Input1) = '' Then
	  MsgBox(0,0,'Chưa Nhập Tài Khoản')
	  Return
   elseif    GUICtrlRead($Input2) = '' Then
	  MsgBox(0,0,'Chưa Nhập Mật Khẩu')
	  Return
	 elseif    GUICtrlRead($Input3) = '' Then
	  MsgBox(0,0,'Chưa Nhập ID')
	  Return
   Endif
   MsgBox(0,0,'Quá Trình Check Đang Diễn Ra , Vui Lòng Bấm "OK" Và Đợi')
$tk =  GUICtrlRead($Input1)
$mk =  GUICtrlRead($Input2)
$id =  GUICtrlRead($Input3)
_main1($tk,$mk,$id)
Endfunc


Func _main1($tk,$mk,$id)
$idd = $id
$a = fblogin($tk,$mk)
$cc = _HttpRequest(2, 'https://m.facebook.com/profile.php', "", $a, '', 'Connection: keep-alive')
$fb = StringRegExp($cc,'name="fb_dtsg" value="(.*?)"',3)
$idpr = StringRegExp($cc,'name="target" value="(.*?)"',3)
$i = 1
if @error Then
   MsgBox(0,0,'ERROR')
   Exit
Endif
$post = '__user='&$idpr[0]&'&__a=1&__dyn=7AgNeS-aF398jgDxyIGzGomzEdpbGAdy8VdLFwgoqwWhE98nwgUaqG2yaBxebkwy6UnGi7VXDG4XzErDAxaFQ3ucDBxe6ohyUCqu58nUszaxbxm1tyrhVo9ohxGbwYUmC-UjDQ6ErKu7EgwLxqawDDgswVwjpUhCK6pESfyaBy8OcxO12zVolyoK7UyUhUKcyU4eQEx1DzXG&__af=jw&__req=u&__be=-1&__pc=EXP3%3Aholdout_pkg&__rev=3211951&fb_dtsg='&$fb[0]&'&jazoest=265817089856881797477105114586581701188790886782485370&queries=%7B%22o0%22%3A%7B%22doc_id%22%3A%221927845863895817%22%2C%22query_params%22%3A%7B%22id%22%3A%22'&$idd&'%22%2C%22message_limit%22%3A'&$i&'%2C%22load_messages%22%3A1%2C%22load_read_receipts%22%3Atrue%2C%22before%22%3A'&_TimeStampUNIX_ms()&'%7D%7D%7D'
$cc = _HttpRequest(2, 'https://www.facebook.com/api/graphqlbatch/', $post, $a, '', 'Connection: keep-alive')

if StringInStr($cc,'"successful_results": 0') then
   MsgBox(0,0,'Error')
   Exit
Endif

if Not StringInStr($cc,'messages_count') Then
   MsgBox(0,0,'Error')
   Exit
Endif

$mess = _StringBetween($cc,'"messages_count":',',',3)

if $mess[0] < 20 Then
   MsgBox(0,0,'Chưa Nhắn Tới 20 Tin Nữa Check Làm Cm Gì 3')
Return
Endif

$post1 = '__user='&$idpr[0]&'&__a=1&__dyn=7AgNeS-aF398jgDxyIGzGomzEdpbGAdy8VdLFwgoqwWhE98nwgUaqG2yaBxebkwy6UnGi7VXDG4XzErDAxaFQ3ucDBxe6ohyUCqu58nUszaxbxm1tyrhVo9ohxGbwYUmC-UjDQ6ErKu7EgwLxqawDDgswVwjpUhCK6pESfyaBy8OcxO12zVolyoK7UyUhUKcyU4eQEx1DzXG&__af=jw&__req=u&__be=-1&__pc=EXP3%3Aholdout_pkg&__rev=3211951&fb_dtsg='&$fb[0]&'&jazoest=265817089856881797477105114586581701188790886782485370&queries=%7B%22o0%22%3A%7B%22doc_id%22%3A%221927845863895817%22%2C%22query_params%22%3A%7B%22id%22%3A%22'&$idd&'%22%2C%22message_limit%22%3A'&$mess[0]&'%2C%22load_messages%22%3A1%2C%22load_read_receipts%22%3Atrue%2C%22before%22%3A'&_TimeStampUNIX_ms()&'%7D%7D%7D'
$cc1 = _HttpRequest(2, 'https://www.facebook.com/api/graphqlbatch/', $post1, $a, '', 'Connection: keep-alive')
$c1 = _StringBetween($cc1,'{"id":"','ge",',3)
 
$path = @ScriptDir & '\'&$idd&'.html'

For $a = 1 to 20
$id = _StringBetween($c1[$a],'','",',3)
$tin1 = StringRegExp($c1[$a],'"snippet":"(.*?)"',3)
if IsArray($id) And IsArray($tin1) Then
   FileWriteLine($path,$id[0] &"|"&_HTMLDecode($tin1[0]) & "<br>")
ENdif
Next
MsgBox(0,0,'OK')
ShellExecute(@ScriptDir & '\'&$idd&'.html')
Exit
ENdfunc


Func _TimeStampUNIX_ms($iYear = @YEAR, $iMonth = @MON, $iDay = @MDAY, $iHour = @HOUR, $iMin = @MIN, $iSec = @SEC)
    Local $stSystemTime = DllStructCreate('ushort;ushort;ushort;ushort;ushort;ushort;ushort;ushort')
    DllCall('kernel32.dll', 'none', 'GetSystemTime', 'ptr', DllStructGetPtr($stSystemTime))
    $iMSec = StringFormat('%03d', DllStructGetData($stSystemTime, 8))
    Local $nYear = $iYear - ($iMonth < 3 ? 1 : 0)
    Return ((Int(Int($nYear / 100) / 4) - Int($nYear / 100) + $iDay + Int(365.25 * ($nYear + 4716)) + Int(30.6 * (($iMonth < 3 ? $iMonth + 12 : $iMonth) + 1)) - 2442110) * 86400 + ($iHour * 3600 + $iMin * 60 + $iSec)) * ($iMSec ? 1000 : 1) + $iMSec
 EndFunc


Func fblogin($tk,$mk)
$kq1 = _HttpRequest(2, 'https://m.facebook.com/login.php?refsrc=https%3A%2F%2Fm.facebook.com%2F&lwv=101&login_try_number=1&ref=dbl', "", '', '', 'Connection: keep-alive')
$lsd = StringRegExp($kq1,'name="lsd" value="(.*?)"',3)
$mts = StringRegExp($kq1,'name="m_ts" value="(.*?)"',3)
$li =  StringRegExp($kq1,'name="li" value="(.*?)"',3)
$post = 'lsd='&$lsd[0]&'&m_ts='&$mts[0]&'&li='&$li[0]&'&try_number=0&unrecognized_tries=0&email='&$tk&'&pass='&$mk&'&login=%C4%90%C4%83ng+nh%E1%BA%ADp'
$kq1 = _HttpRequest(1, 'https://m.facebook.com/login.php?refsrc=https%3A%2F%2Fm.facebook.com%2F&lwv=101&login_try_number=1&ref=dbl', $post, '', '', 'Connection: keep-alive')
$cookie = _GetCookie($kq1)
Return $cookie
 
Endfunc