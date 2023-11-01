const admin = require("firebase-admin");
const serviceAccount = require("../dbConfig/service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.storeUserResponse = async (req, res) => {
  try {
    const userId = req.body.userID;
    const qAndA = req.body["Q&A"];

    const data = {
      questions: qAndA,
    };

    await db.collection("responses").doc(userId).set(qAndA);

    const responseMessage = {
      message: "User response added",
      isAdded: true,
      userId: userId,
    };
    res.send(responseMessage);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

exports.validateUserResponse = async (req, res) => {
  try {
    const userId = req.body.userID;
    const qAndA = req.body["Q&A"];

    const responseRef = db.collection("responses").doc(userId);
    const responseDoc = await responseRef.get();

    if (!responseDoc.exists) {
      const errorMessage = {
        message: "User response not found",
        isFound: false,
      };
      return res.send(errorMessage);
    }

    const expectedAnswers = responseDoc.data();

    const isValid = Object.keys(qAndA).every((question) => {
      return qAndA[question] === expectedAnswers[question];
    });

    const responseMessage = {
      message: isValid ? "Answers are correct" : "Answers are incorrect",
      isValid,
    };
    res.send(responseMessage);
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};
