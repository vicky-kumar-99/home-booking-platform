const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {checkAuthentication,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
 const {storage} = require("../cloudConfig.js");
//  const upload = multer({ dest: 'uploads/' });
 const upload = multer({storage});

// index route .....
router.get("/", wrapAsync(listingController.index)
);

// new route.....

router.get("/new",checkAuthentication, listingController.renderNewForm );


// show route ......

router.get("/:id", wrapAsync(listingController.showListing)
);

// creat root

router.post("/",
    
    checkAuthentication, 
   
    upload.single("listing[image]"),
    
    validateListing, 

    wrapAsync(listingController.createListing)
);

// router.post("/",upload.single('listing[image]'), (req,res) => {
//      res.send(req.file);
// })

// edit root ......
router.get("/:id/edit",checkAuthentication,isOwner, wrapAsync(listingController.renderEditForm)
);

// update root ......
router.put("/:id",
    checkAuthentication,
    isOwner, 
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.updateListing)
);

// delete root ......

router.delete("/:id",checkAuthentication,isOwner, wrapAsync(listingController.deleteListing)
);

module.exports = router;