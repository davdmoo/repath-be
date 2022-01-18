const errorHandler = (err, req, res, next) => {
    console.log(err, "ERROR HANDLER");

    switch (err.name) {
        case "EmailRequired":
            res.status(400).json({ message: "Email is required" })
            break;
        case "PassRequired":
            res.status(400).json({ message: "Password is required" })
            break;
        case "InvalidCredentials":
            res.status(401).json({ message: "Invalid email/password" })
            break;
        default:
            res.status(500).json({ message: "Internal server error" })
            break;
    }
}

module.exports = errorHandler;
