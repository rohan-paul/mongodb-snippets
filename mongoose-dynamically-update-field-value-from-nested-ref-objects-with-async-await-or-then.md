#### Here I have the model/schema below.

##### ../IES-Rohan-WIP/server/routes/importRoutes.js

#### My Import Model file

```js
"use strict";

const mongoose = require("mongoose"),
  Commodity = require("./commodity"),
  autopopulate = require("mongoose-autopopulate"),
  Port = require("./port"),
  Schema = mongoose.Schema,
  mongoosePaginate = require("mongoose-paginate");

let importSchema = new Schema(
  {
    imported_commodity: {
      type: Schema.Types.ObjectId,
      ref: "Commodity",
      required: true,
      autopopulate: true
    },
    imported_commodity_name: { type: String },
    imported_date: {
      type: Date,
      default: Date.now
    },
    // quantity in M.Tons
    qty_in_mts: {
      type: Number
    },
    // no of vessel per day for imported_commodity
    no_of_vessels_per_day: {
      type: Number
    }
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true
  }
);
// THE BELOW CODE WITH .pre hook WILL NOT WORK to fetch the 'imported_commodity.name' from the nested object of 'imported_commodity' as the 'imported_commodity' is just a pure string formatted object_id and not a full object, that I thought it would be (becasue with a GET request to the api, I was getting the 'imported_commodity' as a full object, but after only the POST request, I was getting the 'imported_commodity' as ONLY a singel objectId)

// importSchema.pre("save", function(next) {
//   if (!this.imported_commodity_name) {
//     this.imported_commodity_name = this.imported_commodity.name;
//   }
//   next();
// });

// plugins
importSchema.plugin(autopopulate);
importSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Import", importSchema);
```

## THE PROBLEM

#### When I send a POST request to add a new item to the schema, it should return me the following (below) in Postman as the new item added (See I have "imported_commodity_name": "silicon-12", as a top-lvel field that has been created in my backend routes file). The key requirement is, for the referenced Model (Commodity), I am passing only the ObjectId for the field 'imported_commodity' but in the returned data, I will need the field 'imported_commodity_name' as a separate top level field with data populated from the referenced Model 'Commodity'

#### The reason I need this variable as a top-level field rather than as a nested object, is because of the sort functionality of Material-UI table. While I was able to render the table rows properly by fetching this value from the nested returned object. But the sort functionality's various util functions were becoming too uncontrollable without a top-level field value.

#### Here's my Postman POST request body to the API - http://localhost:3000/api/imports

```js
{
	"imported_commodity":"5c6121e4722f134f27c49ee4",
	"imported_date":"2019-02-13",
	"qty_in_mts":"89",
	"no_of_vessels_per_day":"299",
	"port": {
            "country": "India",
            "_id": "5bdaadc9ebae106aaa8ca247",
            "name": "test-port-name",
            "phone_number": 9120656259,
            "email": "test@gmail.com",
            "key_contact": "5bd983e4a18ceecf4bba3c48"
        }
}
```

And here's the correct return from the POST request that I am expecting.

```js
{
    "_id": "5c63e31a52cfb71e2f868f86",
    "imported_commodity": "5c6121e4722f134f27c49ee4",
    "imported_date": "2019-02-13T00:00:00.000Z",
    "qty_in_mts": 89,
    "no_of_vessels_per_day": 299,
    "port": "5bdaadc9ebae106aaa8ca247",
    "imported_commodity_name": "silicon-12",
    "createdAt": "2019-02-13T09:27:54.900Z",
    "updatedAt": "2019-02-13T09:27:54.900Z",
    "__v": 0
}
```

The GET request was sending the below data (BEFORE IMPLEMENTING THE SOLUTION). As you can see in the GET request the "imported_commodity" is full nested object.

```js
    {
        "_id": "5c63e31a52cfb71e2f868f86",
        "imported_commodity": {
            "_id": "5c6121e4722f134f27c49ee4",
            "name": "silicon-12",
            "type": "Material",
            "createdAt": "2019-02-11T07:19:00.608Z",
            "updatedAt": "2019-02-12T14:21:43.478Z",
            "__v": 0
        },
        "imported_date": "2019-02-13T00:00:00.000Z",
        "qty_in_mts": 89,
        "no_of_vessels_per_day": 299,
        "port": null,
        "createdAt": "2019-02-13T09:27:54.900Z",
        "updatedAt": "2019-02-13T09:27:54.900Z",
        "__v": 0
    },

```

