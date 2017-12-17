var json;

function load() {
    var url = new Windows.Foundation.Uri("ms-appx:///data/exampledata.json");
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {

        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
           
            var parsedObject = JSON.parse(text);
            json = parsedObject;
            var ikonographien = new Array(2);
            for (let artefakt of parsedObject) {
                for (let ikono of artefakt.Ikonographie) {             
                    if (ikonographien.indexOf(ikono) == -1) {
                        //für Word Cloud: wert und größe
                        ikonographien.push([ikono, "10"]);
                    }                            
                }  
            }
            list = [];
            for (var i in ikonographien) {
                list.push(ikonographien[i], ikonographien[i]);
            }

            WordCloud.minFontSize = "15px"
            WordCloud(document.getElementById('word_cloud'), { list: list });            
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
        var span = document.getElementById("feldname1");
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