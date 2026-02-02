import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nirmaan-dashboard-secret-key-2026';

export async function verifyAuth(request, allowedRoles = []) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies['auth-token'];
    }

    if (!token) {
      return {
        authorized: false,
        status: 401,
        message: 'Authentication required'
      };
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return {
        authorized: false,
        status: 401,
        message: 'Token expired'
      };
    }

    // Check role permissions if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return {
        authorized: false,
        status: 403,
        message: 'Insufficient permissions'
      };
    }

    return {
      authorized: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      }
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      authorized: false,
      status: 401,
      message: 'Invalid token'
    };
  }
}

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.UserId,
      email: user.Email,
      name: user.FullName,
      role: user.Role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function decodeToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
