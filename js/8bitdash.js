var LANG = "english";
var goodMorning = {
	"english":"Good Morning",
  "german":"Guten Morgen",
	"spanish":"Buenos Días",
	"russian":"Доброе утро",
	"french":"Bonjour",
	"mandarin":"早上好",
	"japanese":"おはよう",
	"arabic":"صباح الخير",
	"hindi":"सुप्रभात",
	"korean":"좋은 아침",
	"italian":"Buongiorno",
}
var goodNight = {
	"english":"Good Night",
  "german":"Gute Nacht",
	"spanish":"Buenos Noches",
	"russian":"Доброй ночи",
	"french":"Bonne Nuit",
	"mandarin":"晚安",
	"japanese":"おやすみ",
	"arabic":"تصبح على خير",
	"hindi":"शुभ रात्रि",
	"korean":"안녕히 주무세요",
	"italian":"Buona Notte",
}
var goodAfternoon = {
	"english":"Good Afternoon",
  "german":"Guten Tag",
	"spanish":"Buenos Tardes",
	"russian":"Добрый день",
	"french":"Bon Après-midi",
	"mandarin":"下午好",
	"japanese":"こんにちは",
	"arabic":"مساء الخير",
	"hindi":"नमस्कार",
	"korean":"안녕하세요",
	"italian":"Buon Pomeriggio",
}
var goodEvening = {
	"english":"Good Evening",
  "german":"Guten Abend",
	"spanish":"Buenos Noches",
	"russian":"добрый вечер",
	"french":"Bonne Soirée",
	"mandarin":"晚上好",
	"japanese":"こんばんは",
	"arabic":"مساء الخير",
	"hindi":"गुड इवनिंग",
	"korean":"안녕하세요",
	"italian":"Buona Sera",
}
var sleepWell = {
	"english":"Good Night",
  "german":"Gute Nacht",
	"spanish":"Duerma Bien",
	"russian":"Спать хорошо",
	"french":"Dormez Bien",
	"mandarin":"睡得好",
	"japanese":"よく眠る",
	"arabic":"نم جيدا",
	"hindi":"अच्छे से सो",
	"korean":"숙면",
	"italian":"Dormi Bene",
}
var imageExtensions = ["gif", "png", "jpg", "jpeg", "webp"]

function listImages(folder, done) {
  chrome.runtime.getPackageDirectoryEntry(function(root) {
    root.getDirectory("images/" + folder, {}, function(dir) {
      var reader = dir.createReader()
      var names = []
      var readBatch = function() {
        reader.readEntries(function(batch) {
          if (!batch.length) {
            var images = []
            for (var i = 0; i < names.length; i++) {
              var ext = names[i].split(".").pop().toLowerCase()
              if (imageExtensions.indexOf(ext) !== -1) images.push(names[i])
            }
            images.sort()
            done(images)
            return
          }
          for (var i = 0; i < batch.length; i++) {
            if (batch[i].isFile) names.push(batch[i].name)
          }
          readBatch()
        })
      }
      readBatch()
    }, function() {
      done([])
    })
  })
}

