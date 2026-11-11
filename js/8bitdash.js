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

function creditHtml(credits, mode, file) {
  var specific = mode + "/" + file
  if (specific in credits) return credits[specific]
  var folder = mode + "/"
  if (folder in credits) return credits[folder]
}

function stepCatalog(modeIndex, imageIndex, imageCount, modeCount, dir) {
  if (dir > 0) {
    if (imageIndex + 1 < imageCount) {
      return { modeIndex: modeIndex, imageIndex: imageIndex + 1 }
    }
    return { modeIndex: (modeIndex + 1) % modeCount, imageIndex: 0 }
  }
  if (imageIndex > 0) {
    return { modeIndex: modeIndex, imageIndex: imageIndex - 1 }
  }
  return {
    modeIndex: (modeIndex - 1 + modeCount) % modeCount,
    imageIndex: "last"
  }
}

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

function listAllImages(modes, done) {
  var byMode = {}
  var pending = modes.length
  modes.forEach(function(mode) {
    listImages(mode, function(images) {
      byMode[mode] = images
      pending--
      if (pending === 0) done(byMode)
    })
  })
}

var Dash = function() {

  var cr_kk = "<a target=\"_blank\" href=\"https://www.deviantart.com/kirokaze\">Kirokaze</a>"
  var cr_nec = "<a target=\"_blank\" href=\"https://supernaught.itch.io/necromorph\">Necromorph</a> by Alphonsus (<a target=\"_blank\" href=\"https://bsky.app/profile/alphonsusdev.bsky.social\">@alphonsusdev</a>) and Dave (<a target=\"_blank\" href=\"https://x.com/momorgoth\">@momorgoth</a>)"
  var cr_hld = "<a target=\"_blank\" href=\"https://www.heartmachine.com/\">heartmachine.com</a>"+ 
    "+ <a target=\"_blank\" href=\"https://x.com/HeartMachineZ\">@HeartMachineZ</a>"
  var cr_ms = "<a target=\"_blank\" href=\"https://antonkudin.itch.io/megasphere\">Megasphere</a>"+
    " by Anton Kudin (<a target=\"_blank\" href=\"https://bsky.app/profile/antonkudin.bsky.social\">@antonkudin</a>)"
  var cr_bs = "<a target=\"_blank\" href=\"https://bitslap.itch.io/\">bitslap.itch.io</a>"
  var cr_sg = "Sandy Gorden (<a target=\"_blank\" href=\"https://x.com/Bandygrass\">@Bandygrass</a>)"
  var cr_ls = "<a target=\"_blank\" href=\"https://www.tumblr.com/lennsan\">https://www.tumblr.com/lennsan</a>"
  var cr_mf = "Mark Ferrari"
  var cr_vb = "<a target=\"_blank\" href=\"https://valenberg.tumblr.com/\">valenberg.tumblr.com</a>"
  var cr_fx = "<a target=\"_blank\" href=\"https://faxdoc.github.io/\">Emlise</a> (faxdoc)"
  var cr_rw = "Rain World (<a target=\"_blank\" href=\"https://store.steampowered.com/app/312520/\">Steam</a>, <a target=\"_blank\" href=\"https://x.com/RainWorldGame\">X</a>)"
  var cr_bp = "JayTKnox (<a target=\"_blank\" href=\"https://jayknoxart.com/\">jayknoxart.com</a>, <a target=\"_blank\" href=\"https://x.com/JayTKnox\">@JayTKnox</a>)"
  var cr_itr = "<a target=\"_blank\" href=\"https://www.facebook.com/intotherift\">Into The Rift</a>"
  var cr_sl = "<a target=\"_blank\" href=\"https://store.steampowered.com/app/369070/Slain_Back_from_Hell/\">Slain!</a>"
  var cr_zt = "<a target=\"_blank\" href=\"https://www.tumblr.com/zedotagger\">Zedotagger</a>"

  // "valenberg/" covers every file in that folder. "valenberg/shop.gif" covers that file and wins.
  var credits = {
    "zedotagger/": cr_zt,
    "landscapes/": cr_mf,
    "slain/": cr_sl,
    "kirokaze/": cr_kk,
    "valenberg/": cr_vb,
    "faxdoc/": cr_fx,
    "intotherift/": cr_itr,
    "lennsan/": cr_ls,
    "rainworld/": cr_rw,
    "necromorph/": cr_nec,
    "hyperlightdrifter/": cr_hld,
    "megasphere/": cr_ms,
    "bandygrass/": cr_sg,
    "woods/": "",
    "movies/bebop.gif": cr_bp,
    "other/barfly.gif": "Longshot",
    "other/nightcycle.gif": cr_bs,
    "other/fireflyreboot.gif": cr_bs,
    "other/mockup.gif": cr_bs,
    "other/asylumgate.gif": cr_bs,
    "other/bitslap.gif": cr_bs,
    "other/town.png": "http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
    "other/ironberg.png": "http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
    "other/forrest.png": "http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
    "other/leonard.png": "http://opengameart.org/content/whispers-of-avalon-grassland-tileset",
    "other/arkanos.png": "http://opengameart.org/content/mage-city-arcanos",
    "other/dungeon.gif": "http://opengameart.org/content/a-blocky-dungeon",
    "other/forrest.gif": cr_mf,
    "gaming/hyperlight.gif": cr_hld,
    "gaming/hyperlight2.gif": cr_hld,
    "gaming/cyber.gif": "http://flexroman.tumblr.com/",
    "more/iplayoldgames.gif": cr_kk,
    "more/castle.gif": cr_mf,
    "more/cyber.gif": "http://flexroman.tumblr.com/"
  }
  this.credits = credits

  var modes = [
    "zedotagger",
    "landscapes",
    "slain",
    "kirokaze",
    "valenberg",
    "faxdoc",
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

  this.curMode = "";
  this.curIndex = 0;
  this.files = [];
  this.loadToken = 0;
  this.modes = modes;

  // controllable via Dat.GUI
  this.showClock = true;
  this.showGreeter = true;
  this.theme = this.curMode
  this.language = "english"

  this.changeLanguage = function(language) {
	  LANG = language;
	  updateClock();
  }
  
  this.changeCSS = function(imageURL) {
    var rule = document.styleSheets[0].cssRules[0];
    var postfix = "no-repeat center center fixed";
    var s = "#000 url(" + imageURL + ") " + postfix;
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
    this.loading = true
    listImages(mode, function(images) {
      if (token !== dash.loadToken) return
      dash.loading = false
      if (mode !== dash.curMode) return
      dash.files = images
      if (!images.length) return
      if (index === "last") {
        dash.curIndex = images.length - 1
      } else if (index === undefined || index < 0 || index >= images.length) {
        dash.curIndex = 0
      } else {
        dash.curIndex = index
      }
      dash.updateBackground()
    })
  }

  this.openRandom = function() {
    var dash = this
    var token = ++this.loadToken
    this.loading = true
    listAllImages(this.modes, function(byMode) {
      if (token !== dash.loadToken) return
      dash.loading = false
      var all = []
      for (var m = 0; m < dash.modes.length; m++) {
        var mode = dash.modes[m]
        for (var i = 0; i < byMode[mode].length; i++) {
          all.push({ mode: mode, file: byMode[mode][i] })
        }
      }
      if (!all.length) return
      var pick = all[Math.floor(Math.random() * all.length)]
      dash.curMode = pick.mode
      dash.theme = pick.mode
      if (dash.themeController) dash.themeController.updateDisplay()
      dash.files = byMode[pick.mode]
      dash.curIndex = dash.files.indexOf(pick.file)
      dash.updateBackground()
    })
  }

  this.applyStep = function(pos) {
    var mode = this.modes[pos.modeIndex]
    if (mode === this.curMode) {
      this.curIndex = pos.imageIndex === "last" ? this.files.length - 1 : pos.imageIndex
      this.updateBackground()
      return
    }
    this.curMode = mode
    this.theme = mode
    if (this.themeController) this.themeController.updateDisplay()
    this.openMode(pos.imageIndex)
  }

  this.updateBackground = function() {
    var file = this.files[this.curIndex]
    if (!file) return
    this.changeBackground(this.curMode + "/" + file);
    var html = creditHtml(credits, this.curMode, file)
    if (html !== undefined) {
      this.changeCredit(html);
    } else {
      this.changeCredit("Contact extension author to take credit for your art.")
    }
  } 

  this.nextBackground = function() {
    if (this.loading || !this.files.length) return
    var i = this.modes.indexOf(this.curMode)
    if (i < 0) i = 0
    this.applyStep(stepCatalog(i, this.curIndex, this.files.length, this.modes.length, 1))
  }

  this.previousBackground = function() {
    if (this.loading || !this.files.length) return
    var i = this.modes.indexOf(this.curMode)
    if (i < 0) i = 0
    this.applyStep(stepCatalog(i, this.curIndex, this.files.length, this.modes.length, -1))
  }

  this.initialize = function(basil) {
    // read the configuration
    this.basil = basil;
    
    var keys = basil.keys()
    if(keys.indexOf("language") != -1) {
      this.changeLanguage(basil.get("language"));
    }
    this.openRandom();
  }

  this.changeMode = function(mode) {
    this.curMode = mode
    this.openMode(0);

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

if (typeof window !== "undefined") window.onload = function() {

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
  dash.themeController = themes
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

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    stepCatalog: stepCatalog,
    creditHtml: creditHtml,
    credits: new Dash().credits
  }
}
