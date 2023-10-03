

const DB_URI = (process.env.NODE_ENV === "test")
    ? "./tests/fakeDB"
    : "postgresql:///pet_adoption"


    const SECRET_KEY = process.env.SECRET_KEY || "AdoptionPotionOcean"

    const BCRYPT_WORK_FACTOR = 12;

    module.exports = {
        DB_URI,
        SECRET_KEY,
        BCRYPT_WORK_FACTOR,
        petfinderApiKey: "OzNeRCuHnTyXKrq8vt1TTSxLNnZZDUnk8H2TlV8QbBVi9ODpKI",
        petfinderApiSecret: "lFFzhZSKtmr4jp3ScOZoO0iVSSrX0PN0pPdrbsnY"
    }
