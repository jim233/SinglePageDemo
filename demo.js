(function () {

    'use strict';
    var app = angular.module('myApp', ['ngResource']);
    app.factory('WebApiTest', function ($resource) {
        var url = 'http://localhost:5139/api/appservice/get1';
        var Web = $resource(url, {}, {
            getQ: {
                method: 'get',
                url: url,
                isArray: true
            },
        });

        return {
            getQ: function () {
                var modal = Web.getQ({}).$promise;
                return modal;
            }
        }
    });

    (function () {
        'use strict';

        app.factory('webapi', webapi);

        webapi.$inject = ['$http', '$httpParamSerializer'];

        function webapi($http, $httpParamSerializer) {

            return {

                post: function (className, actionName, parameters) {

                    return $http({
                        method: 'POST',
                        url: 'api/AppService/Post',
                        data: JSON.stringify({ Class: className, Action: actionName, Parameters: parameters })
                    });

                },

                getMenu: function () {
                    return $http({
                        method: 'get',
                        url: 'api/Security'
                    });
                },

                postList: function (actionList) {
                    return $http({
                        method: 'POST',
                        url: 'api/AppService/PostActionList',
                        data: JSON.stringify(actionList)
                    });
                },

                GetQ: function () {
                    return $http({
                        method: 'get',
                        url: 'http://localhost:5139/api/appservice/get1'
                    });
                }

            }

        }

    })();

    // Genetic owner
    app.filter('filter_genetic_owner', function () {

        // filter "Genetic owner" by "Output trait"
        return function (input, speciesType, selectedOutputTrait) {
            if (input == null) {
                return input;
            }

            if (input.length == 0) {
                return input;
            }

            if (selectedOutputTrait == null || selectedOutputTrait == '') {
                //return input;
                return [];
            }

            var output = [];

            // filter the "Genetic owner"
            angular.forEach(input, function (obj) {
                if (obj.vch_output_trait_code == selectedOutputTrait.dataFieldName) {
                    output.push(obj);
                }
            });

            return output;

        }

    });

    app.filter('filter_by_output_trait_code', function () {

        // filter "Maturity", "Belt" by "Output trait"
        return function (input, speciesType, dynamicFieldLabel, selectedOutputTrait) {
            if (input == null) {
                return input;
            }

            if (input.length == 0) {
                return input;
            }

            // only filter data for "Maturity" and "Belt"
            if (['Maturity', 'Belt'].indexOf(dynamicFieldLabel) === -1) {
                return input;
            }

            if (selectedOutputTrait == null) {
                //return input;
                return [];
            }

            var output = [];

            // filter the "Maturity" and "Belt"
            angular.forEach(input, function (obj) {
                if (obj.output_trait_code == selectedOutputTrait.dataFieldName) {
                    output.push(obj);
                }
            });

            return output;

        }

    });

    app.controller('createVarietyCtrl', ['$scope', '$http', 'WebApiTest', 'webapi', function ($scope, $http, WebApiTest, webapi, $state) {
        var vm = this;
        vm.loadCompleted = true;
        console.log("demo made by jim!!");

        $scope.GetAllData = function () {
            console.log("1:" + $scope.data1 + " 2:" + $scope.data2 + " 3:" + $scope.data3)
        }

        function doFunc() {
            if ($scope.data1 != undefined && $scope.data2 != undefined && $scope.data3 != undefined) {
                $scope.GetAllData();
            }
        }

        var url = 'http://localhost:5139/api/appservice/get1';
        $http.get(url)
        .success(function (data) {
            console.log("!!!!!!!!!!!!!!!!!!!! = " + data);
            $scope.data1 = data;
            doFunc();
        }).error(function (data) {
            console.log("error" + data);
        })

        $scope.getData = function () {
            WebApiTest.getQ().then(function (data) {
                console.log("xxxxxxxxxxxxxxxxx" + data);
                $scope.data2 = data;
                doFunc();
            })
        };
        $scope.getData();

        var promise = webapi.GetQ();
        promise.then(
            function (result) {
                console.log("zzzzzzzzzzzzzz" + result.data);
                $scope.data3 = result.data;
                doFunc();
            },
            function (result) {
                // error handler

            });

        //-------------------------------------------------------------------------------------------
        vm.varietyModels = {
            "Variety": new blVarietyFieldsModel(),
            "Female": new blVarietyFieldsModel(),
            "Male": new blVarietyFieldsModel(),
            "Maintainer": new blVarietyFieldsModel()
        }

        vm.SpeciesTypes = ["Variety", "Female", "Male", "Maintainer"];
        vm.SpeciesOptions = [];
        vm.VarietyDynamicFieldsTypes = [];

        // get OutputTraits,InputTraitHTC,InputTraitDownyMildew,InputTraitBroomrape
        // Maturity,Belt
        vm.VarietyDynamicFieldsData = [];

        vm.GeneticOwnerOptions = [];
        vm.VarietyTeamOptions = [];

        vm.animationsEnabled = true;
        vm.open = function (templateUrl, ctrl, model) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: templateUrl,
                backdrop: 'static',
                controller: ['$uibModalInstance', 'model', ctrl],
                controllerAs: 'vm',
                resolve: {
                    model: model

                }
            });

            return modalInstance.result;
        };

        vm.fnOpenParentInfoPage = function () {

            var multiplicationIndicator = vm.varietyModels['Variety'].multiplicationIndicator || '';
            if (multiplicationIndicator == '') {
                logger.error("Please enter a Type of cross");
                return;
            }
            if (multiplicationIndicator == 'LP') {
                logger.error("There are no Parents for this variety because the selected Type of cross is LP");
                return;
            }
            var femaleVarietyNumber = vm.varietyModels['Variety'].femaleVarietyNumber || '',
                maleVarietyNumber = vm.varietyModels['Variety'].maleVarietyNumber || '';
            if ((femaleVarietyNumber == '') && (maleVarietyNumber == '')) {
                logger.error("Please enter Male Line code or Female Line code to view the information")
                return;
            }

            if (vm.noFemaleLineCodeMatch && vm.varietyModels['Variety'].femaleVarietyNumber) {
                logger.error("Line code female is invalid!");
                return;
            }

            if (vm.noMaleLineCodeMatch && vm.varietyModels['Variety'].maleVarietyNumber) {
                logger.error("Line code male is invalid!");
                return;
            }
            //window.open("BrShowParentsForm.aspx" + "?FemaleVN=" + document.Form1.txtVarietyNumberFemale.value + "&MaleVN=" + document.Form1.txtVarietyNumberMale.value, "", "width=700,height=500,resizable=yes,top=50,left=50"); //""&RegionCode="+document.Form1.cmbVarietyStageCodeRegion.value" deleted by Alex Liang regarding global stage code change on 18-Jun-08

            // DataSet dsPopulateParentInfo = blBreeder.GetParentInfoDetails(maleVarietyNumber,femaleVarietyNumber,regionCode);


            webapi.post("BLBrCreateVarietyService", "GetParentInfoDetails", { maleVarietyNumber: maleVarietyNumber, femaleVarietyNumber: femaleVarietyNumber })
                    .then(function (result) {
                        vm.open('createVarietyShowParentModal.html', showParentModalCtrl, result.data)
                        .then(function () {
                            // closed
                        }, function () {
                            // cancalled
                        });
                    },
                    function (result) {
                        // error handler
                        logger.error(result.data.message);
                    });


        }

        vm.lineCodeFemaleChanged = function () {
            var femaleVarietyNumber = vm.varietyModels['Variety'].femaleVarietyNumber || '';

            if (femaleVarietyNumber === '') {
                vm.maintainerVarietyNumberDisabled = false;
                vm.varietyModels['Female'].disabled = false;
                vm.varietyModels['Maintainer'].disabled = false;

                vm.varietyModels['Female'].speciesCode = vm.varietyModels['Variety'].speciesCode;
                vm.varietyModels['Maintainer'].speciesCode = vm.varietyModels['Variety'].speciesCode;
                return;
            }

            if (!vm.noFemaleLineCodeMatch) {
                vm.varietyModels['Female'].disabled = false;
                vm.varietyModels['Maintainer'].disabled = false;
                vm.maintainerVarietyNumberDisabled = false;
            }
        };

        vm.lineCodeMaintainerChanged = function () {
            if (vm.varietyModels['Variety'].maintainerVarietyNumber != '') {
                var promise = webapi.post("BLBrCreateVarietyService", "CheckForMaintainerExistence", { "varietyNumber": vm.varietyModels['Variety'].maintainerVarietyNumber });
                promise.then(
                    function (result) {

                        // input: femaleVarietyNumber
                        // result:
                        // 0: no records found
                        // 1: has record, but vch_maintainer_var_num is null =====> fnDisableFemale
                        // 2: has record, and vch_maintainer_var_num is not null  ====> fnDisableFemale & fnDisableMaint

                        if (result.data == 0) {
                            vm.noMaintainerLineCodeMatch = true;
                        }
                        else {
                            vm.noMaintainerLineCodeMatch = false;
                        }

                    },
                    function (result) {
                        // error handler

                        vm.varietyModels['Female'].disabled = false;
                        vm.varietyModels['Maintainer'].disabled = false;
                        vm.maintainerVarietyNumberDisabled = false;

                        logger.error(result.data.message);
                    });
            }
        }

        vm.lineCodeFemaleSelected = function () {
            var femaleVarietyNumber = vm.varietyModels['Variety'].femaleVarietyNumber || '';

            if (femaleVarietyNumber === '') {
                vm.maintainerVarietyNumberDisabled = false;
                vm.varietyModels['Female'].disabled = false;
                vm.varietyModels['Maintainer'].disabled = false;

                vm.varietyModels['Female'].speciesCode = vm.varietyModels['Variety'].speciesCode;
                vm.varietyModels['Maintainer'].speciesCode = vm.varietyModels['Variety'].speciesCode;
                return;
            }

            var promise = webapi.post("BLBrCreateVarietyService", "CheckForMaintainerExistence", { "varietyNumber": femaleVarietyNumber });
            promise.then(
                function (result) {

                    // input: femaleVarietyNumber
                    // result:
                    // 0: no records found
                    // 1: has record, but vch_maintainer_var_num is null =====> fnDisableFemale
                    // 2: has record, and vch_maintainer_var_num is not null  ====> fnDisableFemale & fnDisableMaint

                    if (result.data == 1) {
                        // vch_maintainer_var_num is empty, disable input for maintainerVarietyNumber
                        // and must enable the maintainer column

                        vm.varietyModels['Female'] = new blVarietyFieldsModel();

                        vm.varietyModels['Female'].disabled = true;
                        vm.varietyModels['Maintainer'].disabled = false;
                        vm.maintainerVarietyNumberDisabled = true;
                    }

                    if (result.data == 2) {
                        vm.varietyModels['Female'] = new blVarietyFieldsModel();
                        vm.varietyModels['Maintainer'] = new blVarietyFieldsModel();

                        vm.varietyModels['Female'].disabled = true;
                        vm.varietyModels['Maintainer'].disabled = true;
                        vm.maintainerVarietyNumberDisabled = true;
                    }

                    if (result.data == 0) {
                        vm.varietyModels['Female'].disabled = false;
                        vm.varietyModels['Maintainer'].disabled = false;
                        vm.maintainerVarietyNumberDisabled = false;
                    }

                },
                function (result) {
                    // error handler

                    vm.varietyModels['Female'].disabled = false;
                    vm.varietyModels['Maintainer'].disabled = false;
                    vm.maintainerVarietyNumberDisabled = false;

                    logger.error(result.data.message);
                });
        };

        vm.lineCodeMaleChanged = function () {
            var maleVarietyNumber = vm.varietyModels['Variety'].maleVarietyNumber || '';

            if (maleVarietyNumber === '') {
                vm.varietyModels['Male'].disabled = false;
                vm.varietyModels['Male'].speciesCode = vm.varietyModels['Variety'].speciesCode;
                return;
            }

            if (!vm.noMaleLineCodeMatch) {
                vm.varietyModels['Male'].disabled = false;
                vm.varietyModels['Male'].speciesCode = vm.varietyModels['Variety'].speciesCode;
            }
        };
        //lineCodeMaleSelected
        vm.lineCodeMaleSelected = function () {
            var maleVarietyNumber = vm.varietyModels['Variety'].maleVarietyNumber || '';

            if (maleVarietyNumber === '') {
                vm.varietyModels['Male'].disabled = false;
                vm.varietyModels['Male'].speciesCode = vm.varietyModels['Variety'].speciesCode;
                return;
            }

            var promise = webapi.post("BLBrCreateVarietyService", "CheckForMaintainerExistence", { "varietyNumber": maleVarietyNumber });
            promise.then(
                function (result) {

                    // input: maleVarietyNumber
                    // result:
                    // 0: no records found
                    // 1: has record, but vch_maintainer_var_num is null =====> fnDisableMale
                    // 2: has record, and vch_maintainer_var_num is not null  ====> fnDisableMale

                    if (result.data > 0) {
                        // vch_maintainer_var_num is empty, disable input for maintainerVarietyNumber
                        // and must enable the maintainer column
                        vm.varietyModels['Male'] = new blVarietyFieldsModel();
                        vm.varietyModels['Male'].disabled = true;
                    } else {
                        vm.varietyModels['Male'].disabled = false;
                        vm.varietyModels['Male'].speciesCode = vm.varietyModels['Variety'].speciesCode;
                    }

                },
                function (result) {
                    // error handler

                    vm.varietyModels['Male'].disabled = false;
                    vm.varietyModels['Male'].speciesCode = vm.varietyModels['Variety'].speciesCode;
                    logger.error(result.data.message);
                });

        };

        vm.getLineCodes = function (lineCode) {

            return webapi.post("BLBreeder", "GetLineCodes", { lineCode: lineCode })
                .then(function (response) {
                    return response.data.table;
                });

        };

        vm.init = function () {

            var promise = webapi.post("BrCreateVarietyService", "GetSpeciesCode", null);
            promise.then(
                function (result) {

                    vm.SpeciesOptions = result.data;

                },
                function (result) {
                    // error handler
                    logger.error(result.data.message);
                });

            //
            webapi.post("BLBrCreateVarietyService", "GetGMTraits", null)
                .then(function (result) {

                    vm.GMTraitsOptions = {
                        "Variety": result.data.variety,
                        "Female": result.data.female,
                        "Male": result.data.male,
                        "Maintainer": result.data.maintainer
                    };

                },
                function (result) {
                    // error handler
                    logger.error(result.data.message);
                });

            webapi.post("BLCommon", "GetSystemLookUpByLookupCode", { "vch_lookup_code": "TC" })
                    .then(function (result) {

                        vm.TypeOfCrossOptions = result.data.table;

                    },
                    function (data) {
                        // error handler
                        logger.error(result.data.message);
                    });

            if ($scope.createVarietyForm)
                $scope.createVarietyForm.$setPristine();
        };

        vm.init();

        $scope.$watch("createVarietyForm.$dirty", function (newValue) {
            $state.params.isDirty = $state.params.isDirty || newValue;
        });


        // get OutputTraits,InputTraitHTC,InputTraitDownyMildew,InputTraitBroomrape
        // Maturity,Belt
        vm.speciesCodeChanged = function (speciesType) {
            var selectedSpeciesCode = vm.varietyModels[speciesType].speciesCode;
            var parameters = { speciesCode: selectedSpeciesCode };

            // when one species code selection changed, other three species should also selection the same species code.
            angular.forEach(vm.SpeciesTypes, function (value, key) {
                if (value !== speciesType) {
                    vm.varietyModels[value].speciesCode = selectedSpeciesCode;
                }
            });

            // clear all dependency data.
            if (selectedSpeciesCode == null || selectedSpeciesCode === '') {
                vm.VarietyDynamicFieldsTypes = [];
                vm.VarietyDynamicFieldsData = [];
                vm.GeneticOwnerOptions = [];
                vm.VarietyTeamOptions = [];
                // vm.TypeOfCrossOptions = [];
                return;
            }

            var promise = webapi.post("BLVariety", "GetVarietyDynamicFields", parameters);
            promise.then(
                function (result) {

                    vm.VarietyDynamicFieldsTypes = result.data.table;
                    vm.VarietyDynamicFieldsData = result.data.table1;

                },
                function (result) {
                    // error handler
                    logger.error(result.data.message);
                });


            webapi.post("BLCommonService", "GetGeneticOwner", { "speciesCode": selectedSpeciesCode, "productType": "", "type": "geneticowner" })
               .then(function (result) {

                   vm.GeneticOwnerOptions = result.data.table;

               },
               function (data) {
                   // error handler
                   logger.error(result.data.message);
               });




            webapi.post("BLAdministrator", "GetVarietyTeam", { "speciesCode": selectedSpeciesCode })
                    .then(function (result) {

                        vm.VarietyTeamOptions = result.data.table;

                    },
                    function (data) {
                        // error handler
                        logger.error(result.data.message);
                    });



        }

        vm.refreshPage = function (isDirty) {

            if (isDirty) {
                var modelMessage = {
                    modalTitle: 'Confirm!',
                    modalMessage: 'You are editing this page. Are you sure cancel you changes? Press Ok to continue.'
                }
                var confirmResult = vm.open('createVarietyConfirmModal.html', confirmModalCtrl, modelMessage);

                confirmResult.then(function () {
                    // confirmed
                    // refresh the page.
                    $state.go('.', {}, { reload: true });
                }, function () {
                    // cancalled

                });
            }

        };

        vm.save = function (isDirty) {

            if (!isDirty) {
                logger.error("Please enter the details to save.");
                return;
            }

            if (vm.varietyModels['Variety'].multiplicationIndicator === 'CU' && vm.varietyModels['Variety'].speciesCode !== 'CAP') {
                logger.error('Please enter correct Type of cross for the species selected');
                return;
            }

            if (!checkVarietyCode()) {
                return;
            }

            if (!checkFemaleVarietyCode()) {
                return;
            }

            if (!checkMaleVarietyCode()) {
                return;
            }

            if (!checkMaintainerVarietyCode()) {
                return;
            }

            if (!checkVarietyReserachCode()) {
                return;
            }

            if (!checkFemaleVarietyReserachCode()) {
                return;
            }

            if (!checkMaleVarietyReserachCode()) {
                return;
            }

            if (!checkMaintainerVarietyResearchCode()) {
                return;
            }

            if (!fnValidateSpecies()) {
                return;
            }

            if (!checkForGMOandGMTraits()) {
                return;
            }

            // variety + Maintainer is invalid
            // if maintainer has input data, then female must provide(line code or input female data)
            if (!checkMaintainerDependenceOfFemale()) {
                return;
            }

            if (vm.noMaintainerLineCodeMatch && vm.varietyModels['Variety'].maintainerVarietyNumber) {
                logger.error('Line code maintainer: ' + vm.varietyModels['Variety'].maintainerVarietyNumber + ' is invalid!');
                return;
            }

            if (vm.noFemaleLineCodeMatch && vm.varietyModels['Variety'].femaleVarietyNumber) {
                logger.error('Line code female: ' + vm.varietyModels['Variety'].femaleVarietyNumber + ' is invalid!');
                return;
            }

            if (vm.noMaleLineCodeMatch && vm.varietyModels['Variety'].maleVarietyNumber) {
                logger.error('Line code male: ' + vm.varietyModels['Variety'].maleVarietyNumber + ' is invalid!');
                return;
            }

            if ((vm.varietyModels['Variety'].multiplicationIndicator == 'SH'
                || vm.varietyModels['Variety'].multiplicationIndicator == 'FX')
                && ((vm.varietyModels['Variety'].femaleVarietyNumber || '') == '')
                && ((vm.varietyModels['Variety'].maleVarietyNumber || '') == '')) {
                if (((vm.varietyModels['Female'].varietyResearchCode || '') != '') && ((vm.varietyModels['Male'].varietyResearchCode || '') != '')) {

                    //---
                    var modelMessage = {
                        modalTitle: 'Confirm!',
                        modalMessage: 'New hybrid variety will be created with new female and male variety as its parent. Press Ok to continue.'
                    }
                    var confirmResult = vm.open('createVarietyConfirmModal.html', confirmModalCtrl, modelMessage);

                    confirmResult.then(function () {
                        // confirmed
                        vm.callSaveService();
                    }, function () {
                        // cancalled
                        logger.error('Please enter the female and male Line code');
                    });
                    //---

                } else {
                    vm.callSaveService();
                }

            } else {
                vm.callSaveService();
            }

        }

        vm.callSaveService = function () {
            angular.forEach(vm.SpeciesTypes, function (type) {
                var dfs = [];
                angular.forEach(vm.varietyModels[type].varietyDynamicFields, function (obj, prop) {
                    dfs.push(obj);
                });
                if (dfs.length > 0) {
                    vm.varietyModels[type].dynamicFieldsData = dfs;
                }
            });

            webapi.post("BLBrCreateVarietyService", "SaveVariety", vm.varietyModels)
                    .then(function (result) {
                        logger.success('Add data successfully!');
                        vm.open('createVarietySaveResultModal.html', saveResultModalCtrl, { modalMessage: result.data })
                            .then(function () {
                                // closed
                                // refresh the page.
                                $state.go('.', {}, { reload: true });
                            }, function () {
                                // cancalled
                            });
                    },
                    function (result) {
                        // error handler
                        logger.error(result.data.message);
                    });
        };

        var varietyCodeErrorMessage = //"Please enter a valid NX/line code" +
                                 "<div>NX / Line Code should be according to the following rules:</div>"
                                + "<ul>"
                                + "<li>Minimum 6 positions, maximum 16 positions</li>"
                                + "<li>The parent line code can be 2 char only</li>"
                                + "<li>No spaces in the codes</li>"
                                + "<li>Codes can be Alphanumerical</li>"
                                + "<li>In addition to alpha-characters and numbers, only horizontal dash ( -) is allowed</li>"
                                + "<li>Only use CAPITAL alpha-characters</li>"
                                + "<li>Code should not start with 0 (zero)</li>"
                                + "</ul>";

        //----validation start
        function checkVarietyCode() {
            /*
            Variety code should be according to the following rules:
            Minimum 6 positions, maximum 16 positions
            No spaces in the codes
            Codes can be Alphanumerical 
            In addition to alpha-characters and numbers, only horizontal dash ( -) is allowed
            Only use CAPITAL alpha-characters
            Code should not start with 0 (zero)*/

            /* The above rules are changed as percase Id 826111
            (-) are not allowed.
            */

            /* The above rules are changed as per 0856568
            All Special characters except (,;) is allowed when parent line = 'Yes'
            When Parent line = 'No' The old format applies
            
            The new format rules are
            1. Minimum 6 positions, maximum 16 positions 
            2. No spaces in the codes 
            3. Codes can be Alphanumerical 
            4. All characters are allowed, except for ; (semi-colon) and , (comma)  
            5. Only use CAPITAL alpha-characters 
            6. Code should not start with 0 (zero) 
            */

            var varCode = vm.varietyModels['Variety'].varietyCode || '';//document.Form1.txtVarietyCode.value;
            var IsParentLineyes = vm.varietyModels['Variety'].isParentLine === 'YES'//document.getElementById('rdbIsParentLine_0').checked;
            var specialFlag = 0;

            if (IsParentLineyes) {
                //alert('Yes'); 
                var iChars = ";,";
                for (var i = 0; i < varCode.length; i++) {
                    if (iChars.indexOf(varCode.charAt(i)) != -1) {
                        specialFlag = 1;
                        break;
                    }
                }
            }
            else {
                // alert('No');
                //take the ¡°-¡° out of iChars \n!@#$%^&*()+=~[]\\\';,./{}|\":<>?-_
                var iChars = "!@#$%^&*()+=~[]\\\';,./{}|\":<>?_";
                for (var i = 0; i < varCode.length; i++) {
                    if (iChars.indexOf(varCode.charAt(i)) != -1) {
                        specialFlag = 1;
                        break;
                    }

                }
            }


            var errorMessage = "Please enter a valid NX/line code" + varietyCodeErrorMessage;
            var minLength = 6;
            if (IsParentLineyes) {
                minLength = 2;
            }

            if (varCode.length > 0) {
                if (varCode.length < minLength || varCode.length > 16 || varCode.indexOf(' ') != -1 || varCode.indexOf('0') == 0 || varCode.match(/[a-z]/)) {
                    //alert('Please enter a valid variety code');
                    logger.error(errorMessage);
                    return false;
                }
                else if (specialFlag == 1) {
                    //take the ¡°-¡° out of iChars \n!@#$%^&*()+=~[]\\\';,./{}|\":<>?-_
                    logger.error(errorMessage);
                    return false;
                }
                else {
                    return true;
                }
            }
            else
                return true;


        }

        function checkFemaleVarietyCode() {

            /*
            Variety code should be according to the following rules:
            Minimum 6 positions, maximum 16 positions
            No spaces in the codes
            Codes can be Alphanumerical 
            In addition to alpha-characters and numbers, only horizontal dash ( -) is allowed
            Only use CAPITAL alpha-characters
            Code should not start with 0 (zero)*/

            /* The above rules are changed as percase Id 826111
            (-) are not allowed.
            */

            /* The above rules are changed as per 0856568
            All Special characters except (,;) is allowed when parent line = 'Yes'
            When Parent line = 'No' The old format applies
            
            The new format rules are
            1. Minimum 6 positions, maximum 16 positions 
            2. No spaces in the codes 
            3. Codes can be Alphanumerical 
            4. All characters are allowed, except for ; (semi-colon) and , (comma)  
            5. Only use CAPITAL alpha-characters 
            6. Code should not start with 0 (zero) 
            */
            var varCode = vm.varietyModels['Female'].varietyCode || ''; //document.Form1.txtFemaleVarietyCode.value;

            if (varCode == '') {
                return true;
            }
            //alert(varCode);
            var specialFlag = 0;
            var iChars = ";,";
            for (var i = 0; i < varCode.length; i++) {
                if (iChars.indexOf(varCode.charAt(i)) != -1) {
                    specialFlag = 1;
                    break;
                }

            }

            var errorMessage = "Please enter a valid female variety code" + varietyCodeErrorMessage;
            // Currently the minimum number of characters allowed for parent line is 6. But the breeder says that there are cases where the parent line code can be 2 char only. 

            if (varCode.length > 0) {
                if (varCode.length < 2 || varCode.length > 16 || varCode.indexOf(' ') != -1 || varCode.indexOf('0') == 0 || varCode.match(/[a-z]/) || specialFlag == 1) {
                    logger.error(errorMessage);
                    return false;
                }
                else {
                    return true;
                }
            }
            else
                return true;


        }

        function checkMaleVarietyCode() {

            /*
            Variety code should be according to the following rules:
            Minimum 6 positions, maximum 16 positions
            No spaces in the codes
            Codes can be Alphanumerical 
            In addition to alpha-characters and numbers, only horizontal dash ( -) is allowed
            Only use CAPITAL alpha-characters
            Code should not start with 0 (zero)*/

            /* The above rules are changed as percase Id 826111
            (-) are not allowed.
            */

            /* The above rules are changed as per 0856568
            All Special characters except (,;) is allowed when parent line = 'Yes'
            When Parent line = 'No' The old format applies
            
            The new format rules are
            1. Minimum 6 positions, maximum 16 positions 
            2. No spaces in the codes 
            3. Codes can be Alphanumerical 
            4. All characters are allowed, except for ; (semi-colon) and , (comma)  
            5. Only use CAPITAL alpha-characters 
            6. Code should not start with 0 (zero) 
            */

            var varCode = vm.varietyModels['Male'].varietyCode || ''; //document.Form1.txtMaleVarietyCode.value;

            if (varCode == '') {
                return true;
            }
            //alert(varCode);
            var specialFlag = 0;

            var iChars = ";,";
            for (var i = 0; i < varCode.length; i++) {
                if (iChars.indexOf(varCode.charAt(i)) != -1) {
                    specialFlag = 1;
                    break;
                }

            }
            var errorMessage = "Please enter a valid male variety code" + varietyCodeErrorMessage;
            // Currently the minimum number of characters allowed for parent line is 6. But the breeder says that there are cases where the parent line code can be 2 char only. 

            if (varCode.length > 0) {
                if (varCode.length < 2 || varCode.length > 16 || varCode.indexOf(' ') != -1 || varCode.indexOf('0') == 0 || varCode.match(/[a-z]/) || specialFlag == 1) {
                    logger.error(errorMessage);
                    return false;
                }
                else {
                    return true;
                }
            }
            else
                return true;


        }

        function checkMaintainerVarietyCode() {

            /*
            Variety code should be according to the following rules:
            Minimum 6 positions, maximum 16 positions
            No spaces in the codes
            Codes can be Alphanumerical 
            In addition to alpha-characters and numbers, only horizontal dash ( -) is allowed
            Only use CAPITAL alpha-characters
            Code should not start with 0 (zero)*/

            /* The above rules are changed as percase Id 826111
            (-) are not allowed.
            */

            /* The above rules are changed as per 0856568
            All Special characters except (,;) is allowed when parent line = 'Yes'
            When Parent line = 'No' The old format applies
            
            The new format rules are
            1. Minimum 6 positions, maximum 16 positions 
            2. No spaces in the codes 
            3. Codes can be Alphanumerical 
            4. All characters are allowed, except for ; (semi-colon) and , (comma)  
            5. Only use CAPITAL alpha-characters 
            6. Code should not start with 0 (zero) 
            */

            var varCode = vm.varietyModels['Maintainer'].varietyCode || ''; //document.Form1.txtMaintainerVarietyCode.value;
            if (varCode == '') {
                return true;
            }
            //alert(varCode);
            var specialFlag = 0;
            var iChars = ";,";
            for (var i = 0; i < varCode.length; i++) {
                if (iChars.indexOf(varCode.charAt(i)) != -1) {
                    specialFlag = 1;
                    break;
                }

            }
            var errorMessage = "Please enter a valid maintainer variety code" + varietyCodeErrorMessage;
            // Currently the minimum number of characters allowed for parent line is 6. But the breeder says that there are cases where the parent line code can be 2 char only. 

            if (varCode.length > 0) {
                if (varCode.length < 2 || varCode.length > 16 || varCode.indexOf(' ') != -1 || varCode.indexOf('0') == 0 || varCode.match(/[a-z]/) || specialFlag == 1) {
                    logger.error(errorMessage);
                    return false;
                }
                else {
                    return true;
                }
            }
            else
                return true;


        }

        function checkVarietyReserachCode() {
            var varCode = vm.varietyModels['Variety'].varietyResearchCode || ''; //document.Form1.txtVarietyResearchCode.value;
            var specialFlag = 0;


            var iChars = ",";
            for (var i = 0; i < varCode.length; i++) {
                if (iChars.indexOf(varCode.charAt(i)) != -1) {
                    specialFlag = 1;
                    break;
                }
            }

            if (specialFlag == 1) {
                logger.error('Variety Breeding code cannot have comma in it');
                return false;
            }
            else {
                return true;
            }


        }

        function checkFemaleVarietyReserachCode() {
            var varCode = vm.varietyModels['Female'].varietyResearchCode || '';//document.Form1.txtFemaleVarietyResearchCode.value;
            var specialFlag = 0;


            var iChars = ",";
            for (var i = 0; i < varCode.length; i++) {
                if (iChars.indexOf(varCode.charAt(i)) != -1) {
                    specialFlag = 1;
                    break;
                }
            }

            if (specialFlag == 1) {
                logger.error('Female Breeding code cannot have comma in it');
                return false;
            }
            else {
                return true;
            }


        }

        function checkMaleVarietyReserachCode() {
            var varCode = vm.varietyModels['Male'].varietyResearchCode || ''; //document.Form1.txtMaleVarietyResearchCode.value;
            var specialFlag = 0;


            var iChars = ",";
            for (var i = 0; i < varCode.length; i++) {
                if (iChars.indexOf(varCode.charAt(i)) != -1) {
                    specialFlag = 1;
                    break;
                }
            }

            if (specialFlag == 1) {
                logger.error('Male Breeding Code cannot have comma in it');
                return false;
            }
            else {
                return true;
            }


        }

        function checkMaintainerVarietyResearchCode() {
            var varCode = vm.varietyModels['Maintainer'].varietyResearchCode || ''; //document.Form1.txtMaintainerVarietyResearchCode.value;
            var specialFlag = 0;


            var iChars = ",";
            for (var i = 0; i < varCode.length; i++) {
                if (iChars.indexOf(varCode.charAt(i)) != -1) {
                    specialFlag = 1;
                    break;
                }
            }

            if (specialFlag == 1) {
                logger.error('Maintainer Breeding Code cannot have comma in it');
                return false;
            }
            else {
                return true;
            }


        }

        function fnValidateSpecies() {

            if (
                    ((vm.varietyModels['Variety'].speciesCode || '') == '')
                || (vm.varietyModels['Variety'].geneticOwner == null)
                || ((vm.varietyModels['Variety'].varietyTeam || '') == '')
                || ((vm.varietyModels['Variety'].varietyCode || '') == '') //NX / line code
                || ((vm.varietyModels['Variety'].varietyResearchCode || '') == '')//Breeding code
                || ((vm.varietyModels['Variety'].multiplicationIndicator || '') == '')//Type of cross

                ) {
                logger.error("Please fill in all the mandatory fields in the Variety column");
                return false;
            }

            var validationFailed = false;
            // dynamic fields
            if ((vm.varietyModels['Variety'].speciesCode || '').toUpperCase() === SUNFLOWER) {
                angular.forEach(vm.VarietyDynamicFieldsTypes, function (dynamicField, key) {
                    if (dynamicField.ch_IsMandatory_Hybrid === 'Y') {
                        var dynFieldObj = vm.varietyModels['Variety'].varietyDynamicFields[dynamicField.vch_LabelName] || {};
                        if ((dynFieldObj.dataFieldName || '') === '') {
                            logger.error("Please fill all the mandatory fields in the Variety column for " + dynamicField.vch_LabelName);
                            validationFailed = true;
                            return false;
                        }
                    }
                });
                if (validationFailed) {
                    return false;
                }
            }

            if (vm.varietyModels['Variety'].isGMO === 'YES' && (vm.varietyModels['Variety'].gmoTraits || '') === '') {
                logger.error("Please fill the Variety GM Traits Dropdown box");
                return false;
            }

            // loop female, male, maintainer
            angular.forEach(["Female", "Male", "Maintainer"], function (value, key) {

                if (
                       ((vm.varietyModels[value].geneticOwner) != null)
                    || ((vm.varietyModels[value].varietyTeam || '') != '')
                    || ((vm.varietyModels[value].varietyCode || '') != '')
                    || ((vm.varietyModels[value].varietyResearchCode || '') != '')
                    || ((vm.varietyModels[value].multiplicationIndicator || '') != '')

                   ) {
                    if (
                           ((vm.varietyModels[value].speciesCode || '') == '')
                        || ((vm.varietyModels[value].geneticOwner) == null)
                        || ((vm.varietyModels[value].varietyTeam || '') == '')
                        || ((vm.varietyModels[value].varietyCode || '') == '')
                        || ((vm.varietyModels[value].varietyResearchCode || '') == '')
                        || ((vm.varietyModels[value].multiplicationIndicator || '') == '')

                       ) {
                        logger.error("Please fill all the mandatory fields in the " + value + " variety column");
                        validationFailed = true;
                        return false;
                    }

                    if (vm.varietyModels[value].isGMO === 'YES' && (vm.varietyModels[value].gmoTraits || '') === '') {
                        logger.error("Please fill the " + value + " GM Traits Dropdown box");
                        validationFailed = true;
                        return false;
                    }

                }
                var hasDynValCount = 0;
                // dynamic fields
                if ((vm.varietyModels[value].speciesCode || '').toUpperCase() === SUNFLOWER) {
                    angular.forEach(vm.VarietyDynamicFieldsTypes, function (dynamicField, key) {
                        if (dynamicField.ch_IsMandatory_Parentline === 'Y') {
                            var arrDynFieldObjs = vm.varietyModels[value].varietyDynamicFields || {};
                            var dynFieldObj = arrDynFieldObjs[dynamicField.vch_LabelName] || {};
                            if ((dynFieldObj.dataFieldName || '') === '' && ((vm.varietyModels[value].varietyCode || '') != '' || hasDynValCount > 0)) {
                                if (validationFailed) {
                                    return false;
                                }
                                logger.error("Please fill all the mandatory fields in the " + value + " variety column for " + dynamicField.vch_LabelName);
                                validationFailed = true;
                                return false;
                            }

                            if ((dynFieldObj.dataFieldName || '') !== '') {
                                hasDynValCount++;
                            }
                        }
                    });
                }

                if (hasDynValCount > 0 && (vm.varietyModels[value].varietyCode || '') === '') {
                    if (validationFailed) {
                        return false;
                    }
                    logger.error("Please fill all the mandatory fields in the " + value + " variety column");
                    validationFailed = true;
                    return false;
                }

            });

            if (validationFailed) {
                return false;
            }

            if ((vm.varietyModels['Variety'].multiplicationIndicator == 'LP') && (((vm.varietyModels['Variety'].femaleVarietyNumber || '') != '') || ((vm.varietyModels['Variety'].maleVarietyNumber || '') != ''))) {
                logger.error("For LP variety, Female and Male Line code field should be empty.");
                return false;
            }

            if ([vm.varietyModels['Variety'].varietyCode || ''
               , vm.varietyModels['Female'].varietyCode || ''
               , vm.varietyModels['Male'].varietyCode || ''
               , vm.varietyModels['Maintainer'].varietyCode || ''].duplicated()) {
                logger.error("Same variety code can not be given on the screen twice.");
                return false;
            }

            if ([vm.varietyModels['Variety'].varietyResearchCode || ''
               , vm.varietyModels['Female'].varietyResearchCode || ''
               , vm.varietyModels['Male'].varietyResearchCode || ''
               , vm.varietyModels['Maintainer'].varietyResearchCode || ''].duplicated()) {
                logger.error("Same Breeding code can not be given on the screen twice.");
                return false;
            }

            if ([vm.varietyModels['Variety'].speciesCode || ''
               , vm.varietyModels['Female'].speciesCode || ''
               , vm.varietyModels['Male'].speciesCode || ''
               , vm.varietyModels['Maintainer'].speciesCode || ''].unique().length > 1) {
                logger.error("Please enter the same species codes for all species.");
                return false;
            }


            return true;
        }

        function checkForGMOandGMTraits() {
            var IsParentLineyes = vm.varietyModels['Variety'].isParentLine === 'YES';

            //if (vm.varietyModels['Variety'].speciesCode !== 'SWC' && vm.varietyModels['Variety'].isGMO === 'YES') {
            //    logger.error("The species except SWEETCORN cannot have GMO and GM traits! ");
            //    return false;
            //}
            var ch_is_internal = vm.varietyModels['Variety'].geneticOwner.ch_is_internal || '';
            ch_is_internal = ch_is_internal.substring(0, 1);
            if ((IsParentLineyes == false) && ((vm.varietyModels['Variety'].multiplicationIndicator == 'SH'
                                             || vm.varietyModels['Variety'].multiplicationIndicator == 'FX'))
                                             && (ch_is_internal.indexOf('Y') !== -1)) {
                if (((vm.varietyModels['Female'].varietyCode || '') === "" && (vm.varietyModels['Variety'].femaleVarietyNumber || '') === "")
                    || ((vm.varietyModels['Male'].varietyCode || '') === "" && (vm.varietyModels['Variety'].maleVarietyNumber || '') === "")) {
                    logger.error("It is not allowed to create a hybrid (SH, FX) without parent lines. Please add parent lines details or numbers before saving!");
                    return false;
                }

            }


            return true;
        }

        function checkMaintainerDependenceOfFemale() {
            // if maintainer has input data, then female must provide(line code or input female data)

            if (// variety and maintainer are input
                (vm.varietyModels['Variety'].varietyCode || '') !== ''
                && (vm.varietyModels['Maintainer'].varietyCode || '') !== ''

                // but female is no input
                && ((vm.varietyModels['Female'].varietyCode || '') === '') && ((vm.varietyModels['Variety'].femaleVarietyNumber || '') === '')
                ) {

                logger.error("It is not allowed to create Maintainer without Female!");
                return false;
            }

            return true;

        }



        //----validation end

        Array.prototype.unique = function () {
            var arr = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i] !== '' && arr.indexOf(this[i]) === -1) {
                    arr.push(this[i]);
                }
            }
            return arr;
        }

        Array.prototype.duplicated = function () {
            var arr = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i] !== '' && arr.indexOf(this[i]) !== -1) {
                    return true;
                }

                arr.push(this[i]);
            }
            return false;
        }

    }]);

})();