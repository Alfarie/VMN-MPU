import { execSync } from 'child_process'
import fs from 'fs'
import Configuration from '../configuration';

export class AccessPoint {
    private dhcpcd_file: string = "/etc/dhcpcd.conf"
    private hostapd_file: string = '/etc/hostapd/hostapd.conf'
    private wifiHookTemplate: string = `hostname
clientid
persistent
option rapid_commit
option domain_name_servers, domain_name, domain_search, host_name
option classless_static_routes
option ntp_servers
option interface_mtu
require dhcp_server_identifier
slaac private
interface wlan0
static ip_address=192.168.100.1/24
static routers=192.168.100.1
static domain_name_servers=192.168.100.1 8.8.8.8 fd51:42f8:caae:d92e::1
`
    

    public startAP(SSID: String, PASS: String): void {
        if (!Configuration.getConfig().wifi) {
            console.log('[Info] Wifi Customization flag is not granted');
            return;
        }
        var hostapdTemplate = `interface=wlan0
driver=nl80211
ssid=`+ SSID + `
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=`+ PASS + `
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
`
        console.log('[Info] Add SSID');
        fs.writeFileSync(this.hostapd_file, hostapdTemplate);

        console.log('[Info] Add nohook wpa_supplicant');
        fs.writeFileSync(this.dhcpcd_file, this.wifiHookTemplate);
        fs.appendFileSync(this.dhcpcd_file, "nohook wpa_supplicant")

        // console.log('[Info] Set static Ip');;
        // var stdout = execSync('sudo ifconfig wlan0 192.168.100.1 netmask 255.255.255.0');

        console.log('[Info] dhcpcd restart');
        execSync('sudo service dhcpcd restart');

        console.log('[Info] Start hostapd, dnsmasq');
        execSync('sudo systemctl start hostapd');
        execSync('sudo systemctl start dnsmasq');
        setTimeout(() => { execSync('sudo reboot') }, 500)
        
    }

}

export class Station {
    dhcpcd_file:string = "/etc/dhcpcd.conf"
     wifiNoHookTemplate:string = `hostname
clientid
persistent
option rapid_commit
option domain_name_servers, domain_name, domain_search, host_name
option classless_static_routes
option ntp_servers
option interface_mtu
require dhcp_server_identifier
slaac private
`
    
     wpa_supplicant_dir:string = "/etc/wpa_supplicant/wpa_supplicant.conf"
     template:string = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=GB
`

    public startWifi(ssid:string, password:string):void {
        if (!Configuration.getConfig().wifi) {
            console.log('[Info] Wifi Customization flag is not granted');
            return;
        }
        console.log('[Info] Add Wifi Data');
        fs.writeFileSync(this.wpa_supplicant_dir, this.template);
        var cmd = 'wpa_passphrase "' + ssid + '" "' + password + '"';
        var stdout = execSync(cmd).toString();
        fs.appendFileSync(this.wpa_supplicant_dir, stdout);
    
        console.log('[Info] Clear nohook wpa_supplicant');
        fs.writeFileSync(this.dhcpcd_file, this.wifiNoHookTemplate);
    
        console.log('[Info] Stop hostapd');
        execSync('sudo systemctl stop hostapd');
        execSync('sudo systemctl stop dnsmasq');
        
        console.log('[Info] dhcpcd restart');
        execSync('sudo service dhcpcd restart');
        setTimeout(()=>{execSync('sudo reboot')}, 500)
    }
}