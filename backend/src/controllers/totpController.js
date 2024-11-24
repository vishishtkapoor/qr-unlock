const base32Decode = require("base32-decode");
const speakeasy = require("speakeasy");

exports.generateTOTP = (req, res) => {
  try {
    const secretKey="JBSWY3DPEHPK3PXP"
    //const secretKey = process.env.SECRET_KEY;
    const decodedKey = base32Decode(secretKey, "RFC4648");
    const hmacKey = Buffer.from(decodedKey).toString("hex");

    const totpCode = speakeasy.totp({
      secret: hmacKey,
      encoding: "hex",
      step: 30,
    });
    //console.log(totpCode);
    res.json({ totp: totpCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};