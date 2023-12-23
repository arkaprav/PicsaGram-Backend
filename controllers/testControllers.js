const testGet = (req, res) => {
    res.status(200).json({ message: "Welcome to PicsaGram Backend API" });
};

module.exports = { testGet };