'use strict';

const bitcoin = require('bitcoin');
const WAValidator = require('wallet-address-validator');
const QRCode = require('qrcode');
const unirest = require('unirest');
const toastr = require('express-toastr');
const ElectrumClient = require('electrum-cash').Client;
const bs58 = require('bs58');
const sha256 = require('sha256');
//const instantiateSecp256k1 = require('@bitauth/libauth'); Unused
const appRoot = require('app-root-path');
const files = require('fs');
const dbr = require('../db.js');
const db = dbr.db;
const CryptoJS = require("crypto-js");
const bip39 = require("bip39");
const bip32 = require("bip32d");
const denarius = require('denariusjs');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

const SECRET_KEY = process.env.SECRET_KEY;

// all config options are optional
var client = new bitcoin.Client({
    host: process.env.DNRHOST,
    port: process.env.DNRPORT,
    user: process.env.DNRUSER,
    pass: process.env.DNRPASS,
    timeout: 30000
});

function shahash(key) {
	key = CryptoJS.SHA256(key, SECRET_KEY);
	return key.toString();
}

function encrypt(data) {
	data = CryptoJS.AES.encrypt(data, SECRET_KEY);
	data = data.toString();
	return data;
}

function decrypt(data) {
	data = CryptoJS.AES.decrypt(data, SECRET_KEY);
	data = data.toString(CryptoJS.enc.Utf8);
	return data;
}

/**
 * GET /withdraw
 * Withdraw page.
 */
exports.getWithdraw = (req, res) => {
  //var username = req.user.email;
  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }
  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }
  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
				var offlinebtn = 'offlinebutton';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
				var offlinebtn = 'onlinebutton';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

      var balance = info;

      if (balance <= 0) {
        balance = 0;
      }
    res.render('account/withdraw', {
        title: 'Send D',
        balance: balance,
        sendicon: sendicon,
        offline: offline,
        offlinebtn: offlinebtn,
        staketoggle: staketoggle,
        chaindl: chaindl,
        chaindlbtn: chaindlbtn
    });
  });
});
});
};

exports.getRaw = (req, res) => {
  //var username = req.user.email;
  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }
  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }
  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var balance = '0';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
				var offlinebtn = 'onlinebutton';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

      var balance = info;

      if (balance <= 0) {
        balance = 0;
      }
    res.render('account/sendraw', {
        title: 'Broadcast Raw TX',
        balance: balance,
        offline: offline,
        sendicon: sendicon,
        offlinebtn: offlinebtn,
        staketoggle: staketoggle,
        chaindl: chaindl,
        chaindlbtn: chaindlbtn
    });
  });
});
});
};

exports.getPriv = (req, res) => {
  //var username = req.user.email;

  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;
  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }
  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }
  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var balance = '0';
        var info = 'Node is importing private key...Please wait...';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
        var balance = info;
        var info = '';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

      //var balance = info.balance;

      if (balance <= 0) {
        balance = 0;
      }
    res.render('account/import', {
        title: 'Import Private Key',
        balance: balance,
        offline: offline,
        sendicon: sendicon,
        offlinebtn: offlinebtn,
        staketoggle: staketoggle,
        chaindl: chaindl,
        chaindlbtn: chaindlbtn,
        info: info
    });
  });
});
});
};

exports.getSign = (req, res) => {
  //var username = req.user.email;
  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;
  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }
  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }
  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var balance = '0';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
				var offlinebtn = 'onlinebutton';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

      var balance = info;

      if (balance <= 0) {
        balance = 0;
      }
    res.render('account/sign', {
        title: 'Sign a Denarius Message',
        balance: balance,
        offline: offline,
        sendicon: sendicon,
        offlinebtn: offlinebtn,
        staketoggle: staketoggle,
        chaindl: chaindl,
        chaindlbtn: chaindlbtn
    });
  });
});
});
};

exports.getVerify = (req, res) => {
  //var username = req.user.email;
  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;
  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }
  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }
  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var balance = '0';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
				var offlinebtn = 'onlinebutton';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

      var balance = info;

      if (balance <= 0) {
        balance = 0;
      }
    res.render('account/verify', {
        title: 'Verify a Denarius Message',
        balance: balance,
        offline: offline,
        sendicon: sendicon,
        offlinebtn: offlinebtn,
        staketoggle: staketoggle,
        chaindl: chaindl,
        chaindlbtn: chaindlbtn
    });
  });
});
});
};

exports.getBackup = (req, res) => {
  //var username = req.user.email;
  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;
  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }

  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }

  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var balance = '0';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
				var offlinebtn = 'onlinebutton';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

      var balance = info;

      if (balance <= 0) {
        balance = 0;
      }
    res.render('account/backup', {
        title: 'Backup your D Wallet',
        balance: balance,
        offline: offline,
        sendicon: sendicon,
        offlinebtn: offlinebtn,
        staketoggle: staketoggle,
        chaindl: chaindl,
        chaindlbtn: chaindlbtn
    });
  });
});
});
};

