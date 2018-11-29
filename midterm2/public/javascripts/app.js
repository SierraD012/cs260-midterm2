// This is the CLIENT-SIDE app.js

angular.module('shopping', [])  //this module name has to match what you have in the html "ng-app" tag
.controller('MainCtrl', [   //this also has to match your html
  '$scope','$http',
  function($scope,$http){
    
      //these data members are client-side only 
      $scope.shopItems = [];
      $scope.submittedCart = []; //this is ONLY used for updating the Submitted Ballot section
      $scope.shopTotal = 0.0; //just for fun
      
       //Gets a list of all items from the DB using a REST call
      $scope.getAll = function() {
        console.log(">GetAll() called");
        return $http.get('/shopItems').success(function(data){
          //console.log(">GetAll(): got response ");
          //console.dir(data);
          angular.copy(data, $scope.shopItems);  //this copies the stuff coming back from the REST call into the scope array
        });
      };
      $scope.getAll();
      
      // Customer page only 
      $scope.submitPurchase = function() {
        console.log(">SubmitPurchase() called");
        $scope.submittedCart = []; //empty cart out from last time
        $scope.shopTotal = 0.0;
        
        //Get the list of ones they picked and call scope.orderProduct on them
        for (var i = 0; i < $scope.shopItems.length; i++){
          var currItem = $scope.shopItems[i];
          //console.log("\t>SubmitBallot(): currCand= ");
          console.dir(currItem);
          
          if (currItem.checked) {
            $scope.submittedCart.push(currItem);
            $scope.orderProduct(currItem);
            $scope.shopTotal += currItem.price;
          }
        }
         console.log(">SubmitPurchase(): shopTotal= " + $scope.shopTotal);
         $("#showTotal").text("Total: $" + $scope.shopTotal + ".00");  //this is the only place I use jquery
         
        //Deselect the items they just bought
        for (var j = 0; j < $scope.shopItems.length; j++){
            $scope.shopItems[j].checked = false;
        }
      };
      
      // Customer page only 
      //This tells the server to save the comment's num orders
      $scope.orderProduct = function(product) {
        console.log(">OrderProduct() called, prod= " + product.name);

        return $http.put('/shopItems/' + product._id + '/order') //id is built into the shopItem object
          .success(function(data){
            product.numOrders += 1; //this is just to update the scope 
          }).error(function(err) {
            console.log(">OrderProduct(): error sending order to server: ", err);
          });
      };
      
      // Admin page only 
      $scope.addProduct = function() {
        console.log(">AddProduct(): starting, name= "+$scope.newProductName);
        var newProd = $scope.newProductName;
        if (newProd != '' || newProd == undefined) {
            $scope.sendProduct({
              name: newProd,
              price: $scope.newProductPrice,
              imgURL: $scope.newProductURL,
              checked:false
            });
            //Empty out new product input fields
            $scope.newProductName='';
            $scope.newProductPrice='';
            $scope.newProductURL='';
        }
        //don't need to call getProducts after this because sendProduct already pushes the newProd to the scope array! 
      };
      
      // Admin page only 
      $scope.sendProduct = function(product){
        $http.post('/shopItems', product).success(function(data){  //Make sure these HTTP calls match with the routers on index.js!!
          //data just comes back with a copy of the product you posted 
          console.log(">SendProduct: got data=" );
          console.dir(data);
          $scope.shopItems.push(data); //update scope array
        });
    };
  
      // Tells the server to delete this product
      $scope.delete = function(product) {
          console.log(">Delete(): starting, prod= "+ product.name);
          console.dir(product);
          
          $http.delete('/shopItems/' + product._id )
            .success(function(data){
            });
          $scope.getAll(); //update the view
        };
      
  }
]);