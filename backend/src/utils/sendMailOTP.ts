import { transporter } from '@/utils/mailer';

export const sendEmailOTP = async (email: string, otp: string) => {
  console.log('GMAIL_USER:', process.env.EMAIL_FROM);
  console.log('GMAIL_APP_PASSWORD:', !!process.env.GMAIL_APP_PASSWORD);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification',
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
    });
    console.log(`OTP sent successfully to ${email}`);
  } catch (error) {
    console.error('Email send failed:', error);
    throw new Error('Failed to send email');
  }
};