//GET Addresses Page
//Fetches unspent and account addresses and then scripthashes them for ElectrumX Balance fetching
// By Carsen Klock
exports.addresses = function (req, res) {
  //var username = req.user.email;

  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  //The used Electrumx Host, may swap to Clusters to run all x1-x4 nodes
  // May move electrumx connections globally todo
  //
  const delectrumxhost = 'electrumx1.denarius.pro';
  //
  //

  //Global Vars
  var addressed;
  var scripthasharray = [];
  var promises = [];
  var qr;

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }

  client.getBalance(function (error, info, resHeaders) {
    if (error) {
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var balance = '0';
      console.log(error);
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

    var chaindl = 'nooverlay';
    var chaindlbtn = 'nobtn';

    var balance = info;

    if (balance <= 0) {
      balance = 0;
    }

  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }

  //List All Addresses
  client.listUnspent(function (err, addresses, resHeaders) {
      if (err) {
        console.log(err);
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var addresses = 'Offline';
      }

      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      addresses.forEach(address => {
        var addressed = address.address;

        client.validateAddress(addressed, function (error, returnedaddi, resHeaders) {
          if (error) {
            var offline = 'offlineoverlay';
            var offlinebtn = 'offlinebutton';
            var returnedaddi = 'Offline';
            console.log(error);
          } else {
            var offline = 'onlineoverlay';
            var offlinebtn = 'onlinebutton';
          }
      
          var chaindl = 'nooverlay';
          var chaindlbtn = 'nobtn';
      
          var validationdata = returnedaddi.ismine;

          if (validationdata == true) {
            addressed = address.address;              
            var compressedpubkey = returnedaddi.pubkey;
          } else {
            addressed = '';
          }

        //Convert P2PKH Address to Scripthash for ElectrumX Balance Fetching
        const bytes = bs58.decode(addressed)
        const byteshex = bytes.toString('hex');
        const remove00 = byteshex.substring(2);
        const removechecksum = remove00.substring(0, remove00.length-8);
        const HASH160 = "76A914" + removechecksum.toUpperCase() + "88AC";
        const BUFFHASH160 = Buffer.from(HASH160, "hex");
        const shaaddress = sha256(BUFFHASH160);

        const changeEndianness = (string) => {
                const result = [];
                let len = string.length - 2;
                while (len >= 0) {
                  result.push(string.substr(len, 2));
                  len -= 2;
                }
                return result.join('');
        }

        const scripthash = changeEndianness(shaaddress);

        const scripthasha = async () => {
          // Initialize an electrum client.
          const electrum = new ElectrumClient('Kronos ElectrumX', '1.4.1', delectrumxhost);
  
          // Wait for the client to connect
          await electrum.connect();

          //Convert P2PK Address to Scripthash for ElectrumX Balance Fetching
          //Convert Compressed Pub Key to Uncompressed
          const HASH1601 =  "21" + compressedpubkey.toUpperCase() + "AC"; // 21 + COMPRESSED PUBKEY + OP_CHECKSIG = P2PK
          const BUFFHASH1601 = Buffer.from(HASH1601, "hex");
          const shaaddress1 = sha256(BUFFHASH1601);

          const changeEndianness = (string) => {
                  const result = [];
                  let len = string.length - 2;
                  while (len >= 0) {
                    result.push(string.substr(len, 2));
                    len -= 2;
                  }
                  return result.join('');
          }
          
          const scripthashp2pk = changeEndianness(shaaddress1);

          // Initialize an Electrum cluster where 1 out of 4 needs to be consistent, polled randomly with fail-over.
          // const electrum = new ElectrumCluster('Kronos ElectrumX Cluster', '1.4.1', 1, 4, ElectrumCluster.ORDER.RANDOM);
          
          // Add some servers to the cluster.
          // electrum.addServer('electrumx1.denarius.pro');
          // electrum.addServer('electrumx2.denarius.pro');
          // electrum.addServer('electrumx3.denarius.pro');
          // electrum.addServer('electrumx4.denarius.pro');
          
          // Wait for enough connections to be available.
          // await electrum.ready();
          
          // Request the balance of the requested Scripthash D address

          const balancescripthash = await electrum.request('blockchain.scripthash.get_balance', scripthash);

          const p2pkbalancescripthash = await electrum.request('blockchain.scripthash.get_balance', scripthashp2pk);

          const balanceformatted = balancescripthash.confirmed;

          const p2pkbalanceformatted = p2pkbalancescripthash.confirmed;

          const balancefinal = balanceformatted / 100000000;

          const p2pkbalancefinal = p2pkbalanceformatted / 100000000;

          const addedbalance = balancefinal + p2pkbalancefinal;

          await electrum.disconnect();
          // await electrum.shutdown();
  
          return addedbalance;
        }

        const qrcodeasync = async () => {
          const qrcoded = await QRCode.toDataURL(address.address, { color: { dark: '#000000FF', light:"#333333FF" } });

          //console.log(qrcoded)

          return qrcoded;
        }

        promises.push(new Promise((res, rej) => {
          qrcodeasync().then(qrcodedata => {
            scripthasha().then(globalData => {
            
            scripthasharray.push({address: addressed, qr: qrcodedata, scripthash: scripthash, balance: globalData});
            res({addressed, qrcodedata, scripthash, globalData});

          });
          });  
        }) );
      });

      });

      client.listReceivedByAddress(0, true, false, function (err, listaddresses, resHeaders) {
        if (err) {
          console.log(err);
          var offline = 'offlineoverlay';
          var offlinebtn = 'offlinebutton';
          var addresses = 'Offline';
        }
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';

        listaddresses.forEach(addi => {
          var addressedd = addi.address;

          client.validateAddress(addressedd, function (error, returnedaddy, resHeaders) {
            if (error) {
              var offline = 'offlineoverlay';
              var offlinebtn = 'offlinebutton';
              var returnedaddy = 'Offline';
              console.log(error);
            } else {
              var offline = 'onlineoverlay';
              var offlinebtn = 'onlinebutton';
            }
        
            var chaindl = 'nooverlay';
            var chaindlbtn = 'nobtn';
        
            var validationdata = returnedaddy.ismine;

            if (validationdata == true) {
              addressedd = addi.address;              
              var compressedpubkey = returnedaddy.pubkey;
            } else {
              addressedd = '';
            }       


          if (addressedd != '') {

            //Convert P2PKH Address to Scripthash for ElectrumX Balance Fetching
            const bytes1 = bs58.decode(addressedd)
            const byteshex1 = bytes1.toString('hex');
            const remove001 = byteshex1.substring(2);
            const removechecksum1 = remove001.substring(0, remove001.length-8);
            const HASH1601 = "76A914" + removechecksum1.toUpperCase() + "88AC";
            const BUFFHASH1601 = Buffer.from(HASH1601, "hex");
            const shaaddress1 = sha256(BUFFHASH1601);

            const changeEndianness = (string) => {
                    const result = [];
                    let len = string.length - 2;
                    while (len >= 0) {
                      result.push(string.substr(len, 2));
                      len -= 2;
                    }
                    return result.join('');
            }

            const scripthash1 = changeEndianness(shaaddress1);

            const scripthashb = async () => {
              // Initialize an electrum client.
              const electrum = new ElectrumClient('Kronos ElectrumX', '1.4.1', delectrumxhost);
      
              // Wait for the client to connect
              await electrum.connect();

              //Convert P2PK Address to Scripthash for ElectrumX Balance Fetching
              //Convert Compressed Pub Key
              const HASH1601p = "21" + compressedpubkey.toUpperCase() + "AC"; // 21 + COMPRESSED PUBKEY + OP_CHECKSIG = P2PK
              const BUFFHASH1601p = Buffer.from(HASH1601p, "hex");
              const shaaddress1p = sha256(BUFFHASH1601p);

              const changeEndianness = (string) => {
                      const result = [];
                      let len = string.length - 2;
                      while (len >= 0) {
                        result.push(string.substr(len, 2));
                        len -= 2;
                      }
                      return result.join('');
              }
              
              const p2pkscripthash1 = changeEndianness(shaaddress1p);

              // Request the balance of the requested Scripthash D address
              const balancescripthash1 = await electrum.request('blockchain.scripthash.get_balance', scripthash1);
              
              const p2pkbalancescripthash1 = await electrum.request('blockchain.scripthash.get_balance', p2pkscripthash1);

              const balanceformatted1 = balancescripthash1.confirmed;

              const p2pkbalanceformatted1 = p2pkbalancescripthash1.confirmed;

              const balancefinal1 = balanceformatted1 / 100000000;

              const p2pkbalancefinal1 = p2pkbalanceformatted1 / 100000000;

              const addedbalance1 = balancefinal1 + p2pkbalancefinal1;

              await electrum.disconnect();
      
              return addedbalance1;
            }

            const qrcodeasync = async () => {
              if (addressedd != '') {
                const qrcoded1 = await QRCode.toDataURL(addressedd, { color: { dark: '#000000FF', light:"#333333FF" } });

                return qrcoded1;
              } else {
                const qrcoded1 = '';

                return qrcoded1;
              }
            }

            promises.push(new Promise((res, rej) => {
              qrcodeasync().then(qrcodedata1 => {
                scripthashb().then(globalData1 => {
                
                scripthasharray.push({address: addressedd, qr: qrcodedata1, scripthash: scripthash1, balance: globalData1});
                res({addressed, qrcodedata1, scripthash1, globalData1});

              }).catch(function(err) {
                console.log("Error", err);
            });
              });  
            }) );
          }
        });
        

        });

      var account = '333D'; //Needs work

		  client.getAddressesByAccount(`dpi(${account})`, async function (err, addressess, resHeaders) { //this isnt used by the foreach below
        if (err) {

          console.log(err);
          var addyy = 'Node Offline';
          var qrcode = 'Node Offline';        
          var offline = 'offlineoverlay';
          var offlinebtn = 'offlinebutton';
          var qr = 'Offline';

        } else {

          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';

          var addyy = addressess.slice(-1)[0];

          if (typeof addyy == 'undefined') {
            client.getNewAddress(`dpi(${account})`, function (error, addr, resHeaders) {
            if (error) {
              console.log(error);
            }
            addyy = addr;
            });
          }

          var qr = 'denarius:'+addyy;

        }
      
        
        QRCode.toDataURL(addyy, { color: { dark: '#000000FF', light:"#333333FF" } }, function(err, addyqr) {

        //Start ForEach Loops of Addresses to Scripthashes

        addressess.forEach(addii => {
          var addressed2 = addii;

          client.validateAddress(addressed2, function (error, returnedaddii, resHeaders) {
            if (error) {
              var offline = 'offlineoverlay';
              var offlinebtn = 'offlinebutton';
              var returnedaddii = 'Offline';
              console.log(error);
            } else {
              var offline = 'onlineoverlay';
              var offlinebtn = 'onlinebutton';
            }
        
            var chaindl = 'nooverlay';
            var chaindlbtn = 'nobtn';
        
            var validationdata = returnedaddii.ismine;
  
            if (validationdata == true) {
              addressed2 = addii;              
              var compressedpubkey2 = returnedaddii.pubkey;
            } else {
              addressed2 = '';
            }

          //Convert P2PKH Address to Scripthash for ElectrumX Balance Fetching
          const bytes2 = bs58.decode(addressed2)
          const byteshex2 = bytes2.toString('hex');
          const remove002 = byteshex2.substring(2);
          const removechecksum2 = remove002.substring(0, remove002.length-8);
          const HASH1602 = "76A914" + removechecksum2.toUpperCase() + "88AC";
          const BUFFHASH1602 = Buffer.from(HASH1602, "hex");
          const shaaddress2 = sha256(BUFFHASH1602);

          const changeEndianness = (string) => {
                  const result = [];
                  let len = string.length - 2;
                  while (len >= 0) {
                    result.push(string.substr(len, 2));
                    len -= 2;
                  }
                  return result.join('');
          }

          const scripthash2 = changeEndianness(shaaddress2);

          // const p2pkscripthash2 = changeEndianness(shaaddress2p);

          const scripthashe = async () => {
            // Initialize an electrum client.
            const electrum = new ElectrumClient('Kronos ElectrumX', '1.4.1', delectrumxhost);
    
            // Wait for the client to connect
            await electrum.connect();

            //Convert P2PK Address to Scripthash for ElectrumX Balance Fetching
            //Convert Compressed Pub Key to Uncompressed
            const HASH1602p = "21" + compressedpubkey2.toUpperCase() + "AC"; // "21" + COMPRESSED PUB KEY + OP_CHECKSIG
            const BUFFHASH1602p = Buffer.from(HASH1602p, "hex");
            const shaaddress2p = sha256(BUFFHASH1602p);

            const changeEndianness = (string) => {
                    const result = [];
                    let len = string.length - 2;
                    while (len >= 0) {
                      result.push(string.substr(len, 2));
                      len -= 2;
                    }
                    return result.join('');
            }
            
            const p2pkscripthash2 = changeEndianness(shaaddress2p);
            
            // Request the balance of the requested Scripthash D address
            const balancescripthash2 = await electrum.request('blockchain.scripthash.get_balance', scripthash2);
              
            const p2pkbalancescripthash2 = await electrum.request('blockchain.scripthash.get_balance', p2pkscripthash2);

            const balanceformatted2 = balancescripthash2.confirmed;

            const p2pkbalanceformatted2 = p2pkbalancescripthash2.confirmed;

            const balancefinal2 = balanceformatted2 / 100000000;

            const p2pkbalancefinal2 = p2pkbalanceformatted2 / 100000000;

            const addedbalance2 = balancefinal2 + p2pkbalancefinal2;

            await electrum.disconnect();
    
            return addedbalance2;
          }

          const qrcodeasync = async () => {
            const qrcoded2 = await QRCode.toDataURL(addii, { color: { dark: '#000000FF', light:"#333333FF" } });

            //console.log(qrcoded)

            return qrcoded2;
          }


          promises.push(new Promise((res, rej) => {
            qrcodeasync().then(qrcodedata2 => {
              scripthashe().then(globalData2 => {
              
              scripthasharray.push({address: addressed2, qr: qrcodedata2, scripthash: scripthash2, balance: globalData2});
              res({addressed2, qrcodedata2, scripthash2, globalData2});

            }).catch(function(err) {
              console.log("Error", err);
          });
            });  
          }) );

        });

        });

        var chaindl = 'nooverlay';
        var chaindlbtn = 'nobtn';

        Promise.all(promises).then((values) => {

          function uniqByKeepLast(data, key) {
            return [
                ...new Map(
                    data.map(x => [key(x), x])
                ).values()
            ]
          }

          //Filter out all duplicate addresses from the combined scripthasharray
          var filteredscripthasharray = uniqByKeepLast(scripthasharray, it => it.address);

          //console.log(filteredscripthasharray);

          res.render('account/addresses', { title: 'My Addresses', addyy: addyy, addyqr: addyqr, addresses: addresses, scripthasharray: filteredscripthasharray, sendicon: sendicon, staketoggle: staketoggle, balance: balance, offline: offline, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn });
        });
      
    });
      });
});
});
});
});
});
}

