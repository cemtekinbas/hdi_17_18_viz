var json;

function load() {
    var url = new Windows.Foundation.Uri("ms-appx:///data/data.json");
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {

        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
           
            var parsedObject = JSON.parse(text);
            json = parsedObject;
            var ikonographien = new Array();
            for (let artefakt of parsedObject) {
                for (let ikono of artefakt.Ikonographie) {             
                    if (ikonographien.indexOf(ikono) == -1) {
                        ikonographien.push([ikono]);
                    }                            
                }  
            }
            arr = removeDuplicates(ikonographien);
            list = [];
            for (var i in arr) {
                //random number for text size in word cloud
               // var randomNumber = Math.floor((Math.random() * 30) + 10);
               //var size = "" + randomNumber;
                list.push([arr[i],"30"]);
            }
            
            var string = "";
            WordCloud.minFontSize = "15px"
            WordCloud(document.getElementById('word_cloud'), {
                list: list,
                click: function (item) {
                    //item[0] is the word
                    getPictures(item[0]);              
                }
            });                          
        });
    });

};


function test() {
    var myElement = document.getElementById('word_cloud');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);

    // listen to events...
    mc.on("panleft panright tap press", function (ev) {
        var span = document.getElementById("feldname2");
        document.getElementById("word_cloud").innerHTML = "";
        //add pictures to div
        var zaehler = 0;
        for (let picture of json) {
            if (picture.Image != undefined && !picture.Image.includes("placeholder.svg")) {        
                var img = document.createElement("img");
                img.src = (picture.Image);
                img.id = zaehler;
                img.alt = zaehler;
                img.width = "50";
                span.appendChild(img);              
            }
            zaehler++;
            
        }            
    });

    /*if (mc.on("tap") == "tap") {

    }*/
}

function getPictures(clickedIkono) {
    var myElement = document.getElementById('feldname1');
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
            var img = document.createElement("img");
            img.src = (picture);
            img.id = clickedIkono+zaehler;
            img.width = "50";
            myElement.appendChild(img);
        }
        zaehler++;
    }

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