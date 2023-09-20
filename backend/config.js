

const DB_URI = (process.env.NODE_ENV === "test")
    ? "postgresql:///pet_adoption_test"
    : "postgresql:///pet_adoption"


    const SECRET_KEY = process.env.SECRET_KEY || "WHOSTHEBESTBOYYYY"

    const BCRYPT_WORK_FACTOR = 12;

    module.exports = {
        DB_URI,
        SECRET_KEY,
        BCRYPT_WORK_FACTOR
    }