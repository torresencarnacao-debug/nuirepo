# Mirage NUI

Railway serves `index.html` and its assets. The menu rows come from the running Lua script through `Lapsus.SendNuiMessage`.

To display **Auto Drive** in Vehicle > Self, load the current [`menu_mirage_nui_fixed.lua`](menu_mirage_nui_fixed.lua) in the game. The option cannot be activated by updating the web page alone because menu selection is handled by Lua.

Railway also serves the same script at `/menu_mirage_nui_fixed.lua` for download.
