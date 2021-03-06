; IniWrite, "ROTMG", %A_ScriptDir%\quickLaunch.ini, rotmg, windowname
; IniWrite, "USER", %A_ScriptDir%\quickLaunch.ini, rotmg, username
; IniWrite, "PASS", %A_ScriptDir%\quickLaunch.ini, rotmg, password
; IniWrite, "TOKEN", %A_ScriptDir%\quickLaunch.ini, rotmg, clientToken

; RunWaitOne("$stringAsStream = [System.IO.MemoryStream]::new()")
; RunWaitOne("$writer = [System.IO.StreamWriter]::new($stringAsStream)")
; RunWaitOne("$writer.write(""$(Get-CimInstance -ClassName Win32_BaseBoard | foreach {$_.SerialNumber})$(Get-CimInstance -ClassName Win32_BIOS | foreach {$_.SerialNumber})$(Get-CimInstance -ClassName Win32_OperatingSystem | foreach {$_.SerialNumber})"")")
; RunWaitOne("$writer.Flush()")
; RunWaitOne("$stringAsStream.Position = 0")
; RunWaitOne("""$(Get-FileHash -InputStream $stringAsStream -Algorithm SHA1 | foreach {$_.Hash})"".ToLower()")

IniRead, windowname, %A_ScriptDir%\quickLaunch.ini, rotmg, windowname
IniRead, username, %A_ScriptDir%\quickLaunch.ini, rotmg, username
IniRead, password, %A_ScriptDir%\quickLaunch.ini, rotmg, password
IniRead, clientToken, %A_ScriptDir%\quickLaunch.ini, rotmg, clientToken
; msgbox, % clientToken
if (clientToken = "ERROR")
{
	RunWaitMany("powershell`n$stringAsStream = [System.IO.MemoryStream]::new()`n$writer = [System.IO.StreamWriter]::new($stringAsStream)`n$writer.write(""$(Get-CimInstance -ClassName Win32_BaseBoard | foreach {$_.SerialNumber})$(Get-CimInstance -ClassName Win32_BIOS | foreach {$_.SerialNumber})$(Get-CimInstance -ClassName Win32_OperatingSystem | foreach {$_.SerialNumber})"")`n$writer.Flush()`n$stringAsStream.Position = 0`n""$(Get-FileHash -InputStream $stringAsStream -Algorithm SHA1 | foreach {$_.Hash})"".ToLower()")

	IniRead, clientToken, %A_ScriptDir%\quickLaunch.ini, rotmg, clientToken
}

pid := launch(login(username, password, clientToken))
WinWait, ahk_pid %pid%
WinSetTitle, %windowname%
ExitApp

#Include rotmg_login_library.ahk

RunWaitMany(commands) {
    shell := ComObjCreate("WScript.Shell")
    ; Open cmd.exe with echoing of commands disabled
    exec := shell.Exec(ComSpec " /Q /K echo off")
    ; Send the commands to execute, separated by newline
    exec.StdIn.WriteLine(commands "`nexit")  ; Always exit at the end!
    ; Read and return the output of all commands
	token := exec.StdOut.ReadAll()
	Array := StrSplit(token , "`n")
	RealToken := Array[12]
    ; msgbox, % token "`n`n" Array[12]
	IniWrite, %RealToken%, %A_ScriptDir%\quickLaunch.ini, rotmg, clientToken
	; Loop, Parse, token, % "`n"
    ; MsgBox % "Color number " A_Index " is " A_LoopField
	; return exec.StdOut.ReadAll()
}
return

RunWaitOne(command) {
    ; WshShell object: http://msdn.microsoft.com/en-us/library/aew9yb99
    shell := ComObjCreate("WScript.Shell")
    ; Execute a single command via cmd.exe
    exec := shell.Exec(ComSpec " /C " command)
    ; Read and return the command's output
	msgbox, % exec.StdOut.ReadAll()
    return exec.StdOut.ReadAll()
}
return
