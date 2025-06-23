const Stop = require('../../models/stop/Stop');
const mongoose = require('mongoose');

exports.addStop = (req, res) => {
  const locals = {
    title: 'Add New Stop',
    description: 'Smart Journey Planner',
  }

  res.render('stop/addstop', locals);
}

exports.postStop = async (req, res) => {
  console.log(req.body);

  // Find the highest existing stopId
  const highestStop = await Stop.findOne().sort({ stopId: -1 });

  let nextStopId;
  if (highestStop) {
    // Extract the number part of the highest stopId and increment it
    const match = highestStop.stopId.match(/\d+/);
    const highestStopId = match ? parseInt(match[0]) : 0;
    nextStopId = `STP-${highestStopId + 1}`;
  } else {
    // If no stops exist, start with STP-1
    nextStopId = "STP-1";
  }

  const newStop = new Stop({
    stopId: nextStopId, // Use the formatted stopId
    stopName: req.body.stopName,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });

  try {
    await Stop.create(newStop);
    req.flash("info", "New Stop has been added.");
    res.redirect('/home');
  } catch (err) {
    console.log(err);
  }
}


exports.viewStop = async (req, res) => {

  try {
    const stop = await Stop.findOne({ _id: req.params.id })

    const locals = {
      title: "View Stop Data",
      description: "Smart Journey Planner Admin Panel",
    };

    res.render('stop/viewstop', {
      locals,
      stop,
    })

  } catch (error) {
    console.log(error);
  }

}


exports.editStop = async (req, res) => {

  try {
    const stop = await Stop.findOne({ _id: req.params.id })

    const locals = {
      title: "Edit Stop Data",
      description: "Smart Journey Planner Admin Panel",
    };

    res.render('stop/editstop', {
      locals,
      stop
    })

  } catch (error) {
    console.log(error);
  }

}

exports.editPost = async (req, res) => {

  try {
    await Stop.findByIdAndUpdate(req.params.id, {
      stopId: req.body.stopId,
      stopName: req.body.stopName,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      updatedAt: Date.now()
    });
    await res.redirect(`/editstop/${req.params.id}`);

    console.log('redirected');
  } catch (error) {
    console.log(error);
  }

}

exports.deleteStop = async (req, res) => {
  try {
    await Stop.deleteOne({ _id: req.params.id });
    res.redirect("/home")
  } catch (error) {
    console.log(error);
  }
}

exports.stops = async (req, res) => {

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const stops = await Stop.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Stop.count();

    res.render('stop/stops', {
      stops,
      current: page,
      pages: Math.ceil(count / perPage),
    });

  } catch (error) {
    console.log(error);
  }
}