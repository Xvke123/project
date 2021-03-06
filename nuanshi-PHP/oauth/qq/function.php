<?php
include_once('config.php');
include_once('session.php');
new session($aConfig);
/*
 * GET请求
 */
function get($sUrl,$aGetParam){
    global $aConfig;
    $oCurl = curl_init();
    if(stripos($sUrl,"https://")!==FALSE){
        curl_setopt($oCurl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($oCurl, CURLOPT_SSL_VERIFYHOST, FALSE);
    }
    $aGet = array();
    foreach($aGetParam as $key=>$val){
        $aGet[] = $key."=".urlencode($val);
    }
    curl_setopt($oCurl, CURLOPT_URL, $sUrl."?".join("&",$aGet));
    curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1 );
    $sContent = curl_exec($oCurl);
    $aStatus = curl_getinfo($oCurl);
    curl_close($oCurl);
    if(intval($aConfig["debug"])===1){
        echo "<tr><td class='narrow-label'>请求地址:</td><td><pre>".$sUrl."</pre></td></tr>";
        echo "<tr><td class='narrow-label'>GET参数:</td><td><pre>".var_export($aGetParam,true)."</pre></td></tr>";
        echo "<tr><td class='narrow-label'>请求信息:</td><td><pre>".var_export($aStatus,true)."</pre></td></tr>";
        if(intval($aStatus["http_code"])==200){
            echo "<tr><td class='narrow-label'>返回结果:</td><td><pre>".$sContent."</pre></td></tr>";
            if((@$aResult = json_decode($sContent,true))){
                echo "<tr><td class='narrow-label'>结果集合解析:</td><td><pre>".var_export($aResult,true)."</pre></td></tr>";
            }
        }
    }
    if(intval($aStatus["http_code"])==200){
        return $sContent;
    }else{
        echo "<tr><td class='narrow-label'>返回出错:</td><td><pre>".$aStatus["http_code"].",请检查参数或者确实是腾讯服务器出错咯。</pre></td></tr>";
        return FALSE;
    }
}

/*
 * POST 请求
 */
function post($sUrl,$aPOSTParam){
    global $aConfig;
    $oCurl = curl_init();
    if(stripos($sUrl,"https://")!==FALSE){
        curl_setopt($oCurl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($oCurl, CURLOPT_SSL_VERIFYHOST, false);
    }
    $aPOST = array();
    foreach($aPOSTParam as $key=>$val){
        $aPOST[] = $key."=".urlencode($val);
    }
    curl_setopt($oCurl, CURLOPT_URL, $sUrl);
    curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt($oCurl, CURLOPT_POST,true);
    curl_setopt($oCurl, CURLOPT_POSTFIELDS, join("&", $aPOST));
    $sContent = curl_exec($oCurl);
    $aStatus = curl_getinfo($oCurl);
    curl_close($oCurl);
    if(intval($aConfig["debug"])===1){
        echo "<tr><td class='narrow-label'>请求地址:</td><td><pre>".$sUrl."</pre></td></tr>";
        echo "<tr><td class='narrow-label'>POST参数:</td><td><pre>".var_export($aPOSTParam,true)."</pre></td></tr>";
        echo "<tr><td class='narrow-label'>请求信息:</td><td><pre>".var_export($aStatus,true)."</pre></td></tr>";
        if(intval($aStatus["http_code"])==200){
            echo "<tr><td class='narrow-label'>返回结果:</td><td><pre>".$sContent."</pre></td></tr>";
            if((@$aResult = json_decode($sContent,true))){
                echo "<tr><td class='narrow-label'>结果集合解析:</td><td><pre>".var_export($aResult,true)."</pre></td></tr>";
            }
        }
    }
    if(intval($aStatus["http_code"])==200){
        return $sContent;
    }else{
        echo "<tr><td class='narrow-label'>返回出错:</td><td><pre>".$aStatus["http_code"].",请检查参数或者确实是腾讯服务器出错咯。</pre></td></tr>";
        return FALSE;
    }
}
?>