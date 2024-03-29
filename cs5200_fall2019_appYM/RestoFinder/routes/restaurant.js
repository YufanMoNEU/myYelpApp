const express = require("express");
const router = express.Router();
const Restaurant = require("../data/models/Restaurant.schema.server");
const Review = require("../data/models/Review.schema.server");
//const Event = require("../data/models/Event.schema.server");
// post restaurant
router.post("/", async (req, res) => {
  try {
    const restaurant = new Restaurant({
      name: req.body.name,
      id: req.body.id,
      is_claimed: req.body.is_claimed,
      location: {
        address1: req.body.location.address1,
        address2: req.body.location.address2,
        city: req.body.location.city,
        state: req.body.location.state,
        zip_code: req.body.location.zip_code,
        country: req.body.location.country,
        display_address: req.body.location.display_address,
        cross_streets: req.body.location.cross_streets
      },
      phone: req.body.phone,
      url: req.body.url,
      //price: req.body.price,
      rating: req.body.rating,
      review_count: req.body.review_count,
      //is_closed: req.body.is_closed,
      image_url: req.body.image_url,
      //hours: req.body.hours,
      photos: req.body.photos,
      //categories: req.body.categories
    });
    restaurant.validate();
    const result = await restaurant.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.send(restaurants);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const restaurant = await Restaurant.find({ _id: id });
    res.send(restaurant);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update restaurant
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var restaurant = await Restaurant.find({ _id: id });
    restaurant = restaurant[0];
    if (!restaurant) return res.status(404).send("Object not found");

    Restaurant.updateOne(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          id: req.body.id,
          is_claimed: req.body.is_claimed,
          location: {
            address1: req.body.location.address1,
            address2: req.body.location.address2,
            city: req.body.location.city,
            state: req.body.location.state,
            zip_code: req.body.location.zip_code,
            country: req.body.location.country,
            display_address: req.body.location.display_address,
            cross_streets: req.body.location.cross_streets
          },
          phone: req.body.phone,
          url: req.body.url,
          //price: req.body.price,
          rating: req.body.rating,
          review_count: req.body.review_count,
          // is_closed: req.body.is_closed,
          image_url: req.body.image_url,
          // hours: req.body.hours,
          photos: req.body.photos,
          // categories: req.body.categories
        }
      }
    )
      .then(async () => {
        var result = await Restaurant.find({ _id: id });
        res.send(result[0]);
      })
      .catch(err => {
        return res.status(400).send(err);
      });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// delete restaurant
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    var restaurant = await Restaurant.find({ _id: id });
    restaurant = restaurant[0];
    if (!restaurant) return res.status(404).send("Object not found");
    const result = await Restaurant.deleteOne({ _id: restaurant._id });
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get reviews for restaurant
router.get("/:id/review", async (req, res) => {
  try {
    let id = req.params.id;
    var restaurant = await Restaurant.find({ _id: id });
    restaurant = restaurant[0];
    if (!restaurant) return res.status(404).send("Object not found");
    const reviews = await Review.find({ restaurant: id })
      .populate("user")
      .populate("restaurant");
    res.send(reviews);
  } catch (err) {
    res.status(400).send(err);
  }
});
// get events for restaurant
// router.get("/:id/event", async (req, res) => {
//   try {
//     let id = req.params.id;
//     var restaurant = await Restaurant.find({ _id: id });
//     restaurant = restaurant[0];
//     if (!restaurant) return res.status(404).send("Object not found");
//     const events = await Review.find({ restaurant: id }).populate("admin");
//     res.send(events);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// search by term for restaurant
router.get("/search/:term", async (req, res) => {
  try {
    let term = req.params.term;
    var regex = new RegExp(term, "i");
    const restaurants = await Restaurant.find({ name: regex }).limit(15);
    const returnRestaurants = [];
    const seen = [];
    for (r of restaurants) {
      if (!seen.includes(r.name)) {
        returnRestaurants.push(r);
        seen.push(r.name);
      }
    }
    res.send(returnRestaurants);
  } catch (err) {
    res.status(400).send(err);
  }
});


module.exports = router;