AFTER IMPLEMENTING THE SOLUTION (detailed below in the routes code) - GET request would send me the below. Now see I have the top-level field "imported_commodity_name" updated dynamically in my backend routes code.

```js
    {
        "_id": "5c63e31a52cfb71e2f868f86",
        "imported_commodity": {
            "_id": "5c6121e4722f134f27c49ee4",
            "name": "silicon-12",
            "type": "Material",
            "createdAt": "2019-02-11T07:19:00.608Z",
            "updatedAt": "2019-02-12T14:21:43.478Z",
            "__v": 0
        },
        "imported_date": "2019-02-13T00:00:00.000Z",
        "qty_in_mts": 89,
        "no_of_vessels_per_day": 299,
        "port": null,
        "imported_commodity_name": "silicon-12",
        "createdAt": "2019-02-13T09:27:54.900Z",
        "updatedAt": "2019-02-13T09:27:54.900Z",
        "__v": 0
    },
```

### SOLUTION - I just had to implement a async-await OR .then() OR exec() techinques in the routes/controllers file to fetch the data from the referenced Model (Commodity) and update the values of the top-level field. So all the below codes for the POST request will work.

```js
// Create a new item (note, I have to have an object_id reference of the relevant commodity) -Working in Postman

// ALTERNATIVE - 1 - POST request to add new item WITH .then() - WORKING
router.post("/", (req, res, next) => {
  let imports = new Import(req.body);
  Commodity.findById(imports.imported_commodity, (err, result) => {
    imports.imported_commodity_name = result.name;
  }).then(() => {
    imports.save((err, newImport) => {
      if (err) {
        console.log("Failed to post new data because ", err);
        //   return next(err);
      } else {
        res.status(200).send(newImport);
      }
    });
  });
});

### ALTERNATIVE - 2 - POST request to add new item WITH async-await - WORKING
router.post("/", async (req, res, next) => {
  let imports = new Import(req.body);

  await Commodity.findById(imports.imported_commodity, (err, result) => {
    imports.imported_commodity_name = result.name;
  });
  imports.save((err, newImport) => {
    if (err) {
      console.log("Failed to post new data because ", err);
      //   return next(err);
    } else {
      res.status(200).send(newImport);
    }
  });
});

#### ALTERNATIVE - 3 - POST request to add new item WITH async-await - WORKING

```js
router.post("/", async (req, res, next) => {
  let imports = await new Import(req.body);

  await Commodity.findById(imports.imported_commodity, (err, result) => {
    imports.imported_commodity_name = result.name;
  }).exec(() => {
    imports.save((err, newImport) => {
      if (err) {
        console.log("Failed to post new data because ", err);
        //   return next(err);
      } else {
        res.status(200).send(newImport);
      }
    });
  });
});
```

#### WITHOUT ANY .then(), Promise or async-await, where the nested object's value will not be grabbed at all in the top level returned object from the POST request - WORKING

```js
router.post("/", (req, res, next) => {
  let imports = new Import(req.body);
  //   imports.port = req.decoded.port._id || "";

  imports.save((err, newImport) => {
    if (err) {
      console.log("Failed to post new data because ", err);
      //   return next(err);
    } else {
      res.status(200).json(newImport);
    }
  });
});
```

#### However, my final implemented solution to the above problem was completely different. That is, I did not add the new top level field to the db-schema from the nested object. Rather, in the backend routing code, after I fetched the data from mongo, I use Array.map to create a new array and adding a new top-level field ('imported_commodity_objectId') to the data. And as a response to the front-end returned that restructured data. I did that with the below utility function in my backend

```js
const addCommodityNameFieldToItems = arr => {
  let newArr = [];
  arr.map(item => {
    if (
      typeof item.imported_commodity_objectId === "object" &&
      item.imported_commodity_objectId !== null
    ) {
      item.imported_commodity_name = item.imported_commodity_objectId.name;
      newArr.push(item);
    }
  });
  return newArr;
};
```

And then the GET request route will do as below

```js
// Working with imported_commodity_name
router.get("/", (req, res, next) => {
  Import.find(
    {},
    null,
    {
      sort: { createdAt: -1 }
    },
    (err, docs) => {
      if (err) {
        return next(err);
      } else {
        let totalItemsWithCommodityNameField = addCommodityNameFieldToItems(
          docs
        );
        res.status(200).json(totalItemsWithCommodityNameField);
      }
    }
  );
});
```


#### Other Reading sources

// https://mongoosejs.com/docs/promises.html
