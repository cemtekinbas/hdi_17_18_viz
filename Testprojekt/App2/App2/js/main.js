function load() {
    var url = new Windows.Foundation.Uri("ms-appx:///data/data.json");
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {

        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
            var parsedObject = JSON.parse(text);
            var ikonographien = [];
            var string = " ";
            for (let artefakt of parsedObject) {
                for (let ikono of artefakt.Ikonographie) {
                    if (ikonographien.indexOf(ikono) == -1) {
                        ikonographien.push(ikono);
                    }
                }                  
            }
            
            //only to show array elements       
            for (let iko of ikonographien) {
                string = string.concat(iko, " ");
            }
            document.getElementById("feldname1").innerHTML = string;

            //add pictures to div
            var zaehler = 0;
            for (let picture of parsedObject) {               
                 var img = document.createElement("img");
                 img.src = (picture.Image);
                img.id = zaehler;
                img.alt = zaehler;
                img.width = "50";
                var foo = document.getElementById("feldname2");
                foo.appendChild(img);
                zaehler++;
            }

           // document.getElementById("feldname2").innerHTML = (parsedObject[1].Sammlung);
            //document.getElementById("feldname3").innerHTML =(parsedObject[2].Sammlung);
        });
    });

};


function test() {
    var myElement = document.getElementById('feldname1');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);

    // listen to events...
    mc.on("panleft panright tap press", function (ev) {
        var span = document.getElementById("feldname1");
        span.style.fontSize = "50px";
    });

    if (mc.on("tap") == "tap") {

    }
}