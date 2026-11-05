# Mirage NUI

Railway serves `index.html` and its assets. The menu rows come from the running Lua script through `Lapsus.SendNuiMessage`.

To display **Auto Drive** in Vehicle > Self, load the current [`menu_mirage_nui_fixed.lua`](menu_mirage_nui_fixed.lua) in the game. The option cannot be activated by updating the web page alone because menu selection is handled by Lua.

Railway also serves the same script at `/menu_mirage_nui_fixed.lua` for download.

**Exploit > Redside** contains 60 player ped models in two submenus:

- Animaux sauvages et fantastiques: 21 models.
- Chiens, chats et renards: 39 models.

Load the updated Lua after deploying the NUI. Selecting a model requests it,
waits up to eight seconds, and applies it with `SetPlayerModel`. Custom models
must be available on the game server. The NUI displays the category counts and
Redside titles; the page and renderer use cache version `26-redside`.

The revised Exploit menu shows **Redside > Peds** without a count beside Redside.
**Revolution > Peds** contains native, addon, and staff models. **Revolution >
Companion** contains the supplied companions, all 11 Punch Cat models, and an
action to remove matching companions attached to the local player. Custom models
must be available in the game. The NUI uses cache version `27-revolution`.
