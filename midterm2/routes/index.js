// This has all the routes for the server

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ShopItem = mongoose.model('ShopItem');  //Make sure you register this with the 3 mongoose lines at the top of the server-side app.js!!

// GET generic homepage
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET Admin page
router.get('/admin', function(req, res, next) {
  res.sendFile('admin.html', { root: 'public' });
});

// GET Customer page
router.get('/customer', function(req, res, next) {
  res.sendFile('customer.html', { root: 'public' });
});


// Get a list of products from the DB 
router.get('/shopItems', function(req, res, next) {
  console.log("GET products called");
  ShopItem.find(function(err, products){ //calling FIND on the mongoose schema obj
    if(err){ return next(err); } //pass execution forward in the call stack
    
    //console.log("GET products: got items " + products);
    res.json(products);
  });
});

//POST a new product
router.post('/shopItems', function(req, res, next) {
  console.log("POST called");
  var item = new ShopItem(req.body);
  
  item.save(function(err, itemResp){
    if(err) { 
      console.log("POST: Error during save: " + err);
      return next(err);
    }
    console.log("POST: new item success");
    res.json(itemResp);
  });
});


//Deletes the given product
router.delete('/shopItems/:product', function(req, res) {
  //console.log("DELETE called, req=");
  //console.dir(req);
  
  req.product.remove(function(err, product){
    if (err) {
        console.log("DELETE: Error during delete: " + err);
        return err;
    }
  });
  console.log("DELETE: success");
  res.sendStatus(200);
});


//Middleware function that gets a product by id from the db first
router.param('product', function(req, res, next, id) { 
    console.log("MW-PARAM: id= ", id);
    var query = ShopItem.findById(id);
    query.exec(function (err, product){
        if (err) { return next(err); }
        if (!product) { return next(new Error("Product not found")); }
        req.product = product;
        return next(); //pass execution to next middleware function
    });
});

// Middleware function above passes the product down to this function
router.get('/shopItems/:product', function(req, res) {
  res.json(req.product);
});


// Middleware function to increment a product's numOrders
router.put('/shopItems/:product/order', function(req, res, next) {
  //console.log("PUT/ORDER product called, req.product=", req.product);

  req.product.order(function(err, product){  //this is calling order() on the ShopItem object
    if (err) { 
        console.log(">>PUT/ORDER: error during order: ", err);
        return next(err); 
    }
    console.log("PUT/ORDER: success");
    res.json(product);
  });
});


///////////////
module.exports = router;
