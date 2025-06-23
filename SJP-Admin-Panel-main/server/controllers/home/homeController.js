const Stop = require('../../models/stop/Stop');
const Sequence = require('../../models/sequence/Sequence');
const Route = require('../../models/route/Route');
const mongoose = require('mongoose');

exports.homepage = async (req, res) => {

  const messages = req.flash('info');

  const locals = {
    title: 'Admin Panel',
    description: 'Smart Journey Planner-Road Safety Project',
  }

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const stops = await Stop.find({}).limit(4);
    const sequences = await Sequence.find({}).limit(4);
    const routes = await Route.find({}).limit(4);

    res.render('index', {
      locals,
      stops,
      sequences,
      routes,
      messages
    });

  } catch (error) {
    console.log(error);
  }
}