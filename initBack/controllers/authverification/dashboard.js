import User from "../../models/User.js";

const verifyDash = async (req, res) => {
  try {
    const userId = req.userId;

    const findUser = await User.findById(userId).select("-password");

    if (!findUser) {
      return res.status(404).json({
        message: "Unable to load dashboard. Login again.",
      });
    }

    return res.status(200).json({
      name: findUser.name,
      email: findUser.email,
      totalChances: findUser.totalChances,
      totalReport: findUser.totalReport,
      createdAt: findUser.createdAt,
    });
  } catch (error) {
    console.error("Dashboard verification error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default verifyDash;
