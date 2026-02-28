import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmailOTP = async (email: string, otp: string) => {
  console.log(`🔧 Attempting to send OTP to: ${email}`);
  console.log(otp);
  const msg = {
    to: email, // Recipient email address
    from: 'sportfit.hub@gmail.com', // Verified sender email address
    subject: 'Email Verification',
    text: `Your OTP Code is ${otp}. It will expire in 5 minutes.`,
    html: `<div class="bg-gray-100 p-0 m-0">
                    <div class="bg-gray-100 py-10 sm:py-16">
                        <div class="max-w-xl mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-xl">
                            
                            <h1 class="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">
                                Account Verification
                            </h1>

                            <p class="text-base text-gray-700 mb-5">Hello,</p>
                            <p class="text-base text-gray-700 mb-8">
                                We received a request to verify your account. Please use the following One-Time Password (OTP) code:
                            </p>

                            <div class="bg-blue-50 text-blue-800 text-center text-4xl font-extrabold py-5 sm:py-6 rounded-lg tracking-widest my-8">
                               ${otp}
                            </div>

                            <p class="text-sm text-center text-gray-500 mb-10">
                                This code is valid for 5 minutes**.
                            </p>

                            <div class="border-l-4 border-yellow-500 bg-yellow-50 p-4 mt-8">
                                <p class="text-sm italic text-gray-600">
                                    <strong>Security Note:</strong> Do not share this code with anyone. If you did not request this, you can safely ignore this email.
                                </p>
                            </div>


                            <p class="text-base text-gray-700 mt-8 mb-2">Thank you,</p>
                            <p class="text-base font-semibold text-gray-700">The SPORTFITHUB Team</p>

                            <div class="pt-8 mt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                                <p>&copy; SPORTFITHUB_2005. All rights reserved.</p>
                                
                            </div>
                        </div>
                    </div>
                </div>`,
  };

  try {
    const result = await sgMail.send(msg);
    console.log(`OTP sent successfully! to ${email}`);
    return result;
  } catch (error) {
    console.error(`❌ SendGrid email failed for ${email}:`, error);
    if (error.response) {
      return error.response.body;
    }
  }
};
