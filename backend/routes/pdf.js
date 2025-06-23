const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public')); // Serve static files from 'public' directory

// Define routes for PDF downloads
app.get('/download-pdf/:id', (req, res) => {
  const pdfId = req.params.id;
  const pdfPath = path.join(__dirname, 'public', `pdf${pdfId}.pdf`);

  // Set appropriate headers for download
  res.download(pdfPath, `pdf${pdfId}.pdf`, err => {
    if (err) {
      // Handle errors, but don't expose them to the client
      res
        .status(500)
        .send('Error occurred, please try again or contact support.');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