exports.wallet = function (req, res) {
    var username = req.user.email;

    //List Balances
    client.getBalance(`dnrw(${username})`, 10, function (error, balance, resHeaders) {
        if (error) return console.log(error);

        if (balance <= 0) {
          balance = 0;
        }

        //List Transactions
        client.listTransactions(`dnrw(${username})`, 5, function (err, transactions, resHeaders) {
            if (err) return console.log(err);

        //List Account Address
        //client.getAccountAddress(`dnrw(${username})`, function (error, address, resHeaders) {
        client.getAddressesByAccount(`dnrw(${username})`, function (err, addresses, resHeaders) {
            if (error) return console.log(error);

            var address = addresses.slice(-1)[0];

            if (typeof address == 'undefined') {
                client.getNewAddress(`dnrw(${username})`, function (error, addr, resHeaders) {
                  if (error) return console.log(error);
                  address = addr;
                });
            }

            var qr = 'denarius:'+address;

            unirest.get("https://api.coinmarketcap.com/v1/ticker/denarius-d/")
              .headers({'Accept': 'application/json'})
              .end(function (result) {
                var usdprice = result.body[0]['price_usd'] * balance;
                var btcprice = result.body[0]['price_btc'] * balance;

            QRCode.toDataURL(qr, function(err, qrcode) {

            res.render('account/wallet', { title: 'My Wallet', user: req.user, usd: usdprice.toFixed(2), btc: btcprice.toFixed(8), address: address, qrcode: qrcode, balance: balance.toFixed(8), transactions: transactions });

            });
          });
          });
        });
    });
    /**
    var batch = [];
    for (var i = 0; i < 10; ++i) {
        batch.push({
            method: 'getbalance',
            params: [`dnrw(${username})`],
            method: 'getaddressesbyaccount',
            params: [`dnrw(${username})`]
        });
    }
    client.cmd(batch, function (err, balance, addresses, resHeaders) {
        if (err) return console.log(err);

        console.log(`${username}`, 'Addresses:', addresses, 'Balance:', balance);
    });
    */
};

//POST GET NEW ADDRESS

exports.address = function (req, res) {
    //var username = req.user.email;
    const ip = require('ip');
    const ipaddy = ip.address();

    res.locals.lanip = ipaddy;

    client.walletStatus(function (err, ws, resHeaders) {
      if (err) {
        console.log(err);
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var ws = '';
        var walletstatuss = 'locked';
        var sendicon = 'display: none !important';
      } else {
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var walletstatuss = ws.wallet_status;
        var sendicon;
        
        if (walletstatuss == 'stakingonly') {
          sendicon = 'display: none !important';
        } else if (walletstatuss == 'unlocked') {
          sendicon = 'display: visible !important;';
        } else if (walletstatuss == 'unencrypted') {
          sendicon = 'display: visible !important';
        } else if (walletstatuss == 'locked') {
          sendicon = 'display: none !important';
        }
      }

    client.getStakingInfo(function (error, stakeinfo, resHeaders) {

        if (error) {
          var enabled = 'Node Offline';
          var staking = 'Node Offline';
          var yourweight = 'Node Offline';
          var netweight = 'Node Offline';
          var expected = 'Node Offline';
          var stakediff = 'Node Offline';
    
          var offline = 'offlineoverlay';
    
          var offlinebtn = 'offlinebutton';
    
          console.log(error);
    
        } else {
          var enabled = stakeinfo.enabled;
          var staking = stakeinfo.staking;
          var yourweight = stakeinfo.weight;
          var netweight = stakeinfo.netstakeweight;
          var expected = stakeinfo.expectedtime;
          var stakediff = stakeinfo.difficulty;
    
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
    
          var staketoggle;
          var enabletoggle;
    
          if (enabled == true) {
            enabletoggle = 'Configured';
          } else {
            enabletoggle = 'Disabled';
          }
    
          if (staking == true) {
            staketoggle = 'Staking';
          } else {
            staketoggle = 'Not Yet Staking';
          }
        }

    client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var balance = '0';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
      }
  
      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';
  
      var balance = info;
  
      if (balance <= 0) {
        balance = 0;
      }  

    client.getNewAddress(`dpi(333D)`, function (error, address, resHeaders) {
        if (error) {
          var offline = 'offlineoverlay';
          var offlinebtn = 'offlinebutton';
          var address = 'Offline';
          console.log(error);
        } else {
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
        }
    
        var chaindl = 'nooverlay';
        var chaindlbtn = 'nobtn';

        var qr = 'denarius:'+address

        QRCode.toDataURL(qr, function(err, data_url) {

        res.render('account/newaddress', { title: 'New D Address', user: req.user, offline: offline, sendicon: sendicon, staketoggle: staketoggle, balance: balance, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn, address: address, data_url: data_url });
    });
  });
  });
});
});
};


