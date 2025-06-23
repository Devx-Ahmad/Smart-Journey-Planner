const Sequence = require('../../models/sequence/Sequence');
const Stop = require('../../models/stop/Stop');


const mongoose = require('mongoose');

exports.addSequence = async (req, res) => {

  const locals = {
    title: 'Add New Sequence',
    description: 'Smart Journey Planner',
  }
  try {

    res.render('sequence/addsequence', locals);

  } catch (err) {
    console.log(err);
  }
}

exports.postSequence = async (req, res) => {
  console.log(req.body);

  // Find the highest existing seqId
  const highestSequence = await Sequence.findOne().sort({ seqId: -1 });

  let nextSeqId;
  if (highestSequence) {
    // Extract the number part of the highest seqId and increment it
    const match = highestSequence.seqId.match(/\d+/);
    const highestSeqId = match ? parseInt(match[0]) : 0;
    nextSeqId = `PATH-${highestSeqId + 1}`;
  } else {
    // If no sequences exist, start with SEQ-1
    nextSeqId = "PATH-1";
  }

  const newSequence = new Sequence({
    seqId: nextSeqId, // Use the formatted seqId
    seqName: req.body.seqName,
    stops: [],
  });

  try {
    await Sequence.create(newSequence);
    req.flash("info", "New Path has been added and now add stops to your Path");
    res.redirect(`/addstopsequence/${newSequence._id}`);
  } catch (err) {
    console.log(err);
  }
}

exports.addStopSequence = async (req, res) => {

  const messages = req.flash('info');

  const locals = {
    title: 'Add Stops to Sequence',
    description: 'Smart Journey Planner',
  }
  try {
    const stops = await Stop.find({}, 'stopName');
    console.log(stops)
    const sequence = await Sequence.findOne({ _id: req.params.id })
    console.log(sequence)
    res.render('sequence/addstops', { locals, sequence, stops, messages });

  } catch (err) {
    console.log(err);
  }
}


exports.postStopSequence = async (req, res) => {

  const messages = req.flash('info');

  const locals = {
    title: 'Add Stops to Sequence',
    description: 'Smart Journey Planner',
  }

  try {

    const { seqId } = req.params;
    const selectedStop = req.body.stopDropdown;


    if (selectedStop) {
      // Split the selected value into ID and name
      const [stopId, stopName] = selectedStop.split('_');
      const seqNumber = req.body.seqNumber;

      // Find the sequence by seqId
      const sequence = await Sequence.findOne({ _id: req.params.id });

      // Add the new stop to the stops array
      sequence.stops.push({ stopId, stopName, seqNumber });

      // Save the updated sequence document
      await sequence.save();
      console.log(sequence)
      const stops = await Stop.find({}, 'stopName');

      res.render('sequence/addstops', { locals, sequence, stops, messages });
    } else {
      // Handle the case where selectedStop is undefined or null
      res.status(400).send('Invalid selected stop value');
    }

  } catch (err) {
    console.log(err);
  }
}

exports.deleteStopSequence = async (req, res) => {

  try {
    const { seqId, stopId } = req.params;
    // Find the sequence by seqId
    const sequence = await Sequence.findOne({ _id: seqId });
    // Filter out the stop to be deleted from the stops array
    sequence.stops = sequence.stops.filter(stop => stop.stopId !== stopId);
    // Save the updated sequence document
    await sequence.save();
    // Redirect to wherever you want after deleting a stop from the sequence
    res.redirect(`/addstopsequence/${seqId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}



exports.viewSequence = async (req, res) => {

  try {
    const sequence = await Sequence.findOne({ _id: req.params.id })
    const stops = await Stop.find({}, 'stopName');
    const locals = {
      title: "View Sequence Data",
      description: "Smart Journey Planner Admin Panel",
    };

    res.render('sequence/viewsequence', {
      locals,
      sequence,
      stops
    })

  } catch (error) {
    console.log(error);
  }

}


exports.editSequence = async (req, res) => {

  try {
    const sequence = await Sequence.findOne({ _id: req.params.id })
    const stops = await Stop.find({}, 'stopName');
    const locals = {
      title: "View Sequence Data",
      description: "Smart Journey Planner Admin Panel",
    };

    res.render('sequence/editsequence', {
      locals,
      sequence,
      stops
    })

  } catch (error) {
    console.log(error);
  }

}

exports.editPost = async (req, res) => {

  console.log(req.body);

  try {
    await Sequence.findByIdAndUpdate(req.params.id, {
      seqId: req.body.seqId,
      seqName: req.body.seqName,
      updatedAt: Date.now()
    });
    await res.redirect(`/editsequence/${req.params.id}`);

    console.log('redirected');
  } catch (error) {
    console.log(error);
  }

}

exports.deleteSequence = async (req, res) => {
  try {
    await Sequence.deleteOne({ _id: req.params.id });
    res.redirect("/home")
  } catch (error) {
    console.log(error);
  }
}


exports.sequences = async (req, res) => {

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const sequences = await Sequence.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Sequence.count();

    res.render('sequence/sequences', {
      sequences,
      current: page,
      pages: Math.ceil(count / perPage),
    });

  } catch (error) {
    console.log(error);
  }
}