var Dash = function() {

  var cr_kk = "<a target=\"_blank\" href=\"http://kirokaze.deviantart.com/\">Kirokaze</a>"
  var cr_nec = "<a target=\"_blank\" href=\"http://supernaught.itch.io/necromorph\">Necromorph</a> by Alphonsus (<a target=\"_blank\" href=\"https://twitter.com/alphnsus\">@alphnsus</a>) and Dave (<a target=\"_blank\" href=\"https://www.twitter.com/momorgoth\">@momorgoth</a>)"
  var cr_hld = "<a target=\"_blank\" href=\"http://www.heart-machine.com/\">heart-machine.com</a>"+ 
    "+ <a target=\"_blank\" href=\"http://www.twitter.com/heartmachinez\">@HeartMachineZ</a>"
  var cr_ms = "<a target=\"_blank\" href=\"http://www.antonkudin.me/megasphere/\">Megasphere</a>"+
    " by Anton Kudin (<a href=\"http://www.twitter.com/antonkudin\">@antonkudin</a>)"
  var cr_bs = "<a target=\"_blank\" href=\"http://bitslap.se/\">bitslap.se</a>"
  var cr_sg = "Sandy Gorden (<a target=\"_blank\" href=\"http://www.twitter.com/bandygrass\">@Bandygrass</a>)"
  var cr_ls = "<a target=\"_blank\" href=\"http://lennsan.tumblr.com/\">http://lennsan.tumblr.com</a>"
  var cr_mf = "Mark Ferrari"
  var cr_vb = "<a target=\"_blank\" href=\"http://www.valenberg.com/\">valenberg.com</a>"
  var cr_rw = "Rain World (<a target=\"_blank\" href=\"http://store.steampowered.com/app/312520/\">Steam</a>, <a target=\"_blank\" href=\"https://twitter.com/RainWorldGame\">Twitter</a>)"
  var cr_bp = "JayTKnox (<a target=\"_blank\" href=\"http://jayknoxart.tumblr.com\">jayknoxart.tumblr.com</a>, <a target=\"_blank\" href=\"https://twitter.com/JayTKnox\">@JayTKnox</a>)"
  var cr_itr = "<a target=\"_blank\" href=\"http://www.facebook.com/intotherift\">Into The Rift</a>"
  var cr_sl = "<a target=\"_blank\" href=\"http://www.wolfbrewgames.com/slain/\">Slain!</a>"
  var cr_zt = "<a target=\"_blank\" href=\"http://zedotagger.tumblr.com/\">Zedotagger</a>"

  var credits = {
    "iplayoldgames.gif":cr_kk,
    "metro_final.gif":cr_kk,
    "thieves.gif":cr_kk,
    "train.gif":cr_kk,
    "elderorc.gif":cr_kk,
    "player2.gif":cr_kk,
    "spaceport.gif":cr_kk,
    "cave.gif":cr_zt,
    "ground.gif": cr_zt,
    "lake.gif": cr_zt,
    "standing.gif": cr_zt,
    "slain1.gif":cr_sl,
    "slain2.gif":cr_sl,
    "slain3.gif":cr_sl,
    "bluebalcony.gif": cr_kk,
    "shootingstars.gif": cr_kk,
    "factory5.gif": cr_kk,
    "coffeeinrain.gif": cr_kk,
    "youngatnight.gif": cr_kk,
    "pilot.gif": cr_kk,
    "necromorph1.gif": cr_nec,
    "necromorph2.gif": cr_nec,
    "necromorph3.gif": cr_nec,
    "bebop.gif": cr_bp,
    "nighttrain.gif": cr_vb, 
    "lowlands.gif": cr_vb,
    "echoesfromneals.gif": cr_vb,
    "bicycle.gif": cr_vb,
    "blade.gif": cr_vb,
    "daftpunk.gif": cr_vb,
    "exodus.gif": cr_vb,
    "future.gif": cr_vb,
    "moon.png": cr_vb,
    "redbicycle.gif": cr_vb,
    "drift.gif": cr_vb,
    "ride.gif": cr_vb,
    "skate.gif": cr_vb,
    "streets.gif": cr_vb,
    "tv.gif": cr_vb,
    "barfly.gif": "Longshot", 
    "first.png": cr_ls,
    "second.png": cr_ls,
    "third.png": cr_ls,
    "fourth.gif": cr_ls,
    "fifth.gif": cr_ls,
    "moving.gif": cr_rw,
    "pups_fixed.gif": cr_rw,
    "sticks_and_stones.gif": cr_rw,
    "hyperlight.gif": cr_hld,
    "hyperlight2.gif": cr_hld, 
    "megasphere1.gif": cr_ms,
    "megasphere2.gif": cr_ms,
    "megasphere3.gif": cr_ms,
    "megasphere4.gif": cr_ms,
    "megasphere5.gif": cr_ms,
    "wizard.gif" : cr_sg,
    "gang.gif" : cr_sg,
    "darksouls.gif" : cr_sg, 
    "woods.png": "",
    "mockup.gif": cr_bs,
    "bitslap.gif": cr_bs,
    "asylumgate.gif": cr_bs,
    "nightcycle.gif": cr_bs, 
    "fireflyreboot.gif": cr_bs,
    "town.png":"http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
    "ironberg.png":"http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
    "forrest.png":"http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
    "leonard.png":"http://opengameart.org/content/whispers-of-avalon-grassland-tileset",
    "arkanos.png":"http://opengameart.org/content/mage-city-arcanos",
    "dungeon.gif":"http://opengameart.org/content/a-blocky-dungeon",
    "fire.gif":cr_mf,
    "swirling.gif":cr_mf,
    "cave.gif":cr_mf,
    "underwater.gif":cr_mf,
    "swamp.gif":cr_mf,
    "mountain.gif":cr_mf,
    "fortress.gif":cr_mf,
    "rain.gif":cr_mf,
    "town.gif":cr_mf,
    "bridge.gif":cr_mf,
    "falls.gif":cr_mf,
    "coast.gif":cr_mf,
    "dawn.gif":cr_mf,
    "northlights.gif":cr_mf,
    "lake.gif":cr_mf,
    "snow.gif":cr_mf,
    "bridge_raining.gif":cr_mf,
    "nature.gif": cr_mf,
    "castle.gif": cr_mf,
    "grandcanyon.gif": cr_mf,
    "sea.gif": cr_mf,
    "cyber.gif": "http://flexroman.tumblr.com/",
    "intotherift.gif": cr_itr,
    "intotherift2.gif": cr_itr,
    "intotherift3.gif": cr_itr
  }

  var modes = [
    "zedotagger",
    "landscapes",
    "slain",
    "kirokaze",
    "valenberg",
    "intotherift",
    "lennsan",
    "rainworld",
    "necromorph",
    "hyperlightdrifter",
    "megasphere",
    "bandygrass",
    "woods",
    "movies",
    "other",
    "cities",
    "gaming",
    "comic",
    "series",
    "ultimate",
    "more"
  ]

  var x = Math.random() * modes.length;

  this.curMode = modes[Math.floor(x)];
  this.curIndex = 0;
  this.files = [];
  this.loadToken = 0;
  this.modes = modes;

  // controllable via Dat.GUI
  this.showClock = true;
  this.showGreeter = true;
  this.theme = "landscapes"
  this.language = "english"

  this.changeLanguage = function(language) {
	  LANG = language;
	  updateClock();
  }
  
  this.changeCSS = function(imageURL) {
    var rule = document.styleSheets[0].cssRules[0];
    var postfix = "no-repeat center center fixed";
    var s = "url(" + imageURL + ") " + postfix;
    rule.style.background = s 
    rule.style.backgroundSize = "cover"
  }

  this.changeBackground = function(background) {
    console.log("Changing to " + background);
    this.changeCSS("images/" + background)
  }

  this.changeCredit = function(name) {
    console.log("Changing credit to " + name);
    var s = name;
    document.getElementById("footer").innerHTML = s; 
  }

  this.openMode = function(index) {
    var dash = this
    var token = ++this.loadToken
    var mode = this.curMode
    listImages(mode, function(images) {
      if (token !== dash.loadToken || mode !== dash.curMode) return
      dash.files = images
      if (!images.length) return
      if (index === undefined || index < 0 || index >= images.length) {
        dash.curIndex = Math.floor(Math.random() * images.length)
      } else {
        dash.curIndex = index
      }
      dash.updateBackground()
    })
  }

  this.updateBackground = function() {
    var file = this.files[this.curIndex]
    if (!file) return
    this.changeBackground(this.curMode + "/" + file);
    if(file in credits) {
      this.changeCredit(credits[file]);
    } else {
      this.changeCredit("Mention me @madewithtea to take credit for your art.")
    }
  } 

  this.nextBackground = function() {
    if (!this.files.length) return
    this.curIndex += 1;
    if(this.curIndex >= this.files.length) {
      this.curIndex = 0;
    }
    this.updateBackground();
  }

  this.previousBackground = function() {
    if (!this.files.length) return
    this.curIndex -= 1; 
    if(this.curIndex < 0) {
      this.curIndex = this.files.length - 1;
    }
    this.updateBackground();
  }

  this.initialize = function(basil) {
    // read the configuration
    this.basil = basil;
    
    var keys = basil.keys()
    if(keys.indexOf("mode2") != -1) {
      this.curMode = basil.get("mode2");
      console.log("loaded mode from saved settings")
    }

    if(keys.indexOf("language") != -1) {
      this.changeLanguage(basil.get("language"));
    }
    this.openMode();
  }

  this.changeMode = function(mode) {
    this.curMode = mode
    this.openMode(0);

    this.basil.set("mode2", mode);
    this.basil.set("done-tutorial", true);
  }
}