//POST GET FS GEN KEY

exports.genkey = function (req, res) {
  //var username = req.user.email;

  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }

  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }

  client.getBalance(function (error, info, resHeaders) {
    if (error) {
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var balance = '0';
      console.log(error);
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

    var chaindl = 'nooverlay';
    var chaindlbtn = 'nobtn';

    var balance = info;

    if (balance <= 0) {
      balance = 0;
    }  

  client.fortunaStake('genkey', function (error, genkey, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var genkey = 'Offline';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
      }
  
      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

      var qr = 'denarius:'+genkey

      QRCode.toDataURL(qr, function(err, data_url) {

      res.render('account/genkey', { title: 'New D FS Key', user: req.user, offline: offline, staketoggle: staketoggle, sendicon: sendicon, balance: balance, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn, genkey: genkey, data_url: data_url });
  });
});
});
  });
  });
};

/**
 * POST /withdraw
 * Send Denarius funds
 */
exports.withdraw = (req, res, next) => {
	  var fee = 0.0001;
    //var username = req.user.email;
    var sendtoaddress = req.body.sendaddress;
    var amount = req.body.amount;

    client.getBalance(function (error, info, resHeaders) {
        if (error) {
          console.log(error);
        }

        var balance = info;

    var valid = WAValidator.validate(`${sendtoaddress}`, 'DNR'); //Need to update to D still

    if (parseFloat(amount) - fee > balance) {
        req.toastr.error('Withdrawal amount exceeds your D balance!', 'Balance Error!', { positionClass: 'toast-bottom-right' });
        //req.flash('errors', { msg: 'Withdrawal amount exceeds your D balance'});
        return res.redirect('/withdraw');

    } else {

    if (valid) {

        client.sendToAddress(`${sendtoaddress}`, parseFloat(`${amount}`), function (error, sendFromtx, resHeaders) {
            if (error) {
                req.toastr.error('Insufficient Funds or Invalid Amount!', 'Invalid!', { positionClass: 'toast-bottom-right' });
                //req.flash('errors', { msg: 'Insufficient Funds or Invalid Amount!' });
                return res.redirect('/withdraw');

            } else {

                var sendtx = sendFromtx;
                var vamount = parseFloat(`${amount}`);

                req.toastr.success(`${vamount} D was sent successfully!`, 'Success!', { positionClass: 'toast-bottom-right' });
                req.flash('success', { msg: `Your <strong>${vamount} D</strong> was sent successfully! TX ID: <a href="https://coinexplorer.net/D/transaction/${sendtx}" target="_blank">${sendtx}</a>` });
                return res.redirect('/withdraw');
            }
        });

    } else {
        req.toastr.error('You entered an invalid Denarius (D) Address!', 'Invalid Address!', { positionClass: 'toast-bottom-right' });
        //req.flash('errors', { msg: 'You entered an invalid Denarius (D) Address!' });
        return res.redirect('/withdraw');
    }
  }
  });
};

exports.transactions = function (req, res) {
  //var username = req.user.email;

  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }

  client.getBalance(function (error, info, resHeaders) {
    if (error) {
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var balance = '0';
      console.log(error);
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

    var chaindl = 'nooverlay';
    var chaindlbtn = 'nobtn';

    var balance = info;

    if (balance <= 0) {
      balance = 0;
    }

  //List Transactions
  client.listTransactions('*', 300, function (err, transactions, resHeaders) {
      if (err) {
        console.log(err);
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var transactions = [];
      } else {
        
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';
  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

        if (error) {
          var enabled = 'Node Offline';
          var staking = 'Node Offline';
          var yourweight = 'Node Offline';
          var netweight = 'Node Offline';
          var expected = 'Node Offline';
          var stakediff = 'Node Offline';
    
          var offline = 'offlineoverlay';
    
          var offlinebtn = 'offlinebutton';
    
          console.log(error);
    
        } else {
          var enabled = stakeinfo.enabled;
          var staking = stakeinfo.staking;
          var yourweight = stakeinfo.weight;
          var netweight = stakeinfo.netstakeweight;
          var expected = stakeinfo.expectedtime;
          var stakediff = stakeinfo.difficulty;
    
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
    
          var staketoggle;
          var enabletoggle;
    
          if (enabled == true) {
            enabletoggle = 'Configured';
          } else {
            enabletoggle = 'Disabled';
          }
    
          if (staking == true) {
            staketoggle = 'Staking';
          } else {
            staketoggle = 'Not Yet Staking';
          }
        }

    res.render('account/tx', { title: 'Transactions', transactions: transactions, sendicon: sendicon, staketoggle: staketoggle, balance: balance, offline: offline, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn });
    });

  });
});
});
};


//POST for Starting FS from FS Page
exports.startfs = (req, res, next) => {

    var alias = req.body.alias;

    client.fortunaStake('start-alias', `${alias}`, function (error, result, resHeaders) {
      //if (error) return console.log(error);

      if (error) {
        req.toastr.error(`Something went wrong trying to start the FS ${alias} - ${error}`, 'Error!', { positionClass: 'toast-bottom-right' });
        return res.redirect('/fs');
      } else {

        if (result.result == 'failed')
        {
          var resultfinal = 'FAILED'
        } else {
          var resultfinal = 'SUCCEEDED'
        }

        req.flash('success', { msg: `Ran start-alias on FS <strong>${alias}</strong> and it ${resultfinal}` });
        req.toastr.success(`Ran start-alias on FS ${alias} and it ${resultfinal}`, 'Ran start-alias on FS', { positionClass: 'toast-bottom-right' });
        return res.redirect('/fs');

      }

    });
  
};

//GET for FS Page
exports.fs = function (req, res) {
  //var username = req.user.email;

  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  client.getBalance(function (error, info, resHeaders) {
    if (error) {
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var balance = '0';
      console.log(error);
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

    var chaindl = 'nooverlay';
    var chaindlbtn = 'nobtn';

    var balance = info;

    if (balance <= 0) {
      balance = 0;
    }

  client.fortunaStake('count', function (err, count, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var count = 0;
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

    }

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }

  client.fortunaStake('status', function (err, statuss, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var statuss = [];
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

  //List FortunaStakes
  client.fortunaStake('list', 'full', function (err, fss, resHeaders) {
      if (err) {
        console.log(err);
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var fss = [];
      } else {
        
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

        if (error) {
          var enabled = 'Node Offline';
          var staking = 'Node Offline';
          var yourweight = 'Node Offline';
          var netweight = 'Node Offline';
          var expected = 'Node Offline';
          var stakediff = 'Node Offline';
    
          var offline = 'offlineoverlay';
    
          var offlinebtn = 'offlinebutton';
    
          console.log(error);
    
        } else {
          var enabled = stakeinfo.enabled;
          var staking = stakeinfo.staking;
          var yourweight = stakeinfo.weight;
          var netweight = stakeinfo.netstakeweight;
          var expected = stakeinfo.expectedtime;
          var stakediff = stakeinfo.difficulty;
    
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
    
          var staketoggle;
          var enabletoggle;
    
          if (enabled == true) {
            enabletoggle = 'Configured';
          } else {
            enabletoggle = 'Disabled';
          }
    
          if (staking == true) {
            staketoggle = 'Staking';
          } else {
            staketoggle = 'Not Yet Staking';
          }
        }

    res.render('account/fs', { title: 'FortunaStakes', fss: fss, count: count, staketoggle: staketoggle, statuss: statuss, sendicon: sendicon, balance: balance, offline: offline, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn });
    });

  });
  });
  });
  });
  });
};

