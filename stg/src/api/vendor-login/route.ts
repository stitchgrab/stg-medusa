import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Login - StitchGrab</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>
<body class="min-h-screen gradient-bg flex items-center justify-center">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-lg shadow-xl p-8">
            <!-- Header -->
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span class="text-white font-bold text-xl">SG</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-900 mb-2">Vendor Login</h1>
                <p class="text-gray-600">Access your StitchGrab vendor dashboard</p>
            </div>

            <!-- Login Form -->
            <form id="loginForm" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div class="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div class="relative">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <!-- Error/Success Messages -->
                <div id="message" class="hidden p-3 rounded-lg"></div>

                <!-- Login Button -->
                <button
                    type="submit"
                    id="loginBtn"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    Sign In
                </button>

                <!-- Demo Credentials -->
                <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p class="text-sm font-medium text-blue-900 mb-2">Demo Credentials</p>
                    <p class="text-xs text-blue-700">
                        Email: dominique.felix@gmail.com<br>
                        Password: any password (for demo)
                    </p>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            const messageDiv = document.getElementById('message');
            
            // Show loading state
            loginBtn.textContent = 'Signing in...';
            loginBtn.disabled = true;
            messageDiv.className = 'hidden';
            
            try {
                const response = await fetch('/vendors/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Show success message
                    messageDiv.className = 'p-3 bg-green-50 border border-green-200 rounded-lg';
                    messageDiv.innerHTML = '<p class="text-green-600 text-sm">Login successful! Redirecting to dashboard...</p>';
                    
                    // Redirect to vendor dashboard after a short delay
                    setTimeout(() => {
                        window.location.href = '/vendor-dashboard';
                    }, 1000);
                } else {
                    // Show error message
                    messageDiv.className = 'p-3 bg-red-50 border border-red-200 rounded-lg';
                    messageDiv.innerHTML = '<p class="text-red-600 text-sm">' + (data.message || 'Login failed') + '</p>';
                }
            } catch (error) {
                // Show error message
                messageDiv.className = 'p-3 bg-red-50 border border-red-200 rounded-lg';
                messageDiv.innerHTML = '<p class="text-red-600 text-sm">Network error. Please try again.</p>';
            } finally {
                // Reset button state
                loginBtn.textContent = 'Sign In';
                loginBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
  `

  res.setHeader('Content-Type', 'text/html')
  res.send(html)
} 