var json;
var parsedIkonographien;
var ikonographienArray;
var chosenIkonographie;

function load() {
    var url = new Windows.Foundation.Uri("ms-appx:///data/data.json");
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {
        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {         
            var parsedObject = JSON.parse(text);
            json = parsedObject;          
        });
    });
};

function loadIkonographien() {
    var url = new Windows.Foundation.Uri("ms-appx:///data/exampledata.json");
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {
        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
            var parsedObject = JSON.parse(text);
            parsedIkonographien = parsedObject;
            var arr = new Array();
            for (let artefakt of parsedObject) {
                 arr.push([artefakt.Ikonographie]);               
            }
            ikonographienArray = arr;
            createWordCloud();     
        });
    });
};

function createWordCloud() {
    list = [];
    for (var i in ikonographienArray) {
        //random number for text size in word cloud
        var randomNumber = Math.floor((Math.random() * 50) + 10);
        var size = "" + randomNumber;
        list.push([ikonographienArray[i], size]);
    }

    WordCloud.minFontSize = "15px"
    WordCloud(document.getElementById('word_cloud'), {
        list: list,
        drawOutOfBound: false,
        click: function (item) {
            //item[0] is the word
            addIkonographie(item[0]);
            chosenIkonographie = item[0];
            //todo: ausgewähltes Wort hervorheben
           
        }
    });
}

function addIkonographie(ikonographie) {
    var parent = document.getElementById("ikono1");
    parent.innerHTML = "";
    parent.innerHTML = ikonographie;
 
}

function interactions() {
    var wordcloud = document.getElementById("feldname1");
    var options = {
        preventDefault: true
    };
    // document.body registers gestures anywhere on the page
    var hammer = new Hammer(wordcloud, options);
    hammer.get('swipe').set({
        direction: Hammer.DIRECTION_ALL
    });
    hammer.on("swipe", swiped);

    var backToWordcloud = document.getElementById("ikono1");
    var hammer2 = new Hammer(backToWordcloud);
    hammer2.get('swipe').set({
        direction: Hammer.DIRECTION_ALL
    });
    hammer2.on("swipe", stepback);
    //flip image
    //var image = document.getElementById("lb-container");
    //var hammer2 = new Hammer(image);
    //hammer2.get('swipe').set({
    //    direction: Hammer.DIRECTION_ALL
    //});
    //hammer2.on("swipe", stepback);
 }

function swiped(event) {
    //todo: Wort mit ziehen
    getPictures(chosenIkonographie);
}

function stepback(event) {
    var parent = document.getElementById("feldname1");
    var canvasTag = document.createElement("canvas");
    canvasTag.className += "word_cloud center-block";
    canvasTag.id = "word_cloud";
    canvasTag.width = "1100";
    canvasTag.height = "700";
    parent.appendChild(canvasTag);
    var myElement = document.getElementById('pinterest');
    myElement.innerHTML = "";
    document.getElementById("ikono1").innerHTML = "";
    createWordCloud();
}

    
function getPictures(clickedIkono) {
    var wordcloud = document.getElementById('feldname1');
    wordcloud.innerHTML = "";
 
    var myElement = document.getElementById('pinterest');
    myElement.innerHTML = "";

        //add pictures to div
    var zaehler = 0;
    var pictures = []

    for (let artefakt of json) {
        for (let ikono of artefakt.Ikonographie) {
            if (ikono == clickedIkono) {
                pictures.push(artefakt.Image);
            }
        }
    }
    console.log(pictures);
    for (let picture of pictures) {
        if (picture != undefined && !picture.includes("placeholder.svg")) {
            var a = document.createElement("a");
            a.href = picture;
            a.setAttribute('data-lightbox', 'pictureSet');

            var div = document.createElement("div");
            div.className += "wf-box";
            div.id = clickedIkono + zaehler;

            var img = document.createElement("img");
            img.src = picture;
            
            myElement.appendChild(div);
            div.appendChild(a);
            a.appendChild(img);
        }
                
        zaehler++;
    }

    var waterfall = new Waterfall({
        containerSelector: ".wf-container",
        boxSelector: ".wf-box"
    });
}

function removeDuplicates(arr) {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if (itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}  
function picInfo() {
    var pictures = [];
    for (let artefakt of json) {
        for (let ikono of artefakt.Ikonographie) {
            if (ikono == clickedIkono) {
                pictures.push(artefakt.Image);
            }
        }
    }
    var pictureInfo = [];
    for (let picture of pictures) {
        if (picture != undefined && !picture.includes("placeholder.svg")) {

            for (let artefakt of json) {
                if (picture == artefakt.Image) {
                    pictureInfo.push(artefakt.Sammlung);
                    pictureInfo.push(artefakt.Sachgruppe);
                }
            }
            var divFlipBack = document.getElementById("back");
            var p1 = document.createElement("p").innerHTML = pictureInfo[0];
            var p2 = document.createElement("p").innerHTML = pictureInfo[1];
          //  divFlipBack.parentNode.insertBefore(p1, divFlipBack.nextSibling);
        }
    }
}