//GET Get Address Information
exports.getaddress = function (req, res) {
  var urladdy = req.params.addr;
  //console.log('PASSED ADDRESS: ', urladdy);

  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  //The used Electrumx Host, may swap to Clusters to run all x1-x4 nodes
  // May move electrumx connections globally todo
  //
  const delectrumxhost = 'electrumx1.denarius.pro';
  //
  //

  //Global Vars
  var scripthasharray = [];
  var txhistoryarray = [];
  var promises = [];

  client.getBalance(function (error, info, resHeaders) {
    if (error) {
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var balance = '0';
      console.log(error);
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

    var chaindl = 'nooverlay';
    var chaindlbtn = 'nobtn';

    var balance = info;

    if (balance <= 0) {
      balance = 0;
    }



  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
        sendicon = 'display: none !important';
      } else if (walletstatuss == 'unlocked') {
        sendicon = 'display: visible !important;';
      } else if (walletstatuss == 'unencrypted') {
        sendicon = 'display: visible !important';
      } else if (walletstatuss == 'locked') {
        sendicon = 'display: none !important';
      }
    }

  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

        if (error) {
          var enabled = 'Node Offline';
          var staking = 'Node Offline';
          var yourweight = 'Node Offline';
          var netweight = 'Node Offline';
          var expected = 'Node Offline';
          var stakediff = 'Node Offline';
    
          var offline = 'offlineoverlay';
    
          var offlinebtn = 'offlinebutton';
    
          console.log(error);
    
        } else {
          var enabled = stakeinfo.enabled;
          var staking = stakeinfo.staking;
          var yourweight = stakeinfo.weight;
          var netweight = stakeinfo.netstakeweight;
          var expected = stakeinfo.expectedtime;
          var stakediff = stakeinfo.difficulty;
    
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
    
          var staketoggle;
          var enabletoggle;
    
          if (enabled == true) {
            enabletoggle = 'Configured';
          } else {
            enabletoggle = 'Disabled';
          }
    
          if (staking == true) {
            staketoggle = 'Staking';
          } else {
            staketoggle = 'Not Yet Staking';
          }
        }

        client.validateAddress(urladdy, function (error, returnedaddi, resHeaders) {
          if (error) {
            var offline = 'offlineoverlay';
            var offlinebtn = 'offlinebutton';
            var returnedaddi = 'Offline';
            console.log(error);
          } else {
            var offline = 'onlineoverlay';
            var offlinebtn = 'onlinebutton';
          }
      
          var chaindl = 'nooverlay';
          var chaindlbtn = 'nobtn';
      
          var validationdata = returnedaddi.ismine;

          if (validationdata == true) {
            urladdy = returnedaddi.address;              
            var compressedpubkey = returnedaddi.pubkey;
          } else {
            //urladdy = '';
            var compressedpubkey = 'NOT AVAILABLE';
          }


          //Convert P2PKH Address to Scripthash for ElectrumX Balance Fetching
          const bytes = bs58.decode(urladdy);
          const byteshex = bytes.toString('hex');
          const remove00 = byteshex.substring(2);
          const removechecksum = remove00.substring(0, remove00.length-8);
          const HASH160 = "76A914" + removechecksum.toUpperCase() + "88AC";
          const BUFFHASH160 = Buffer.from(HASH160, "hex");
          const shaaddress = sha256(BUFFHASH160);

          //Convert P2PK Address to Scripthash for ElectrumX Balance Fetching
          //Convert Compressed Pub Key
          const HASH1601p = "21" + compressedpubkey.toUpperCase() + "AC"; // 21 + COMPRESSED PUBKEY + OP_CHECKSIG = P2PK
          const BUFFHASH1601p = Buffer.from(HASH1601p, "hex");
          const shaaddress1p = sha256(BUFFHASH1601p);

          const changeEndianness = (string) => {
                  const result = [];
                  let len = string.length - 2;
                  while (len >= 0) {
                    result.push(string.substr(len, 2));
                    len -= 2;
                  }
                  return result.join('');
          }

          if (validationdata == true) {
            var p2pkraw = "21  "+compressedpubkey.toUpperCase()+"  OP_CHECKSIG";
            var p2pkhraw = "OP_DUP OP_HASH160  "+removechecksum.toUpperCase()+"  OP_EQUALVERIFY OP_CHECKSIG";
          } else {
            var p2pkraw = "";       
            var p2pkhraw = "OP_DUP OP_HASH160  "+removechecksum.toUpperCase()+"  OP_EQUALVERIFY OP_CHECKSIG";
          }

          const scripthash = changeEndianness(shaaddress);

          var p2pkscripthash = changeEndianness(shaaddress1p);

          const scripthashf = async () => {
            // Initialize an electrum client.
            const electrum = new ElectrumClient('Kronos ElectrumX', '1.4.1', delectrumxhost);
    
            // Wait for the client to connect
            await electrum.connect();

            // Request the balance of the requested Scripthash D address
            const balancescripthash1 = await electrum.request('blockchain.scripthash.get_balance', scripthash);

            const p2pkbalancescripthash1 = await electrum.request('blockchain.scripthash.get_balance', p2pkscripthash);

            // const scripthashhistory = await electrum.request('blockchain.scripthash.get_history', scripthash);

            // const p2pkhistory = await electrum.request('blockchain.scripthash.get_history', p2pkscripthash);

            const balanceformatted1 = balancescripthash1.confirmed;

            const p2pkbalanceformatted1 = p2pkbalancescripthash1.confirmed;

            const balancefinal1 = balanceformatted1 / 100000000;

            const p2pkbalancefinal1 = p2pkbalanceformatted1 / 100000000;

            const addedbalance1 = balancefinal1 + p2pkbalancefinal1;

            await electrum.disconnect();
    
            return addedbalance1;
          }

          unirest.get("https://chainz.cryptoid.info/d/api.dws?q=getbalance&a="+urladdy)
            .headers({'Accept': 'application/json'})
            .end(function (result) {
              if (!result.error) {

                res.locals.explorerbalance = result.body;
                var eebalance = result.body;

              } else { 

                res.locals.explorerbalance = '~';
                var eebalance = '~';

              }      

          const scripthashtx = async () => {
            // Initialize an electrum client.
            const electrum = new ElectrumClient('Kronos ElectrumX', '1.4.1', delectrumxhost);
    
            // Wait for the client to connect
            await electrum.connect();

            const scripthashhistory = await electrum.request('blockchain.scripthash.get_history', scripthash);

            const p2pkhistory = await electrum.request('blockchain.scripthash.get_history', p2pkscripthash);

            const txs = scripthashhistory + p2pkhistory;

            const numTx = scripthashhistory.length + p2pkhistory.length;

            //console.log(numTx);

            res.locals.numTx = numTx;

            txhistoryarray.push({scripthashtxhistory: scripthashhistory, p2pktxhistory: p2pkhistory});

            //console.log(txhistoryarray)            

            await electrum.disconnect();
    
            return txhistoryarray;
          }

          const qrcodeasync = async () => {
            if (urladdy != '') {
              const qrcoded1 = await QRCode.toDataURL(urladdy, { color: { dark: '#000000FF', light:"#333333FF" } });

              return qrcoded1;
            } else {
              const qrcoded1 = '';

              return qrcoded1;
            }
          }

          var ebalance = eebalance;

          promises.push(new Promise((res, rej) => {
            qrcodeasync().then(qrcodedata1 => {
              scripthashf().then(globalData1 => {
                scripthashtx().then(txData => {

                  if (validationdata == true) {
                    globalData1 = globalData1;
                  } else {
                    p2pkscripthash = "";
                    globalData1 = ebalance;
                  }
              
              scripthasharray.push({address: urladdy, qr: qrcodedata1, ismine: validationdata, p2pkhscripthash: scripthash, p2pkhraw: p2pkhraw, p2pkscripthash: p2pkscripthash, p2pkraw: p2pkraw, balance: globalData1, txs: txData});
              
              res({urladdy, qrcodedata1, scripthash, globalData1, txData});

            }).catch(function(err) {
              console.log("Error", err);
          });
            });  
          });
          }) );

          Promise.all(promises).then((values) => {

          //console.log(scripthasharray);
        

    res.render('explore/getaddress', { title: 'Address View', scripthasharray: scripthasharray, staketoggle: staketoggle, sendicon: sendicon, balance: balance, offline: offline, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn });
    });

  });
  });
  });      
  });
});    
  //}); 
};

