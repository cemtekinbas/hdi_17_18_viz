var json;
var parsedIkonographien;
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
           
            list = [];
            for (var i in arr) {
                //random number for text size in word cloud
                var randomNumber = Math.floor((Math.random() * 50) + 10);
                var size = "" + randomNumber;
                list.push([arr[i], size]);
            }

            WordCloud.minFontSize = "15px"
            WordCloud(document.getElementById('word_cloud'), {
                list: list,
                drawOutOfBound: false,
                click: function (item) {
                    //item[0] is the word
                    getPictures(item[0]);
                    addIkonographie(item[0]);

                }
            });
        });
    });
};

function addIkonographie(ikonographie) {
    var parent = document.getElementById("ikono1");
    parent.innerHTML = "";
    parent.innerHTML = ikonographie;
}

function test() {
    var wordcloud = document.getElementById("feldname1");
    var mc = new Hammer(wordcloud);

    // listen to events...
    mc.on("swiperight", function (ev) {
        var span = document.getElementById("feldname2");
        document.getElementById("word_cloud").innerHTML = "";
        //add pictures to div
             
    });

    /*if (mc.on("tap") == "tap") {

    }*/
}

function getPictures(clickedIkono) {
    var myElement = document.getElementById('pinterest');
    myElement.innerHTML = "";

        //add pictures to div
    var zaehler = 0;
    var pictures = [];
    for (let artefakt of json) {
        for (let ikono of artefakt.Ikonographie) {
            if (ikono == clickedIkono) {
                pictures.push(artefakt.Image);
            }
        }
    }

    for (let picture of pictures) {
        if (picture != undefined && !picture.includes("placeholder.svg")) {
            
            var div = document.createElement("div");
            div.className += "wf-box";
            div.id = clickedIkono + zaehler;
            var img = document.createElement("img");
            img.src = picture;
            div.appendChild(img);

            myElement.appendChild(div);
        }
                
        zaehler++;
    }

    var waterfall = new Waterfall({
        containerSelector: ".wf-container",
        boxSelector: ".wf-box"
    })
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