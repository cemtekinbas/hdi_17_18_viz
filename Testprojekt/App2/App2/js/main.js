function load() {
    var url = new Windows.Foundation.Uri("ms-appx:///data/data.json");
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {

        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
            var parsedObject = JSON.parse(text);
            document.getElementById("feldname1").innerHTML = (parsedObject[0].Sammlung);
            document.getElementById("feldname2").innerHTML = (parsedObject[1].Sammlung);
            document.getElementById("feldname3").innerHTML = (parsedObject[2].Sammlung);
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