var updateClock = function() {
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    
    var greeting = ""
    if((0 <= currentHours) && (currentHours < 6)) {
		greeting = goodNight[LANG];
    }
    if((6 <= currentHours) && (currentHours < 12)) {
		greeting = goodMorning[LANG];
    }
    if((12 <= currentHours) && (currentHours < 18)) {
		greeting = goodAfternoon[LANG];	
    }
    if((18 <= currentHours) && (currentHours < 22)) {
		greeting = goodEvening[LANG];
    }
    if((22 <= currentHours) && (currentHours < 24)) {
		greeting = sleepWell[LANG];    
	}
    
    var currentMinutes = currentTime.getMinutes ( );
    var currentSeconds = currentTime.getSeconds ( );
  
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
  
    var timeOfDay = ( currentHours < 12 ) ? "am" : "pm";
  
    currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
    currentHours = ( currentHours == 0 ) ? 12 : currentHours;
  
    var currentTimeString = currentHours + ":" + currentMinutes + " " + timeOfDay;
    document.getElementById("clock").firstChild.nodeValue = currentTimeString;
    document.getElementById("greeting").firstChild.nodeValue = greeting 
  }

window.onload = function() {

  var dash = new Dash()
  var basil = new window.Basil(); 

  dash.initialize(basil) 
  var gui = new dat.GUI();
  dat.GUI.toggleHide();

  var defa = gui.addFolder('default');
  var languages = ["english", "german", "spanish", "russian", "french", 
  "mandarin", "japanese", "arabic", "hindi", "korean", "italian"];
  var languages = defa.add(dash, "language", languages);
  var themes = defa.add(dash, "theme", dash.modes);
  defa.open();

  languages.onChange(function(value) {
	  dash.changeLanguage(value);
      basil.set("language", value);
	  alertify.log("Saved settings")
  })

  themes.onChange(function(value) {
    dash.changeMode(value);
    alertify.log("Saved settings")
  })

  if(basil.keys().indexOf('done-tutorial') == -1) {
    alertify.log("Left and Right to change art. H for Settings.");
  }

  updateClock();
  setInterval(updateClock, 10000)

  document.addEventListener("keydown", function(event) {
    var tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      return;
    }
    if (event.key === "ArrowRight") {
      dash.nextBackground();
    } else if (event.key === "ArrowLeft") {
      dash.previousBackground();
    }
  });
}