//GET Get Transaction Information
exports.gettx = function (req, res) {
      var urltx = req.params.tx;
      //console.log('PASSED TXID: ', urltx);

      const ip = require('ip');
      const ipaddy = ip.address();

      res.locals.lanip = ipaddy;

      client.getBalance(function (error, info, resHeaders) {
        if (error) {
          var offline = 'offlineoverlay';
          var offlinebtn = 'offlinebutton';
          var balance = '0';
          console.log(error);
        } else {
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
        }
    
        var chaindl = 'nooverlay';
        var chaindlbtn = 'nobtn';
    
        var balance = info;
    
        if (balance <= 0) {
          balance = 0;
        }
    
      client.getTransaction(`${urltx}`, function (err, txinfo, resHeaders) {
        if (err) {
          console.log(err);
          var offline = 'offlineoverlay';
          var offlinebtn = 'offlinebutton';
          var txinfo = '';
          var blockhash = '';
        } else {
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
          
          blockhash = txinfo.blockhash;

        }

        //var blockhash = txinfo.blockhash;

        client.getBlock(`${blockhash}`, function (err, blockinfo, resHeaders) {
          if (err) {
            console.log(err);
            var offline = 'offlineoverlay';
            var offlinebtn = 'offlinebutton';
            var blockinfo = '';
          } else {
            var offline = 'onlineoverlay';
            var offlinebtn = 'onlinebutton';        
          }  

    
      client.walletStatus(function (err, ws, resHeaders) {
        if (err) {
          console.log(err);
          var offline = 'offlineoverlay';
          var offlinebtn = 'offlinebutton';
          var ws = '';
          var walletstatuss = 'locked';
          var sendicon = 'display: none !important';
        } else {
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
    
          var walletstatuss = ws.wallet_status;
          var sendicon;
          
          if (walletstatuss == 'stakingonly') {
            sendicon = 'display: none !important';
          } else if (walletstatuss == 'unlocked') {
            sendicon = 'display: visible !important;';
          } else if (walletstatuss == 'unencrypted') {
            sendicon = 'display: visible !important';
          } else if (walletstatuss == 'locked') {
            sendicon = 'display: none !important';
          }
        }
    
      client.getStakingInfo(function (error, stakeinfo, resHeaders) {
    
            if (error) {
              var enabled = 'Node Offline';
              var staking = 'Node Offline';
              var yourweight = 'Node Offline';
              var netweight = 'Node Offline';
              var expected = 'Node Offline';
              var stakediff = 'Node Offline';
        
              var offline = 'offlineoverlay';
        
              var offlinebtn = 'offlinebutton';
        
              console.log(error);
        
            } else {
              var enabled = stakeinfo.enabled;
              var staking = stakeinfo.staking;
              var yourweight = stakeinfo.weight;
              var netweight = stakeinfo.netstakeweight;
              var expected = stakeinfo.expectedtime;
              var stakediff = stakeinfo.difficulty;
        
              var offline = 'onlineoverlay';
              var offlinebtn = 'onlinebutton';
        
              var staketoggle;
              var enabletoggle;
        
              if (enabled == true) {
                enabletoggle = 'Configured';
              } else {
                enabletoggle = 'Disabled';
              }
        
              if (staking == true) {
                staketoggle = 'Staking';
              } else {
                staketoggle = 'Not Yet Staking';
              }
            }
    
        res.render('explore/gettx', { title: 'Transaction View', txinfo: txinfo, blockinfo: blockinfo, staketoggle: staketoggle, sendicon: sendicon, balance: balance, offline: offline, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn });
        });
    
      });
      });
      }); 
    });
};

//GET Get Block Information
exports.getblock = function (req, res) {

  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  if (isNaN(req.params.block) != true) {
    var blocknumber = req.params.block;

    //console.log('GOT BLOCK #: ', blocknumber);

  client.getBalance(function (error, info, resHeaders) {
    if (error) {
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var balance = '0';
      console.log(error);
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

    var chaindl = 'nooverlay';
    var chaindlbtn = 'nobtn';

    var balance = info;

    if (balance <= 0) {
      balance = 0;
    }

    client.getBlockByNumber(parseInt(blocknumber), function (err, blockinfo, resHeaders) {
      if (err) {
        console.log(err);
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var blockinfo = '';
      } else {
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';        
      } 

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
        sendicon = 'display: none !important';
      } else if (walletstatuss == 'unlocked') {
        sendicon = 'display: visible !important;';
      } else if (walletstatuss == 'unencrypted') {
        sendicon = 'display: visible !important';
      } else if (walletstatuss == 'locked') {
        sendicon = 'display: none !important';
      }
    }

  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

        if (error) {
          var enabled = 'Node Offline';
          var staking = 'Node Offline';
          var yourweight = 'Node Offline';
          var netweight = 'Node Offline';
          var expected = 'Node Offline';
          var stakediff = 'Node Offline';
    
          var offline = 'offlineoverlay';
    
          var offlinebtn = 'offlinebutton';
    
          console.log(error);
    
        } else {
          var enabled = stakeinfo.enabled;
          var staking = stakeinfo.staking;
          var yourweight = stakeinfo.weight;
          var netweight = stakeinfo.netstakeweight;
          var expected = stakeinfo.expectedtime;
          var stakediff = stakeinfo.difficulty;
    
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
    
          var staketoggle;
          var enabletoggle;
    
          if (enabled == true) {
            enabletoggle = 'Configured';
          } else {
            enabletoggle = 'Disabled';
          }
    
          if (staking == true) {
            staketoggle = 'Staking';
          } else {
            staketoggle = 'Not Yet Staking';
          }
        }

    res.render('explore/block', { title: 'Block View', blockinfo: blockinfo, staketoggle: staketoggle, sendicon: sendicon, balance: balance, offline: offline, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn });
    });

  });
  });
  });
    
  } else {
    var blockhash = req.params.block;
    //console.log('GOT BLOCK: ', blockhash);

    client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var balance = '0';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
      }
  
      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';
  
      var balance = info;
  
      if (balance <= 0) {
        balance = 0;
      }
  
      client.getBlock(`${blockhash}`, function (err, blockinfo, resHeaders) {
        if (err) {
          console.log(err);
          var offline = 'offlineoverlay';
          var offlinebtn = 'offlinebutton';
          var blockinfo = '';
        } else {
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';        
        }  
  
  
    client.walletStatus(function (err, ws, resHeaders) {
      if (err) {
        console.log(err);
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var ws = '';
        var walletstatuss = 'locked';
        var sendicon = 'display: none !important';
      } else {
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var walletstatuss = ws.wallet_status;
        var sendicon;
        
        if (walletstatuss == 'stakingonly') {
          sendicon = 'display: none !important';
        } else if (walletstatuss == 'unlocked') {
          sendicon = 'display: visible !important;';
        } else if (walletstatuss == 'unencrypted') {
          sendicon = 'display: visible !important';
        } else if (walletstatuss == 'locked') {
          sendicon = 'display: none !important';
        }
      }
  
    client.getStakingInfo(function (error, stakeinfo, resHeaders) {
  
          if (error) {
            var enabled = 'Node Offline';
            var staking = 'Node Offline';
            var yourweight = 'Node Offline';
            var netweight = 'Node Offline';
            var expected = 'Node Offline';
            var stakediff = 'Node Offline';
      
            var offline = 'offlineoverlay';
      
            var offlinebtn = 'offlinebutton';
      
            console.log(error);
      
          } else {
            var enabled = stakeinfo.enabled;
            var staking = stakeinfo.staking;
            var yourweight = stakeinfo.weight;
            var netweight = stakeinfo.netstakeweight;
            var expected = stakeinfo.expectedtime;
            var stakediff = stakeinfo.difficulty;
      
            var offline = 'onlineoverlay';
            var offlinebtn = 'onlinebutton';
      
            var staketoggle;
            var enabletoggle;
      
            if (enabled == true) {
              enabletoggle = 'Configured';
            } else {
              enabletoggle = 'Disabled';
            }
      
            if (staking == true) {
              staketoggle = 'Staking';
            } else {
              staketoggle = 'Not Yet Staking';
            }
          }
  
      res.render('explore/block', { title: 'Block View', blockinfo: blockinfo, staketoggle: staketoggle, sendicon: sendicon, balance: balance, offline: offline, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn });
      });
  
    });
    });
    });
  }
};

