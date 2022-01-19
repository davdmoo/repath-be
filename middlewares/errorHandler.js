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
        case "NoInput":
            res.status(400).json({ message: "Please Fill The Input Fields" })
            break;
        case "TokenNotFound":
            res.status(401).json({ message: "Access token not found" })
            break;
        case "JsonWebTokenError":
            res.status(401).json({ message: "Invalid token" })
            break;
        case "LikeTwice":
            res.status(400).json({ message: "You have liked this post before" })
            break;
        default:
            res.status(500).json({ message: "Internal server error" })
            break;
    }
}

module.exports = errorHandler;
