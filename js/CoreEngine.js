$(document).ready(function () {
    var GoogleKey = "ENTER YOUR MAPS API KEY HERE";
    var pos = null;
    GetCLoc();
    
    function GetCLoc() {
        if (navigator.geolocation) {
            
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                PostMaps();
                ReloadRest();
            }, function () {
                alert("Desculpa mas... Você tem que ativar sua localização :P");
                GetCLoc();
            });
        }
        else{

        }
    }
    function PostMaps(str = "") {
        $.ajaxSetup({ async: false }); //sincroniza com o programa para o armazenamento dos dados
        var dataz = null;
        $.post("https://maps.googleapis.com/maps/api/place/textsearch/json?query=Restaurantes+em+Belo+Horizonte" + str + " &key=" + GoogleKey, function (data) {
            dataz = data;
        })
        $.ajaxSetup({ async: true });  //retorna a ser assincrono
        return dataz;
    }
    $('select').on('change', function (data) {
        $("#Restaurants").empty();
        ReloadRest();
    });

    $('button').on('click', function () {
        $("#Restaurants").empty();
        ReloadRest();
    });

    //diretamente do stackoverflow pq sim
    function calcCrow(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    function toRad(Value) {
        return Value * Math.PI / 180;
    }
    function ReloadRest() {
        console.log("Being called from " + arguments.callee.caller.toString());
        if ($('#SearchBar').val() != "") {
            var data = PostMaps("+de+" + $('#SearchBar').val());
            for (i = 0; i < data["results"].length; i++) {
                $("#Restaurants").append('<div class="col-md-4 ParentDiv"><div class="jumbotron card card-block restaurants_back" style="background-image:url(\'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + data["results"][i]["photos"][0]["photo_reference"] + '&key=' + GoogleKey + '"></div><div class="Main-Text"><h2 class="Main_Title">' + data["results"][i].name + '</h2><div id="Star_Rating' + i + '"></div><p></p></div></div></div>');
                $('#Star_Rating' + i).append('<h5>Avaliações: ' + data["results"][i].rating + ' </h5>')
                            /* for (j = 0; j < 5; j++) {
                    if (j <= data["results"][j].rating - 0.4) {
                        $('#Star_Rating' + i).append('</span><span class="fa fa-star checked"></span>');
                    }
                    else {
                        $('#Star_Rating' + i).append('<span class="fa fa-star"></span>');
                    }
                } */
                //codigo acima representa as estrelinhas de avaliação mas tem um bug então deixei de lado... talvez depois arrume
                 $('#Star_Rating' + i).append('<h5>Distancia: ' + calcCrow(pos.lat,pos.lng, data["results"][i]["geometry"].location["lat"],data["results"][i]["geometry"].location["lng"]) + ' Km </h5>')

            }
        }
        else if ($('#SelectTypeRest').find(":selected").text() != "") {
            var data = PostMaps("+de+Comida+" + $('#SelectTypeRest').find(":selected").text());
            for (i = 0; i < data["results"].length; i++) {
                $("#Restaurants").append('<div class="col-md-4 ParentDiv"><div class="jumbotron card card-block restaurants_back" style="background-image:url(\'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + data["results"][i]["photos"][0]["photo_reference"] + '&key=' + GoogleKey + '"></div><div class="Main-Text"><h2 class="Main_Title">' + data["results"][i].name + '</h2><div id="Star_Rating' + i + '"></div><p></p></div></div></div>');
                $('#Star_Rating' + i).append('<h5>Avaliações: ' + data["results"][i].rating + ' </h5>')
                $('#Star_Rating' + i).append('<h5>Distancia: ' + calcCrow(pos.lat,pos.lng, data["results"][i]["geometry"].location["lat"],data["results"][i]["geometry"].location["lng"]) + ' Km </h5>')

            }
        }
        else {
            var data = PostMaps();
            for (i = 0; i < data["results"].length; i++) {
                $("#Restaurants").append('<div class="col-md-4 ParentDiv"><div class="jumbotron card card-block restaurants_back" style="background-image:url(\'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + data["results"][i]["photos"][0]["photo_reference"] + '&key=' + GoogleKey + '"></div><div class="Main-Text"><h2 class="Main_Title">' + data["results"][i].name + '</h2><div id="Star_Rating' + i + '"></div><p></p></div></div></div>');
                $('#Star_Rating' + i).append('<h5>Avaliações: ' + data["results"][i].rating + ' </h5>')
                $('#Star_Rating' + i).append('<h5>Distancia: ' + calcCrow(pos.lat,pos.lng, data["results"][i]["geometry"].location["lat"],data["results"][i]["geometry"].location["lng"]) + ' Km </h5>')

            }
        }
    }
}); 
