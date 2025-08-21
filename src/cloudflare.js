import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export async function uploadImageToCloudflare(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const form = new FormData();
  form.append('file', imageBuffer, 'image.jpg');

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_BEARER_TOKEN}`
      },
      body: form
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(`Upload failed: ${JSON.stringify(data.errors)}`);
  }
  return data.result;
}