//GET for Peers Page
exports.peers = function (req, res) {
  //var username = req.user.email;

  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  client.getBalance(function (error, info, resHeaders) {
    if (error) {
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var balance = '0';
      console.log(error);
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

    var chaindl = 'nooverlay';
    var chaindlbtn = 'nobtn';

    var balance = info;

    if (balance <= 0) {
      balance = 0;
    }

  client.getPeerInfo(function (err, peers, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var peers = '';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

    }

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }

  client.getInfo(function (err, info, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var info = '';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';
    }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';
  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

        if (error) {
          var enabled = 'Node Offline';
          var staking = 'Node Offline';
          var yourweight = 'Node Offline';
          var netweight = 'Node Offline';
          var expected = 'Node Offline';
          var stakediff = 'Node Offline';
    
          var offline = 'offlineoverlay';
    
          var offlinebtn = 'offlinebutton';
    
          console.log(error);
    
        } else {
          var enabled = stakeinfo.enabled;
          var staking = stakeinfo.staking;
          var yourweight = stakeinfo.weight;
          var netweight = stakeinfo.netstakeweight;
          var expected = stakeinfo.expectedtime;
          var stakediff = stakeinfo.difficulty;
    
          var offline = 'onlineoverlay';
          var offlinebtn = 'onlinebutton';
    
          var staketoggle;
          var enabletoggle;
    
          if (enabled == true) {
            enabletoggle = 'Configured';
          } else {
            enabletoggle = 'Disabled';
          }
    
          if (staking == true) {
            staketoggle = 'Staking';
          } else {
            staketoggle = 'Not Yet Staking';
          }
        }

    res.render('account/peers', { title: 'Peers', peers: peers, info: info, staketoggle: staketoggle, sendicon: sendicon, balance: balance, offline: offline, offlinebtn: offlinebtn, chaindl: chaindl, chaindlbtn: chaindlbtn });
    });

  });
});
  });
  });
};

/**
 * POST /sendraw
 * Send Raw Transaction to D network
 */
exports.sendRaw = (req, res, next) => {
  var rawtx = req.body.rawtx;

  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        console.log(error);
      }

      var balance = info;

      client.sendRawTransaction(`${rawtx}`, function (error, tx, resHeaders) {
          if (error) {
              req.toastr.error('Insufficient Funds, Invalid Amount, or Transaction already exists!', 'Invalid!', { positionClass: 'toast-bottom-right' });
              //req.flash('errors', { msg: 'Insufficient Funds or Invalid Amount!' });
              return res.redirect('/rawtx');

          } else {

              var sendtx = tx;

              req.toastr.success(`Raw Transaction was sent successfully!`, 'Success!', { positionClass: 'toast-bottom-right' });
              req.flash('success', { msg: `Your raw transaction was sent successfully! TX ID: <a href="https://coinexplorer.net/D/transaction/${sendtx}" target="_blank">${sendtx}</a>` });
              return res.redirect('/rawtx');
          }
      });
})
};

/**
 * POST /importpriv
 * Import private key
 */
exports.importPriv = (req, res, next) => {
  var privkey = req.body.privkey;

  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        console.log(error);
      }

      var balance = info;

      client.importPrivKey(`${privkey}`, 'imported', false, function (error, success, resHeaders) {
          if (error) {
              req.toastr.error('Invalid Private Key or Wrong Format!', 'Invalid!', { positionClass: 'toast-bottom-right' });
              //req.flash('errors', { msg: 'Insufficient Funds or Invalid Amount!' });
              return res.redirect('/import');

          } else {

              req.toastr.success(`Imported private key successfully!`, 'Success!', { positionClass: 'toast-bottom-right' });
              return res.redirect('/import');
          }
      });
})
};

/**
 * POST /signmsg
 * Sign Denarius Message
 */
exports.signMsg = (req, res, next) => {
  //var username = req.user.email;
  var sendtoaddress = req.body.sendaddress;
  var msg = req.body.unsignedmsg;

  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        console.log(error);
      }

      var balance = info;

  var valid = WAValidator.validate(`${sendtoaddress}`, 'DNR'); //Need to update to D still

  if (valid) {

      client.signMessage(`${sendtoaddress}`, `${msg}`, function (error, signedmsghex, resHeaders) {
          if (error) {
              req.toastr.error('You dont own this address or an error occured!', 'Error!', { positionClass: 'toast-bottom-right' });
              //req.flash('errors', { msg: 'Insufficient Funds or Invalid Amount!' });
              return res.redirect('/sign');

          } else {

              var signed = signedmsghex;

              req.toastr.success(`Signed message successfully`, 'Success!', { positionClass: 'toast-bottom-right' });
              req.flash('success', { msg: `Your signed message <strong>${msg}</strong> is: <strong>${signed}</strong> signed with the address: <strong>${sendtoaddress}</strong>` });
              return res.redirect('/sign');
          }
      });

  } else {
      req.toastr.error('You entered an invalid Denarius (D) Address!', 'Invalid Address!', { positionClass: 'toast-bottom-right' });
      //req.flash('errors', { msg: 'You entered an invalid Denarius (D) Address!' });
      return res.redirect('/sign');
  }

});
};


/**
 * POST /verifymsg
 * Verify Denarius Message
 */
exports.verifyMsg = (req, res, next) => {
  //var username = req.user.email;
  var sendtoaddress = req.body.sendaddress;
  var msg = req.body.unsignedmsg;
  var signature = req.body.signature;

  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        console.log(error);
      }

      var balance = info;

  var valid = WAValidator.validate(`${sendtoaddress}`, 'DNR'); //Need to update to D still

  if (valid) {

      client.verifyMessage(`${sendtoaddress}`, `${signature}`, `${msg}`, function (error, signedmsghex, resHeaders) {
          if (error) {
              req.toastr.error('You dont own this address or an error occured!', 'Error!', { positionClass: 'toast-bottom-right' });
              //req.flash('errors', { msg: 'Insufficient Funds or Invalid Amount!' });
              return res.redirect('/verify');

          } else {

              var signed = signedmsghex;

              if (signed == true) {

                req.toastr.success(`Message is valid!`, 'Success!', { positionClass: 'toast-bottom-right' });
                req.flash('success', { msg: `Your message <strong>${msg}</strong> with signature: <strong>${signature}</strong> and the address: <strong>${sendtoaddress}</strong> is valid!` });
                return res.redirect('/verify');

              } else if (signed == false) {
                req.toastr.error('Message unable to be validated!', 'Message not verified!', { positionClass: 'toast-bottom-right' });
                return res.redirect('/verify');
              }
          }
      });

  } else {
      req.toastr.error('You entered an invalid Denarius (D) Address!', 'Invalid Address!', { positionClass: 'toast-bottom-right' });
      //req.flash('errors', { msg: 'You entered an invalid Denarius (D) Address!' });
      return res.redirect('/verify');
  }

});
};

/**
 * POST /search
 * Search Denarius Blockchain
 */
exports.search = (req, res, next) => {
  var searchreq = req.body.explorersearch;

  console.log('Search Request', searchreq)

  var regexpTx = new RegExp('[0-9a-zA-Z]{64}?');
  var regexpAddr = new RegExp('^(D)?[0-9a-zA-Z]{34}$'); //D Regular Expression for Addresses
  var scripthashregex = new RegExp('^(d)?[0-9a-zA-Z]{34}$'); // d Scripthash Addresses
  var regexpBlockNum = new RegExp('[0-9]{1,7}?'); // Blocks have same hash regex as TX...hmmm
  var regexpBlock = new RegExp('^[0][0-9a-zA-Z]{64}?'); // Blocks have same hash regex as TX...hmmm

  if (regexpAddr.test(searchreq) || scripthashregex.test(searchreq)) {
    //console.log("State of Address Test ", regexpAddr.test(searchreq))
    return res.redirect('/address/'+searchreq);
  } else if (regexpTx.test(searchreq)) {
    //console.log("State of TX Test ", regexpTx.test(searchreq))
    return res.redirect('/tx/'+searchreq);
  } else if (regexpBlockNum.test(searchreq)) {
    //console.log("State of Block Test ", regexpBlockNum.test(searchreq))
    return res.redirect('/block/'+searchreq);
  } else {
    req.toastr.error('Invalid Block #, Address, or Transaction Hash', 'Error!', { positionClass: 'toast-bottom-right' });
    return res.redirect('/')
  }

};

/**
 * POST /backupwallet
 * Backup Denarius Wallet
 */
