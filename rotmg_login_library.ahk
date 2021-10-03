POST(url, data) {
	WR := ComObjCreate("WinHttp.WinHttpRequest.5.1")
	; WR.SetProxy(2, "http://localhost:8866") ; fiddler
	WR.Open("POST", url, false)
	WR.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	WR.Send(data)
	return WR.ResponseText
}

b64Encode(string)
{
    VarSetCapacity(bin, StrPut(string, "UTF-8")) && len := StrPut(string, &bin, "UTF-8") - 1 
    if !(DllCall("crypt32\CryptBinaryToString", "ptr", &bin, "uint", len, "uint", 0x1, "ptr", 0, "uint*", size))
        throw Exception("CryptBinaryToString failed", -1)
    VarSetCapacity(buf, size << 1, 0)
    if !(DllCall("crypt32\CryptBinaryToString", "ptr", &bin, "uint", len, "uint", 0x1, "ptr", &buf, "uint*", size))
        throw Exception("CryptBinaryToString failed", -1)
    return StrGet(&buf)
}

urlEncode(string)
{
	string := RegExReplace(string, "\+", "%2B")
	string := RegExReplace(string, "=", "%3D")
	string := RegExReplace(string, "/", "%2F")
	string := RegExReplace(string, "@", "%40")
	return string
}



login(username, password, clientToken) {
    verify_url := "https://www.realmofthemadgod.com/account/verify"
    FoundPos := InStr(username, "steamworks:")
    if (FoundPos != 0)
    {
        NewStr := SubStr(username, 12)
        verify_data := "guid=steamworks:" urlEncode(NewStr) "&steamid=" urlEncode(NewStr) "&secret=" urlEncode(password) "&clientToken=" clientToken
    }
    else
    {
        verify_data := "guid=" urlEncode(username) "&password=" urlEncode(password) "&clientToken=" clientToken
    }
    verify_resp := POST(verify_url, verify_data)

    RegExMatch(verify_resp, "<AccessToken>(.+)</AccessToken>", accessToken)
    RegExMatch(verify_resp, "<AccessTokenTimestamp>(.+)</AccessTokenTimestamp>", tokenTimestamp)
    RegExMatch(verify_resp, "<AccessTokenExpiration>(.+)</AccessTokenExpiration>", tokenExpiration)

    vATC_url := "https://www.realmofthemadgod.com/account/verifyAccessTokenClient"
    vATC_data := "clientToken=" clientToken "&accessToken=" urlEncode(accessToken1)
    vATC_resp := POST(vATC_url, vATC_data)

    login_str := "data:{platform:Deca,guid:" b64Encode(username) ",token:" b64Encode(accessToken1) ",tokenTimestamp:" b64Encode(tokenTimestamp1) ",tokenExpiration:" b64Encode(tokenExpiration1) ",env:4}"
    return login_str
}


launch(login_str) {
	run "%A_MyDocuments%\RealmOfTheMadGod\Production\RotMG Exalt.exe" "%login_str%", %A_MyDocuments%\RealmOfTheMadGod\Production,, pid
	return pid
}
