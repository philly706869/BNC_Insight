const chars =
  "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890`~!@#$%^&*()-_=+[{]};:'\",<.>/?";
const chararr = Array.from(chars);
for (const char of chararr) {
  console.log(Buffer.byteLength(char));
}
console.log(chars.length);
console.log(chararr.length);
