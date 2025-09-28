export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('reCAPTCHA secret key not configured');
    return true; // Allow in development if not configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    // Check if successful and score is good (for v3)
    if (data.success && (!data.score || data.score > 0.5)) {
      return true;
    }

    console.error('reCAPTCHA verification failed:', data);
    return false;
  } catch (error) {
    console.error('reCAPTCHA error:', error);
    return false;
  }
}