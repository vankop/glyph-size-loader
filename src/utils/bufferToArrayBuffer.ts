export default function bufferToArrayBuffer(buf: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buf.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < buf.length; ++i) {
    uint8Array[i] = buf[i];
  }

  return arrayBuffer;
}
