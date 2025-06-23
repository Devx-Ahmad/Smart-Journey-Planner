exports.about = async (req, res) => {
  const locals = {
    title: 'About',
    description: 'Smart Journey Planner-Road Safety Project',
  };

  try {
    res.render('about', locals);
  } catch (error) {
    console.log(error);
  }
};
