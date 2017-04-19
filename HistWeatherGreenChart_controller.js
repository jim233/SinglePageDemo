(function () {
    angular.module('syngentaHistWeatherGreen')
    .controller('HistDataController', DataCtrl);
    DataCtrl.$inject = ['$scope', '$window', '$location', '$timeout', 'OrderApi'];//'$routeProvider',
    function DataCtrl($scope, $window, $location, $timeout, OrderApi) {//$routeProvider,

        var pageURL = $location.$$absUrl;

        //pageURL = 'https://agricast.syngenta.com/AngularJS/HistWeatherGreenChart.html?language=en&country=GB&lat=51.5074&long=0.1278&colorBg1=00693C&colorBg2=69BE28&placeName=London&stationName=Lat:53.75000,Long:7.75000&stationLatitude=53.75&stationLongitude=7.75&altitude=1';

        var myTemperAndNiederChart = echarts.init(document.getElementById('temperAndNiederDiv'));

        $scope.Title = "Historical Weather";

        var pub = "glbsip03p";

        var countryCode = "DE";
        var language = "de";
        var culture = language + "-" + countryCode;

        $scope.flag = 0;

        var pubname = 'geotroll1';
        var pubnameGreen = 'greencast';
        var servicepage = 'HistoryData_ECMWF';
        var servicepage2 = "weathercast";
        var moduleName = 'HistoricDiseaseUK';
        var unit = 'metric';
        var latitude = 53.63333;
        var longitude = 7.81666;
        var placeName = 'Berdum';
        var stationName = 'Lat:53.75000,Long:7.75000';
        var stationLatitude = 53.75;
        var stationLongitude = 7.75;
        var altitude = 1;
        var altitude2 = 177;
        var maxAllowedDistance = 300;
        var maxDistanceDiff = 1200;
        var maxDistanceDiff2 = 100
        var maxAltitudeDiff = 1200;
        var maxAltitudeDiff2 = 250;
        var resultCount = 20;
        var DayOffset = 0;
        var iDstOn = 0;
        var SunSet = '';
        var SunRise = '';
        var startDate = '';
        var endDate = '';
        var startDateGreen = '23/12/2015';
        var endDateGreen = '18/08/2016';
        var during = '1W';
        var aggregation = 'daily';
        var locAltitude = 3;
        var accumulation = false;
        var comparisionYearMax = 2016;
        var comparisionYearMin = 2016;
        var seriesChioce = 'Temperature & Rain';
        var checkedSeries = "";
        var domain = '';
        var locationText = "";
        var latLngInsdEmpyLocation = "";
        var userName = "";
        $scope.numberOfDays = 5;
        var loadFromLocal = false;
        $scope.resultShow = false;
        $scope.model = {};
        $scope.model.weatherstation = {};
        $scope.SearchLocationText = '';

        $scope.DurationData = [{ 'key': '1D', 'name': '1 Day' }, { 'key': '5D', 'name': '5 Days' }, { 'key': '1W', 'name': '1 week' }, { 'key': '10D', 'name': '10 Days' }, { 'key': '2W', 'name': '2 weeks' }, { 'key': '1M', 'name': '1 Month' }, { 'key': '3M', 'name': '3 Months' }, { 'key': '6M', 'name': '6 Months' }, { 'key': '1Y', 'name': '1 Year' }, { 'key': '', 'name': 'To specific date' }, { 'key': 'Last_date', 'name': 'To last date' }];
        $scope.AggregationData = [{ 'name': 'daily' }, { 'name': 'weekly' }, { 'name': '10-day' }, { 'name': 'monthly' }];
        $scope.SeriesChioceData = [{ 'name': 'Temperature & Rain' }, { 'name': 'Temperature Extremes' }, { 'name': 'Temperature Average' }, { 'name': 'Precipitation' }];
        $scope.model = {};
        $scope.model.selected = $scope.AggregationData[0];
        $scope.model.selectedTwo = $scope.DurationData[2];
        $scope.model.selectedSeries = $scope.SeriesChioceData[0];


        $scope.colorBack = "#82c8dc";
        //$scope.styleTab = { 'background-color': $scope.colorBack };
        $scope.FileUrl = "#";
        //$scope.txt_SelectLocationLabel = "Select your location to see the historical weather";
        $scope.txt_SelectLocation = "Wählen Sie Ihren Standort um das präzise Wetter zu sehen";
        $scope.lblDistText = "Prognosen für Entfernung km von London City Airport, m ü.d.M. ";
        //$scope.lblDistText = "Forecast for Distance km  of Paris, Alt.  m ";
        $scope.placeForChartTitle = "London";
        $scope.Input_the_location = "Select your location";
        $scope.txt_AnfangsdatumLabel = "Anfangsdatum";
        $scope.txt_DauerLabel = "Dauer";
        $scope.txtAggregationLabel = "Anhäufung";
        $scope.txtLocationLabel = "Location";
        $scope.txtMeterLabel = "meter";
        $scope.Input_the_location = "Mein Standort";
        $scope.loading = domain + 'Images/loading.gif';
        $scope.visiblechart = true;
        $scope.LoadingLocationVisible = true;
        $scope.FieldTableVisible = true;
        $scope.loaddFromURL = false;
        $scope.toShowLoadingDisplay = { "display": "block" };
        $scope.toShowLoadingDisplay2 = { "display": "none" };
        $scope.iconTitle = "Use the checkboxes below to Add or remove layers from the chart, then click Refresh to display your changes";

        $scope.toLoadingDisplay = function () {
            if ($scope.loaddFromURL == true) {
                $scope.toShowLoadingDisplay = { "display": "none" };
            }
        };
        //$scope.toNotSelectStartDate = "Start Date cannot be empty";
        //$scope.TemperaturForyAxis = "Air temperature";
        //$scope.PrecipitationsForyAxis = "Precipitations";
        $scope.getTranslatedText = function (culture, pub) {
            OrderApi.getTranslatedText(culture, pub).then(function (resp) {
                $scope.textStr = resp;
                $scope.txt_SelectLocation = resp[0].Value;

                $scope.lblDistTextTemplate = resp[4].Value;
                $scope.SearchLocationLabel = resp[5].Value;
                $scope.CancelLabel = resp[6].Value;
                $scope.Input_the_location = resp[9].Value;
                $scope.Forecast_for = resp[10].Value;
                $scope.NoDataFound = resp[11].Value;
                //error message for not found city or lat/long
                $scope.txt_errMsg1 = resp[12].Value;
                $scope.txt_errMsg2 = resp[13].Value;
                $scope.ApplyChart = resp[15].Value;
                $scope.Aply = $scope.ApplyChart.split(" ")[0];
                $scope.txt_AnfangsdatumLabel = resp[16].Value;
                $scope.txt_DauerLabel = resp[18].Value;
                $scope.txtAggregationLabel = resp[19].Value;
                $scope.txtLocationLabel = resp[20].Value;
                $scope.txtSeries = resp[21].Value;
                $scope.txtClearSection = resp[22].Value;
                $scope.txtExcel = resp[23].Value;
                $scope.txtMeterLabel = resp[24].Value;
                $scope.NoDataTooltip = resp[26].Value;
                $scope.SelectTipSuccess = resp[27].Value;//"to select one or more chioces!"
                $scope.toNotSelectStartDate = resp[28].Value; //"Start Date cannot be empty";
                $scope.TemperaturForyAxis = resp[29].Value; //Air temperature;
                $scope.PrecipitationsForyAxis = resp[30].Value; //Precipitations;
                $scope.Cumulative_temperature = resp[31].Value;
                $scope.Cumulative_precipitations = resp[32].Value;
                //$scope.iconTitle = resp[36].Value;
                $scope.endDate_NotEmpty = resp[39].Value; // end date cannot be empty;
                //$scope.select_HistoricalDisease = resp[40].Value; //select your location to see the historical disease
                $scope.Export_Image = resp[42].Value;
                $scope.refresh_chart = resp[43].Value;
                $scope.loaddFromURL = true;
                $scope.toLoadingDisplay();

            }, function (err) {
                $scope.failed = true;
            })
            $scope.GetCity();
        };

        $scope.getDropdownTranslation = function () {
            OrderApi.getDropdownTranslation(culture, pub).then(function (resp) {
                $scope.textSrq = resp;
                $scope.DurationData = resp[0].Values;
                $scope.AggregationData = resp[1].Values;

                $scope.model.selected = $scope.AggregationData[0];
                $scope.model.selectedTwo = $scope.DurationData[2];

            }, function (err) {
                $scope.failed = true;
            })
        };

        $scope.getURLParams = function () {
            var urlArray = pageURL.split('?');
            isLoadFromUrl = urlArray.length == 2;
            if (isLoadFromUrl == true) {
                var keyValues = urlArray[1].replace('#/', '#').split('&');
                var returnValue = {};
                for (var i = 0; i < keyValues.length; i++) {
                    var p = keyValues[i].split('=');
                    returnValue[p[0].toLowerCase()] = p[1];
                }
                return returnValue;
            }

        };

        $scope.URLValues = $scope.getURLParams();

        culture = $scope.URLValues.language + '-' + $scope.URLValues.country;
        language = $scope.URLValues.language;
        countryCode = $scope.URLValues.country;
        latitude = $scope.URLValues.lat;
        longitude = $scope.URLValues.long;


        $scope.colorBack1 = $scope.URLValues.colorbg1;
        //$scope.styleTab1 = { 'background-color': $scope.colorBack1 };
        $scope.colorBack2 = $scope.URLValues.colorbg2;
        //$scope.styleTab2 = { 'background-color': $scope.colorBack2 };
        var colorBackReg = /^[0-9a-fA-f]+$/;
        if (colorBackReg.test($scope.colorBack1)) {
            var colorInputstring = $scope.colorBack1;
            var NewColorInput = '#' + colorInputstring;
            $scope.InputColorParameter = NewColorInput;
            $scope.styleTab1 = { 'background-color': $scope.InputColorParameter };
        }
        else {
            $scope.InputColorParameter = $scope.colorBack1;
            $scope.styleTab1 = { 'background-color': $scope.InputColorParameter };
        }

        if (colorBackReg.test($scope.colorBack2)) {
            var colorInputstring = $scope.colorBack2;
            var NewColorInput = '#' + colorInputstring;
            $scope.InputColorParameter = NewColorInput;
            $scope.styleTab2 = { 'background-color': $scope.InputColorParameter };
            $scope.styleTab2Color = { 'color': $scope.InputColorParameter };
        }
        else {
            $scope.InputColorParameter = $scope.colorBack2;
            $scope.styleTab2 = { 'background-color': $scope.InputColorParameter };
            $scope.styleTab2Color = { 'color': $scope.InputColorParameter };
        }

        $scope.SearchLocationText = latitude + "," + longitude;
        $scope.Latitude = latitude;
        $scope.Longitude = longitude;

        //code copied from controller_index.js start
        $scope.getCookieVal = function (offset) {
            var endstr = document.cookie.indexOf(";", offset);
            if (endstr == -1)
                endstr = document.cookie.length;
            return unescape(document.cookie.substring(offset, endstr));
        };

        $scope.GetCookie = function (name) { //get data from cookie
            var arg = name + "=";
            var alen = arg.length;
            var clen = document.cookie.length;
            var i = 0;
            while (i < clen) {
                var j = i + alen;
                if (document.cookie.substring(i, j) == arg)
                    return $scope.getCookieVal(j);
                i = document.cookie.indexOf(" ", i) + 1;
                if (i == 0) break;
            }
            return null;
        };
        $scope.getParamFromCookie = function (a) {
            var queryKeyValues = a.replace('#/', '#').split('&');
            var b = {};
            for (var i = 0; i < queryKeyValues.length; i++) {
                var p = queryKeyValues[i].split('=', 2);
                b[p[0].toLowerCase()] = decodeURIComponent(p[1]);
                if (queryKeyValues[i].indexOf("securitykey") != -1) {
                    b[p[0].toLowerCase()] = queryKeyValues[i].substr(queryKeyValues[i].indexOf("=") + 1)
                }
            }
            return b;
        }

        $scope.detectmob = function () {
            var agent = $window.navigator.userAgent;
            return (agent.match(/Android/i) || agent.match(/webOS/i) || agent.match(/iPhone/i) || agent.match(/iPad/i) || agent.match(/iPod/i) || agent.match(/BB10/i) || agent.match(/playbook/i) || agent.match(/Linux/i) || agent.match(/Macintosh/i) || agent.match(/Windows Phone/i));
        };

        //get placeName and countryCode from api
        $scope.getPlaceNameAndCountry = function (lat, long) {
            OrderApi.getPlaceNameAndCountryByLatAndLong(lat, long).then(function (resp) {
                $scope.placeName = resp.Name;
                if ($scope.URLValues.country != resp.CountryCode) {
                    $scope.Latitude = $scope.URLValues.lat;
                    $scope.Longitude = $scope.URLValues.long;
                    $scope.placeName = "";
                }
                if ($scope.placeName == undefined || $scope.placeName == "") {
                    $scope.SearchLocationText = $scope.Latitude + "," + $scope.Longitude;
                } else {
                    $scope.SearchLocationText = $scope.placeName;
                }

                $scope.getTranslatedText(culture, pub);

            }, function (err) {
                $scope.failed = true;
            })
        };

        $scope.getMobNavData = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        $scope.LocLatitude = pos.coords.latitude;    //get local latitude
                        $scope.LocLongitude = pos.coords.longitude;   //get local longitude
                        loadFromLocal = true;
                        $scope.getPlaceNameAndCountry($scope.LocLatitude, $scope.LocLongitude);
                    }, function (error) {

                        $scope.getTranslatedText(culture, pub);

                    })
            }
        };

        //Translate the text in different language.
        $scope.setTranslateText = function () {
            if ($scope.lblDistTextTemplate == undefined) return;
            var locText = $scope.lblDistTextTemplate.replace('{Elevation}', $scope.Altitude);
            var Forecast_for = $scope.Forecast_for.replace('{StationName}', $scope.station_Name)
            var locText1 = locText.replace('{Dist}', $scope.DistanceKm);

            var locText2 = locText1.replace('{Dir}', $scope.WindDirection);
            if ($scope.SearchLocationText == "" || $scope.SearchLocationText == null || document.getElementById('txtInput').value == "") {

                var locText3 = locText2.replace('{CityName}', latLngInsdEmpyLocation);
                $scope.placeForChartTitle = latLngInsdEmpyLocation;
                //var cc = latLngInsdEmpyLocation.split(",");
                //$scope.placeForChartTitle = "lat: " + cc[0] + "," + "long: " + cc[1];
            } else {

                var locText3 = locText2.replace('{CityName}', $scope.SearchLocationText);
                $scope.placeForChartTitle = $scope.SearchLocationText;

            }

            $scope.lblDistText = Forecast_for + " " + $scope.station_Name + " " + locText3;
            if ($scope.placeForChartTitle == undefined) {
                $scope.placeForChartTitle = "";
            }
        };
        //$scope.toShowLastDate = false;



        $scope.getHight = { 'min-height': '75px' };
        $scope.UpdateAggregationDetails = function (item) {
            aggregation = $scope.model.selected.Key;
            $scope.getSeries();
        }
        $scope.flag2 = 0;
        var Promise = window.Promise
        $scope.UpdateSeriesChiocesDetails = function (item) {
            //function 0
            function promiseCheck() {
                return new Promise(function(resolve, reject) {
                    function _check() {
                        if ($scope.flag2 == 0) {
                            seriesChioce = $scope.model.selectedSeries.ID;
                            view = $scope.model.selectedSeries.ID;
                            $scope.getSeries();
                            $scope.flag2 = 1;
                        }
                        setTimeout(function () {
                            if ($scope.flag == 1) {
                                $scope.flag2 = 0;
                                resolve();
                                //console.log("a1a1a1");
                            } else {
                                _check();
                            }
                        }, 10)
                    };
                    _check();
                })
            }
            function a2() {
                //console.log("a2a2a2");
                $scope.getEchartsToShow();
            };
            promiseCheck()
				.then(function () {
				    return a2();
				})

            //function 1
            //function a1(callback) {
            //    if ($scope.flag2 == 0) {
            //        seriesChioce = $scope.model.selectedSeries.ID;
            //        view = $scope.model.selectedSeries.ID;
            //        $scope.getSeries();
            //        $scope.flag2 = 1;
            //    }

            //    if ($scope.flag == 1) {
            //        $scope.flag2 = 0;
            //        callback();
            //    } else {
            //        setTimeout(function () { a1(callback); },10);
            //   }
            //};
            //function a2() {
            //    //console.log("a2a2a2");
            //    $scope.getEchartsToShow();
            //};
            //a1(a2);

            //function 2:
            //        seriesChioce = $scope.model.selectedSeries.ID;
            //        view = $scope.model.selectedSeries.ID;
            //        $scope.getSeries();
            //$scope.$watch('flag', function () {
            //    console.log('22222:' + $scope.flag)
            //    if ($scope.flag == 1) {
            //        setTimeout(function () { $scope.getEchartsToShow(); }, 50);
            //    }
            //})
            
            //function 3:
            //        seriesChioce = $scope.model.selectedSeries.ID;
            //        view = $scope.model.selectedSeries.ID;
            //        $scope.getSeries();
            //$timeout(function () {
            //    $scope.getEchartsToShow();
            //}, 1000);
            //setTimeout(function () { $scope.getEchartsToShow(); }, 0);
        };

        //Detect whether the device is mobile.
        $scope.detectmob = function () {
            var agent = $window.navigator.userAgent;
            return (agent.match(/Android/i) || agent.match(/webOS/i) || agent.match(/iPhone/i) || agent.match(/iPad/i) || agent.match(/iPod/i) || agent.match(/BB10/i) || agent.match(/playbook/i) || agent.match(/Linux/i) || agent.match(/Macintosh/i) || agent.match(/Windows Phone/i));
        };

        //Get the latitude and longitue from the input box.
        $scope.validateInput = function () {
            locationText = "";
            var location = $scope.SearchLocationText.split(',');
            if (location.length > 1) {

                $scope.Latitude = location[0];
                $scope.Longitude = location[1];
            }
            if ($scope.SearchLocationText != "") {
                $scope.DeleteX = "";
            }

        }

        //Input location, then press enter button, it will search city name.
        $scope.enterPress = function (e) {
            var e = e || window.event;
            if (e.keyCode == 13) {
                $scope.GetCity();
            }
        }

        //Click the green button to search location
        $scope.GetCity = function () {
            if ($scope.SearchLocationText == "") {
                //$('#searchlocation').disabled();
                //$('#locationList').disabled();

            }
            else {
                if ($scope.SearchLocationText.indexOf(',') > 0) {
                    if (isNaN($scope.Latitude) == false && isNaN($scope.Longitude) == false) {
                        // OrderApi.CheckLatLongForCountry($scope.Latitude, $scope.Longitude).then(function (resp) {

                        // $scope.LatLongCountrycode = resp.CountryCode.replace('\r\n', '');
                        // if ($scope.LatLongCountrycode == $scope.URLValues.country) {
                        OrderApi.getCityByLatAndLang($scope.Latitude, $scope.Longitude, pub).then(function (resp) {
                            if (loadFromLocal == false)

                                $scope.SearchLocationText = resp.LocationName;
                            if (resp.LocationName !== null) {
                                if (loadFromLocal) {
                                    $scope.BindLocation = $scope.placeName;
                                    latLngInsdEmpyLocation = resp.Lat + "," + resp.Long;
                                } else {
                                    $scope.placeName = resp.LocationName;
                                    latLngInsdEmpyLocation = resp.Lat + "," + resp.Long;
                                    $scope.BindLocation = resp.LocationName;
                                    $scope.locationList = [{ Name: resp.LocationName }];
                                    $scope.SearchLocationTextTwce = $scope.locationList[0];
                                }
                            } else {

                                latLngInsdEmpyLocation = $scope.Latitude + "," + $scope.Longitude;

                                if (loadFromLocal == false) $scope.placeName = "";
                            }
                            $scope.GetNearByStations();
                        }, function (err) {
                            $scope.failed = true;
                        });
                        // }
                        //else {
                        //    var resp = [];
                        //    var drpdown = { Name: $scope.NoDataFound };
                        //    resp.unshift(drpdown);
                        //    $scope.model.WeatherStationType = resp;
                        //    $scope.model.weatherstation.selected = resp[0];
                        //    $scope.SearchLocationText = "";
                        //}

                        //}, function (err) {
                        //    $scope.failed = true;
                        //});

                    }
                    else {
                        var resp = [];
                        var drpdown = { Name: $scope.NoDataFound };
                        resp.unshift(drpdown);
                        $scope.model.WeatherStationType = resp;
                        $scope.model.weatherstation = resp[0];
                        $scope.SearchLocationText = "";
                    }
                }
                else {
                    $('#locationList').modal('show');
                    $scope.visiblechart = false;
                    $scope.LoadingLocationVisible = true;
                    $scope.FieldTableVisible = true;
                    //if ($scope.SearchLocationText)
                    OrderApi.GetCity(countryCode, culture, $scope.SearchLocationText, pubname).then(function (resp) {
                        $scope.locationList = resp;


                        if (resp.length == 0) {
                            $scope.visiblechart = true;
                            $scope.FieldTableVisible = true;
                            $scope.LoadingLocationVisible = false;
                            $scope.LoadingLocation = $scope.NoDataFound;

                        }
                        else {


                            $scope.visiblechart = true;
                            $scope.FieldTableVisible = false;
                            $scope.LoadingLocationVisible = true;
                        }
                    }, function (err) {
                        $scope.failed = true;
                    });
                }
            }
        };

        //Select the fieldItem in modal box
        $scope.selectfieldItem = function (parameters) {
            if (parameters != undefined) {
                $scope.SearchLocationText = parameters.Name;
                locationText = parameters.Name;
                $scope.placeName = parameters.Name;
                //$scope.BindLocation = parameters.Name;
                $scope.Latitude = parameters.Latitude;
                $scope.Longitude = parameters.Longitude;

                latLngInsdEmpyLocation = parameters.Latitude + "," + parameters.Longitude;

                $scope.SearchLocationTextTwce = parameters;

                $scope.PlaceId = parameters.PlaceId;
            }
            if ($scope.detectmob()) {
                $('#locationList').modal('hide');
            }
            $scope.GetNearByStations();
        };

        //Get Weatherstation details in dropdownlist
        $scope.GetNearByStations = function () {
            OrderApi.GetNearByStations($scope.Latitude, $scope.Longitude, maxAllowedDistance, altitude, resultCount).then(function (resp) {
                $scope.model.WeatherStationType = resp;
                if (resp.length == 0) {
                    var DropNoDataFound = $scope.NoDataFound.split(',');
                    var DropNoDataFoundArray = DropNoDataFound[0];
                    var drpdown = { Name: DropNoDataFoundArray };
                    resp.unshift(drpdown);
                    $scope.model.weatherstation = resp[0];

                }
                else {
                    var defaultItem = resp[0];
                    if (loadFromLocal == true) {
                        $.each(resp, function (item) {
                            if (resp[item].Name == stationName) {
                                defaultItem = resp[item];
                            }
                        });
                    }

                    $scope.station_Name = defaultItem.Name;

                    $scope.SunRise = defaultItem.SunRise;
                    $scope.TimezoneOffset = defaultItem.TimezoneOffset;
                    $scope.DstOn = defaultItem.DstOn;
                    $scope.SunSet = defaultItem.SunSet;


                    $scope.Altitude = defaultItem.Altitude;
                    //document.getElementById('localAlti').value = $scope.Altitude;
                    $scope.DistanceKm = Math.round(defaultItem.DistanceKm);
                    $scope.stationLatitude = defaultItem.Latitude;
                    $scope.stationLongitude = defaultItem.Longitude;
                    //$scope.BearingDegrees = resp[0].BearingDegrees;
                    $scope.model.weatherstation = defaultItem;
                    $scope.GetWeatherForecast();

                    if ($scope.placeName == "") {
                        $scope.BindLocation = $scope.Latitude + "," + $scope.Longitude;
                    } else {
                        $scope.BindLocation = $scope.placeName;
                    }
                    stationName = $scope.station_Name;
                    //$scope.selectDiffCrop($scope.model.scropSelected);

                    // $scope.setTranslateText();
                    if (loadFromLocal == true) {
                        $scope.SearchLocationText = $scope.placeName;
                    }

                    loadFromLocal = false;

                }
            })

        };

        //Update the location details text on the page.
        $scope.UpdateLocationDetails = function (parameters) {

            var selected = parameters;

            $scope.Altitude = selected.Altitude;
            //document.getElementById('localAlti').value = $scope.Altitude;
            $scope.station_Name = selected.Name;
            $scope.DistanceKm = Math.round(selected.DistanceKm);
            $scope.stationLatitude = selected.Latitude;
            $scope.stationLongitude = selected.Longitude;

            $scope.SunRise = selected.SunRise;
            $scope.TimezoneOffset = selected.TimezoneOffset;
            $scope.DstOn = selected.DstOn;
            $scope.SunSet = selected.SunSet;

            stationName = $scope.station_Name;
            $scope.model.weatherstation = selected;
            if ($scope.SearchLocationText !== latLngInsdEmpyLocation && $scope.SearchLocationText !== locationText) {
                $scope.SearchLocationText = "";
            }
            $scope.GetWeatherForecast();
            // $scope.setTranslateText();
        };
        //Get Weatherforecast details via the dropdownlist
        $scope.GetWeatherForecast = function () {
            OrderApi.GetWeatherForecast(pub, servicepage2, unit, culture, countryCode, $scope.Latitude, $scope.Longitude, $scope.placeName,
                                        $scope.model.weatherstation.Name, $scope.stationLatitude, $scope.stationLongitude, altitude2, maxDistanceDiff2,
                                        maxAltitudeDiff2, userName, $scope.numberOfDays, $scope.SunRise, $scope.TimezoneOffset, $scope.DstOn, $scope.SunSet).then(function (resp) {
                                            $scope.weatherdetails = [];

                                            for (var i = 0; i < resp.length; i++) {
                                                $scope.WindDirection = resp[i].wind_text_direction;
                                            }
                                            $scope.setTranslateText();



                                            $scope.getEchartsToShow();
                                        }, function (err) {
                                            $scope.failed = true;
                                        });

        };

        $scope.DeleteX = "";
        $scope.closeModal = function () {
            if (locationText != $scope.SearchLocationText) {
                $scope.SearchLocationText = "";
                $scope.DeleteX = "DeleteX"
            }

            if ($scope.detectmob()) {
                $('#locationList').modal('hide');
            }

        };

        $scope.ModifyMaxHeightMobile = function () {
            var widthdevice = document.body.clientWidth;
            if (0 < widthdevice && widthdevice < 991) {

                $scope.ModifyMaxHeight = { 'max-height': '350px' };

            }
            else {
                $scope.ModifyMaxHeight = { 'max-height': '300px' };
            }
        }
        $scope.ModifyMaxHeightMobile();


        function GetLocations() {
            alert("In GetLocatios");
            return;
        };
        $scope.OpenDropdownlist = [];
        $scope.ClickToOpenDropdownlist = function (number) {
            if ($scope.OpenDropdownlist[number] == " ") {
                $scope.OpenDropdownlist[number] = "w--open";
            }
            else {
                $scope.OpenDropdownlist[number] = " ";
            }
        };

        //$scope.UpdateYearDateDetails = function (obj,number) {
        //    for (var i = 0; i < $scope.getYearDate.length; i++) {
        //        if (i == number) {
        //            var tmpYear = $scope.getYearDate[i];
        //            var par = $(obj).parent().prev().children().first();
        //            par.html(tmpYear);

        //        }
        //    }
        //}
        $scope.getSeries = function () {
            $scope.flag = 0;
            OrderApi.GetHistoricWeatherSeries(pubnameGreen, servicepage, moduleName, culture, countryCode, view, aggregation).then(function (resp) {
                $scope.seriesGraphData = resp.lstResultseries;
                $scope.getYearModel = [];
                for (var i = 0; i < $scope.seriesGraphData.length; i++) {
                    $scope.OpenDropdownlist[i] = " ";
                    $scope.getYearModel[i] = $scope.getYearDate[0];
                }

                $scope.legendForseriesData = resp.lstLegend;
                $scope.judgeForViewShow = resp.lstParameters[0];

                $scope.seedDepth = $scope.legendForseriesData[0].Name;
                $scope.seedDepthValue = $scope.judgeForViewShow.seedingDepthDefaultValue;
                document.getElementById("localAlti").value = $scope.seedDepthValue;
                $scope.seedDepthUnit = $scope.judgeForViewShow.seedingUnit;

                $scope.vel = $scope.legendForseriesData[1].Name;
                $scope.velTF = $scope.judgeForViewShow.isVerticalGrid;
                document.getElementById("checkbox11").checked = $scope.velTF;

                $scope.hor = $scope.legendForseriesData[2].Name;
                $scope.horTF = $scope.judgeForViewShow.isHorizontalGrid;
                document.getElementById("checkbox22").checked = $scope.horTF;

                $scope.acc = $scope.legendForseriesData[3].Name;
                $scope.accTF = $scope.judgeForViewShow.isAccumulation;
                $scope.accTFShow = $scope.judgeForViewShow.showAccumulation;
                document.getElementById("checkbox33").checked = $scope.accTF;

                $scope.displayVeH = $scope.legendForseriesData[4].Name;

                $scope.graphSeH = $scope.legendForseriesData[5].Name;

                $scope.startDateH = $scope.legendForseriesData[6].Name;
                $scope.endDateH = $scope.legendForseriesData[7].Name;
                $scope.aggregationH = $scope.legendForseriesData[8].Name;

                $scope.titleTextWeather = $scope.legendForseriesData[10].Name;
                $scope.RainFallTxt = $scope.legendForseriesData[12].Name;
                $scope.TemperatureTxt = $scope.legendForseriesData[11].Name;
                $scope.forTxt = $scope.legendForseriesData[13].Name;
               
                $scope.flag = 1;
                //console.log('11111:' + $scope.flag)
            }, function (err) {
                $scope.failed = true;
            })
        };

        $scope.getSelectYear = function () {
            $scope.getYearDate = [];
            var getDate = new Date();
            $scope.getYear = getDate.getFullYear();

            comparisionYearMax = $scope.getYear;
            comparisionYearMin = $scope.getYear;

            for (var i = 0; i <= 22; i++) {
                $scope.getYearDate[i] = $scope.getYear - i;
            }

        };
        $scope.getSelectYear();

        $scope.getHistoricWeatherSeries = function () {
            OrderApi.GetHistoricWeatherSeries(pubnameGreen, servicepage, moduleName, culture, countryCode, view, aggregation).then(function (resp) {
                $scope.SeriesChioceData = resp.lstResultseries;
                $scope.model.selectedSeries = $scope.SeriesChioceData[0];

                view = $scope.model.selectedSeries.ID;
                $scope.getSeries();

            }, function (err) {
                $scope.failed = true;
            })
        };
        var view = '';
        $scope.getHistoricWeatherSeries();

        $scope.getDefaultStartAndEndDate = function () {
            var date = new Date();
            var day = date.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            var monthIndex = date.getMonth();
            var monthIndexEnd = monthIndex + 1;
            if (monthIndex < 10) {
                monthIndex = "0" + monthIndex;
            }
            if (monthIndexEnd < 10) {
                monthIndexEnd = "0" + monthIndexEnd;
            }
            var year = date.getFullYear();
            var dateFormat = $.datepicker.regional[countryCode].dateFormat;
            $scope.startDefault = dateFormat;
            $scope.startDefault = $scope.startDefault.replace("dd", day);
            $scope.startDefault = $scope.startDefault.replace("mm", monthIndex);
            $scope.startDefault = $scope.startDefault.replace("yy", year);

            var newdate = new Date(date);
            newdate.setDate(newdate.getDate() - 2);
            var enddate = newdate.getDate();
            if (enddate < 10) {
                enddate = "0" + enddate;
            }
            var endmonth = newdate.getMonth() + 1;
            var endyear = newdate.getFullYear();

            $scope.endDefault = dateFormat;
            $scope.endDefault = $scope.endDefault.replace("dd", enddate);
            $scope.endDefault = $scope.endDefault.replace("mm", endmonth);
            $scope.endDefault = $scope.endDefault.replace("yy", endyear);

            document.getElementById('dp').value = $scope.startDefault;
            document.getElementById('dp2').value = $scope.endDefault;

        }
        $scope.getDefaultStartAndEndDate();
        $scope.hisData = [];
        //to get historical echats data
        $scope.getHistoricalCharInfo = function () {
            $scope.resultShow = false;
            $scope.toShowLoadingDisplay2 = { "display": "block" };
            OrderApi.GetHistoricalWeatherCharInfo(pubnameGreen, servicepage, unit, culture, countryCode, $scope.Latitude, $scope.Longitude, $scope.placeName, $scope.model.weatherstation.Name,
                                                  $scope.stationLatitude, $scope.stationLongitude, altitude, maxDistanceDiff, maxAltitudeDiff, DayOffset, iDstOn,
                                                  $scope.SunRise, $scope.SunSet, startDateGreen, endDateGreen, during, aggregation, locAltitude, $scope.seedDepthValue, accumulation, comparisionYearMax, comparisionYearMin, checkedSeries).then(function (resp) {
                                                      $scope.getHistoricalData = resp;
                                                      $scope.hisData = resp.lstResultseries;
                                                      if ($scope.hisData.length == 0) {

                                                          $('#refreshChartId').popover({ content: "data is null", placement: "top" });
                                                          $("#refreshChartId").popover("show");
                                                          setTimeout(function () { $("#refreshChartId").popover("destroy"); }, 3000);
                                                          return;
                                                      }

                                                      $scope.getStartDate = resp.StartDate;
                                                      $scope.getEndDate = resp.Enddate;
                                                      $scope.getAggregation = resp.Aggregation;

                                                      CreateCharts();


                                                      //$scope.VisCalCumTemperature = false;
                                                      //$scope.VisCalCumPrecipitations = false;
                                                      //$scope.calCumTemperature = 0;
                                                      //$scope.averDayNight = [];
                                                      //$scope.calCumPrecipitationsre = 0;
                                                      //$scope.calCumulative_precipitations();
                                                      //$scope.calCumulative_temperature();
                                                  }, function (err) {
                                                      $scope.failed = true;
                                                  })
        };

        $scope.toshowStartDate = function () {

            $('#dp').datepicker($.datepicker.regional[countryCode]);
            $('#dp').datepicker();

        };
        $scope.toshowStartDate();

        $scope.toShowTheEndDate = function () {
            $('#dp2').datepicker($.datepicker.regional[countryCode]);
            $('#dp2').datepicker()
        };
        $scope.toShowTheEndDate();

        $scope.toGetDefaultData = function () {
            document.getElementById('dp').value = $scope.startDefault;
            document.getElementById('dp2').value = $scope.endDefault;
            $scope.model.selectedTwo = $scope.DurationData[2];
            $scope.model.selected = $scope.AggregationData[0];
            $scope.model.selectedSeries = $scope.SeriesChioceData[0];
            view = $scope.model.selectedSeries.ID;
            //$scope.toShowLastDate = false;
            during = $scope.DurationData[2].Key;
            aggregation = $scope.AggregationData[0].Key;
            seriesChioce = $scope.SeriesChioceData[0].ID;
            $scope.getSeries();

            //document.getElementById('localAlti').value = $scope.Altitude;
            for (var i = 0; i < $scope.seriesGraphData.length; i++) {
                var tmpId = $scope.seriesGraphData[i].ID;
                document.getElementById(tmpId).checked = false;
            }
        };

        $scope.toGetChartImage = function () {
            if ($scope.resultShow == false) {
                //alert("no chart!");
                return;
            } else {
                //alert('have chart!');
                var canvas = document.getElementsByTagName('canvas');
                // save canvas image as data url (png format by default)
                var dataURL = canvas[0].toDataURL();

                var aLink = document.createElement('a');
                aLink.download = 'image.png';
                aLink.href = dataURL;
                aLink.click();
            }
        }

        //need to change some logic (modify)
        $scope.toGetCheckedSeries = function () {
            checkedSeries = "";
            var count = 0;
            $scope.colorArrayChart = [];
            var numberArray = 0;
            for (var i = 0; i < $scope.seriesGraphData.length; i++) {
                var tmpId = $scope.seriesGraphData[i].ID;
                var getIDState = document.getElementById(tmpId).checked;
                if (getIDState == false) {
                    if (i == $scope.seriesGraphData.length - 1 && checkedSeries == "") {
                        $('.tn-warning').popover({ content: $scope.SelectTipSuccess, placement: "top" });//$scope.SelectTipSuccess
                        $(".tn-warning").popover("show");
                        setTimeout(function () { $(".tn-warning").popover("destroy"); }, 3000);
                        return;
                    } else {
                        continue;
                    }
                } else {
                    if ($scope.seriesGraphData[i].isSelectYear == true) {
                        count++;
                        if (count == 1) {
                            if (tmpId.indexOf("_min") > 0) {
                                comparisionYearMin = $(document.getElementById(tmpId)).next().next().children()[0].children[0].innerHTML;//$(document.getElementById(tmpId)).next().next().val();
                            } else {
                                comparisionYearMax = $(document.getElementById(tmpId)).next().next().children()[0].children[0].innerHTML;
                            }
                        } else if (count > 1) {
                            comparisionYearMin = $(document.getElementById(tmpId)).next().next().children()[0].children[0].innerHTML;
                        }
                    }

                    if (checkedSeries == "") {
                        checkedSeries += tmpId;
                    } else {
                        checkedSeries += ";" + tmpId;
                    }

                    //to get the color array to show the chart
                    $scope.colorArrayChart[numberArray++] = $scope.seriesGraphData[i].Color;
                }
            }
            $scope.getHistoricalCharInfo();
        };
        //var c = 1;
        $scope.getEchartsToShow = function () {
            //alert("asasasasa");
            //console.log("asasasasa");
            var opmp = document.getElementById('dp').value;
            startDateGreen = opmp;
            if (startDateGreen == "" || startDateGreen == null || startDateGreen == undefined) {
                $('.tn-warning2').popover({ content: $scope.toNotSelectStartDate, placement: "top" });
                $(".tn-warning2").popover("show");
                setTimeout(function () { $(".tn-warning2").popover("destroy"); }, 3000);
            } else {
                endDateGreen = document.getElementById('dp2').value;
                if (endDateGreen == "" || endDateGreen == null || endDateGreen == undefined) {
                    $('.tn-warning3').popover({ content: $scope.endDate_NotEmpty, placement: "top" });
                    $(".tn-warning3").popover("show");
                    setTimeout(function () { $(".tn-warning3").popover("destroy"); }, 3000);
                } else {

                    var tmp = document.getElementById('localAlti').value;
                    if (tmp != undefined && tmp != "" && tmp != null) {
                        $scope.seedDepthValue = tmp;
                    }
                    if (document.getElementById("checkbox33").checked == true) {
                        accumulation = true;
                    } else {
                        accumulation = false;
                    }
                    myTemperAndNiederChart.clear();
                    $scope.toGetCheckedSeries();
                    $scope.FileUrl = "#";
                }
            }
        };
        var yAxisDataQ;
        function CreateCharts() {
            var maxNumTemp = 0;
            var maxNumNieder = 0;
            var minNumTemp = 0;
            var niederschlagData = [];
            var tempMax = [];
            var tempMin = [];
            var minNum = 0;
            var xAxisData = [];
            yAxisDataQ = [];
            var historicalLength = $scope.hisData[0].values.length;

            var xAxisInterval = Math.floor((historicalLength - 1) / 10);

            var Months = $.datepicker.regional[countryCode].monthNamesShort;

            for (var i = 0; i < $scope.hisData[0].date.length; i++) {

                var dateQ = $scope.hisData[0].date[i].split('T');
                var dateData = dateQ[0].split("-");
                if (dateData[1] == "10" || dateData[1] == "11" || dateData[1] == "12") {
                    var month = dateData[1]
                } else
                    var month = dateData[1].replace(0, '');
                var monthName = Months[month - 1];

                if (aggregation == "monthly") {
                    xAxisData.push(monthName + '\n' + dateData[0]);
                } else {
                    xAxisData.push(dateData[2] + ' ' + monthName + '\n' + dateData[0]);
                }

            };

            //var maxNumNieder = 0;
            for (var i = 0; i < $scope.hisData.length; i++) {
                var yAxisDataSeries = [];
                for (var j = 0; j < $scope.hisData[i].values.length; j++) {
                    yAxisDataSeries.push($scope.hisData[i].values[j]);

                    if (view == "we_tempandrain") {//tmperature and rain
                        var idOne = $scope.seriesGraphData[0].ID;
                        var idTwo = $scope.seriesGraphData[1].ID;
                        if (document.getElementById(idOne).checked == true || document.getElementById(idTwo).checked == true && aggregation == "weekly") {
                            if (i == 0) { //rain
                                if (maxNumNieder < $scope.hisData[i].values[j]) {
                                    maxNumNieder = $scope.hisData[i].values[j];
                                }
                                if (minNumTemp > $scope.hisData[i].values[j]) {
                                    minNumTemp = $scope.hisData[i].values[j];
                                }
                            } else if (i == 1 && aggregation == "weekly" && document.getElementById(idTwo).checked == true) { //rain trend
                                if (maxNumNieder < $scope.hisData[i].values[j]) {
                                    maxNumNieder = $scope.hisData[i].values[j];
                                }
                                if (minNumTemp > $scope.hisData[i].values[j]) {
                                    minNumTemp = $scope.hisData[i].values[j];
                                }
                            } else { //temperature
                                if (maxNumTemp < $scope.hisData[i].values[j]) {
                                    maxNumTemp = $scope.hisData[i].values[j];
                                }
                                if (minNumTemp > $scope.hisData[i].values[j]) {
                                    minNumTemp = $scope.hisData[i].values[j];
                                }
                            }
                        } else { //not choose rain and rain trend
                            if (maxNumTemp < $scope.hisData[i].values[j]) {
                                maxNumTemp = $scope.hisData[i].values[j];
                            }
                            if (minNumTemp > $scope.hisData[i].values[j]) {
                                minNumTemp = $scope.hisData[i].values[j];
                            }
                        }
                    } else if (view == "we_precipitation") { //rain
                        if (maxNumNieder < $scope.hisData[i].values[j]) {
                            maxNumNieder = $scope.hisData[i].values[j];
                        }
                        if (minNumTemp > $scope.hisData[i].values[j]) {
                            minNumTemp = $scope.hisData[i].values[j];
                        }
                    } else { //temperature
                        if (maxNumTemp < $scope.hisData[i].values[j]) {
                            maxNumTemp = $scope.hisData[i].values[j];
                        }
                        if (minNumTemp > $scope.hisData[i].values[j]) {
                            minNumTemp = $scope.hisData[i].values[j];
                        }
                    }
                }
                yAxisDataQ[i] = yAxisDataSeries;
            }
            minNum = (function () {
                var temp = Math.floor(minNumTemp);
                if (temp >= 0) {
                    temp = 0;
                } else if (temp > -5) {
                    temp = -5;
                } else {
                    //temp = -10;
                }
                return temp;
            })();

            $scope.getDataByApiData(maxNumTemp, maxNumNieder, minNum);

            Option = null;
            Option = {
                title: {
                    text: $scope.model.selectedSeries.Text + ' ' + $scope.forTxt + " " + $scope.placeForChartTitle,
                    textStyle: {
                        fontSize: 15,
                    },
                    x: 'center',
                    align: 'right',
                    top: 0,
                },
                backgroundColor: 'white',
                renderAsImage: './Content/images/ngchart-01.png',
                tooltip: {
                    trigger: 'axis',

                },
                //toolbox: {
                //    feature: {
                //        saveAsImage: {
                //            type: 'png',
                //            title: ' ',
                //        }
                //    }
                //},
                legend: {
                    itemHeight: 15,
                    padding: 5,
                    top: 20,
                    //bottom: 20,
                    data: legendData,

                    textStyle: {
                        fontSize: 11,
                        fontWeight: 'bold'
                    },
                },
                calculable: true,
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '3%',
                    top: (function () {
                        var leng = $scope.colorArrayChart.length;
                        if (leng < 5) {
                            return '5%';
                        } else if (leng < 10) {
                            return '8%';
                        } else {
                            return '10%'
                        }
                    })(),//'10%',
                    containLabel: true
                },
                xAxis: [
                    {
                        splitLine: {
                            show: (function () {
                                return document.getElementById("checkbox11").checked;
                            })(),
                            interval: 0,
                            lineStyle: {
                                color: '#CCCCCC',
                                width: 1,
                                type: 'solid'
                            }
                        },

                        type: 'category',
                        data: xAxisData,
                        axisLabel: {
                            show: true,
                            margin: 10,
                            textStyle: {
                                fontSize: 14,
                                fontWeight: 'bold'
                            }

                        },
                        interval: xAxisInterval,
                    },
                    {
                        splitLine: {
                            show: (function () {
                                return document.getElementById("checkbox11").checked;
                            })(),
                            interval: 0,
                            lineStyle: {
                                color: '#CCCCCC',
                                width: 1,
                                type: 'solid'
                            }
                        },

                        type: 'category',
                        data: xAxisData,
                        axisLabel: {
                            show: false,
                            margin: 10,
                            textStyle: {
                                fontSize: 14,
                                fontWeight: 'bold'
                            }

                        },
                        interval: xAxisInterval,
                    }
                ],
                yAxis: yAxisData,
                series: seriesData
            };
            myTemperAndNiederChart.setOption(Option);
            $scope.toShowLoadingDisplay2 = { "display": "none" };

            $scope.resultShow = true;

        };


        var legendData, seriesData, yAxisData;
        $scope.getDataByApiData = function (maxNumTemp, maxNumNieder, minNum) {
            legendData = [];
            seriesData = [];
            yAxisData = [];
            var k = 0;
            var m = 0;
            var n = 0;
            var p = 0;
            for (var i = 0; i < $scope.seriesGraphData.length; i++) {
                var tmpId = $scope.seriesGraphData[i].ID;
                if (document.getElementById(tmpId).checked == true) {
                    p++;
                }
            }

            if (view == "we_tempandrain") {//tmperature and rain
                for (var i = 0; i < $scope.seriesGraphData.length; i++) {
                    var tmpId = $scope.seriesGraphData[i].ID;
                    if (document.getElementById(tmpId).checked == true) {
                        if (i == 0 || i == 1 && aggregation == "weekly") {
                            legendData[k++] = {
                                name: $scope.seriesGraphData[i].Text,
                                icon: 'rect',
                                iconSize: 10
                            }
                            if (m == 0) {
                                yAxisData[m++] = {
                                    type: 'value',
                                    splitLine: {
                                        show: (function () {
                                            return document.getElementById("checkbox22").checked;
                                        })(),
                                        lineStyle: {
                                            type: 'solid',
                                            color: '#01a0be'
                                        },
                                    },
                                    scale: true,
                                    name: $scope.RainFallTxt,
                                    nameTextStyle: {
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                    },
                                    axisLabel: {
                                        margin: 20
                                    },
                                    max: Math.floor(maxNumNieder) + 5,
                                    min: 0,
                                    nameLocation: 'middle',
                                    nameGap: 50,
                                    interval: Math.floor((Math.floor(maxNumNieder) + 5) / 8)
                                }
                            }
                        } else {
                            legendData[k++] = {
                                name: $scope.seriesGraphData[i].Text,
                            }
                            yAxisData[m] = {
                                type: 'value',
                                splitLine: {
                                    show: (function () {
                                        return document.getElementById("checkbox22").checked;
                                    })(),
                                    lineStyle: {
                                        type: 'dashed',
                                        color: '#eb8202'
                                    },
                                },
                                name: $scope.TemperatureTxt,
                                nameTextStyle: {
                                    fontSize: 14,
                                    fontWeight: 'bold',

                                },
                                axisLabel: {
                                    margin: 20
                                },
                                max: Math.floor(maxNumTemp) + 5,
                                min: minNum,
                                nameLocation: 'middle',
                                nameGap: 50,
                                interval: Math.floor((Math.floor(maxNumTemp) + 5 - minNum) / 10)
                            }
                        }
                    }
                }
                for (var i = 0; i < $scope.seriesGraphData.length; i++) {
                    var tmpId = $scope.seriesGraphData[i].ID;
                    if (document.getElementById(tmpId).checked == true) {
                        if (i == 0 || i == 1 && aggregation == "weekly") {
                            seriesData[n++] = {
                                name: $scope.seriesGraphData[i].Text,
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: $scope.colorArrayChart[n - 1]
                                        //    (function () {
                                        //    var temp = ['#0000ff', '#ff0000', '#ffff00', '#ADD8E6', '#ADDFE2', '#AD4FE2', '#ADD2E4', '#A5D5E2', '#AD4F52', '#5D6FE2'];
                                        //    var datp = temp[n - 1];
                                        //    return datp;
                                        //})()
                                    }
                                },
                                data: yAxisDataQ[n - 1],
                            }
                        } else {
                            if (yAxisData.length == 1) {
                                seriesData[n++] = {
                                    name: $scope.seriesGraphData[i].Text,
                                    type: 'line',
                                    symbol: 'none',
                                    itemStyle: {
                                        normal: {
                                            color: $scope.colorArrayChart[n - 1],
                                            //    (function () {
                                            //    var temp = ['#ff0000', '#0000ff', '#ffff00', '#ADD8E6', '#ADDFE2', '#AD4FE2', '#ADD2E4', '#A5D5E2', '#AD4F52', '#5D6FE2'];
                                            //    var datp = temp[n - 1];
                                            //    return datp;
                                            //})(),
                                            width: 3
                                        }
                                    },
                                    data: yAxisDataQ[n - 1],
                                },
                                seriesData[p++] = {
                                    name: $scope.seriesGraphData[i].Text,
                                    type: 'scatter',
                                    symbolSize: 10,
                                    itemStyle: {
                                        normal: {
                                            color: $scope.colorArrayChart[n - 1],
                                            width: 3
                                        }
                                    },
                                    data: yAxisDataQ[n - 1],
                                    xAxisIndex: 1
                                }
                            } else {
                                seriesData[n++] = {
                                    name: $scope.seriesGraphData[i].Text,
                                    type: 'line',
                                    symbol: 'none',
                                    itemStyle: {
                                        normal: {
                                            color: $scope.colorArrayChart[n - 1],
                                            //    (function () {
                                            //    var temp = ['#0000ff', '#ff0000', '#ffff00', '#ADD8E6', '#ADDFE2', '#AD4FE2', '#ADD2E4', '#A5D5E2', '#AD4F52', '#5D6FE2'];
                                            //    var datp = temp[n - 1];
                                            //    return datp;
                                            //})(),
                                            width: 3
                                        }
                                    },
                                    data: yAxisDataQ[n - 1],
                                    yAxisIndex: 1
                                },
                                seriesData[p++] = {
                                    name: $scope.seriesGraphData[i].Text,
                                    type: 'scatter',
                                    symbolSize: 10,
                                    itemStyle: {
                                        normal: {
                                            color: $scope.colorArrayChart[n - 1],
                                            width: 3
                                        }
                                    },
                                    data: yAxisDataQ[n - 1],
                                    yAxisIndex: 1,
                                    xAxisIndex: 1
                                }
                            }
                        }

                    }
                }

            } else if (view == "we_precipitation") {//rain
                var count = 0;
                for (var i = 0; i < $scope.seriesGraphData.length; i++) {
                    var tmpId = $scope.seriesGraphData[i].ID;
                    if (document.getElementById(tmpId).checked == true) {
                        var ln;
                        if ($scope.seriesGraphData[i].isSelectYear == true) {
                            count++;
                            if (count == 1) {
                                if (tmpId.indexOf("_min") > 0) {
                                    ln = $(document.getElementById(tmpId)).next().next().children()[0].children[0].innerHTML;
                                } else {
                                    ln = $(document.getElementById(tmpId)).next().next().children()[0].children[0].innerHTML;
                                }
                            } else if (count > 1) {
                                ln = $(document.getElementById(tmpId)).next().next().children()[0].children[0].innerHTML;
                            }

                            if (accumulation == true) {
                                legendData[k++] = {
                                    name: $scope.hisData[k - 1].legend + " " + ln,
                                }
                            } else if (accumulation == false) {
                                var tmpOne = $scope.seriesGraphData[i + 1].ID;
                                var tmpTwo = $scope.seriesGraphData[i + 2].ID;
                                var checkForOne = document.getElementById(tmpOne).checked;
                                var checkForTwo = document.getElementById(tmpTwo).checked;
                                if (checkForOne == true || checkForTwo == true) {
                                    legendData[k++] = {
                                        name: $scope.hisData[k - 1].legend + " " + ln,
                                        icon: 'rect',
                                        iconSize: 10
                                    }
                                } else {
                                    legendData[k++] = {
                                        name: $scope.hisData[k - 1].legend + " " + ln,
                                    }
                                }
                            }

                            seriesData[n++] = {
                                name: $scope.hisData[n - 1].legend + " " + ln,
                                type: (function () {//accumulation == true ? 'line' : 'bar',
                                    if (accumulation == true) {
                                        return 'line';
                                    } else {
                                        var tmpOne = $scope.seriesGraphData[i + 1].ID;
                                        var tmpTwo = $scope.seriesGraphData[i + 2].ID;
                                        var checkForOne = document.getElementById(tmpOne).checked;
                                        var checkForTwo = document.getElementById(tmpTwo).checked;
                                        if (checkForOne == true || checkForTwo == true) {
                                            return 'bar';
                                        } else {
                                            return 'line';
                                        }
                                    }
                                })(),
                                itemStyle: {
                                    normal: {
                                        color: $scope.colorArrayChart[n - 1],
                                        //(function () {
                                        //    var temp = ['#0000ff', '#ff0000', '#ffff00', '#ADD8E6', '#ADDFE2', '#AD4FE2', '#ADD2E4', '#A5D5E2', '#AD4F52', '#5D6FE2'];
                                        //    var datp = temp[n - 1];
                                        //    return datp;
                                        //})()
                                    }
                                },
                                data: yAxisDataQ[n - 1],
                                //yAxisIndex: 1
                            }

                        } else {
                            if (accumulation == true) {
                                legendData[k++] = {
                                    name: $scope.hisData[k - 1].legend + " " + $scope.hisData[k - 1].legendSupplement,
                                }
                            } else {
                                legendData[k++] = {
                                    name: $scope.hisData[k - 1].legend + " " + $scope.hisData[k - 1].legendSupplement,
                                    icon: 'rect',
                                    iconSize: 10
                                }
                            }
                            seriesData[n++] = {
                                name: $scope.hisData[n - 1].legend + " " + $scope.hisData[n - 1].legendSupplement,
                                type: accumulation == true ? 'line' : 'bar',
                                symbol: accumulation == true ? 'circle' : 'rect',
                                itemStyle: {
                                    normal: {
                                        color: $scope.colorArrayChart[n - 1],
                                        //(function () {
                                        //    var temp = ['#0000ff', '#ff0000', '#ffff00', '#ADD8E6', '#ADDFE2', '#AD4FE2', '#ADD2E4', '#A5D5E2', '#AD4F52', '#5D6FE2'];
                                        //    var datp = temp[n - 1];
                                        //    return datp;
                                        //})()
                                    }
                                },
                                data: yAxisDataQ[n - 1],
                                //yAxisIndex: 1
                            }
                        }
                        yAxisData[m] = {
                            type: 'value',
                            splitLine: {
                                show: (function () {
                                    return document.getElementById("checkbox22").checked;
                                })(),
                                lineStyle: {
                                    type: 'solid',
                                    color: '#01a0be'
                                },
                            },
                            scale: true,
                            name: $scope.RainFallTxt,
                            nameTextStyle: {
                                fontSize: 14,
                                fontWeight: 'bold'
                            },
                            axisLabel: {
                                margin: 20
                            },
                            max: Math.floor(maxNumNieder) + 5,
                            min: 0,
                            nameLocation: 'middle',
                            nameGap: 50,
                            interval: Math.floor((Math.floor(maxNumNieder) + 5) / 8)
                        }

                    }
                }
            } else {//temperature
                for (var i = 0; i < $scope.seriesGraphData.length; i++) {
                    var tmpId = $scope.seriesGraphData[i].ID;
                    if (document.getElementById(tmpId).checked == true) {
                        legendData[k++] = {
                            name: $scope.seriesGraphData[i].Text,
                        }
                        yAxisData[m] = {
                            type: 'value',
                            splitLine: {
                                show: (function () {
                                    return document.getElementById("checkbox22").checked;
                                })(),
                                lineStyle: {
                                    type: 'dashed',
                                    color: '#eb8202'
                                },
                            },
                            name: $scope.TemperatureTxt,
                            nameTextStyle: {
                                fontSize: 14,
                                fontWeight: 'bold',

                            },
                            axisLabel: {
                                margin: 20
                            },
                            max: Math.floor(maxNumTemp) + 5,
                            min: minNum,
                            nameLocation: 'middle',
                            nameGap: 50,
                            interval: Math.floor((Math.floor(maxNumTemp) + 5 - minNum) / 10)
                        }
                        seriesData[n++] = {
                            name: $scope.seriesGraphData[i].Text,
                            type: 'line',
                            symbol: 'none',
                            itemStyle: {
                                normal: {
                                    color: $scope.colorArrayChart[n - 1],
                                    //    (function () {
                                    //    var temp = ['#0000ff', '#ff0000', '#ffff00', '#ADD8E6', '#ADDFE2', '#AD4FE2', '#ADD2E4', '#A5D5E2', '#AD4F52', '#5D6FE2'];
                                    //    var datp = temp[n - 1];
                                    //    return datp;
                                    //})(),
                                    width: 3
                                }
                            },
                            data: yAxisDataQ[n - 1],
                        },
                        seriesData[p++] = {
                            name: $scope.seriesGraphData[i].Text,
                            type: 'scatter',
                            symbolSize: 10,
                            itemStyle: {
                                normal: {
                                    color: $scope.colorArrayChart[n - 1],
                                    width: 3
                                }
                            },
                            data: yAxisDataQ[n - 1],
                            xAxisIndex: 1
                        }
                    }
                }
            }
        };
        //$scope.VisCalCumTemperature = false;
        //$scope.VisCalCumPrecipitations = false;

        //$scope.calCumulative_temperature = function () {
        //    for (var i = 0; i < $scope.hisData.length; i++) {
        //        if ($scope.hisData[i].tempair_c_daytimemax_AltAdj != undefined && $scope.hisData[i].tempair_c_nighttimemin_AltAdj != undefined) {

        //            $scope.averDayNight[i] = ($scope.hisData[i].tempair_c_daytimemax_AltAdj + $scope.hisData[i].tempair_c_nighttimemin_AltAdj) / 2;
        //            if ($scope.averDayNight[i] < 0) {
        //                $scope.averDayNight[i] = 0
        //            }
        //            $scope.calCumTemperature += $scope.averDayNight[i];
        //        }
        //        if ($scope.hisData[i].avgtempair_c_daytimemax_AltAdj != undefined && $scope.hisData[i].avgtempair_c_nighttimemin_AltAdj != undefined) {

        //            $scope.averDayNight[i] = ($scope.hisData[i].avgtempair_c_daytimemax_AltAdj + $scope.hisData[i].avgtempair_c_nighttimemin_AltAdj) / 2;
        //            if ($scope.averDayNight[i] < 0) {
        //                $scope.averDayNight[i] = 0
        //            }
        //            $scope.calCumTemperature += $scope.averDayNight[i];


        //        }
        //    }
        //    $scope.calCumTemperatureNew = Math.round($scope.calCumTemperature * 10) / 10;

        //    //if ( document.getElementById('checkbox-3').checked == true && document.getElementById('checkbox-7').checked == true) {

        //    $scope.VisCalCumTemperature = document.getElementById('checkbox-3').checked == true && document.getElementById('checkbox-7').checked == true;
        //    //}
        //    //else {
        //    //    $scope.VisCalCumTemperature = true;
        //    //}
        //}

        //$scope.calCumulative_precipitations = function () {
        //    for (var i = 0; i < $scope.hisData.length; i++) {
        //        if ($scope.hisData[i].precipamount_mm_dailysum != undefined) {
        //            $scope.calCumPrecipitationsre += $scope.hisData[i].precipamount_mm_dailysum;


        //        }
        //        if ($scope.hisData[i].sumprecipamount_mm_dailysum != undefined) {
        //            $scope.calCumPrecipitationsre += $scope.hisData[i].sumprecipamount_mm_dailysum;


        //        }

        //    }
        //    $scope.calCumPrecipitationsreNew = Math.round($scope.calCumPrecipitationsre * 10) / 10;
        //    //if (document.getElementById('checkbox').checked == true) {
        //    $scope.VisCalCumPrecipitations = document.getElementById('checkbox').checked == true;
        //    //}
        //    //else {
        //    //    $scope.VisCalCumPrecipitations = true;
        //    //}
        //}

        if (!$scope.detectmob()) {
            var cookieData = $scope.GetCookie('cookieData');

            if (cookieData != null) {
                $scope.getCookieParmeter = $scope.getParamFromCookie(cookieData);
                //code copied from controller_index.js end
                if (countryCode == $scope.getCookieParmeter.country) {
                    latitude = $scope.getCookieParmeter.lat;
                    longitude = $scope.getCookieParmeter.long;
                    $scope.colorBack = $scope.getCookieParmeter.color;
                    $scope.SearchLocationText = latitude + "," + longitude;
                    $scope.Latitude = latitude;
                    $scope.Longitude = longitude;

                    placeName = $scope.getCookieParmeter.location;
                    $scope.placeName = placeName;
                    stationName = $scope.getCookieParmeter.stationname;
                    stationLatitude = $scope.getCookieParmeter.stationlatitude;
                    $scope.stationLatitude = stationLatitude;
                    stationLongitude = $scope.getCookieParmeter.stationlongitude;
                    $scope.stationLongitude = stationLongitude;

                    loadFromLocal = true;
                }
            }
            $scope.getTranslatedText(culture, pub);
        } else {
            $scope.getMobNavData();
        }
        function clientWidth() {
            var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0];
            return w.innerWidth || e.clientWidth || g.clientWidth;
        }
        $scope.NearByDropPosition = function () {
            var widthdevice = clientWidth();
            if (widthdevice >= 580 && widthdevice <= 991) {
                $scope.StringPositon = "col-sm-push-6";
                $scope.DropdownlistPosition = "col-sm-pull-6 ";
            }
            else {
                $scope.StringPositon = " ";
                $scope.DropdownlistPosition = " ";
            }
        }
        $scope.NearByDropPosition();

        $scope.getDropdownTranslation();

        $scope.judgeForScroll = "not";
        $scope.judgeScroll = function () {
            if (clientWidth() <= 900) {
                $scope.judgeForScroll = "is";
            }
        };
        $scope.judgeScroll();

        $window.onresize = function () {
            myTemperAndNiederChart.resize();

            $scope.$apply(function () {
                $scope.judgeScroll();
                $scope.NearByDropPosition();
                $scope.ModifyMaxHeightMobile();
            })
        };

    };
})();


function UpdateYearDateDetails(obj) {
    var par = $(obj).parent().prev().children().first();
    par[0].innerHTML = obj.innerHTML;
}