exports.backupWallet = (req, res, next) => {
  var location = req.body.backuploc;

  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        console.log(error);
      }

      var balance = info;

      client.backupWallet(`${location}`, function (error, success, resHeaders) {
          if (error) {
              req.toastr.error('Invalid Location or Permission issue!', 'Error!', { positionClass: 'toast-bottom-right' });
              //req.flash('errors', { msg: 'Insufficient Funds or Invalid Amount!' });
              return res.redirect('/backup');

          } else {
              req.flash('success', { msg: `Your wallet was backed up successfully to <strong>${location}</strong>` });
              req.toastr.success(`Backup completed successfully!`, 'Success!', { positionClass: 'toast-bottom-right' });
              return res.redirect('/backup');
          }
      });
})
};

exports.getseed = (req, res, next) => {
var mnemonic;
let seedaddresses = [];

// Fetch the Kronos LevelDB
db.get('seedphrase', function (err, value) {
	if (err) {
		
		// If seedphrase does not exist in levelDB then generate one
		mnemonic = bip39.generateMnemonic();
		console.log("~Generated Denarius Mnemonic~ ", mnemonic);

		// Encrypt the seedphrase for storing in the DB
		var encryptedmnemonic = encrypt(mnemonic);
		console.log("Encrypted Mnemonic", encryptedmnemonic);

		// Put the encrypted seedphrase in the DB
		db.put('seedphrase', encryptedmnemonic, function (err) {
			if (err) return console.log('Ooops!', err) // some kind of I/O error if so
			//console.log('Inserted Encrypted Seed Phrase to DB');
		});

		//return mnemonic;

	} else {

		var decryptedmnemonic = decrypt(value);
		console.log("Decrypted Mnemonic", decryptedmnemonic);

		mnemonic = decryptedmnemonic;

		//return mnemonic;

	}


	console.log("Stored Denarius Mnemonic: ", mnemonic);

	//Convert our mnemonic seed phrase to BIP39 Seed Buffer 
	const seed = bip39.mnemonicToSeedSync(mnemonic);
	console.log("BIP39 Seed Phrase to Hex", seed.toString('hex'));
	
	// BIP32 From BIP39 Seed
	const root = bip32.fromSeed(seed);

	// Denarius Network Params Object
	const network = {
			messagePrefix: '\x19Denarius Signed Message:\n',
			bech32: 'd',
			bip32: {
				public: 0x0488b21e,
				private: 0x0488ade4
			},
			pubKeyHash: 0x1e,
			scriptHash: 0x5a,
			wif: 0x9e
	};

	// A for loop for how many addresses we want from the derivation path of the seed phrase
	//
	for (let i = 0; i < 10; i++) {

		//Get 10 Addresses from the derived mnemonic
		const addressPath = `m/44'/116'/0'/0/${i}`;

		// Get the keypair from the address derivation path
		const addressKeypair = root.derivePath(addressPath);

		// Get the p2pkh base58 public address of the keypair
		const p2pkhaddy = denarius.payments.p2pkh({ pubkey: addressKeypair.publicKey, network }).address;

		const privatekey = addressKeypair.toWIF();
	
		//New Array called seedaddresses that is filled with address and path data currently, WIP and TODO
		seedaddresses.push({ address: p2pkhaddy, privkey: privatekey, path: addressPath });
	}

	// Console Log the full array - want to eventually push these into scripthash hashing and retrieve balances and then send from them
	console.log("Seed Address Array", seedaddresses);

	//Emit to our Socket.io Server
	// io.on('connection', function (socket) {
	// 	socket.emit("seed", {seedaddresses: seedaddresses});
	// 	// setInterval(() => {
	// 	// 	socket.emit("seed", {seedaddresses: seedaddresses});
	// 	// }, 60000);		
	// });

});
};

exports.getSeed = (req, res) => {
  const ip = require('ip');
  const ipaddy = ip.address();

  res.locals.lanip = ipaddy;

  req.session.loggedin2 = false;

  client.walletStatus(function (err, ws, resHeaders) {
    if (err) {
      console.log(err);
      var offline = 'offlineoverlay';
      var offlinebtn = 'offlinebutton';
      var ws = '';
      var walletstatuss = 'locked';
      var sendicon = 'display: none !important';
    } else {
      var offline = 'onlineoverlay';
      var offlinebtn = 'onlinebutton';

      var walletstatuss = ws.wallet_status;
      var sendicon;
      
      if (walletstatuss == 'stakingonly') {
				sendicon = 'display: none !important';
			} else if (walletstatuss == 'unlocked') {
				sendicon = 'display: visible !important;';
			} else if (walletstatuss == 'unencrypted') {
				sendicon = 'display: visible !important';
			} else if (walletstatuss == 'locked') {
				sendicon = 'display: none !important';
			}
    }
  client.getStakingInfo(function (error, stakeinfo, resHeaders) {

      if (error) {
        var enabled = 'Node Offline';
        var staking = 'Node Offline';
        var yourweight = 'Node Offline';
        var netweight = 'Node Offline';
        var expected = 'Node Offline';
        var stakediff = 'Node Offline';
  
        var offline = 'offlineoverlay';
  
        var offlinebtn = 'offlinebutton';
  
        console.log(error);
  
      } else {
        var enabled = stakeinfo.enabled;
        var staking = stakeinfo.staking;
        var yourweight = stakeinfo.weight;
        var netweight = stakeinfo.netstakeweight;
        var expected = stakeinfo.expectedtime;
        var stakediff = stakeinfo.difficulty;
  
        var offline = 'onlineoverlay';
        var offlinebtn = 'onlinebutton';
  
        var staketoggle;
        var enabletoggle;
  
        if (enabled == true) {
          enabletoggle = 'Configured';
        } else {
          enabletoggle = 'Disabled';
        }
  
        if (staking == true) {
          staketoggle = 'Staking';
        } else {
          staketoggle = 'Not Yet Staking';
        }
      }
  client.getBalance(function (error, info, resHeaders) {
      if (error) {
        var offline = 'offlineoverlay';
        var offlinebtn = 'offlinebutton';
        var balance = '0';
        console.log(error);
      } else {
        var offline = 'onlineoverlay';
				var offlinebtn = 'onlinebutton';
      }

      var chaindl = 'nooverlay';
      var chaindlbtn = 'nobtn';

      var balance = info;

      if (balance <= 0) {
        balance = 0;
      }

      var mnemonic;
      var ps;
      let seedaddresses = [];
      let store = [];

      db.get('password', function(err, value) {
        if (err) {

        } else {
          var decryptedpass = decrypt(value);
          ps = decryptedpass;
        }

        // Fetch the Kronos LevelDB
        db.get('seedphrase', function (err, value) {
          if (err) {

          } else {
            var decryptedmnemonic = decrypt(value);
            mnemonic = decryptedmnemonic;
          }

          //Convert our mnemonic seed phrase to BIP39 Seed Buffer 
          const seed = bip39.mnemonicToSeedSync(mnemonic, ps);
          
          // BIP32 From BIP39 Seed
          const root = bip32.fromSeed(seed);

          // Denarius Network Params Object
          const network = {
              messagePrefix: '\x19Denarius Signed Message:\n',
              bech32: 'd',
              bip32: {
                public: 0x0488b21e,
                private: 0x0488ade4
              },
              pubKeyHash: 0x1e,
              scriptHash: 0x5a,
              wif: 0x9e
          };

          // A for loop for how many addresses we want from the derivation path of the seed phrase
          for (let i = 0; i < 21; i++) { //20

            //Get 10 Addresses from the derived mnemonic
            const addressPath = `m/44'/116'/0'/0/${i}`;

            // Get the keypair from the address derivation path
            const addressKeypair = root.derivePath(addressPath);

            // Get the p2pkh base58 public address of the keypair
            const p2pkhaddy = denarius.payments.p2pkh({ pubkey: addressKeypair.publicKey, network }).address;

            const privatekey = addressKeypair.toWIF();
          
            //New Array called seedaddresses that is filled with address and path data currently, WIP and TODO
            seedaddresses.push({ address: p2pkhaddy, privkey: privatekey, path: addressPath });
          }

          store.push({mnemonic: mnemonic, seedaddresses: seedaddresses});

          res.locals.seedphrase = store;
  
    res.render('account/getseed', {
        title: 'Denarius Seed Phrase',
        balance: balance,
        seedphrase: store,
        offline: offline,
        sendicon: sendicon,
        offlinebtn: offlinebtn,
        staketoggle: staketoggle,
        chaindl: chaindl,
        chaindlbtn: chaindlbtn
    });
  });
});
});
});
});
};
