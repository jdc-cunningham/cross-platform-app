### Notes

Specific to this/my RPi home server

`cross-platform-api.service` unit file is in `/etc/systemd/system`

`sudo systemctl daemon-reload`
`sudo systemctl restart cross-platform-api.service`

use

`journalctl -n 100` to see why it's not coming up in case errors
