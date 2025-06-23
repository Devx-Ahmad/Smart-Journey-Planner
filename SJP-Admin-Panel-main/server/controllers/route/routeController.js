const Sequence = require('../../models/sequence/Sequence');
const Route = require('../../models/route/Route');  
const mongoose = require('mongoose');

exports.addRoute = async (req, res) => {

    const locals = {
        title: 'Add New Route',
        description: 'Smart Journey Planner',
    }
    try {
       const sequences = await Sequence.find({}, 'seqName');
       console.log(sequences)
       res.render('route/addroute',{locals,sequences});

    } catch (err) {
        console.log(err);
    }
}


exports.postRoute = async (req, res) => {
    console.log(req.body);

    // Find the highest existing routeId
    const highestRoute = await Route.findOne().sort({ routeId: -1 });

    let nextRouteId;
    if (highestRoute) {
        // Extract the number part of the highest routeId and increment it
        const match = highestRoute.routeId.match(/\d+/);
        const highestRouteId = match ? parseInt(match[0]) : 0;
        nextRouteId = `RT-${highestRouteId + 1}`;
    } else {
        // If no routes exist, start with RT-1
        nextRouteId = "RT-1";
    }

    const newRoute = new Route({
        routeId: nextRouteId, // Use the formatted routeId
        routeName: req.body.routeName,
        status: req.body.status,
        seqId: req.body.seqDropdown
    });

    try {
        await Route.create(newRoute);
        req.flash("info", "New Route has been added");
        res.redirect(`/home`);
    } catch (err) {
        console.log(err);
    }
}



exports.viewRoute = async (req, res) => {

  try {
    const route = await Route.findOne({ _id: req.params.id })

    const locals = {
      title: "View Route Data",
      description: "Smart Journey Planner Admin Panel",
    };

    res.render('route/viewroute', {
      locals,
      route,
    })

  } catch (error) {
    console.log(error);
  }

}


exports.editRoute = async (req, res) => {

  try {
    const route = await Route.findOne({ _id: req.params.id });
    const sequences = await Sequence.find({}, 'seqName');

    const locals = {
      title: "View Route Data",
      description: "Smart Journey Planner Admin Panel",
    };
   
    res.render('route/editroute', {
      locals,
      route,
      sequences
    })

  } catch (error) {
    console.log(error);
  }

}

exports.editPost = async (req, res) => {

    try {
    await Route.findByIdAndUpdate(req.params.id,{
        routeId: req.body.routeId,
        routeName: req.body.routeName,
        status: req.body.status,
        seqId: req.body.seqDropdown,
        updatedAt: Date.now()
    });
    await res.redirect(`/editroute/${req.params.id}`);
    
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }

}

  exports.deleteRoute = async (req, res) => {
  try {
    await Route.deleteOne({ _id: req.params.id });
    res.redirect("/home")
  } catch (error) {
    console.log(error);
  }
}

exports.routes = async (req, res) => {
 
    let perPage = 12;
    let page = req.query.page || 1;

    try {
      const routes = await Route.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await Route.count();

      res.render('route/routes', {
        routes,
        current: page,
        pages: Math.ceil(count / perPage),
      });

    } catch (error) {
      console.log(error);
    }
}
