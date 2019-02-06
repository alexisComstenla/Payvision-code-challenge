var app = angular.module("app", []);
app.service("transactionService", [
  "$q",
  "$http",
  function transactionService($q, $http) {
    return {
      getTransactionData: function() {
        var defered, promise, result;
        defered = $q.defer();
        promise = defered.promise;
        //var authData = $base64.encode('code-challenge' + ':' + 'payvisioner'),headers = {"Authorization": "Basic " + authData};;
        var headers = {
          Authorization: "Basic Y29kZS1jaGFsbGVuZ2U6cGF5dmlzaW9uZXI="
        };
        $http
          .get(
            "https://jovs5zmau3.execute-api.eu-west-1.amazonaws.com/prod/transactions",
            { headers: headers }
          )
          .then(
            function(data) {
              defered.resolve(data.data);
            },
            function(err) {
              defered.reject(err);
            }
          );
        return promise;
      }
    };
  }
]);
app.controller("transactionController", [
  "$scope",
  "$filter", 
  "transactionService",
  function transactionController($scope,$filter, transactionService) {
    $scope.transactions;
    $scope.selectedTypes = {
      availableOptions: [
        { id: 0, name: "Transaction type", code: "" },
        { id: 1, name: "Payment", code: "payment" },
        { id: 2, name: "Authorize", code: "authorize" },
        { id: 3, name: "Credit", code: "credit" }
      ],
      selectedOption: { id: 0, name: "Transaction type" }
    };
    $scope.selectedCurrency = {
      availableOptions: [
        { id: 0, name: "Currency", code: "" },
        { id: 1, name: "USD", code: "USD" },
        { id: 2, name: "EUR", code: "EUR" },
        { id: 3, name: "GBP", code: "GBP" }
      ],
      selectedOption: { id: 0, name: "Currency" }
    };
    $scope.brandNames= 
      [
        {id: 1010, name: "Amex"},
        {id: 1020, name: "MasterCard"},
        {id: 1030, name: "Visa"},
        { id: 1060, name: "Diners Club"}
      ];
    $scope.getTransactionData = function() {
      transactionService.getTransactionData().then(function(data) {
        $scope.transactions = data;
        angular.forEach($scope.transactions, function(value, key){
          value.brandName = $scope.getBrandName(value.brandId);
        });
      });
    };
    $scope.changeStyle = function(id){
      if(angular.element(document.querySelector("#parent"+id)).hasClass("table-content-expanded"))
      {
        angular.element(document.querySelector("#parent"+id)).removeClass("table-content-expanded");
        angular.element(document.querySelector("#parent"+id)).addClass("table-content-colapsed");
        angular.element(document.querySelector("#detail"+id)).removeClass("table-content-expanded");
        angular.element(document.querySelector("#detail"+id)).addClass("table-content-colapsed");
      }
      else{
        angular.element(document.querySelector("#parent"+id)).removeClass("table-content-colapsed");
        angular.element(document.querySelector("#parent"+id)).addClass("table-content-expanded");
        angular.element(document.querySelector("#detail"+id)).removeClass("table-content-colapsed");
        angular.element(document.querySelector("#detail"+id)).addClass("table-content-expanded");
      }
    };
    $scope.getBrandName = function(value){
      return $filter('filter')($scope.brandNames, {id: value})[0].name;
    }
    $scope.getTransactionData();
  }
]);
