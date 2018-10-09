#!/usr/bin/env bash

# Bash code harvested and bastardized from the npm ttab package https://www.npmjs.com/package/ttab 
# Copyright (c) 2015-2017 Michael Klement mklement0@gmail.com
# If there are bugs, they are most likely a result of my changes to Michael's code, and not Michael's code itself.

terminalApp="$TERM_PROGRAM"
TAB_SELECT=''

# Determine the terminal application that was explicitly specified or happens to be running this script.
# Currently, the only programs supported are the standard Terminal.app and iTerm.app (iTerm2).
iTerm=0
shopt -s nocasematch  # we want to match the application name case-INSensitively.
case $terminalApp in
  ''|'Apple_Terminal'|'Terminal'|'Terminal.app')
    # Note: 'Apple_Terminal' is what $TERM_PROGRAM contains when running from Terminal.app
    # Use standard Terminal.app application.
    ;;
  'iTerm'|'iTerm.app'|'iTerm2'|'iTerm2.app')
    # Note: 'iTerm.app' is what $TERM_PROGRAM contains when running from iTerm.app
    iTerm=1
    ;;
  *)
    # If an unknown terminal is specified, we issue a warning and fall back to Terminal.app
    echo "WARNING: '$terminalApp' is not a supported terminal application; defaulting to Terminal.app." >&2    
    ;;
esac
shopt -u nocasematch

# Set target-terminal-app-appropriate variables used later. 
if (( iTerm )); then
  terminalApp='iTerm' # will be used with `activate application`
  # Note: iTerm2's AppleScript syntax changed fundamentally in v3 (for the better, but incompatibly so),
  #       so we need to distinguish versions below. 
  #       $iTermOld reflects a pre-v3 version.
  [[ $(osascript -e 'version of application "iTerm"') =~ ^(1|2) ]] && iTermOld=1 || iTermOld=0
else # Terminal.app
  terminalApp='Terminal' # will be used with `activate application`
fi

  # Define the command that *synchronously* actives iTerm / Terminal.
  # Note that this is neeeded both with and without -g / -G:
  #   * With -g / -G, unfortunately, the terminal app must still be activated briefly
  #     in order for GUI scripting to work correctly, with the previously active
  #     application getting reactivated afterward.
  #   * With foregound operation, we also activate explicitly, so as to support
  #     invocation from helper apps such as Alfred where the terminal may be 
  #     created implicitly and not gain focus by default. 
  # !! On 10.10+, activate is no longer *synchronous*, so we must wait until Terminal is truly activated (frontmost)
CMD_ACTIVATE='if not frontmost then
  activate
  repeat until frontmost
      delay 0.1
  end repeat
end if'

  # Optional commands that are only used if the relevant options were specified.
quotedShellCmds=''
shellCmdTokens=( "$@" )
if (( ${#shellCmdTokens[@]} )); then # Shell command(s) specified.

  if (( ${#shellCmdTokens[@]} == 1 )); then # Could be a mere command name like 'ls' or a multi-command string such as 'git bash && git status' 
    # If only a single string was specified as the command to execute in the new tab:
    # It could either be a *mere command name* OR a *quoted string containing MULTIPLE commands*.
    # We use `type` to determine if it is a mere command name / executable in the
    # current dir., otherwise we assume that the operand is a multi-command string
    # in which case we must use `eval` to execute it.
    # Note: Blindly prepending `eval` would work in MOST, but NOT ALL cases,
    #       such as with commands whose names happen to contain substrings
    #       that look like variable references (however rare that may be).
    (type "${shellCmdTokens[0]}" &>/dev/null) || shellCmdTokens=( 'eval' "${shellCmdTokens[@]}" )
  fi

      # The tricky part is to quote the command tokens properly when passing them to AppleScript:
      # Quote all parameters (as needed) using printf '%q' - this will perform backslash-escaping.
      # This will allow us to not have to deal with double quotes inside the double-quoted string that will be passed to `do script`.
  quotedShellCmds=$(printf ' %q' "${shellCmdTokens[@]}")
  # Note: $quotedShellCmds now has a leading space, but that's benign (a *trailing* space, by contrast, would be a problem with iTerm's `write <session> text ...` command)
fi

  # Synthesize the full shell command.
if [[ -n $quotedShellCmds ]]; then
  # Pass the commands as a single AppleScript string, of necessity double-quoted.
  # For the benefit of AppleScript
  #  - embedded backslashes must be escaped by doubling them
  #  - embedded double quotes must be backlash-escaped
  quotedShellCmdsForAppleScript=${quotedShellCmds//\\/\\\\}
  quotedShellCmdsForAppleScript=${quotedShellCmdsForAppleScript//\"/\\\"}
  if (( iTerm )); then
    if (( iTermOld )); then # OLD iTerm syntax (v2-)
      CMD_CUSTOM="write (current session of current terminal) text \"${quotedShellCmdsForAppleScript}\""
    else # NEW iTerm syntax (introduced in v3)
      CMD_CUSTOM="tell current session of current window to write text \"${quotedShellCmdsForAppleScript}\""
    fi
  else
    TAB_SELECT="set currentTab to selected tab of front window"
    CMD_CUSTOM="do script \"${quotedShellCmdsForAppleScript}\" in currentTab"
  fi
fi


read -d '' -r script <<EOF 
tell application "$terminalApp"
  $CMD_ACTIVATE
  $TAB_SELECT
  $CMD_CUSTOM
end tell

return
EOF

# printf %s "$script"
osascript <<<"$script"
